<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Affiliate;
use App\Models\AffiliateReferral;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AffiliateController extends Controller
{
    /**
     * Get current user's affiliate status
     */
    public function status(): JsonResponse
    {
        $user = Auth::user();
        $affiliate = Affiliate::where('user_id', $user->id)->first();

        if (!$affiliate) {
            return response()->json([
                'is_affiliate' => false,
                'can_apply' => true,
                'message' => 'Anda belum terdaftar sebagai affiliate',
            ]);
        }

        return response()->json([
            'is_affiliate' => true,
            'affiliate' => [
                'id' => $affiliate->id,
                'code' => $affiliate->code,
                'status' => $affiliate->status,
                'status_label' => $affiliate->status_label,
                'commission_rate' => $affiliate->commission_rate,
                'total_clicks' => $affiliate->total_clicks,
                'total_referrals' => $affiliate->total_referrals,
                'total_earnings' => $affiliate->total_earnings,
                'pending_payout' => $affiliate->pending_payout,
                'total_paid' => $affiliate->total_paid,
                'referral_url' => $affiliate->isApproved() ? $affiliate->getReferralUrl() : null,
                'created_at' => $affiliate->created_at,
                'approved_at' => $affiliate->approved_at,
            ],
        ]);
    }

    /**
     * Apply to become an affiliate
     */
    public function apply(Request $request): JsonResponse
    {
        $user = Auth::user();

        // Check if already applied
        $existing = Affiliate::where('user_id', $user->id)->first();
        if ($existing) {
            return response()->json([
                'message' => 'Anda sudah pernah mendaftar sebagai affiliate',
                'status' => $existing->status,
                'status_label' => $existing->status_label,
            ], 422);
        }

        $validated = $request->validate([
            'motivation' => 'required|string|min:20|max:1000',
            'payout_info' => 'nullable|array',
            'payout_info.bank_name' => 'nullable|string|max:100',
            'payout_info.bank_account' => 'nullable|string|max:50',
            'payout_info.account_name' => 'nullable|string|max:100',
        ]);

        $affiliate = Affiliate::create([
            'user_id' => $user->id,
            'code' => Affiliate::generateUniqueCode(),
            'status' => Affiliate::STATUS_PENDING,
            'motivation' => $validated['motivation'],
            'payout_info' => $validated['payout_info'] ?? null,
        ]);

        return response()->json([
            'message' => 'Pendaftaran affiliate berhasil dikirim. Harap tunggu persetujuan admin.',
            'affiliate' => [
                'id' => $affiliate->id,
                'code' => $affiliate->code,
                'status' => $affiliate->status,
                'status_label' => $affiliate->status_label,
            ],
        ], 201);
    }

    /**
     * Get affiliate dashboard data
     */
    public function dashboard(): JsonResponse
    {
        $user = Auth::user();
        $affiliate = Affiliate::where('user_id', $user->id)->first();

        if (!$affiliate) {
            return response()->json([
                'message' => 'Anda belum terdaftar sebagai affiliate',
            ], 404);
        }

        if (!$affiliate->isApproved()) {
            return response()->json([
                'message' => 'Affiliate Anda belum disetujui',
                'status' => $affiliate->status,
                'status_label' => $affiliate->status_label,
            ], 403);
        }

        // Get recent referrals
        $referrals = AffiliateReferral::where('affiliate_id', $affiliate->id)
            ->with('referredUser:id,name,email')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'user_name' => $r->referredUser?->name,
                'tier' => $r->tier,
                'commission_amount' => $r->commission_amount,
                'formatted_commission' => $r->formatted_commission,
                'status' => $r->status,
                'created_at' => $r->created_at,
            ]);

        // Get stats by month (last 6 months)
        $monthlyStats = AffiliateReferral::where('affiliate_id', $affiliate->id)
            ->where('created_at', '>=', now()->subMonths(6))
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count, SUM(commission_amount) as total')
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->get();

        return response()->json([
            'affiliate' => [
                'id' => $affiliate->id,
                'code' => $affiliate->code,
                'referral_url' => $affiliate->getReferralUrl(),
                'commission_rate' => $affiliate->commission_rate,
                'total_clicks' => $affiliate->total_clicks,
                'total_referrals' => $affiliate->total_referrals,
                'total_earnings' => $affiliate->total_earnings,
                'pending_payout' => $affiliate->pending_payout,
                'total_paid' => $affiliate->total_paid,
                'formatted_earnings' => 'Rp ' . number_format($affiliate->total_earnings, 0, ',', '.'),
                'formatted_pending' => 'Rp ' . number_format($affiliate->pending_payout, 0, ',', '.'),
            ],
            'recent_referrals' => $referrals,
            'monthly_stats' => $monthlyStats,
        ]);
    }

    /**
     * Update payout info
     */
    public function updatePayoutInfo(Request $request): JsonResponse
    {
        $user = Auth::user();
        $affiliate = Affiliate::where('user_id', $user->id)->first();

        if (!$affiliate) {
            return response()->json(['message' => 'Affiliate tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'bank_name' => 'required|string|max:100',
            'bank_account' => 'required|string|max:50',
            'account_name' => 'required|string|max:100',
        ]);

        $affiliate->payout_info = $validated;
        $affiliate->save();

        return response()->json([
            'message' => 'Info pembayaran berhasil diperbarui',
        ]);
    }

    /**
     * Track affiliate link click (public, no auth required)
     */
    public function trackClick(Request $request): JsonResponse
    {
        $code = $request->input('code');
        
        if (!$code) {
            return response()->json(['success' => false], 400);
        }

        $affiliate = Affiliate::where('code', $code)->approved()->first();
        
        if ($affiliate) {
            $affiliate->incrementClicks();
            
            return response()->json([
                'success' => true,
                'code' => $code,
            ]);
        }

        return response()->json(['success' => false], 404);
    }
}
