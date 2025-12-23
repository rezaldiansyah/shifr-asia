'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api, Subscription, Tier } from '@/lib/api';
import TierCard from '@/components/subscription/TierCard';
import UsageBar from '@/components/subscription/UsageBar';

export default function SubscriptionPage() {
    const router = useRouter();
    const { isLoading: authLoading, isAuthenticated } = useAuth();

    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [usage, setUsage] = useState<{ used: number; limit: number; percentage: number; remaining: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

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
            const [subRes, tiersRes, usageRes] = await Promise.all([
                api.getSubscription(),
                api.getTiers(),
                api.getSubscriptionUsage(),
            ]);

            setSubscription(subRes.subscription);
            setTiers(tiersRes.tiers);
            setUsage(usageRes.usage.products);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Gagal memuat data langganan');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectTier = (tierKey: string) => {
        setSelectedTier(tierKey);
        setShowUpgradeModal(true);
    };

    const handleConfirmChange = async () => {
        if (!selectedTier) return;

        setIsProcessing(true);
        setError(null);

        try {
            // Check if it's an upgrade (needs payment)
            const currentTierIndex = ['free', 'starter', 'growth', 'pro'].indexOf(subscription?.tier || 'free');
            const newTierIndex = ['free', 'starter', 'growth', 'pro'].indexOf(selectedTier);
            const isUpgrade = newTierIndex > currentTierIndex;

            if (isUpgrade && selectedTier !== 'free') {
                // Create checkout session
                const checkoutRes = await api.createCheckout(selectedTier, 'monthly');

                if (checkoutRes.payment?.checkout_url) {
                    // Redirect to Mayar payment page
                    window.location.href = checkoutRes.payment.checkout_url;
                    return;
                } else {
                    setError('Gagal membuat link pembayaran');
                }
            } else {
                // Downgrade - just update tier
                await api.changeTier(selectedTier);
                await loadData();
                setShowUpgradeModal(false);
            }
        } catch (err: unknown) {
            console.error('Error changing tier:', err);
            const apiError = err as { message?: string };
            setError(apiError.message || 'Gagal mengubah tier');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
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
                    <Link href="/dashboard/subscription" className="flex items-center px-4 py-3 text-main bg-main/10 rounded-lg font-medium">
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Langganan
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                <header className="h-16 bg-fifth border-b border-gray-200 flex items-center px-6">
                    <h2 className="text-lg font-semibold text-gray-800 font-[family-name:var(--font-ubuntu)]">
                        Langganan
                    </h2>
                </header>

                <div className="p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Current Subscription */}
                    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Langganan</h3>

                        {subscription ? (
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Tier Saat Ini</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-main">{subscription.tier_name}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${subscription.status === 'trial' ? 'bg-blue-100 text-blue-700' :
                                            subscription.is_active ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {subscription.status === 'trial' ? 'Trial' :
                                                subscription.is_active ? 'Aktif' : 'Expired'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Berakhir Pada</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {formatDate(subscription.expires_at)}
                                    </p>
                                    {subscription.days_remaining !== null && subscription.days_remaining <= 7 && (
                                        <p className="text-sm text-orange-500">
                                            {subscription.days_remaining} hari lagi
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Limit Produk</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {subscription.product_limit} produk
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Belum ada langganan aktif</p>
                        )}
                    </div>

                    {/* Usage Stats */}
                    {usage && (
                        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Penggunaan</h3>
                            <UsageBar
                                used={usage.used}
                                limit={usage.limit}
                                label="Produk Aktif"
                            />
                            {usage.remaining === 0 && (
                                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                                    <p className="text-orange-700 text-sm">
                                        Limit produk tercapai! <button onClick={() => handleSelectTier('growth')} className="underline font-medium">Upgrade sekarang</button> untuk menambah lebih banyak produk.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Available Tiers */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6">Pilih Paket</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                            {tiers.map((tier) => (
                                <TierCard
                                    key={tier.key}
                                    tier={tier}
                                    isCurrentTier={subscription?.tier === tier.key}
                                    onSelect={handleSelectTier}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Upgrade Modal */}
            {showUpgradeModal && selectedTier && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowUpgradeModal(false)}>
                    <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Konfirmasi Perubahan Tier</h3>

                        {(() => {
                            const newTier = tiers.find((t) => t.key === selectedTier);
                            const isUpgrade = subscription && ['starter', 'growth', 'pro'].indexOf(selectedTier) > ['free', 'starter', 'growth', 'pro'].indexOf(subscription.tier);

                            return (
                                <div>
                                    <p className="text-gray-600 mb-4">
                                        {isUpgrade ? (
                                            <>Anda akan melakukan <span className="font-semibold text-green-600">upgrade</span> ke tier <span className="font-semibold">{newTier?.name}</span>.</>
                                        ) : (
                                            <>Anda akan melakukan <span className="font-semibold text-orange-600">downgrade</span> ke tier <span className="font-semibold">{newTier?.name}</span>.</>
                                        )}
                                    </p>

                                    {isUpgrade && newTier && newTier.price > 0 && (
                                        <div className="bg-main/10 rounded-lg p-4 mb-4">
                                            <p className="text-main font-semibold">
                                                Harga: {newTier.price_formatted}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Anda akan diarahkan ke halaman pembayaran Mayar.
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowUpgradeModal(false)}
                                            disabled={isProcessing}
                                            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleConfirmChange}
                                            disabled={isProcessing}
                                            className="flex-1 py-3 bg-main text-white rounded-lg font-medium hover:bg-main-hover transition"
                                        >
                                            {isProcessing ? 'Memproses...' : 'Konfirmasi'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}
