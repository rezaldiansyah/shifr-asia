<?php

/**
 * Test Email Sending with Resend API
 * 
 * Usage: php artisan tinker < test-email.php
 * Or: php artisan tinker, then copy-paste the content
 */

use App\Services\EmailService;
use App\Models\User;

// Create test user object (or use existing)
$testUser = new User([
    'name' => 'Test User',
    'email' => 'raldiansyah339@gmail.com', // Change to your email
    'phone' => '08123456789',
]);
$testUser->id = 999;

// Initialize EmailService
$emailService = app(EmailService::class);

// Test sending welcome email
echo "Testing Welcome Email...\n";
$result = $emailService->sendWelcome($testUser);
echo "Result: " . ($result ? "SUCCESS ✓" : "FAILED ✗") . "\n\n";

echo "Done! Check your email inbox.\n";
