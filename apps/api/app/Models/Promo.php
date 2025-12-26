<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Promo extends Model
{
    use HasFactory;

    const TYPE_PERCENTAGE = 'percentage';
    const TYPE_FIXED = 'fixed';

    protected $fillable = [
        'store_id',
        'code',
        'name',
        'description',
        'type',
        'value',
        'min_order',
        'max_discount',
        'max_uses',
        'used_count',
        'max_uses_per_user',
        'starts_at',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_order' => 'decimal:2',
        'max_discount' => 'decimal:2',
        'max_uses' => 'integer',
        'used_count' => 'integer',
        'max_uses_per_user' => 'integer',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($promo) {
            // Always uppercase the code
            $promo->code = strtoupper($promo->code);
        });

        static::updating(function ($promo) {
            if ($promo->isDirty('code')) {
                $promo->code = strtoupper($promo->code);
            }
        });
    }

    /**
     * Get the store that owns this promo.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Check if promo is currently valid.
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        // Check if started
        if ($this->starts_at && Carbon::now()->lt($this->starts_at)) {
            return false;
        }

        // Check if expired
        if ($this->expires_at && Carbon::now()->gt($this->expires_at)) {
            return false;
        }

        // Check usage limit
        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) {
            return false;
        }

        return true;
    }

    /**
     * Check if promo is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at && Carbon::now()->gt($this->expires_at);
    }

    /**
     * Check if promo has started.
     */
    public function hasStarted(): bool
    {
        return !$this->starts_at || Carbon::now()->gte($this->starts_at);
    }

    /**
     * Check if promo has reached usage limit.
     */
    public function isUsedUp(): bool
    {
        return $this->max_uses !== null && $this->used_count >= $this->max_uses;
    }

    /**
     * Check if order meets minimum requirement.
     */
    public function meetsMinimum(float $orderAmount): bool
    {
        if ($this->min_order === null) {
            return true;
        }
        return $orderAmount >= $this->min_order;
    }

    /**
     * Calculate discount amount for an order.
     */
    public function calculateDiscount(float $orderAmount): float
    {
        if (!$this->meetsMinimum($orderAmount)) {
            return 0;
        }

        if ($this->type === self::TYPE_PERCENTAGE) {
            $discount = $orderAmount * ($this->value / 100);
            
            // Apply max discount cap if set
            if ($this->max_discount !== null) {
                $discount = min($discount, $this->max_discount);
            }
            
            return round($discount, 2);
        }

        // Fixed discount
        return min($this->value, $orderAmount);
    }

    /**
     * Increment usage count.
     */
    public function recordUsage(): void
    {
        $this->increment('used_count');
    }

    /**
     * Get validation error message.
     */
    public function getValidationError(float $orderAmount = 0): ?string
    {
        if (!$this->is_active) {
            return 'Kode promo tidak aktif';
        }

        if (!$this->hasStarted()) {
            return 'Kode promo belum berlaku';
        }

        if ($this->isExpired()) {
            return 'Kode promo sudah kadaluarsa';
        }

        if ($this->isUsedUp()) {
            return 'Kode promo sudah habis digunakan';
        }

        if ($orderAmount > 0 && !$this->meetsMinimum($orderAmount)) {
            return "Minimum pembelian Rp " . number_format($this->min_order, 0, ',', '.');
        }

        return null;
    }

    /**
     * Get formatted value display.
     */
    public function getFormattedValueAttribute(): string
    {
        if ($this->type === self::TYPE_PERCENTAGE) {
            return $this->value . '%';
        }
        return 'Rp ' . number_format($this->value, 0, ',', '.');
    }

    /**
     * Scope to active promos.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to valid promos (active and within date range).
     */
    public function scopeValid($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('starts_at')
                    ->orWhere('starts_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->where(function ($q) {
                $q->whereNull('max_uses')
                    ->orWhereRaw('used_count < max_uses');
            });
    }
}
