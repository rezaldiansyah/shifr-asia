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
        Schema::table('orders', function (Blueprint $table) {
            // customer_email already exists in orders table
            if (!Schema::hasColumn('orders', 'email_sent_buyer')) {
                $table->boolean('email_sent_buyer')->default(false)->after('wa_sent_seller');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['email_sent_buyer']);
        });
    }
};

