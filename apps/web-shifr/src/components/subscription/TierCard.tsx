'use client';

import { Tier } from '@/lib/api';

interface TierCardProps {
    tier: Tier;
    isCurrentTier?: boolean;
    onSelect?: (tierKey: string) => void;
    showButton?: boolean;
    buttonLabel?: string;
}

export default function TierCard({
    tier,
    isCurrentTier = false,
    onSelect,
    showButton = true,
    buttonLabel,
}: TierCardProps) {
    const isPopular = tier.popular;

    return (
        <div
            className={`relative rounded-2xl p-6 ${isPopular
                    ? 'bg-gradient-to-br from-main to-second text-white shadow-xl scale-105'
                    : 'bg-white shadow-lg border border-gray-100'
                } ${isCurrentTier ? 'ring-2 ring-main ring-offset-2' : ''}`}
        >
            {/* Popular Badge */}
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow">
                        POPULER
                    </span>
                </div>
            )}

            {/* Current Badge */}
            {isCurrentTier && (
                <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        AKTIF
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-6">
                <h3 className={`text-xl font-bold mb-2 ${isPopular ? 'text-white' : 'text-gray-800'}`}>
                    {tier.name}
                </h3>
                <div className={`text-3xl font-bold ${isPopular ? 'text-white' : 'text-main'}`}>
                    {tier.price === 0 ? 'Gratis' : `Rp ${(tier.price / 1000).toFixed(0)}k`}
                </div>
                <div className={`text-sm ${isPopular ? 'text-white/80' : 'text-gray-500'}`}>
                    /{tier.period}
                </div>
            </div>

            {/* Product Limit */}
            <div className={`text-center py-3 mb-4 rounded-lg ${isPopular ? 'bg-white/20' : 'bg-gray-50'}`}>
                <span className={`font-semibold ${isPopular ? 'text-white' : 'text-gray-800'}`}>
                    {tier.product_limit} Produk
                </span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
                {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <svg
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isPopular ? 'text-white' : 'text-green-500'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`text-sm ${isPopular ? 'text-white/90' : 'text-gray-600'}`}>
                            {feature}
                        </span>
                    </li>
                ))}
                {tier.not_included.map((feature, i) => (
                    <li key={`not-${i}`} className="flex items-start gap-2">
                        <svg
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isPopular ? 'text-white/40' : 'text-gray-300'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className={`text-sm line-through ${isPopular ? 'text-white/40' : 'text-gray-400'}`}>
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Button */}
            {showButton && (
                <button
                    onClick={() => onSelect?.(tier.key)}
                    disabled={isCurrentTier}
                    className={`w-full py-3 rounded-xl font-semibold transition ${isCurrentTier
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : isPopular
                                ? 'bg-white text-main hover:bg-gray-100'
                                : 'bg-main text-white hover:bg-main-hover'
                        }`}
                >
                    {buttonLabel || (isCurrentTier ? 'Tier Saat Ini' : tier.price === 0 ? 'Mulai Gratis' : 'Pilih Tier')}
                </button>
            )}
        </div>
    );
}
