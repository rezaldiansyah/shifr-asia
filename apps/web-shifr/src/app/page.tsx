'use client';

import Link from "next/link";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-fourth">
      {/* Navigation */}
      <nav className="bg-fifth border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-main font-[family-name:var(--font-ubuntu)]">
            Shifr Asia
          </h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="toggle" />
            <Link
              href="/login"
              className="text-gray-600 hover:text-main transition font-medium"
            >
              {t('auth.login')}
            </Link>
            <Link
              href="/register"
              className="bg-main hover:bg-main-hover text-white px-5 py-2 rounded-lg font-medium transition"
            >
              {t('cta.registerFree')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-ubuntu)] leading-tight">
            {t('landing.hero.title1')}
            <br />
            <span className="gradient-primary bg-clip-text text-transparent">
              {t('landing.hero.title2')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-main hover:bg-main-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg shadow-main/30"
            >
              {t('landing.hero.cta1')}
            </Link>
            <Link
              href="#features"
              className="bg-fifth hover:bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition border border-gray-200"
            >
              {t('landing.hero.cta2')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-fifth">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 font-[family-name:var(--font-ubuntu)]">
            {t('landing.features.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-fourth rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-main/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">{t('landing.features.catalog.title')}</h4>
              <p className="text-gray-600">{t('landing.features.catalog.desc')}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-fourth rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-second/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-second" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">{t('landing.features.whatsapp.title')}</h4>
              <p className="text-gray-600">{t('landing.features.whatsapp.desc')}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-fourth rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-third/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-third" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">{t('landing.features.payment.title')}</h4>
              <p className="text-gray-600">{t('landing.features.payment.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4 font-[family-name:var(--font-ubuntu)]">
            {t('landing.pricing.title')}
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {t('landing.pricing.subtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-fifth rounded-2xl p-8 border border-gray-200 hover:border-main/50 transition">
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">{t('landing.pricing.starter.name')}</h4>
              <p className="text-gray-500 text-sm mb-4">{t('landing.pricing.starter.desc')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Rp 35k</span>
                <span className="text-gray-500">{t('landing.pricing.perMonth')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('landing.pricing.products').replace('{count}', '5')}
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('landing.pricing.whatsapp')}
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('landing.pricing.subdomain')}
                </li>
                <li className="flex items-center text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {t('landing.pricing.customDomain')}
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition"
              >
                {t('landing.pricing.startNow')}
              </Link>
            </div>

            {/* Growth Plan - Popular */}
            <div className="bg-fifth rounded-2xl p-8 border-2 border-main relative shadow-lg shadow-main/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-main text-white text-sm font-medium px-4 py-1 rounded-full">
                {t('landing.pricing.popular')}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">{t('landing.pricing.growth.name')}</h4>
              <p className="text-gray-500 text-sm mb-4">{t('landing.pricing.growth.desc')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-main">Rp 89k</span>
                <span className="text-gray-500">{t('landing.pricing.perMonth')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('landing.pricing.products').replace('{count}', '50')}
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('landing.pricing.whatsapp')}
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('landing.pricing.customDomain')}
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('landing.pricing.paymentGateway')}
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-main hover:bg-main-hover text-white py-3 rounded-xl font-semibold transition"
              >
                {t('landing.pricing.startNow')}
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-fifth rounded-2xl p-8 border border-gray-200 hover:border-main/50 transition">
              <h4 className="text-xl font-bold text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">{t('landing.pricing.pro.name')}</h4>
              <p className="text-gray-500 text-sm mb-4">{t('landing.pricing.pro.desc')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Rp 199k</span>
                <span className="text-gray-500">{t('landing.pricing.perMonth')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('landing.pricing.products').replace('{count}', '500')}
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('landing.pricing.allGrowth')}
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('landing.pricing.prioritySupport')}
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-main mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t('landing.pricing.analytics')}
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition"
              >
                {t('landing.pricing.startNow')}
              </Link>
            </div>
          </div>

          {/* Free Trial Note */}
          <p className="text-center text-gray-500 mt-8">
            {t('landing.pricing.freeNote')}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-fifth">
        <div className="max-w-4xl mx-auto gradient-primary rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4 font-[family-name:var(--font-ubuntu)]">
            {t('landing.cta.title')}
          </h3>
          <p className="text-lg opacity-90 mb-8">
            {t('landing.cta.subtitle')}
          </p>
          <Link
            href="/register"
            className="bg-fifth text-main hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition inline-block"
          >
            {t('landing.cta.button')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-fifth border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500">
          <p className="font-[family-name:var(--font-ubuntu)] text-main font-bold mb-2">Shifr Asia</p>
          <p className="text-sm">{t('landing.footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
