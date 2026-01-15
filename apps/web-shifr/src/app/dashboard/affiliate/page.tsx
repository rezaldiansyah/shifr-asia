'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, AffiliateStatus, AffiliateDashboard } from '@/lib/api';

export default function AffiliatePage() {
    const router = useRouter();
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();
    const [status, setStatus] = useState<AffiliateStatus | null>(null);
    const [dashboard, setDashboard] = useState<AffiliateDashboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [motivation, setMotivation] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [copied, setCopied] = useState(false);

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
            setIsLoading(true);
            const statusRes = await api.getAffiliateStatus();
            setStatus(statusRes);

            if (statusRes.is_affiliate && statusRes.affiliate?.status === 'approved') {
                const dashRes = await api.getAffiliateDashboard();
                setDashboard(dashRes);
            }
        } catch (err) {
            console.error('Error loading affiliate status:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = async () => {
        if (motivation.length < 20) {
            setMessage({ type: 'error', text: 'Motivasi minimal 20 karakter' });
            return;
        }

        setApplying(true);
        try {
            await api.applyAffiliate({ motivation });
            setMessage({ type: 'success', text: 'Pendaftaran berhasil! Harap tunggu persetujuan admin.' });
            loadData();
        } catch (err: unknown) {
            const error = err as { message?: string };
            setMessage({ type: 'error', text: error.message || 'Gagal mendaftar' });
        } finally {
            setApplying(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
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
            {/* Header */}
            <div className="bg-gradient-to-r from-main to-second text-white py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    <Link href="/dashboard" className="text-white/80 hover:text-white text-sm mb-4 inline-block">
                        ← Kembali ke Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold font-[family-name:var(--font-ubuntu)]">Program Affiliate</h1>
                    <p className="mt-2 text-white/80">Dapatkan komisi dari setiap referral yang berlangganan!</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                        <button onClick={() => setMessage(null)} className="float-right">×</button>
                    </div>
                )}

                {/* Not an affiliate - Show apply form */}
                {status && !status.is_affiliate && (
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Jadi Affiliate</h2>
                        <p className="text-gray-600 mb-6">
                            Bagikan link referral Anda dan dapatkan <strong>komisi 10%</strong> dari setiap pembayaran subscription yang datang melalui link Anda!
                        </p>

                        <div className="bg-gradient-to-r from-main/10 to-second/10 rounded-xl p-6 mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Keuntungan menjadi Affiliate:</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Komisi 10% dari setiap transaksi referral
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Link referral unik untuk tracking
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Dashboard untuk monitor performa
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Pembayaran mudah via transfer bank
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kenapa Anda ingin menjadi affiliate? (min. 20 karakter)
                                </label>
                                <textarea
                                    value={motivation}
                                    onChange={(e) => setMotivation(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                    placeholder="Ceritakan bagaimana Anda akan mempromosikan Shifr Asia..."
                                />
                                <p className="text-xs text-gray-400 mt-1">{motivation.length}/20 karakter</p>
                            </div>

                            <button
                                onClick={handleApply}
                                disabled={applying || motivation.length < 20}
                                className="w-full py-3 bg-main text-white rounded-lg font-medium hover:bg-main/90 transition disabled:opacity-50"
                            >
                                {applying ? 'Mengirim...' : 'Daftar Jadi Affiliate'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Pending status */}
                {status?.affiliate?.status === 'pending' && (
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Menunggu Persetujuan</h2>
                        <p className="text-gray-600">
                            Pendaftaran Anda sedang ditinjau oleh admin. Kami akan menghubungi Anda segera.
                        </p>
                        <p className="text-sm text-gray-400 mt-4">
                            Kode affiliate Anda: <code className="bg-gray-100 px-2 py-1 rounded">{status.affiliate.code}</code>
                        </p>
                    </div>
                )}

                {/* Rejected status */}
                {status?.affiliate?.status === 'rejected' && (
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pendaftaran Ditolak</h2>
                        <p className="text-gray-600">Maaf, pendaftaran affiliate Anda tidak disetujui saat ini.</p>
                    </div>
                )}

                {/* Approved - Dashboard */}
                {status?.affiliate?.status === 'approved' && dashboard && (
                    <div className="space-y-6">
                        {/* Referral Link */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Link Referral Anda</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={dashboard.affiliate.referral_url}
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
                                />
                                <button
                                    onClick={() => copyToClipboard(dashboard.affiliate.referral_url)}
                                    className="px-6 py-3 bg-main text-white rounded-lg font-medium hover:bg-main/90 transition"
                                >
                                    {copied ? '✓ Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Klik</p>
                                <p className="text-2xl font-bold text-gray-800">{dashboard.affiliate.total_clicks}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Referral</p>
                                <p className="text-2xl font-bold text-green-600">{dashboard.affiliate.total_referrals}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Total Komisi</p>
                                <p className="text-2xl font-bold text-gray-800">{dashboard.affiliate.formatted_earnings}</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <p className="text-sm text-gray-500">Pending Payout</p>
                                <p className="text-2xl font-bold text-yellow-600">{dashboard.affiliate.formatted_pending}</p>
                            </div>
                        </div>

                        {/* Recent Referrals */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-800">Referral Terbaru</h3>
                            </div>
                            {dashboard.recent_referrals.length === 0 ? (
                                <div className="px-6 py-12 text-center text-gray-500">
                                    Belum ada referral. Bagikan link Anda untuk mulai mendapatkan komisi!
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">User</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Tier</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Komisi</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Status</th>
                                            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {dashboard.recent_referrals.map((ref) => (
                                            <tr key={ref.id}>
                                                <td className="px-6 py-4 text-sm text-gray-800">{ref.user_name || '-'}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{ref.tier || '-'}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-green-600">{ref.formatted_commission}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${ref.status === 'paid' ? 'bg-green-100 text-green-700' : ref.status === 'approved' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {ref.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(ref.created_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
