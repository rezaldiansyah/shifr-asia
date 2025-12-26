'use client';

import { useState, useEffect } from 'react';
import { api, Link } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function LinksPage() {
    const { user } = useAuth();
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLink, setEditingLink] = useState<Link | null>(null);
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
        loadLinks();
    }, []);

    const loadLinks = async () => {
        try {
            setLoading(true);
            const response = await api.getLinks();
            setLinks(response.links);
        } catch (err) {
            console.error('Failed to load links:', err);
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
            await loadLinks();
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
            await loadLinks();
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || 'Gagal menghapus link');
        }
    };

    const handleEdit = (link: Link) => {
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

    const toggleActive = async (link: Link) => {
        try {
            await api.updateLink(link.id, { is_active: !link.is_active });
            await loadLinks();
        } catch (err) {
            console.error('Failed to toggle link:', err);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Link-in-Bio</h1>
                    <p className="text-gray-500">Kelola link untuk halaman bio Anda</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-[#374da0] text-white rounded-lg hover:bg-[#2c3e80] transition-colors"
                >
                    + Tambah Link
                </button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    {success}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <h2 className="text-xl font-bold mb-4">
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#374da0] focus:border-transparent"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#374da0] focus:border-transparent"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#374da0] focus:border-transparent"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#374da0] focus:border-transparent"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="rounded"
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
                                    className="flex-1 px-4 py-2 bg-[#374da0] text-white rounded-lg hover:bg-[#2c3e80]"
                                >
                                    {editingLink ? 'Simpan' : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Links List */}
            <div className="space-y-3">
                {links.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <div className="text-4xl mb-4">🔗</div>
                        <h3 className="font-medium text-gray-900">Belum ada link</h3>
                        <p className="text-gray-500 text-sm">Tambahkan link pertama Anda</p>
                    </div>
                ) : (
                    links.map((link) => (
                        <div
                            key={link.id}
                            className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${!link.is_active ? 'opacity-50' : ''
                                }`}
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
            {links.length > 0 && (
                <div className="bg-gradient-to-r from-[#374da0] to-[#2cbbbc] rounded-xl p-6 text-white">
                    <h3 className="font-bold mb-2">Halaman Bio Anda</h3>
                    <p className="text-white/80 text-sm mb-4">
                        Bagikan link ini ke followers Anda
                    </p>
                    <div className="flex items-center gap-3">
                        <code className="flex-1 bg-white/20 px-4 py-2 rounded-lg text-sm">
                            {typeof window !== 'undefined' && `${window.location.origin}/bio/${user?.email?.split('@')[0] || 'store'}`}
                        </code>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/bio/${user?.email?.split('@')[0] || 'store'}`);
                                setSuccess('Link berhasil disalin!');
                            }}
                            className="px-4 py-2 bg-white text-[#374da0] rounded-lg font-medium hover:bg-gray-100"
                        >
                            Salin
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
