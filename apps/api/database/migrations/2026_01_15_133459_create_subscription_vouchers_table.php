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
        Schema::create('subscription_vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->enum('type', ['percentage', 'fixed'])->default('percentage');
            $table->decimal('value', 12, 2); // 10% = 10, Rp 50000 = 50000
            $table->decimal('max_discount', 12, 2)->nullable(); // Max discount for percentage
            
            // Which tiers can use this voucher
            $table->json('applicable_tiers')->nullable(); // ['starter', 'growth', 'pro'] or null for all
            
            // Usage limits
            $table->integer('max_uses')->nullable(); // Total max uses
            $table->integer('used_count')->default(0);
            $table->integer('max_uses_per_user')->default(1);
            
            // Validity period
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            $table->index(['code', 'is_active']);
            $table->index(['is_active', 'starts_at', 'expires_at']);
        });
        
        // Add voucher_id to payments table for tracking
        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('voucher_id')->nullable()->after('tier')->constrained('subscription_vouchers')->onDelete('set null');
            $table->decimal('discount_amount', 12, 2)->default(0)->after('amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['voucher_id']);
            $table->dropColumn(['voucher_id', 'discount_amount']);
        });
        
        Schema::dropIfExists('subscription_vouchers');
    }
};
