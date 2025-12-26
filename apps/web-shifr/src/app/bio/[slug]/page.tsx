'use client';

import { useState, useEffect, use } from 'react';
import { api } from '@/lib/api';

interface LinkItem {
    id: number;
    title: string;
    url: string;
    icon?: string;
    description?: string;
}

interface StoreInfo {
    id: number;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    theme_color?: string;
}

export default function BioPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const [store, setStore] = useState<StoreInfo | null>(null);
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBioData();
        trackView();
    }, [resolvedParams.slug]);

    const loadBioData = async () => {
        try {
            setLoading(true);
            const response = await api.getPublicLinks(resolvedParams.slug);
            setStore(response.store);
            setLinks(response.links);
        } catch (err) {
            console.error('Failed to load bio:', err);
            setError('Halaman tidak ditemukan');
        } finally {
            setLoading(false);
        }
    };

    const trackView = async () => {
        try {
            // Get store ID first, then track
            const response = await api.getPublicLinks(resolvedParams.slug);
            if (response.store?.id) {
                await api.trackEvent({
                    store_id: response.store.id,
                    event_type: 'bio_view',
                    page: `/bio/${resolvedParams.slug}`,
                });
            }
        } catch (err) {
            // Silently fail tracking
        }
    };

    const handleLinkClick = async (link: LinkItem) => {
        try {
            await api.trackLinkClick(link.id);
        } catch (err) {
            // Silently fail tracking
        }
        // Open link
        window.open(link.url, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#374da0] to-[#2cbbbc] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#374da0] to-[#2cbbbc] flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="text-6xl mb-4">🔗</div>
                    <h1 className="text-2xl font-bold mb-2">Halaman Tidak Ditemukan</h1>
                    <p className="text-white/80">Link yang Anda cari tidak tersedia</p>
                </div>
            </div>
        );
    }

    const themeColor = store.theme_color || '#374da0';

    return (
        <div
            className="min-h-screen py-12 px-4"
            style={{
                background: `linear-gradient(135deg, ${themeColor} 0%, #2cbbbc 100%)`
            }}
        >
            <div className="max-w-md mx-auto">
                {/* Profile Header */}
                <div className="text-center mb-8">
                    {store.logo ? (
                        <img
                            src={store.logo}
                            alt={store.name}
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-white/20 flex items-center justify-center text-4xl">
                            🏪
                        </div>
                    )}
                    <h1 className="text-2xl font-bold text-white mb-1">
                        {store.name}
                    </h1>
                    {store.description && (
                        <p className="text-white/80 text-sm">
                            {store.description}
                        </p>
                    )}
                </div>

                {/* Links */}
                <div className="space-y-3">
                    {links.length === 0 ? (
                        <div className="text-center text-white/80 py-8">
                            <p>Belum ada link tersedia</p>
                        </div>
                    ) : (
                        links.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => handleLinkClick(link)}
                                className="w-full bg-white rounded-xl p-4 flex items-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg"
                            >
                                {link.icon && (
                                    <span className="text-2xl">{link.icon}</span>
                                )}
                                <div className="flex-1 text-left">
                                    <div className="font-semibold text-gray-900">
                                        {link.title}
                                    </div>
                                    {link.description && (
                                        <div className="text-sm text-gray-500">
                                            {link.description}
                                        </div>
                                    )}
                                </div>
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-12">
                    <a
                        href="https://shifr.asia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
                    >
                        <span>Powered by</span>
                        <span className="font-bold">Shifr.asia</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
