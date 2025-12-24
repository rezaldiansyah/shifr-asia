import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-fourth">
      {/* Navigation */}
      <nav className="bg-fifth border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-main font-[family-name:var(--font-ubuntu)]">
            Shifr Asia
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-main transition font-medium"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="bg-main hover:bg-main-hover text-white px-5 py-2 rounded-lg font-medium transition"
            >
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-ubuntu)] leading-tight">
            Jualan Lebih Mudah,
            <br />
            <span className="gradient-primary bg-clip-text text-transparent">
              Lebih Profesional
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Platform e-commerce yang membantu UMKM Indonesia untuk scale bisnis dengan mudah, profesional, dan penuh amanah.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-main hover:bg-main-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg shadow-main/30"
            >
              Mulai Gratis Sekarang
            </Link>
            <Link
              href="#features"
              className="bg-fifth hover:bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition border border-gray-200"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-fifth">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 font-[family-name:var(--font-ubuntu)]">
            Fitur Unggulan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-fourth rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-main/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">Katalog Produk</h4>
              <p className="text-gray-600">Upload produk dengan mudah. Lengkap dengan variant ukuran dan warna.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-fourth rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-second/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-second" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">WhatsApp Checkout</h4>
              <p className="text-gray-600">Order otomatis ke WhatsApp. Tidak perlu sistem cart yang rumit.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-fourth rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-third/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-third" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">Payment Gateway</h4>
              <p className="text-gray-600">Terima pembayaran via QRIS, VA Bank, dan E-wallet dengan mudah.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4 font-[family-name:var(--font-ubuntu)]">
            Paket Harga
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan bisnis Anda. Mulai gratis, upgrade kapan saja.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-fifth rounded-2xl p-8 border border-gray-200 hover:border-main/50 transition">
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">Starter</h4>
              <p className="text-gray-500 text-sm mb-4">Untuk memulai bisnis online</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Rp 35k</span>
                <span className="text-gray-500">/bulan</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Hingga 5 produk
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  WhatsApp checkout
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Subdomain gratis
                </li>
                <li className="flex items-center text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Custom domain
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition"
              >
                Mulai Sekarang
              </Link>
            </div>

            {/* Growth Plan - Popular */}
            <div className="bg-fifth rounded-2xl p-8 border-2 border-main relative shadow-lg shadow-main/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-main text-white text-sm font-medium px-4 py-1 rounded-full">
                Populer
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">Growth</h4>
              <p className="text-gray-500 text-sm mb-4">Untuk bisnis yang berkembang</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-main">Rp 89k</span>
                <span className="text-gray-500">/bulan</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Hingga 50 produk
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  WhatsApp checkout
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom domain
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Payment gateway
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-main hover:bg-main-hover text-white py-3 rounded-xl font-semibold transition"
              >
                Mulai Sekarang
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-fifth rounded-2xl p-8 border border-gray-200 hover:border-main/50 transition">
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">Pro</h4>
              <p className="text-gray-500 text-sm mb-4">Untuk bisnis profesional</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Rp 199k</span>
                <span className="text-gray-500">/bulan</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Hingga 500 produk
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Semua fitur Growth
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Analytics dashboard
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition"
              >
                Mulai Sekarang
              </Link>
            </div>
          </div>

          {/* Free Trial Note */}
          <p className="text-center text-gray-500 mt-8">
            🎉 <span className="font-medium text-main">Gratis 3 bulan pertama</span> untuk semua paket. Tanpa kartu kredit.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-fifth">
        <div className="max-w-4xl mx-auto gradient-primary rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4 font-[family-name:var(--font-ubuntu)]">
            Siap Memulai Bisnis Online?
          </h3>
          <p className="text-lg opacity-90 mb-8">
            Bergabung dengan ribuan UMKM yang sudah menggunakan Shifr Asia
          </p>
          <Link
            href="/register"
            className="bg-fifth text-main hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition inline-block"
          >
            Daftar Gratis 3 Bulan
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-fifth border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p className="font-[family-name:var(--font-ubuntu)] text-main font-bold mb-2">Shifr Asia</p>
          <p className="text-sm">© 2024 Shifr Asia. Semua hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
