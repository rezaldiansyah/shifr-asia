<?php

namespace App\Services;

use App\Models\User;
use App\Models\Order;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected WhatsAppService $whatsAppService;
    protected EmailService $emailService;

    public function __construct(WhatsAppService $whatsAppService, EmailService $emailService)
    {
        $this->whatsAppService = $whatsAppService;
        $this->emailService = $emailService;
    }

    // ==========================================
    // STORE ORDER NOTIFICATIONS
    // ==========================================

    /**
     * Notify seller and buyer about new order
     * - WhatsApp: Buyer + Seller
     * - Email: Buyer (order confirmation/receipt)
     */
    public function notifyNewOrder(Order $order): array
    {
        $order->load(['product', 'store.user']);
        
        $orderData = [
            'order_number' => $order->order_number,
            'customer_name' => $order->customer_name,
            'customer_phone' => $order->customer_phone,
            'customer_email' => $order->customer_email ?? null,
            'customer_address' => $order->customer_address,
            'notes' => $order->notes,
            'product_name' => $order->product->name ?? 'Produk',
            'quantity' => $order->quantity ?? 1,
            'total' => $order->formatted_total,
            'store_name' => $order->store->name ?? 'Toko',
            'seller_phone' => $order->store->settings['whatsapp_number'] ?? '',
        ];

        $results = [
            'wa_buyer' => false,
            'wa_seller' => false,
            'email_buyer' => false,
        ];

        // Send WhatsApp to buyer
        $results['wa_buyer'] = $this->whatsAppService->sendOrderConfirmationToBuyer($orderData);

        // Send WhatsApp to seller
        $results['wa_seller'] = $this->whatsAppService->sendNewOrderToSeller($orderData);

        // Send Email to buyer (if email provided)
        if (!empty($orderData['customer_email'])) {
            $results['email_buyer'] = $this->emailService->sendOrderConfirmation($orderData);
        }

        // Update order with notification status
        $order->update([
            'wa_sent_buyer' => $results['wa_buyer'],
            'wa_sent_seller' => $results['wa_seller'],
            'email_sent_buyer' => $results['email_buyer'],
            'wa_sent_at' => now(),
        ]);

        Log::info('NotificationService: New order notifications sent', [
            'order_id' => $order->id,
            'results' => $results,
        ]);

        return $results;
    }

    /**
     * Notify buyer about order status change
     * - WhatsApp: Buyer only
     */
    public function notifyOrderStatusChange(Order $order): bool
    {
        $order->load(['product', 'store']);

        $message = $this->getOrderStatusMessage($order);
        
        return $this->whatsAppService->send($order->customer_phone, $message);
    }

    /**
     * Get order status change message
     */
    private function getOrderStatusMessage(Order $order): string
    {
        $statusMessages = [
            'confirmed' => "✅ *Pesanan Dikonfirmasi*\n\nHai {$order->customer_name}, pesananmu #{$order->order_number} sudah dikonfirmasi oleh penjual.\n\nPenjual akan segera menghubungimu untuk detail pembayaran.\n\n- {$order->store->name}",
            
            'paid' => "💰 *Pembayaran Diterima*\n\nHai {$order->customer_name}, pembayaran untuk pesanan #{$order->order_number} sudah diterima.\n\nPenjual sedang memproses pesananmu!\n\n- {$order->store->name}",
            
            'shipped' => "🚚 *Pesanan Dikirim*\n\nHai {$order->customer_name}, pesananmu #{$order->order_number} sudah dikirim!\n\nMohon tunggu hingga paket tiba.\n\n- {$order->store->name}",
            
            'completed' => "🎉 *Pesanan Selesai*\n\nHai {$order->customer_name}, pesananmu #{$order->order_number} sudah selesai.\n\nTerima kasih sudah berbelanja!\n\n- {$order->store->name}",
            
            'cancelled' => "❌ *Pesanan Dibatalkan*\n\nHai {$order->customer_name}, pesananmu #{$order->order_number} dibatalkan.\n\nHubungi penjual jika ada pertanyaan.\n\n- {$order->store->name}",
        ];

        return $statusMessages[$order->status] ?? "📦 Status pesanan #{$order->order_number}: {$order->status_label}";
    }

    // ==========================================
    // SUBSCRIPTION NOTIFICATIONS
    // ==========================================

    /**
     * Notify user about subscription activation
     * - WhatsApp + Email
     */
    public function notifySubscriptionActivated(User $user, $subscription, $payment = null): array
    {
        $results = [
            'whatsapp' => false,
            'email' => false,
        ];

        // Send WhatsApp
        if ($user->phone) {
            $results['whatsapp'] = $this->whatsAppService->sendSubscriptionActivated($user, $subscription);
        }

        // Send Email
        $results['email'] = $this->emailService->sendSubscriptionActivated($user, $subscription, $payment);

        Log::info('NotificationService: Subscription activated notifications sent', [
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
            'results' => $results,
        ]);

        return $results;
    }

    /**
     * Notify user about successful payment
     * - WhatsApp + Email (Invoice)
     */
    public function notifyPaymentSuccess(User $user, $payment): array
    {
        $results = [
            'whatsapp' => false,
            'email' => false,
        ];

        // Send WhatsApp
        if ($user->phone) {
            $results['whatsapp'] = $this->whatsAppService->sendPaymentSuccess($user, $payment);
        }

        // Send Email Invoice
        $results['email'] = $this->emailService->sendInvoice($user, $payment);

        Log::info('NotificationService: Payment success notifications sent', [
            'user_id' => $user->id,
            'payment_id' => $payment->id,
            'results' => $results,
        ]);

        return $results;
    }

    /**
     * Notify user about subscription expiring soon
     * - WhatsApp (3 days or less) + Email (7, 3, 1 days)
     */
    public function notifySubscriptionExpiring(User $user, $subscription, int $daysRemaining): array
    {
        $results = [
            'whatsapp' => false,
            'email' => false,
        ];

        // Always send email for 7, 3, 1 day reminders
        $results['email'] = $this->emailService->sendSubscriptionReminder($user, $subscription, $daysRemaining);

        // Send WhatsApp only for 3 days or less (more urgent)
        if ($daysRemaining <= 3 && $user->phone) {
            $results['whatsapp'] = $this->whatsAppService->sendSubscriptionReminder($user, $subscription, $daysRemaining);
        }

        Log::info('NotificationService: Subscription reminder sent', [
            'user_id' => $user->id,
            'days_remaining' => $daysRemaining,
            'results' => $results,
        ]);

        return $results;
    }

    // ==========================================
    // AUTHENTICATION NOTIFICATIONS
    // ==========================================

    /**
     * Send welcome notification after registration
     * - Email only (WhatsApp optional if phone provided)
     */
    public function notifyWelcome(User $user): array
    {
        $results = [
            'whatsapp' => false,
            'email' => false,
        ];

        // Send Email
        $results['email'] = $this->emailService->sendWelcome($user);

        // Optionally send WhatsApp welcome
        if ($user->phone) {
            $results['whatsapp'] = $this->whatsAppService->sendWelcome($user);
        }

        Log::info('NotificationService: Welcome notifications sent', [
            'user_id' => $user->id,
            'results' => $results,
        ]);

        return $results;
    }

    /**
     * Send email verification
     * - Email only
     */
    public function sendEmailVerification(User $user, string $token): bool
    {
        return $this->emailService->sendEmailVerification($user, $token);
    }

    /**
     * Send password reset email
     * - Email only
     */
    public function sendPasswordReset(User $user, string $token): bool
    {
        return $this->emailService->sendPasswordReset($user, $token);
    }
}
