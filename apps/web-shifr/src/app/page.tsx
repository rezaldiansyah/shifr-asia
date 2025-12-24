'use client';

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const scaleOnHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

export default function Home() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-fourth overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-fifth/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-main font-[family-name:var(--font-ubuntu)]"
          >
            Shifr Asia
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <LanguageSwitcher variant="toggle" />
            <Link
              href="/login"
              className="text-gray-600 hover:text-main transition font-medium hidden sm:block"
            >
              {t('auth.login')}
            </Link>
            <Link
              href="/register"
              className="bg-main hover:bg-main-hover text-white px-5 py-2 rounded-lg font-medium transition hover:scale-105"
            >
              {t('cta.registerFree')}
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Section 1: Hero (Problem Hook) */}
      <section className="py-16 md:py-24 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block bg-main/10 text-main px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            {t('landing.hero.badge')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-ubuntu)] leading-tight"
          >
            {t('landing.hero.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            {t('landing.hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/register"
              className="bg-main hover:bg-main-hover text-white px-8 py-4 rounded-xl font-semibold text-lg transition shadow-lg shadow-main/30 hover:shadow-xl hover:shadow-main/40 hover:-translate-y-1"
            >
              {t('landing.hero.cta1')} →
            </Link>
            <Link
              href="#features"
              className="bg-fifth hover:bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition border border-gray-200 hover:-translate-y-1"
            >
              {t('landing.hero.cta2')}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: Pain Points (Agitate) */}
      <section className="py-16 px-6 bg-fifth">
        <div className="max-w-6xl mx-auto">
          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl font-bold text-center text-gray-900 mb-12 font-[family-name:var(--font-ubuntu)]"
          >
            {t('landing.pain.title')}
          </motion.h3>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Pain 1 */}
            <motion.div variants={fadeInUp} whileHover={scaleOnHover} className="bg-fourth rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('landing.pain.chat.title')}</h4>
                  <p className="text-gray-600">{t('landing.pain.chat.desc')}</p>
                </div>
              </div>
            </motion.div>
            {/* Pain 2 */}
            <motion.div variants={fadeInUp} whileHover={scaleOnHover} className="bg-fourth rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💸</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('landing.pain.fee.title')}</h4>
                  <p className="text-gray-600">{t('landing.pain.fee.desc')}</p>
                </div>
              </div>
            </motion.div>
            {/* Pain 3 */}
            <motion.div variants={fadeInUp} whileHover={scaleOnHover} className="bg-fourth rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">😕</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('landing.pain.pro.title')}</h4>
                  <p className="text-gray-600">{t('landing.pain.pro.desc')}</p>
                </div>
              </div>
            </motion.div>
            {/* Pain 4 */}
            <motion.div variants={fadeInUp} whileHover={scaleOnHover} className="bg-fourth rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition cursor-default">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⏰</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{t('landing.pain.manual.title')}</h4>
                  <p className="text-gray-600">{t('landing.pain.manual.desc')}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Before-After (Transformation) */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl font-bold text-center text-gray-900 mb-12 font-[family-name:var(--font-ubuntu)]"
          >
            {t('landing.transform.title')}
          </motion.h3>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Before Column */}
            <motion.div variants={fadeInUp} className="bg-red-50 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-red-700 mb-4 text-center">{t('landing.transform.before')}</h4>
              <ul className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-red-700"
                  >
                    <span className="text-lg">❌</span>
                    {t(`landing.transform.item${i}.before`)}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            {/* After Column */}
            <motion.div variants={fadeInUp} className="bg-green-50 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-green-700 mb-4 text-center">{t('landing.transform.after')}</h4>
              <ul className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-green-700"
                  >
                    <span className="text-lg">✅</span>
                    {t(`landing.transform.item${i}.after`)}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: Solution (Features) */}
      <section id="features" className="py-16 px-6 bg-fifth">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">
              {t('landing.solution.title')}
            </h3>
            <p className="text-center text-gray-600 mb-12">{t('landing.solution.subtitle')}</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Feature 1 */}
            <motion.div variants={fadeInUp} whileHover={{ y: -8, transition: { duration: 0.2 } }} className="bg-fourth rounded-2xl p-6 text-center hover:shadow-xl transition">
              <div className="w-14 h-14 bg-main/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🚀</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.solution.store.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.solution.store.desc')}</p>
            </motion.div>
            {/* Feature 2 */}
            <motion.div variants={fadeInUp} whileHover={{ y: -8, transition: { duration: 0.2 } }} className="bg-fourth rounded-2xl p-6 text-center hover:shadow-xl transition">
              <div className="w-14 h-14 bg-second/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">💬</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.solution.wa.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.solution.wa.desc')}</p>
            </motion.div>
            {/* Feature 3 */}
            <motion.div variants={fadeInUp} whileHover={{ y: -8, transition: { duration: 0.2 } }} className="bg-fourth rounded-2xl p-6 text-center hover:shadow-xl transition">
              <div className="w-14 h-14 bg-third/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🌐</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.solution.domain.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.solution.domain.desc')}</p>
            </motion.div>
            {/* Feature 4 */}
            <motion.div variants={fadeInUp} whileHover={{ y: -8, transition: { duration: 0.2 } }} className="bg-fourth rounded-2xl p-6 text-center hover:shadow-xl transition">
              <div className="w-14 h-14 bg-main/10 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">📊</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.solution.dashboard.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.solution.dashboard.desc')}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 5: Other Services */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl font-bold text-center text-gray-900 mb-12 font-[family-name:var(--font-ubuntu)]"
          >
            {t('landing.services.title')}
          </motion.h3>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Service 1 - Store */}
            <motion.div variants={fadeInUp} whileHover={{ y: -8 }} className="bg-fifth border-2 border-main rounded-2xl p-6 relative hover:shadow-lg transition">
              <span className="absolute -top-3 right-4 bg-main text-white text-xs px-3 py-1 rounded-full">{t('landing.services.active')}</span>
              <div className="text-4xl mb-4">🛒</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.services.store.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.services.store.desc')}</p>
            </motion.div>
            {/* Service 2 - Card */}
            <motion.div variants={fadeInUp} whileHover={{ y: -8 }} className="bg-fifth border-2 border-main rounded-2xl p-6 relative hover:shadow-lg transition">
              <span className="absolute -top-3 right-4 bg-main text-white text-xs px-3 py-1 rounded-full">{t('landing.services.active')}</span>
              <div className="text-4xl mb-4">💼</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.services.card.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.services.card.desc')}</p>
            </motion.div>
            {/* Service 3 - Academy */}
            <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="bg-fifth border border-gray-200 rounded-2xl p-6 relative opacity-75 hover:opacity-90 transition">
              <span className="absolute -top-3 right-4 bg-gray-400 text-white text-xs px-3 py-1 rounded-full">{t('landing.services.soon')}</span>
              <div className="text-4xl mb-4">📚</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.services.academy.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.services.academy.desc')}</p>
            </motion.div>
            {/* Service 4 - Marketing */}
            <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="bg-fifth border border-gray-200 rounded-2xl p-6 relative opacity-75 hover:opacity-90 transition">
              <span className="absolute -top-3 right-4 bg-gray-400 text-white text-xs px-3 py-1 rounded-full">{t('landing.services.soon')}</span>
              <div className="text-4xl mb-4">📈</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('landing.services.marketing.title')}</h4>
              <p className="text-gray-600 text-sm">{t('landing.services.marketing.desc')}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 6: Social Proof */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="py-8 px-6 bg-main/5"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl font-medium text-main">{t('landing.social.text')}</p>
        </div>
      </motion.section>

      {/* Section 7: Pricing */}
      <section id="pricing" className="py-16 px-6 bg-fifth">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-2 font-[family-name:var(--font-ubuntu)]">
              {t('landing.pricing.title')}
            </h3>
            <p className="text-center text-gray-600 mb-12">{t('landing.pricing.subtitle')}</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Starter Plan */}
            <motion.div variants={fadeInUp} whileHover={{ y: -8 }} className="bg-fourth rounded-2xl p-8 border border-gray-200 hover:border-main/50 hover:shadow-lg transition">
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
              <Link href="/register" className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition hover:scale-105">
                {t('landing.pricing.startNow')}
              </Link>
            </motion.div>

            {/* Growth Plan */}
            <motion.div variants={fadeInUp} whileHover={{ y: -8 }} className="bg-fourth rounded-2xl p-8 border-2 border-main relative shadow-lg hover:shadow-xl transition">
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
              <Link href="/register" className="block w-full text-center bg-main hover:bg-main-hover text-white py-3 rounded-xl font-semibold transition hover:scale-105">
                {t('landing.pricing.startNow')}
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div variants={fadeInUp} whileHover={{ y: -8 }} className="bg-fourth rounded-2xl p-8 border border-gray-200 hover:border-main/50 hover:shadow-lg transition">
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
              <Link href="/register" className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition hover:scale-105">
                {t('landing.pricing.startNow')}
              </Link>
            </motion.div>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center text-gray-500 mt-8"
          >
            {t('landing.pricing.freeNote')}
          </motion.p>
        </div>
      </section>

      {/* Section 8: FAQ */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl font-bold text-center text-gray-900 mb-12 font-[family-name:var(--font-ubuntu)]"
          >
            {t('landing.faq.title')}
          </motion.h3>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-fifth rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-gray-900">{t(`landing.faq.q${i}`)}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    className="text-main"
                  >
                    ▼
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === i ? "auto" : 0,
                    opacity: openFaq === i ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-gray-600">
                    {t(`landing.faq.a${i}`)}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="py-16 px-6 bg-fifth">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto gradient-primary rounded-3xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4 font-[family-name:var(--font-ubuntu)]">
            {t('landing.cta.title')}
          </h3>
          <p className="text-lg opacity-90 mb-8">
            {t('landing.cta.subtitle')}
          </p>
          <Link
            href="/register"
            className="bg-fifth text-main hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition inline-block hover:scale-105 hover:shadow-lg"
          >
            {t('landing.cta.button')}
          </Link>
        </motion.div>
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
