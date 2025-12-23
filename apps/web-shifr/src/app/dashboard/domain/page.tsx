'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, DomainSettings } from '@/lib/api';

export default function DomainSettingsPage() {
    const router = useRouter();
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const [domain, setDomain] = useState<DomainSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [subdomain, setSubdomain] = useState('');
    const [customDomain, setCustomDomain] = useState('');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadDomainSettings();
        }
    }, [isAuthenticated]);

    const loadDomainSettings = async () => {
        try {
            const res = await api.getDomainSettings();
            setDomain(res.domain);
            setSubdomain(res.domain.subdomain || '');
            setCustomDomain(res.domain.custom_domain || '');
        } catch (err) {
            console.error('Error loading domain settings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubdomainSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await api.updateSubdomain(subdomain);
            setSuccess('Subdomain berhasil diperbarui!');
            loadDomainSettings();
        } catch (err: unknown) {
            const apiError = err as { message?: string; errors?: { subdomain?: string[] } };
            setError(apiError.errors?.subdomain?.[0] || apiError.message || 'Terjadi kesalahan');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCustomDomainSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await api.setCustomDomain(customDomain);
            setSuccess('Custom domain berhasil ditambahkan. Silakan verifikasi DNS.');
            loadDomainSettings();
        } catch (err: unknown) {
            const apiError = err as { message?: string; upgrade_required?: boolean };
            if (apiError.upgrade_required) {
                setError('Fitur ini membutuhkan paket Growth atau Pro.');
            } else {
                setError(apiError.message || 'Terjadi kesalahan');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleVerifyDomain = async () => {
        setIsVerifying(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await api.verifyCustomDomain();
            setSuccess(res.message);
            loadDomainSettings();
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || 'Verifikasi gagal');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleRemoveCustomDomain = async () => {
        if (!confirm('Apakah Anda yakin ingin menghapus custom domain?')) return;

        setIsSaving(true);
        setError(null);

        try {
            await api.removeCustomDomain();
            setSuccess('Custom domain berhasil dihapus.');
            setCustomDomain('');
            loadDomainSettings();
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || 'Terjadi kesalahan');
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-fourth flex">
            {/* Sidebar */}
            <aside className="w-64 bg-fifth border-r border-gray-200 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-main font-[family-name:var(--font-ubuntu)]">
                        Shifr Asia
                    </h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                    </Link>
                    <Link href="/dashboard/products" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Produk
                    </Link>
                    <Link href="/dashboard/store" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Toko
                    </Link>
                    <Link href="/dashboard/domain" className="flex items-center px-4 py-3 text-main bg-main/10 rounded-lg font-medium">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Domain
                    </Link>
                    <Link href="/dashboard/builder" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                        </svg>
                        Builder
                    </Link>
                    <Link href="/dashboard/subscription" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Langganan
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <header className="h-16 bg-fifth border-b border-gray-200 flex items-center px-6">
                    <h2 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-ubuntu)]">
                        Pengaturan Domain
                    </h2>
                </header>

                <div className="p-6 max-w-4xl">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                            {success}
                        </div>
                    )}

                    {/* Current URL Display */}
                    {domain && (
                        <div className="bg-gradient-to-r from-main to-second text-white rounded-xl p-6 mb-6">
                            <h3 className="text-sm font-medium opacity-80 mb-1">URL Toko Anda</h3>
                            <a
                                href={domain.primary_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xl font-bold hover:underline flex items-center gap-2"
                            >
                                {domain.primary_url}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    )}

                    {/* Subdomain Section */}
                    <div className="bg-fifth rounded-xl p-6 shadow-sm mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-[family-name:var(--font-ubuntu)]">
                            Subdomain
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Subdomain gratis untuk semua pengguna. Toko Anda akan dapat diakses di:
                        </p>
                        <form onSubmit={handleSubdomainSubmit} className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">https://</span>
                                <input
                                    type="text"
                                    value={subdomain}
                                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition"
                                    placeholder="tokosaya"
                                    minLength={3}
                                    maxLength={30}
                                    required
                                />
                                <span className="text-gray-500">.shifr.asia</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                Hanya huruf kecil, angka, dan tanda hubung. Minimal 3 karakter.
                            </p>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-main hover:bg-main-hover text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
                            >
                                {isSaving ? 'Menyimpan...' : 'Simpan Subdomain'}
                            </button>
                        </form>
                    </div>

                    {/* Custom Domain Section */}
                    <div className="bg-fifth rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-ubuntu)]">
                                Custom Domain
                            </h3>
                            {!domain?.can_use_custom_domain && (
                                <span className="bg-second/10 text-second text-xs font-medium px-3 py-1 rounded-full">
                                    Growth / Pro
                                </span>
                            )}
                        </div>

                        {domain?.can_use_custom_domain ? (
                            <>
                                {domain.custom_domain ? (
                                    // Show current custom domain
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-800 font-medium">{domain.custom_domain}</span>
                                            {domain.domain_verified ? (
                                                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Terverifikasi
                                                </span>
                                            ) : (
                                                <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2 py-1 rounded-full">
                                                    Menunggu Verifikasi
                                                </span>
                                            )}
                                            {domain.ssl_status === 'active' && (
                                                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                    SSL Aktif
                                                </span>
                                            )}
                                        </div>

                                        {!domain.domain_verified && domain.dns_instructions && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-medium text-blue-800 mb-2">Instruksi DNS</h4>
                                                <p className="text-sm text-blue-700 mb-3">
                                                    Tambahkan record berikut di DNS domain Anda:
                                                </p>
                                                <div className="bg-white rounded-lg p-3 space-y-2 font-mono text-sm">
                                                    <div>
                                                        <span className="text-gray-500">CNAME:</span>
                                                        <span className="ml-2">{domain.dns_instructions.name} → {domain.dns_instructions.value}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">TXT:</span>
                                                        <span className="ml-2">{domain.dns_instructions.verification.name} → {domain.dns_instructions.verification.value}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-3">
                                            {!domain.domain_verified && (
                                                <button
                                                    onClick={handleVerifyDomain}
                                                    disabled={isVerifying}
                                                    className="bg-second hover:bg-second/90 text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
                                                >
                                                    {isVerifying ? 'Memverifikasi...' : 'Verifikasi Domain'}
                                                </button>
                                            )}
                                            <button
                                                onClick={handleRemoveCustomDomain}
                                                disabled={isSaving}
                                                className="border border-red-300 text-red-600 hover:bg-red-50 font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
                                            >
                                                Hapus Domain
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Show custom domain form
                                    <form onSubmit={handleCustomDomainSubmit} className="space-y-4">
                                        <p className="text-gray-600 mb-4">
                                            Gunakan domain Anda sendiri untuk toko profesional.
                                        </p>
                                        <div>
                                            <input
                                                type="text"
                                                value={customDomain}
                                                onChange={(e) => setCustomDomain(e.target.value.toLowerCase())}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition"
                                                placeholder="shop.domainanda.com"
                                                required
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Contoh: shop.mybrand.com atau store.company.id
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="bg-main hover:bg-main-hover text-white font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50"
                                        >
                                            {isSaving ? 'Menyimpan...' : 'Tambah Custom Domain'}
                                        </button>
                                    </form>
                                )}
                            </>
                        ) : (
                            // Upgrade prompt
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-2">
                                    Custom Domain Tersedia di Paket Growth & Pro
                                </h4>
                                <p className="text-gray-600 mb-4">
                                    Upgrade untuk menggunakan domain Anda sendiri dan tampil lebih profesional.
                                </p>
                                <Link
                                    href="/dashboard/subscription"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-main to-second text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                    Upgrade Sekarang
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
