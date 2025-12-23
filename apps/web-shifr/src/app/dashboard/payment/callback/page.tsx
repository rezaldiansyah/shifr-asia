'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

function PaymentCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'failed'>('loading');
    const [payment, setPayment] = useState<{
        tier_name: string;
        formatted_amount: string;
        paid_at: string | null;
    } | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        const checkPayment = async () => {
            const paymentId = searchParams.get('payment_id') || searchParams.get('id');
            const queryStatus = searchParams.get('status');

            if (queryStatus === 'cancel' || queryStatus === 'cancelled') {
                setStatus('failed');
                return;
            }

            if (!paymentId) {
                setStatus('failed');
                return;
            }

            try {
                const res = await api.getPaymentCallback(paymentId);
                setPayment(res.payment);

                if (res.payment.is_paid) {
                    setStatus('success');
                } else if (res.payment.status === 'pending') {
                    setStatus('pending');
                } else {
                    setStatus('failed');
                }
            } catch (err) {
                console.error('Payment callback error:', err);
                setStatus('failed');
            }
        };

        if (isAuthenticated) {
            checkPayment();
        }
    }, [isAuthenticated, searchParams]);

    if (authLoading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memproses pembayaran...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-fourth p-4">
            <div className="bg-fifth rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2 font-[family-name:var(--font-ubuntu)]">
                            Pembayaran Berhasil! 🎉
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Terima kasih! Langganan Anda telah diaktifkan.
                        </p>
                        {payment && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-500">Paket</p>
                                <p className="text-lg font-bold text-main">{payment.tier_name}</p>
                                <p className="text-sm text-gray-500 mt-2">Total Pembayaran</p>
                                <p className="text-lg font-semibold">{payment.formatted_amount}</p>
                            </div>
                        )}
                        <Link
                            href="/dashboard"
                            className="inline-block bg-main hover:bg-main-hover text-white font-semibold px-8 py-3 rounded-lg transition w-full"
                        >
                            Ke Dashboard
                        </Link>
                    </>
                )}

                {status === 'pending' && (
                    <>
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2 font-[family-name:var(--font-ubuntu)]">
                            Menunggu Pembayaran
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Pembayaran Anda sedang diproses. Halaman akan diperbarui otomatis setelah pembayaran dikonfirmasi.
                        </p>
                        <Link
                            href="/dashboard/subscription"
                            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-8 py-3 rounded-lg transition w-full"
                        >
                            Kembali ke Langganan
                        </Link>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2 font-[family-name:var(--font-ubuntu)]">
                            Pembayaran Dibatalkan
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Pembayaran Anda tidak berhasil atau dibatalkan. Silakan coba lagi.
                        </p>
                        <div className="space-y-3">
                            <Link
                                href="/dashboard/subscription"
                                className="inline-block bg-main hover:bg-main-hover text-white font-semibold px-8 py-3 rounded-lg transition w-full"
                            >
                                Coba Lagi
                            </Link>
                            <Link
                                href="/dashboard"
                                className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-8 py-3 rounded-lg transition w-full"
                            >
                                Ke Dashboard
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <PaymentCallbackContent />
        </Suspense>
    );
}
