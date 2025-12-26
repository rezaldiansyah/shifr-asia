<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use App\Models\Store;
use Illuminate\Http\Request;

class PromoController extends Controller
{
    /**
     * Get all promos for authenticated store.
     */
    public function index(Request $request)
    {
        $store = $request->user()->store;
        
        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $promos = Promo::where('store_id', $store->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($promo) {
                return [
                    'id' => $promo->id,
                    'code' => $promo->code,
                    'name' => $promo->name,
                    'description' => $promo->description,
                    'type' => $promo->type,
                    'value' => $promo->value,
                    'formatted_value' => $promo->formatted_value,
                    'min_order' => $promo->min_order,
                    'max_discount' => $promo->max_discount,
                    'max_uses' => $promo->max_uses,
                    'used_count' => $promo->used_count,
                    'starts_at' => $promo->starts_at?->toISOString(),
                    'expires_at' => $promo->expires_at?->toISOString(),
                    'is_active' => $promo->is_active,
                    'is_valid' => $promo->isValid(),
                    'is_expired' => $promo->isExpired(),
                    'created_at' => $promo->created_at->toISOString(),
                ];
            });

        return response()->json([
            'promos' => $promos,
        ]);
    }

    /**
     * Get a single promo.
     */
    public function show(Request $request, Promo $promo)
    {
        $store = $request->user()->store;
        
        if (!$store || $promo->store_id !== $store->id) {
            return response()->json([
                'message' => 'Promo not found',
            ], 404);
        }

        return response()->json([
            'promo' => [
                'id' => $promo->id,
                'code' => $promo->code,
                'name' => $promo->name,
                'description' => $promo->description,
                'type' => $promo->type,
                'value' => $promo->value,
                'min_order' => $promo->min_order,
                'max_discount' => $promo->max_discount,
                'max_uses' => $promo->max_uses,
                'used_count' => $promo->used_count,
                'starts_at' => $promo->starts_at?->toISOString(),
                'expires_at' => $promo->expires_at?->toISOString(),
                'is_active' => $promo->is_active,
            ],
        ]);
    }

    /**
     * Create a new promo.
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
            'code' => 'required|string|max:20|alpha_dash',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_order' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'is_active' => 'nullable|boolean',
        ]);

        // Check for duplicate code
        $existingPromo = Promo::where('store_id', $store->id)
            ->where('code', strtoupper($validated['code']))
            ->first();

        if ($existingPromo) {
            return response()->json([
                'message' => 'Kode promo sudah digunakan',
                'errors' => ['code' => ['Kode promo sudah ada']],
            ], 422);
        }

        // Validate percentage value
        if ($validated['type'] === 'percentage' && $validated['value'] > 100) {
            return response()->json([
                'message' => 'Persentase diskon maksimal 100%',
                'errors' => ['value' => ['Persentase maksimal 100%']],
            ], 422);
        }

        $promo = Promo::create([
            'store_id' => $store->id,
            'code' => $validated['code'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'value' => $validated['value'],
            'min_order' => $validated['min_order'] ?? null,
            'max_discount' => $validated['max_discount'] ?? null,
            'max_uses' => $validated['max_uses'] ?? null,
            'starts_at' => $validated['starts_at'] ?? null,
            'expires_at' => $validated['expires_at'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Promo created successfully',
            'promo' => $promo,
        ], 201);
    }

    /**
     * Update a promo.
     */
    public function update(Request $request, Promo $promo)
    {
        $store = $request->user()->store;
        
        if (!$store || $promo->store_id !== $store->id) {
            return response()->json([
                'message' => 'Promo not found',
            ], 404);
        }

        $validated = $request->validate([
            'code' => 'sometimes|string|max:20|alpha_dash',
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:500',
            'type' => 'sometimes|in:percentage,fixed',
            'value' => 'sometimes|numeric|min:0',
            'min_order' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        ]);

        // Check for duplicate code if code is being changed
        if (isset($validated['code']) && strtoupper($validated['code']) !== $promo->code) {
            $existingPromo = Promo::where('store_id', $store->id)
                ->where('code', strtoupper($validated['code']))
                ->first();

            if ($existingPromo) {
                return response()->json([
                    'message' => 'Kode promo sudah digunakan',
                    'errors' => ['code' => ['Kode promo sudah ada']],
                ], 422);
            }
        }

        $promo->update($validated);

        return response()->json([
            'message' => 'Promo updated successfully',
            'promo' => $promo->fresh(),
        ]);
    }

    /**
     * Delete a promo.
     */
    public function destroy(Request $request, Promo $promo)
    {
        $store = $request->user()->store;
        
        if (!$store || $promo->store_id !== $store->id) {
            return response()->json([
                'message' => 'Promo not found',
            ], 404);
        }

        $promo->delete();

        return response()->json([
            'message' => 'Promo deleted successfully',
        ]);
    }

    /**
     * Validate a promo code (public endpoint).
     */
    public function validate(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'code' => 'required|string',
            'order_amount' => 'nullable|numeric|min:0',
        ]);

        $promo = Promo::where('store_id', $validated['store_id'])
            ->where('code', strtoupper($validated['code']))
            ->first();

        if (!$promo) {
            return response()->json([
                'valid' => false,
                'message' => 'Kode promo tidak ditemukan',
            ]);
        }

        $orderAmount = $validated['order_amount'] ?? 0;
        $error = $promo->getValidationError($orderAmount);

        if ($error) {
            return response()->json([
                'valid' => false,
                'message' => $error,
            ]);
        }

        $discount = $promo->calculateDiscount($orderAmount);

        return response()->json([
            'valid' => true,
            'promo' => [
                'code' => $promo->code,
                'name' => $promo->name,
                'type' => $promo->type,
                'value' => $promo->value,
                'formatted_value' => $promo->formatted_value,
            ],
            'discount' => $discount,
            'formatted_discount' => 'Rp ' . number_format($discount, 0, ',', '.'),
        ]);
    }
}
