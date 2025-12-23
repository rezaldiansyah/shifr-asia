'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, Product } from '@/lib/api';

export default function ProductsPage() {
    const router = useRouter();
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [productLimit, setProductLimit] = useState(9);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadProducts();
        }
    }, [isAuthenticated]);

    const loadProducts = async (search?: string) => {
        try {
            const res = await api.getProducts({ search });
            setProducts(res.products);
            setProductLimit(res.limit);
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            if (apiError.message?.includes('Toko belum')) {
                router.push('/dashboard/store');
            } else {
                setError(apiError.message || 'Terjadi kesalahan');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadProducts(searchQuery);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus produk ini?')) return;

        try {
            await api.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || 'Gagal menghapus produk');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
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
                <header className="h-16 bg-fifth border-b border-gray-200 flex items-center justify-between px-6">
                    <h2 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-ubuntu)]">Produk</h2>
                    <Link
                        href="/dashboard/products/create"
                        className="bg-main hover:bg-main-hover text-white font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Produk
                    </Link>
                </header>

                <div className="p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-sm text-gray-600">
                            {products.length} dari {productLimit} produk
                            <div className="w-48 h-2 bg-gray-200 rounded-full mt-1">
                                <div
                                    className="h-2 bg-main rounded-full transition-all"
                                    style={{ width: `${Math.min((products.length / productLimit) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari produk..."
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                            />
                            <button type="submit" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                Cari
                            </button>
                        </form>
                    </div>

                    {/* Products Grid */}
                    {products.length === 0 ? (
                        <div className="text-center py-12 bg-fifth rounded-xl">
                            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">Belum ada produk</h3>
                            <p className="text-gray-500 mb-4">Mulai tambahkan produk pertama Anda</p>
                            <Link
                                href="/dashboard/products/create"
                                className="inline-flex items-center gap-2 bg-main hover:bg-main-hover text-white px-6 py-3 rounded-lg transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah Produk
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {products.map((product) => (
                                <div key={product.id} className="bg-fifth rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                                    {/* Product Image */}
                                    <div className="aspect-square bg-gray-100 relative">
                                        {product.images && product.images[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        {!product.is_active && (
                                            <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                                Draft
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-800 truncate">{product.name}</h3>
                                        <p className="text-main font-semibold mt-1">{formatPrice(product.price)}</p>
                                        {product.compare_price && product.compare_price > product.price && (
                                            <p className="text-sm text-gray-400 line-through">{formatPrice(product.compare_price)}</p>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-3">
                                            <Link
                                                href={`/dashboard/products/${product.id}`}
                                                className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm transition"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
