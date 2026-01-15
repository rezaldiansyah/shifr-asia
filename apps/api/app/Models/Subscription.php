<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'store_id',
        'product',
        'tier',
        'amount',
        'billing_cycle',
        'status',
        'starts_at',
        'expires_at',
        'auto_renew',
        'metadata',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'auto_renew' => 'boolean',
        'metadata' => 'array',
    ];

    /**
     * Tier configurations with features and pricing.
     */
    public static array $tiers = [
        'free' => [
            'name' => 'Free',
            'price' => 0,
            'price_formatted' => 'Gratis',
            'period' => '3 bulan',
            'product_limit' => 9,
            'features' => [
                'Maksimal 9 produk',
                '2 template dasar',
                'Subdomain gratis',
                'WhatsApp checkout',
                'Order management',
            ],
            'not_included' => [
                'Custom domain',
                'Analytics',
                'Priority support',
            ],
        ],
        'starter' => [
            'name' => 'Starter',
            'price' => 35000,
            'price_formatted' => 'Rp 35k/bulan',
            'period' => 'bulan',
            'product_limit' => 5,
            'features' => [
                'Maksimal 5 produk',
                'Semua template',
                'Subdomain gratis',
                'WhatsApp checkout',
                'Order management',
                'Remove branding',
            ],
            'not_included' => [
                'Custom domain',
                'Analytics',
                'Priority support',
            ],
        ],
        'growth' => [
            'name' => 'Growth',
            'price' => 89000,
            'price_formatted' => 'Rp 89k/bulan',
            'period' => 'bulan',
            'product_limit' => 50,
            'popular' => true,
            'features' => [
                'Maksimal 50 produk',
                'Semua template',
                'Custom domain',
                'WhatsApp checkout',
                'Order management',
                'Remove branding',
                'Basic analytics',
            ],
            'not_included' => [
                'Priority support',
                'API access',
            ],
        ],
        'pro' => [
            'name' => 'Pro',
            'price' => 199000,
            'price_formatted' => 'Rp 199k/bulan',
            'period' => 'bulan',
            'product_limit' => 499,
            'features' => [
                'Maksimal 499 produk',
                'Semua template',
                'Custom domain',
                'WhatsApp checkout',
                'Order management',
                'Remove branding',
                'Advanced analytics',
                'Priority support',
                'API access',
            ],
            'not_included' => [],
        ],
    ];

    /**
     * Get the user that owns the subscription.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the store associated with the subscription.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the reminders for this subscription.
     */
    public function reminders(): HasMany
    {
        return $this->hasMany(SubscriptionReminder::class);
    }

    /**
     * Check if subscription is active.
     */
    public function getIsActiveAttribute(): bool
    {
        if (!in_array($this->status, ['active', 'trial'])) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        return true;
    }

    /**
     * Check if subscription is expired.
     */
    public function getIsExpiredAttribute(): bool
    {
        if ($this->status === 'expired') {
            return true;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return true;
        }

        return false;
    }

    /**
     * Get days remaining until expiry.
     */
    public function getDaysRemainingAttribute(): ?int
    {
        if (!$this->expires_at) {
            return null;
        }

        $days = Carbon::now()->diffInDays($this->expires_at, false);
        return max(0, $days);
    }

    /**
     * Get tier configuration.
     */
    public function getTierConfigAttribute(): array
    {
        return self::$tiers[$this->tier] ?? self::$tiers['free'];
    }

    /**
     * Get product limit for current tier.
     */
    public function getProductLimitAttribute(): int
    {
        return $this->tier_config['product_limit'] ?? 9;
    }

    /**
     * Check if can upgrade to a specific tier.
     */
    public function canUpgradeTo(string $tier): bool
    {
        $tierOrder = ['free' => 0, 'starter' => 1, 'growth' => 2, 'pro' => 3];
        $currentLevel = $tierOrder[$this->tier] ?? 0;
        $targetLevel = $tierOrder[$tier] ?? 0;

        return $targetLevel > $currentLevel;
    }

    /**
     * Check if can downgrade to a specific tier.
     */
    public function canDowngradeTo(string $tier): bool
    {
        $tierOrder = ['free' => 0, 'starter' => 1, 'growth' => 2, 'pro' => 3];
        $currentLevel = $tierOrder[$this->tier] ?? 0;
        $targetLevel = $tierOrder[$tier] ?? 0;

        return $targetLevel < $currentLevel;
    }

    /**
     * Scope for active subscriptions.
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['active', 'trial'])
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Scope for expiring soon (within 7 days).
     */
    public function scopeExpiringSoon($query, int $days = 7)
    {
        return $query->whereIn('status', ['active', 'trial'])
            ->whereNotNull('expires_at')
            ->whereBetween('expires_at', [now(), now()->addDays($days)]);
    }

    /**
     * Get all available tiers.
     */
    public static function getTiers(): array
    {
        $tiers = [];
        foreach (self::$tiers as $key => $config) {
            $tiers[] = array_merge(['key' => $key], $config);
        }
        return $tiers;
    }

    /**
     * Create a trial subscription for a user.
     */
    public static function createTrial(User $user, ?Store $store = null): self
    {
        return self::create([
            'user_id' => $user->id,
            'store_id' => $store?->id,
            'product' => 'ecommerce', // default product
            'tier' => 'free',
            'amount' => 0,
            'billing_cycle' => 'monthly',
            'status' => 'active', // Use 'active' as SQLite CHECK constraint doesn't allow 'trial'
            'starts_at' => now(),
            'expires_at' => now()->addMonths(3), // 3 bulan trial
            'auto_renew' => false,
            'metadata' => ['is_trial' => true], // Mark as trial in metadata
        ]);
    }
}
