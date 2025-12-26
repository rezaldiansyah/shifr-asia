'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, AnalyticsSummary, AnalyticsCharts } from '@/lib/api';

type Period = '24h' | '7d' | '30d' | '90d';

export default function AnalyticsPage() {
    const router = useRouter();
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<Period>('7d');
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [charts, setCharts] = useState<AnalyticsCharts | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadAnalytics();
        }
    }, [isAuthenticated, period]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const [summaryRes, chartsRes] = await Promise.all([
                api.getAnalyticsSummary(period),
                api.getAnalyticsCharts(period),
            ]);
            setSummary(summaryRes.summary);
            setCharts(chartsRes);
        } catch (err) {
            console.error('Failed to load analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const periodLabels: Record<Period, string> = {
        '24h': '24 Jam',
        '7d': '7 Hari',
        '30d': '30 Hari',
        '90d': '90 Hari',
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const maxViews = charts?.daily ? Math.max(...charts.daily.map(d => d.views), 1) : 1;

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
                    <Link href="/dashboard/links" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
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
                    <Link href="/dashboard/analytics" className="flex items-center px-4 py-3 text-main bg-main/10 rounded-lg font-medium">
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
                    <h2 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-ubuntu)]">Analytics</h2>
                    <div className="flex gap-2">
                        {(Object.keys(periodLabels) as Period[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p
                                    ? 'bg-main text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {periodLabels[p]}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="p-6">
                    {loading ? (
                        <div className="animate-pulse space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                                ))}
                            </div>
                            <div className="h-64 bg-gray-200 rounded-xl"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-fifth rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                                            👁️
                                        </div>
                                        <span className="text-gray-500 text-sm">Total Views</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {formatNumber(summary?.total_views || 0)}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {formatNumber(summary?.unique_visitors || 0)} pengunjung unik
                                    </div>
                                </div>

                                <div className="bg-fifth rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">
                                            👆
                                        </div>
                                        <span className="text-gray-500 text-sm">Total Clicks</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {formatNumber(summary?.total_clicks || 0)}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Klik produk & link
                                    </div>
                                </div>

                                <div className="bg-fifth rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
                                            🛒
                                        </div>
                                        <span className="text-gray-500 text-sm">Orders</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {formatNumber(summary?.total_orders || 0)}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Pesanan masuk
                                    </div>
                                </div>

                                <div className="bg-fifth rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">
                                            📈
                                        </div>
                                        <span className="text-gray-500 text-sm">Conversion</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {summary?.conversion_rate || 0}%
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Rasio konversi
                                    </div>
                                </div>
                            </div>

                            {/* Bio Stats */}
                            {(summary?.bio_views || summary?.link_clicks) ? (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-r from-main to-third rounded-xl p-6 text-white shadow-sm">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">🔗</span>
                                            <span className="text-white/80">Bio Views</span>
                                        </div>
                                        <div className="text-3xl font-bold">
                                            {formatNumber(summary?.bio_views || 0)}
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-second to-third rounded-xl p-6 text-white shadow-sm">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">👆</span>
                                            <span className="text-white/80">Link Clicks</span>
                                        </div>
                                        <div className="text-3xl font-bold">
                                            {formatNumber(summary?.link_clicks || 0)}
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {/* Daily Chart */}
                            <div className="bg-fifth rounded-xl p-6 shadow-sm">
                                <h2 className="font-bold text-gray-900 mb-4 font-[family-name:var(--font-ubuntu)]">Trend Harian</h2>
                                {charts?.daily && charts.daily.length > 0 ? (
                                    <div className="space-y-2">
                                        <div className="flex items-end gap-1 h-48">
                                            {charts.daily.map((day, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                    <div
                                                        className="w-full bg-main rounded-t transition-all hover:bg-second"
                                                        style={{ height: `${(day.views / maxViews) * 100}%`, minHeight: day.views > 0 ? '4px' : '0' }}
                                                        title={`${day.views} views`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-1 text-xs text-gray-500">
                                            {charts.daily.map((day, i) => (
                                                <div key={i} className="flex-1 text-center truncate">
                                                    {new Date(day.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-center gap-6 mt-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-main rounded"></div>
                                                <span className="text-gray-600">Views</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="text-4xl mb-4">📊</div>
                                        <p>Belum ada data untuk periode ini</p>
                                    </div>
                                )}
                            </div>

                            {/* Top Products & Pages */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-fifth rounded-xl p-6 shadow-sm">
                                    <h2 className="font-bold text-gray-900 mb-4 font-[family-name:var(--font-ubuntu)]">Produk Populer</h2>
                                    {charts?.top_products && charts.top_products.length > 0 ? (
                                        <div className="space-y-3">
                                            {charts.top_products.map((product, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-main/10 rounded-lg flex items-center justify-center text-sm font-bold text-main">
                                                        {i + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-900 truncate">
                                                            {product.product_name}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {product.views} views
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>Belum ada data produk</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-fifth rounded-xl p-6 shadow-sm">
                                    <h2 className="font-bold text-gray-900 mb-4 font-[family-name:var(--font-ubuntu)]">Halaman Populer</h2>
                                    {charts?.top_pages && charts.top_pages.length > 0 ? (
                                        <div className="space-y-3">
                                            {charts.top_pages.slice(0, 5).map((page, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-main/10 rounded-lg flex items-center justify-center text-sm font-bold text-main">
                                                        {i + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-900 truncate">
                                                            {page.page || 'Homepage'}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {page.count} views
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>Belum ada data halaman</p>
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
