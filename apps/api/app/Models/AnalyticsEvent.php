<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsEvent extends Model
{
    use HasFactory;

    // Event types
    const TYPE_VIEW = 'view';
    const TYPE_CLICK = 'click';
    const TYPE_ORDER = 'order';
    const TYPE_BIO_VIEW = 'bio_view';
    const TYPE_LINK_CLICK = 'link_click';
    const TYPE_PRODUCT_VIEW = 'product_view';

    protected $fillable = [
        'store_id',
        'event_type',
        'page',
        'target_type',
        'target_id',
        'metadata',
        'ip_address',
        'user_agent',
        'referer',
        'country',
        'city',
    ];

    protected $casts = [
        'metadata' => 'array',
        'target_id' => 'integer',
    ];

    /**
     * Get the store that owns this event.
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the target model (polymorphic).
     */
    public function target()
    {
        if (!$this->target_type || !$this->target_id) {
            return null;
        }

        $modelClass = match ($this->target_type) {
            'product' => Product::class,
            'link' => Link::class,
            default => null,
        };

        if (!$modelClass) {
            return null;
        }

        return $modelClass::find($this->target_id);
    }

    /**
     * Scope to filter by event type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('event_type', $type);
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeBetween($query, $start, $end)
    {
        return $query->whereBetween('created_at', [$start, $end]);
    }

    /**
     * Scope to filter by today.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    /**
     * Scope to filter by this week.
     */
    public function scopeThisWeek($query)
    {
        return $query->whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek(),
        ]);
    }

    /**
     * Scope to filter by this month.
     */
    public function scopeThisMonth($query)
    {
        return $query->whereBetween('created_at', [
            now()->startOfMonth(),
            now()->endOfMonth(),
        ]);
    }

    /**
     * Get unique visitors count (by IP).
     */
    public static function uniqueVisitors($storeId, $startDate = null, $endDate = null)
    {
        $query = static::where('store_id', $storeId)
            ->where('event_type', static::TYPE_VIEW);

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        return $query->distinct('ip_address')->count('ip_address');
    }
}
