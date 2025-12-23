<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SectionController extends Controller
{
    /**
     * Available section types with their default configurations.
     */
    private array $sectionTypes = [
        'hero' => [
            'name' => 'Hero',
            'description' => 'Header utama dengan judul dan CTA',
            'icon' => 'star',
            'defaultContent' => [
                'title' => 'Selamat Datang',
                'subtitle' => 'Toko Online Terpercaya',
                'buttonText' => 'Lihat Produk',
                'buttonLink' => '#products',
                'backgroundImage' => null,
            ],
            'defaultStyles' => [
                'backgroundColor' => '#374da0',
                'textColor' => '#ffffff',
            ],
        ],
        'about' => [
            'name' => 'Tentang Kami',
            'description' => 'Section untuk menampilkan informasi bisnis',
            'icon' => 'info',
            'defaultContent' => [
                'title' => 'Tentang Kami',
                'description' => 'Kami berkomitmen memberikan produk dan layanan terbaik untuk Anda.',
                'image' => null,
            ],
            'defaultStyles' => [
                'backgroundColor' => '#ffffff',
                'textColor' => '#1f2937',
            ],
        ],
        'features' => [
            'name' => 'Keunggulan',
            'description' => 'Tampilkan fitur atau keunggulan bisnis Anda',
            'icon' => 'check-circle',
            'defaultContent' => [
                'title' => 'Mengapa Pilih Kami',
                'items' => [
                    ['icon' => 'truck', 'title' => 'Pengiriman Cepat', 'description' => 'Pesanan Anda sampai dengan cepat'],
                    ['icon' => 'shield', 'title' => 'Terpercaya', 'description' => 'Garansi kepuasan pelanggan'],
                    ['icon' => 'clock', 'title' => 'Layanan 24/7', 'description' => 'Siap membantu kapan saja'],
                ],
            ],
            'defaultStyles' => [
                'backgroundColor' => '#f9fafb',
                'textColor' => '#1f2937',
            ],
        ],
        'products' => [
            'name' => 'Produk',
            'description' => 'Tampilkan katalog produk Anda',
            'icon' => 'shopping-bag',
            'defaultContent' => [
                'title' => 'Produk Kami',
                'subtitle' => 'Temukan produk terbaik untuk kebutuhan Anda',
                'showAll' => true,
                'limit' => 6,
                'columns' => 3,
            ],
            'defaultStyles' => [
                'backgroundColor' => '#f9fafb',
                'textColor' => '#1f2937',
            ],
        ],
        'gallery' => [
            'name' => 'Galeri',
            'description' => 'Tampilkan foto-foto produk atau aktivitas',
            'icon' => 'image',
            'defaultContent' => [
                'title' => 'Galeri',
                'images' => [],
                'columns' => 3,
            ],
            'defaultStyles' => [
                'backgroundColor' => '#ffffff',
                'textColor' => '#1f2937',
            ],
        ],
        'testimonial' => [
            'name' => 'Testimoni',
            'description' => 'Tampilkan ulasan dari pelanggan',
            'icon' => 'message-circle',
            'defaultContent' => [
                'title' => 'Apa Kata Mereka',
                'items' => [
                    ['name' => 'John Doe', 'text' => 'Pelayanan sangat memuaskan!', 'rating' => 5, 'avatar' => null],
                ],
            ],
            'defaultStyles' => [
                'backgroundColor' => '#f9fafb',
                'textColor' => '#1f2937',
            ],
        ],
        'cta' => [
            'name' => 'Call to Action',
            'description' => 'Ajakan untuk bertindak',
            'icon' => 'zap',
            'defaultContent' => [
                'title' => 'Tertarik dengan Produk Kami?',
                'subtitle' => 'Hubungi kami sekarang untuk informasi lebih lanjut',
                'buttonText' => 'Hubungi Kami',
                'buttonLink' => '#contact',
            ],
            'defaultStyles' => [
                'backgroundColor' => '#2cbbbc',
                'textColor' => '#ffffff',
            ],
        ],
        'contact' => [
            'name' => 'Kontak',
            'description' => 'Informasi kontak dan sosial media',
            'icon' => 'phone',
            'defaultContent' => [
                'title' => 'Hubungi Kami',
                'subtitle' => 'Ada pertanyaan? Jangan ragu untuk menghubungi kami',
                'showWhatsApp' => true,
                'showEmail' => false,
                'showAddress' => false,
                'address' => '',
                'email' => '',
            ],
            'defaultStyles' => [
                'backgroundColor' => '#374da0',
                'textColor' => '#ffffff',
            ],
        ],
        'custom' => [
            'name' => 'Custom HTML',
            'description' => 'Tambahkan konten HTML kustom',
            'icon' => 'code',
            'defaultContent' => [
                'html' => '<div class="text-center p-8"><p>Custom content here</p></div>',
            ],
            'defaultStyles' => [
                'backgroundColor' => '#ffffff',
                'textColor' => '#1f2937',
            ],
        ],
    ];

    /**
     * Get available section types.
     */
    public function types()
    {
        $types = [];
        foreach ($this->sectionTypes as $key => $config) {
            $types[] = [
                'type' => $key,
                'name' => $config['name'],
                'description' => $config['description'],
                'icon' => $config['icon'],
            ];
        }

        return response()->json([
            'types' => $types,
        ]);
    }

    /**
     * Get store sections for editing.
     */
    public function show(Request $request)
    {
        $store = Store::where('user_id', $request->user()->id)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        return response()->json([
            'sections' => $store->sections,
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'slug' => $store->slug,
            ],
        ]);
    }

    /**
     * Update store sections.
     */
    public function update(Request $request)
    {
        $request->validate([
            'sections' => 'required|array',
            'sections.*.id' => 'required|string',
            'sections.*.type' => 'required|string|in:' . implode(',', array_keys($this->sectionTypes)),
            'sections.*.order' => 'required|integer',
            'sections.*.enabled' => 'required|boolean',
            'sections.*.content' => 'required|array',
            'sections.*.styles' => 'nullable|array',
        ]);

        $store = Store::where('user_id', $request->user()->id)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        // Sort sections by order
        $sections = collect($request->sections)->sortBy('order')->values()->toArray();

        $store->custom_sections = $sections;
        $store->save();

        return response()->json([
            'message' => 'Sections updated successfully',
            'sections' => $store->sections,
        ]);
    }

    /**
     * Add a new section.
     */
    public function addSection(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:' . implode(',', array_keys($this->sectionTypes)),
            'position' => 'nullable|integer', // Where to insert
        ]);

        $store = Store::where('user_id', $request->user()->id)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $type = $request->type;
        $config = $this->sectionTypes[$type];
        $sections = $store->sections;

        // Create new section
        $newSection = [
            'id' => $type . '-' . Str::random(8),
            'type' => $type,
            'order' => $request->position ?? count($sections),
            'enabled' => true,
            'content' => $config['defaultContent'],
            'styles' => $config['defaultStyles'],
        ];

        // Insert at position or append
        if ($request->has('position')) {
            $position = $request->position;
            // Shift orders of sections after this position
            foreach ($sections as &$section) {
                if ($section['order'] >= $position) {
                    $section['order']++;
                }
            }
            array_splice($sections, $position, 0, [$newSection]);
        } else {
            $sections[] = $newSection;
        }

        // Re-order and save
        usort($sections, fn($a, $b) => $a['order'] <=> $b['order']);
        $store->custom_sections = $sections;
        $store->save();

        return response()->json([
            'message' => 'Section added successfully',
            'section' => $newSection,
            'sections' => $store->sections,
        ]);
    }

    /**
     * Delete a section.
     */
    public function deleteSection(Request $request, string $sectionId)
    {
        $store = Store::where('user_id', $request->user()->id)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $sections = $store->sections;
        $sections = array_filter($sections, fn($s) => $s['id'] !== $sectionId);

        // Re-order
        $sections = array_values($sections);
        foreach ($sections as $i => &$section) {
            $section['order'] = $i;
        }

        $store->custom_sections = $sections;
        $store->save();

        return response()->json([
            'message' => 'Section deleted successfully',
            'sections' => $store->sections,
        ]);
    }

    /**
     * Reorder sections.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'required|string', // Array of section IDs in new order
        ]);

        $store = Store::where('user_id', $request->user()->id)->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        $sections = $store->sections;
        $newOrder = $request->order;

        // Create lookup
        $sectionLookup = [];
        foreach ($sections as $section) {
            $sectionLookup[$section['id']] = $section;
        }

        // Reorder
        $reordered = [];
        foreach ($newOrder as $i => $sectionId) {
            if (isset($sectionLookup[$sectionId])) {
                $section = $sectionLookup[$sectionId];
                $section['order'] = $i;
                $reordered[] = $section;
            }
        }

        $store->custom_sections = $reordered;
        $store->save();

        return response()->json([
            'message' => 'Sections reordered successfully',
            'sections' => $store->sections,
        ]);
    }

    /**
     * Get preview data for store.
     */
    public function preview(Request $request)
    {
        $store = Store::where('user_id', $request->user()->id)
            ->with(['products' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order')->limit(12);
            }])
            ->first();

        if (!$store) {
            return response()->json([
                'message' => 'Store not found',
            ], 404);
        }

        return response()->json([
            'store' => [
                'id' => $store->id,
                'name' => $store->name,
                'slug' => $store->slug,
                'description' => $store->description,
                'settings' => $store->settings,
                'sections' => $store->sections,
                'products' => $store->products,
            ],
        ]);
    }
}
