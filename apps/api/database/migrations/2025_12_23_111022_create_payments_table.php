<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained()->onDelete('set null');
            
            // Mayar specific fields
            $table->string('mayar_payment_id')->unique()->nullable();  // Mayar transaction ID
            $table->string('mayar_link_id')->nullable();               // Payment link ID
            $table->string('mayar_link_url')->nullable();              // Payment URL
            
            // Payment details
            $table->integer('amount');                                  // Amount in Rupiah
            $table->string('tier');                                     // Tier being purchased
            $table->string('period')->default('monthly');               // monthly, yearly
            
            // Status tracking
            $table->enum('status', ['pending', 'paid', 'failed', 'expired', 'refunded', 'cancelled'])
                  ->default('pending');
            
            // Customer info (for Mayar)
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone')->nullable();
            
            // Webhook data
            $table->json('metadata')->nullable();                       // Full webhook/response data
            $table->json('webhook_data')->nullable();                   // Raw webhook payload
            
            // Timestamps
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'status']);
            $table->index('mayar_payment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
