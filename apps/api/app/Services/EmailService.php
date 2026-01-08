<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;
use App\Models\User;

class EmailService
{
    protected string $apiKey;
    protected string $fromEmail;
    protected string $fromName;
    protected string $baseUrl = 'https://api.resend.com';

    public function __construct()
    {
        $this->apiKey = config('services.resend.key', '');
        $this->fromName = config('mail.from.name', 'Shifr Asia');
        
        // Check if domain is verified (set RESEND_DOMAIN_VERIFIED=true after verification)
        $domainVerified = config('services.resend.domain_verified', false);
        
        if ($domainVerified) {
            // Use verified domain: mail.shifr.asia
            $this->fromEmail = config('mail.from.address', 'noreply@mail.shifr.asia');
        } else {
            // Fallback to Resend default sender
            $this->fromEmail = 'onboarding@resend.dev';
        }
    }

    /**
     * Send email using Resend API
     */
    public function send(string $to, string $subject, string $html, ?string $text = null): bool
    {
        if (empty($this->apiKey)) {
            Log::warning('EmailService: Resend API key not configured');
            return false;
        }

        try {
            $payload = [
                'from' => "{$this->fromName} <{$this->fromEmail}>",
                'to' => [$to],
                'subject' => $subject,
                'html' => $html,
            ];

            if ($text) {
                $payload['text'] = $text;
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/emails', $payload);

            if ($response->successful()) {
                Log::info('EmailService: Email sent successfully', [
                    'to' => $to,
                    'subject' => $subject,
                    'resend_id' => $response->json('id'),
                ]);
                return true;
            }

            Log::error('EmailService: Failed to send email', [
                'to' => $to,
                'subject' => $subject,
                'status' => $response->status(),
                'response' => $response->json(),
            ]);
            return false;

        } catch (\Exception $e) {
            Log::error('EmailService: Exception', [
                'to' => $to,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Send email using Blade template
     */
    public function sendTemplate(string $to, string $subject, string $template, array $data = []): bool
    {
        try {
            $html = View::make("emails.{$template}", $data)->render();
            return $this->send($to, $subject, $html);
        } catch (\Exception $e) {
            Log::error('EmailService: Template render failed', [
                'template' => $template,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Send welcome email after registration
     */
    public function sendWelcome(User $user): bool
    {
        return $this->sendTemplate(
            $user->email,
            'Selamat Datang di Shifr Asia! 🎉',
            'welcome',
            [
                'user' => $user,
                'dashboardUrl' => config('app.frontend_url') . '/dashboard',
            ]
        );
    }

    /**
     * Send email verification
     */
    public function sendEmailVerification(User $user, string $token): bool
    {
        $verifyUrl = config('app.frontend_url') . '/verify-email?token=' . $token;

        return $this->sendTemplate(
            $user->email,
            'Verifikasi Email Anda - Shifr Asia',
            'verify-email',
            [
                'user' => $user,
                'verifyUrl' => $verifyUrl,
            ]
        );
    }

    /**
     * Send password reset email
     */
    public function sendPasswordReset(User $user, string $token): bool
    {
        $resetUrl = config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);

        return $this->sendTemplate(
            $user->email,
            'Reset Password - Shifr Asia',
            'password-reset',
            [
                'user' => $user,
                'resetUrl' => $resetUrl,
            ]
        );
    }

    /**
     * Send subscription activation confirmation
     */
    public function sendSubscriptionActivated(User $user, $subscription, $payment = null): bool
    {
        return $this->sendTemplate(
            $user->email,
            'Langganan Anda Aktif! 🚀 - Shifr Asia',
            'subscription-activated',
            [
                'user' => $user,
                'subscription' => $subscription,
                'payment' => $payment,
                'dashboardUrl' => config('app.frontend_url') . '/dashboard',
            ]
        );
    }

    /**
     * Send subscription reminder (expiring soon)
     */
    public function sendSubscriptionReminder(User $user, $subscription, int $daysRemaining): bool
    {
        $urgency = $daysRemaining <= 1 ? 'urgent' : ($daysRemaining <= 3 ? 'warning' : 'info');
        
        return $this->sendTemplate(
            $user->email,
            "Langganan Anda Akan Berakhir dalam {$daysRemaining} Hari - Shifr Asia",
            'subscription-reminder',
            [
                'user' => $user,
                'subscription' => $subscription,
                'daysRemaining' => $daysRemaining,
                'urgency' => $urgency,
                'renewUrl' => config('app.frontend_url') . '/dashboard/subscription',
            ]
        );
    }

    /**
     * Send payment invoice/receipt
     */
    public function sendInvoice(User $user, $payment): bool
    {
        return $this->sendTemplate(
            $user->email,
            'Invoice Pembayaran #' . $payment->id . ' - Shifr Asia',
            'invoice',
            [
                'user' => $user,
                'payment' => $payment,
            ]
        );
    }

    /**
     * Send store order confirmation to buyer
     */
    public function sendOrderConfirmation(array $orderData): bool
    {
        if (empty($orderData['customer_email'])) {
            Log::info('EmailService: No customer email for order', [
                'order_number' => $orderData['order_number'] ?? 'unknown',
            ]);
            return false;
        }

        return $this->sendTemplate(
            $orderData['customer_email'],
            'Konfirmasi Pesanan #' . $orderData['order_number'] . ' - ' . $orderData['store_name'],
            'order-confirmation',
            $orderData
        );
    }
}
