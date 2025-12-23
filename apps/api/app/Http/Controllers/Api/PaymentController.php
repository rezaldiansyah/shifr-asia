<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use App\Services\MayarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    private MayarService $mayarService;

    public function __construct(MayarService $mayarService)
    {
        $this->mayarService = $mayarService;
    }

    /**
     * Create checkout session for subscription upgrade.
     */
    public function checkout(Request $request): JsonResponse
    {
        $request->validate([
            'tier' => 'required|string|in:starter,growth,pro',
            'period' => 'sometimes|string|in:monthly,yearly',
        ]);

        $user = $request->user();
        $tier = $request->tier;
        $period = $request->period ?? 'monthly';

        // Check if user already has this tier
        $currentSubscription = Subscription::where('user_id', $user->id)
            ->active()
            ->first();

        if ($currentSubscription && $currentSubscription->tier === $tier) {
            return response()->json([
                'message' => 'Anda sudah berlangganan tier ini',
            ], 400);
        }

        // Check for pending payment
        $pendingPayment = Payment::where('user_id', $user->id)
            ->where('tier', $tier)
            ->where('status', 'pending')
            ->where('expires_at', '>', now())
            ->first();

        if ($pendingPayment && $pendingPayment->mayar_link_url) {
            return response()->json([
                'message' => 'Anda memiliki pembayaran pending. Silakan lanjutkan pembayaran.',
                'payment' => [
                    'id' => $pendingPayment->id,
                    'checkout_url' => $pendingPayment->mayar_link_url,
                    'amount' => $pendingPayment->amount,
                    'formatted_amount' => $pendingPayment->formatted_amount,
                    'tier' => $pendingPayment->tier,
                    'tier_name' => $pendingPayment->tier_name,
                    'expires_at' => $pendingPayment->expires_at,
                ],
            ]);
        }

        // Create new payment via Mayar
        $payment = $this->mayarService->createPaymentLink($user, $tier, $period);

        if (!$payment) {
            return response()->json([
                'message' => 'Gagal membuat link pembayaran. Silakan coba lagi.',
            ], 500);
        }

        return response()->json([
            'message' => 'Link pembayaran berhasil dibuat',
            'payment' => [
                'id' => $payment->id,
                'checkout_url' => $payment->mayar_link_url,
                'amount' => $payment->amount,
                'formatted_amount' => $payment->formatted_amount,
                'tier' => $payment->tier,
                'tier_name' => $payment->tier_name,
                'expires_at' => $payment->expires_at,
            ],
        ]);
    }

    /**
     * Handle callback from Mayar (redirect after payment).
     */
    public function callback(Request $request): JsonResponse
    {
        $paymentId = $request->query('payment_id') ?? $request->query('id');
        $status = $request->query('status');

        if (!$paymentId) {
            return response()->json([
                'message' => 'Payment ID tidak ditemukan',
            ], 400);
        }

        $payment = Payment::where('mayar_payment_id', $paymentId)
            ->orWhere('id', $paymentId)
            ->first();

        if (!$payment) {
            return response()->json([
                'message' => 'Pembayaran tidak ditemukan',
            ], 404);
        }

        // Verify payment status from Mayar
        $mayarData = $this->mayarService->verifyPayment($payment->mayar_payment_id);

        if ($mayarData && ($mayarData['status'] ?? '') === 'paid') {
            if ($payment->status !== 'paid') {
                $payment->markAsPaid($mayarData);
            }
        }

        return response()->json([
            'payment' => [
                'id' => $payment->id,
                'status' => $payment->status,
                'is_paid' => $payment->is_paid,
                'tier' => $payment->tier,
                'tier_name' => $payment->tier_name,
                'amount' => $payment->amount,
                'formatted_amount' => $payment->formatted_amount,
                'paid_at' => $payment->paid_at,
            ],
        ]);
    }

    /**
     * Handle Mayar webhook.
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->all();
        $signature = $request->header('X-Mayar-Signature', '');

        Log::info('PaymentController: Webhook received', [
            'payload' => $payload,
        ]);

        // Verify signature if configured
        if (!$this->mayarService->verifyWebhookSignature(
            $request->getContent(),
            $signature
        )) {
            Log::warning('PaymentController: Invalid webhook signature');
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        // Process webhook
        $success = $this->mayarService->handleWebhook($payload);

        return response()->json([
            'message' => $success ? 'Webhook processed' : 'Webhook processing failed',
        ], $success ? 200 : 400);
    }

    /**
     * Get user's payment history.
     */
    public function history(Request $request): JsonResponse
    {
        $user = $request->user();

        $payments = Payment::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'tier' => $payment->tier,
                    'tier_name' => $payment->tier_name,
                    'amount' => $payment->amount,
                    'formatted_amount' => $payment->formatted_amount,
                    'status' => $payment->status,
                    'is_paid' => $payment->is_paid,
                    'paid_at' => $payment->paid_at,
                    'created_at' => $payment->created_at,
                ];
            });

        return response()->json([
            'payments' => $payments,
        ]);
    }
}
