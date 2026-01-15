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
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $uploadedImages = [];
        
        // Determine which disk to use (R2 if configured, otherwise local)
        $useR2 = !empty(env('CLOUDFLARE_R2_ACCESS_KEY_ID')) && !empty(env('CLOUDFLARE_R2_SECRET_ACCESS_KEY'));
        $disk = $useR2 ? 'r2' : 'public';
        
        foreach ($request->file('images') as $image) {
            $filename = time() . '_' . Str::random(8) . '.' . $image->getClientOriginalExtension();
            $path = 'products/' . $store->id . '/' . $filename;
            
            try {
                if ($useR2) {
                    // Upload to Cloudflare R2
                    Storage::disk('r2')->put($path, file_get_contents($image), 'public');
                    $url = env('CLOUDFLARE_R2_URL') . '/' . $path;
                } else {
                    // Fallback to local storage
                    $storedPath = $image->storeAs('products/' . $store->id, $filename, 'public');
                    $url = '/storage/' . $storedPath;
                }
                $uploadedImages[] = $url;
            } catch (\Exception $e) {
                // If R2 fails, try local storage as fallback
                \Log::error('R2 upload failed, falling back to local storage: ' . $e->getMessage());
                $storedPath = $image->storeAs('products/' . $store->id, $filename, 'public');
                $uploadedImages[] = '/storage/' . $storedPath;
            }
        }

        // Append to existing images
        $existingImages = $product->images ?? [];
        $product->images = array_merge($existingImages, $uploadedImages);
        $product->save();

        return response()->json([
            'message' => 'Gambar berhasil diupload',
            'images' => $product->images,
            'storage' => $useR2 ? 'cloudflare_r2' : 'local',
        ]);
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
        $r2Url = env('CLOUDFLARE_R2_URL');
        
        try {
            if ($r2Url && str_starts_with($imageUrl, $r2Url)) {
                // R2 storage - extract path from URL
                $path = str_replace($r2Url . '/', '', $imageUrl);
                Storage::disk('r2')->delete($path);
            } else {
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
