'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, AdminAffiliate, AffiliateStats } from '@/lib/api';

export default function AdminAffiliatesPage() {
    const router = useRouter();
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const [affiliates, setAffiliates] = useState<AdminAffiliate[]>([]);
    const [stats, setStats] = useState<AffiliateStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAffiliate, setSelectedAffiliate] = useState<AdminAffiliate | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    // Filters
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.push('/login');
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (!authLoading && user && user.role !== 'admin') router.push('/dashboard');
    }, [authLoading, user, router]);

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') loadData();
    }, [isAuthenticated, user]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [affRes, statsRes] = await Promise.all([
                api.getAdminAffiliates({ status: statusFilter }),
                api.getAdminAffiliateStats(),
            ]);
            setAffiliates(affRes.affiliates);
            setStats(statsRes.stats);
        } catch (err) {
            console.error(err);
            setError('Gagal memuat data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') loadData();
    }, [statusFilter]);

    const handleApprove = async (id: number) => {
        setActionLoading(id);
        try {
            await api.approveAffiliate(id);
            setMessage({ type: 'success', text: 'Affiliate berhasil disetujui!' });
            loadData();
            setSelectedAffiliate(null);
        } catch (err: unknown) {
            const error = err as { message?: string };
            setMessage({ type: 'error', text: error.message || 'Gagal approve' });
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: number) => {
        if (rejectReason.length < 10) {
            setMessage({ type: 'error', text: 'Alasan minimal 10 karakter' });
            return;
        }
        setActionLoading(id);
        try {
            await api.rejectAffiliate(id, rejectReason);
            setMessage({ type: 'success', text: 'Affiliate ditolak' });
            loadData();
            setSelectedAffiliate(null);
            setRejectReason('');
        } catch (err: unknown) {
            const error = err as { message?: string };
            setMessage({ type: 'error', text: error.message || 'Gagal reject' });
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-700',
            approved: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700',
            suspended: 'bg-gray-100 text-gray-700',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>{status}</span>;
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="text-center"><p>{error}</p></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-fourth flex">
            {/* Sidebar */}
            <aside className="w-64 bg-fifth border-r border-gray-200 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Link href="/dashboard" className="text-xl font-bold text-main font-[family-name:var(--font-ubuntu)]">Shifr Asia</Link>
                </div>
                <div className="px-4 py-3 bg-second/10 border-b border-second/20">
                    <span className="text-xs font-semibold text-second uppercase">🔐 Admin Panel</span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <Link href="/admin/payments" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Payments
                    </Link>
                    <Link href="/admin/subscriptions" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        Subscriptions
                    </Link>
                    <Link href="/admin/affiliates" className="flex items-center px-4 py-3 text-second bg-second/10 rounded-lg font-medium">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Affiliates
                    </Link>
                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            Kembali ke Dashboard
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main */}
            <main className="flex-1">
                <header className="h-16 bg-fifth border-b border-gray-200 flex items-center px-6">
                    <h2 className="text-lg font-semibold text-gray-800">Admin - Affiliate Management</h2>
                </header>

                <div className="p-6 space-y-6">
                    {message && (
                        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                            <button onClick={() => setMessage(null)} className="float-right">×</button>
                        </div>
                    )}

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Pending Applications</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending_applications}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Approved Affiliates</p>
                                <p className="text-2xl font-bold text-green-600">{stats.approved_affiliates}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Total Referrals</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.total_referrals}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Total Komisi</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.formatted_total_earnings}</p>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex gap-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Status</label>
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-main">
                                    <option value="all">Semua</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">User</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Code</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Referrals</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Earnings</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {affiliates.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Tidak ada data</td></tr>
                                ) : (
                                    affiliates.map((a) => (
                                        <tr key={a.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-800">{a.user?.name || '-'}</div>
                                                <div className="text-xs text-gray-500">{a.user?.email || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4"><code className="text-sm bg-gray-100 px-2 py-1 rounded">{a.code}</code></td>
                                            <td className="px-6 py-4">{getStatusBadge(a.status)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{a.total_referrals}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">Rp {a.total_earnings.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button onClick={() => setSelectedAffiliate(a)} className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Detail</button>
                                                    {a.status === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleApprove(a.id)} disabled={actionLoading === a.id} className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50">
                                                                {actionLoading === a.id ? '...' : 'Approve'}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Detail Modal */}
                    {selectedAffiliate && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedAffiliate(null)}>
                            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Affiliate Detail</h3>
                                    <button onClick={() => setSelectedAffiliate(null)} className="text-gray-400 hover:text-gray-600">×</button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><p className="text-sm text-gray-500">Nama</p><p className="font-medium">{selectedAffiliate.user?.name}</p></div>
                                        <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{selectedAffiliate.user?.email}</p></div>
                                        <div><p className="text-sm text-gray-500">Kode</p><p className="font-medium"><code className="bg-gray-100 px-2 py-1 rounded">{selectedAffiliate.code}</code></p></div>
                                        <div><p className="text-sm text-gray-500">Status</p><p>{getStatusBadge(selectedAffiliate.status)}</p></div>
                                        <div><p className="text-sm text-gray-500">Komisi</p><p className="font-medium">{selectedAffiliate.commission_rate}%</p></div>
                                        <div><p className="text-sm text-gray-500">Daftar</p><p className="font-medium">{formatDate(selectedAffiliate.created_at)}</p></div>
                                    </div>
                                    {selectedAffiliate.motivation && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Motivasi</p>
                                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedAffiliate.motivation}</p>
                                        </div>
                                    )}

                                    {selectedAffiliate.status === 'pending' && (
                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="flex gap-2 mb-4">
                                                <button onClick={() => handleApprove(selectedAffiliate.id)} disabled={actionLoading === selectedAffiliate.id} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                                                    {actionLoading === selectedAffiliate.id ? 'Processing...' : '✓ Approve'}
                                                </button>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 mb-1">Alasan Reject (min 10 karakter)</label>
                                                <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Alasan penolakan..." />
                                                <button onClick={() => handleReject(selectedAffiliate.id)} disabled={actionLoading === selectedAffiliate.id || rejectReason.length < 10} className="mt-2 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                                                    ✕ Reject
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
