<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add Duitku-specific columns to payments table.
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            if (!Schema::hasColumn('payments', 'duitku_reference')) {
                $table->string('duitku_reference')->nullable()->after('mayar_link_url');
            }
            if (!Schema::hasColumn('payments', 'duitku_merchant_order_id')) {
                $table->string('duitku_merchant_order_id')->nullable()->after('duitku_reference');
            }
            if (!Schema::hasColumn('payments', 'duitku_payment_url')) {
                $table->string('duitku_payment_url')->nullable()->after('duitku_merchant_order_id');
            }
            if (!Schema::hasColumn('payments', 'duitku_va_number')) {
                $table->string('duitku_va_number')->nullable()->after('duitku_payment_url');
            }
            if (!Schema::hasColumn('payments', 'duitku_qr_string')) {
                $table->text('duitku_qr_string')->nullable()->after('duitku_va_number');
            }
            if (!Schema::hasColumn('payments', 'payment_gateway')) {
                $table->string('payment_gateway')->nullable()->default('mayar')->after('payment_method');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'duitku_reference',
                'duitku_merchant_order_id', 
                'duitku_payment_url',
                'duitku_va_number',
                'duitku_qr_string',
                'payment_gateway',
            ]);
        });
    }
};
