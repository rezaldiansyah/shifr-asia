<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SubscriptionController extends Controller
{
    /**
     * Get current user's subscription.
     */
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Get or create subscription
        $subscription = Subscription::where('user_id', $user->id)
            ->active()
            ->first();

        if (!$subscription) {
            // Check if user has a store, create trial if so
            $store = Store::where('user_id', $user->id)->first();
            if ($store) {
                $subscription = Subscription::createTrial($user, $store);
            } else {
                // No subscription and no store
                return response()->json([
                    'subscription' => null,
                    'message' => 'Buat toko terlebih dahulu untuk memulai',
                ]);
            }
        }

        return response()->json([
            'subscription' => $this->formatSubscription($subscription),
        ]);
    }

    /**
     * Get all available tiers.
     */
    public function tiers(): JsonResponse
    {
        return response()->json([
            'tiers' => Subscription::getTiers(),
        ]);
    }

    /**
     * Start a free trial.
     */
    public function startTrial(Request $request): JsonResponse
    {
        $user = $request->user();

        // Check if user already has an active subscription
        $existingSubscription = Subscription::where('user_id', $user->id)
            ->whereIn('status', ['active', 'trial'])
            ->first();

        if ($existingSubscription) {
            return response()->json([
                'message' => 'Anda sudah memiliki langganan aktif',
                'subscription' => $this->formatSubscription($existingSubscription),
            ], 400);
        }

        // Check if user has a store
        $store = Store::where('user_id', $user->id)->first();
        if (!$store) {
            return response()->json([
                'message' => 'Buat toko terlebih dahulu untuk memulai trial',
            ], 400);
        }

        // Check if user already used trial
        $usedTrial = Subscription::where('user_id', $user->id)
            ->where('status', 'trial')
            ->exists();

        // Allow trial even if used before (for MVP, can restrict later)
        $subscription = Subscription::createTrial($user, $store);

        return response()->json([
            'message' => 'Trial 3 bulan berhasil diaktifkan!',
            'subscription' => $this->formatSubscription($subscription),
        ]);
    }

    /**
     * Request tier change (creates payment for upgrade).
     */
    public function changeTier(Request $request): JsonResponse
    {
        $request->validate([
            'tier' => 'required|string|in:free,starter,growth,pro',
            'period' => 'sometimes|string|in:monthly,yearly',
        ]);

        $user = $request->user();
        $newTier = $request->tier;
        $period = $request->period ?? 'monthly';

        $subscription = Subscription::where('user_id', $user->id)
            ->active()
            ->first();

        if (!$subscription) {
            return response()->json([
                'message' => 'Tidak ada langganan aktif',
            ], 400);
        }

        // Get tier configs
        $currentConfig = Subscription::$tiers[$subscription->tier] ?? null;
        $newConfig = Subscription::$tiers[$newTier] ?? null;

        if (!$newConfig) {
            return response()->json([
                'message' => 'Tier tidak valid',
            ], 400);
        }

        // Check if downgrade would exceed product limit
        if ($subscription->canDowngradeTo($newTier)) {
            $store = Store::where('user_id', $user->id)->first();
            if ($store) {
                $productCount = $store->products()->count();
                $newLimit = $newConfig['product_limit'];
                
                if ($productCount > $newLimit) {
                    return response()->json([
                        'message' => "Tidak dapat downgrade. Anda memiliki {$productCount} produk, tapi tier {$newConfig['name']} hanya mengizinkan {$newLimit} produk. Hapus beberapa produk terlebih dahulu.",
                        'product_count' => $productCount,
                        'new_limit' => $newLimit,
                    ], 400);
                }
            }
        }

        // For upgrade, redirect to payment checkout
        if ($subscription->canUpgradeTo($newTier)) {
            return response()->json([
                'message' => 'Silakan lakukan pembayaran untuk upgrade',
                'action' => 'checkout',
                'checkout_url' => '/api/payment/checkout',
                'tier' => $newTier,
                'price' => $newConfig['price'],
                'price_formatted' => $newConfig['price_formatted'],
                'period' => $period,
            ]);
        }

        // Downgrade is allowed (will take effect immediately for now)
        $subscription->update([
            'tier' => $newTier,
        ]);

        return response()->json([
            'message' => "Tier berhasil diubah ke {$newConfig['name']}",
            'subscription' => $this->formatSubscription($subscription->fresh()),
        ]);
    }

    /**
     * Get subscription usage stats.
     */
    public function usage(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $subscription = Subscription::where('user_id', $user->id)
            ->active()
            ->first();

        $store = Store::where('user_id', $user->id)->first();

        $productCount = $store ? $store->products()->count() : 0;
        $productLimit = $subscription ? $subscription->product_limit : 9;

        return response()->json([
            'usage' => [
                'products' => [
                    'used' => $productCount,
                    'limit' => $productLimit,
                    'percentage' => $productLimit > 0 ? round(($productCount / $productLimit) * 100) : 0,
                    'remaining' => max(0, $productLimit - $productCount),
                ],
            ],
            'tier' => $subscription ? $subscription->tier : 'free',
        ]);
    }

    /**
     * Format subscription for API response.
     */
    private function formatSubscription(Subscription $subscription): array
    {
        return [
            'id' => $subscription->id,
            'tier' => $subscription->tier,
            'tier_name' => $subscription->tier_config['name'],
            'tier_config' => $subscription->tier_config,
            'status' => $subscription->status,
            'starts_at' => $subscription->starts_at?->toISOString(),
            'expires_at' => $subscription->expires_at?->toISOString(),
            'is_active' => $subscription->is_active,
            'is_expired' => $subscription->is_expired,
            'days_remaining' => $subscription->days_remaining,
            'auto_renew' => $subscription->auto_renew,
            'product_limit' => $subscription->product_limit,
        ];
    }
}
