'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, Variants, useAnimation } from "framer-motion";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

// Animation variants
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

// Animated Counter Component
const AnimatedCounter = ({ end, label }: { end: number, label: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start > end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [end]);

    return (
        <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold mb-2 text-white">{count}+</div>
            <div className="text-lg md:text-xl text-white/90">{label}</div>
        </div>
    );
};

export default function Home() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('industry');

    const portfolioTabs = [
        { id: 'industry', label: t('landing.portfolio.tab.industry') },
        { id: 'education', label: t('landing.portfolio.tab.education') },
        { id: 'ecommerce', label: t('landing.portfolio.tab.ecommerce') },
        { id: 'social', label: t('landing.portfolio.tab.social') },
        { id: 'ai', label: t('landing.portfolio.tab.ai') }
    ];

    return (
        <div className="min-h-screen bg-background overflow-x-hidden relative">
            {/* Global Decorative Pattern */}
            <div className="absolute inset-0 dot-pattern pointer-events-none z-0"></div>

            {/* Section 1: Navigation */}
            <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center"
                    >
                        <Link href="/">
                            <Image
                                src="/logo.png"
                                alt="Shifr Asia"
                                width={140}
                                height={45}
                                className="h-10 w-auto"
                                priority
                            />
                        </Link>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hidden lg:flex items-center gap-8"
                    >
                        <Link href="#services" className="text-foreground hover:text-main font-medium transition">{t('landing.nav.services')}</Link>
                        <Link href="#portfolio" className="text-foreground hover:text-main font-medium transition">{t('landing.nav.portfolio')}</Link>
                        <Link href="#about" className="text-foreground hover:text-main font-medium transition">{t('landing.nav.about')}</Link>
                        <Link href="#contact" className="text-foreground hover:text-main font-medium transition">{t('landing.nav.contact')}</Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-6"
                    >
                        <LanguageSwitcher variant="toggle" />
                    </motion.div>
                </div>
            </nav>

            {/* Section 2: Hero */}
            <section className="relative pt-24 pb-32 px-6 lg:pt-32 lg:pb-40 z-10 overflow-hidden">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="inline-block px-5 py-2 rounded-full border border-gray-200 bg-white/50 text-main font-semibold text-sm mb-8 shadow-sm">
                            {t('landing.hero.badge')}
                        </motion.div>
                        <motion.h1 
                            variants={fadeInUp} 
                            className="text-5xl md:text-7xl font-bold text-main mb-8 leading-tight font-[family-name:var(--font-ubuntu)]"
                        >
                            {t('landing.hero.title')}
                        </motion.h1>
                        <motion.p 
                            variants={fadeInUp} 
                            className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed"
                        >
                            {t('landing.hero.subtitle')}
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="#services" className="gradient-brand text-white px-8 py-4 rounded-xl font-semibold text-lg transition hover:shadow-lg hover:shadow-main/30 hover:-translate-y-1">
                                {t('landing.hero.cta1')}
                            </Link>
                            <Link href="#contact" className="bg-white border-2 border-gray-200 text-foreground px-8 py-4 rounded-xl font-semibold text-lg transition hover:border-main hover:text-main hover:-translate-y-1">
                                {t('landing.hero.cta2')}
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Section 3: About */}
            <section id="about" className="py-24 px-6 bg-[var(--color-teal-tint)] relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.h2 variants={fadeInUp} className="text-second font-semibold tracking-wider uppercase mb-4">
                            {t('landing.about.title')}
                        </motion.h2>
                        <motion.h3 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-main mb-8 font-[family-name:var(--font-ubuntu)]">
                            {t('landing.about.subtitle')}
                        </motion.h3>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-foreground leading-relaxed mb-6">
                            {t('landing.about.body')}
                        </motion.p>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-main font-semibold leading-relaxed">
                            {t('landing.about.synergy')}
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Section 4: Metrics Banner */}
            <section className="py-20 px-6 gradient-brand relative z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/20"
                    >
                        <AnimatedCounter end={25} label={t('landing.metrics.partnersLabel')} />
                        <AnimatedCounter end={100} label={t('landing.metrics.designsLabel')} />
                    </motion.div>
                </div>
            </section>

            {/* Section 5: Integrated Digital Services */}
            <section id="services" className="py-24 px-6 bg-white relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-main font-[family-name:var(--font-ubuntu)]">
                            {t('landing.services.title')}
                        </h2>
                    </motion.div>
                    
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            { icon: "🏗️", titleKey: 'landing.services.enterprise.title', descKey: 'landing.services.enterprise.desc' },
                            { icon: "📈", titleKey: 'landing.services.marketing.title', descKey: 'landing.services.marketing.desc' },
                            { icon: "🤝", titleKey: 'landing.services.transformation.title', descKey: 'landing.services.transformation.desc' }
                        ].map((service, idx) => (
                            <motion.div key={idx} variants={fadeInUp} className="card-cream p-10 rounded-3xl hover:shadow-xl transition-shadow duration-300">
                                <div className="text-5xl mb-6">{service.icon}</div>
                                <h3 className="text-2xl font-bold text-main mb-4">{t(service.titleKey)}</h3>
                                <p className="text-foreground leading-relaxed">{t(service.descKey)}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Section 6: Portfolio / Track Record */}
            <section id="portfolio" className="py-24 px-6 bg-[var(--color-fourth)] relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-main font-[family-name:var(--font-ubuntu)] mb-8">
                            {t('landing.portfolio.title')}
                        </h2>
                        
                        {/* Tabs */}
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {portfolioTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-3 rounded-full font-medium transition-all ${
                                        activeTab === tab.id 
                                        ? 'bg-main text-white shadow-md' 
                                        : 'bg-white text-text-secondary hover:bg-gray-50'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Tab Content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {activeTab === 'industry' && [
                            { tKey: 'landing.portfolio.prida' },
                            { tKey: 'landing.portfolio.pinara' },
                            { tKey: 'landing.portfolio.gaspro' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                                <h4 className="text-xl font-bold text-main mb-3">{t(`${item.tKey}.title`)}</h4>
                                <p className="text-text-secondary">{t(`${item.tKey}.desc`)}</p>
                            </div>
                        ))}

                        {activeTab === 'education' && [
                            { tKey: 'landing.portfolio.alfatih', desc: true },
                            { tKey: 'landing.portfolio.alfatihpilar', desc: false },
                            { tKey: 'landing.portfolio.asysyuuraa', desc: false },
                            { tKey: 'landing.portfolio.belajarsiroh', desc: false }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                                <h4 className="text-xl font-bold text-main mb-3">{t(`${item.tKey}.title`)}</h4>
                                {item.desc && <p className="text-text-secondary">{t(`${item.tKey}.desc`)}</p>}
                            </div>
                        ))}

                        {activeTab === 'ecommerce' && (
                            <>
                                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition md:col-span-2">
                                    <h4 className="text-xl font-bold text-main mb-3">{t('landing.portfolio.saakina.title')}</h4>
                                    <p className="text-text-secondary">{t('landing.portfolio.saakina.desc')}</p>
                                </div>
                                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                                    <h4 className="text-xl font-bold text-main mb-3">Branding Solutions</h4>
                                    <p className="text-text-secondary">{t('landing.portfolio.branding.desc')}</p>
                                </div>
                            </>
                        )}

                        {activeTab === 'social' && (
                            <>
                                <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition md:col-span-3">
                                    <p className="text-lg text-main font-medium mb-6">{t('landing.portfolio.social.desc')}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {['akademiquran', 'kpmidepok', 'saakinaid', 'asysyuuraabatam'].map((handle, i) => (
                                            <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <p className="font-semibold text-foreground">{t(`landing.portfolio.${handle}`)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'ai' && [
                            { tKey: 'landing.portfolio.iclean' },
                            { tKey: 'landing.portfolio.pulse' },
                            { tKey: 'landing.portfolio.nafsee' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                                <h4 className="text-xl font-bold text-main mb-3">{t(`${item.tKey}.title`)}</h4>
                                <p className="text-text-secondary">{t(`${item.tKey}.desc`)}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Section 7: Why Partner With Us */}
            <section className="py-24 px-6 bg-white relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-main font-[family-name:var(--font-ubuntu)]">
                            {t('landing.why.title')}
                        </h2>
                    </motion.div>

                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {[
                            { tKey: 'landing.why.datadriven' },
                            { tKey: 'landing.why.scalability' },
                            { tKey: 'landing.why.integrity' },
                            { tKey: 'landing.why.trackrecord' }
                        ].map((item, idx) => (
                            <motion.div key={idx} variants={fadeInUp} className="card-cream p-10 rounded-3xl flex gap-6">
                                <div className="w-12 h-12 bg-main/10 text-main rounded-2xl flex items-center justify-center text-xl font-bold shrink-0">
                                    {idx + 1}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-main mb-3">{t(`${item.tKey}.title`)}</h3>
                                    <p className="text-foreground leading-relaxed">{t(`${item.tKey}.desc`)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Section 8: Partnership Framework */}
            <section className="py-24 px-6 bg-[var(--color-fourth)] relative z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-main font-[family-name:var(--font-ubuntu)]">
                            {t('landing.framework.title')}
                        </h2>
                    </motion.div>

                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-4 gap-6"
                    >
                        {[
                            { tKey: 'landing.framework.discovery', icon: "🔍" },
                            { tKey: 'landing.framework.cocreation', icon: "💡" },
                            { tKey: 'landing.framework.agile', icon: "⚙️" },
                            { tKey: 'landing.framework.optimization', icon: "🚀" }
                        ].map((step, idx) => (
                            <motion.div key={idx} variants={fadeInUp} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative">
                                {idx < 3 && (
                                    <div className="hidden md:block absolute top-12 -right-4 w-8 h-[2px] bg-gray-200 z-10"></div>
                                )}
                                <div className="text-4xl mb-6">{step.icon}</div>
                                <h3 className="text-lg font-bold text-main mb-3">{t(`${step.tKey}.title`)}</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">{t(`${step.tKey}.desc`)}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Section 9: CTA / Contact */}
            <section id="contact" className="py-24 px-6 bg-white relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="card-cream p-12 md:p-16 rounded-[40px] text-center"
                    >
                        <div className="inline-block px-4 py-2 bg-main/10 text-main rounded-full text-sm font-semibold mb-8">
                            {t('landing.cta.philosophy')}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-main mb-6 font-[family-name:var(--font-ubuntu)] leading-tight">
                            {t('landing.cta.headline')}
                        </h2>
                        <p className="text-lg md:text-xl text-foreground mb-4">
                            {t('landing.cta.subtitle')}
                        </p>
                        <p className="text-lg md:text-xl font-semibold text-main mb-12">
                            {t('landing.cta.future')}
                        </p>

                        <div className="flex flex-col items-center gap-8">
                            <a href={`mailto:${t('landing.cta.email')}`} className="gradient-brand text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-xl hover:shadow-main/30 transition hover:-translate-y-1">
                                {t('landing.cta.button')}
                            </a>
                            
                            <div className="space-y-2 text-text-secondary">
                                <p className="flex items-center justify-center gap-2">
                                    <span className="text-xl">✉️</span> {t('landing.cta.email')}
                                </p>
                                <p className="flex items-center justify-center gap-2">
                                    <span className="text-xl">📍</span> {t('landing.cta.address')}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[var(--color-fourth)] py-12 px-6 border-t border-gray-200 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                        <div>
                            <Image src="/logo.png" alt="Shifr Asia" width={120} height={40} className="mb-2" />
                            <p className="text-text-secondary text-sm">{t('landing.footer.tagline')}</p>
                        </div>
                        <div className="flex gap-6 text-sm font-medium text-foreground">
                            <Link href="#services" className="hover:text-main transition">{t('landing.footer.services')}</Link>
                            <Link href="#portfolio" className="hover:text-main transition">{t('landing.footer.portfolio')}</Link>
                            <Link href="#about" className="hover:text-main transition">{t('landing.footer.about')}</Link>
                            <Link href="#contact" className="hover:text-main transition">{t('landing.footer.contact')}</Link>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
                        <p>{t('landing.footer.copyright')}</p>
                        <p>{t('landing.footer.builtWith')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
