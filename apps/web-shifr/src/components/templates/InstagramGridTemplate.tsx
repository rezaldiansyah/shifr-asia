'use client';

import { useState } from 'react';
import { Store, Product, api } from '@/lib/api';

interface Props {
    store: Store & { products: Product[] };
}

export default function InstagramGridTemplate({ store }: Props) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: string } | null>(null);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [checkoutForm, setCheckoutForm] = useState({
        name: '',
        phone: '',
        address: '',
        notes: '',
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleOrderClick = (product: Product) => {
        setSelectedProduct(product);
        setShowCheckout(true);
        setOrderSuccess(null);
        setOrderError(null);
    };

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        setIsOrdering(true);
        setOrderError(null);

        try {
            const res = await api.createOrder({
                store_id: store.id,
                product_id: selectedProduct.id,
                customer_name: checkoutForm.name,
                customer_phone: checkoutForm.phone,
                customer_address: checkoutForm.address || undefined,
                notes: checkoutForm.notes || undefined,
            });

            setOrderSuccess({ orderNumber: res.order.order_number });
            setCheckoutForm({ name: '', phone: '', address: '', notes: '' });
        } catch (err: unknown) {
            const apiError = err as { message?: string };
            setOrderError(apiError.message || 'Gagal membuat pesanan');
        } finally {
            setIsOrdering(false);
        }
    };

    const closeCheckout = () => {
        setShowCheckout(false);
        setSelectedProduct(null);
        setOrderSuccess(null);
        setOrderError(null);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
                <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
                    <h1 className="font-bold text-lg">{store.name}</h1>
                </div>
            </header>

            {/* Profile Section */}
            <div className="max-w-lg mx-auto px-4 py-6 border-b border-gray-200">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-main to-second flex items-center justify-center text-white text-2xl font-bold">
                        {store.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <h2 className="font-bold text-xl">{store.name}</h2>
                        {store.description && (
                            <p className="text-gray-600 text-sm mt-1">{store.description}</p>
                        )}
                        <div className="flex gap-4 mt-2 text-sm">
                            <span><strong>{store.products?.length || 0}</strong> produk</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-lg mx-auto">
                <div className="grid grid-cols-3 gap-0.5">
                    {store.products?.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleOrderClick(product)}
                            className="aspect-square bg-gray-100 relative cursor-pointer group"
                        >
                            {product.images && product.images[0] ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                                <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {(!store.products || store.products.length === 0) && (
                    <div className="py-12 text-center text-gray-500">
                        Belum ada produk
                    </div>
                )}
            </div>

            {/* Checkout Modal */}
            {showCheckout && selectedProduct && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeCheckout}>
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

                        {/* Success State */}
                        {orderSuccess ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h3>
                                <p className="text-gray-600 mb-4">
                                    No. Pesanan: <strong>{orderSuccess.orderNumber}</strong>
                                </p>
                                <p className="text-sm text-gray-500 mb-6">
                                    Kami akan mengirimkan konfirmasi via WhatsApp. Penjual akan segera menghubungi Anda.
                                </p>
                                <button onClick={closeCheckout} className="bg-main hover:bg-main-hover text-white font-semibold px-6 py-3 rounded-xl transition">
                                    Tutup
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Product Info */}
                                <div className="flex gap-4 p-4 border-b">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {selectedProduct.images?.[0] ? (
                                            <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800">{selectedProduct.name}</h3>
                                        <p className="text-xl font-bold text-main mt-1">{formatPrice(selectedProduct.price)}</p>
                                    </div>
                                    <button onClick={closeCheckout} className="text-gray-400 hover:text-gray-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Checkout Form */}
                                <form onSubmit={handleSubmitOrder} className="p-4 space-y-4">
                                    <h4 className="font-semibold text-gray-800">Data Pembeli</h4>

                                    {orderError && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                            {orderError}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Nama Lengkap *</label>
                                        <input
                                            type="text"
                                            required
                                            value={checkoutForm.name}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                            placeholder="Masukkan nama"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">No. WhatsApp *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={checkoutForm.phone}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                            placeholder="08123456789"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Alamat</label>
                                        <textarea
                                            value={checkoutForm.address}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                            placeholder="Alamat pengiriman (opsional)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Catatan</label>
                                        <textarea
                                            value={checkoutForm.notes}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                            placeholder="Catatan untuk penjual (opsional)"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isOrdering}
                                        className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition"
                                    >
                                        {isOrdering ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                </svg>
                                                Pesan Sekarang
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
