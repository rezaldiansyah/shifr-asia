<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use App\Services\MayarService;
use App\Services\DuitkuService;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    private MayarService $mayarService;
    private DuitkuService $duitkuService;
    private NotificationService $notificationService;
    
    // Active payment gateway: 'duitku' or 'mayar'
    private string $activeGateway = 'mayar';

    public function __construct(
        MayarService $mayarService, 
        DuitkuService $duitkuService,
        NotificationService $notificationService
    ) {
        $this->mayarService = $mayarService;
        $this->duitkuService = $duitkuService;
        $this->notificationService = $notificationService;
    }

    /**
     * Get available payment methods (Duitku only).
     * Not used for Mayar implementation as it redirects to Mayar hosted page.
     */
    public function paymentMethods(Request $request): JsonResponse
    {
        // Mayar handles payment methods on their checkout page
        return response()->json([
            'payment_methods' => [],
            'message' => 'Payment methods selection is handled by Mayar checkout page.'
        ]);
        
        /* Duitku Implementation - Temporarily disabled
        $request->validate([
            'amount' => 'required|numeric|min:10000',
        ]);

        $methods = $this->duitkuService->getPaymentMethods((int) $request->amount);

        return response()->json([
            'payment_methods' => $methods ?? [],
        ]);
        */
    }

    /**
     * Create checkout session for subscription upgrade.
     */
    public function checkout(Request $request): JsonResponse
    {
        $request->validate([
            'tier' => 'required|string|in:starter,growth,pro',
            'period' => 'sometimes|string|in:monthly,yearly',
            // 'payment_method' => 'sometimes|string', // Not needed for Mayar
        ]);

        $user = $request->user();
        $tier = $request->tier;
        $period = $request->period ?? 'monthly';
        // $paymentMethod = $request->payment_method ?? 'BT'; 

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
            ->where('payment_gateway', $this->activeGateway) // Only reuse if same gateway
            ->first();

        if ($pendingPayment) {
            $checkoutUrl = $pendingPayment->mayar_link_url ?? $pendingPayment->duitku_payment_url;
            if ($checkoutUrl) {
                return response()->json([
                    'message' => 'Anda memiliki pembayaran pending. Silakan lanjutkan pembayaran.',
                    'payment' => [
                        'id' => $pendingPayment->id,
                        'checkout_url' => $checkoutUrl,
                        'amount' => $pendingPayment->amount,
                        'formatted_amount' => $pendingPayment->formatted_amount,
                        'tier' => $pendingPayment->tier,
                        'tier_name' => $pendingPayment->tier_name,
                        'expires_at' => $pendingPayment->expires_at,
                        'gateway' => $pendingPayment->payment_gateway ?? 'mayar',
                    ],
                ]);
            }
        }

        // Create new payment based on active gateway
        $payment = null;

        if ($this->activeGateway === 'mayar') {
             $payment = $this->mayarService->createPaymentLink($user, $tier, $period);
        } else {
            // Duitku (commented out for now)
            // $payment = $this->duitkuService->createPaymentLink($user, $tier, $period, $paymentMethod);
            return response()->json([
                'message' => 'Duitku payment gateway sementara tidak aktif. Gunakan Mayar.',
            ], 503);
        }

        if (!$payment) {
            return response()->json([
                'message' => 'Gagal membuat link pembayaran. Silakan coba lagi.',
            ], 500);
        }

        $checkoutUrl = $payment->mayar_link_url ?? $payment->duitku_payment_url;

        return response()->json([
            'message' => 'Link pembayaran berhasil dibuat',
            'payment' => [
                'id' => $payment->id,
                'checkout_url' => $checkoutUrl,
                // 'va_number' => $payment->duitku_va_number ?? null,
                // 'qr_string' => $payment->duitku_qr_string ?? null,
                'amount' => $payment->amount,
                'formatted_amount' => $payment->formatted_amount,
                'tier' => $payment->tier,
                'tier_name' => $payment->tier_name,
                'expires_at' => $payment->expires_at,
                'gateway' => $payment->payment_gateway ?? $this->activeGateway,
            ],
        ]);
    }

    /**
     * Handle callback from payment gateway (redirect after payment).
     */
    public function callback(Request $request): JsonResponse
    {
        $paymentId = $request->query('payment_id') ?? $request->query('id') ?? $request->query('merchantOrderId');
        $status = $request->query('status') ?? $request->query('resultCode');

        if (!$paymentId) {
            return response()->json([
                'message' => 'Payment ID tidak ditemukan',
            ], 400);
        }

        // Try to find payment
        $payment = Payment::where('mayar_payment_id', $paymentId)
            ->orWhere('duitku_merchant_order_id', $paymentId)
            ->orWhere('id', $paymentId)
            ->first();

        if (!$payment) {
            return response()->json([
                'message' => 'Pembayaran tidak ditemukan',
            ], 404);
        }

        // Verify payment status based on gateway
        if ($payment->payment_gateway === 'duitku' || $payment->duitku_merchant_order_id) {
            $statusData = $this->duitkuService->checkTransactionStatus($payment->duitku_merchant_order_id);
            
            if ($statusData && ($statusData['statusCode'] ?? '') === '00') {
                if ($payment->status !== 'paid') {
                    $payment->markAsPaid($statusData);
                    $this->notificationService->notifyPaymentSuccess($payment->user, $payment);
                }
            }
        } else {
            // Mayar verification
            Log::info('PaymentController: Verifying Mayar payment', [
                'payment_id' => $payment->id,
                'mayar_payment_id' => $payment->mayar_payment_id,
            ]);
            
            $mayarData = $this->mayarService->verifyPayment($payment->mayar_payment_id);

            Log::info('PaymentController: Mayar verification result', [
                'data' => $mayarData,
                'status' => $mayarData['status'] ?? 'unknown',
            ]);

            if ($mayarData && ($mayarData['status'] ?? '') === 'paid') {
                if ($payment->status !== 'paid') {
                    Log::info('PaymentController: Marking payment as paid', ['payment_id' => $payment->id]);
                    $payment->markAsPaid($mayarData);
                    $this->notificationService->notifyPaymentSuccess($payment->user, $payment);
                }
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
                'gateway' => $payment->payment_gateway ?? 'mayar',
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

        Log::info('PaymentController: Mayar Webhook received', [
            'payload' => $payload,
        ]);

        // Verify signature if configured
        if (!$this->mayarService->verifyWebhookSignature(
            $request->getContent(),
            $signature
        )) {
            Log::warning('PaymentController: Invalid Mayar webhook signature');
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        // Process webhook
        $payment = $this->mayarService->handleWebhook($payload);
        $success = $payment !== null;

        if ($payment) {
            // Send notification
            $this->notificationService->notifyPaymentSuccess($payment->user, $payment);
        }

        return response()->json([
            'message' => $success ? 'Webhook processed' : 'Webhook processing failed',
        ], $success ? 200 : 400);
    }

    /**
     * Handle Duitku webhook/callback.
     */
    public function webhookDuitku(Request $request): JsonResponse
    {
        $payload = $request->all();

        Log::info('PaymentController: Duitku Callback received', [
            'payload' => $payload,
        ]);

        $payment = $this->duitkuService->handleCallback($payload);
        $success = $payment !== null;

        if ($payment && $payment->is_paid) {
            $this->notificationService->notifyPaymentSuccess($payment->user, $payment);
        }

        return response()->json([
            'message' => $success ? 'Callback processed' : 'Callback processing failed',
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
                    'gateway' => $payment->payment_gateway ?? 'mayar',
                ];
            });

        return response()->json([
            'payments' => $payments,
        ]);
    }

    /**
     * Validate a voucher code for subscription checkout
     */
    public function validateVoucher(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string|max:50',
            'tier' => 'required|string|in:starter,growth,pro',
            'amount' => 'required|numeric|min:0',
        ]);

        $voucher = \App\Models\SubscriptionVoucher::where('code', strtoupper($request->code))->first();

        if (!$voucher) {
            return response()->json([
                'valid' => false,
                'message' => 'Kode voucher tidak ditemukan',
            ], 404);
        }

        $error = $voucher->validateFor($request->tier, Auth::id());
        if ($error) {
            return response()->json([
                'valid' => false,
                'message' => $error,
            ], 422);
        }

        $discount = $voucher->calculateDiscount($request->amount);
        $finalAmount = max(0, $request->amount - $discount);

        return response()->json([
            'valid' => true,
            'voucher' => [
                'id' => $voucher->id,
                'code' => $voucher->code,
                'name' => $voucher->name,
                'type' => $voucher->type,
                'value' => $voucher->value,
                'formatted_value' => $voucher->formatted_value,
            ],
            'discount' => $discount,
            'formatted_discount' => 'Rp ' . number_format($discount, 0, ',', '.'),
            'original_amount' => $request->amount,
            'final_amount' => $finalAmount,
            'formatted_final_amount' => 'Rp ' . number_format($finalAmount, 0, ',', '.'),
        ]);
    }
}
