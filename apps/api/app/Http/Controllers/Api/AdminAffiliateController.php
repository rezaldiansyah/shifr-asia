<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Affiliate;
use App\Models\AffiliateReferral;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAffiliateController extends Controller
{
    /**
     * List all affiliate applications/affiliates
     */
    public function index(Request $request): JsonResponse
    {
        $query = Affiliate::with('user:id,name,email,phone');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('code', 'like', "%{$search}%");
        }

        $affiliates = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json([
            'affiliates' => $affiliates->map(fn($a) => [
                'id' => $a->id,
                'user' => $a->user ? [
                    'id' => $a->user->id,
                    'name' => $a->user->name,
                    'email' => $a->user->email,
                    'phone' => $a->user->phone,
                ] : null,
                'code' => $a->code,
                'status' => $a->status,
                'status_label' => $a->status_label,
                'commission_rate' => $a->commission_rate,
                'motivation' => $a->motivation,
                'total_clicks' => $a->total_clicks,
                'total_referrals' => $a->total_referrals,
                'total_earnings' => $a->total_earnings,
                'pending_payout' => $a->pending_payout,
                'created_at' => $a->created_at,
                'approved_at' => $a->approved_at,
            ]),
            'pagination' => [
                'current_page' => $affiliates->currentPage(),
                'last_page' => $affiliates->lastPage(),
                'per_page' => $affiliates->perPage(),
                'total' => $affiliates->total(),
            ],
        ]);
    }

    /**
     * Get affiliate statistics
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_affiliates' => Affiliate::count(),
            'pending_applications' => Affiliate::pending()->count(),
            'approved_affiliates' => Affiliate::approved()->count(),
            'total_clicks' => Affiliate::sum('total_clicks'),
            'total_referrals' => Affiliate::sum('total_referrals'),
            'total_earnings' => Affiliate::sum('total_earnings'),
            'total_pending_payouts' => Affiliate::sum('pending_payout'),
            'total_paid' => Affiliate::sum('total_paid'),
            'formatted_total_earnings' => 'Rp ' . number_format(Affiliate::sum('total_earnings'), 0, ',', '.'),
            'formatted_pending_payouts' => 'Rp ' . number_format(Affiliate::sum('pending_payout'), 0, ',', '.'),
        ];

        return response()->json(['stats' => $stats]);
    }

    /**
     * Get affiliate detail
     */
    public function show(Affiliate $affiliate): JsonResponse
    {
        $affiliate->load(['user', 'approver']);

        $referrals = AffiliateReferral::where('affiliate_id', $affiliate->id)
            ->with('referredUser:id,name,email')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'user' => $r->referredUser ? [
                    'name' => $r->referredUser->name,
                    'email' => $r->referredUser->email,
                ] : null,
                'tier' => $r->tier,
                'subscription_amount' => $r->subscription_amount,
                'commission_amount' => $r->commission_amount,
                'formatted_commission' => $r->formatted_commission,
                'status' => $r->status,
                'created_at' => $r->created_at,
            ]);

        return response()->json([
            'affiliate' => [
                'id' => $affiliate->id,
                'user' => $affiliate->user ? [
                    'id' => $affiliate->user->id,
                    'name' => $affiliate->user->name,
                    'email' => $affiliate->user->email,
                    'phone' => $affiliate->user->phone,
                ] : null,
                'code' => $affiliate->code,
                'status' => $affiliate->status,
                'status_label' => $affiliate->status_label,
                'commission_rate' => $affiliate->commission_rate,
                'motivation' => $affiliate->motivation,
                'admin_notes' => $affiliate->admin_notes,
                'payout_info' => $affiliate->payout_info,
                'total_clicks' => $affiliate->total_clicks,
                'total_referrals' => $affiliate->total_referrals,
                'total_earnings' => $affiliate->total_earnings,
                'pending_payout' => $affiliate->pending_payout,
                'total_paid' => $affiliate->total_paid,
                'approved_at' => $affiliate->approved_at,
                'approver' => $affiliate->approver?->name,
                'created_at' => $affiliate->created_at,
            ],
            'referrals' => $referrals,
        ]);
    }

    /**
     * Approve an affiliate application
     */
    public function approve(Request $request, Affiliate $affiliate): JsonResponse
    {
        if ($affiliate->status !== Affiliate::STATUS_PENDING) {
            return response()->json([
                'message' => 'Hanya aplikasi pending yang dapat disetujui',
            ], 422);
        }

        $validated = $request->validate([
            'commission_rate' => 'nullable|numeric|min:1|max:50',
            'admin_notes' => 'nullable|string|max:500',
        ]);

        if (isset($validated['commission_rate'])) {
            $affiliate->commission_rate = $validated['commission_rate'];
        }
        if (isset($validated['admin_notes'])) {
            $affiliate->admin_notes = $validated['admin_notes'];
        }

        $affiliate->approve(Auth::id());

        // TODO: Send notification to user about approval

        return response()->json([
            'message' => 'Affiliate berhasil disetujui',
            'affiliate' => [
                'id' => $affiliate->id,
                'status' => $affiliate->status,
                'status_label' => $affiliate->status_label,
                'commission_rate' => $affiliate->commission_rate,
            ],
        ]);
    }

    /**
     * Reject an affiliate application
     */
    public function reject(Request $request, Affiliate $affiliate): JsonResponse
    {
        if ($affiliate->status !== Affiliate::STATUS_PENDING) {
            return response()->json([
                'message' => 'Hanya aplikasi pending yang dapat ditolak',
            ], 422);
        }

        $validated = $request->validate([
            'reason' => 'required|string|min:10|max:500',
        ]);

        $affiliate->reject($validated['reason']);

        // TODO: Send notification to user about rejection

        return response()->json([
            'message' => 'Affiliate berhasil ditolak',
            'affiliate' => [
                'id' => $affiliate->id,
                'status' => $affiliate->status,
                'status_label' => $affiliate->status_label,
            ],
        ]);
    }

    /**
     * Update affiliate commission rate
     */
    public function updateCommission(Request $request, Affiliate $affiliate): JsonResponse
    {
        $validated = $request->validate([
            'commission_rate' => 'required|numeric|min:1|max:50',
        ]);

        $affiliate->commission_rate = $validated['commission_rate'];
        $affiliate->save();

        return response()->json([
            'message' => 'Komisi berhasil diperbarui',
            'commission_rate' => $affiliate->commission_rate,
        ]);
    }

    /**
     * Suspend an affiliate
     */
    public function suspend(Request $request, Affiliate $affiliate): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|min:10|max:500',
        ]);

        $affiliate->status = Affiliate::STATUS_SUSPENDED;
        $affiliate->admin_notes = $validated['reason'];
        $affiliate->save();

        return response()->json([
            'message' => 'Affiliate berhasil ditangguhkan',
        ]);
    }

    /**
     * Reactivate a suspended affiliate
     */
    public function reactivate(Affiliate $affiliate): JsonResponse
    {
        if ($affiliate->status !== Affiliate::STATUS_SUSPENDED) {
            return response()->json([
                'message' => 'Affiliate tidak dalam status suspended',
            ], 422);
        }

        $affiliate->status = Affiliate::STATUS_APPROVED;
        $affiliate->save();

        return response()->json([
            'message' => 'Affiliate berhasil diaktifkan kembali',
        ]);
    }
}
