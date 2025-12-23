<?php

namespace Database\Seeders;

use App\Models\Template;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Instagram Grid',
                'slug' => 'instagram-grid',
                'type' => 'store',
                'description' => 'Layout seperti Instagram dengan grid foto 3 kolom. Tap untuk detail produk. Cocok untuk fashion, F&B, produk visual.',
                'sections' => [
                    'header' => ['type' => 'sticky', 'layout' => 'centered'],
                    'products' => ['type' => 'grid', 'columns' => 3, 'style' => 'instagram'],
                    'modal' => ['type' => 'product-detail'],
                    'footer' => ['type' => 'whatsapp-float'],
                ],
                'preview_url' => '/templates/instagram-grid.png',
                'thumbnail' => '/templates/thumb-instagram.png',
                'is_premium' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Company Profile',
                'slug' => 'company-profile',
                'type' => 'store',
                'description' => 'One-page scroll dengan sections Hero, About, Products/Services, dan Contact. Cocok untuk UMKM dan bisnis profesional.',
                'sections' => [
                    'hero' => ['type' => 'fullscreen', 'layout' => 'centered'],
                    'about' => ['type' => 'text-image', 'layout' => 'split'],
                    'products' => ['type' => 'showcase', 'columns' => 3],
                    'contact' => ['type' => 'cta', 'layout' => 'whatsapp'],
                ],
                'preview_url' => '/templates/company-profile.png',
                'thumbnail' => '/templates/thumb-company.png',
                'is_premium' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Catalog',
                'slug' => 'catalog',
                'type' => 'store',
                'description' => 'Fokus pada tampilan grid produk lengkap dengan filter. Cocok untuk toko dengan banyak inventory.',
                'sections' => [
                    'header' => ['type' => 'simple', 'layout' => 'compact'],
                    'categories' => ['type' => 'tabs', 'layout' => 'horizontal'],
                    'products' => ['type' => 'grid', 'columns' => 4],
                    'filter' => ['type' => 'sidebar', 'fields' => ['category', 'price', 'sort']],
                ],
                'preview_url' => '/templates/catalog.png',
                'thumbnail' => '/templates/thumb-catalog.png',
                'is_premium' => false,
                'sort_order' => 3,
            ],
        ];

        foreach ($templates as $template) {
            Template::updateOrCreate(
                ['slug' => $template['slug']],
                $template
            );
        }
    }
}
