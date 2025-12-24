// Translation dictionary for Shifr Asia
// Supports: Indonesian (id) and English (en)

export type Locale = 'id' | 'en';

export interface Translations {
    [key: string]: {
        id: string;
        en: string;
    };
}

export const translations: Translations = {
    // Common
    'common.loading': { id: 'Memuat...', en: 'Loading...' },
    'common.save': { id: 'Simpan', en: 'Save' },
    'common.cancel': { id: 'Batal', en: 'Cancel' },
    'common.delete': { id: 'Hapus', en: 'Delete' },
    'common.edit': { id: 'Edit', en: 'Edit' },
    'common.add': { id: 'Tambah', en: 'Add' },
    'common.close': { id: 'Tutup', en: 'Close' },
    'common.back': { id: 'Kembali', en: 'Back' },
    'common.next': { id: 'Selanjutnya', en: 'Next' },
    'common.submit': { id: 'Kirim', en: 'Submit' },
    'common.search': { id: 'Cari', en: 'Search' },
    'common.filter': { id: 'Filter', en: 'Filter' },
    'common.actions': { id: 'Aksi', en: 'Actions' },
    'common.status': { id: 'Status', en: 'Status' },
    'common.active': { id: 'Aktif', en: 'Active' },
    'common.inactive': { id: 'Tidak Aktif', en: 'Inactive' },
    'common.yes': { id: 'Ya', en: 'Yes' },
    'common.no': { id: 'Tidak', en: 'No' },
    'common.or': { id: 'atau', en: 'or' },
    'common.and': { id: 'dan', en: 'and' },

    // Auth
    'auth.login': { id: 'Masuk', en: 'Login' },
    'auth.register': { id: 'Daftar', en: 'Register' },
    'auth.logout': { id: 'Keluar', en: 'Logout' },
    'auth.email': { id: 'Email', en: 'Email' },
    'auth.password': { id: 'Kata Sandi', en: 'Password' },
    'auth.confirmPassword': { id: 'Konfirmasi Kata Sandi', en: 'Confirm Password' },
    'auth.name': { id: 'Nama', en: 'Name' },
    'auth.forgotPassword': { id: 'Lupa kata sandi?', en: 'Forgot password?' },
    'auth.noAccount': { id: 'Belum punya akun?', en: "Don't have an account?" },
    'auth.hasAccount': { id: 'Sudah punya akun?', en: 'Already have an account?' },
    'auth.loginTitle': { id: 'Masuk ke Akun Anda', en: 'Login to Your Account' },
    'auth.registerTitle': { id: 'Buat Akun Baru', en: 'Create New Account' },
    'auth.welcomeBack': { id: 'Selamat datang kembali!', en: 'Welcome back!' },
    'auth.startFree': { id: 'Mulai gratis, upgrade kapan saja', en: 'Start free, upgrade anytime' },

    // Dashboard
    'dashboard.title': { id: 'Dashboard', en: 'Dashboard' },
    'dashboard.welcome': { id: 'Selamat datang', en: 'Welcome' },
    'dashboard.quickStats': { id: 'Statistik Cepat', en: 'Quick Stats' },
    'dashboard.totalProducts': { id: 'Total Produk', en: 'Total Products' },
    'dashboard.totalOrders': { id: 'Total Pesanan', en: 'Total Orders' },
    'dashboard.viewStore': { id: 'Lihat Toko', en: 'View Store' },

    // Navigation
    'nav.dashboard': { id: 'Dashboard', en: 'Dashboard' },
    'nav.products': { id: 'Produk', en: 'Products' },
    'nav.orders': { id: 'Pesanan', en: 'Orders' },
    'nav.store': { id: 'Toko', en: 'Store' },
    'nav.builder': { id: 'Website Builder', en: 'Website Builder' },
    'nav.subscription': { id: 'Langganan', en: 'Subscription' },
    'nav.settings': { id: 'Pengaturan', en: 'Settings' },

    // Products
    'products.title': { id: 'Produk', en: 'Products' },
    'products.addProduct': { id: 'Tambah Produk', en: 'Add Product' },
    'products.editProduct': { id: 'Edit Produk', en: 'Edit Product' },
    'products.productName': { id: 'Nama Produk', en: 'Product Name' },
    'products.price': { id: 'Harga', en: 'Price' },
    'products.description': { id: 'Deskripsi', en: 'Description' },
    'products.images': { id: 'Gambar', en: 'Images' },
    'products.stock': { id: 'Stok', en: 'Stock' },
    'products.variants': { id: 'Varian', en: 'Variants' },
    'products.noProducts': { id: 'Belum ada produk', en: 'No products yet' },

    // Orders
    'orders.title': { id: 'Pesanan', en: 'Orders' },
    'orders.orderNumber': { id: 'Nomor Pesanan', en: 'Order Number' },
    'orders.customer': { id: 'Pelanggan', en: 'Customer' },
    'orders.total': { id: 'Total', en: 'Total' },
    'orders.date': { id: 'Tanggal', en: 'Date' },
    'orders.pending': { id: 'Menunggu', en: 'Pending' },
    'orders.confirmed': { id: 'Dikonfirmasi', en: 'Confirmed' },
    'orders.processing': { id: 'Diproses', en: 'Processing' },
    'orders.shipped': { id: 'Dikirim', en: 'Shipped' },
    'orders.completed': { id: 'Selesai', en: 'Completed' },
    'orders.cancelled': { id: 'Dibatalkan', en: 'Cancelled' },
    'orders.noOrders': { id: 'Belum ada pesanan', en: 'No orders yet' },

    // Store
    'store.title': { id: 'Pengaturan Toko', en: 'Store Settings' },
    'store.storeName': { id: 'Nama Toko', en: 'Store Name' },
    'store.storeDescription': { id: 'Deskripsi Toko', en: 'Store Description' },
    'store.whatsapp': { id: 'Nomor WhatsApp', en: 'WhatsApp Number' },
    'store.template': { id: 'Template', en: 'Template' },
    'store.createStore': { id: 'Buat Toko', en: 'Create Store' },
    'store.updateStore': { id: 'Perbarui Toko', en: 'Update Store' },

    // Subscription
    'subscription.title': { id: 'Langganan', en: 'Subscription' },
    'subscription.currentTier': { id: 'Tier Saat Ini', en: 'Current Tier' },
    'subscription.expiresAt': { id: 'Berakhir Pada', en: 'Expires At' },
    'subscription.daysRemaining': { id: 'hari lagi', en: 'days remaining' },
    'subscription.productLimit': { id: 'Limit Produk', en: 'Product Limit' },
    'subscription.usage': { id: 'Penggunaan', en: 'Usage' },
    'subscription.upgrade': { id: 'Upgrade', en: 'Upgrade' },
    'subscription.downgrade': { id: 'Downgrade', en: 'Downgrade' },
    'subscription.choosePlan': { id: 'Pilih Paket', en: 'Choose Plan' },
    'subscription.free': { id: 'Gratis', en: 'Free' },
    'subscription.starter': { id: 'Starter', en: 'Starter' },
    'subscription.growth': { id: 'Growth', en: 'Growth' },
    'subscription.pro': { id: 'Pro', en: 'Pro' },
    'subscription.trial': { id: 'Trial', en: 'Trial' },
    'subscription.expired': { id: 'Kadaluarsa', en: 'Expired' },
    'subscription.perMonth': { id: '/bulan', en: '/month' },

    // Pricing
    'pricing.title': { id: 'Harga yang Transparan', en: 'Transparent Pricing' },
    'pricing.subtitle': { id: 'Pilih paket yang sesuai dengan kebutuhan bisnis Anda', en: 'Choose the plan that fits your business needs' },
    'pricing.monthly': { id: 'Bulanan', en: 'Monthly' },
    'pricing.yearly': { id: 'Tahunan', en: 'Yearly' },
    'pricing.save': { id: 'Hemat', en: 'Save' },
    'pricing.startFree': { id: 'Mulai Gratis', en: 'Start Free' },
    'pricing.selectPlan': { id: 'Pilih Paket', en: 'Select Plan' },
    'pricing.popular': { id: 'POPULER', en: 'POPULAR' },
    'pricing.current': { id: 'AKTIF', en: 'ACTIVE' },

    // Builder
    'builder.title': { id: 'Website Builder', en: 'Website Builder' },
    'builder.sections': { id: 'Section', en: 'Sections' },
    'builder.preview': { id: 'Preview', en: 'Preview' },
    'builder.settings': { id: 'Pengaturan', en: 'Settings' },
    'builder.addSection': { id: 'Tambah Section', en: 'Add Section' },
    'builder.saveChanges': { id: 'Simpan', en: 'Save' },
    'builder.unsavedChanges': { id: 'Belum disimpan', en: 'Unsaved changes' },
    'builder.desktop': { id: 'Desktop', en: 'Desktop' },
    'builder.mobile': { id: 'Mobile', en: 'Mobile' },

    // Errors
    'error.generic': { id: 'Terjadi kesalahan. Silakan coba lagi.', en: 'An error occurred. Please try again.' },
    'error.network': { id: 'Koneksi gagal. Periksa internet Anda.', en: 'Connection failed. Check your internet.' },
    'error.notFound': { id: 'Data tidak ditemukan.', en: 'Data not found.' },
    'error.unauthorized': { id: 'Sesi Anda telah berakhir. Silakan login ulang.', en: 'Your session has expired. Please login again.' },
    'error.validation': { id: 'Periksa kembali data yang Anda masukkan.', en: 'Please check your input.' },
    'error.serverError': { id: 'Server sedang bermasalah. Coba lagi nanti.', en: 'Server error. Please try again later.' },

    // Success
    'success.saved': { id: 'Berhasil disimpan!', en: 'Successfully saved!' },
    'success.deleted': { id: 'Berhasil dihapus!', en: 'Successfully deleted!' },
    'success.created': { id: 'Berhasil dibuat!', en: 'Successfully created!' },
    'success.updated': { id: 'Berhasil diperbarui!', en: 'Successfully updated!' },

    // Public Store
    'store.orderViaWhatsapp': { id: 'Pesan via WhatsApp', en: 'Order via WhatsApp' },
    'store.addToCart': { id: 'Tambah ke Keranjang', en: 'Add to Cart' },
    'store.contactUs': { id: 'Hubungi Kami', en: 'Contact Us' },
    'store.aboutUs': { id: 'Tentang Kami', en: 'About Us' },
    'store.viewAll': { id: 'Lihat Semua', en: 'View All' },

    // FAQ
    'faq.title': { id: 'Pertanyaan Umum', en: 'Frequently Asked Questions' },
    'faq.hiddenFees.q': { id: 'Apakah ada biaya tersembunyi?', en: 'Are there any hidden fees?' },
    'faq.hiddenFees.a': { id: 'Tidak ada. Harga yang tertera adalah harga final. Tidak ada biaya setup, komisi, atau biaya tambahan lainnya.', en: 'No, there are none. The displayed price is the final price. No setup fees, commissions, or additional costs.' },
    'faq.upgrade.q': { id: 'Bagaimana cara upgrade atau downgrade?', en: 'How do I upgrade or downgrade?' },
    'faq.upgrade.a': { id: 'Anda bisa upgrade atau downgrade kapan saja melalui dashboard. Perubahan akan berlaku di periode billing berikutnya.', en: 'You can upgrade or downgrade anytime through the dashboard. Changes will take effect in the next billing period.' },
    'faq.security.q': { id: 'Apakah data saya aman?', en: 'Is my data secure?' },
    'faq.security.a': { id: 'Ya, kami menggunakan enkripsi SSL dan server yang aman untuk menjaga keamanan data Anda.', en: 'Yes, we use SSL encryption and secure servers to protect your data.' },
    'faq.support.q': { id: 'Bagaimana jika saya butuh bantuan?', en: 'What if I need help?' },
    'faq.support.a': { id: 'Tim support kami siap membantu via WhatsApp dan email. Pengguna Pro mendapat priority support.', en: 'Our support team is ready to help via WhatsApp and email. Pro users get priority support.' },

    // CTA
    'cta.title': { id: 'Mulai Jualan Online Hari Ini', en: 'Start Selling Online Today' },
    'cta.subtitle': { id: 'Gratis 3 bulan untuk memulai. Tidak perlu kartu kredit.', en: 'Free 3 months to get started. No credit card required.' },
    'cta.registerNow': { id: 'Daftar Sekarang - Gratis!', en: 'Register Now - Free!' },
    'cta.registerFree': { id: 'Daftar Gratis', en: 'Register Free' },

    // Landing Page - Hero
    'landing.hero.title1': { id: 'Jualan Lebih Mudah,', en: 'Sell Easier,' },
    'landing.hero.title2': { id: 'Lebih Profesional', en: 'More Professional' },
    'landing.hero.subtitle': { id: 'Platform e-commerce yang membantu UMKM Indonesia untuk scale bisnis dengan mudah, profesional, dan penuh amanah.', en: 'E-commerce platform that helps Indonesian SMEs scale their business easily, professionally, and with trust.' },
    'landing.hero.cta1': { id: 'Mulai Gratis Sekarang', en: 'Start Free Now' },
    'landing.hero.cta2': { id: 'Pelajari Lebih Lanjut', en: 'Learn More' },

    // Landing Page - Features
    'landing.features.title': { id: 'Fitur Unggulan', en: 'Key Features' },
    'landing.features.catalog.title': { id: 'Katalog Produk', en: 'Product Catalog' },
    'landing.features.catalog.desc': { id: 'Upload produk dengan mudah. Lengkap dengan variant ukuran dan warna.', en: 'Upload products easily. Complete with size and color variants.' },
    'landing.features.whatsapp.title': { id: 'WhatsApp Checkout', en: 'WhatsApp Checkout' },
    'landing.features.whatsapp.desc': { id: 'Order otomatis ke WhatsApp. Tidak perlu sistem cart yang rumit.', en: 'Automatic order to WhatsApp. No complicated cart system needed.' },
    'landing.features.payment.title': { id: 'Payment Gateway', en: 'Payment Gateway' },
    'landing.features.payment.desc': { id: 'Terima pembayaran via QRIS, VA Bank, dan E-wallet dengan mudah.', en: 'Accept payments via QRIS, Bank VA, and E-wallet easily.' },

    // Landing Page - Pricing
    'landing.pricing.title': { id: 'Paket Harga', en: 'Pricing Plans' },
    'landing.pricing.subtitle': { id: 'Pilih paket yang sesuai dengan kebutuhan bisnis Anda. Mulai gratis, upgrade kapan saja.', en: 'Choose the plan that fits your business. Start free, upgrade anytime.' },
    'landing.pricing.starter.name': { id: 'Starter', en: 'Starter' },
    'landing.pricing.starter.desc': { id: 'Untuk memulai bisnis online', en: 'To start your online business' },
    'landing.pricing.growth.name': { id: 'Growth', en: 'Growth' },
    'landing.pricing.growth.desc': { id: 'Untuk bisnis yang berkembang', en: 'For growing businesses' },
    'landing.pricing.pro.name': { id: 'Pro', en: 'Pro' },
    'landing.pricing.pro.desc': { id: 'Untuk bisnis profesional', en: 'For professional businesses' },
    'landing.pricing.popular': { id: 'Populer', en: 'Popular' },
    'landing.pricing.perMonth': { id: '/bulan', en: '/month' },
    'landing.pricing.products': { id: 'Hingga {count} produk', en: 'Up to {count} products' },
    'landing.pricing.whatsapp': { id: 'WhatsApp checkout', en: 'WhatsApp checkout' },
    'landing.pricing.subdomain': { id: 'Subdomain gratis', en: 'Free subdomain' },
    'landing.pricing.customDomain': { id: 'Custom domain', en: 'Custom domain' },
    'landing.pricing.paymentGateway': { id: 'Payment gateway', en: 'Payment gateway' },
    'landing.pricing.allGrowth': { id: 'Semua fitur Growth', en: 'All Growth features' },
    'landing.pricing.prioritySupport': { id: 'Priority support', en: 'Priority support' },
    'landing.pricing.analytics': { id: 'Analytics dashboard', en: 'Analytics dashboard' },
    'landing.pricing.startNow': { id: 'Mulai Sekarang', en: 'Start Now' },
    'landing.pricing.freeNote': { id: '🎉 Gratis 3 bulan pertama untuk semua paket. Tanpa kartu kredit.', en: '🎉 Free for the first 3 months for all plans. No credit card required.' },

    // Landing Page - CTA Section
    'landing.cta.title': { id: 'Siap Memulai Bisnis Online?', en: 'Ready to Start Your Online Business?' },
    'landing.cta.subtitle': { id: 'Bergabung dengan ribuan UMKM yang sudah menggunakan Shifr Asia', en: 'Join thousands of SMEs already using Shifr Asia' },
    'landing.cta.button': { id: 'Daftar Gratis 3 Bulan', en: 'Register Free for 3 Months' },

    // Landing Page - Footer
    'landing.footer.copyright': { id: '© 2024 Shifr Asia. Semua hak cipta dilindungi.', en: '© 2024 Shifr Asia. All rights reserved.' },
};

// Helper function to get translation
export function t(key: string, locale: Locale = 'id'): string {
    const translation = translations[key];
    if (!translation) {
        console.warn(`Missing translation for key: ${key}`);
        return key;
    }
    return translation[locale] || translation.id;
}
