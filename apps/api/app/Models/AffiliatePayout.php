<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AffiliatePayout extends Model
{
    use HasFactory;

    protected $fillable = [
        'affiliate_id',
        'amount',
        'status',
        'bank_name',
        'bank_account',
        'account_holder_name',
        'processed_by',
        'admin_notes',
        'transfer_proof',
        'processed_at',
        'completed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'processed_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_PROCESSING = 'processing';
    const STATUS_COMPLETED = 'completed';

    /**
     * The affiliate who requested this payout
     */
    public function affiliate(): BelongsTo
    {
        return $this->belongsTo(Affiliate::class);
    }

    /**
     * The admin who processed this payout
     */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Approve the payout request
     */
    public function approve(int $adminId): bool
    {
        $this->status = self::STATUS_APPROVED;
        $this->processed_by = $adminId;
        $this->processed_at = now();
        return $this->save();
    }

    /**
     * Reject the payout request
     */
    public function reject(int $adminId, string $reason): bool
    {
        $this->status = self::STATUS_REJECTED;
        $this->processed_by = $adminId;
        $this->processed_at = now();
        $this->admin_notes = $reason;
        return $this->save();
    }

    /**
     * Mark as completed (transferred)
     */
    public function markAsCompleted(?string $transferProof = null): bool
    {
        $this->status = self::STATUS_COMPLETED;
        $this->completed_at = now();
        if ($transferProof) {
            $this->transfer_proof = $transferProof;
        }
        
        // Deduct from affiliate's pending_payout and add to total_paid
        $affiliate = $this->affiliate;
        $affiliate->decrement('pending_payout', $this->amount);
        $affiliate->increment('total_paid', $this->amount);
        
        return $this->save();
    }

    /**
     * Get formatted amount
     */
    public function getFormattedAmountAttribute(): string
    {
        return 'Rp ' . number_format($this->amount, 0, ',', '.');
    }

    /**
     * Scope for pending payouts
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            self::STATUS_PENDING => 'Menunggu',
            self::STATUS_APPROVED => 'Disetujui',
            self::STATUS_REJECTED => 'Ditolak',
            self::STATUS_PROCESSING => 'Diproses',
            self::STATUS_COMPLETED => 'Selesai',
            default => $this->status,
        };
    }
}
