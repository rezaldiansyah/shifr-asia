'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, Store, Template } from '@/lib/api';

export default function StoreSettingsPage() {
    const router = useRouter();
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const [store, setStore] = useState<Store | null>(null);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        whatsapp_number: '',
        template_id: 1,
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated]);

    const loadData = async () => {
        try {
            const [storeRes, templatesRes] = await Promise.all([
                api.getStore(),
                api.getTemplates(),
            ]);

            setTemplates(templatesRes.templates);

            if (storeRes.store) {
                setStore(storeRes.store);
                setFormData({
                    name: storeRes.store.name,
                    description: storeRes.store.description || '',
                    whatsapp_number: storeRes.store.settings?.whatsapp_number || '',
                    template_id: storeRes.store.template_id,
                });
            }
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            if (store) {
                // Update existing store
                const res = await api.updateStore(formData);
                setStore(res.store);
                setSuccess('Pengaturan toko berhasil disimpan!');
            } else {
                // Create new store
                const res = await api.createStore(formData);
                setStore(res.store);
                setSuccess('Toko berhasil dibuat!');
            }
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
                    <Link href="/dashboard/store" className="flex items-center px-4 py-3 text-main bg-main/10 rounded-lg font-medium">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Toko
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <header className="h-16 bg-fifth border-b border-gray-200 flex items-center px-6">
                    <h2 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-ubuntu)]">Pengaturan Toko</h2>
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Store Info Card */}
                        <div className="bg-fifth rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-[family-name:var(--font-ubuntu)]">
                                Informasi Toko
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Toko *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition"
                                        placeholder="Nama toko Anda"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Deskripsi Toko
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition"
                                        placeholder="Ceritakan tentang toko Anda"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nomor WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.whatsapp_number}
                                        onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent transition"
                                        placeholder="08123456789"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Nomor ini akan digunakan untuk menerima order via WhatsApp
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Template Selector */}
                        <div className="bg-fifth rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-[family-name:var(--font-ubuntu)]">
                                Pilih Template
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        onClick={() => setFormData({ ...formData, template_id: template.id })}
                                        className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${formData.template_id === template.id
                                            ? 'border-main bg-main/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {/* Template Preview */}
                                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                                            <span className="text-gray-400 text-sm">Preview</span>
                                        </div>
                                        <h4 className="font-semibold text-gray-800">{template.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                            {template.description}
                                        </p>
                                        {template.is_premium && (
                                            <span className="absolute top-2 right-2 bg-second text-white text-xs px-2 py-1 rounded-full">
                                                Premium
                                            </span>
                                        )}
                                        {formData.template_id === template.id && (
                                            <div className="absolute top-2 left-2 w-6 h-6 bg-main rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-main hover:bg-main-hover text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50"
                            >
                                {isSaving ? 'Menyimpan...' : store ? 'Simpan Perubahan' : 'Buat Toko'}
                            </button>
                        </div>
                    </form>

                    {/* Store Info Display */}
                    {store && (
                        <div className="mt-8 bg-fifth rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-[family-name:var(--font-ubuntu)]">
                                Info Toko
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">URL Toko:</span>
                                    <a
                                        href={`/store/${store.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block font-medium text-main hover:underline flex items-center gap-1"
                                    >
                                        /store/{store.slug}
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </div>
                                <div>
                                    <span className="text-gray-500">Tier:</span>
                                    <p className="font-medium capitalize">{store.tier}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Status:</span>
                                    <p className={`font-medium ${store.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                        {store.is_active ? 'Aktif' : 'Nonaktif'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Template:</span>
                                    <p className="font-medium">{store.template?.name || '-'}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <a
                                    href={`/store/${store.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-main hover:bg-main-hover text-white px-4 py-2 rounded-lg text-sm transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Lihat Toko Publik
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
