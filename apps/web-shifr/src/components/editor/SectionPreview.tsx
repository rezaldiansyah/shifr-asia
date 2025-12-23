'use client';

import { Section, Product } from '@/lib/api';

interface SectionPreviewProps {
    sections: Section[];
    products: Product[];
    storeName: string;
    storeDescription?: string;
    whatsappNumber?: string;
}

export default function SectionPreview({
    sections,
    products,
    storeName,
    storeDescription,
    whatsappNumber,
}: SectionPreviewProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleWhatsAppClick = () => {
        if (!whatsappNumber) return;
        const phone = whatsappNumber.replace(/\D/g, '');
        const message = `Halo ${storeName}, saya ingin bertanya tentang produk/layanan Anda.`;
        const url = `https://wa.me/${phone.startsWith('0') ? '62' + phone.slice(1) : phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const enabledSections = sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order);

    // Helper to safely get string from content
    const getString = (value: unknown): string => {
        if (typeof value === 'string') return value;
        return '';
    };

    const renderSection = (section: Section) => {
        const { content, styles } = section;
        const bgColor = styles?.backgroundColor || '#ffffff';
        const textColor = styles?.textColor || '#1f2937';

        switch (section.type) {
            case 'hero':
                return (
                    <section
                        key={section.id}
                        className="min-h-[60vh] flex items-center justify-center"
                        style={{ backgroundColor: bgColor, color: textColor }}
                    >
                        <div className="text-center px-6 py-16">
                            <h1 className="text-3xl md:text-5xl font-bold mb-4">
                                {getString(content.title) || storeName}
                            </h1>
                            {getString(content.subtitle) && (
                                <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
                                    {getString(content.subtitle)}
                                </p>
                            )}
                            {getString(content.buttonText) && (
                                <a
                                    href={getString(content.buttonLink) || '#'}
                                    className="inline-block bg-white text-main hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition"
                                    style={{ color: bgColor }}
                                >
                                    {getString(content.buttonText)}
                                </a>
                            )}
                        </div>
                    </section>
                );

            case 'about':
                return (
                    <section
                        key={section.id}
                        className="py-20 px-6"
                        style={{ backgroundColor: bgColor, color: textColor }}
                    >
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                {getString(content.title) || 'Tentang Kami'}
                            </h2>
                            <p className="text-lg leading-relaxed opacity-80">
                                {getString(content.description) || storeDescription}
                            </p>
                        </div>
                    </section>
                );

            case 'products':
                const limit = (content.limit as number) || 6;
                const columns = (content.columns as number) || 3;
                const displayProducts = products.slice(0, limit);

                return (
                    <section
                        key={section.id}
                        className="py-20 px-6"
                        style={{ backgroundColor: bgColor, color: textColor }}
                    >
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    {getString(content.title) || 'Produk Kami'}
                                </h2>
                                {getString(content.subtitle) && (
                                    <p className="text-lg opacity-80">{getString(content.subtitle)}</p>
                                )}
                            </div>
                            <div
                                className="grid gap-6"
                                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                            >
                                {displayProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
                                    >
                                        <div className="aspect-square bg-gray-100 relative">
                                            {product.images?.[0] ? (
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
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-800">{product.name}</h3>
                                            <p className="text-xl font-bold text-main mt-1">{formatPrice(product.price)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {products.length === 0 && (
                                <div className="text-center py-12 text-gray-400">
                                    Belum ada produk
                                </div>
                            )}
                        </div>
                    </section>
                );

            case 'features':
                const items = (content.items as Array<{ icon: string; title: string; description: string }>) || [];
                return (
                    <section
                        key={section.id}
                        className="py-20 px-6"
                        style={{ backgroundColor: bgColor, color: textColor }}
                    >
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                                {getString(content.title) || 'Mengapa Pilih Kami'}
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {items.map((item, i) => (
                                    <div key={i} className="text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-main/10 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                        <p className="opacity-80">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            case 'cta':
                return (
                    <section
                        key={section.id}
                        className="py-20 px-6"
                        style={{ backgroundColor: bgColor, color: textColor }}
                    >
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                {getString(content.title) || 'Tertarik?'}
                            </h2>
                            {getString(content.subtitle) && (
                                <p className="text-xl opacity-90 mb-8">{getString(content.subtitle)}</p>
                            )}
                            {getString(content.buttonText) && (
                                <button
                                    onClick={handleWhatsAppClick}
                                    className="bg-white hover:bg-gray-100 px-10 py-5 rounded-xl font-bold text-lg transition inline-flex items-center gap-3"
                                    style={{ color: bgColor }}
                                >
                                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    {getString(content.buttonText)}
                                </button>
                            )}
                        </div>
                    </section>
                );

            case 'contact':
                return (
                    <section
                        key={section.id}
                        className="py-20 px-6"
                        style={{ backgroundColor: bgColor, color: textColor }}
                    >
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                {getString(content.title) || 'Hubungi Kami'}
                            </h2>
                            {getString(content.subtitle) && (
                                <p className="text-xl opacity-90 mb-8">{getString(content.subtitle)}</p>
                            )}
                            {Boolean(content.showWhatsApp) && whatsappNumber && (
                                <button
                                    onClick={handleWhatsAppClick}
                                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold transition inline-flex items-center gap-3"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Chat via WhatsApp
                                </button>
                            )}
                        </div>
                    </section>
                );

            case 'gallery':
                const images = (content.images as string[]) || [];
                const galleryCols = (content.columns as number) || 3;
                return (
                    <section
                        key={section.id}
                        className="py-20 px-6"
                        style={{ backgroundColor: bgColor, color: textColor }}
                    >
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                                {getString(content.title) || 'Galeri'}
                            </h2>
                            {images.length > 0 ? (
                                <div
                                    className="grid gap-4"
                                    style={{ gridTemplateColumns: `repeat(${galleryCols}, minmax(0, 1fr))` }}
                                >
                                    {images.map((img, i) => (
                                        <div key={i} className="aspect-square rounded-lg overflow-hidden">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-400">
                                    Belum ada gambar
                                </div>
                            )}
                        </div>
                    </section>
                );

            case 'testimonial':
                const testimonials = (content.items as Array<{ name: string; text: string; rating: number }>) || [];
                return (
                    <section
                        key={section.id}
                        className="py-20 px-6"
                        style={{ backgroundColor: bgColor, color: textColor }}
                    >
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                                {getString(content.title) || 'Apa Kata Mereka'}
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {testimonials.map((item, i) => (
                                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(5)].map((_, j) => (
                                                <svg
                                                    key={j}
                                                    className={`w-5 h-5 ${j < item.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="text-gray-600 mb-4">&ldquo;{item.text}&rdquo;</p>
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-full bg-white">
            {enabledSections.map(renderSection)}
            {enabledSections.length === 0 && (
                <div className="flex items-center justify-center min-h-[400px] text-gray-400">
                    <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p>Tidak ada section aktif</p>
                        <p className="text-sm">Tambahkan section dari panel di sebelah kiri</p>
                    </div>
                </div>
            )}
        </div>
    );
}
