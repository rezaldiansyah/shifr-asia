<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageService
{
    protected ImageManager $manager;
    
    // Max dimensions for product images
    const MAX_WIDTH = 1200;
    const MAX_HEIGHT = 1200;
    
    // Quality for WebP compression (1-100)
    const WEBP_QUALITY = 80;
    
    // Quality for JPEG fallback (1-100)
    const JPEG_QUALITY = 85;

    public function __construct()
    {
        // Use GD driver (more widely available than Imagick)
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Process and optimize an uploaded image
     * - Resize to max dimensions while maintaining aspect ratio
     * - Convert to WebP format for best compression
     * - Return processed image as binary
     * 
     * @param string $imagePath Path to the uploaded image
     * @param int|null $maxWidth Max width (default: 1200)
     * @param int|null $maxHeight Max height (default: 1200)
     * @return array ['data' => binary, 'extension' => 'webp', 'mime' => 'image/webp']
     */
    public function processImage(
        string $imagePath, 
        ?int $maxWidth = null, 
        ?int $maxHeight = null
    ): array {
        $maxWidth = $maxWidth ?? self::MAX_WIDTH;
        $maxHeight = $maxHeight ?? self::MAX_HEIGHT;
        
        // Read the image
        $image = $this->manager->read($imagePath);
        
        // Get original dimensions
        $originalWidth = $image->width();
        $originalHeight = $image->height();
        
        // Only resize if larger than max dimensions
        if ($originalWidth > $maxWidth || $originalHeight > $maxHeight) {
            // Scale down proportionally
            $image->scaleDown($maxWidth, $maxHeight);
        }
        
        // Try to encode as WebP (best compression)
        try {
            $encoded = $image->toWebp(self::WEBP_QUALITY);
            return [
                'data' => $encoded->toString(),
                'extension' => 'webp',
                'mime' => 'image/webp',
                'original_size' => filesize($imagePath),
                'processed_size' => strlen($encoded->toString()),
            ];
        } catch (\Exception $e) {
            // Fallback to JPEG if WebP fails
            \Log::warning('WebP encoding failed, falling back to JPEG: ' . $e->getMessage());
            $encoded = $image->toJpeg(self::JPEG_QUALITY);
            return [
                'data' => $encoded->toString(),
                'extension' => 'jpg',
                'mime' => 'image/jpeg',
                'original_size' => filesize($imagePath),
                'processed_size' => strlen($encoded->toString()),
            ];
        }
    }

    /**
     * Process image from uploaded file
     * 
     * @param \Illuminate\Http\UploadedFile $file
     * @return array
     */
    public function processUploadedFile($file): array
    {
        return $this->processImage($file->getRealPath());
    }

    /**
     * Create a thumbnail from an image
     * 
     * @param string $imagePath
     * @param int $width
     * @param int $height
     * @return array
     */
    public function createThumbnail(string $imagePath, int $width = 300, int $height = 300): array
    {
        $image = $this->manager->read($imagePath);
        
        // Cover resize (crop to fill dimensions)
        $image->cover($width, $height);
        
        try {
            $encoded = $image->toWebp(self::WEBP_QUALITY);
            return [
                'data' => $encoded->toString(),
                'extension' => 'webp',
                'mime' => 'image/webp',
            ];
        } catch (\Exception $e) {
            $encoded = $image->toJpeg(self::JPEG_QUALITY);
            return [
                'data' => $encoded->toString(),
                'extension' => 'jpg',
                'mime' => 'image/jpeg',
            ];
        }
    }

    /**
     * Get compression ratio as percentage saved
     */
    public function getCompressionRatio(int $originalSize, int $processedSize): float
    {
        if ($originalSize === 0) return 0;
        return round((1 - ($processedSize / $originalSize)) * 100, 1);
    }
}
