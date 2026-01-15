<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionReminder;
use App\Services\EmailService;
use App\Services\WhatsAppService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSubscriptionController extends Controller
{
    /**
     * Get subscription overview with expiring alerts.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Subscription::with('user:id,name,email,phone')
            ->orderBy('expires_at', 'asc');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by tier
        if ($request->has('tier') && $request->tier !== 'all') {
            $query->where('tier', $request->tier);
        }

        // Filter for expiring soon
        if ($request->has('expiring_days')) {
            $days = (int) $request->expiring_days;
            $query->whereIn('status', ['active', 'trial'])
                ->whereNotNull('expires_at')
                ->whereBetween('expires_at', [now(), now()->addDays($days)]);
        }

        $subscriptions = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'subscriptions' => $subscriptions->map(function ($sub) {
                return [
                    'id' => $sub->id,
                    'user' => [
                        'id' => $sub->user?->id,
                        'name' => $sub->user?->name,
                        'email' => $sub->user?->email,
                        'phone' => $sub->user?->phone,
                    ],
                    'tier' => $sub->tier,
                    'tier_name' => $sub->tier_config['name'] ?? ucfirst($sub->tier),
                    'status' => $sub->status,
                    'expires_at' => $sub->expires_at,
                    'days_remaining' => $sub->days_remaining,
                    'is_active' => $sub->is_active,
                    'auto_renew' => $sub->auto_renew,
                    'reminders_sent' => $sub->reminders()->where('is_sent', true)->count(),
                ];
            }),
            'pagination' => [
                'current_page' => $subscriptions->currentPage(),
                'last_page' => $subscriptions->lastPage(),
                'per_page' => $subscriptions->perPage(),
                'total' => $subscriptions->total(),
            ],
        ]);
    }

    /**
     * Get reminder history for all subscriptions.
     */
    public function reminders(Request $request): JsonResponse
    {
        $query = SubscriptionReminder::with(['subscription.user:id,name,email,phone'])
            ->orderBy('created_at', 'desc');

        // Filter by days_before
        if ($request->has('days_before')) {
            $query->where('days_before', $request->days_before);
        }

        // Filter by sent status
        if ($request->has('sent')) {
            $query->where('is_sent', $request->sent === 'true');
        }

        $reminders = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'reminders' => $reminders->map(function ($reminder) {
                return [
                    'id' => $reminder->id,
                    'subscription_id' => $reminder->subscription_id,
                    'user' => [
                        'name' => $reminder->subscription->user?->name,
                        'email' => $reminder->subscription->user?->email,
                        'phone' => $reminder->subscription->user?->phone,
                    ],
                    'tier' => $reminder->subscription->tier,
                    'days_before' => $reminder->days_before,
                    'channel' => $reminder->channel,
                    'email_sent_at' => $reminder->email_sent_at,
                    'wa_sent_at' => $reminder->wa_sent_at,
                    'is_sent' => $reminder->is_sent,
                    'urgency_level' => $reminder->urgency_level,
                    'created_at' => $reminder->created_at,
                ];
            }),
            'pagination' => [
                'current_page' => $reminders->currentPage(),
                'last_page' => $reminders->lastPage(),
                'per_page' => $reminders->perPage(),
                'total' => $reminders->total(),
            ],
        ]);
    }

    /**
     * Get reminder statistics.
     */
    public function reminderStats(): JsonResponse
    {
        $today = Carbon::today();

        // Count by checkpoint
        $byCheckpoint = [];
        foreach (SubscriptionReminder::CHECKPOINTS as $days) {
            $byCheckpoint[$days] = [
                'sent' => SubscriptionReminder::where('days_before', $days)->where('is_sent', true)->count(),
                'pending' => SubscriptionReminder::where('days_before', $days)->where('is_sent', false)->count(),
            ];
        }

        // Expiring subscriptions by timeframe
        $expiring = [
            'in_3_days' => Subscription::expiringSoon(3)->count(),
            'in_7_days' => Subscription::expiringSoon(7)->count(),
            'in_30_days' => Subscription::expiringSoon(30)->count(),
        ];

        // Recently expired (need follow-up)
        $expired = Subscription::whereIn('status', ['active', 'trial'])
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->count();

        return response()->json([
            'by_checkpoint' => $byCheckpoint,
            'expiring' => $expiring,
            'expired' => $expired,
            'total_reminders_sent' => SubscriptionReminder::where('is_sent', true)->count(),
        ]);
    }

    /**
     * Send manual reminder to a specific subscription.
     */
    public function sendReminder(
        Request $request, 
        Subscription $subscription,
        EmailService $emailService,
        WhatsAppService $waService
    ): JsonResponse {
        $request->validate([
            'channel' => 'required|in:email,whatsapp,both',
            'days_before' => 'required|integer|in:' . implode(',', SubscriptionReminder::CHECKPOINTS),
        ]);

        $user = $subscription->user;
        if (!$user) {
            return response()->json(['message' => 'User not found for this subscription'], 404);
        }

        $channel = $request->channel;
        $daysBefore = $request->days_before;
        
        // Create reminder record
        $reminder = SubscriptionReminder::firstOrCreate(
            [
                'subscription_id' => $subscription->id,
                'days_before' => $daysBefore,
            ],
            [
                'channel' => $channel,
            ]
        );

        $results = [
            'email' => null,
            'whatsapp' => null,
        ];

        // Send email
        if (in_array($channel, ['email', 'both'])) {
            try {
                $emailSent = $emailService->sendSubscriptionReminder($user, $subscription, $daysBefore);
                if ($emailSent) {
                    $reminder->markEmailSent(['status' => 'sent', 'sent_at' => now()->toIso8601String()]);
                    $results['email'] = 'sent';
                } else {
                    $results['email'] = 'failed';
                }
            } catch (\Exception $e) {
                $results['email'] = 'error: ' . $e->getMessage();
            }
        }

        // Send WhatsApp
        if (in_array($channel, ['whatsapp', 'both'])) {
            if (!$user->phone) {
                $results['whatsapp'] = 'no phone number';
            } else {
                try {
                    $waSent = $waService->sendSubscriptionReminder($user, $subscription, $daysBefore);
                    if ($waSent) {
                        $reminder->markWaSent(['status' => 'sent', 'sent_at' => now()->toIso8601String()]);
                        $results['whatsapp'] = 'sent';
                    } else {
                        $results['whatsapp'] = 'failed';
                    }
                } catch (\Exception $e) {
                    $results['whatsapp'] = 'error: ' . $e->getMessage();
                }
            }
        }

        return response()->json([
            'message' => 'Reminder processed',
            'results' => $results,
            'reminder' => [
                'id' => $reminder->id,
                'is_sent' => $reminder->fresh()->is_sent,
            ],
        ]);
    }

    /**
     * Run reminder check for a specific checkpoint (for testing/manual trigger).
     */
    public function runReminderCheck(Request $request): JsonResponse
    {
        $request->validate([
            'checkpoint' => 'required|integer|in:' . implode(',', SubscriptionReminder::CHECKPOINTS),
            'dry_run' => 'boolean',
        ]);

        $checkpoint = $request->checkpoint;
        $dryRun = $request->boolean('dry_run', false);

        // Run the artisan command
        $exitCode = \Artisan::call('subscription:send-reminders', [
            '--checkpoint' => $checkpoint,
            '--dry-run' => $dryRun,
        ]);

        $output = \Artisan::output();

        return response()->json([
            'message' => $dryRun ? 'Dry run completed' : 'Reminder check completed',
            'checkpoint' => $checkpoint,
            'dry_run' => $dryRun,
            'exit_code' => $exitCode,
            'output' => $output,
        ]);
    }
}
