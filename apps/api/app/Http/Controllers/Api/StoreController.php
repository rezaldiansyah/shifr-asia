<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class StoreController extends Controller
{
    /**
     * Get current user's store.
     */
    public function show(): JsonResponse
    {
        $store = Store::where('user_id', Auth::id())
            ->with('template:id,name,slug,thumbnail')
            ->first();

        if (!$store) {
            return response()->json([
                'store' => null,
                'message' => 'Store belum dibuat',
            ]);
        }

        return response()->json([
            'store' => $store,
        ]);
    }

    /**
     * Create store for current user.
     */
    public function store(Request $request): JsonResponse
    {
        // Check if user already has a store
        $existingStore = Store::where('user_id', Auth::id())->first();
        if ($existingStore) {
            return response()->json([
                'message' => 'Anda sudah memiliki toko',
                'store' => $existingStore,
            ], 422);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'template_id' => 'nullable|exists:templates,id',
            'whatsapp_number' => 'nullable|string|max:20',
            'logo' => 'nullable|string',
            'theme_color' => 'nullable|string|max:7',
        ]);

        $store = Store::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . Str::random(5),
            'description' => $validated['description'] ?? null,
            'template_id' => $validated['template_id'] ?? 1,
            'tier' => 'free',
            'is_active' => true,
            'settings' => [
                'whatsapp_number' => $validated['whatsapp_number'] ?? null,
                'logo' => $validated['logo'] ?? null,
                'theme_color' => $validated['theme_color'] ?? '#374da0',
            ],
        ]);

        $store->load('template:id,name,slug,thumbnail');

        return response()->json([
            'message' => 'Toko berhasil dibuat',
            'store' => $store,
        ], 201);
    }

    /**
     * Update current user's store.
     */
    public function update(Request $request): JsonResponse
    {
        $store = Store::where('user_id', Auth::id())->first();

        if (!$store) {
            return response()->json([
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:500',
            'template_id' => 'nullable|exists:templates,id',
            'whatsapp_number' => 'nullable|string|max:20',
            'logo' => 'nullable|string',
            'theme_color' => 'nullable|string|max:7',
            'banner_url' => 'nullable|string',
            'social_links' => 'nullable|array',
            'social_links.instagram' => 'nullable|string|max:255',
            'social_links.tiktok' => 'nullable|string|max:255',
            'social_links.facebook' => 'nullable|string|max:255',
            'social_links.shopee' => 'nullable|string|max:255',
            'social_links.tokopedia' => 'nullable|string|max:255',
            'working_hours' => 'nullable|array',
            'working_hours.*.is_open' => 'boolean',
            'working_hours.*.open' => 'nullable|string|max:5',
            'working_hours.*.close' => 'nullable|string|max:5',
        ]);

        // Update basic fields
        if (isset($validated['name'])) {
            $store->name = $validated['name'];
        }
        if (isset($validated['description'])) {
            $store->description = $validated['description'];
        }
        if (isset($validated['template_id'])) {
            $store->template_id = $validated['template_id'];
        }

        // Update settings
        $settings = $store->settings ?? [];
        
        // Basic settings
        if (isset($validated['whatsapp_number'])) {
            $settings['whatsapp_number'] = $validated['whatsapp_number'];
        }
        if (isset($validated['logo'])) {
            $settings['logo'] = $validated['logo'];
        }
        if (isset($validated['theme_color'])) {
            $settings['theme_color'] = $validated['theme_color'];
        }
        
        // Customization settings
        if (isset($validated['banner_url'])) {
            $settings['banner_url'] = $validated['banner_url'];
        }
        if (isset($validated['social_links'])) {
            $settings['social_links'] = $validated['social_links'];
        }
        if (isset($validated['working_hours'])) {
            $settings['working_hours'] = $validated['working_hours'];
        }
        
        $store->settings = $settings;
        $store->save();
        $store->load('template:id,name,slug,thumbnail');

        return response()->json([
            'message' => 'Toko berhasil diperbarui',
            'store' => $store,
        ]);
    }
}
