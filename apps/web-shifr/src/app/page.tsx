'use client';

import Link from "next/link";
import { useState } from "react";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-fourth">
      {/* Navigation */}
      <nav className="bg-fifth border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-main font-[family-name:var(--font-ubuntu)]">
            Shifr Asia
          </h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="toggle" />
            <Link
              href="/login"
              className="text-gray-600 hover:text-main transition font-medium hidden sm:block"
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

      {/* Section 1: Hero (Problem Hook) */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-main/10 text-main px-4 py-2 rounded-full text-sm font-medium mb-6">
            {t('landing.hero.badge')}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-ubuntu)] leading-tight">
            {t('landing.hero.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-main hover:bg-main-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg shadow-main/30"
            >
              {t('landing.hero.cta1')} →
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

      {/* Section 2: Pain Points (Agitate) */}
      <section className="py-16 px-6 bg-fifth">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 font-[family-name:var(--font-ubuntu)]">
            {t('landing.pain.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pain 1 */}
            <div className="bg-fourth rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('landing.pain.chat.title')}</h4>
                  <p className="text-gray-600">{t('landing.pain.chat.desc')}</p>
                </div>
              </div>
            </div>
            {/* Pain 2 */}
            <div className="bg-fourth rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💸</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('landing.pain.fee.title')}</h4>
                  <p className="text-gray-600">{t('landing.pain.fee.desc')}</p>
                </div>
              </div>
            </div>
            {/* Pain 3 */}
            <div className="bg-fourth rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">😕</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('landing.pain.pro.title')}</h4>
                  <p className="text-gray-600">{t('landing.pain.pro.desc')}</p>
                </div>
              </div>
            </div>
            {/* Pain 4 */}
            <div className="bg-fourth rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⏰</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('landing.pain.manual.title')}</h4>
                  <p className="text-gray-600">{t('landing.pain.manual.desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Before-After (Transformation) */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 font-[family-name:var(--font-ubuntu)]">
            {t('landing.transform.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Before Column */}
            <div className="bg-red-50 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-red-700 mb-4 text-center">{t('landing.transform.before')}</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-red-700">
                  <span className="text-lg">❌</span>
                  {t('landing.transform.item1.before')}
                </li>
                <li className="flex items-center gap-3 text-red-700">
                  <span className="text-lg">❌</span>
                  {t('landing.transform.item2.before')}
                </li>
                <li className="flex items-center gap-3 text-red-700">
                  <span className="text-lg">❌</span>
                  {t('landing.transform.item3.before')}
                </li>
                <li className="flex items-center gap-3 text-red-700">
                  <span className="text-lg">❌</span>
                  {t('landing.transform.item4.before')}
                </li>
              </ul>
            </div>
            {/* After Column */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-green-700 mb-4 text-center">{t('landing.transform.after')}</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-green-700">
                  <span className="text-lg">✅</span>
                  {t('landing.transform.item1.after')}
                </li>
                <li className="flex items-center gap-3 text-green-700">
                  <span className="text-lg">✅</span>
                  {t('landing.transform.item2.after')}
                </li>
                <li className="flex items-center gap-3 text-green-700">
                  <span className="text-lg">✅</span>
                  {t('landing.transform.item3.after')}
                </li>
                <li className="flex items-center gap-3 text-green-700">
                  <span className="text-lg">✅</span>
                  {t('landing.transform.item4.after')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Solution (Features) */}
      <section id="features" className="py-16 px-6 bg-fifth">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">
            {t('landing.solution.title')}
          </h3>
          <p className="text-center text-gray-600 mb-12">{t('landing.solution.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="bg-fourth rounded-2xl p-6 text-center hover:shadow-lg transition">
              <div className="w-14 h-14 bg-main/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🚀</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.solution.store.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.solution.store.desc')}</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-fourth rounded-2xl p-6 text-center hover:shadow-lg transition">
              <div className="w-14 h-14 bg-second/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">💬</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.solution.wa.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.solution.wa.desc')}</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-fourth rounded-2xl p-6 text-center hover:shadow-lg transition">
              <div className="w-14 h-14 bg-third/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🌐</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.solution.domain.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.solution.domain.desc')}</p>
            </div>
            {/* Feature 4 */}
            <div className="bg-fourth rounded-2xl p-6 text-center hover:shadow-lg transition">
              <div className="w-14 h-14 bg-main/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">📊</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.solution.dashboard.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.solution.dashboard.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Other Services */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 font-[family-name:var(--font-ubuntu)]">
            {t('landing.services.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 - Store */}
            <div className="bg-fifth border-2 border-main rounded-2xl p-6 relative">
              <span className="absolute -top-3 right-4 bg-main text-white text-xs px-3 py-1 rounded-full">{t('landing.services.active')}</span>
              <div className="text-4xl mb-4">🛒</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.services.store.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.services.store.desc')}</p>
            </div>
            {/* Service 2 - Card */}
            <div className="bg-fifth border-2 border-main rounded-2xl p-6 relative">
              <span className="absolute -top-3 right-4 bg-main text-white text-xs px-3 py-1 rounded-full">{t('landing.services.active')}</span>
              <div className="text-4xl mb-4">💼</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.services.card.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.services.card.desc')}</p>
            </div>
            {/* Service 3 - Academy */}
            <div className="bg-fifth border border-gray-200 rounded-2xl p-6 relative opacity-75">
              <span className="absolute -top-3 right-4 bg-gray-400 text-white text-xs px-3 py-1 rounded-full">{t('landing.services.soon')}</span>
              <div className="text-4xl mb-4">📚</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.services.academy.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.services.academy.desc')}</p>
            </div>
            {/* Service 4 - Marketing */}
            <div className="bg-fifth border border-gray-200 rounded-2xl p-6 relative opacity-75">
              <span className="absolute -top-3 right-4 bg-gray-400 text-white text-xs px-3 py-1 rounded-full">{t('landing.services.soon')}</span>
              <div className="text-4xl mb-4">📈</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.services.marketing.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.services.marketing.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Social Proof */}
      <section className="py-8 px-6 bg-main/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl font-medium text-main">{t('landing.social.text')}</p>
        </div>
      </section>

      {/* Section 7: Pricing */}
      <section id="pricing" className="py-16 px-6 bg-fifth">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">
            {t('landing.pricing.title')}
          </h3>
          <p className="text-center text-gray-600 mb-12">{t('landing.pricing.subtitle')}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-fourth rounded-2xl p-8 border border-gray-200 hover:border-main/50 transition">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{t('landing.pricing.starter.name')}</h4>
              <p className="text-gray-500 text-sm mb-4">{t('landing.pricing.starter.desc')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Rp 35k</span>
                <span className="text-gray-500">{t('landing.pricing.perMonth')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600 text-sm">
                  <span className="text-main mr-2">✓</span>
                  {t('landing.pricing.products').replace('{count}', '9')}
                </li>
                <li className="flex items-center text-gray-600 text-sm">
                  <span className="text-main mr-2">✓</span>
                  {t('landing.pricing.whatsapp')}
                </li>
                <li className="flex items-center text-gray-600 text-sm">
                  <span className="text-main mr-2">✓</span>
                  {t('landing.pricing.subdomain')}
                </li>
                <li className="flex items-center text-gray-400 text-sm">
                  <span className="mr-2">✗</span>
                  {t('landing.pricing.customDomain')}
                </li>
              </ul>
              <Link href="/register" className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition">
                {t('landing.pricing.startNow')}
              </Link>
            </div>

            {/* Growth Plan */}
            <div className="bg-fourth rounded-2xl p-8 border-2 border-main relative shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-main text-white text-sm font-medium px-4 py-1 rounded-full">
                {t('landing.pricing.popular')}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{t('landing.pricing.growth.name')}</h4>
              <p className="text-gray-500 text-sm mb-4">{t('landing.pricing.growth.desc')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-main">Rp 89k</span>
                <span className="text-gray-500">{t('landing.pricing.perMonth')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600 text-sm">
                  <span className="text-main mr-2">✓</span>
                  {t('landing.pricing.products').replace('{count}', '50')}
                </li>
                <li className="flex items-center text-gray-600 text-sm">
                  <span className="text-main mr-2">✓</span>
                  {t('landing.pricing.whatsapp')}
                </li>
                <li className="flex items-center text-gray-600 text-sm">
                  <span className="text-main mr-2">✓</span>
                  {t('landing.pricing.customDomain')}
                </li>
                <li className="flex items-center text-gray-600 text-sm">
                  <span className="text-main mr-2">✓</span>
                  {t('landing.pricing.paymentGateway')}
                </li>
              </ul>
              <Link href="/register" className="block w-full text-center bg-main hover:bg-main-hover text-white py-3 rounded-xl font-semibold transition">
                {t('landing.pricing.startNow')}
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-fourth rounded-2xl p-8 border border-gray-200 hover:border-main/50 transition">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{t('landing.pricing.pro.name')}</h4>
              <p className="text-gray-500 text-sm mb-4">{t('landing.pricing.pro.desc')}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Rp 199k</span>
                <span className="text-gray-500">{t('landing.pricing.perMonth')}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600 text-sm">
                  <span className="text-main mr-2">✓</span>
                  {t('landing.pricing.products').replace('{count}', '500')}
                </li>
                <li className="flex items-center text-gray-600 text-sm">
                  <span className="text-main mr-2">✓</span>
                  {t('landing.pricing.allGrowth')}
                </li>
                <li className="flex items-center text-gray-600 text-sm">
                  <span className="text-main mr-2">✓</span>
                  {t('landing.pricing.prioritySupport')}
                </li>
                <li className="flex items-center text-gray-600 text-sm">
                  <span className="text-main mr-2">✓</span>
                  {t('landing.pricing.analytics')}
                </li>
              </ul>
              <Link href="/register" className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition">
                {t('landing.pricing.startNow')}
              </Link>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-8">{t('landing.pricing.freeNote')}</p>
        </div>
      </section>

      {/* Section 8: FAQ */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12 font-[family-name:var(--font-ubuntu)]">
            {t('landing.faq.title')}
          </h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-fifth rounded-xl border border-gray-200">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-gray-900">{t(`landing.faq.q${i}`)}</span>
                  <span className={`text-main transition-transform ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600">
                    {t(`landing.faq.a${i}`)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="py-16 px-6 bg-fifth">
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
