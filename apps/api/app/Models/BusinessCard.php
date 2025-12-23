<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BusinessCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'slug',
        'data',
        'views',
        'view_count',
        'last_viewed_at',
        'is_active',
        'expires_at',
    ];

    protected $casts = [
        'data' => 'array',
        'is_active' => 'boolean',
        'expires_at' => 'datetime',
        'last_viewed_at' => 'datetime',
    ];

    /**
     * Boot method to auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($card) {
            if (empty($card->slug)) {
                $card->slug = static::generateUniqueSlug($card->data['name'] ?? 'card');
            }
        });
    }

    /**
     * Generate unique slug from name
     */
    public static function generateUniqueSlug(string $name): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    /**
     * User relationship
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Increment view count
     */
    public function incrementViews()
    {
        $this->increment('views');
        $this->increment('view_count');
        $this->update(['last_viewed_at' => now()]);
    }

    /**
     * Check if card is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if card is viewable
     */
    public function isViewable(): bool
    {
        return $this->is_active && !$this->isExpired();
    }

    /**
     * Get name from data
     */
    public function getNameAttribute(): ?string
    {
        return $this->data['name'] ?? null;
    }

    /**
     * Get title from data
     */
    public function getTitleAttribute(): ?string
    {
        return $this->data['title'] ?? null;
    }

    /**
     * Get company from data
     */
    public function getCompanyAttribute(): ?string
    {
        return $this->data['company'] ?? null;
    }

    /**
     * Get bio from data
     */
    public function getBioAttribute(): ?string
    {
        return $this->data['bio'] ?? null;
    }

    /**
     * Get photo from data
     */
    public function getPhotoAttribute(): ?string
    {
        return $this->data['photo'] ?? null;
    }

    /**
     * Get email from data
     */
    public function getEmailAttribute(): ?string
    {
        return $this->data['email'] ?? null;
    }

    /**
     * Get phone from data
     */
    public function getPhoneAttribute(): ?string
    {
        return $this->data['phone'] ?? null;
    }

    /**
     * Get website from data
     */
    public function getWebsiteAttribute(): ?string
    {
        return $this->data['website'] ?? null;
    }

    /**
     * Get social links from data
     */
    public function getSocialLinksAttribute(): array
    {
        return $this->data['social_links'] ?? [];
    }

    /**
     * Get custom links from data
     */
    public function getCustomLinksAttribute(): array
    {
        return $this->data['custom_links'] ?? [];
    }

    /**
     * Get theme from data
     */
    public function getThemeAttribute(): string
    {
        return $this->data['theme'] ?? 'default';
    }

    /**
     * Generate vCard content
     */
    public function toVCard(): string
    {
        $vcard = "BEGIN:VCARD\r\n";
        $vcard .= "VERSION:3.0\r\n";
        
        if ($name = $this->name) {
            $vcard .= "FN:{$name}\r\n";
            $vcard .= "N:{$name};;;;\r\n";
        }
        
        if ($title = $this->title) {
            $vcard .= "TITLE:{$title}\r\n";
        }
        
        if ($company = $this->company) {
            $vcard .= "ORG:{$company}\r\n";
        }
        
        if ($email = $this->email) {
            $vcard .= "EMAIL:{$email}\r\n";
        }
        
        if ($phone = $this->phone) {
            $vcard .= "TEL:{$phone}\r\n";
        }
        
        if ($website = $this->website) {
            $vcard .= "URL:{$website}\r\n";
        }
        
        if ($bio = $this->bio) {
            $vcard .= "NOTE:{$bio}\r\n";
        }
        
        $vcard .= "END:VCARD\r\n";
        
        return $vcard;
    }
}
