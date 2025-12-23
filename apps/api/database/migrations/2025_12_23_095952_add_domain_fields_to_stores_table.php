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
        Schema::table('stores', function (Blueprint $table) {
            // Subdomain (e.g., "tokoku" -> tokoku.shifr.asia)
            $table->string('subdomain')->nullable()->unique()->after('domain');
            
            // Custom domain (e.g., "shop.mybrand.com")
            $table->string('custom_domain')->nullable()->unique()->after('subdomain');
            
            // Domain verification status
            $table->boolean('domain_verified')->default(false)->after('custom_domain');
            
            // SSL certificate status
            $table->enum('ssl_status', ['none', 'pending', 'active'])->default('none')->after('domain_verified');
            
            // DNS verification token (TXT record value)
            $table->string('verification_token')->nullable()->after('ssl_status');
            
            // SSL certificate expiration
            $table->timestamp('ssl_expires_at')->nullable()->after('verification_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn([
                'subdomain',
                'custom_domain',
                'domain_verified',
                'ssl_status',
                'verification_token',
                'ssl_expires_at',
            ]);
        });
    }
};
