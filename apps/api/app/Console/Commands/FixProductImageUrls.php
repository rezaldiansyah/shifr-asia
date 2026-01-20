<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class FixProductImageUrls extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:fix-image-urls 
                            {--dry-run : Show what would be changed without making changes}
                            {--old-domain= : Old domain to replace (default: pub-f2a0b1227a6b44d59e64a56682365909.r2.dev)}
                            {--new-domain= : New domain to use (default: assets.shifr.asia)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix product image URLs from old R2 public URL to custom domain';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dryRun = $this->option('dry-run');
        $oldDomain = $this->option('old-domain') ?? 'pub-f2a0b1227a6b44d59e64a56682365909.r2.dev';
        $newDomain = $this->option('new-domain') ?? 'assets.shifr.asia';

        $this->info("=== Fix Product Image URLs ===");
        $this->info("Old domain: {$oldDomain}");
        $this->info("New domain: {$newDomain}");
        $this->info("Dry run: " . ($dryRun ? 'Yes' : 'No'));
        $this->newLine();

        // Find all products with images containing the old domain
        // Use JSON_EXTRACT for SQLite compatibility, or direct cast for PostgreSQL
        $driver = DB::connection()->getDriverName();
        
        if ($driver === 'sqlite') {
            $products = Product::whereRaw("json(images) LIKE ?", ["%{$oldDomain}%"])->get();
        } else {
            // PostgreSQL
            $products = Product::whereRaw("images::text LIKE ?", ["%{$oldDomain}%"])->get();
        }


        if ($products->isEmpty()) {
            $this->info("No products found with images from {$oldDomain}");
            return 0;
        }

        $this->info("Found {$products->count()} product(s) with images to fix");
        $this->newLine();

        $fixed = 0;
        foreach ($products as $product) {
            $this->info("Product #{$product->id}: {$product->name}");
            
            $oldImages = $product->images ?? [];
            $newImages = array_map(function ($url) use ($oldDomain, $newDomain) {
                return str_replace($oldDomain, $newDomain, $url);
            }, $oldImages);

            $this->table(
                ['Type', 'URL'],
                collect($oldImages)->map(fn($url, $i) => ['Old ' . ($i + 1), $url])
                    ->merge(collect($newImages)->map(fn($url, $i) => ['New ' . ($i + 1), $url]))
                    ->toArray()
            );

            if (!$dryRun) {
                $product->images = $newImages;
                $product->save();
                $this->info("✅ Updated!");
            } else {
                $this->warn("⏸️ Dry run - no changes made");
            }

            $fixed++;
            $this->newLine();
        }

        $this->info("=== Summary ===");
        $this->info("Products processed: {$fixed}");
        if ($dryRun) {
            $this->warn("This was a dry run. Run without --dry-run to apply changes.");
        } else {
            $this->info("✅ All image URLs have been updated!");
        }

        return 0;
    }
}
