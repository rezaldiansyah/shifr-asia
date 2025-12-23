'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface PaymentRecord {
    id: number;
    tier: string;
    tier_name: string;
    amount: number;
    formatted_amount: string;
    status: string;
    is_paid: boolean;
    paid_at: string | null;
    created_at: string;
}

export default function TransactionHistoryPage() {
    const router = useRouter();
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadPayments();
        }
    }, [isAuthenticated]);

    const loadPayments = async () => {
        try {
            const res = await api.getPaymentHistory();
            setPayments(res.payments);
        } catch (err) {
            console.error('Error loading payments:', err);
        } finally {
            setIsLoading(false);
        }
    };

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
            case 'cancelled':
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Dibatalkan</span>;
            default:
                return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
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
                    <Link href="/dashboard" className="text-xl font-bold text-main font-[family-name:var(--font-ubuntu)]">
                        Shifr Asia
                    </Link>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <Link href="/dashboard" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                    </Link>
                    <Link href="/dashboard/subscription" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Langganan
                    </Link>
                    <Link href="/dashboard/transactions" className="flex items-center px-4 py-3 text-main bg-main/10 rounded-lg font-medium">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Riwayat Transaksi
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <header className="h-16 bg-fifth border-b border-gray-200 flex items-center px-6">
                    <h2 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-ubuntu)]">
                        Riwayat Transaksi
                    </h2>
                </header>

                <div className="p-6">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {payments.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum Ada Transaksi</h3>
                                <p className="text-gray-500 mb-4">
                                    Riwayat pembayaran langganan akan muncul di sini.
                                </p>
                                <Link
                                    href="/dashboard/subscription"
                                    className="inline-block bg-main hover:bg-main-hover text-white font-semibold px-6 py-2 rounded-lg transition"
                                >
                                    Lihat Paket Langganan
                                </Link>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tanggal</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Paket</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Jumlah</th>
                                        <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {payments.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-800">
                                                    {formatDate(payment.paid_at || payment.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-800">{payment.tier_name}</div>
                                                <div className="text-sm text-gray-500">Tier: {payment.tier}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800">{payment.formatted_amount}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(payment.status, payment.is_paid)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Summary Card */}
                    {payments.length > 0 && (
                        <div className="mt-6 bg-gradient-to-r from-main to-second rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-80">Total Transaksi Sukses</p>
                                    <p className="text-2xl font-bold">
                                        {payments.filter(p => p.is_paid).length} transaksi
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-80">Total Pembayaran</p>
                                    <p className="text-2xl font-bold">
                                        Rp {payments
                                            .filter(p => p.is_paid)
                                            .reduce((sum, p) => sum + p.amount, 0)
                                            .toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
