<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subscription_id',
        'mayar_payment_id',
        'mayar_link_id',
        'mayar_link_url',
        'amount',
        'tier',
        'period',
        'status',
        'customer_name',
        'customer_email',
        'customer_phone',
        'metadata',
        'webhook_data',
        'paid_at',
        'expires_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'webhook_data' => 'array',
        'paid_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the user that owns the payment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the subscription associated with the payment.
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * Check if payment is paid.
     */
    public function getIsPaidAttribute(): bool
    {
        return $this->status === 'paid';
    }

    /**
     * Check if payment is pending.
     */
    public function getIsPendingAttribute(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Get formatted amount.
     */
    public function getFormattedAmountAttribute(): string
    {
        return 'Rp ' . number_format($this->amount, 0, ',', '.');
    }

    /**
     * Get tier display name.
     */
    public function getTierNameAttribute(): string
    {
        return Subscription::$tiers[$this->tier]['name'] ?? ucfirst($this->tier);
    }

    /**
     * Scope for pending payments.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for successful payments.
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    /**
     * Mark payment as paid and activate subscription.
     */
    public function markAsPaid(array $webhookData = []): bool
    {
        $this->update([
            'status' => 'paid',
            'paid_at' => now(),
            'webhook_data' => $webhookData,
        ]);

        // Activate or upgrade subscription
        $this->activateSubscription();

        return true;
    }

    /**
     * Activate subscription after successful payment.
     */
    private function activateSubscription(): void
    {
        $user = $this->user;
        
        // Find or create subscription
        $subscription = Subscription::where('user_id', $user->id)->first();

        if ($subscription) {
            // Update existing subscription
            $subscription->update([
                'tier' => $this->tier,
                'status' => 'active',
                'starts_at' => now(),
                'expires_at' => $this->period === 'yearly' 
                    ? now()->addYear() 
                    : now()->addMonth(),
                'auto_renew' => true,
            ]);
        } else {
            // Create new subscription
            Subscription::create([
                'user_id' => $user->id,
                'store_id' => $user->store?->id,
                'tier' => $this->tier,
                'status' => 'active',
                'starts_at' => now(),
                'expires_at' => $this->period === 'yearly' 
                    ? now()->addYear() 
                    : now()->addMonth(),
                'auto_renew' => true,
            ]);
        }

        // Link payment to subscription
        $this->update([
            'subscription_id' => $subscription?->id ?? Subscription::where('user_id', $user->id)->first()?->id,
        ]);
    }
}
