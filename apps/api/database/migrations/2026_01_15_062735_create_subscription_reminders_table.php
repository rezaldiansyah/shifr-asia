<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Tracks subscription renewal reminders sent to users via email/WhatsApp.
     */
    public function up(): void
    {
        Schema::create('subscription_reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            $table->integer('days_before'); // 30, 15, 10, 5, 3, 1, 0
            $table->enum('channel', ['email', 'whatsapp', 'both'])->default('both');
            
            // Email tracking
            $table->timestamp('email_sent_at')->nullable();
            $table->json('email_response')->nullable();
            
            // WhatsApp tracking
            $table->timestamp('wa_sent_at')->nullable();
            $table->json('wa_response')->nullable();
            
            // Status
            $table->boolean('is_sent')->default(false);
            
            $table->timestamps();
            
            // Ensure only one reminder per subscription per checkpoint
            $table->unique(['subscription_id', 'days_before']);
            
            // Index for finding reminders to send
            $table->index(['subscription_id', 'days_before', 'is_sent']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_reminders');
    }
};
