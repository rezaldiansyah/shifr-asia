'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, Link as LinkType, Store } from '@/lib/api';

export default function LinksPage() {
    const router = useRouter();
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const [links, setLinks] = useState<LinkType[]>([]);
    const [store, setStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLink, setEditingLink] = useState<LinkType | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        icon: '',
        description: '',
        is_active: true,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            setLoading(true);
            const [linksRes, storeRes] = await Promise.all([
                api.getLinks(),
                api.getStore(),
            ]);
            setLinks(linksRes.links);
            setStore(storeRes.store);
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingLink) {
                await api.updateLink(editingLink.id, formData);
                setSuccess('Link berhasil diperbarui');
            } else {
                await api.createLink(formData);
                setSuccess('Link berhasil ditambahkan');
            }
            await loadData();
            resetForm();
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || 'Terjadi kesalahan');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus link ini?')) return;

        try {
            await api.deleteLink(id);
            setSuccess('Link berhasil dihapus');
            await loadData();
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || 'Gagal menghapus link');
        }
    };

    const handleEdit = (link: LinkType) => {
        setEditingLink(link);
        setFormData({
            title: link.title,
            url: link.url,
            icon: link.icon || '',
            description: link.description || '',
            is_active: link.is_active,
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            title: '',
            url: '',
            icon: '',
            description: '',
            is_active: true,
        });
        setEditingLink(null);
        setShowForm(false);
    };

    const toggleActive = async (link: LinkType) => {
        try {
            await api.updateLink(link.id, { is_active: !link.is_active });
            await loadData();
        } catch (err) {
            console.error('Failed to toggle link:', err);
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
                    <Link href="/dashboard/products" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Produk
                    </Link>
                    <Link href="/dashboard/orders" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Pesanan
                    </Link>
                    <Link href="/dashboard/links" className="flex items-center px-4 py-3 text-main bg-main/10 rounded-lg font-medium">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Link Bio
                    </Link>
                    <Link href="/dashboard/promos" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Promo
                    </Link>
                    <Link href="/dashboard/analytics" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analytics
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
                    <h2 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-ubuntu)]">Link-in-Bio</h2>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-main text-white rounded-lg hover:bg-main-hover transition-colors"
                    >
                        + Tambah Link
                    </button>
                </header>

                <div className="p-6">
                    {/* Alerts */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 mb-6">
                            {success}
                        </div>
                    )}

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Links List */}
                            <div className="space-y-3">
                                {links.length === 0 ? (
                                    <div className="text-center py-12 bg-fifth rounded-xl shadow-sm">
                                        <div className="text-4xl mb-4">🔗</div>
                                        <h3 className="font-medium text-gray-900">Belum ada link</h3>
                                        <p className="text-gray-500 text-sm">Tambahkan link pertama Anda</p>
                                    </div>
                                ) : (
                                    links.map((link) => (
                                        <div
                                            key={link.id}
                                            className={`bg-fifth rounded-xl p-4 flex items-center gap-4 shadow-sm ${!link.is_active ? 'opacity-50' : ''}`}
                                        >
                                            <div className="text-2xl">{link.icon || '🔗'}</div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate">{link.title}</h3>
                                                <p className="text-sm text-gray-500 truncate">{link.url}</p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {link.click_count} klik
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleActive(link)}
                                                    className={`p-2 rounded-lg ${link.is_active
                                                        ? 'text-green-600 hover:bg-green-50'
                                                        : 'text-gray-400 hover:bg-gray-50'
                                                        }`}
                                                    title={link.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                >
                                                    {link.is_active ? '👁️' : '👁️‍🗨️'}
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(link)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(link.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Hapus"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Bio Page Link */}
                            {store && (
                                <div className="bg-gradient-to-r from-main to-second rounded-xl p-6 text-white shadow-sm">
                                    <h3 className="font-bold mb-2 font-[family-name:var(--font-ubuntu)]">Halaman Bio Anda</h3>
                                    <p className="text-white/80 text-sm mb-4">
                                        Bagikan link ini ke followers Anda
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <code className="flex-1 bg-white/20 px-4 py-2 rounded-lg text-sm">
                                            {typeof window !== 'undefined' && `${window.location.origin}/bio/${store.slug}`}
                                        </code>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/bio/${store.slug}`);
                                                setSuccess('Link berhasil disalin!');
                                            }}
                                            className="px-4 py-2 bg-white text-main rounded-lg font-medium hover:bg-gray-100"
                                        >
                                            Salin
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-fifth rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
                        <h2 className="text-xl font-bold mb-4 font-[family-name:var(--font-ubuntu)]">
                            {editingLink ? 'Edit Link' : 'Tambah Link Baru'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Judul
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                    placeholder="https://"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon (Emoji)
                                </label>
                                <input
                                    type="text"
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                    placeholder="🔗"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Deskripsi (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="rounded text-main focus:ring-main"
                                />
                                <label htmlFor="is_active" className="text-sm text-gray-700">
                                    Aktif
                                </label>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-main text-white rounded-lg hover:bg-main-hover"
                                >
                                    {editingLink ? 'Simpan' : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
