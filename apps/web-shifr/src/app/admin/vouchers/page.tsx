'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface Voucher {
    id: number;
    code: string;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    formatted_value: string;
    max_discount: number | null;
    applicable_tiers: string[] | null;
    applicable_tiers_text: string;
    max_uses: number | null;
    used_count: number;
    starts_at: string | null;
    expires_at: string | null;
    is_active: boolean;
    is_valid: boolean;
    created_by: string | null;
    created_at: string;
}

interface VoucherStats {
    total_vouchers: number;
    active_vouchers: number;
    valid_vouchers: number;
    total_used: number;
}

export default function AdminVouchersPage() {
    const router = useRouter();
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();

    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [stats, setStats] = useState<VoucherStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: '',
        max_discount: '',
        applicable_tiers: [] as string[],
        max_uses: '',
        starts_at: '',
        expires_at: '',
        is_active: true,
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (!authLoading && user && user.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [authLoading, user, router]);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [vouchersRes, statsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/vouchers?status=${statusFilter}`, {
                    headers: { 'Authorization': `Bearer ${api.getToken()}` },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/vouchers/stats`, {
                    headers: { 'Authorization': `Bearer ${api.getToken()}` },
                }),
            ]);
            const vouchersData = await vouchersRes.json();
            const statsData = await statsRes.json();
            setVouchers(vouchersData.vouchers || []);
            setStats(statsData.stats);
        } catch (err) {
            console.error('Error loading data:', err);
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            loadData();
        }
    }, [isAuthenticated, user, loadData]);

    const handleToggle = async (voucher: Voucher) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/vouchers/${voucher.id}/toggle`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${api.getToken()}` },
            });
            loadData();
        } catch (err) {
            console.error('Error toggling voucher:', err);
        }
    };

    const handleDelete = async (voucher: Voucher) => {
        if (!confirm(`Hapus voucher ${voucher.code}?`)) return;
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/vouchers/${voucher.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${api.getToken()}` },
            });
            loadData();
        } catch (err) {
            console.error('Error deleting voucher:', err);
        }
    };

    const openCreateModal = () => {
        setEditingVoucher(null);
        setFormData({
            code: '', name: '', description: '', type: 'percentage', value: '',
            max_discount: '', applicable_tiers: [], max_uses: '', starts_at: '', expires_at: '', is_active: true,
        });
        setFormError(null);
        setShowModal(true);
    };

    const openEditModal = (voucher: Voucher) => {
        setEditingVoucher(voucher);
        setFormData({
            code: voucher.code,
            name: voucher.name,
            description: '',
            type: voucher.type,
            value: voucher.value.toString(),
            max_discount: voucher.max_discount?.toString() || '',
            applicable_tiers: voucher.applicable_tiers || [],
            max_uses: voucher.max_uses?.toString() || '',
            starts_at: voucher.starts_at?.slice(0, 16) || '',
            expires_at: voucher.expires_at?.slice(0, 16) || '',
            is_active: voucher.is_active,
        });
        setFormError(null);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        try {
            const payload = {
                code: formData.code,
                name: formData.name,
                description: formData.description || null,
                type: formData.type,
                value: parseFloat(formData.value),
                max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
                applicable_tiers: formData.applicable_tiers.length > 0 ? formData.applicable_tiers : null,
                max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
                starts_at: formData.starts_at || null,
                expires_at: formData.expires_at || null,
                is_active: formData.is_active,
            };

            const url = editingVoucher
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/vouchers/${editingVoucher.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/vouchers`;

            const res = await fetch(url, {
                method: editingVoucher ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api.getToken()}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) {
                setFormError(data.message || 'Terjadi kesalahan');
                return;
            }

            setShowModal(false);
            loadData();
        } catch (err) {
            setFormError('Gagal menyimpan voucher');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-fourth">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-4 hidden lg:block">
                    <div className="mb-8">
                        <h1 className="text-xl font-bold text-main">Shifr Admin</h1>
                    </div>
                    <nav className="space-y-1">
                        <Link href="/admin/payments" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                            <span>💳</span> Payments
                        </Link>
                        <Link href="/admin/subscriptions" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                            <span>📅</span> Subscriptions
                        </Link>
                        <Link href="/admin/affiliates" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                            <span>🤝</span> Affiliates
                        </Link>
                        <Link href="/admin/vouchers" className="flex items-center gap-3 px-4 py-3 bg-main/10 text-main font-medium rounded-lg">
                            <span>🎟️</span> Vouchers
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Kelola Voucher</h1>
                            <button onClick={openCreateModal} className="bg-main text-white px-4 py-2 rounded-lg font-medium hover:bg-main-hover transition">
                                + Buat Voucher
                            </button>
                        </div>

                        {/* Stats */}
                        {stats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <p className="text-sm text-gray-500">Total Voucher</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.total_vouchers}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <p className="text-sm text-gray-500">Aktif</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.active_vouchers}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <p className="text-sm text-gray-500">Valid</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.valid_vouchers}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <p className="text-sm text-gray-500">Total Digunakan</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.total_used}</p>
                                </div>
                            </div>
                        )}

                        {/* Filter */}
                        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="all">Semua</option>
                                <option value="active">Aktif</option>
                                <option value="expired">Kadaluarsa</option>
                            </select>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kode</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nama</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Diskon</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Paket</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Penggunaan</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Berlaku</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {vouchers.map((v) => (
                                        <tr key={v.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-mono font-bold text-main">{v.code}</td>
                                            <td className="px-4 py-3 text-gray-800">{v.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{v.formatted_value}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{v.applicable_tiers_text}</td>
                                            <td className="px-4 py-3 text-gray-600">{v.used_count}/{v.max_uses || '∞'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {formatDate(v.starts_at)} - {formatDate(v.expires_at)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.is_valid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {v.is_valid ? 'Valid' : 'Invalid'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => handleToggle(v)} className={`mr-2 px-2 py-1 rounded text-xs ${v.is_active ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                    {v.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                </button>
                                                <button onClick={() => openEditModal(v)} className="mr-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Edit</button>
                                                <button onClick={() => handleDelete(v)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {vouchers.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-8 text-center text-gray-500">Belum ada voucher</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-lg font-bold">{editingVoucher ? 'Edit Voucher' : 'Buat Voucher Baru'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            {formError && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{formError}</div>}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kode*</label>
                                    <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full px-3 py-2 border rounded-lg uppercase" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama*</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipe*</label>
                                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                                        className="w-full px-3 py-2 border rounded-lg">
                                        <option value="percentage">Persentase (%)</option>
                                        <option value="fixed">Nominal (Rp)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nilai*</label>
                                    <input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg" required />
                                </div>
                            </div>

                            {formData.type === 'percentage' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Maksimal Diskon (Rp)</label>
                                    <input type="number" value={formData.max_discount} onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg" placeholder="Kosongkan jika tidak ada batas" />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Berlaku untuk Paket</label>
                                <div className="flex gap-4">
                                    {['starter', 'growth', 'pro'].map(tier => (
                                        <label key={tier} className="flex items-center gap-2">
                                            <input type="checkbox" checked={formData.applicable_tiers.includes(tier)}
                                                onChange={(e) => {
                                                    const tiers = e.target.checked
                                                        ? [...formData.applicable_tiers, tier]
                                                        : formData.applicable_tiers.filter(t => t !== tier);
                                                    setFormData({ ...formData, applicable_tiers: tiers });
                                                }} />
                                            <span className="capitalize">{tier}</span>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Kosongkan untuk semua paket</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Maksimal Penggunaan</label>
                                <input type="number" value={formData.max_uses} onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg" placeholder="Kosongkan jika unlimited" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mulai Berlaku</label>
                                    <input type="datetime-local" value={formData.starts_at} onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kadaluarsa</label>
                                    <input type="datetime-local" value={formData.expires_at} onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} />
                                <label htmlFor="is_active" className="text-sm">Langsung aktif</label>
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-main text-white rounded-lg font-medium hover:bg-main-hover disabled:opacity-50">
                                {isSubmitting ? 'Menyimpan...' : (editingVoucher ? 'Simpan Perubahan' : 'Buat Voucher')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
