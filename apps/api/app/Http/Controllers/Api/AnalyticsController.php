<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnalyticsEvent;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Track an analytics event (public endpoint).
     */
    public function track(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'event_type' => 'required|string|in:view,click,order,bio_view,link_click,product_view',
            'page' => 'nullable|string|max:255',
            'target_type' => 'nullable|string|max:50',
            'target_id' => 'nullable|integer',
            'metadata' => 'nullable|array',
        ]);

        $event = AnalyticsEvent::create([
            'store_id' => $validated['store_id'],
            'event_type' => $validated['event_type'],
            'page' => $validated['page'] ?? null,
            'target_type' => $validated['target_type'] ?? null,
            'target_id' => $validated['target_id'] ?? null,
            'metadata' => $validated['metadata'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'referer' => $request->header('referer'),
        ]);

        return response()->json([
            'success' => true,
            'event_id' => $event->id,
        ]);
    }

    /**
     * Get analytics summary for authenticated store.
     */
    public function summary(Request $request)
    {
        $store = $request->user()->store;
        
        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $period = $request->get('period', '7d'); // 7d, 30d, 90d
        
        $startDate = match ($period) {
            '24h' => now()->subDay(),
            '7d' => now()->subDays(7),
            '30d' => now()->subDays(30),
            '90d' => now()->subDays(90),
            default => now()->subDays(7),
        };

        $stats = [
            'total_views' => AnalyticsEvent::where('store_id', $store->id)
                ->where('event_type', AnalyticsEvent::TYPE_VIEW)
                ->where('created_at', '>=', $startDate)
                ->count(),
            'unique_visitors' => AnalyticsEvent::where('store_id', $store->id)
                ->where('event_type', AnalyticsEvent::TYPE_VIEW)
                ->where('created_at', '>=', $startDate)
                ->distinct('ip_address')
                ->count('ip_address'),
            'total_clicks' => AnalyticsEvent::where('store_id', $store->id)
                ->whereIn('event_type', [AnalyticsEvent::TYPE_CLICK, AnalyticsEvent::TYPE_PRODUCT_VIEW])
                ->where('created_at', '>=', $startDate)
                ->count(),
            'total_orders' => AnalyticsEvent::where('store_id', $store->id)
                ->where('event_type', AnalyticsEvent::TYPE_ORDER)
                ->where('created_at', '>=', $startDate)
                ->count(),
            'bio_views' => AnalyticsEvent::where('store_id', $store->id)
                ->where('event_type', AnalyticsEvent::TYPE_BIO_VIEW)
                ->where('created_at', '>=', $startDate)
                ->count(),
            'link_clicks' => AnalyticsEvent::where('store_id', $store->id)
                ->where('event_type', AnalyticsEvent::TYPE_LINK_CLICK)
                ->where('created_at', '>=', $startDate)
                ->count(),
        ];

        // Calculate conversion rate
        $stats['conversion_rate'] = $stats['total_views'] > 0 
            ? round(($stats['total_orders'] / $stats['total_views']) * 100, 2) 
            : 0;

        return response()->json([
            'summary' => $stats,
            'period' => $period,
            'start_date' => $startDate->toDateString(),
            'end_date' => now()->toDateString(),
        ]);
    }

    /**
     * Get analytics data for charts.
     */
    public function charts(Request $request)
    {
        $store = $request->user()->store;
        
        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $period = $request->get('period', '7d');
        $days = match ($period) {
            '24h' => 1,
            '7d' => 7,
            '30d' => 30,
            '90d' => 90,
            default => 7,
        };

        // Daily views and orders for chart
        $dailyStats = AnalyticsEvent::where('store_id', $store->id)
            ->where('created_at', '>=', now()->subDays($days))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw("SUM(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) as views"),
                DB::raw("SUM(CASE WHEN event_type = 'click' OR event_type = 'product_view' THEN 1 ELSE 0 END) as clicks"),
                DB::raw("SUM(CASE WHEN event_type = 'order' THEN 1 ELSE 0 END) as orders")
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top pages
        $topPages = AnalyticsEvent::where('store_id', $store->id)
            ->where('event_type', AnalyticsEvent::TYPE_VIEW)
            ->where('created_at', '>=', now()->subDays($days))
            ->whereNotNull('page')
            ->select('page', DB::raw('COUNT(*) as count'))
            ->groupBy('page')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // Top products (by views)
        $topProducts = AnalyticsEvent::where('store_id', $store->id)
            ->where('event_type', AnalyticsEvent::TYPE_PRODUCT_VIEW)
            ->where('created_at', '>=', now()->subDays($days))
            ->whereNotNull('target_id')
            ->select('target_id', DB::raw('COUNT(*) as views'))
            ->groupBy('target_id')
            ->orderByDesc('views')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                $product = \App\Models\Product::find($item->target_id);
                return [
                    'product_id' => $item->target_id,
                    'product_name' => $product?->name ?? 'Unknown',
                    'views' => $item->views,
                ];
            });

        return response()->json([
            'daily' => $dailyStats,
            'top_pages' => $topPages,
            'top_products' => $topProducts,
            'period' => $period,
        ]);
    }

    /**
     * Get detailed analytics events list.
     */
    public function index(Request $request)
    {
        $store = $request->user()->store;
        
        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $perPage = $request->get('per_page', 50);
        $eventType = $request->get('event_type');

        $query = AnalyticsEvent::where('store_id', $store->id)
            ->orderByDesc('created_at');

        if ($eventType) {
            $query->where('event_type', $eventType);
        }

        $events = $query->paginate($perPage);

        return response()->json([
            'events' => $events->items(),
            'pagination' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'per_page' => $events->perPage(),
                'total' => $events->total(),
            ],
        ]);
    }
}
