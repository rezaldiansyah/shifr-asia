<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TemplateController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\PublicStoreController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\BusinessCardController;
use App\Http\Controllers\Api\PublicCardController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\DomainController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\LinkController;
use App\Http\Controllers\Api\PromoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Shifr Asia
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);

// Templates (public - for preview)
Route::get('/templates', [TemplateController::class, 'index']);
Route::get('/templates/{template}', [TemplateController::class, 'show']);

// Public store (for store frontend)
Route::get('/stores/{slug}', [PublicStoreController::class, 'show']);
Route::get('/stores/subdomain/{subdomain}', [PublicStoreController::class, 'showBySubdomain']);
Route::get('/stores/domain/{domain}', [PublicStoreController::class, 'showByDomain']);

// Public order routes (for buyers)
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/track/{orderNumber}', [OrderController::class, 'showByOrderNumber']);

// Public business card routes
Route::get('/cards/{slug}', [PublicCardController::class, 'show']);
Route::get('/cards/{slug}/vcard', [PublicCardController::class, 'vcard']);
Route::get('/cards/{slug}/qr', [PublicCardController::class, 'qrCode']);

// Public subscription tiers (for pricing page)
Route::get('/subscription/tiers', [SubscriptionController::class, 'tiers']);

// Analytics tracking (public)
Route::post('/analytics/track', [AnalyticsController::class, 'track']);

// Public promo validation
Route::post('/promos/validate', [PromoController::class, 'validate']);

// Public links (for bio page)
Route::get('/links/{storeSlug}', [LinkController::class, 'publicIndex']);
Route::post('/links/{link}/click', [LinkController::class, 'trackClick']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::post('/resend-verification', [AuthController::class, 'resendVerification']);

    // Store
    Route::get('/store', [StoreController::class, 'show']);
    Route::post('/store', [StoreController::class, 'store']);
    Route::put('/store', [StoreController::class, 'update']);

    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    Route::post('/products/{product}/images', [ProductController::class, 'uploadImages']);
    Route::delete('/products/{product}/images', [ProductController::class, 'removeImage']);

    // Orders (for sellers)
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);

    // Business Cards
    Route::get('/business-cards', [BusinessCardController::class, 'index']);
    Route::post('/business-cards', [BusinessCardController::class, 'store']);
    Route::get('/business-cards/{businessCard}', [BusinessCardController::class, 'show']);
    Route::put('/business-cards/{businessCard}', [BusinessCardController::class, 'update']);
    Route::delete('/business-cards/{businessCard}', [BusinessCardController::class, 'destroy']);
    Route::post('/business-cards/{businessCard}/photo', [BusinessCardController::class, 'uploadPhoto']);
    Route::get('/business-cards/{businessCard}/qr', [BusinessCardController::class, 'qrCode']);

    // Website Builder - Sections
    Route::get('/section-types', [SectionController::class, 'types']);
    Route::get('/store/sections', [SectionController::class, 'show']);
    Route::put('/store/sections', [SectionController::class, 'update']);
    Route::post('/store/sections', [SectionController::class, 'addSection']);
    Route::delete('/store/sections/{sectionId}', [SectionController::class, 'deleteSection']);
    Route::post('/store/sections/reorder', [SectionController::class, 'reorder']);
    Route::get('/store/preview', [SectionController::class, 'preview']);

    // Domain Management
    Route::get('/domain', [DomainController::class, 'show']);
    Route::put('/domain/subdomain', [DomainController::class, 'updateSubdomain']);
    Route::put('/domain/custom', [DomainController::class, 'setCustomDomain']);
    Route::post('/domain/verify', [DomainController::class, 'verifyDomain']);
    Route::delete('/domain/custom', [DomainController::class, 'removeCustomDomain']);

    // Subscription (authenticated routes only)
    Route::get('/subscription', [SubscriptionController::class, 'show']);
    Route::get('/subscription/usage', [SubscriptionController::class, 'usage']);
    Route::post('/subscription/trial', [SubscriptionController::class, 'startTrial']);
    Route::put('/subscription/tier', [SubscriptionController::class, 'changeTier']);

    // Payment (authenticated routes)
    Route::post('/payment/checkout', [PaymentController::class, 'checkout']);
    Route::get('/payment/callback', [PaymentController::class, 'callback']);
    Route::get('/payment/history', [PaymentController::class, 'history']);

    // Analytics (authenticated routes)
    Route::get('/analytics', [AnalyticsController::class, 'index']);
    Route::get('/analytics/summary', [AnalyticsController::class, 'summary']);
    Route::get('/analytics/charts', [AnalyticsController::class, 'charts']);

    // Links (Link-in-Bio)
    Route::get('/links', [LinkController::class, 'index']);
    Route::post('/links', [LinkController::class, 'store']);
    Route::put('/links/{link}', [LinkController::class, 'update']);
    Route::delete('/links/{link}', [LinkController::class, 'destroy']);
    Route::post('/links/reorder', [LinkController::class, 'reorder']);

    // Promos (Discount Codes)
    Route::get('/promos', [PromoController::class, 'index']);
    Route::post('/promos', [PromoController::class, 'store']);
    Route::get('/promos/{promo}', [PromoController::class, 'show']);
    Route::put('/promos/{promo}', [PromoController::class, 'update']);
    Route::delete('/promos/{promo}', [PromoController::class, 'destroy']);
});

