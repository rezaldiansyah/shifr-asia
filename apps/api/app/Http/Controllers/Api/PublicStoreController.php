<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;

class PublicStoreController extends Controller
{
    /**
     * Get store by slug for public view.
     */
    public function show(string $slug): JsonResponse
    {
        $store = Store::where('slug', $slug)
            ->where('is_active', true)
            ->with(['template', 'products' => function ($query) {
                $query->where('is_active', true)->ordered();
            }])
            ->first();

        if (!$store) {
            return response()->json([
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'store' => $store,
        ]);
    }

    /**
     * Get store by subdomain for public view.
     */
    public function showBySubdomain(string $subdomain): JsonResponse
    {
        $store = Store::where('subdomain', $subdomain)
            ->where('is_active', true)
            ->with(['template', 'products' => function ($query) {
                $query->where('is_active', true)->ordered();
            }])
            ->first();

        if (!$store) {
            return response()->json([
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'store' => $store,
            'domain_info' => [
                'subdomain' => $store->subdomain,
                'subdomain_url' => $store->subdomain_url,
                'primary_url' => $store->primary_url,
            ],
        ]);
    }

    /**
     * Get store by custom domain for public view.
     */
    public function showByDomain(string $domain): JsonResponse
    {
        $store = Store::where('custom_domain', $domain)
            ->where('domain_verified', true)
            ->where('is_active', true)
            ->with(['template', 'products' => function ($query) {
                $query->where('is_active', true)->ordered();
            }])
            ->first();

        if (!$store) {
            return response()->json([
                'message' => 'Toko tidak ditemukan atau domain belum diverifikasi',
            ], 404);
        }

        return response()->json([
            'store' => $store,
            'domain_info' => [
                'custom_domain' => $store->custom_domain,
                'custom_domain_url' => $store->custom_domain_url,
                'ssl_status' => $store->ssl_status,
                'primary_url' => $store->primary_url,
            ],
        ]);
    }
}
