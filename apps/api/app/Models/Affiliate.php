<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Affiliate extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'code',
        'status',
        'commission_rate',
        'motivation',
        'admin_notes',
        'approved_at',
        'approved_by',
        'total_clicks',
        'total_referrals',
        'total_earnings',
        'pending_payout',
        'total_paid',
        'payout_info',
    ];

    protected $casts = [
        'commission_rate' => 'decimal:2',
        'total_earnings' => 'decimal:2',
        'pending_payout' => 'decimal:2',
        'total_paid' => 'decimal:2',
        'approved_at' => 'datetime',
        'payout_info' => 'array',
    ];

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_SUSPENDED = 'suspended';

    /**
     * Generate a unique affiliate code
     */
    public static function generateUniqueCode(): string
    {
        do {
            $code = strtoupper(Str::random(8));
        } while (self::where('code', $code)->exists());
        
        return $code;
    }

    /**
     * The user who is the affiliate
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The admin who approved this affiliate
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * All referrals made by this affiliate
     */
    public function referrals(): HasMany
    {
        return $this->hasMany(AffiliateReferral::class);
    }

    /**
     * Check if affiliate is approved
     */
    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    /**
     * Check if affiliate is pending
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Approve the affiliate
     */
    public function approve(?int $adminId = null): bool
    {
        $this->status = self::STATUS_APPROVED;
        $this->approved_at = now();
        $this->approved_by = $adminId;
        return $this->save();
    }

    /**
     * Reject the affiliate
     */
    public function reject(?string $notes = null): bool
    {
        $this->status = self::STATUS_REJECTED;
        if ($notes) {
            $this->admin_notes = $notes;
        }
        return $this->save();
    }

    /**
     * Increment click count
     */
    public function incrementClicks(): void
    {
        $this->increment('total_clicks');
    }

    /**
     * Add a successful referral
     */
    public function addReferralEarning(float $commission): void
    {
        $this->increment('total_referrals');
        $this->increment('total_earnings', $commission);
        $this->increment('pending_payout', $commission);
    }

    /**
     * Get referral URL
     */
    public function getReferralUrl(): string
    {
        return config('app.frontend_url') . '?ref=' . $this->code;
    }

    /**
     * Scope for approved affiliates
     */
    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * Scope for pending affiliates
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            self::STATUS_PENDING => 'Menunggu Persetujuan',
            self::STATUS_APPROVED => 'Disetujui',
            self::STATUS_REJECTED => 'Ditolak',
            self::STATUS_SUSPENDED => 'Ditangguhkan',
            default => $this->status,
        };
    }
}