// Payment webhook (public, no auth required)
Route::post('/payment/webhook', [PaymentController::class, 'webhook']); // Mayar
Route::post('/payment/webhook/duitku', [PaymentController::class, 'webhookDuitku']); // Duitku

// Payment methods (public)
Route::post('/payment/methods', [PaymentController::class, 'paymentMethods']);

// Admin routes (require admin role)
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Payment Dashboard
    Route::get('/dashboard', [\App\Http\Controllers\Api\AdminPaymentController::class, 'dashboard']);
    Route::get('/payments', [\App\Http\Controllers\Api\AdminPaymentController::class, 'index']);
    Route::get('/payments/summary', [\App\Http\Controllers\Api\AdminPaymentController::class, 'summary']);
    Route::get('/payments/expiring', [\App\Http\Controllers\Api\AdminPaymentController::class, 'expiring']);
    Route::get('/payments/{payment}', [\App\Http\Controllers\Api\AdminPaymentController::class, 'show']);
    
    // Subscription Management & Reminders
    Route::get('/subscriptions', [\App\Http\Controllers\Api\AdminSubscriptionController::class, 'index']);
    Route::get('/subscriptions/reminders', [\App\Http\Controllers\Api\AdminSubscriptionController::class, 'reminders']);
    Route::get('/subscriptions/reminder-stats', [\App\Http\Controllers\Api\AdminSubscriptionController::class, 'reminderStats']);
    Route::post('/subscriptions/{subscription}/send-reminder', [\App\Http\Controllers\Api\AdminSubscriptionController::class, 'sendReminder']);
    Route::post('/subscriptions/run-reminder-check', [\App\Http\Controllers\Api\AdminSubscriptionController::class, 'runReminderCheck']);
    
    // Affiliate Management
    Route::get('/affiliates', [\App\Http\Controllers\Api\AdminAffiliateController::class, 'index']);
    Route::get('/affiliates/stats', [\App\Http\Controllers\Api\AdminAffiliateController::class, 'stats']);
    Route::get('/affiliates/{affiliate}', [\App\Http\Controllers\Api\AdminAffiliateController::class, 'show']);
    Route::post('/affiliates/{affiliate}/approve', [\App\Http\Controllers\Api\AdminAffiliateController::class, 'approve']);
    Route::post('/affiliates/{affiliate}/reject', [\App\Http\Controllers\Api\AdminAffiliateController::class, 'reject']);
    Route::put('/affiliates/{affiliate}/commission', [\App\Http\Controllers\Api\AdminAffiliateController::class, 'updateCommission']);
    Route::post('/affiliates/{affiliate}/suspend', [\App\Http\Controllers\Api\AdminAffiliateController::class, 'suspend']);
    Route::post('/affiliates/{affiliate}/reactivate', [\App\Http\Controllers\Api\AdminAffiliateController::class, 'reactivate']);
});

// Affiliate routes (authenticated users)
Route::middleware('auth:sanctum')->prefix('affiliate')->group(function () {
    Route::get('/status', [\App\Http\Controllers\Api\AffiliateController::class, 'status']);
    Route::post('/apply', [\App\Http\Controllers\Api\AffiliateController::class, 'apply']);
    Route::get('/dashboard', [\App\Http\Controllers\Api\AffiliateController::class, 'dashboard']);
    Route::put('/payout-info', [\App\Http\Controllers\Api\AffiliateController::class, 'updatePayoutInfo']);
});

// Affiliate click tracking (public, no auth)
Route::post('/affiliate/track-click', [\App\Http\Controllers\Api\AffiliateController::class, 'trackClick']);

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'app' => 'Shifr Asia API',
        'version' => '1.0.0',
    ]);
});

