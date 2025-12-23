'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, ProductVariant } from '@/lib/api';

export default function CreateProductPage() {
    const router = useRouter();
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        compare_price: '',
        category: '',
        stock: '',
        is_active: true,
    });

    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const [newVariant, setNewVariant] = useState({ name: '', options: '' });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    const handleAddVariant = () => {
        if (newVariant.name && newVariant.options) {
            setVariants([
                ...variants,
                {
                    name: newVariant.name,
                    options: newVariant.options.split(',').map(o => o.trim()),
                }
            ]);
            setNewVariant({ name: '', options: '' });
        }
    };

    const handleRemoveVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await api.createProduct({
                name: formData.name,
                description: formData.description || undefined,
                price: parseFloat(formData.price),
                compare_price: formData.compare_price ? parseFloat(formData.compare_price) : undefined,
                category: formData.category || undefined,
                stock: formData.stock ? parseInt(formData.stock) : undefined,
                variants: variants.length > 0 ? variants : undefined,
                is_active: formData.is_active,
            });

            setSuccess('Produk berhasil ditambahkan!');
            setTimeout(() => {
                router.push('/dashboard/products');
            }, 1500);
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || 'Terjadi kesalahan');
            setIsSaving(false);
        }
    };

    if (authLoading) {
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
                    <Link href="/dashboard/products" className="flex items-center px-4 py-3 text-main bg-main/10 rounded-lg font-medium">
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
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <header className="h-16 bg-fifth border-b border-gray-200 flex items-center px-6">
                    <Link href="/dashboard/products" className="text-gray-500 hover:text-gray-700 mr-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h2 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-ubuntu)]">Tambah Produk</h2>
                </header>

                <div className="p-6 max-w-3xl">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-fifth rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-[family-name:var(--font-ubuntu)]">
                                Informasi Produk
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Produk *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                        placeholder="Contoh: Kaos Polos Premium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                        placeholder="Jelaskan produk Anda..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kategori
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                        placeholder="Contoh: Pakaian"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-fifth rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-[family-name:var(--font-ubuntu)]">
                                Harga & Stok
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Harga *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-gray-500">Rp</span>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Harga Coret
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-gray-500">Rp</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.compare_price}
                                            onChange={(e) => setFormData({ ...formData, compare_price: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stok
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                        placeholder="Kosongkan jika unlimited"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Variants */}
                        <div className="bg-fifth rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-[family-name:var(--font-ubuntu)]">
                                Varian Produk
                            </h3>

                            {variants.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    {variants.map((v, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                                            <div>
                                                <span className="font-medium">{v.name}:</span>
                                                <span className="text-gray-600 ml-2">{v.options.join(', ')}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveVariant(idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newVariant.name}
                                    onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                    placeholder="Nama (contoh: Ukuran)"
                                />
                                <input
                                    type="text"
                                    value={newVariant.options}
                                    onChange={(e) => setNewVariant({ ...newVariant, options: e.target.value })}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                    placeholder="Opsi, pisahkan koma (S, M, L)"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddVariant}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                                >
                                    Tambah
                                </button>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="bg-fifth rounded-xl p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-800">Status Produk</h3>
                                    <p className="text-sm text-gray-500">Produk aktif akan tampil di toko</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-main/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-main"></div>
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href="/dashboard/products"
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-main hover:bg-main-hover text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-50"
                            >
                                {isSaving ? 'Menyimpan...' : 'Simpan Produk'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
