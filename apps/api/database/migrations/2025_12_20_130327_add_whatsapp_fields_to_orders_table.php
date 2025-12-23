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
            $table->foreignId('product_id')->nullable()->after('store_id')->constrained()->nullOnDelete();
            $table->integer('quantity')->default(1)->after('product_id');
            $table->boolean('wa_sent_buyer')->default(false);
            $table->boolean('wa_sent_seller')->default(false);
            $table->timestamp('wa_sent_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->dropColumn(['product_id', 'quantity', 'wa_sent_buyer', 'wa_sent_seller', 'wa_sent_at']);
        });
    }
};
