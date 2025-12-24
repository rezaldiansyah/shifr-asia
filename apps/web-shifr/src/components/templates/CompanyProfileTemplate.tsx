'use client';

import { Store, Product } from '@/lib/api';

interface Props {
    store: Store & { products: Product[] };
}

export default function CompanyProfileTemplate({ store }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Get customization settings
    const themeColor = store.settings?.theme_color || '#374da0';
    const bannerUrl = store.settings?.banner_url;
    const socialLinks = store.settings?.social_links || {};
    const hasSocialLinks = Object.values(socialLinks).some(v => v);

    const handleWhatsAppContact = () => {
        const phone = store.settings?.whatsapp_number?.replace(/\D/g, '') || '';
        const message = `Halo ${store.name}, saya ingin bertanya tentang produk/layanan Anda.`;
        const url = `https://wa.me/${phone.startsWith('0') ? '62' + phone.slice(1) : phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleWhatsAppOrder = (product: Product) => {
        const phone = store.settings?.whatsapp_number?.replace(/\D/g, '') || '';
        const message = `Halo, saya tertarik dengan:\n\n*${product.name}*\nHarga: ${formatPrice(product.price)}\n\nApakah masih tersedia?`;
        const url = `https://wa.me/${phone.startsWith('0') ? '62' + phone.slice(1) : phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-white scroll-smooth">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <h1 className="font-bold text-xl" style={{ color: themeColor }}>{store.name}</h1>
                    <div className="hidden md:flex items-center gap-6 text-sm">
                        <a href="#about" className="text-gray-600 hover:text-main transition">Tentang</a>
                        <a href="#products" className="text-gray-600 hover:text-main transition">Produk</a>
                        <a href="#contact" className="text-gray-600 hover:text-main transition">Kontak</a>
                        {/* Social Links in Nav */}
                        {hasSocialLinks && (
                            <div className="flex gap-2 ml-2">
                                {socialLinks.instagram && (
                                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-lg hover:opacity-70">📷</a>
                                )}
                                {socialLinks.tiktok && (
                                    <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-lg hover:opacity-70">🎵</a>
                                )}
                            </div>
                        )}
                    </div>
                    {store.settings?.whatsapp_number && (
                        <button
                            onClick={handleWhatsAppContact}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Hubungi Kami
                        </button>
                    )}
                </div>
            </nav>

            {/* Hero Section with Banner */}
            <section
                className="min-h-screen flex items-center justify-center pt-16 relative"
                style={{
                    background: bannerUrl
                        ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bannerUrl}) center/cover`
                        : `linear-gradient(135deg, ${themeColor}, ${themeColor}88)`
                }}
            >
                <div className="text-center text-white px-6">
                    <div
                        className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl font-bold backdrop-blur"
                        style={{ backgroundColor: `${themeColor}40` }}
                    >
                        {store.name.charAt(0)}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{store.name}</h1>
                    {store.description && (
                        <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto mb-8">
                            {store.description}
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#products"
                            className="bg-white hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition"
                            style={{ color: themeColor }}
                        >
                            Lihat Produk
                        </a>
                        {store.settings?.whatsapp_number && (
                            <button
                                onClick={handleWhatsAppContact}
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                WhatsApp Kami
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Tentang Kami</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {store.description || `${store.name} adalah bisnis yang berkomitmen memberikan produk dan layanan terbaik untuk Anda.`}
                    </p>
                    <div className="grid grid-cols-3 gap-6 mt-12">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-main">{store.products?.length || 0}</div>
                            <div className="text-gray-500 mt-1">Produk</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-second">100%</div>
                            <div className="text-gray-500 mt-1">Terpercaya</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-third">24/7</div>
                            <div className="text-gray-500 mt-1">Layanan</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
                        Produk & Layanan
                    </h2>

                    {store.products && store.products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {store.products.map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition">
                                    <div className="aspect-video bg-gray-100 relative">
                                        {product.images && product.images[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                                        <p className="text-2xl font-bold text-main mt-2">{formatPrice(product.price)}</p>
                                        {product.description && (
                                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
                                        )}
                                        <button
                                            onClick={() => handleWhatsAppOrder(product)}
                                            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            Pesan Sekarang
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            Belum ada produk
                        </div>
                    )}
                </div>
            </section>

            {/* Contact CTA Section */}
            <section id="contact" className="py-20 px-6 bg-gradient-to-r from-main to-second">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Tertarik?</h2>
                    <p className="text-xl opacity-90 mb-8">
                        Hubungi kami sekarang untuk informasi lebih lanjut
                    </p>
                    {store.settings?.whatsapp_number && (
                        <button
                            onClick={handleWhatsAppContact}
                            className="bg-white text-main hover:bg-gray-100 px-10 py-5 rounded-xl font-bold text-lg transition inline-flex items-center gap-3"
                        >
                            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Chat via WhatsApp
                        </button>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 bg-gray-900 text-gray-400 text-center">
                <p>© 2024 {store.name}. Dibuat dengan ❤️ di Shifr Asia</p>
            </footer>

            {/* WhatsApp Float Button */}
            {store.settings?.whatsapp_number && (
                <button
                    onClick={handleWhatsAppContact}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition z-50 md:hidden"
                >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </button>
            )}
        </div>
    );
}
