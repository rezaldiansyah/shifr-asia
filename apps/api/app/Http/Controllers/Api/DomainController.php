<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class DomainController extends Controller
{
    /**
     * Get domain settings for current user's store.
     */
    public function show(): JsonResponse
    {
        $store = Store::where('user_id', Auth::id())->first();

        if (!$store) {
            return response()->json([
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'domain' => [
                'subdomain' => $store->subdomain,
                'subdomain_url' => $store->subdomain_url,
                'custom_domain' => $store->custom_domain,
                'custom_domain_url' => $store->custom_domain_url,
                'domain_verified' => $store->domain_verified,
                'ssl_status' => $store->ssl_status,
                'ssl_expires_at' => $store->ssl_expires_at,
                'verification_token' => $store->verification_token,
                'primary_url' => $store->primary_url,
                'can_use_custom_domain' => $store->can_use_custom_domain,
                'dns_instructions' => $store->custom_domain ? $store->dns_instructions : null,
            ],
        ]);
    }

    /**
     * Update subdomain.
     */
    public function updateSubdomain(Request $request): JsonResponse
    {
        $store = Store::where('user_id', Auth::id())->first();

        if (!$store) {
            return response()->json([
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }

        $validated = $request->validate([
            'subdomain' => [
                'required',
                'string',
                'min:3',
                'max:30',
                'regex:/^[a-z0-9][a-z0-9-]*[a-z0-9]$/',
                Rule::unique('stores', 'subdomain')->ignore($store->id),
            ],
        ], [
            'subdomain.regex' => 'Subdomain hanya boleh berisi huruf kecil, angka, dan tanda hubung. Tidak boleh diawali atau diakhiri dengan tanda hubung.',
            'subdomain.unique' => 'Subdomain sudah digunakan.',
        ]);

        // Check reserved subdomains
        $reserved = ['www', 'api', 'admin', 'dashboard', 'app', 'mail', 'smtp', 'ftp', 'ns1', 'ns2'];
        if (in_array($validated['subdomain'], $reserved)) {
            return response()->json([
                'message' => 'Subdomain ini tidak tersedia.',
                'errors' => ['subdomain' => ['Subdomain ini dicadangkan dan tidak dapat digunakan.']],
            ], 422);
        }

        $store->subdomain = $validated['subdomain'];
        $store->save();

        return response()->json([
            'message' => 'Subdomain berhasil diperbarui',
            'subdomain' => $store->subdomain,
            'subdomain_url' => $store->subdomain_url,
            'primary_url' => $store->primary_url,
        ]);
    }

    /**
     * Set custom domain.
     */
    public function setCustomDomain(Request $request): JsonResponse
    {
        $store = Store::where('user_id', Auth::id())->first();

        if (!$store) {
            return response()->json([
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }

        // Check tier permission
        if (!$store->can_use_custom_domain) {
            return response()->json([
                'message' => 'Fitur custom domain hanya tersedia untuk paket Growth dan Pro.',
                'upgrade_required' => true,
            ], 403);
        }

        $validated = $request->validate([
            'custom_domain' => [
                'required',
                'string',
                'max:255',
                'regex:/^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/',
                Rule::unique('stores', 'custom_domain')->ignore($store->id),
            ],
        ], [
            'custom_domain.regex' => 'Format domain tidak valid.',
            'custom_domain.unique' => 'Domain sudah digunakan.',
        ]);

        $store->custom_domain = strtolower($validated['custom_domain']);
        $store->domain_verified = false;
        $store->ssl_status = 'none';
        $store->generateVerificationToken();

        return response()->json([
            'message' => 'Custom domain berhasil ditambahkan. Silakan verifikasi dengan menambahkan DNS record.',
            'custom_domain' => $store->custom_domain,
            'domain_verified' => $store->domain_verified,
            'dns_instructions' => $store->dns_instructions,
        ]);
    }

    /**
     * Verify custom domain DNS.
     */
    public function verifyDomain(): JsonResponse
    {
        $store = Store::where('user_id', Auth::id())->first();

        if (!$store) {
            return response()->json([
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }

        if (!$store->custom_domain) {
            return response()->json([
                'message' => 'Belum ada custom domain yang dikonfigurasi.',
            ], 422);
        }

        // Perform DNS verification
        $verified = $this->checkDnsRecords($store);

        if ($verified) {
            $store->domain_verified = true;
            $store->ssl_status = 'pending'; // SSL will be provisioned by infrastructure
            $store->save();

            return response()->json([
                'message' => 'Domain berhasil diverifikasi! SSL sedang diproses.',
                'domain_verified' => true,
                'ssl_status' => 'pending',
                'primary_url' => $store->primary_url,
            ]);
        }

        return response()->json([
            'message' => 'Verifikasi gagal. Pastikan DNS record sudah dikonfigurasi dengan benar.',
            'domain_verified' => false,
            'dns_instructions' => $store->dns_instructions,
        ], 422);
    }

    /**
     * Remove custom domain.
     */
    public function removeCustomDomain(): JsonResponse
    {
        $store = Store::where('user_id', Auth::id())->first();

        if (!$store) {
            return response()->json([
                'message' => 'Toko tidak ditemukan',
            ], 404);
        }

        $store->custom_domain = null;
        $store->domain_verified = false;
        $store->ssl_status = 'none';
        $store->verification_token = null;
        $store->ssl_expires_at = null;
        $store->save();

        return response()->json([
            'message' => 'Custom domain berhasil dihapus.',
            'primary_url' => $store->primary_url,
        ]);
    }

    /**
     * Check DNS records for verification.
     * Note: In production, this should use actual DNS lookup.
     */
    private function checkDnsRecords(Store $store): bool
    {
        // For development, we'll simulate verification
        // In production, implement actual DNS lookup:
        // 
        // $txtRecords = dns_get_record("_shifr.{$store->custom_domain}", DNS_TXT);
        // foreach ($txtRecords as $record) {
        //     if (isset($record['txt']) && $record['txt'] === $store->verification_token) {
        //         return true;
        //     }
        // }
        // return false;

        // Development mode: check if token exists (simulated verification)
        if (config('app.env') === 'local' || config('app.debug')) {
            // Auto-verify in development for testing
            return true;
        }

        // Production DNS verification
        try {
            $txtRecords = @dns_get_record("_shifr.{$store->custom_domain}", DNS_TXT);
            if ($txtRecords) {
                foreach ($txtRecords as $record) {
                    if (isset($record['txt']) && $record['txt'] === $store->verification_token) {
                        return true;
                    }
                }
            }
        } catch (\Exception $e) {
            \Log::warning("DNS verification failed for {$store->custom_domain}: " . $e->getMessage());
        }

        return false;
    }
}
