'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api, Store, Product } from '@/lib/api';
import InstagramGridTemplate from '@/components/templates/InstagramGridTemplate';
import CompanyProfileTemplate from '@/components/templates/CompanyProfileTemplate';

export default function PublicStorePage() {
    const params = useParams();
    const slug = params.slug as string;
    const [store, setStore] = useState<(Store & { products: Product[] }) | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            loadStore();
        }
    }, [slug]);

    const loadStore = async () => {
        try {
            const res = await api.getPublicStore(slug);
            setStore(res.store);
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setError(apiError.message || 'Toko tidak ditemukan');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat toko...</p>
                </div>
            </div>
        );
    }

    if (error || !store) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-gray-600 mb-6">{error || 'Toko tidak ditemukan'}</p>
                    <a href="/" className="text-main hover:underline">Kembali ke Beranda</a>
                </div>
            </div>
        );
    }

    // Render template based on store's template slug
    const templateSlug = store.template?.slug || 'instagram-grid';

    switch (templateSlug) {
        case 'instagram-grid':
            return <InstagramGridTemplate store={store} />;
        case 'company-profile':
            return <CompanyProfileTemplate store={store} />;
        default:
            return <InstagramGridTemplate store={store} />;
    }
}
