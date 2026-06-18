// Translation dictionary for Shifr Asia
// Supports: English (en), Indonesian (id), and Arabic (ar)

export type Locale = 'en' | 'id' | 'ar';

export interface Translations {
    [key: string]: {
        en: string;
        id: string;
        ar: string;
    };
}

export const translations: Translations = {
    // Common
    'common.loading': { en: 'Loading...', id: 'Memuat...', ar: 'جارٍ التحميل...' },
    'common.save': { en: 'Save', id: 'Simpan', ar: 'حفظ' },
    'common.cancel': { en: 'Cancel', id: 'Batal', ar: 'إلغاء' },
    'common.delete': { en: 'Delete', id: 'Hapus', ar: 'حذف' },
    'common.edit': { en: 'Edit', id: 'Edit', ar: 'تعديل' },
    'common.add': { en: 'Add', id: 'Tambah', ar: 'إضافة' },
    'common.close': { en: 'Close', id: 'Tutup', ar: 'إغلاق' },
    'common.back': { en: 'Back', id: 'Kembali', ar: 'رجوع' },
    'common.next': { en: 'Next', id: 'Selanjutnya', ar: 'التالي' },
    'common.submit': { en: 'Submit', id: 'Kirim', ar: 'إرسال' },
    'common.search': { en: 'Search', id: 'Cari', ar: 'بحث' },
    'common.filter': { en: 'Filter', id: 'Filter', ar: 'تصفية' },
    'common.actions': { en: 'Actions', id: 'Aksi', ar: 'إجراءات' },
    'common.status': { en: 'Status', id: 'Status', ar: 'الحالة' },
    'common.active': { en: 'Active', id: 'Aktif', ar: 'نشط' },
    'common.inactive': { en: 'Inactive', id: 'Tidak Aktif', ar: 'غير نشط' },
    'common.yes': { en: 'Yes', id: 'Ya', ar: 'نعم' },
    'common.no': { en: 'No', id: 'Tidak', ar: 'لا' },
    'common.or': { en: 'or', id: 'atau', ar: 'أو' },
    'common.and': { en: 'and', id: 'dan', ar: 'و' },

    // Auth
    'auth.login': { en: 'Login', id: 'Masuk', ar: 'تسجيل الدخول' },
    'auth.register': { en: 'Register', id: 'Daftar', ar: 'تسجيل' },
    'auth.logout': { en: 'Logout', id: 'Keluar', ar: 'تسجيل الخروج' },
    'auth.email': { en: 'Email', id: 'Email', ar: 'البريد الإلكتروني' },
    'auth.password': { en: 'Password', id: 'Kata Sandi', ar: 'كلمة المرور' },
    'auth.confirmPassword': { en: 'Confirm Password', id: 'Konfirmasi Kata Sandi', ar: 'تأكيد كلمة المرور' },
    'auth.name': { en: 'Name', id: 'Nama', ar: 'الاسم' },
    'auth.forgotPassword': { en: 'Forgot password?', id: 'Lupa kata sandi?', ar: 'هل نسيت كلمة المرور؟' },
    'auth.noAccount': { en: "Don't have an account?", id: 'Belum punya akun?', ar: 'ليس لديك حساب؟' },
    'auth.hasAccount': { en: 'Already have an account?', id: 'Sudah punya akun?', ar: 'لديك حساب بالفعل؟' },
    'auth.loginTitle': { en: 'Login to Your Account', id: 'Masuk ke Akun Anda', ar: 'تسجيل الدخول إلى حسابك' },
    'auth.registerTitle': { en: 'Create New Account', id: 'Buat Akun Baru', ar: 'إنشاء حساب جديد' },
    'auth.welcomeBack': { en: 'Welcome back!', id: 'Selamat datang kembali!', ar: 'مرحباً بعودتك!' },
    'auth.startFree': { en: 'Start free, upgrade anytime', id: 'Mulai gratis, upgrade kapan saja', ar: 'ابدأ مجاناً، وقم بالترقية في أي وقت' },
    'auth.resetPasswordTitle': { en: 'Reset Password', id: 'Reset Kata Sandi', ar: 'إعادة تعيين كلمة المرور' },
    'auth.forgotPasswordDesc': { en: 'Enter your email and we will send you a password reset link.', id: 'Masukkan email Anda dan kami akan mengirim link untuk reset kata sandi.', ar: 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.' },
    'auth.sendResetLink': { en: 'Send Reset Link', id: 'Kirim Link Reset', ar: 'إرسال رابط إعادة التعيين' },
    'auth.backToLogin': { en: 'Back to Login', id: 'Kembali ke Login', ar: 'العودة إلى تسجيل الدخول' },
    'auth.checkEmail': { en: 'Check Your Email', id: 'Cek Email Anda', ar: 'تحقق من بريدك الإلكتروني' },
    'auth.resetEmailSent': { en: 'If email is registered, you will receive a password reset link.', id: 'Jika email terdaftar, Anda akan menerima link untuk reset kata sandi.', ar: 'إذا كان البريد الإلكتروني مسجلاً، فستتلقى رابط إعادة تعيين كلمة المرور.' },
    'auth.newPassword': { en: 'New Password', id: 'Kata Sandi Baru', ar: 'كلمة مرور جديدة' },
    'auth.confirmNewPassword': { en: 'Confirm New Password', id: 'Konfirmasi Kata Sandi Baru', ar: 'تأكيد كلمة المرور الجديدة' },
    'auth.resetPassword': { en: 'Reset Password', id: 'Reset Kata Sandi', ar: 'إعادة تعيين كلمة المرور' },
    'auth.passwordResetSuccess': { en: 'Password successfully changed! Please login with your new password.', id: 'Kata sandi berhasil diubah! Silakan login dengan kata sandi baru.', ar: 'تم تغيير كلمة المرور بنجاح! يرجى تسجيل الدخول بكلمة المرور الجديدة.' },
    'auth.invalidResetToken': { en: 'Reset link is invalid or expired.', id: 'Link reset tidak valid atau sudah kadaluarsa.', ar: 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية.' },

    // Dashboard
    'dashboard.title': { en: 'Dashboard', id: 'Dashboard', ar: 'لوحة القيادة' },
    'dashboard.welcome': { en: 'Welcome', id: 'Selamat datang', ar: 'مرحباً' },
    'dashboard.quickStats': { en: 'Quick Stats', id: 'Statistik Cepat', ar: 'إحصائيات سريعة' },
    'dashboard.totalProducts': { en: 'Total Products', id: 'Total Produk', ar: 'إجمالي المنتجات' },
    'dashboard.totalOrders': { en: 'Total Orders', id: 'Total Pesanan', ar: 'إجمالي الطلبات' },
    'dashboard.viewStore': { en: 'View Store', id: 'Lihat Toko', ar: 'عرض المتجر' },

    // Navigation (Non-Landing)
    'nav.dashboard': { en: 'Dashboard', id: 'Dashboard', ar: 'لوحة القيادة' },
    'nav.products': { en: 'Products', id: 'Produk', ar: 'المنتجات' },
    'nav.orders': { en: 'Orders', id: 'Pesanan', ar: 'الطلبات' },
    'nav.store': { en: 'Store', id: 'Toko', ar: 'المتجر' },
    'nav.builder': { en: 'Website Builder', id: 'Website Builder', ar: 'منشئ المواقع' },
    'nav.subscription': { en: 'Subscription', id: 'Langganan', ar: 'الاشتراك' },
    'nav.settings': { en: 'Settings', id: 'Pengaturan', ar: 'الإعدادات' },

    // Products
    'products.title': { en: 'Products', id: 'Produk', ar: 'المنتجات' },
    'products.addProduct': { en: 'Add Product', id: 'Tambah Produk', ar: 'إضافة منتج' },
    'products.editProduct': { en: 'Edit Product', id: 'Edit Produk', ar: 'تعديل المنتج' },
    'products.productName': { en: 'Product Name', id: 'Nama Produk', ar: 'اسم المنتج' },
    'products.price': { en: 'Price', id: 'Harga', ar: 'السعر' },
    'products.description': { en: 'Description', id: 'Deskripsi', ar: 'الوصف' },
    'products.images': { en: 'Images', id: 'Gambar', ar: 'الصور' },
    'products.stock': { en: 'Stock', id: 'Stok', ar: 'المخزون' },
    'products.variants': { en: 'Variants', id: 'Varian', ar: 'المتغيرات' },
    'products.noProducts': { en: 'No products yet', id: 'Belum ada produk', ar: 'لا توجد منتجات بعد' },

    // Orders
    'orders.title': { en: 'Orders', id: 'Pesanan', ar: 'الطلبات' },
    'orders.orderNumber': { en: 'Order Number', id: 'Nomor Pesanan', ar: 'رقم الطلب' },
    'orders.customer': { en: 'Customer', id: 'Pelanggan', ar: 'العميل' },
    'orders.total': { en: 'Total', id: 'Total', ar: 'الإجمالي' },
    'orders.date': { en: 'Date', id: 'Tanggal', ar: 'التاريخ' },
    'orders.pending': { en: 'Pending', id: 'Menunggu', ar: 'قيد الانتظار' },
    'orders.confirmed': { en: 'Confirmed', id: 'Dikonfirmasi', ar: 'مؤكد' },
    'orders.processing': { en: 'Processing', id: 'Diproses', ar: 'قيد المعالجة' },
    'orders.shipped': { en: 'Shipped', id: 'Dikirim', ar: 'تم الشحن' },
    'orders.completed': { en: 'Completed', id: 'Selesai', ar: 'مكتمل' },
    'orders.cancelled': { en: 'Cancelled', id: 'Dibatalkan', ar: 'ملغى' },
    'orders.noOrders': { en: 'No orders yet', id: 'Belum ada pesanan', ar: 'لا توجد طلبات بعد' },

    // Store
    'store.title': { en: 'Store Settings', id: 'Pengaturan Toko', ar: 'إعدادات المتجر' },
    'store.storeName': { en: 'Store Name', id: 'Nama Toko', ar: 'اسم المتجر' },
    'store.storeDescription': { en: 'Store Description', id: 'Deskripsi Toko', ar: 'وصف المتجر' },
    'store.whatsapp': { en: 'WhatsApp Number', id: 'Nomor WhatsApp', ar: 'رقم واتساب' },
    'store.template': { en: 'Template', id: 'Template', ar: 'القالب' },
    'store.createStore': { en: 'Create Store', id: 'Buat Toko', ar: 'إنشاء متجر' },
    'store.updateStore': { en: 'Update Store', id: 'Perbarui Toko', ar: 'تحديث المتجر' },
    'store.orderViaWhatsapp': { en: 'Order via WhatsApp', id: 'Pesan via WhatsApp', ar: 'اطلب عبر واتساب' },
    'store.addToCart': { en: 'Add to Cart', id: 'Tambah ke Keranjang', ar: 'أضف إلى السلة' },
    'store.contactUs': { en: 'Contact Us', id: 'Hubungi Kami', ar: 'اتصل بنا' },
    'store.aboutUs': { en: 'About Us', id: 'Tentang Kami', ar: 'معلومات عنا' },
    'store.viewAll': { en: 'View All', id: 'Lihat Semua', ar: 'عرض الكل' },

    // Subscription
    'subscription.title': { en: 'Subscription', id: 'Langganan', ar: 'الاشتراك' },
    'subscription.currentTier': { en: 'Current Tier', id: 'Tier Saat Ini', ar: 'الفئة الحالية' },
    'subscription.expiresAt': { en: 'Expires At', id: 'Berakhir Pada', ar: 'ينتهي في' },
    'subscription.daysRemaining': { en: 'days remaining', id: 'hari lagi', ar: 'أيام متبقية' },
    'subscription.productLimit': { en: 'Product Limit', id: 'Limit Produk', ar: 'حد المنتجات' },
    'subscription.usage': { en: 'Usage', id: 'Penggunaan', ar: 'الاستخدام' },
    'subscription.upgrade': { en: 'Upgrade', id: 'Upgrade', ar: 'ترقية' },
    'subscription.downgrade': { en: 'Downgrade', id: 'Downgrade', ar: 'تخفيض' },
    'subscription.choosePlan': { en: 'Choose Plan', id: 'Pilih Paket', ar: 'اختر الخطة' },
    'subscription.free': { en: 'Free', id: 'Gratis', ar: 'مجاني' },
    'subscription.starter': { en: 'Starter', id: 'Starter', ar: 'المبتدئ' },
    'subscription.growth': { en: 'Growth', id: 'Growth', ar: 'النمو' },
    'subscription.pro': { en: 'Pro', id: 'Pro', ar: 'الاحترافي' },
    'subscription.trial': { en: 'Trial', id: 'Trial', ar: 'تجربة' },
    'subscription.expired': { en: 'Expired', id: 'Kadaluarsa', ar: 'منتهي الصلاحية' },
    'subscription.perMonth': { en: '/month', id: '/bulan', ar: '/شهر' },

    // Pricing
    'pricing.title': { en: 'Transparent Pricing', id: 'Harga yang Transparan', ar: 'تسعير شفاف' },
    'pricing.subtitle': { en: 'Choose the plan that fits your business needs', id: 'Pilih paket yang sesuai dengan kebutuhan bisnis Anda', ar: 'اختر الخطة التي تناسب احتياجات عملك' },
    'pricing.startFree': { en: 'Start Free', id: 'Mulai Gratis', ar: 'ابدأ مجاناً' },
    'pricing.monthly': { en: 'Monthly', id: 'Bulanan', ar: 'شهرياً' },
    'pricing.yearly': { en: 'Yearly', id: 'Tahunan', ar: 'سنوياً' },
    'pricing.save': { en: 'Save', id: 'Hemat', ar: 'وفر' },

    // FAQ
    'faq.title': { en: 'Frequently Asked Questions', id: 'Pertanyaan Umum', ar: 'الأسئلة الشائعة' },
    'faq.hiddenFees.q': { en: 'Are there any hidden fees?', id: 'Apakah ada biaya tersembunyi?', ar: 'هل هناك أي رسوم خفية؟' },
    'faq.hiddenFees.a': { en: 'No, there are none. The displayed price is the final price.', id: 'Tidak ada. Harga yang tertera adalah harga final.', ar: 'لا، لا يوجد. السعر المعروض هو السعر النهائي.' },
    'faq.upgrade.q': { en: 'How do I upgrade or downgrade?', id: 'Bagaimana cara upgrade atau downgrade?', ar: 'كيف يمكنني الترقية أو التخفيض؟' },
    'faq.upgrade.a': { en: 'You can upgrade or downgrade anytime through the dashboard.', id: 'Anda bisa upgrade atau downgrade kapan saja melalui dashboard.', ar: 'يمكنك الترقية أو التخفيض في أي وقت من خلال لوحة القيادة.' },
    'faq.security.q': { en: 'Is my data secure?', id: 'Apakah data saya aman?', ar: 'هل بياناتي آمنة؟' },
    'faq.security.a': { en: 'Yes, we use SSL encryption and secure servers to protect your data.', id: 'Ya, kami menggunakan enkripsi SSL dan server yang aman untuk menjaga keamanan data Anda.', ar: 'نعم، نحن نستخدم تشفير SSL وخوادم آمنة لحماية بياناتك.' },
    'faq.support.q': { en: 'What if I need help?', id: 'Bagaimana jika saya butuh bantuan?', ar: 'ماذا لو احتجت إلى مساعدة؟' },
    'faq.support.a': { en: 'Our support team is ready to help via WhatsApp and email.', id: 'Tim support kami siap membantu via WhatsApp dan email.', ar: 'فريق الدعم لدينا مستعد للمساعدة عبر واتساب والبريد الإلكتروني.' },

    // CTA old
    'cta.title': { en: 'Start Selling Online Today', id: 'Mulai Jualan Online Hari Ini', ar: 'ابدأ البيع عبر الإنترنت اليوم' },
    'cta.subtitle': { en: 'Free 3 months to get started.', id: 'Gratis 3 bulan untuk memulai.', ar: 'مجاناً لمدة 3 أشهر للبدء.' },
    'cta.registerNow': { en: 'Register Now - Free!', id: 'Daftar Sekarang - Gratis!', ar: 'سجل الآن - مجاناً!' },
    'cta.registerFree': { en: 'Register Free', id: 'Daftar Gratis', ar: 'تسجيل مجاني' },

    // Builder
    'builder.title': { en: 'Website Builder', id: 'Website Builder', ar: 'منشئ المواقع' },
    'builder.sections': { en: 'Sections', id: 'Section', ar: 'الأقسام' },
    'builder.preview': { en: 'Preview', id: 'Preview', ar: 'معاينة' },
    'builder.settings': { en: 'Settings', id: 'Pengaturan', ar: 'الإعدادات' },
    'builder.addSection': { en: 'Add Section', id: 'Tambah Section', ar: 'إضافة قسم' },
    'builder.saveChanges': { en: 'Save', id: 'Simpan', ar: 'حفظ' },
    'builder.unsavedChanges': { en: 'Unsaved changes', id: 'Belum disimpan', ar: 'تغييرات غير محفوظة' },
    'builder.desktop': { en: 'Desktop', id: 'Desktop', ar: 'سطح المكتب' },
    'builder.mobile': { en: 'Mobile', id: 'Mobile', ar: 'الجوال' },

    // Errors
    'error.generic': { en: 'An error occurred. Please try again.', id: 'Terjadi kesalahan. Silakan coba lagi.', ar: 'حدث خطأ. يرجى المحاولة مرة أخرى.' },
    'error.network': { en: 'Connection failed. Check your internet.', id: 'Koneksi gagal. Periksa internet Anda.', ar: 'فشل الاتصال. تحقق من الإنترنت الخاص بك.' },
    'error.notFound': { en: 'Data not found.', id: 'Data tidak ditemukan.', ar: 'البيانات غير موجودة.' },
    'error.unauthorized': { en: 'Your session has expired. Please login again.', id: 'Sesi Anda telah berakhir. Silakan login ulang.', ar: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.' },
    'error.validation': { en: 'Please check your input.', id: 'Periksa kembali data yang Anda masukkan.', ar: 'يرجى التحقق من إدخالك.' },
    'error.serverError': { en: 'Server error. Please try again later.', id: 'Server sedang bermasalah. Coba lagi nanti.', ar: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.' },

    // Success
    'success.saved': { en: 'Successfully saved!', id: 'Berhasil disimpan!', ar: 'تم الحفظ بنجاح!' },
    'success.deleted': { en: 'Successfully deleted!', id: 'Berhasil dihapus!', ar: 'تم الحذف بنجاح!' },
    'success.created': { en: 'Successfully created!', id: 'Berhasil dibuat!', ar: 'تم الإنشاء بنجاح!' },
    'success.updated': { en: 'Successfully updated!', id: 'Berhasil diperbarui!', ar: 'تم التحديث بنجاح!' },

    // --- LANDING PAGE (COMPANY PROFILE) ---

    // Navigation
    'landing.nav.services': { en: 'Services', id: 'Layanan', ar: 'الخدمات' },
    'landing.nav.portfolio': { en: 'Portfolio', id: 'Portofolio', ar: 'محفظة الأعمال' },
    'landing.nav.about': { en: 'About', id: 'Tentang', ar: 'حول' },
    'landing.nav.contact': { en: 'Contact', id: 'Kontak', ar: 'اتصل بنا' },
    'landing.nav.login': { en: 'Login', id: 'Masuk', ar: 'تسجيل الدخول' },

    // Hero
    'landing.hero.badge': { en: 'Strategic Management & Digital Transformation', id: 'Manajemen Strategis & Transformasi Digital', ar: 'الإدارة الاستراتيجية والتحول الرقمي' },
    'landing.hero.title': { en: 'Shaping a Bolder Future', id: 'Shaping a Bolder Future', ar: 'تشكيل مستقبل أكثر جرأة' },
    'landing.hero.subtitle': { en: 'Your integrated business transformation partner for competitive advantage in the digital economy.', id: 'Mitra transformasi bisnis terintegrasi Anda untuk keunggulan kompetitif di ekonomi digital.', ar: 'شريكك المتكامل في تحول الأعمال من أجل ميزة تنافسية في الاقتصاد الرقمي.' },
    'landing.hero.cta1': { en: 'Explore Our Services', id: 'Jelajahi Layanan Kami', ar: 'اكتشف خدماتنا' },
    'landing.hero.cta2': { en: 'Get in Touch', id: 'Hubungi Kami', ar: 'ابق على تواصل' },

    // About
    'landing.about.title': { en: 'About Shifr Asia Inovasi', id: 'Tentang Shifr Asia Inovasi', ar: 'حول شيفر آسيا للابتكار' },
    'landing.about.subtitle': { en: 'Your Long-Term Growth Partner', id: 'Mitra Pertumbuhan Jangka Panjang Anda', ar: 'شريكك في النمو على المدى الطويل' },
    'landing.about.body': { en: 'We understand that digitalization is no longer a mere trend, but a strategic imperative. Shifr serves as your trusted ally, facilitating a phased digital transformation that aligns with your specific needs, capacities, and core corporate values.', id: 'Kami memahami bahwa digitalisasi bukan lagi sekadar tren, melainkan sebuah keharusan strategis. Shifr hadir sebagai sekutu tepercaya Anda, memfasilitasi transformasi digital bertahap yang selaras dengan kebutuhan, kapasitas, dan nilai-nilai inti perusahaan Anda.', ar: 'نحن ندرك أن الرقمنة لم تعد مجرد اتجاه، بل هي ضرورة استراتيجية. تعمل شيفر كحليفك الموثوق به، حيث تسهل تحولًا رقميًا تدريجيًا يتماشى مع احتياجاتك الخاصة وقدراتك وقيمك المؤسسية الأساسية.' },
    'landing.about.synergy': { en: 'We synergize data (the Sage) with creativity (the Creator) to ensure every investment yields tangible impact.', id: 'Kami mensinergikan data (the Sage) dengan kreativitas (the Creator) untuk memastikan setiap investasi menghasilkan dampak nyata.', ar: 'نحن نتآزر بالبيانات (الحكيم) مع الإبداع (المبدع) لضمان أن كل استثمار يحقق تأثيرًا ملموسًا.' },

    // Metrics
    'landing.metrics.partners': { en: '25+', id: '25+', ar: '+٢٥' },
    'landing.metrics.partnersLabel': { en: 'Happy Partners', id: 'Mitra yang Bahagia', ar: 'شركاء سعداء' },
    'landing.metrics.designs': { en: '100+', id: '100+', ar: '+١٠٠' },
    'landing.metrics.designsLabel': { en: 'Designs Created', id: 'Desain yang Dibuat', ar: 'تصميمات تم إنشاؤها' },

    // Services
    'landing.services.title': { en: 'Integrated Digital Services', id: 'Layanan Digital Terintegrasi', ar: 'الخدمات الرقمية المتكاملة' },
    'landing.services.enterprise.title': { en: 'Enterprise System Development', id: 'Pengembangan Sistem Enterprise', ar: 'تطوير أنظمة المؤسسات' },
    'landing.services.enterprise.desc': { en: 'Designing and building robust technology architectures and digital ecosystems to support continuous business scaling.', id: 'Merancang dan membangun arsitektur teknologi dan ekosistem digital yang kuat untuk mendukung penskalaan bisnis yang berkelanjutan.', ar: 'تصميم وبناء هياكل تكنولوجية قوية وأنظمة بيئية رقمية لدعم توسع الأعمال المستمر.' },
    'landing.services.marketing.title': { en: 'Growth-Driven Digital Marketing', id: 'Pemasaran Digital Berbasis Pertumbuhan', ar: 'التسويق الرقمي الموجه نحو النمو' },
    'landing.services.marketing.desc': { en: 'Formulating and executing data-driven market penetration strategies to accelerate customer acquisition and revenue growth.', id: 'Merumuskan dan mengeksekusi strategi penetrasi pasar berbasis data untuk mempercepat akuisisi pelanggan dan pertumbuhan pendapatan.', ar: 'صياغة وتنفيذ استراتيجيات اختراق السوق القائمة على البيانات لتسريع اكتساب العملاء ونمو الإيرادات.' },
    'landing.services.transformation.title': { en: 'Integrated Transformation Management', id: 'Manajemen Transformasi Terintegrasi', ar: 'إدارة التحول المتكاملة' },
    'landing.services.transformation.desc': { en: 'Partnering with leadership to navigate business change, align operations, and ensure effective strategy execution.', id: 'Bermitra dengan kepemimpinan untuk menavigasi perubahan bisnis, menyelaraskan operasi, dan memastikan eksekusi strategi yang efektif.', ar: 'الشراكة مع القيادة لتوجيه التغيير في الأعمال، ومواءمة العمليات، وضمان تنفيذ الاستراتيجية بفعالية.' },

    // Portfolio
    'landing.portfolio.title': { en: 'Proven Track Record & Core Capabilities', id: 'Rekam Jejak Terbukti & Kemampuan Inti', ar: 'سجل حافل وقدرات أساسية' },
    'landing.portfolio.tab.industry': { en: 'Industry & Technical', id: 'Industri & Teknis', ar: 'الصناعة والتقنية' },
    'landing.portfolio.tab.education': { en: 'Education & Social', id: 'Pendidikan & Sosial', ar: 'التعليم والاجتماعي' },
    'landing.portfolio.tab.ecommerce': { en: 'E-Commerce & Lifestyle', id: 'E-Commerce & Gaya Hidup', ar: 'التجارة الإلكترونية وأسلوب الحياة' },
    'landing.portfolio.tab.social': { en: 'Social Media', id: 'Media Sosial', ar: 'وسائل التواصل الاجتماعي' },
    'landing.portfolio.tab.ai': { en: 'AI Integration', id: 'Integrasi AI', ar: 'تكامل الذكاء الاصطناعي' },

    'landing.portfolio.prida.title': { en: 'Prida Denia Teknindo', id: 'Prida Denia Teknindo', ar: 'Prida Denia Teknindo' },
    'landing.portfolio.prida.desc': { en: 'Website Company Profile — Supplier Genset & Spare Parts.', id: 'Profil Perusahaan Website — Pemasok Genset & Suku Cadang.', ar: 'ملف الشركة على الموقع الإلكتروني — مورد المولدات وقطع الغيار.' },
    'landing.portfolio.pinara.title': { en: 'Pinara Logistics', id: 'Pinara Logistics', ar: 'Pinara Logistics' },
    'landing.portfolio.pinara.desc': { en: 'Company website development for national logistic company.', id: 'Pengembangan website perusahaan untuk perusahaan logistik nasional.', ar: 'تطوير الموقع الإلكتروني لشركة لوجستية وطنية.' },
    'landing.portfolio.gaspro.title': { en: 'Gaspro', id: 'Gaspro', ar: 'Gaspro' },
    'landing.portfolio.gaspro.desc': { en: 'Company website for EPC company in Oil & Gas Industry.', id: 'Website perusahaan untuk perusahaan EPC di Industri Minyak & Gas.', ar: 'الموقع الإلكتروني لشركة EPC في صناعة النفط والغاز.' },

    'landing.portfolio.alfatih.title': { en: 'Akademi Al-Fatih', id: 'Akademi Al-Fatih', ar: 'Akademi Al-Fatih' },
    'landing.portfolio.alfatih.desc': { en: 'Building educational ecosystems', id: 'Membangun ekosistem pendidikan', ar: 'بناء النظم البيئية التعليمية' },
    'landing.portfolio.alfatihpilar.title': { en: 'Al Fatih Pilar Peradaban Ilmu', id: 'Al Fatih Pilar Peradaban Ilmu', ar: 'Al Fatih Pilar Peradaban Ilmu' },
    'landing.portfolio.asysyuuraa.title': { en: 'Asy-Syuuraa Batam', id: 'Asy-Syuuraa Batam', ar: 'Asy-Syuuraa Batam' },
    'landing.portfolio.belajarsiroh.title': { en: 'Belajar Siroh', id: 'Belajar Siroh', ar: 'Belajar Siroh' },

    'landing.portfolio.saakina.title': { en: 'Saakina Digital Platform', id: 'Saakina Digital Platform', ar: 'Saakina Digital Platform' },
    'landing.portfolio.saakina.desc': { en: 'Developing digital invitation platforms and Islamic e-commerce solutions integrated with automated payment systems.', id: 'Mengembangkan platform undangan digital dan solusi e-commerce Islami yang terintegrasi dengan sistem pembayaran otomatis.', ar: 'تطوير منصات الدعوات الرقمية وحلول التجارة الإلكترونية الإسلامية المدمجة مع أنظمة الدفع الآلية.' },
    'landing.portfolio.branding.desc': { en: 'We also manage comprehensive branding initiatives for Syamsa Group (Property), Woven Label Indonesia (Fashion Branding), and Locarvest (Agribusiness).', id: 'Kami juga mengelola inisiatif branding komprehensif untuk Syamsa Group (Properti), Woven Label Indonesia (Fashion Branding), dan Locarvest (Agribisnis).', ar: 'نحن ندير أيضًا مبادرات شاملة للعلامات التجارية لمجموعة سيامسا (العقارات) و ووفن ليبل إندونيسيا (علامات الأزياء) ولوكارفست (الأعمال التجارية الزراعية).' },

    'landing.portfolio.social.desc': { en: 'We orchestrate compelling social media campaigns tailored to various communities and business divisions.', id: 'Kami mengatur kampanye media sosial yang menarik yang disesuaikan dengan berbagai komunitas dan divisi bisnis.', ar: 'نحن ننظم حملات مقنعة على وسائل التواصل الاجتماعي مصممة لتناسب مختلف المجتمعات وأقسام الأعمال.' },
    'landing.portfolio.akademiquran': { en: '@akademiquran: 10K+ Followers', id: '@akademiquran: 10K+ Pengikut', ar: '@akademiquran: +١٠ ألف متابع' },
    'landing.portfolio.kpmidepok': { en: '@kpmidepok.official: Komunitas Pengusaha Muslim', id: '@kpmidepok.official: Komunitas Pengusaha Muslim', ar: '@kpmidepok.official: مجتمع رواد الأعمال المسلمين' },
    'landing.portfolio.saakinaid': { en: '@saakina.id: Engagement-driven content', id: '@saakina.id: Konten berbasis interaksi', ar: '@saakina.id: محتوى يعتمد على المشاركة' },
    'landing.portfolio.asysyuuraabatam': { en: '@asysyuuraabatam: Social media management consultant', id: '@asysyuuraabatam: Konsultan manajemen media sosial', ar: '@asysyuuraabatam: مستشار إدارة وسائل التواصل الاجتماعي' },

    'landing.portfolio.iclean.title': { en: 'iClean', id: 'iClean', ar: 'iClean' },
    'landing.portfolio.iclean.desc': { en: 'Conversational AI integration for proactive customer greeting and automated lead pipeline management.', id: 'Integrasi AI percakapan untuk sapaan pelanggan proaktif dan manajemen pipeline prospek otomatis.', ar: 'تكامل الذكاء الاصطناعي التخاطبي لترحيب العملاء الاستباقي وإدارة خط أنابيب العملاء المحتملين الآلي.' },
    'landing.portfolio.pulse.title': { en: 'Pulse', id: 'Pulse', ar: 'Pulse' },
    'landing.portfolio.pulse.desc': { en: 'Advanced predictive analytics delivering actionable insights for project management in the construction sector.', id: 'Analisis prediktif canggih yang memberikan wawasan yang dapat ditindaklanjuti untuk manajemen proyek di sektor konstruksi.', ar: 'تحليلات تنبؤية متقدمة تقدم رؤى قابلة للتنفيذ لإدارة المشاريع في قطاع البناء.' },
    'landing.portfolio.nafsee.title': { en: 'Nafsee', id: 'Nafsee', ar: 'Nafsee' },
    'landing.portfolio.nafsee.desc': { en: 'Driving AI innovation in wellness to deliver in-depth mental health analysis and personalized guidance.', id: 'Mendorong inovasi AI dalam kesejahteraan untuk memberikan analisis kesehatan mental yang mendalam dan panduan yang dipersonalisasi.', ar: 'قيادة الابتكار في الذكاء الاصطناعي في مجال العافية لتقديم تحليل متعمق للصحة العقلية وإرشادات مخصصة.' },

    // Why Partner
    'landing.why.title': { en: 'Why Partner With Us?', id: 'Mengapa Bermitra Dengan Kami?', ar: 'لماذا تتعاون معنا؟' },
    'landing.why.datadriven.title': { en: 'Data-Driven Strategic Frameworks', id: 'Kerangka Strategis Berbasis Data', ar: 'الأطر الاستراتيجية القائمة على البيانات' },
    'landing.why.datadriven.desc': { en: 'Our solutions are formulated through in-depth Business Health Checks, ensuring every initiative drives concrete outcomes.', id: 'Solusi kami dirumuskan melalui Pemeriksaan Kesehatan Bisnis yang mendalam, memastikan setiap inisiatif mendorong hasil yang nyata.', ar: 'تتم صياغة حلولنا من خلال فحوصات صحة الأعمال المتعمقة، مما يضمن أن كل مبادرة تؤدي إلى نتائج ملموسة.' },
    'landing.why.scalability.title': { en: 'Enterprise-Grade Scalability', id: 'Skalabilitas Kelas Enterprise', ar: 'قابلية التوسع على مستوى المؤسسات' },
    'landing.why.scalability.desc': { en: 'Focused on building robust, scalable architectures that support your long-term growth without accumulating future technical debt.', id: 'Berfokus pada membangun arsitektur yang kuat dan skalabel yang mendukung pertumbuhan jangka panjang Anda tanpa menumpuk utang teknis di masa depan.', ar: 'نركز على بناء هياكل قوية وقابلة للتطوير تدعم نموك على المدى الطويل دون تراكم الديون التقنية المستقبلية.' },
    'landing.why.integrity.title': { en: 'Integrity & Ethical Governance', id: 'Integritas & Tata Kelola Etis', ar: 'النزاهة والحوكمة الأخلاقية' },
    'landing.why.integrity.desc': { en: 'We uphold absolute transparency and professional ethical standards across all commercial engagements and project governance.', id: 'Kami menjunjung transparansi absolut dan standar etika profesional di semua keterlibatan komersial dan tata kelola proyek.', ar: 'نحن نلتزم بالشفافية المطلقة والمعايير الأخلاقية المهنية عبر جميع الارتباطات التجارية وحوكمة المشاريع.' },
    'landing.why.trackrecord.title': { en: 'Demonstrated Track Record', id: 'Rekam Jejak Terbukti', ar: 'سجل حافل' },
    'landing.why.trackrecord.desc': { en: 'Empowered by an experienced team boasting a diverse portfolio, from industrial manufacturing to digital learning ecosystems.', id: 'Diberdayakan oleh tim berpengalaman yang membanggakan portofolio beragam, dari manufaktur industri hingga ekosistem pembelajaran digital.', ar: 'مدعومون بفريق من ذوي الخبرة يفتخر بمحفظة متنوعة، من التصنيع الصناعي إلى النظم البيئية للتعلم الرقمي.' },

    // Partnership Framework
    'landing.framework.title': { en: 'Our Partnership Framework', id: 'Kerangka Kemitraan Kami', ar: 'إطار الشراكة الخاص بنا' },
    'landing.framework.discovery.title': { en: 'Discovery & Alignment', id: 'Penemuan & Penyelarasan', ar: 'الاكتشاف والمواءمة' },
    'landing.framework.discovery.desc': { en: 'Engaging in comprehensive needs assessments and Business Health Checks to perfectly align with your core vision.', id: 'Terlibat dalam penilaian kebutuhan komprehensif dan Pemeriksaan Kesehatan Bisnis agar selaras sempurna dengan visi inti Anda.', ar: 'المشاركة في تقييمات الاحتياجات الشاملة وفحوصات صحة الأعمال للمواءمة التامة مع رؤيتك الأساسية.' },
    'landing.framework.cocreation.title': { en: 'Co-Creation & Blueprinting', id: 'Kreasi Bersama & Pembuatan Cetak Biru', ar: 'الإبداع المشترك والمخطط' },
    'landing.framework.cocreation.desc': { en: 'Formulating data-driven strategies and establishing clear project baselines for structured execution.', id: 'Merumuskan strategi berbasis data dan menetapkan garis dasar proyek yang jelas untuk eksekusi terstruktur.', ar: 'صياغة استراتيجيات قائمة على البيانات وإنشاء خطوط أساس واضحة للمشروع من أجل تنفيذ منظم.' },
    'landing.framework.agile.title': { en: 'Agile Implementation', id: 'Implementasi Agile', ar: 'التنفيذ الرشيق' },
    'landing.framework.agile.desc': { en: 'Deploying robust enterprise systems, digital ecosystems, and integrated campaigns with precision and adaptability.', id: 'Menyebarkan sistem enterprise yang kuat, ekosistem digital, dan kampanye terintegrasi dengan presisi dan kemampuan adaptasi.', ar: 'نشر أنظمة المؤسسات القوية والأنظمة البيئية الرقمية والحملات المتكاملة بدقة وقابلية للتكيف.' },
    'landing.framework.optimization.title': { en: 'Continuous Optimization', id: 'Pengoptimalan Berkelanjutan', ar: 'التحسين المستمر' },
    'landing.framework.optimization.desc': { en: 'Facilitating ongoing performance governance and strategic reviews to drive sustained, long-term business value.', id: 'Memfasilitasi tata kelola kinerja berkelanjutan dan tinjauan strategis untuk mendorong nilai bisnis jangka panjang yang berkelanjutan.', ar: 'تسهيل حوكمة الأداء المستمرة والمراجعات الاستراتيجية لتعزيز قيمة الأعمال المستدامة وطويلة الأجل.' },

    // CTA
    'landing.cta.philosophy': { en: 'Partnership Philosophy', id: 'Filosofi Kemitraan', ar: 'فلسفة الشراكة' },
    'landing.cta.headline': { en: 'Companions in Transformation, Partners in Strategy.', id: 'Rekan dalam Transformasi, Mitra dalam Strategi.', ar: 'رفقاء في التحول، شركاء في الاستراتيجية.' },
    'landing.cta.subtitle': { en: 'Turn Challenges into a Competitive Edge. We are here to be your companion in digital transformation.', id: 'Ubah Tantangan menjadi Keunggulan Kompetitif. Kami di sini untuk menjadi rekan Anda dalam transformasi digital.', ar: 'حول التحديات إلى ميزة تنافسية. نحن هنا لنكون رفيقك في التحول الرقمي.' },
    'landing.cta.future': { en: 'The Future Won\'t Wait. Let\'s Define Your Winning Strategy.', id: 'Masa Depan Tidak Menunggu. Mari Tentukan Strategi Kemenangan Anda.', ar: 'المستقبل لن ينتظر. دعنا نحدد استراتيجيتك للفوز.' },
    'landing.cta.button': { en: 'Let\'s Talk', id: 'Mari Berdiskusi', ar: 'دعنا نتحدث' },
    'landing.cta.email': { en: 'partner@shifr.asia', id: 'partner@shifr.asia', ar: 'partner@shifr.asia' },
    'landing.cta.address': { en: 'i7 Creative Community Space, Bogor Tengah, Kota Bogor', id: 'i7 Creative Community Space, Bogor Tengah, Kota Bogor', ar: 'i7 Creative Community Space, Bogor Tengah, Kota Bogor' },

    // Ecosystem
    'landing.ecosystem.title': { en: 'Our Proprietary Products', id: 'Produk Proprietary Kami', ar: 'منتجاتنا الخاصة' },
    'landing.ecosystem.subtitle': { en: 'As a Venture Builder, we design, build, and scale our own digital platforms.', id: 'Sebagai Venture Builder, kami merancang, membangun, dan menskalakan platform digital kami sendiri.', ar: 'بصفتنا باني مشاريع، نقوم بتصميم وبناء وتوسيع منصاتنا الرقمية الخاصة.' },
    'landing.ecosystem.halalin.title': { en: 'Halalin.asia', id: 'Halalin.asia', ar: 'Halalin.asia' },
    'landing.ecosystem.halalin.label': { en: 'E-Commerce OS & Builder', id: 'E-Commerce OS & Builder', ar: 'نظام تشغيل ومنشئ التجارة الإلكترونية' },
    'landing.ecosystem.halalin.desc': { en: 'Empowering SMEs with a comprehensive, low-friction digital commerce ecosystem designed for local and regional scale.', id: 'Memberdayakan UMKM dengan ekosistem e-commerce digital yang komprehensif, rendah hambatan, dan dirancang untuk skala lokal dan regional.', ar: 'تمكين الشركات الصغيرة والمتوسطة بنظام تجارة إلكترونية شامل ومنخفض الاحتكاك مصمم للنطاق المحلي والإقليمي.' },
    'landing.ecosystem.bizup.title': { en: 'Bizup.id', id: 'Bizup.id', ar: 'Bizup.id' },
    'landing.ecosystem.bizup.label': { en: 'Professional Networking Platform', id: 'Platform Networking Profesional', ar: 'منصة التواصل المهني' },
    'landing.ecosystem.bizup.desc': { en: 'Redefining digital identity and business networking through smart, integrated NFC business cards and profile management.', id: 'Mendefinisikan ulang identitas digital dan networking bisnis melalui kartu nama NFC terintegrasi dan manajemen profil yang cerdas.', ar: 'إعادة تعريف الهوية الرقمية والشبكات التجارية من خلال بطاقات عمل NFC الذكية المتكاملة وإدارة الملف الشخصي.' },
    'landing.ecosystem.saakina.title': { en: 'Saakina.id', id: 'Saakina.id', ar: 'Saakina.id' },
    'landing.ecosystem.saakina.label': { en: 'Muslim Lifestyle Ecosystem', id: 'Ekosistem Lifestyle Muslim', ar: 'نظام نمط الحياة الإسلامي' },
    'landing.ecosystem.saakina.desc': { en: 'Integrated digital platform serving the Muslim community, from smart digital invitations to curated e-commerce experiences.', id: 'Platform digital terintegrasi yang melayani komunitas Muslim, dari undangan digital pintar hingga pengalaman e-commerce yang dikurasi.', ar: 'منصة رقمية متكاملة تخدم المجتمع الإسلامي، من الدعوات الرقمية الذكية إلى تجارب التجارة الإلكترونية المنسقة.' },

    // Footer
    'landing.footer.company': { en: 'PT Shifr Asia Inovasi', id: 'PT Shifr Asia Inovasi', ar: 'PT Shifr Asia Inovasi' },
    'landing.footer.tagline': { en: 'Shaping a Bolder Future', id: 'Shaping a Bolder Future', ar: 'تشكيل مستقبل أكثر جرأة' },
    'landing.footer.copyright': { en: '© 2024–2026 PT Shifr Asia Inovasi. All rights reserved.', id: '© 2024–2026 PT Shifr Asia Inovasi. Semua hak cipta dilindungi.', ar: '© ٢٠٢٤-٢٠٢٦ PT Shifr Asia Inovasi. جميع الحقوق محفوظة.' },
    'landing.footer.builtWith': { en: 'Built with ❤️ in Bogor, Indonesia', id: 'Dibuat dengan ❤️ di Bogor, Indonesia', ar: 'صُنع بـ ❤️ في بوغور، إندونيسيا' },
    'landing.footer.services': { en: 'Services', id: 'Layanan', ar: 'الخدمات' },
    'landing.footer.portfolio': { en: 'Portfolio', id: 'Portofolio', ar: 'محفظة الأعمال' },
    'landing.footer.about': { en: 'About', id: 'Tentang', ar: 'حول' },
    'landing.footer.contact': { en: 'Contact', id: 'Kontak', ar: 'اتصل بنا' }
};

// Helper function to get translation
export function t(key: string, locale: Locale = 'en'): string {
    const translation = translations[key];
    if (!translation) {
        console.warn(`Missing translation for key: ${key}`);
        return key;
    }
    return translation[locale] || translation.en || translation.id;
}
