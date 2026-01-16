<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class SubscriptionVoucher extends Model
{
    use HasFactory;

    const TYPE_PERCENTAGE = 'percentage';
    const TYPE_FIXED = 'fixed';

    protected $fillable = [
        'code',
        'name',
        'description',
        'type',
        'value',
        'max_discount',
        'applicable_tiers',
        'max_uses',
        'used_count',
        'max_uses_per_user',
        'starts_at',
        'expires_at',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'max_discount' => 'decimal:2',
        'applicable_tiers' => 'array',
        'max_uses' => 'integer',
        'used_count' => 'integer',
        'max_uses_per_user' => 'integer',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($voucher) {
            $voucher->code = strtoupper($voucher->code);
        });

        static::updating(function ($voucher) {
            if ($voucher->isDirty('code')) {
                $voucher->code = strtoupper($voucher->code);
            }
        });
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Check if voucher applies to a specific tier
     */
    public function appliesToTier(string $tier): bool
    {
        if (empty($this->applicable_tiers)) {
            return true; // Applies to all tiers
        }
        return in_array($tier, $this->applicable_tiers);
    }

    /**
     * Check if voucher is currently valid
     */
    public function isValid(): bool
    {
        if (!$this->is_active) return false;
        if ($this->starts_at && Carbon::now()->lt($this->starts_at)) return false;
        if ($this->expires_at && Carbon::now()->gt($this->expires_at)) return false;
        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) return false;
        return true;
    }

    /**
     * Validate voucher for a specific tier and user
     */
    public function validateFor(string $tier, ?int $userId = null): ?string
    {
        if (!$this->is_active) {
            return 'Kode voucher tidak aktif';
        }

        if ($this->starts_at && Carbon::now()->lt($this->starts_at)) {
            return 'Kode voucher belum berlaku';
        }

        if ($this->expires_at && Carbon::now()->gt($this->expires_at)) {
            return 'Kode voucher sudah kadaluarsa';
        }

        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) {
            return 'Kode voucher sudah habis';
        }

        if (!$this->appliesToTier($tier)) {
            return 'Kode voucher tidak berlaku untuk paket ini';
        }

        // TODO: Check per-user usage limit if $userId provided

        return null; // Valid
    }

    /**
     * Calculate discount amount
     */
    public function calculateDiscount(float $amount): float
    {
        if ($this->type === self::TYPE_PERCENTAGE) {
            $discount = $amount * ($this->value / 100);
            if ($this->max_discount !== null) {
                $discount = min($discount, $this->max_discount);
            }
            return round($discount, 2);
        }

        // Fixed discount
        return min($this->value, $amount);
    }

    /**
     * Record usage
     */
    public function recordUsage(): void
    {
        $this->increment('used_count');
    }

    /**
     * Get formatted value display
     */
    public function getFormattedValueAttribute(): string
    {
        if ($this->type === self::TYPE_PERCENTAGE) {
            return $this->value . '%';
        }
        return 'Rp ' . number_format($this->value, 0, ',', '.');
    }

    /**
     * Get applicable tiers as string
     */
    public function getApplicableTiersTextAttribute(): string
    {
        if (empty($this->applicable_tiers)) {
            return 'Semua paket';
        }
        return implode(', ', array_map('ucfirst', $this->applicable_tiers));
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeValid($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->where(function ($q) {
                $q->whereNull('max_uses')->orWhereRaw('used_count < max_uses');
            });
    }
}
