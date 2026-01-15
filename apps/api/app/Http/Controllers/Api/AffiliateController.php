<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Affiliate;
use App\Models\AffiliateReferral;
use App\Models\AffiliatePayout;
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
                'payout_info' => $affiliate->payout_info,
                'referral_url' => $affiliate->isApproved() ? $affiliate->getReferralUrl() : null,
                'created_at' => $affiliate->created_at,
                'approved_at' => $affiliate->approved_at,
            ],
        ]);
    }

    /**
     * Apply to become an affiliate (with required bank info)
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
            'bank_name' => 'required|string|max:100',
            'bank_account' => 'required|string|max:50',
            'account_name' => 'required|string|max:100',
        ]);

        // Validate account name matches user's name (case-insensitive)
        if (strtolower(trim($validated['account_name'])) !== strtolower(trim($user->name))) {
            return response()->json([
                'message' => 'Nama pemilik rekening harus sama dengan nama lengkap Anda yang terdaftar',
                'errors' => [
                    'account_name' => ['Nama pemilik rekening harus sama dengan: ' . $user->name]
                ]
            ], 422);
        }

        $affiliate = Affiliate::create([
            'user_id' => $user->id,
            'code' => Affiliate::generateUniqueCode(),
            'status' => Affiliate::STATUS_PENDING,
            'motivation' => $validated['motivation'],
            'payout_info' => [
                'bank_name' => $validated['bank_name'],
                'bank_account' => $validated['bank_account'],
                'account_name' => $validated['account_name'],
            ],
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

        // Get recent payouts
        $payouts = AffiliatePayout::where('affiliate_id', $affiliate->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'amount' => $p->amount,
                'formatted_amount' => $p->formatted_amount,
                'status' => $p->status,
                'status_label' => $p->status_label,
                'created_at' => $p->created_at,
                'completed_at' => $p->completed_at,
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
                'payout_info' => $affiliate->payout_info,
            ],
            'recent_referrals' => $referrals,
            'recent_payouts' => $payouts,
            'monthly_stats' => $monthlyStats,
        ]);
    }

    /**
     * Update payout info (bank account details)
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

        // Validate account name matches user's name
        if (strtolower(trim($validated['account_name'])) !== strtolower(trim($user->name))) {
            return response()->json([
                'message' => 'Nama pemilik rekening harus sama dengan nama lengkap Anda yang terdaftar',
                'errors' => [
                    'account_name' => ['Nama pemilik rekening harus sama dengan: ' . $user->name]
                ]
            ], 422);
        }

        $affiliate->payout_info = $validated;
        $affiliate->save();

        return response()->json([
            'message' => 'Info pembayaran berhasil diperbarui',
            'payout_info' => $affiliate->payout_info,
        ]);
    }

    /**
     * Request payout (withdrawal)
     */
    public function requestPayout(Request $request): JsonResponse
    {
        $user = Auth::user();
        $affiliate = Affiliate::where('user_id', $user->id)->first();

        if (!$affiliate || !$affiliate->isApproved()) {
            return response()->json(['message' => 'Affiliate tidak ditemukan atau belum disetujui'], 404);
        }

        // Check if bank info is complete
        if (!$affiliate->payout_info || empty($affiliate->payout_info['bank_name'])) {
            return response()->json([
                'message' => 'Silakan lengkapi info rekening bank terlebih dahulu'
            ], 422);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:50000', // Minimum Rp 50.000
        ]);

        // Check sufficient balance
        if ($validated['amount'] > $affiliate->pending_payout) {
            return response()->json([
                'message' => 'Saldo tidak mencukupi. Saldo tersedia: Rp ' . number_format($affiliate->pending_payout, 0, ',', '.')
            ], 422);
        }

        // Check for pending payout request
        $pendingPayout = AffiliatePayout::where('affiliate_id', $affiliate->id)
            ->whereIn('status', ['pending', 'approved', 'processing'])
            ->first();
        
        if ($pendingPayout) {
            return response()->json([
                'message' => 'Anda masih memiliki permintaan penarikan yang sedang diproses'
            ], 422);
        }

        $payout = AffiliatePayout::create([
            'affiliate_id' => $affiliate->id,
            'amount' => $validated['amount'],
            'status' => AffiliatePayout::STATUS_PENDING,
            'bank_name' => $affiliate->payout_info['bank_name'],
            'bank_account' => $affiliate->payout_info['bank_account'],
            'account_holder_name' => $affiliate->payout_info['account_name'],
        ]);

        return response()->json([
            'message' => 'Permintaan penarikan berhasil dikirim. Harap tunggu proses verifikasi admin.',
            'payout' => [
                'id' => $payout->id,
                'amount' => $payout->amount,
                'formatted_amount' => $payout->formatted_amount,
                'status' => $payout->status,
                'status_label' => $payout->status_label,
            ],
        ], 201);
    }

    /**
     * Get payout history
     */
    public function payoutHistory(): JsonResponse
    {
        $user = Auth::user();
        $affiliate = Affiliate::where('user_id', $user->id)->first();

        if (!$affiliate) {
            return response()->json(['message' => 'Affiliate tidak ditemukan'], 404);
        }

        $payouts = AffiliatePayout::where('affiliate_id', $affiliate->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'amount' => $p->amount,
                'formatted_amount' => $p->formatted_amount,
                'status' => $p->status,
                'status_label' => $p->status_label,
                'bank_name' => $p->bank_name,
                'bank_account' => $p->bank_account,
                'account_holder_name' => $p->account_holder_name,
                'admin_notes' => $p->admin_notes,
                'created_at' => $p->created_at,
                'processed_at' => $p->processed_at,
                'completed_at' => $p->completed_at,
            ]);

        return response()->json([
            'payouts' => $payouts,
            'pending_balance' => $affiliate->pending_payout,
            'formatted_pending_balance' => 'Rp ' . number_format($affiliate->pending_payout, 0, ',', '.'),
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

