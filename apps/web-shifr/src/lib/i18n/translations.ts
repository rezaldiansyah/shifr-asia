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
    'auth.resetPasswordTitle': { id: 'Reset Kata Sandi', en: 'Reset Password' },
    'auth.forgotPasswordDesc': { id: 'Masukkan email Anda dan kami akan mengirim link untuk reset kata sandi.', en: 'Enter your email and we will send you a password reset link.' },
    'auth.sendResetLink': { id: 'Kirim Link Reset', en: 'Send Reset Link' },
    'auth.backToLogin': { id: 'Kembali ke Login', en: 'Back to Login' },
    'auth.checkEmail': { id: 'Cek Email Anda', en: 'Check Your Email' },
    'auth.resetEmailSent': { id: 'Jika email terdaftar, Anda akan menerima link untuk reset kata sandi.', en: 'If email is registered, you will receive a password reset link.' },
    'auth.newPassword': { id: 'Kata Sandi Baru', en: 'New Password' },
    'auth.confirmNewPassword': { id: 'Konfirmasi Kata Sandi Baru', en: 'Confirm New Password' },
    'auth.resetPassword': { id: 'Reset Kata Sandi', en: 'Reset Password' },
    'auth.passwordResetSuccess': { id: 'Kata sandi berhasil diubah! Silakan login dengan kata sandi baru.', en: 'Password successfully changed! Please login with your new password.' },
    'auth.invalidResetToken': { id: 'Link reset tidak valid atau sudah kadaluarsa.', en: 'Reset link is invalid or expired.' },

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

    // Landing Page - Hero (PAS - Problem Hook)
    'landing.hero.badge': { id: '🎁 Gratis 3 Bulan Pertama', en: '🎁 Free for First 3 Months' },
    'landing.hero.title': { id: 'Masih Jualan Pakai Chat Biasa?', en: 'Still Selling via Regular Chat?' },
    'landing.hero.subtitle': { id: 'Chat hilang, order berantakan, customer bingung. Saatnya punya toko online profesional sendiri.', en: 'Chats get lost, orders are messy, customers confused. Time to have your own professional online store.' },
    'landing.hero.cta1': { id: 'Buat Toko Gratis', en: 'Create Free Store' },
    'landing.hero.cta2': { id: 'Lihat Demo', en: 'See Demo' },

    // Landing Page - Pain Points (Agitate)
    'landing.pain.title': { id: 'Apakah Ini yang Kamu Rasakan?', en: 'Does This Sound Familiar?' },
    'landing.pain.chat.title': { id: 'Chat Berantakan', en: 'Messy Chats' },
    'landing.pain.chat.desc': { id: 'Order via DM/WA tercampur chat biasa, sering kelewat', en: 'Orders via DM/WA mixed with regular chats, often missed' },
    'landing.pain.fee.title': { id: 'Fee Marketplace Mahal', en: 'Expensive Marketplace Fees' },
    'landing.pain.fee.desc': { id: 'Untung tipis habis dipotong komisi 5-15%', en: 'Thin profits eaten up by 5-15% commission' },
    'landing.pain.pro.title': { id: 'Terlihat Kurang Profesional', en: 'Looks Unprofessional' },
    'landing.pain.pro.desc': { id: 'Jualan di IG/WA saja, belum punya "toko resmi"', en: 'Only selling on IG/WA, no "official store" yet' },
    'landing.pain.manual.title': { id: 'Repot Rekap Manual', en: 'Manual Recording Hassle' },
    'landing.pain.manual.desc': { id: 'Hitung stok & omzet pakai Excel/kertas', en: 'Counting stock & revenue with Excel/paper' },

    // Landing Page - Before-After (BAB Transformation)
    'landing.transform.title': { id: 'Bayangkan Bisnis Kamu Seperti Ini...', en: 'Imagine Your Business Like This...' },
    'landing.transform.before': { id: 'Sebelum', en: 'Before' },
    'landing.transform.after': { id: 'Sesudah', en: 'After' },
    'landing.transform.item1.before': { id: 'Chat order berantakan', en: 'Messy order chats' },
    'landing.transform.item1.after': { id: 'Semua order tercatat otomatis', en: 'All orders recorded automatically' },
    'landing.transform.item2.before': { id: 'Kirim katalog manual', en: 'Sending catalog manually' },
    'landing.transform.item2.after': { id: 'Toko online 24/7', en: '24/7 online store' },
    'landing.transform.item3.before': { id: 'Terlihat amatir', en: 'Looks amateur' },
    'landing.transform.item3.after': { id: 'Brand profesional', en: 'Professional brand' },
    'landing.transform.item4.before': { id: 'Rekap pakai Excel', en: 'Recording with Excel' },
    'landing.transform.item4.after': { id: 'Dashboard real-time', en: 'Real-time dashboard' },

    // Landing Page - Solution (Features)
    'landing.solution.title': { id: 'Solusinya: Shifr Asia', en: 'The Solution: Shifr Asia' },
    'landing.solution.subtitle': { id: 'Platform all-in-one untuk UMKM Indonesia', en: 'All-in-one platform for Indonesian SMEs' },
    'landing.solution.store.title': { id: 'Toko Online Instan', en: 'Instant Online Store' },
    'landing.solution.store.desc': { id: 'Buat dalam 5 menit, tanpa coding', en: 'Create in 5 minutes, no coding' },
    'landing.solution.wa.title': { id: 'WhatsApp Checkout', en: 'WhatsApp Checkout' },
    'landing.solution.wa.desc': { id: 'Customer order langsung ke WA kamu', en: 'Customers order directly to your WA' },
    'landing.solution.domain.title': { id: 'Subdomain Gratis', en: 'Free Subdomain' },
    'landing.solution.domain.desc': { id: 'namatoko.shifr.asia - terlihat profesional', en: 'yourstore.shifr.asia - looks professional' },
    'landing.solution.dashboard.title': { id: 'Dashboard Lengkap', en: 'Complete Dashboard' },
    'landing.solution.dashboard.desc': { id: 'Pantau order, stok, omzet real-time', en: 'Monitor orders, stock, revenue real-time' },

    // Landing Page - Other Services  
    'landing.services.title': { id: 'Ekosistem Lengkap untuk Bisnis Digital', en: 'Complete Ecosystem for Digital Business' },
    'landing.services.store.title': { id: 'Toko Online', en: 'Online Store' },
    'landing.services.store.desc': { id: 'Buat toko profesional dalam hitungan menit', en: 'Create professional store in minutes' },
    'landing.services.card.title': { id: 'Digital Business Card', en: 'Digital Business Card' },
    'landing.services.card.desc': { id: 'Kartu nama digital yang interaktif', en: 'Interactive digital business card' },
    'landing.services.academy.title': { id: 'Shifr Academy', en: 'Shifr Academy' },
    'landing.services.academy.desc': { id: 'Belajar bisnis digital dari ahlinya', en: 'Learn digital business from experts' },
    'landing.services.marketing.title': { id: 'Digital Marketing', en: 'Digital Marketing' },
    'landing.services.marketing.desc': { id: 'Jasa iklan & promosi untuk bisnis kamu', en: 'Ads & promotion services for your business' },
    'landing.services.active': { id: 'Aktif', en: 'Active' },
    'landing.services.soon': { id: 'Segera Hadir', en: 'Coming Soon' },

    // Landing Page - Social Proof
    'landing.social.text': { id: '🚀 Bergabung dengan 50+ UMKM Early Adopters', en: '🚀 Join 50+ SME Early Adopters' },

    // Landing Page - Pricing
    'landing.pricing.title': { id: 'Investasi untuk Bisnis Profesional', en: 'Investment for Professional Business' },
    'landing.pricing.subtitle': { id: 'Lebih murah dari secangkir kopi per hari ☕', en: 'Cheaper than a cup of coffee per day ☕' },
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

    // Landing Page - FAQ
    'landing.faq.title': { id: 'Pertanyaan yang Sering Ditanyakan', en: 'Frequently Asked Questions' },
    'landing.faq.q1': { id: 'Apakah benar-benar gratis 3 bulan?', en: 'Is it really free for 3 months?' },
    'landing.faq.a1': { id: 'Ya! Anda bisa menggunakan semua fitur tanpa biaya selama 3 bulan pertama. Tidak perlu kartu kredit.', en: 'Yes! You can use all features for free during the first 3 months. No credit card required.' },
    'landing.faq.q2': { id: 'Bagaimana cara pembayarannya?', en: 'How do I pay?' },
    'landing.faq.a2': { id: 'Setelah masa trial, Anda bisa bayar via transfer bank, QRIS, atau e-wallet.', en: 'After the trial period, you can pay via bank transfer, QRIS, or e-wallet.' },
    'landing.faq.q3': { id: 'Bisakah pindah dari marketplace?', en: 'Can I move from marketplace?' },
    'landing.faq.a3': { id: 'Tentu! Anda tetap bisa jualan di marketplace sambil punya toko sendiri di Shifr Asia.', en: 'Of course! You can still sell on marketplace while having your own store on Shifr Asia.' },
    'landing.faq.q4': { id: 'Apakah data saya aman?', en: 'Is my data secure?' },
    'landing.faq.a4': { id: 'Ya, kami menggunakan enkripsi SSL dan server yang aman untuk menjaga keamanan data Anda.', en: 'Yes, we use SSL encryption and secure servers to protect your data.' },

    // Landing Page - Final CTA
    'landing.cta.title': { id: 'Mulai Hari Ini, Gratis!', en: 'Start Today, Free!' },
    'landing.cta.subtitle': { id: '50+ UMKM sudah bergabung. Giliran kamu sekarang.', en: '50+ SMEs have joined. Your turn now.' },
    'landing.cta.button': { id: 'Daftar Gratis - Tanpa Kartu Kredit', en: 'Register Free - No Credit Card' },

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
