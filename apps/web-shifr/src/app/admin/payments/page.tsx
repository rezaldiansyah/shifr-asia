'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, AdminPayment, AdminSubscription } from '@/lib/api';

interface DashboardData {
    overview: {
        total_users: number;
        active_subscriptions: number;
        pending_payments: number;
        total_revenue: number;
        total_revenue_formatted: string;
        this_month_revenue: number;
        this_month_revenue_formatted: string;
    };
    alerts: {
        expiring_in_3_days: number;
        expiring_in_7_days: number;
    };
    revenue_by_tier: Array<{
        tier: string;
        total: number;
        total_formatted: string;
        count: number;
    }>;
}

interface ExpiringData {
    expiring_soon: {
        count: number;
        subscriptions: AdminSubscription[];
    };
    expired: {
        count: number;
        subscriptions: AdminSubscription[];
    };
}

export default function AdminPaymentsPage() {
    const router = useRouter();
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [payments, setPayments] = useState<AdminPayment[]>([]);
    const [expiring, setExpiring] = useState<ExpiringData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'payments' | 'expiring'>('payments');

    // Filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [gatewayFilter, setGatewayFilter] = useState('all');

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

            const [dashboardRes, paymentsRes, expiringRes] = await Promise.all([
                api.getAdminDashboard(),
                api.getAdminPayments({ status: statusFilter, gateway: gatewayFilter }),
                api.getAdminExpiring(7),
            ]);

            setDashboard(dashboardRes);
            setPayments(paymentsRes.payments);
            setExpiring(expiringRes);
        } catch (err) {
            console.error('Error loading admin data:', err);
            setError('Gagal memuat data. Pastikan Anda memiliki akses admin.');
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = async () => {
        try {
            const res = await api.getAdminPayments({ status: statusFilter, gateway: gatewayFilter });
            setPayments(res.payments);
        } catch (err) {
            console.error('Error filtering payments:', err);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            applyFilters();
        }
    }, [statusFilter, gatewayFilter]);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string, isPaid: boolean) => {
        if (isPaid) {
            return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Sukses</span>;
        }
        switch (status) {
            case 'pending':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Pending</span>;
            case 'failed':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Gagal</span>;
            case 'expired':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Expired</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat dashboard admin...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="text-center bg-white rounded-xl shadow p-8 max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Akses Ditolak</h2>
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
            {/* Sidebar - Admin uses second color accent */}
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
                    <Link href="/admin/payments" className="flex items-center px-4 py-3 text-second bg-second/10 rounded-lg font-medium">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Payments
                    </Link>
                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <p className="px-4 text-xs text-gray-400 uppercase mb-2">User Dashboard</p>
                        <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Kembali ke Dashboard
                        </Link>
                    </div>
                </nav>
                {/* User Info */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-second/20 rounded-full flex items-center justify-center">
                            <span className="text-second font-semibold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-700 truncate">{user?.name}</p>
                            <p className="text-xs text-second font-medium">Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <header className="h-16 bg-fifth border-b border-gray-200 flex items-center px-6">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-second animate-pulse"></div>
                        <h2 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-ubuntu)]">
                            Admin - Payment Dashboard
                        </h2>
                    </div>
                </header>

                <div className="p-6 space-y-6">
                    {/* Overview Stats */}
                    {dashboard && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-800">{dashboard.overview.total_revenue_formatted}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Revenue Bulan Ini</p>
                                <p className="text-2xl font-bold text-green-600">{dashboard.overview.this_month_revenue_formatted}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Active Subscriptions</p>
                                <p className="text-2xl font-bold text-blue-600">{dashboard.overview.active_subscriptions}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Pending Payments</p>
                                <p className="text-2xl font-bold text-yellow-600">{dashboard.overview.pending_payments}</p>
                            </div>
                        </div>
                    )}

                    {/* Alerts */}
                    {dashboard && (dashboard.alerts.expiring_in_3_days > 0 || dashboard.alerts.expiring_in_7_days > 0) && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-orange-800">Perlu Perhatian!</p>
                                    <p className="text-sm text-orange-700">
                                        {dashboard.alerts.expiring_in_3_days} langganan expired dalam 3 hari, {dashboard.alerts.expiring_in_7_days} dalam 7 hari
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('payments')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'payments'
                                ? 'bg-main text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Semua Payments
                        </button>
                        <button
                            onClick={() => setActiveTab('expiring')}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'expiring'
                                ? 'bg-main text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Expiring Soon
                            {expiring && (expiring.expiring_soon.count + expiring.expired.count) > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                    {expiring.expiring_soon.count + expiring.expired.count}
                                </span>
                            )}
                        </button>
                    </div>

                    {activeTab === 'payments' && (
                        <>
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
                                            <option value="paid">Sukses</option>
                                            <option value="pending">Pending</option>
                                            <option value="failed">Gagal</option>
                                            <option value="expired">Expired</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Gateway</label>
                                        <select
                                            value={gatewayFilter}
                                            onChange={(e) => setGatewayFilter(e.target.value)}
                                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                                        >
                                            <option value="all">Semua</option>
                                            <option value="duitku">Duitku</option>
                                            <option value="mayar">Mayar</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Payments Table */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tanggal</th>
                                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">User</th>
                                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tier</th>
                                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Amount</th>
                                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Gateway</th>
                                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {payments.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                    Tidak ada data payment
                                                </td>
                                            </tr>
                                        ) : (
                                            payments.map((payment) => (
                                                <tr key={payment.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {formatDate(payment.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-800">{payment.user?.name || '-'}</div>
                                                        <div className="text-xs text-gray-500">{payment.user?.email || '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">{payment.tier_name}</td>
                                                    <td className="px-6 py-4 font-semibold text-gray-800">{payment.formatted_amount}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 uppercase">
                                                            {payment.payment_gateway}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">{getStatusBadge(payment.status, payment.is_paid)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === 'expiring' && expiring && (
                        <div className="space-y-6">
                            {/* Expired (Need Billing) */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                                    <h3 className="font-semibold text-red-800">
                                        🚨 Sudah Expired ({expiring.expired.count})
                                    </h3>
                                    <p className="text-sm text-red-600">Langganan ini sudah expired dan perlu ditagih kembali</p>
                                </div>
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">User</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Tier</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Expired</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {expiring.expired.subscriptions.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                    ✅ Tidak ada langganan expired
                                                </td>
                                            </tr>
                                        ) : (
                                            expiring.expired.subscriptions.map((sub) => (
                                                <tr key={sub.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-800">{sub.user?.name || '-'}</div>
                                                        <div className="text-xs text-gray-500">{sub.user?.email || '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">{sub.tier_name}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-red-600 font-medium">
                                                            {sub.days_overdue} hari lalu
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {sub.user?.phone ? (
                                                            <a
                                                                href={`https://wa.me/${sub.user.phone.replace(/^0/, '62')}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-green-600 hover:underline text-sm"
                                                            >
                                                                {sub.user.phone}
                                                            </a>
                                                        ) : '-'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Expiring Soon */}
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
                                    <h3 className="font-semibold text-yellow-800">
                                        ⚠️ Akan Expired dalam 7 Hari ({expiring.expiring_soon.count})
                                    </h3>
                                    <p className="text-sm text-yellow-600">Kirim reminder untuk perpanjangan langganan</p>
                                </div>
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">User</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Tier</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Sisa</th>
                                            <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {expiring.expiring_soon.subscriptions.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                    ✅ Tidak ada langganan yang akan expired
                                                </td>
                                            </tr>
                                        ) : (
                                            expiring.expiring_soon.subscriptions.map((sub) => (
                                                <tr key={sub.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-800">{sub.user?.name || '-'}</div>
                                                        <div className="text-xs text-gray-500">{sub.user?.email || '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800">{sub.tier_name}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-sm font-medium ${(sub.days_remaining ?? 0) <= 3 ? 'text-red-600' : 'text-yellow-600'
                                                            }`}>
                                                            {sub.days_remaining} hari
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {sub.user?.phone ? (
                                                            <a
                                                                href={`https://wa.me/${sub.user.phone.replace(/^0/, '62')}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-green-600 hover:underline text-sm"
                                                            >
                                                                {sub.user.phone}
                                                            </a>
                                                        ) : '-'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Revenue by Tier */}
                    {dashboard && dashboard.revenue_by_tier.length > 0 && activeTab === 'payments' && (
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Tier</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {dashboard.revenue_by_tier.map((tier) => (
                                    <div key={tier.tier} className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-500 capitalize">{tier.tier}</p>
                                        <p className="text-lg font-bold text-gray-800">{tier.total_formatted}</p>
                                        <p className="text-xs text-gray-400">{tier.count} transaksi</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
