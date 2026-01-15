<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\User;
use App\Models\Subscription;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DuitkuService
{
    private string $merchantCode;
    private string $apiKey;
    private string $baseUrl;
    private bool $isSandbox;

    public function __construct()
    {
        $this->isSandbox = config('services.duitku.sandbox', true);
        $this->merchantCode = config('services.duitku.merchant_code', '');
        $this->apiKey = config('services.duitku.api_key', '');
        $this->baseUrl = $this->isSandbox 
            ? 'https://sandbox.duitku.com/webapi/api/merchant' 
            : 'https://passport.duitku.com/webapi/api/merchant';
    }

    /**
     * Get available payment methods from Duitku.
     */
    public function getPaymentMethods(int $amount): ?array
    {
        $datetime = date('Y-m-d H:i:s');
        $signature = hash('sha256', $this->merchantCode . $amount . $datetime . $this->apiKey);

        try {
            $response = Http::post($this->baseUrl . '/paymentmethod/getpaymentmethod', [
                'merchantcode' => $this->merchantCode,
                'amount' => $amount,
                'datetime' => $datetime,
                'signature' => $signature,
            ]);

            if ($response->successful()) {
                return $response->json('paymentFee');
            }

            Log::error('DuitkuService: Failed to get payment methods', [
                'response' => $response->json(),
            ]);
            return null;
        } catch (\Exception $e) {
            Log::error('DuitkuService: Exception', ['message' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Create a payment/invoice for subscription upgrade.
     */
    public function createPaymentLink(User $user, string $tier, string $period = 'monthly', string $paymentMethod = 'VC'): ?Payment
    {
        $tierConfig = Subscription::$tiers[$tier] ?? null;
        
        if (!$tierConfig) {
            Log::error("DuitkuService: Invalid tier {$tier}");
            return null;
        }

        // Calculate amount based on period
        $amount = $tierConfig['price'];
        if ($period === 'yearly') {
            $amount = $amount * 12 * 0.8; // 20% discount for yearly
        }

        $merchantOrderId = 'SHIFR-' . Str::upper(Str::random(8)) . '-' . time();
        $productDetails = "Langganan {$tierConfig['name']} - Shifr Asia";
        $callbackUrl = config('app.url') . '/api/payment/webhook/duitku';
        $returnUrl = config('app.frontend_url', 'http://localhost:3000') . '/dashboard/payment/callback';
        $expiryPeriod = 1440; // 24 hours in minutes

        // Create signature
        $signature = md5(
            $this->merchantCode . 
            $merchantOrderId . 
            $amount . 
            $this->apiKey
        );

        try {
            $response = Http::post($this->baseUrl . '/v2/inquiry', [
                'merchantCode' => $this->merchantCode,
                'paymentAmount' => $amount,
                'paymentMethod' => $paymentMethod,
                'merchantOrderId' => $merchantOrderId,
                'productDetails' => $productDetails,
                'customerVaName' => $user->name,
                'email' => $user->email,
                'phoneNumber' => $user->phone ?? '',
                'callbackUrl' => $callbackUrl,
                'returnUrl' => $returnUrl,
                'expiryPeriod' => $expiryPeriod,
                'signature' => $signature,
            ]);

            if ($response->successful() && $response->json('statusCode') === '00') {
                $data = $response->json();

                // Create payment record
                $payment = Payment::create([
                    'user_id' => $user->id,
                    'duitku_reference' => $data['reference'] ?? null,
                    'duitku_merchant_order_id' => $merchantOrderId,
                    'duitku_payment_url' => $data['paymentUrl'] ?? null,
                    'duitku_va_number' => $data['vaNumber'] ?? null,
                    'duitku_qr_string' => $data['qrString'] ?? null,
                    'amount' => $amount,
                    'tier' => $tier,
                    'period' => $period,
                    'payment_method' => $paymentMethod,
                    'payment_gateway' => 'duitku',
                    'status' => 'pending',
                    'customer_name' => $user->name,
                    'customer_email' => $user->email,
                    'customer_phone' => $user->phone,
                    'metadata' => $data,
                    'expires_at' => now()->addMinutes($expiryPeriod),
                ]);

                return $payment;
            }

            Log::error('DuitkuService: Failed to create payment', [
                'response' => $response->json(),
                'status' => $response->status(),
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('DuitkuService: Exception', [
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Check transaction status.
     */
    public function checkTransactionStatus(string $merchantOrderId): ?array
    {
        $signature = md5($this->merchantCode . $merchantOrderId . $this->apiKey);

        try {
            $response = Http::post($this->baseUrl . '/transactionStatus', [
                'merchantCode' => $this->merchantCode,
                'merchantOrderId' => $merchantOrderId,
                'signature' => $signature,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::error('DuitkuService: Check status failed', [
                'merchant_order_id' => $merchantOrderId,
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Handle webhook callback from Duitku.
     */
    public function handleCallback(array $payload): ?Payment
    {
        $merchantCode = $payload['merchantCode'] ?? '';
        $amount = $payload['amount'] ?? 0;
        $merchantOrderId = $payload['merchantOrderId'] ?? '';
        $productDetail = $payload['productDetail'] ?? '';
        $additionalParam = $payload['additionalParam'] ?? '';
        $paymentCode = $payload['paymentCode'] ?? '';
        $resultCode = $payload['resultCode'] ?? '';
        $merchantUserId = $payload['merchantUserId'] ?? '';
        $reference = $payload['reference'] ?? '';
        $signature = $payload['signature'] ?? '';

        // Verify signature
        $expectedSignature = md5(
            $merchantCode . 
            $amount . 
            $merchantOrderId . 
            $this->apiKey
        );

        if ($signature !== $expectedSignature) {
            Log::warning('DuitkuService: Invalid callback signature');
            return null;
        }

        Log::info('DuitkuService: Callback received', [
            'merchantOrderId' => $merchantOrderId,
            'resultCode' => $resultCode,
            'reference' => $reference,
        ]);

        // Find payment
        $payment = Payment::where('duitku_merchant_order_id', $merchantOrderId)->first();

        if (!$payment) {
            Log::error('DuitkuService: Payment not found', [
                'merchantOrderId' => $merchantOrderId,
            ]);
            return null;
        }

        // resultCode 00 = Success, 01 = Pending
        if ($resultCode === '00') {
            $payment->markAsPaid([
                'duitku_reference' => $reference,
                'result_code' => $resultCode,
            ]);

            Log::info('DuitkuService: Payment marked as paid', [
                'payment_id' => $payment->id,
                'reference' => $reference,
            ]);
        }

        return $payment;
    }
}
