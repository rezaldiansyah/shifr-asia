<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionReminder extends Model
{
    use HasFactory;

    /**
     * The checkpoint days for sending reminders.
     * Reminders are sent at these intervals before subscription expiry.
     */
    public const CHECKPOINTS = [30, 15, 10, 5, 3, 1, 0];

    protected $fillable = [
        'subscription_id',
        'days_before',
        'channel',
        'email_sent_at',
        'email_response',
        'wa_sent_at',
        'wa_response',
        'is_sent',
    ];

    protected $casts = [
        'email_sent_at' => 'datetime',
        'wa_sent_at' => 'datetime',
        'email_response' => 'array',
        'wa_response' => 'array',
        'is_sent' => 'boolean',
    ];

    /**
     * Get the subscription this reminder belongs to.
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * Mark email as sent.
     */
    public function markEmailSent(array $response = []): void
    {
        $this->email_sent_at = now();
        $this->email_response = $response;
        $this->updateSentStatus();
    }

    /**
     * Mark WhatsApp as sent.
     */
    public function markWaSent(array $response = []): void
    {
        $this->wa_sent_at = now();
        $this->wa_response = $response;
        $this->updateSentStatus();
    }

    /**
     * Update is_sent status based on channel requirements.
     */
    protected function updateSentStatus(): void
    {
        if ($this->channel === 'email' && $this->email_sent_at) {
            $this->is_sent = true;
        } elseif ($this->channel === 'whatsapp' && $this->wa_sent_at) {
            $this->is_sent = true;
        } elseif ($this->channel === 'both' && $this->email_sent_at && $this->wa_sent_at) {
            $this->is_sent = true;
        }
        $this->save();
    }

    /**
     * Get urgency level based on days remaining.
     */
    public function getUrgencyLevelAttribute(): string
    {
        return match (true) {
            $this->days_before === 0 => 'expired',
            $this->days_before <= 3 => 'critical',
            $this->days_before <= 7 => 'urgent',
            $this->days_before <= 15 => 'warning',
            default => 'info',
        };
    }

    /**
     * Scope for unsent reminders.
     */
    public function scopeUnsent($query)
    {
        return $query->where('is_sent', false);
    }

    /**
     * Scope for a specific checkpoint.
     */
    public function scopeForCheckpoint($query, int $days)
    {
        return $query->where('days_before', $days);
    }
}
