<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Fix subscriptions table to match Subscription model requirements.
     */
    public function up(): void
    {
        // For SQLite, we need to check if columns exist first
        if (!Schema::hasColumn('subscriptions', 'store_id')) {
            Schema::table('subscriptions', function (Blueprint $table) {
                $table->unsignedBigInteger('store_id')->nullable()->after('user_id');
            });
        }

        if (!Schema::hasColumn('subscriptions', 'auto_renew')) {
            Schema::table('subscriptions', function (Blueprint $table) {
                $table->boolean('auto_renew')->default(false)->after('expires_at');
            });
        }

        if (!Schema::hasColumn('subscriptions', 'metadata')) {
            Schema::table('subscriptions', function (Blueprint $table) {
                $table->json('metadata')->nullable()->after('auto_renew');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn(['store_id', 'auto_renew', 'metadata']);
        });
    }
};
