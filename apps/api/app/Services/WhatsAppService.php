<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.dripsender.id/send';

    public function __construct()
    {
        $this->apiKey = config('services.dripsender.api_key', '');
    }

    /**
     * Format phone number to international format (628xxx)
     */
    protected function formatPhone(string $phone): string
    {
        // Remove non-numeric characters
        $phone = preg_replace('/\D/', '', $phone);
        
        // Convert 08xxx to 628xxx
        if (str_starts_with($phone, '0')) {
            $phone = '62' . substr($phone, 1);
        }
        
        // Add 62 if not present
        if (!str_starts_with($phone, '62')) {
            $phone = '62' . $phone;
        }
        
        return $phone;
    }

    /**
     * Send WhatsApp message
     */
    public function send(string $phone, string $message): bool
    {
        if (empty($this->apiKey)) {
            Log::warning('WhatsApp API key not configured');
            return false;
        }

        try {
            $response = Http::post($this->baseUrl, [
                'api_key' => $this->apiKey,
                'phone' => $this->formatPhone($phone),
                'text' => $message,
            ]);

            if ($response->successful()) {
                Log::info('WhatsApp message sent successfully', [
                    'phone' => $phone,
                ]);
                return true;
            }

            Log::error('WhatsApp send failed', [
                'phone' => $phone,
                'response' => $response->body(),
            ]);
            return false;

        } catch (\Exception $e) {
            Log::error('WhatsApp send exception', [
                'phone' => $phone,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Send order confirmation to buyer
     */
    public function sendOrderConfirmationToBuyer(array $orderData): bool
    {
        $message = "🛍️ *Pesanan Berhasil!*\n\n";
        $message .= "Hai {$orderData['customer_name']}, pesananmu sudah diterima:\n\n";
        $message .= "📦 *{$orderData['product_name']}*\n";
        $message .= "💰 {$orderData['total']}\n";
        $message .= "🏪 {$orderData['store_name']}\n\n";
        $message .= "No. Pesanan: *{$orderData['order_number']}*\n\n";
        $message .= "Penjual akan segera menghubungimu.\n\n";
        $message .= "Terima kasih! 🙏\n";
        $message .= "- Shifr Asia";

        return $this->send($orderData['customer_phone'], $message);
    }

    /**
     * Send new order notification to seller
     */
    public function sendNewOrderToSeller(array $orderData): bool
    {
        $message = "🔔 *Pesanan Baru!*\n\n";
        $message .= "Ada pesanan dari:\n";
        $message .= "👤 {$orderData['customer_name']}\n";
        $message .= "📱 {$orderData['customer_phone']}\n";
        
        if (!empty($orderData['customer_address'])) {
            $message .= "📍 {$orderData['customer_address']}\n";
        }
        
        $message .= "\n📦 Produk: *{$orderData['product_name']}*\n";
        $message .= "💰 Harga: {$orderData['total']}\n";
        $message .= "📝 No. Pesanan: {$orderData['order_number']}\n";
        
        if (!empty($orderData['notes'])) {
            $message .= "\n💬 Catatan: {$orderData['notes']}\n";
        }
        
        $message .= "\nSegera hubungi pembeli! 📞";

        return $this->send($orderData['seller_phone'], $message);
    }
}
