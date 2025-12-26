'use client';

import { useState, useEffect } from 'react';
import { api, Promo } from '@/lib/api';

export default function PromosPage() {
    const [promos, setPromos] = useState<Promo[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: '',
        min_order: '',
        max_discount: '',
        max_uses: '',
        starts_at: '',
        expires_at: '',
        is_active: true,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadPromos();
    }, []);

    const loadPromos = async () => {
        try {
            setLoading(true);
            const response = await api.getPromos();
            setPromos(response.promos);
        } catch (err) {
            console.error('Failed to load promos:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const data = {
                code: formData.code,
                name: formData.name,
                description: formData.description || undefined,
                type: formData.type,
                value: parseFloat(formData.value),
                min_order: formData.min_order ? parseFloat(formData.min_order) : undefined,
                max_discount: formData.max_discount ? parseFloat(formData.max_discount) : undefined,
                max_uses: formData.max_uses ? parseInt(formData.max_uses) : undefined,
                starts_at: formData.starts_at || undefined,
                expires_at: formData.expires_at || undefined,
                is_active: formData.is_active,
            };

            if (editingPromo) {
                await api.updatePromo(editingPromo.id, data);
                setSuccess('Promo berhasil diperbarui');
            } else {
                await api.createPromo(data);
                setSuccess('Promo berhasil ditambahkan');
            }
            await loadPromos();
            resetForm();
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || 'Terjadi kesalahan');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus promo ini?')) return;

        try {
            await api.deletePromo(id);
            setSuccess('Promo berhasil dihapus');
            await loadPromos();
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || 'Gagal menghapus promo');
        }
    };

    const handleEdit = (promo: Promo) => {
        setEditingPromo(promo);
        setFormData({
            code: promo.code,
            name: promo.name,
            description: promo.description || '',
            type: promo.type,
            value: promo.value.toString(),
            min_order: promo.min_order?.toString() || '',
            max_discount: promo.max_discount?.toString() || '',
            max_uses: promo.max_uses?.toString() || '',
            starts_at: promo.starts_at ? new Date(promo.starts_at).toISOString().slice(0, 16) : '',
            expires_at: promo.expires_at ? new Date(promo.expires_at).toISOString().slice(0, 16) : '',
            is_active: promo.is_active,
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            code: '',
            name: '',
            description: '',
            type: 'percentage',
            value: '',
            min_order: '',
            max_discount: '',
            max_uses: '',
            starts_at: '',
            expires_at: '',
            is_active: true,
        });
        setEditingPromo(null);
        setShowForm(false);
    };

    const toggleActive = async (promo: Promo) => {
        try {
            await api.updatePromo(promo.id, { is_active: !promo.is_active });
            await loadPromos();
        } catch (err) {
            console.error('Failed to toggle promo:', err);
        }
    };

    const getStatusBadge = (promo: Promo) => {
        if (!promo.is_active) {
            return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Nonaktif</span>;
        }
        if (promo.is_expired) {
            return <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">Kadaluarsa</span>;
        }
        if (!promo.is_valid) {
            return <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">Tidak Valid</span>;
        }
        return <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">Aktif</span>;
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
                    <h1 className="text-2xl font-bold text-gray-900">Kode Promo</h1>
                    <p className="text-gray-500">Kelola kode diskon untuk pelanggan</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-[#374da0] text-white rounded-lg hover:bg-[#2c3e80] transition-colors"
                >
                    + Tambah Promo
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 my-8">
                        <h2 className="text-xl font-bold mb-4">
                            {editingPromo ? 'Edit Promo' : 'Tambah Promo Baru'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kode Promo
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#374da0] focus:border-transparent uppercase"
                                        placeholder="DISKON10"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nama Promo
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#374da0] focus:border-transparent"
                                        placeholder="Diskon Tahun Baru"
                                        required
                                    />
                                </div>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipe Diskon
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#374da0] focus:border-transparent"
                                    >
                                        <option value="percentage">Persentase (%)</option>
                                        <option value="fixed">Potongan Tetap (Rp)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nilai {formData.type === 'percentage' ? '(%)' : '(Rp)'}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#374da0] focus:border-transparent"
                                        min="0"
                                        max={formData.type === 'percentage' ? '100' : undefined}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Min. Pembelian (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.min_order}
                                        onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#374da0] focus:border-transparent"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maks. Diskon (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.max_discount}
                                        onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#374da0] focus:border-transparent"
                                        min="0"
                                        disabled={formData.type === 'fixed'}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Batas Penggunaan
                                </label>
                                <input
                                    type="number"
                                    value={formData.max_uses}
                                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#374da0] focus:border-transparent"
                                    min="1"
                                    placeholder="Kosongkan untuk unlimited"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mulai Berlaku
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.starts_at}
                                        onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#374da0] focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Berakhir
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.expires_at}
                                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#374da0] focus:border-transparent"
                                    />
                                </div>
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

                            <div className="flex gap-3 pt-4">
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
                                    {editingPromo ? 'Simpan' : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Promos List */}
            <div className="space-y-3">
                {promos.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <div className="text-4xl mb-4">🏷️</div>
                        <h3 className="font-medium text-gray-900">Belum ada promo</h3>
                        <p className="text-gray-500 text-sm">Buat kode promo pertama Anda</p>
                    </div>
                ) : (
                    promos.map((promo) => (
                        <div
                            key={promo.id}
                            className={`bg-white rounded-xl border p-4 ${!promo.is_active || promo.is_expired ? 'opacity-60' : ''
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <code className="px-2 py-1 bg-gray-100 rounded font-mono text-sm">
                                            {promo.code}
                                        </code>
                                        {getStatusBadge(promo)}
                                    </div>
                                    <h3 className="font-medium text-gray-900">{promo.name}</h3>
                                    {promo.description && (
                                        <p className="text-sm text-gray-500">{promo.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <span className="font-medium text-[#374da0]">
                                            {promo.formatted_value}
                                        </span>
                                        {promo.min_order && (
                                            <span>Min. Rp {promo.min_order.toLocaleString('id-ID')}</span>
                                        )}
                                        <span>
                                            {promo.used_count}/{promo.max_uses || '∞'} digunakan
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleActive(promo)}
                                        className={`p-2 rounded-lg ${promo.is_active
                                                ? 'text-green-600 hover:bg-green-50'
                                                : 'text-gray-400 hover:bg-gray-50'
                                            }`}
                                        title={promo.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                    >
                                        {promo.is_active ? '✅' : '⭕'}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(promo)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDelete(promo.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        title="Hapus"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
