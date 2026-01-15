<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AffiliateReferral extends Model
{
    use HasFactory;

    protected $fillable = [
        'affiliate_id',
        'referred_user_id',
        'subscription_id',
        'tier',
        'subscription_amount',
        'commission_rate',
        'commission_amount',
        'status',
        'approved_at',
        'paid_at',
    ];

    protected $casts = [
        'subscription_amount' => 'decimal:2',
        'commission_rate' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'approved_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_PAID = 'paid';
    const STATUS_CANCELLED = 'cancelled';

    /**
     * The affiliate who made this referral
     */
    public function affiliate(): BelongsTo
    {
        return $this->belongsTo(Affiliate::class);
    }

    /**
     * The user who was referred
     */
    public function referredUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_user_id');
    }

    /**
     * The subscription created from this referral
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * Calculate commission based on subscription amount and rate
     */
    public static function calculateCommission(float $amount, float $rate): float
    {
        return round($amount * ($rate / 100), 2);
    }

    /**
     * Approve this referral commission
     */
    public function approve(): bool
    {
        $this->status = self::STATUS_APPROVED;
        $this->approved_at = now();
        return $this->save();
    }

    /**
     * Mark as paid
     */
    public function markAsPaid(): bool
    {
        $this->status = self::STATUS_PAID;
        $this->paid_at = now();
        return $this->save();
    }

    /**
     * Get formatted commission amount
     */
    public function getFormattedCommissionAttribute(): string
    {
        return 'Rp ' . number_format($this->commission_amount, 0, ',', '.');
    }

    /**
     * Get formatted subscription amount
     */
    public function getFormattedSubscriptionAmountAttribute(): string
    {
        return 'Rp ' . number_format($this->subscription_amount, 0, ',', '.');
    }

    /**
     * Scope for pending referrals
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for approved referrals
     */
    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }
}
