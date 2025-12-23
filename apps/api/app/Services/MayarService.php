<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\User;
use App\Models\Subscription;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MayarService
{
    private string $apiKey;
    private string $baseUrl;
    private bool $isSandbox;

    public function __construct()
    {
        $this->isSandbox = config('services.mayar.sandbox', true);
        $this->apiKey = config('services.mayar.api_key', '');
        $this->baseUrl = $this->isSandbox 
            ? 'https://api.mayar.club/hl/v1' 
            : 'https://api.mayar.id/hl/v1';
    }

    /**
     * Create a payment link for subscription upgrade.
     */
    public function createPaymentLink(User $user, string $tier, string $period = 'monthly'): ?Payment
    {
        $tierConfig = Subscription::$tiers[$tier] ?? null;
        
        if (!$tierConfig) {
            Log::error("MayarService: Invalid tier {$tier}");
            return null;
        }

        // Calculate amount based on period
        $amount = $tierConfig['price'];
        if ($period === 'yearly') {
            $amount = $amount * 12 * 0.8; // 20% discount for yearly
        }

        $description = "Langganan {$tierConfig['name']} - Shifr Asia";
        $redirectUrl = config('app.frontend_url', 'http://localhost:3000') . '/dashboard/payment/callback';

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/payment/create', [
                'name' => $user->name,
                'email' => $user->email,
                'mobile' => $user->phone ?? '',
                'amount' => $amount,
                'description' => $description,
                'redirectUrl' => $redirectUrl,
                'expiredAt' => now()->addHours(24)->toISOString(),
                'metadata' => [
                    'user_id' => $user->id,
                    'tier' => $tier,
                    'period' => $period,
                ],
            ]);

            if ($response->successful()) {
                $data = $response->json('data');

                // Create payment record
                $payment = Payment::create([
                    'user_id' => $user->id,
                    'mayar_payment_id' => $data['id'] ?? Str::uuid(),
                    'mayar_link_id' => $data['linkId'] ?? null,
                    'mayar_link_url' => $data['link'] ?? null,
                    'amount' => $amount,
                    'tier' => $tier,
                    'period' => $period,
                    'status' => 'pending',
                    'customer_name' => $user->name,
                    'customer_email' => $user->email,
                    'customer_phone' => $user->phone,
                    'metadata' => $data,
                    'expires_at' => now()->addHours(24),
                ]);

                return $payment;
            }

            Log::error('MayarService: Failed to create payment', [
                'response' => $response->json(),
                'status' => $response->status(),
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('MayarService: Exception', [
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Verify payment status from Mayar.
     */
    public function verifyPayment(string $paymentId): ?array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
            ])->get($this->baseUrl . '/payment/' . $paymentId);

            if ($response->successful()) {
                return $response->json('data');
            }

            return null;
        } catch (\Exception $e) {
            Log::error('MayarService: Verify failed', [
                'payment_id' => $paymentId,
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Handle webhook from Mayar.
     */
    public function handleWebhook(array $payload): bool
    {
        $event = $payload['event'] ?? '';
        $data = $payload['data'] ?? [];

        Log::info('MayarService: Webhook received', [
            'event' => $event,
            'data' => $data,
        ]);

        if ($event === 'payment.received') {
            return $this->handlePaymentReceived($data);
        }

        return true;
    }

    /**
     * Handle payment.received event.
     */
    private function handlePaymentReceived(array $data): bool
    {
        $paymentId = $data['id'] ?? null;
        
        if (!$paymentId) {
            Log::error('MayarService: No payment ID in webhook');
            return false;
        }

        // Find payment by Mayar payment ID
        $payment = Payment::where('mayar_payment_id', $paymentId)->first();

        if (!$payment) {
            // Try to find by link ID
            $linkId = $data['linkId'] ?? null;
            $payment = Payment::where('mayar_link_id', $linkId)->first();
        }

        if (!$payment) {
            Log::error('MayarService: Payment not found', ['payment_id' => $paymentId]);
            return false;
        }

        // Mark as paid
        $payment->markAsPaid($data);

        Log::info('MayarService: Payment marked as paid', [
            'payment_id' => $payment->id,
            'mayar_id' => $paymentId,
        ]);

        return true;
    }

    /**
     * Verify webhook signature (if Mayar provides one).
     */
    public function verifyWebhookSignature(string $payload, string $signature): bool
    {
        $secret = config('services.mayar.webhook_secret', '');
        
        if (empty($secret)) {
            // No secret configured, skip verification
            return true;
        }

        $expectedSignature = hash_hmac('sha256', $payload, $secret);
        
        return hash_equals($expectedSignature, $signature);
    }
}
