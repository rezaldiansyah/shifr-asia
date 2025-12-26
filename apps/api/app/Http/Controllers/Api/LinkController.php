<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Link;
use App\Models\Store;
use App\Models\AnalyticsEvent;
use App\Services\ContentModerationService;
use Illuminate\Http\Request;

class LinkController extends Controller
{
    /**
     * Get all links for authenticated store.
     */
    public function index(Request $request)
    {
        $store = $request->user()->store;
        
        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $links = Link::where('store_id', $store->id)
            ->ordered()
            ->get();

        return response()->json([
            'links' => $links,
        ]);
    }

    /**
     * Get public links for bio page.
     */
    public function publicIndex(string $storeSlug)
    {
        $store = Store::where('slug', $storeSlug)->first();
        
        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $links = Link::where('store_id', $store->id)
            ->active()
            ->ordered()
            ->get(['id', 'title', 'url', 'icon', 'thumbnail', 'description']);

        return response()->json([
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'slug' => $store->slug,
                'description' => $store->description,
                'logo' => $store->logo,
                'theme_color' => $store->theme_color,
            ],
            'links' => $links,
        ]);
    }

    /**
     * Create a new link.
     */
    public function store(Request $request)
    {
        $store = $request->user()->store;
        
        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'url' => 'required|url|max:500',
            'icon' => 'nullable|string|max:50',
            'thumbnail' => 'nullable|url|max:500',
            'description' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        // Content moderation check
        $moderation = new ContentModerationService();
        $moderation->validateFields([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'url' => $validated['url'],
        ]);

        // Get max sort order
        $maxOrder = Link::where('store_id', $store->id)->max('sort_order') ?? -1;

        $link = Link::create([
            'store_id' => $store->id,
            'title' => $validated['title'],
            'url' => $validated['url'],
            'icon' => $validated['icon'] ?? null,
            'thumbnail' => $validated['thumbnail'] ?? null,
            'description' => $validated['description'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $maxOrder + 1,
        ]);

        return response()->json([
            'message' => 'Link created successfully',
            'link' => $link,
        ], 201);
    }

    /**
     * Update a link.
     */
    public function update(Request $request, Link $link)
    {
        $store = $request->user()->store;
        
        if (!$store || $link->store_id !== $store->id) {
            return response()->json([
                'message' => 'Link not found',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:100',
            'url' => 'sometimes|url|max:500',
            'icon' => 'nullable|string|max:50',
            'thumbnail' => 'nullable|url|max:500',
            'description' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        $link->update($validated);

        return response()->json([
            'message' => 'Link updated successfully',
            'link' => $link->fresh(),
        ]);
    }

    /**
     * Delete a link.
     */
    public function destroy(Request $request, Link $link)
    {
        $store = $request->user()->store;
        
        if (!$store || $link->store_id !== $store->id) {
            return response()->json([
                'message' => 'Link not found',
            ], 404);
        }

        $link->delete();

        return response()->json([
            'message' => 'Link deleted successfully',
        ]);
    }

    /**
     * Reorder links.
     */
    public function reorder(Request $request)
    {
        $store = $request->user()->store;
        
        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $validated = $request->validate([
            'order' => 'required|array',
            'order.*' => 'integer|exists:links,id',
        ]);

        foreach ($validated['order'] as $index => $linkId) {
            Link::where('id', $linkId)
                ->where('store_id', $store->id)
                ->update(['sort_order' => $index]);
        }

        $links = Link::where('store_id', $store->id)
            ->ordered()
            ->get();

        return response()->json([
            'message' => 'Links reordered successfully',
            'links' => $links,
        ]);
    }

    /**
     * Track link click (public).
     */
    public function trackClick(Request $request, Link $link)
    {
        $link->recordClick();

        // Also record in analytics
        AnalyticsEvent::create([
            'store_id' => $link->store_id,
            'event_type' => AnalyticsEvent::TYPE_LINK_CLICK,
            'target_type' => 'link',
            'target_id' => $link->id,
            'metadata' => [
                'title' => $link->title,
                'url' => $link->url,
            ],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'referer' => $request->header('referer'),
        ]);

        return response()->json([
            'success' => true,
            'url' => $link->url,
        ]);
    }
}
