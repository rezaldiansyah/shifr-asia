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
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->string('event_type'); // view, click, order, bio_view, link_click
            $table->string('page')->nullable(); // page URL or identifier
            $table->string('target_type')->nullable(); // product, link, store
            $table->unsignedBigInteger('target_id')->nullable();
            $table->json('metadata')->nullable(); // additional data
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->string('referer')->nullable();
            $table->string('country', 2)->nullable();
            $table->string('city')->nullable();
            $table->timestamps();

            // Indexes for faster queries
            $table->index(['store_id', 'event_type']);
            $table->index(['store_id', 'created_at']);
            $table->index(['target_type', 'target_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
