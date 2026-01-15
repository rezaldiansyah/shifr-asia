<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AdminPaymentController extends Controller
{
    /**
     * Get all payments with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Payment::with('user:id,name,email')
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by gateway
        if ($request->has('gateway') && $request->gateway !== 'all') {
            $query->where('payment_gateway', $request->gateway);
        }

        // Filter by date range
        if ($request->has('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->has('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        // Paginate
        $perPage = $request->get('per_page', 20);
        $payments = $query->paginate($perPage);

        return response()->json([
            'payments' => $payments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'user' => [
                        'id' => $payment->user?->id,
                        'name' => $payment->user?->name,
                        'email' => $payment->user?->email,
                    ],
                    'tier' => $payment->tier,
                    'tier_name' => $payment->tier_name,
                    'amount' => $payment->amount,
                    'formatted_amount' => $payment->formatted_amount,
                    'status' => $payment->status,
                    'is_paid' => $payment->is_paid,
                    'payment_gateway' => $payment->payment_gateway ?? 'mayar',
                    'payment_method' => $payment->payment_method,
                    'duitku_reference' => $payment->duitku_reference,
                    'duitku_va_number' => $payment->duitku_va_number,
                    'paid_at' => $payment->paid_at,
                    'expires_at' => $payment->expires_at,
                    'created_at' => $payment->created_at,
                ];
            }),
            'pagination' => [
                'current_page' => $payments->currentPage(),
                'last_page' => $payments->lastPage(),
                'per_page' => $payments->perPage(),
                'total' => $payments->total(),
            ],
        ]);
    }

    /**
     * Get payment summary statistics.
     */
    public function summary(Request $request): JsonResponse
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        // Payment statistics
        $totalPaid = Payment::where('status', 'paid')->count();
        $totalPending = Payment::where('status', 'pending')
            ->where('expires_at', '>', now())
            ->count();
        $totalRevenue = Payment::where('status', 'paid')->sum('amount');
        $todayRevenue = Payment::where('status', 'paid')
            ->whereDate('paid_at', $today)
            ->sum('amount');
        $monthlyRevenue = Payment::where('status', 'paid')
            ->where('paid_at', '>=', $thisMonth)
            ->sum('amount');

        // Recent payments
        $recentPayments = Payment::with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'user_name' => $payment->user?->name ?? 'Unknown',
                    'tier_name' => $payment->tier_name,
                    'formatted_amount' => $payment->formatted_amount,
                    'status' => $payment->status,
                    'created_at' => $payment->created_at,
                ];
            });

        return response()->json([
            'stats' => [
                'total_paid' => $totalPaid,
                'total_pending' => $totalPending,
                'total_revenue' => $totalRevenue,
                'total_revenue_formatted' => 'Rp ' . number_format($totalRevenue, 0, ',', '.'),
                'today_revenue' => $todayRevenue,
                'today_revenue_formatted' => 'Rp ' . number_format($todayRevenue, 0, ',', '.'),
                'monthly_revenue' => $monthlyRevenue,
                'monthly_revenue_formatted' => 'Rp ' . number_format($monthlyRevenue, 0, ',', '.'),
            ],
            'recent_payments' => $recentPayments,
        ]);
    }

    /**
     * Get subscriptions expiring soon.
     */
    public function expiring(Request $request): JsonResponse
    {
        $days = $request->get('days', 7);

        $expiringSubscriptions = Subscription::with('user:id,name,email,phone')
            ->expiringSoon($days)
            ->orderBy('expires_at', 'asc')
            ->get()
            ->map(function ($subscription) {
                return [
                    'id' => $subscription->id,
                    'user' => [
                        'id' => $subscription->user?->id,
                        'name' => $subscription->user?->name,
                        'email' => $subscription->user?->email,
                        'phone' => $subscription->user?->phone,
                    ],
                    'tier' => $subscription->tier,
                    'tier_name' => $subscription->tier_config['name'] ?? ucfirst($subscription->tier),
                    'status' => $subscription->status,
                    'expires_at' => $subscription->expires_at,
                    'days_remaining' => $subscription->days_remaining,
                    'auto_renew' => $subscription->auto_renew,
                ];
            });

        // Get expired subscriptions (need billing)
        $expiredSubscriptions = Subscription::with('user:id,name,email,phone')
            ->where('status', '!=', 'expired')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->orderBy('expires_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function ($subscription) {
                return [
                    'id' => $subscription->id,
                    'user' => [
                        'id' => $subscription->user?->id,
                        'name' => $subscription->user?->name,
                        'email' => $subscription->user?->email,
                        'phone' => $subscription->user?->phone,
                    ],
                    'tier' => $subscription->tier,
                    'tier_name' => $subscription->tier_config['name'] ?? ucfirst($subscription->tier),
                    'status' => 'expired',
                    'expires_at' => $subscription->expires_at,
                    'days_overdue' => abs($subscription->days_remaining),
                ];
            });

        return response()->json([
            'expiring_soon' => [
                'count' => $expiringSubscriptions->count(),
                'subscriptions' => $expiringSubscriptions,
            ],
            'expired' => [
                'count' => $expiredSubscriptions->count(),
                'subscriptions' => $expiredSubscriptions,
            ],
        ]);
    }

    /**
     * Get single payment detail.
     */
    public function show(Payment $payment): JsonResponse
    {
        $payment->load('user:id,name,email,phone', 'subscription');

        return response()->json([
            'payment' => [
                'id' => $payment->id,
                'user' => [
                    'id' => $payment->user?->id,
                    'name' => $payment->user?->name,
                    'email' => $payment->user?->email,
                    'phone' => $payment->user?->phone,
                ],
                'tier' => $payment->tier,
                'tier_name' => $payment->tier_name,
                'period' => $payment->period,
                'amount' => $payment->amount,
                'formatted_amount' => $payment->formatted_amount,
                'status' => $payment->status,
                'is_paid' => $payment->is_paid,
                'payment_gateway' => $payment->payment_gateway ?? 'mayar',
                'payment_method' => $payment->payment_method,
                'customer_name' => $payment->customer_name,
                'customer_email' => $payment->customer_email,
                'customer_phone' => $payment->customer_phone,
                // Duitku specific
                'duitku_reference' => $payment->duitku_reference,
                'duitku_merchant_order_id' => $payment->duitku_merchant_order_id,
                'duitku_payment_url' => $payment->duitku_payment_url,
                'duitku_va_number' => $payment->duitku_va_number,
                // Mayar specific
                'mayar_payment_id' => $payment->mayar_payment_id,
                'mayar_link_url' => $payment->mayar_link_url,
                // Timestamps
                'paid_at' => $payment->paid_at,
                'expires_at' => $payment->expires_at,
                'created_at' => $payment->created_at,
                'updated_at' => $payment->updated_at,
                // Raw data for debugging
                'metadata' => $payment->metadata,
                'webhook_data' => $payment->webhook_data,
            ],
        ]);
    }

    /**
     * Get dashboard overview (combined).
     */
    public function dashboard(Request $request): JsonResponse
    {
        // Get summary stats
        $totalUsers = User::count();
        $activeSubscriptions = Subscription::whereIn('status', ['active', 'trial'])
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->count();
        
        $totalRevenue = Payment::where('status', 'paid')->sum('amount');
        $thisMonthRevenue = Payment::where('status', 'paid')
            ->where('paid_at', '>=', Carbon::now()->startOfMonth())
            ->sum('amount');

        $pendingPayments = Payment::where('status', 'pending')
            ->where('expires_at', '>', now())
            ->count();

        $expiringIn7Days = Subscription::expiringSoon(7)->count();
        $expiringIn3Days = Subscription::expiringSoon(3)->count();

        // Revenue by tier
        $revenueByTier = Payment::where('status', 'paid')
            ->selectRaw('tier, SUM(amount) as total, COUNT(*) as count')
            ->groupBy('tier')
            ->get()
            ->map(function ($item) {
                return [
                    'tier' => $item->tier,
                    'total' => $item->total,
                    'total_formatted' => 'Rp ' . number_format($item->total, 0, ',', '.'),
                    'count' => $item->count,
                ];
            });

        return response()->json([
            'overview' => [
                'total_users' => $totalUsers,
                'active_subscriptions' => $activeSubscriptions,
                'pending_payments' => $pendingPayments,
                'total_revenue' => $totalRevenue,
                'total_revenue_formatted' => 'Rp ' . number_format($totalRevenue, 0, ',', '.'),
                'this_month_revenue' => $thisMonthRevenue,
                'this_month_revenue_formatted' => 'Rp ' . number_format($thisMonthRevenue, 0, ',', '.'),
            ],
            'alerts' => [
                'expiring_in_3_days' => $expiringIn3Days,
                'expiring_in_7_days' => $expiringIn7Days,
            ],
            'revenue_by_tier' => $revenueByTier,
        ]);
    }
}
