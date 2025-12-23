'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, Tier } from '@/lib/api';
import TierCard from '@/components/subscription/TierCard';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { useTranslation } from '@/contexts/LanguageContext';

export default function PricingPage() {
    const { t } = useTranslation();
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        loadTiers();
    }, []);

    const loadTiers = async () => {
        try {
            const res = await api.getTiers();
            setTiers(res.tiers);
        } catch (err) {
            console.error('Error loading tiers:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectTier = (tierKey: string) => {
        window.location.href = `/register?tier=${tierKey}`;
    };

    return (
        <div className="min-h-screen bg-fourth">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-main font-[family-name:var(--font-ubuntu)]">
                        Shifr Asia
                    </Link>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher variant="toggle" />
                        <Link href="/login" className="text-gray-600 hover:text-gray-800">
                            {t('auth.login')}
                        </Link>
                        <Link
                            href="/register"
                            className="bg-main hover:bg-main-hover text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                            {t('cta.registerFree')}
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="py-16 text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-[family-name:var(--font-ubuntu)]">
                        {t('pricing.title')}
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        {t('pricing.subtitle')}. {t('pricing.startFree')}, upgrade {t('common.or')} downgrade.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-4 bg-white rounded-lg p-1 shadow">
                        <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${billingPeriod === 'monthly'
                                ? 'bg-main text-white'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            {t('pricing.monthly')}
                        </button>
                        <button
                            onClick={() => setBillingPeriod('yearly')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${billingPeriod === 'yearly'
                                ? 'bg-main text-white'
                                : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            {t('pricing.yearly')}
                            <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                {t('pricing.save')} 20%
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    {isLoading ? (
                        <div className="grid md:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded mb-4 w-1/2 mx-auto" />
                                    <div className="h-10 bg-gray-200 rounded mb-4 w-2/3 mx-auto" />
                                    <div className="space-y-2">
                                        {[1, 2, 3, 4].map((j) => (
                                            <div key={j} className="h-4 bg-gray-200 rounded" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-4 gap-6 items-start">
                            {tiers.map((tier) => (
                                <TierCard
                                    key={tier.key}
                                    tier={tier}
                                    onSelect={handleSelectTier}
                                    buttonLabel={tier.price === 0 ? t('pricing.startFree') : t('pricing.selectPlan')}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-[family-name:var(--font-ubuntu)]">
                        {t('faq.title')}
                    </h2>

                    <div className="space-y-6">
                        <div className="border-b border-gray-100 pb-6">
                            <h3 className="font-semibold text-gray-800 mb-2">
                                {t('faq.hiddenFees.q')}
                            </h3>
                            <p className="text-gray-600">
                                {t('faq.hiddenFees.a')}
                            </p>
                        </div>

                        <div className="border-b border-gray-100 pb-6">
                            <h3 className="font-semibold text-gray-800 mb-2">
                                {t('faq.upgrade.q')}
                            </h3>
                            <p className="text-gray-600">
                                {t('faq.upgrade.a')}
                            </p>
                        </div>

                        <div className="border-b border-gray-100 pb-6">
                            <h3 className="font-semibold text-gray-800 mb-2">
                                {t('faq.security.q')}
                            </h3>
                            <p className="text-gray-600">
                                {t('faq.security.a')}
                            </p>
                        </div>

                        <div className="pb-6">
                            <h3 className="font-semibold text-gray-800 mb-2">
                                {t('faq.support.q')}
                            </h3>
                            <p className="text-gray-600">
                                {t('faq.support.a')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-r from-main to-second text-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-4 font-[family-name:var(--font-ubuntu)]">
                        {t('cta.title')}
                    </h2>
                    <p className="text-lg opacity-90 mb-8">
                        {t('cta.subtitle')}
                    </p>
                    <Link
                        href="/register"
                        className="inline-block bg-white text-main hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition"
                    >
                        {t('cta.registerNow')}
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-400">
                        © 2024 Shifr Asia. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
