<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionVoucher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminVoucherController extends Controller
{
    /**
     * List all subscription vouchers
     */
    public function index(Request $request): JsonResponse
    {
        $query = SubscriptionVoucher::with('creator:id,name');

        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'expired') {
                $query->where('expires_at', '<', now());
            }
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
            });
        }

        $vouchers = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'vouchers' => $vouchers->map(fn($v) => [
                'id' => $v->id,
                'code' => $v->code,
                'name' => $v->name,
                'type' => $v->type,
                'value' => $v->value,
                'formatted_value' => $v->formatted_value,
                'max_discount' => $v->max_discount,
                'applicable_tiers' => $v->applicable_tiers,
                'applicable_tiers_text' => $v->applicable_tiers_text,
                'max_uses' => $v->max_uses,
                'used_count' => $v->used_count,
                'starts_at' => $v->starts_at,
                'expires_at' => $v->expires_at,
                'is_active' => $v->is_active,
                'is_valid' => $v->isValid(),
                'created_by' => $v->creator?->name,
                'created_at' => $v->created_at,
            ]),
            'pagination' => [
                'current_page' => $vouchers->currentPage(),
                'last_page' => $vouchers->lastPage(),
                'per_page' => $vouchers->perPage(),
                'total' => $vouchers->total(),
            ],
        ]);
    }

    /**
     * Get voucher statistics
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'stats' => [
                'total_vouchers' => SubscriptionVoucher::count(),
                'active_vouchers' => SubscriptionVoucher::active()->count(),
                'valid_vouchers' => SubscriptionVoucher::valid()->count(),
                'total_used' => SubscriptionVoucher::sum('used_count'),
            ],
        ]);
    }

    /**
     * Create a new voucher
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:subscription_vouchers,code',
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:1',
            'max_discount' => 'nullable|numeric|min:0',
            'applicable_tiers' => 'nullable|array',
            'applicable_tiers.*' => 'in:starter,growth,pro',
            'max_uses' => 'nullable|integer|min:1',
            'max_uses_per_user' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
        ]);

        $voucher = SubscriptionVoucher::create([
            ...$validated,
            'created_by' => Auth::id(),
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Voucher berhasil dibuat',
            'voucher' => $voucher,
        ], 201);
    }

    /**
     * Update a voucher
     */
    public function update(Request $request, SubscriptionVoucher $voucher): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'sometimes|string|max:50|unique:subscription_vouchers,code,' . $voucher->id,
            'name' => 'sometimes|string|max:100',
            'description' => 'nullable|string|max:500',
            'type' => 'sometimes|in:percentage,fixed',
            'value' => 'sometimes|numeric|min:1',
            'max_discount' => 'nullable|numeric|min:0',
            'applicable_tiers' => 'nullable|array',
            'applicable_tiers.*' => 'in:starter,growth,pro',
            'max_uses' => 'nullable|integer|min:1',
            'max_uses_per_user' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $voucher->update($validated);

        return response()->json([
            'message' => 'Voucher berhasil diperbarui',
            'voucher' => $voucher,
        ]);
    }

    /**
     * Toggle voucher active status
     */
    public function toggle(SubscriptionVoucher $voucher): JsonResponse
    {
        $voucher->is_active = !$voucher->is_active;
        $voucher->save();

        return response()->json([
            'message' => $voucher->is_active ? 'Voucher diaktifkan' : 'Voucher dinonaktifkan',
            'is_active' => $voucher->is_active,
        ]);
    }

    /**
     * Delete a voucher
     */
    public function destroy(SubscriptionVoucher $voucher): JsonResponse
    {
        if ($voucher->used_count > 0) {
            return response()->json([
                'message' => 'Tidak dapat menghapus voucher yang sudah digunakan',
            ], 422);
        }

        $voucher->delete();

        return response()->json([
            'message' => 'Voucher berhasil dihapus',
        ]);
    }
}
