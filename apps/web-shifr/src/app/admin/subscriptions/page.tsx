'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, AdminSubscriptionFull, AdminReminder } from '@/lib/api';

interface ReminderStats {
    total_reminders: number;
    sent_today: number;
    pending: number;
    by_checkpoint: Record<string, number>;
}

export default function AdminSubscriptionsPage() {
    const router = useRouter();
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const [subscriptions, setSubscriptions] = useState<AdminSubscriptionFull[]>([]);
    const [stats, setStats] = useState<ReminderStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSub, setSelectedSub] = useState<AdminSubscriptionFull | null>(null);
    const [reminders, setReminders] = useState<AdminReminder[]>([]);
    const [loadingReminders, setLoadingReminders] = useState(false);
    const [triggerLoading, setTriggerLoading] = useState<number | null>(null);
    const [runCheckLoading, setRunCheckLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [tierFilter, setTierFilter] = useState('all');

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

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            loadData();
        }
    }, [isAuthenticated, user]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [subsRes, statsRes] = await Promise.all([
                api.getAdminSubscriptions({ status: statusFilter, tier: tierFilter }),
                api.getAdminReminderStats(),
            ]);

            setSubscriptions(subsRes.subscriptions);
            setStats(statsRes.stats);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Gagal memuat data. Pastikan Anda memiliki akses admin.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            loadData();
        }
    }, [statusFilter, tierFilter]);

    const loadReminders = async (sub: AdminSubscriptionFull) => {
        setSelectedSub(sub);
        setLoadingReminders(true);
        try {
            const res = await api.getAdminReminderHistory(sub.id);
            setReminders(res.reminders);
        } catch (err) {
            console.error('Error loading reminders:', err);
        } finally {
            setLoadingReminders(false);
        }
    };

    const handleTriggerReminder = async (subId: number, channel: 'email' | 'whatsapp' | 'both') => {
        setTriggerLoading(subId);
        try {
            const res = await api.triggerAdminReminder(subId, channel);
            setMessage({ type: 'success', text: res.message });
            loadData();
            if (selectedSub?.id === subId) {
                loadReminders(selectedSub);
            }
        } catch (err: unknown) {
            const error = err as { message?: string };
            setMessage({ type: 'error', text: error.message || 'Gagal mengirim reminder' });
        } finally {
            setTriggerLoading(null);
        }
    };

    const handleRunCheck = async () => {
        setRunCheckLoading(true);
        try {
            const res = await api.runAdminReminderCheck();
            setMessage({ type: 'success', text: `${res.message} (Email: ${res.sent.email}, WA: ${res.sent.whatsapp})` });
            loadData();
        } catch (err: unknown) {
            const error = err as { message?: string };
            setMessage({ type: 'error', text: error.message || 'Gagal menjalankan check' });
        } finally {
            setRunCheckLoading(false);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusBadge = (status: string, daysRemaining: number | null) => {
        if (status === 'active' && daysRemaining !== null && daysRemaining <= 7) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">Expiring</span>;
        }
        switch (status) {
            case 'active':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>;
            case 'expired':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Expired</span>;
            case 'trial':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Trial</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data subscriptions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="text-center bg-white rounded-xl shadow p-8 max-w-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link href="/dashboard" className="text-main hover:underline">
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-fourth flex">
            {/* Sidebar */}
            <aside className="w-64 bg-fifth border-r border-gray-200 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Link href="/dashboard" className="text-xl font-bold text-main font-[family-name:var(--font-ubuntu)]">
                        Shifr Asia
                    </Link>
                </div>
                <div className="px-4 py-3 bg-second/10 border-b border-second/20">
                    <span className="text-xs font-semibold text-second uppercase tracking-wide">🔐 Admin Panel</span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <Link href="/admin/payments" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Payments
                    </Link>
                    <Link href="/admin/subscriptions" className="flex items-center px-4 py-3 text-second bg-second/10 rounded-lg font-medium">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        Subscriptions
                    </Link>
                    <Link href="/admin/affiliates" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Affiliates
                    </Link>
                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Kembali ke Dashboard
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <header className="h-16 bg-fifth border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-second animate-pulse"></div>
                        <h2 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-ubuntu)]">
                            Admin - Subscription Reminders
                        </h2>
                    </div>
                    <button
                        onClick={handleRunCheck}
                        disabled={runCheckLoading}
                        className="px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {runCheckLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        )}
                        Run Reminder Check
                    </button>
                </header>

                <div className="p-6 space-y-6">
                    {/* Message */}
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
                                <p className="text-sm text-gray-500">Total Reminders Sent</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.total_reminders}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Sent Today</p>
                                <p className="text-2xl font-bold text-green-600">{stats.sent_today}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Subscriptions</p>
                                <p className="text-2xl font-bold text-blue-600">{subscriptions.length}</p>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex flex-wrap gap-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                                >
                                    <option value="all">Semua</option>
                                    <option value="active">Active</option>
                                    <option value="expired">Expired</option>
                                    <option value="trial">Trial</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Tier</label>
                                <select
                                    value={tierFilter}
                                    onChange={(e) => setTierFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                                >
                                    <option value="all">Semua</option>
                                    <option value="free">Free</option>
                                    <option value="starter">Starter</option>
                                    <option value="growth">Growth</option>
                                    <option value="pro">Pro</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Subscriptions Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">User</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tier</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Expires</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Days Left</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {subscriptions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            Tidak ada data subscription
                                        </td>
                                    </tr>
                                ) : (
                                    subscriptions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-800">{sub.user?.name || '-'}</div>
                                                <div className="text-xs text-gray-500">{sub.user?.email || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 capitalize">
                                                    {sub.tier}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(sub.status, sub.days_remaining)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(sub.expires_at)}</td>
                                            <td className="px-6 py-4">
                                                {sub.days_remaining !== null ? (
                                                    <span className={`text-sm font-medium ${sub.days_remaining <= 3 ? 'text-red-600' : sub.days_remaining <= 7 ? 'text-orange-600' : 'text-gray-600'}`}>
                                                        {sub.days_remaining} hari
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => loadReminders(sub)}
                                                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                                                    >
                                                        History
                                                    </button>
                                                    <button
                                                        onClick={() => handleTriggerReminder(sub.id, 'email')}
                                                        disabled={triggerLoading === sub.id}
                                                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition disabled:opacity-50"
                                                    >
                                                        {triggerLoading === sub.id ? '...' : '📧 Send'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Reminder History Modal */}
                    {selectedSub && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedSub(null)}>
                            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Reminder History - {selectedSub.user?.name}
                                        </h3>
                                        <button onClick={() => setSelectedSub(null)} className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {loadingReminders ? (
                                        <div className="text-center py-8">
                                            <div className="w-6 h-6 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto"></div>
                                        </div>
                                    ) : reminders.length === 0 ? (
                                        <p className="text-center text-gray-500 py-8">Belum ada reminder yang dikirim</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {reminders.map((r) => (
                                                <div key={r.id} className="p-4 bg-gray-50 rounded-lg">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${r.sent ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                {r.days_before_expiration} hari sebelum
                                                            </span>
                                                            <span className="ml-2 text-xs text-gray-500">{r.channel}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                                                    </div>
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        {r.email_sent_at && <div>📧 Email sent: {formatDate(r.email_sent_at)}</div>}
                                                        {r.whatsapp_sent_at && <div>📱 WhatsApp sent: {formatDate(r.whatsapp_sent_at)}</div>}
                                                    </div>
                                                </div>
                                            ))}
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
