<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Store;
use App\Services\ContentModerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Get the current user's store.
     */
    private function getUserStore()
    {
        return Store::where('user_id', Auth::id())->first();
    }

    /**
     * List all products for current user's store.
     */
    public function index(Request $request): JsonResponse
    {
        $store = $this->getUserStore();

        if (!$store) {
            return response()->json([
                'message' => 'Toko belum dibuat',
                'products' => [],
            ], 404);
        }

        $query = $store->products()->ordered();

        // Search
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $products = $query->get();

        return response()->json([
            'products' => $products,
            'total' => $products->count(),
            'limit' => $store->product_limit,
        ]);
    }

    /**
     * Create a new product.
     */
    public function store(Request $request): JsonResponse
    {
        $store = $this->getUserStore();

        if (!$store) {
            return response()->json([
                'message' => 'Anda harus membuat toko terlebih dahulu',
            ], 404);
        }

        // Check product limit
        if ($store->product_count >= $store->product_limit) {
            return response()->json([
                'message' => 'Batas produk tercapai. Upgrade tier untuk menambah lebih banyak produk.',
                'current' => $store->product_count,
                'limit' => $store->product_limit,
            ], 422);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'variants' => 'nullable|array',
            'variants.*.name' => 'required_with:variants|string',
            'variants.*.options' => 'required_with:variants|array',
            'category' => 'nullable|string|max:100',
            'stock' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        // Content moderation check
        $moderation = new ContentModerationService();
        $moderation->validateFields([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? '',
            'category' => $validated['category'] ?? '',
        ]);

        $product = Product::create([
            'store_id' => $store->id,
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . Str::random(5),
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'compare_price' => $validated['compare_price'] ?? null,
            'images' => $validated['images'] ?? [],
            'variants' => $validated['variants'] ?? [],
            'category' => $validated['category'] ?? null,
            'stock' => $validated['stock'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'sort_order' => $store->products()->count(),
        ]);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'product' => $product,
        ], 201);
    }

    /**
     * Get product detail.
     */
    public function show(Product $product): JsonResponse
    {
        $store = $this->getUserStore();

        if (!$store || $product->store_id !== $store->id) {
            return response()->json([
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'product' => $product,
        ]);
    }

    /**
     * Update a product.
     */
    public function update(Request $request, Product $product): JsonResponse
    {
        $store = $this->getUserStore();

        if (!$store || $product->store_id !== $store->id) {
            return response()->json([
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:200',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'images' => 'nullable|array',
            'images.*' => 'string',
            'variants' => 'nullable|array',
            'category' => 'nullable|string|max:100',
            'stock' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        // Content moderation check
        $moderation = new ContentModerationService();
        $moderation->validateFields([
            'name' => $validated['name'] ?? '',
            'description' => $validated['description'] ?? '',
            'category' => $validated['category'] ?? '',
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Produk berhasil diperbarui',
            'product' => $product->fresh(),
        ]);
    }

    /**
     * Delete a product.
     */
    public function destroy(Product $product): JsonResponse
    {
        $store = $this->getUserStore();

        if (!$store || $product->store_id !== $store->id) {
            return response()->json([
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus',
        ]);
    }

    /**
     * Upload images for a product.
     * Uses Cloudflare R2 if configured, otherwise falls back to local storage.
     * Auto-compresses and converts to WebP for optimal performance.
     */
    public function uploadImages(Request $request, Product $product): JsonResponse
    {
        $store = $this->getUserStore();

        if (!$store || $product->store_id !== $store->id) {
            return response()->json([
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp,gif|max:5120', // Allow up to 5MB before compression
        ]);

        $uploadedImages = [];
        $compressionStats = [];
        
        // Determine which disk to use (R2 if configured, otherwise local)
        $r2Key = config('filesystems.disks.r2.key');
        $r2Secret = config('filesystems.disks.r2.secret');
        $r2Url = config('filesystems.disks.r2.url');
        $useR2 = !empty($r2Key) && !empty($r2Secret);
        
        // Initialize image service
        $imageService = new \App\Services\ImageService();
        
        foreach ($request->file('images') as $image) {
            try {
                // Process and compress the image
                $processed = $imageService->processUploadedFile($image);
                
                // Generate filename with proper extension
                $filename = time() . '_' . Str::random(8) . '.' . $processed['extension'];
                $path = 'products/' . $store->id . '/' . $filename;
                
                // Track compression stats
                $compressionStats[] = [
                    'original_size' => $processed['original_size'],
                    'compressed_size' => $processed['processed_size'],
                    'saved_percent' => round((1 - ($processed['processed_size'] / $processed['original_size'])) * 100, 1),
                ];
                
                if ($useR2) {
                    // Upload compressed image to Cloudflare R2
                    Storage::disk('r2')->put($path, $processed['data'], 'public');
                    $url = $r2Url . '/' . $path;
                } else {
                    // Fallback to local storage
                    Storage::disk('public')->put($path, $processed['data']);
                    $url = '/storage/' . $path;
                }
                
                $uploadedImages[] = $url;
                
            } catch (\Exception $e) {
                // If compression fails, upload original as fallback
                \Log::error('Image compression failed, uploading original: ' . $e->getMessage());
                
                $filename = time() . '_' . Str::random(8) . '.' . $image->getClientOriginalExtension();
                $path = 'products/' . $store->id . '/' . $filename;
                
                if ($useR2) {
                    Storage::disk('r2')->put($path, file_get_contents($image), 'public');
                    $url = $r2Url . '/' . $path;
                } else {
                    $storedPath = $image->storeAs('products/' . $store->id, $filename, 'public');
                    $url = '/storage/' . $storedPath;
                }
                
                $uploadedImages[] = $url;
            }
        }

        // Append to existing images
        $existingImages = $product->images ?? [];
        $product->images = array_merge($existingImages, $uploadedImages);
        $product->save();

        // Calculate total savings
        $totalOriginal = array_sum(array_column($compressionStats, 'original_size'));
        $totalCompressed = array_sum(array_column($compressionStats, 'compressed_size'));
        $totalSavedPercent = $totalOriginal > 0 ? round((1 - ($totalCompressed / $totalOriginal)) * 100, 1) : 0;

        return response()->json([
            'message' => 'Gambar berhasil diupload dan dikompres',
            'images' => $product->images,
            'storage' => $useR2 ? 'cloudflare_r2' : 'local',
            'compression' => [
                'original_total' => $this->formatBytes($totalOriginal),
                'compressed_total' => $this->formatBytes($totalCompressed),
                'saved_percent' => $totalSavedPercent . '%',
            ],
        ]);
    }

    /**
     * Format bytes to human readable
     */
    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return round($bytes / 1024, 2) . ' KB';
        }
        return $bytes . ' B';
    }

    /**
     * Remove an image from a product.
     * Automatically detects storage location (R2 or local) based on URL.
     */
    public function removeImage(Request $request, Product $product): JsonResponse
    {
        $store = $this->getUserStore();

        if (!$store || $product->store_id !== $store->id) {
            return response()->json([
                'message' => 'Produk tidak ditemukan',
            ], 404);
        }

        $request->validate([
            'image_url' => 'required|string',
        ]);

        $images = $product->images ?? [];
        $images = array_values(array_filter($images, fn($img) => $img !== $request->image_url));
        $product->images = $images;
        $product->save();

        // Detect storage type and delete file
        $imageUrl = $request->image_url;
        $r2Url = config('filesystems.disks.r2.url');
        
        try {
            // Check if it's an R2 URL (supports both custom domain and r2.dev URLs)
            if (str_contains($imageUrl, 'r2.dev') || str_contains($imageUrl, 'assets.shifr.asia')) {
                // R2 storage - extract path from URL
                $path = preg_replace('/^https?:\/\/[^\/]+\//', '', $imageUrl);
                Storage::disk('r2')->delete($path);
            } elseif (str_starts_with($imageUrl, '/storage/')) {
                // Local storage
                $path = str_replace('/storage/', '', $imageUrl);
                Storage::disk('public')->delete($path);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to delete image: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Gambar berhasil dihapus',
            'images' => $product->images,
        ]);
    }
}
