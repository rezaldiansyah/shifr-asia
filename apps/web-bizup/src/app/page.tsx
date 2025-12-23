import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #374da0 0%, #2cbbbc 100%)' }}>
        {/* Nav */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">bizup.id</h1>
            <div className="flex gap-4">
              <Link href="/login" className="px-4 py-2 text-white/90 hover:text-white transition">
                Masuk
              </Link>
              <Link href="/register" className="px-4 py-2 bg-white text-[#374da0] rounded-lg font-medium hover:bg-white/90 transition">
                Daftar Gratis
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Kartu Bisnis Digital<br />
            <span className="text-white/80">untuk Profesional Modern</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Bagikan informasi kontak, social media, dan portfolio Anda dengan satu link atau QR code. Praktis, profesional, dan mudah diingat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-[#374da0] rounded-xl font-semibold text-lg hover:bg-white/90 transition shadow-lg"
            >
              Buat Kartu Gratis →
            </Link>
            <Link
              href="#fitur"
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition"
            >
              Lihat Fitur
            </Link>
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>
      </section>

      {/* Features */}
      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">Semua yang Anda Butuhkan</h3>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-16">
            Fitur lengkap untuk membangun personal branding profesional Anda
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#374da0] to-[#2cbbbc] flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Profil Profesional</h4>
              <p className="text-gray-500">
                Tampilkan nama, foto, jabatan, bio, dan informasi kontak dalam desain yang elegan
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#374da0] to-[#2cbbbc] flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">QR Code</h4>
              <p className="text-gray-500">
                Cetak QR code untuk kartu fisik, name tag, atau presentasi. Scan langsung ke profil Anda
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#374da0] to-[#2cbbbc] flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Download vCard</h4>
              <p className="text-gray-500">
                Pengunjung bisa langsung simpan kontak Anda ke HP mereka dengan satu klik
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#374da0] to-[#2cbbbc] flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Social Links</h4>
              <p className="text-gray-500">
                Hubungkan semua social media Anda: Instagram, LinkedIn, TikTok, WhatsApp, dan lainnya
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#374da0] to-[#2cbbbc] flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Analytics</h4>
              <p className="text-gray-500">
                Pantau berapa kali kartu Anda dilihat dan track engagement dari profile Anda
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#374da0] to-[#2cbbbc] flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Mobile First</h4>
              <p className="text-gray-500">
                Tampilan responsif yang sempurna di semua device: HP, tablet, atau desktop
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">Harga Terjangkau</h3>
          <p className="text-gray-500 text-center max-w-2xl mx-auto mb-16">
            Mulai gratis, upgrade kapan saja
          </p>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border-2 border-[#374da0]">
              <span className="inline-block px-4 py-1 bg-[#374da0] text-white text-sm font-medium rounded-full mb-6">
                Penawaran Spesial
              </span>
              <p className="text-5xl font-bold text-gray-900 mb-2">
                Rp 89k
                <span className="text-lg text-gray-500 font-normal">/tahun</span>
              </p>
              <p className="text-gray-500 mb-8">Hanya Rp 7.400/bulan</p>

              <ul className="text-left space-y-4 mb-8">
                {[
                  'Profil profesional unlimited',
                  'Custom URL (bizup.id/nama-anda)',
                  'QR Code generator',
                  'vCard download',
                  'Social media links',
                  'Analytics & statistik',
                  'Support via WhatsApp',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="block w-full py-4 rounded-xl font-semibold text-white transition"
                style={{ background: 'linear-gradient(135deg, #374da0 0%, #2cbbbc 100%)' }}
              >
                Mulai Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #374da0 0%, #2cbbbc 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Upgrade Personal Branding Anda?
          </h3>
          <p className="text-xl text-white/80 mb-10">
            Bergabung dengan ribuan profesional yang sudah menggunakan Bizup.id
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-[#374da0] rounded-xl font-semibold text-lg hover:bg-white/90 transition shadow-lg"
          >
            Buat Kartu Bisnis Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h4 className="text-2xl font-bold text-white mb-2">bizup.id</h4>
              <p className="text-gray-400">Digital Business Card untuk Profesional Modern</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition">Tentang</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Bantuan</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Kontak</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            © 2024 Bizup.id by Shifr Asia. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
