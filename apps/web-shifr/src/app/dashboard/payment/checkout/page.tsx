'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface PaymentMethod {
    paymentMethod: string;
    paymentName: string;
    paymentImage: string;
    totalFee: string;
}

// List of enabled payment methods (user requested: QRIS, BSI VA, BCA VA, Mandiri VA, CIMB VA)
const ENABLED_METHODS = ['SP', 'NQ', 'BV', 'BC', 'M2', 'B1'];

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoading: authLoading, isAuthenticated } = useAuth();

    const tier = searchParams.get('tier') || 'growth';
    const period = searchParams.get('period') || 'monthly';

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Mayar uses hosted checkout, so no specific method selection is needed on our side
    const [isHostedCheckout, setIsHostedCheckout] = useState(false);

    // Tier pricing
    const tierPrices: Record<string, { name: string; price: number }> = {
        starter: { name: 'Starter', price: 35000 },
        growth: { name: 'Growth', price: 89000 },
        pro: { name: 'Pro', price: 199000 },
    };

    const selectedTier = tierPrices[tier] || tierPrices.growth;
    // If hosted checkout (Mayar), we don't know the fee yet (or it's included), assuming 0 for display
    const selectedFee = paymentMethods.find(m => m.paymentMethod === selectedMethod)?.totalFee || '0';
    const totalAmount = selectedTier.price + parseInt(selectedFee);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadPaymentMethods();
        }
    }, [isAuthenticated]);

    const loadPaymentMethods = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/payment/methods`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: selectedTier.price }),
            });
            const data = await response.json();

            // If no payment methods are returned, assume hosted checkout (Mayar)
            if (!data.payment_methods || data.payment_methods.length === 0) {
                setIsHostedCheckout(true);
                setPaymentMethods([]);
                return;
            }

            // Filter only enabled payment methods
            const filtered = (data.payment_methods || []).filter((m: PaymentMethod) =>
                ENABLED_METHODS.includes(m.paymentMethod)
            );
            setPaymentMethods(filtered);

            // Auto-select first QRIS method
            const qris = filtered.find((m: PaymentMethod) => m.paymentMethod === 'SP' || m.paymentMethod === 'NQ');
            if (qris) setSelectedMethod(qris.paymentMethod);
        } catch (err) {
            console.error('Error loading payment methods:', err);
            // Fallback to hosted checkout if method loading fails
            setIsHostedCheckout(true);
            // setError('Gagal memuat metode pembayaran'); 
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckout = async () => {
        if (!isHostedCheckout && !selectedMethod) {
            setError('Pilih metode pembayaran terlebih dahulu');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // api.createCheckout wrapper creates the payload. 
            // We need to pass additional params manually if not using the wrapper correctly or since the wrapper might not support payment_method arg?
            // current api.createCheckout only takes (tier, period).
            // But we used fetch directly below. Let's stick to fetch for Duitku, but cleanup for Mayar.

            const payload: any = {
                tier,
                period,
            };

            if (selectedMethod) {
                payload.payment_method = selectedMethod;
            }

            const checkoutResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/payment/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api.getToken()}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await checkoutResponse.json();

            if (data.payment?.checkout_url) {
                // Redirect to payment page (Mayar or Duitku)
                window.location.href = data.payment.checkout_url;
            } else {
                setError(data.message || 'Gagal membuat pembayaran');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-fourth">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-fourth py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/dashboard/subscription" className="text-main hover:underline flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </Link>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 font-[family-name:var(--font-ubuntu)]">
                        Ringkasan Pesanan
                    </h2>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Paket {selectedTier.name}</span>
                        <span className="font-semibold">{formatCurrency(selectedTier.price)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Periode</span>
                        <span className="font-semibold capitalize">{period === 'monthly' ? 'Bulanan' : 'Tahunan'}</span>
                    </div>
                    {!isHostedCheckout && (
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">Biaya Layanan</span>
                            <span className="font-semibold">{formatCurrency(parseInt(selectedFee))}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center py-4 mt-2 bg-main/5 rounded-lg px-3">
                        <span className="font-bold text-gray-800">Total Pembayaran</span>
                        <span className="text-xl font-bold text-main">{formatCurrency(totalAmount)}</span>
                    </div>
                </div>

                {/* Payment Methods - Only show if not hosted checkout */}
                {!isHostedCheckout && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 font-[family-name:var(--font-ubuntu)]">
                            Pilih Metode Pembayaran
                        </h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                {error}
                            </div>
                        )}

                        {/* QRIS Section */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">QRIS</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {paymentMethods.filter(m => ['SP', 'NQ', 'LQ', 'GQ'].includes(m.paymentMethod)).map((method) => (
                                    <button
                                        key={method.paymentMethod}
                                        onClick={() => setSelectedMethod(method.paymentMethod)}
                                        className={`p-4 border-2 rounded-xl transition flex flex-col items-center gap-2 ${selectedMethod === method.paymentMethod
                                            ? 'border-main bg-main/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <img src={method.paymentImage} alt={method.paymentName} className="h-8 object-contain" />
                                        <span className="text-sm font-medium text-gray-700">{method.paymentName}</span>
                                        <span className="text-xs text-green-600">
                                            {parseInt(method.totalFee) === 0 ? 'Gratis' : `+${formatCurrency(parseInt(method.totalFee))}`}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Virtual Account Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Virtual Account</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {paymentMethods.filter(m => ['BV', 'BC', 'M2', 'B1'].includes(m.paymentMethod)).map((method) => (
                                    <button
                                        key={method.paymentMethod}
                                        onClick={() => setSelectedMethod(method.paymentMethod)}
                                        className={`p-4 border-2 rounded-xl transition flex flex-col items-center gap-2 ${selectedMethod === method.paymentMethod
                                            ? 'border-main bg-main/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <img src={method.paymentImage} alt={method.paymentName} className="h-8 object-contain" />
                                        <span className="text-sm font-medium text-gray-700">{method.paymentName}</span>
                                        <span className="text-xs text-orange-600">
                                            +{formatCurrency(parseInt(method.totalFee))}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {isHostedCheckout && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-xl mb-6 flex items-start gap-3">
                        <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="font-semibold">Info Pembayaran</p>
                            <p className="text-sm opacity-90">Anda akan diarahkan ke halaman pembayaran yang aman untuk menyelesaikan transaksi.</p>
                        </div>
                    </div>
                )}

                {/* Checkout Button */}
                <button
                    onClick={handleCheckout}
                    disabled={isProcessing || (!isHostedCheckout && !selectedMethod)}
                    className="w-full py-4 bg-main text-white rounded-xl font-semibold text-lg hover:bg-main-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Memproses...
                        </span>
                    ) : (
                        `Bayar ${formatCurrency(totalAmount)}`
                    )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Dengan melanjutkan, Anda menyetujui <Link href="/terms" className="text-main hover:underline">Syarat & Ketentuan</Link>
                </p>
            </div>
        </div>
    );
}
