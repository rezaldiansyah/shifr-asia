<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'type',
        'description',
        'sections',
        'preview_url',
        'thumbnail',
        'is_premium',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'sections' => 'array',
        'is_premium' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the stores using this template.
     */
    public function stores(): HasMany
    {
        return $this->hasMany(Store::class);
    }

    /**
     * Scope for active templates only.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for store templates.
     */
    public function scopeStoreTemplates($query)
    {
        return $query->where('type', 'store');
    }
}
