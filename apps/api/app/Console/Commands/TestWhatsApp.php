<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\WhatsAppService;
use App\Models\User;
use App\Models\Subscription;
use stdClass;

class TestWhatsApp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:whatsapp {phone} {type=simple : simple, order_buyer, order_seller, payment_success}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test WhatsApp message or notification';

    /**
     * Execute the console command.
     */
    public function handle(WhatsAppService $whatsapp)
    {
        $phone = $this->argument('phone');
        $type = $this->argument('type');

        $this->info("Sending $type message to: $phone");

        $success = false;

        if ($type === 'simple') {
            $success = $whatsapp->send($phone, "Hello from Shifr Asia! 🚀\nThis is a test message.");
        } elseif ($type === 'order_buyer' || $type === 'order_seller') {
            $orderData = [
                'customer_name' => 'Budi Santoso',
                'customer_phone' => $phone,
                'customer_address' => 'Jl. Sudirman No. 1, Jakarta',
                'product_name' => 'Sepatu Nike Air Jordan',
                'total' => 'Rp 2.500.000',
                'store_name' => 'Nike Official Store',
                'order_number' => 'ORD-123456',
                'notes' => 'Tolong dipacking kayu ya gan',
                'seller_phone' => $phone, // Use same phone for testing
            ];

            if ($type === 'order_buyer') {
                $this->info("Simulating Order Confirmation (Buyer)...");
                $success = $whatsapp->sendOrderConfirmationToBuyer($orderData);
            } else {
                $this->info("Simulating New Order Alert (Seller)...");
                $success = $whatsapp->sendNewOrderToSeller($orderData);
            }
        } elseif ($type === 'payment_success') {
            $this->info("Simulating Payment Success...");
            
            // Mock User
            $user = new User([
                'name' => 'Rahmat Hidayat',
                'phone' => $phone,
            ]);
            
            // Mock Payment object
            $payment = new stdClass();
            $payment->id = 99;
            $payment->tier_name = 'Professional';
            $payment->formatted_amount = 'Rp 299.000';
            
            $success = $whatsapp->sendPaymentSuccess($user, $payment);
        }

        if ($success) {
            $this->info('Message sent successfully! ✅');
        } else {
            $this->error('Failed to send message. Check logs for details. ❌');
        }
    }
}
