<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'domain',
        'subdomain',
        'custom_domain',
        'domain_verified',
        'ssl_status',
        'verification_token',
        'ssl_expires_at',
        'template_id',
        'tier',
        'settings',
        'custom_sections',
        'description',
        'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'custom_sections' => 'array',
        'is_active' => 'boolean',
        'domain_verified' => 'boolean',
        'ssl_expires_at' => 'datetime',
    ];

    /**
     * Get the effective sections for this store.
     * If custom_sections is set, use that. Otherwise, use template sections.
     */
    public function getSectionsAttribute(): array
    {
        // If store has custom sections, use them
        if (!empty($this->custom_sections)) {
            return $this->custom_sections;
        }

        // Otherwise, use template's default sections
        if ($this->template && !empty($this->template->sections)) {
            return $this->template->sections;
        }

        // Default sections if nothing is set
        return $this->getDefaultSections();
    }

    /**
     * Get default sections for new stores.
     */
    public function getDefaultSections(): array
    {
        return [
            [
                'id' => 'hero-1',
                'type' => 'hero',
                'order' => 0,
                'enabled' => true,
                'content' => [
                    'title' => $this->name ?? 'Selamat Datang',
                    'subtitle' => $this->description ?? 'Toko Online Terpercaya',
                    'buttonText' => 'Lihat Produk',
                    'buttonLink' => '#products',
                    'backgroundImage' => null,
                ],
                'styles' => [
                    'backgroundColor' => '#374da0',
                    'textColor' => '#ffffff',
                ],
            ],
            [
                'id' => 'about-1',
                'type' => 'about',
                'order' => 1,
                'enabled' => true,
                'content' => [
                    'title' => 'Tentang Kami',
                    'description' => $this->description ?? 'Kami berkomitmen memberikan produk dan layanan terbaik untuk Anda.',
                    'image' => null,
                ],
                'styles' => [
                    'backgroundColor' => '#ffffff',
                    'textColor' => '#1f2937',
                ],
            ],
            [
                'id' => 'products-1',
                'type' => 'products',
                'order' => 2,
                'enabled' => true,
                'content' => [
                    'title' => 'Produk Kami',
                    'subtitle' => 'Temukan produk terbaik untuk kebutuhan Anda',
                    'showAll' => true,
                    'limit' => 6,
                ],
                'styles' => [
                    'backgroundColor' => '#f9fafb',
                    'textColor' => '#1f2937',
                ],
            ],
            [
                'id' => 'contact-1',
                'type' => 'contact',
                'order' => 3,
                'enabled' => true,
                'content' => [
                    'title' => 'Hubungi Kami',
                    'subtitle' => 'Ada pertanyaan? Jangan ragu untuk menghubungi kami',
                    'showWhatsApp' => true,
                    'showEmail' => false,
                    'showAddress' => false,
                ],
                'styles' => [
                    'backgroundColor' => '#374da0',
                    'textColor' => '#ffffff',
                ],
            ],
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($store) {
            if (empty($store->slug)) {
                $store->slug = Str::slug($store->name) . '-' . Str::random(5);
            }
        });
    }

    /**
     * Get the owner of the store.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the template used by the store.
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    /**
     * Get the products in this store.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the active subscription for this store.
     */
    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->active();
    }

    /**
     * Get the current tier from subscription or default.
     */
    public function getCurrentTierAttribute(): string
    {
        $subscription = Subscription::where('store_id', $this->id)
            ->active()
            ->first();

        return $subscription?->tier ?? 'free';
    }

    /**
     * Check if store has access to a feature.
     */
    public function hasFeature(string $feature): bool
    {
        $tierFeatures = [
            'custom_domain' => ['growth', 'pro'],
            'remove_branding' => ['starter', 'growth', 'pro'],
            'analytics' => ['growth', 'pro'],
            'advanced_analytics' => ['pro'],
            'priority_support' => ['pro'],
            'api_access' => ['pro'],
        ];

        $allowedTiers = $tierFeatures[$feature] ?? [];
        return in_array($this->current_tier, $allowedTiers);
    }

    /**
     * Get store logo from settings.
     */
    public function getLogoAttribute(): ?string
    {
        return $this->settings['logo'] ?? null;
    }

    /**
     * Get store WhatsApp number from settings.
     */
    public function getWhatsappNumberAttribute(): ?string
    {
        return $this->settings['whatsapp_number'] ?? null;
    }

    /**
     * Get store theme color from settings.
     */
    public function getThemeColorAttribute(): ?string
    {
        return $this->settings['theme_color'] ?? '#374da0';
    }

    /**
     * Get store banner URL from settings.
     */
    public function getBannerUrlAttribute(): ?string
    {
        return $this->settings['banner_url'] ?? null;
    }

    /**
     * Get store social links from settings.
     */
    public function getSocialLinksAttribute(): array
    {
        return $this->settings['social_links'] ?? [];
    }

    /**
     * Get store working hours from settings.
     */
    public function getWorkingHoursAttribute(): array
    {
        return $this->settings['working_hours'] ?? [];
    }

    /**
     * Check if store is currently open based on working hours.
     */
    public function getIsOpenNowAttribute(): bool
    {
        $hours = $this->working_hours;
        if (empty($hours)) {
            return true; // Always open if no hours set
        }

        $now = now()->setTimezone('Asia/Jakarta');
        $dayOfWeek = strtolower($now->format('l')); // monday, tuesday, etc.
        
        if (!isset($hours[$dayOfWeek]) || !$hours[$dayOfWeek]['is_open']) {
            return false;
        }

        $openTime = $hours[$dayOfWeek]['open'] ?? '00:00';
        $closeTime = $hours[$dayOfWeek]['close'] ?? '23:59';
        
        $currentTime = $now->format('H:i');
        return $currentTime >= $openTime && $currentTime <= $closeTime;
    }

    /**
     * Get product count.
     */
    public function getProductCountAttribute(): int
    {
        return $this->products()->count();
    }

    /**
     * Get tier limits.
     */
    public function getProductLimitAttribute(): int
    {
        return match ($this->tier) {
            'free' => 9,
            'starter' => 5,
            'growth' => 50,
            'pro' => 499,
            default => 9,
        };
    }

    /**
     * Get subdomain URL (e.g., https://tokoku.shifr.asia)
     */
    public function getSubdomainUrlAttribute(): ?string
    {
        if (!$this->subdomain) {
            return null;
        }
        return "https://{$this->subdomain}.shifr.asia";
    }

    /**
     * Get custom domain URL (e.g., https://shop.mybrand.com)
     */
    public function getCustomDomainUrlAttribute(): ?string
    {
        if (!$this->custom_domain || !$this->domain_verified) {
            return null;
        }
        return "https://{$this->custom_domain}";
    }

    /**
     * Get primary URL (custom domain if verified, else subdomain, else slug-based)
     */
    public function getPrimaryUrlAttribute(): string
    {
        if ($this->custom_domain && $this->domain_verified) {
            return $this->custom_domain_url;
        }
        
        if ($this->subdomain) {
            return $this->subdomain_url;
        }
        
        // Fallback to slug-based URL
        return config('app.url') . "/store/{$this->slug}";
    }

    /**
     * Check if store can use custom domain feature.
     */
    public function getCanUseCustomDomainAttribute(): bool
    {
        return $this->hasFeature('custom_domain');
    }

    /**
     * Generate DNS verification token.
     */
    public function generateVerificationToken(): string
    {
        $token = 'shifr-verify-' . Str::random(32);
        $this->verification_token = $token;
        $this->save();
        return $token;
    }

    /**
     * Get DNS record instructions for verification.
     */
    public function getDnsInstructionsAttribute(): array
    {
        return [
            'type' => 'CNAME',
            'name' => $this->custom_domain,
            'value' => 'proxy.shifr.asia',
            'verification' => [
                'type' => 'TXT',
                'name' => "_shifr.{$this->custom_domain}",
                'value' => $this->verification_token ?? $this->generateVerificationToken(),
            ],
        ];
    }
}
