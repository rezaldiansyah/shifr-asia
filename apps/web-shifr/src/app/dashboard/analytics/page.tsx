'use client';

import { useState, useEffect } from 'react';
import { api, AnalyticsSummary, AnalyticsCharts } from '@/lib/api';

type Period = '24h' | '7d' | '30d' | '90d';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<Period>('7d');
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [charts, setCharts] = useState<AnalyticsCharts | null>(null);

    useEffect(() => {
        loadAnalytics();
    }, [period]);

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

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
                <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
        );
    }

    const maxViews = charts?.daily ? Math.max(...charts.daily.map(d => d.views), 1) : 1;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-500">Pantau performa toko Anda</p>
                </div>
                <div className="flex gap-2">
                    {(Object.keys(periodLabels) as Period[]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === p
                                    ? 'bg-[#374da0] text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {periodLabels[p]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border p-6">
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

                <div className="bg-white rounded-xl border p-6">
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

                <div className="bg-white rounded-xl border p-6">
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

                <div className="bg-white rounded-xl border p-6">
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
                    <div className="bg-gradient-to-r from-[#374da0] to-[#327eac] rounded-xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🔗</span>
                            <span className="text-white/80">Bio Views</span>
                        </div>
                        <div className="text-3xl font-bold">
                            {formatNumber(summary?.bio_views || 0)}
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-[#2cbbbc] to-[#327eac] rounded-xl p-6 text-white">
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
            <div className="bg-white rounded-xl border p-6">
                <h2 className="font-bold text-gray-900 mb-4">Trend Harian</h2>
                {charts?.daily && charts.daily.length > 0 ? (
                    <div className="space-y-2">
                        {/* Simple bar chart */}
                        <div className="flex items-end gap-1 h-48">
                            {charts.daily.map((day, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full bg-[#374da0] rounded-t transition-all hover:bg-[#2cbbbc]"
                                        style={{ height: `${(day.views / maxViews) * 100}%`, minHeight: day.views > 0 ? '4px' : '0' }}
                                        title={`${day.views} views`}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* X-axis labels */}
                        <div className="flex gap-1 text-xs text-gray-500">
                            {charts.daily.map((day, i) => (
                                <div key={i} className="flex-1 text-center truncate">
                                    {new Date(day.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </div>
                            ))}
                        </div>
                        {/* Legend */}
                        <div className="flex justify-center gap-6 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-[#374da0] rounded"></div>
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
                {/* Top Products */}
                <div className="bg-white rounded-xl border p-6">
                    <h2 className="font-bold text-gray-900 mb-4">Produk Populer</h2>
                    {charts?.top_products && charts.top_products.length > 0 ? (
                        <div className="space-y-3">
                            {charts.top_products.map((product, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
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

                {/* Top Pages */}
                <div className="bg-white rounded-xl border p-6">
                    <h2 className="font-bold text-gray-900 mb-4">Halaman Populer</h2>
                    {charts?.top_pages && charts.top_pages.length > 0 ? (
                        <div className="space-y-3">
                            {charts.top_pages.slice(0, 5).map((page, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
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
    );
}
