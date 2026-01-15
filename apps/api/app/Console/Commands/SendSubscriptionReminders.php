<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Models\SubscriptionReminder;
use App\Services\EmailService;
use App\Services\WhatsAppService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendSubscriptionReminders extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'subscription:send-reminders 
                            {--dry-run : Run without actually sending messages}
                            {--checkpoint= : Only process a specific checkpoint (e.g., 30, 15, 10, 5, 3, 1, 0)}';

    /**
     * The console command description.
     */
    protected $description = 'Send subscription renewal reminders via email and WhatsApp at configured checkpoints.';

    /**
     * Execute the console command.
     */
    public function handle(EmailService $emailService, WhatsAppService $waService): int
    {
        $dryRun = $this->option('dry-run');
        $targetCheckpoint = $this->option('checkpoint');

        $checkpoints = SubscriptionReminder::CHECKPOINTS;
        
        if ($targetCheckpoint !== null) {
            $checkpoints = [(int) $targetCheckpoint];
        }

        $this->info('Starting subscription reminder check...');
        $this->info('Checkpoints: ' . implode(', ', $checkpoints));
        
        if ($dryRun) {
            $this->warn('DRY RUN MODE - No messages will be sent');
        }

        $totalSent = 0;
        $totalErrors = 0;

        foreach ($checkpoints as $daysAhead) {
            $this->line('');
            $this->info("Processing {$daysAhead}-day checkpoint...");
            
            // Find subscriptions expiring in exactly $daysAhead days
            $subscriptions = $this->getSubscriptionsForCheckpoint($daysAhead);
            
            if ($subscriptions->isEmpty()) {
                $this->line("  No subscriptions expiring in {$daysAhead} days");
                continue;
            }

            $this->line("  Found {$subscriptions->count()} subscription(s)");

            foreach ($subscriptions as $subscription) {
                // Check if reminder already sent
                $existingReminder = $subscription->reminders()
                    ->where('days_before', $daysAhead)
                    ->first();

                if ($existingReminder && $existingReminder->is_sent) {
                    $this->line("  [SKIP] User #{$subscription->user_id} - already sent");
                    continue;
                }

                $user = $subscription->user;
                if (!$user) {
                    $this->warn("  [ERROR] Subscription #{$subscription->id} has no user");
                    continue;
                }

                $this->line("  Processing: {$user->name} ({$user->email})");

                if ($dryRun) {
                    $this->line("    [DRY] Would send {$daysAhead}-day reminder");
                    $totalSent++;
                    continue;
                }

                // Create or update reminder record
                $reminder = SubscriptionReminder::firstOrCreate(
                    [
                        'subscription_id' => $subscription->id,
                        'days_before' => $daysAhead,
                    ],
                    [
                        'channel' => 'both',
                    ]
                );

                // Send Email
                $emailSent = false;
                try {
                    $emailSent = $emailService->sendSubscriptionReminder($user, $subscription, $daysAhead);
                    if ($emailSent) {
                        $reminder->markEmailSent(['status' => 'sent', 'sent_at' => now()->toIso8601String()]);
                        $this->line("    ✓ Email sent");
                    }
                } catch (\Exception $e) {
                    $this->error("    ✗ Email failed: " . $e->getMessage());
                    $reminder->email_response = ['error' => $e->getMessage()];
                    $reminder->save();
                }

                // Send WhatsApp
                $waSent = false;
                if ($user->phone) {
                    try {
                        $waSent = $waService->sendSubscriptionReminder($user, $subscription, $daysAhead);
                        if ($waSent) {
                            $reminder->markWaSent(['status' => 'sent', 'sent_at' => now()->toIso8601String()]);
                            $this->line("    ✓ WhatsApp sent");
                        }
                    } catch (\Exception $e) {
                        $this->error("    ✗ WhatsApp failed: " . $e->getMessage());
                        $reminder->wa_response = ['error' => $e->getMessage()];
                        $reminder->save();
                    }
                } else {
                    $this->line("    - No phone number, skipping WhatsApp");
                }

                if ($emailSent || $waSent) {
                    $totalSent++;
                } else {
                    $totalErrors++;
                }
            }
        }

        $this->line('');
        $this->info("Completed: {$totalSent} reminder(s) sent, {$totalErrors} error(s)");

        return Command::SUCCESS;
    }

    /**
     * Get subscriptions expiring in exactly $daysAhead days.
     */
    protected function getSubscriptionsForCheckpoint(int $daysAhead)
    {
        $targetDate = Carbon::today()->addDays($daysAhead);
        
        return Subscription::with('user')
            ->whereIn('status', ['active', 'trial'])
            ->whereNotNull('expires_at')
            ->whereDate('expires_at', $targetDate)
            ->get();
    }
}
