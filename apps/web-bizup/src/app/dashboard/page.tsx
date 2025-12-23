'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, BusinessCard } from '@/lib/api';

export default function DashboardPage() {
    const [cards, setCards] = useState<BusinessCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCards();
    }, []);

    const loadCards = async () => {
        try {
            const response = await api.getBusinessCards();
            setCards(response.data);
        } catch (error) {
            console.error('Failed to load cards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus kartu ini?')) return;

        try {
            await api.deleteBusinessCard(id);
            setCards(cards.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete card:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#374da0] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-500">Memuat kartu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kartu Bisnis Saya</h1>
                    <p className="text-gray-500 mt-1">Kelola kartu bisnis digital Anda</p>
                </div>
                <Link
                    href="/dashboard/cards/create"
                    className="btn btn-primary"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Buat Kartu Baru
                </Link>
            </div>

            {/* Cards Grid */}
            {cards.length === 0 ? (
                <div className="card text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada kartu</h3>
                    <p className="text-gray-500 mb-6">Buat kartu bisnis digital pertama Anda sekarang!</p>
                    <Link href="/dashboard/cards/create" className="btn btn-primary">
                        Buat Kartu Pertama
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                        <div key={card.id} className="card hover:shadow-lg transition-shadow">
                            {/* Card Preview */}
                            <div className="flex items-center gap-4 mb-4">
                                {card.data.photo ? (
                                    <img
                                        src={card.data.photo}
                                        alt={card.data.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#374da0] to-[#2cbbbc] flex items-center justify-center text-white text-xl font-bold">
                                        {card.data.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{card.data.name}</h3>
                                    {card.data.title && (
                                        <p className="text-sm text-gray-500 truncate">{card.data.title}</p>
                                    )}
                                    {card.data.company && (
                                        <p className="text-sm text-gray-400 truncate">{card.data.company}</p>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {card.views} views
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${card.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {card.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-gray-100">
                                <Link
                                    href={`/dashboard/cards/${card.id}`}
                                    className="flex-1 btn btn-outline text-sm py-2"
                                >
                                    Edit
                                </Link>
                                <a
                                    href={`/${card.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 btn btn-secondary text-sm py-2"
                                >
                                    Lihat
                                </a>
                                <button
                                    onClick={() => handleDelete(card.id)}
                                    className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
