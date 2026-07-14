'use client';

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { content, t, tArr, Locale } from "./content";

// ─── Animation Variants ─────────────────────────────────────────
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// ─── Inline SVG Icons ────────────────────────────────────────────
const Icons = {
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  alertTriangle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  command: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  ),
  bookOpen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  userCheck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  graduationCap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 0 3 3 6 3s6-3 6-3v-5" />
    </svg>
  ),
  wrench: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  server: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  mapPin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  network: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <path d="M12 8v4" /><path d="M5 16v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  dollarSign: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  repeat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  checkCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

// ─── Section Wrapper ─────────────────────────────────────────────
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      className={`py-20 md:py-28 px-6 ${className}`}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </motion.section>
  );
}

// ─── Section Header ──────────────────────────────────────────────
function SectionHeader({
  title,
  subtitle,
  light = false,
}: {
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <motion.div variants={fadeInUp} className="mb-14">
      <h2
        className={`text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight font-[family-name:var(--font-ubuntu)] ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-lg md:text-xl leading-relaxed max-w-3xl ${
            light ? "text-white/80" : "text-slate-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════
export default function EducationProposal({ locale = "en" }: { locale?: Locale }) {
  const dir = content.dir[locale];
  
  return (
    <div className="min-h-screen bg-white overflow-x-hidden" dir={dir}>
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — COVER PAGE / HERO
       ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden bg-slate-950">
        {/* Background decorations */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-[#374da0]/40" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2cbbbc]/8 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#374da0]/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute top-0 left-0 right-0 z-20 px-6 py-6"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Image src="/logo.png" alt="Shifr Asia" width={130} height={42} className="h-9 w-auto brightness-0 invert" priority />
            <div className="hidden md:flex items-center gap-2 text-white/50 text-sm">
              <span className="w-2 h-2 rounded-full bg-[#2cbbbc] animate-pulse" />
              {t(content.hero.confidential, locale)}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto w-full pt-28 pb-20">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-block px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-[#2cbbbc] font-semibold text-sm tracking-wide">
                {t(content.hero.badge, locale)}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] font-[family-name:var(--font-ubuntu)] mb-6"
            >
              {t(content.hero.titleLine1, locale)}{" "}
              <span className="bg-gradient-to-r from-[#2cbbbc] to-[#4dd8d8] bg-clip-text text-transparent">
                {t(content.hero.titleHighlight, locale)}
              </span>
              <br />
              <span className="text-white/90">{t(content.hero.titleLine2, locale)}</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
            >
              {t(content.hero.subtitle, locale)}
            </motion.p>

            <motion.div variants={fadeInUp} className="h-px w-full max-w-xl bg-gradient-to-r from-[#2cbbbc]/50 via-white/20 to-transparent mb-12" />

            {/* Executive Summary */}
            <motion.div variants={fadeInUp} className="max-w-3xl">
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#2cbbbc] mb-5">
                {t(content.hero.execSummaryLabel, locale)}
              </h2>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-5">
                {t(content.hero.execSummaryP1, locale)}
              </p>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                {t(content.hero.execSummaryP2, locale)}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-xs tracking-widest uppercase">{t(content.hero.scroll, locale)}</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — UNDERSTANDING YOUR NEEDS
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-50">
        <SectionHeader
          title={t(content.needs.title, locale)}
          subtitle={t(content.needs.subtitle, locale)}
        />

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Icons.database,
              title: t(content.needs.items[0].title, locale),
              desc: t(content.needs.items[0].desc, locale),
              accent: "border-red-400",
              iconBg: "bg-red-50 text-red-500",
            },
            {
              icon: Icons.users,
              title: t(content.needs.items[1].title, locale),
              desc: t(content.needs.items[1].desc, locale),
              accent: "border-amber-400",
              iconBg: "bg-amber-50 text-amber-600",
            },
            {
              icon: Icons.alertTriangle,
              title: t(content.needs.items[2].title, locale),
              desc: t(content.needs.items[2].desc, locale),
              accent: "border-slate-400",
              iconBg: "bg-slate-100 text-slate-600",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className={`bg-white rounded-2xl p-8 border-t-4 ${item.accent} shadow-sm hover:shadow-lg transition-shadow duration-300`}
            >
              <div className={`w-14 h-14 rounded-xl ${item.iconBg} flex items-center justify-center mb-6`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 font-[family-name:var(--font-ubuntu)]">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — OUR SOLUTION
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-white">
        <SectionHeader
          title={t(content.solution.title, locale)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Text content */}
          <motion.div variants={fadeInUp} className="lg:col-span-3 space-y-5">
            <p className="text-lg text-slate-600 leading-relaxed">
              {t(content.solution.p1, locale)}
              <strong className="text-slate-900">{t(content.solution.p1Bold, locale)}</strong>
              {t(content.solution.p1End, locale)}
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t(content.solution.p2, locale)}
              <strong className="text-slate-900">{t(content.solution.p2Bold, locale)}</strong>
              {t(content.solution.p2End, locale)}
            </p>
          </motion.div>

          {/* SSO Visual Diagram */}
          <motion.div variants={scaleIn} className="lg:col-span-2">
            <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-200">
              {/* Central SSO Node */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#374da0] to-[#2cbbbc] flex items-center justify-center text-white shadow-lg shadow-[#374da0]/25 mb-3">
                  {Icons.network}
                </div>
                <span className="text-sm font-bold text-slate-900">{t(content.solution.ssoGateway, locale)}</span>
                <span className="text-xs text-slate-500">{t(content.solution.ssoSub, locale)}</span>
              </div>
              {/* Connection lines */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-px h-6 bg-slate-300" />
                <div className="w-px h-6 bg-slate-300" />
                <div className="w-px h-6 bg-slate-300" />
              </div>
              {/* Module nodes */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: tArr(content.solution.moduleLabels, locale)[0], color: "bg-blue-50 border-blue-200 text-blue-700" },
                  { label: tArr(content.solution.moduleLabels, locale)[1], color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                  { label: tArr(content.solution.moduleLabels, locale)[2], color: "bg-purple-50 border-purple-200 text-purple-700" },
                ].map((m, i) => (
                  <div key={i} className={`rounded-xl border p-3 text-center ${m.color}`}>
                    <span className="text-xs font-bold">{m.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">{t(content.solution.dbLabel, locale)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — MODULAR BREAKDOWN
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-50">
        <SectionHeader
          title={t(content.modules.title, locale)}
          subtitle={t(content.modules.subtitle, locale)}
        />

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.modules.pillars.map((pillar, index) => {
            const icons = [Icons.command, Icons.bookOpen, Icons.briefcase, Icons.userCheck];
            const gradients = [
              "from-[#374da0] to-[#374da0]/90",
              "from-blue-600 to-blue-500",
              "from-emerald-600 to-emerald-500",
              "from-[#2cbbbc] to-teal-400"
            ];
            const textColors = ["text-[#2cbbbc]", "text-blue-500", "text-emerald-500", "text-[#2cbbbc]"];
            
            return (
              <motion.div key={index} variants={fadeInUp} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className={`bg-gradient-to-r ${gradients[index]} p-5 flex items-center gap-4`}>
                  <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-white">
                    {icons[index]}
                  </div>
                  <div>
                    <span className="text-white/70 text-xs font-bold tracking-wider uppercase">{t(pillar.label, locale)}</span>
                    <h3 className="text-white font-bold text-lg font-[family-name:var(--font-ubuntu)]">{t(pillar.title, locale)}</h3>
                  </div>
                </div>
                <div className="p-6">
                  {pillar.subtitle.en && (
                    <p className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4">{t(pillar.subtitle, locale)}</p>
                  )}
                  <ul className="space-y-3">
                    {pillar.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className={`${textColors[index]} mt-0.5 shrink-0`}>{Icons.checkCircle}</span>
                        <span className="text-slate-700" dangerouslySetInnerHTML={{ __html: t(item, locale) }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 — DATA SECURITY & COMPLIANCE
       ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 bg-slate-900 relative overflow-hidden">
        {/* Subtle bg pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-6xl mx-auto relative z-10"
        >
          <SectionHeader
            title={t(content.security.title, locale)}
            subtitle={t(content.security.subtitle, locale)}
            light
          />

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.security.items.map((item, i) => {
              const icons = [Icons.shield, Icons.lock, Icons.cloud];
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-[#2cbbbc]/15 text-[#2cbbbc] flex items-center justify-center mb-6">
                    {icons[i]}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 font-[family-name:var(--font-ubuntu)]">
                    {t(item.title, locale)}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{t(item.desc, locale)}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6 — IMPLEMENTATION & GOVERNANCE
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-white">
        <SectionHeader title={t(content.implementation.title, locale)} />

        <motion.div variants={fadeInUp} className="space-y-8">
          <p className="text-lg text-slate-600 leading-relaxed max-w-4xl">
            {t(content.implementation.desc, locale)}
          </p>

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {content.implementation.items.map((item, i) => {
              const icons = [Icons.settings, Icons.repeat, Icons.trophy, Icons.users];
              const gradients = [
                "from-[#374da0] to-[#2d3f85]",
                "from-[#2cbbbc] to-[#25a0a1]",
                "from-amber-500 to-amber-600",
                "from-emerald-500 to-emerald-600"
              ];
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {icons[i]}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 font-[family-name:var(--font-ubuntu)]">
                    {t(item.title, locale)}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{t(item.desc, locale)}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7 — TIMELINE & MODULAR ROADMAP (VISUAL TIMELINE)
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-50">
        <SectionHeader
          title={t(content.timeline.title, locale)}
          subtitle={t(content.timeline.subtitle, locale)}
        />

        {/* Desktop Timeline */}
        <motion.div variants={fadeInUp} className="hidden md:block">
          <div className="relative">
            {/* Horizontal line */}
            <div className="absolute top-[52px] left-0 right-0 h-1 bg-slate-200 rounded-full" />
            <div className={`absolute top-[52px] ${dir === 'rtl' ? 'right-0' : 'left-0'} w-2/3 h-1 bg-gradient-to-r from-slate-500 via-[#374da0] to-[#2cbbbc] rounded-full`} />

            <div className="grid grid-cols-3 gap-8 relative">
              {content.timeline.phases.map((p, i) => {
                const colors = ["bg-slate-700", "bg-[#374da0]", "bg-[#2cbbbc]"];
                const rings = ["ring-slate-300", "ring-[#374da0]/30", "ring-[#2cbbbc]/30"];
                const items = tArr(p.items, locale);
                return (
                  <div key={i} className="flex flex-col items-center text-center">
                    {/* Phase label */}
                    <span className={`text-xs font-bold tracking-wider uppercase text-white px-3 py-1 rounded-full ${colors[i]} mb-4`}>
                      {t(p.phase, locale)}
                    </span>
                    {/* Node */}
                    <div className={`w-6 h-6 rounded-full ${colors[i]} ring-4 ${rings[i]} ring-offset-2 ring-offset-slate-50 mb-8 z-10`} />
                    {/* Content Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 w-full">
                      <h4 className="text-lg font-bold text-slate-900 mb-4 font-[family-name:var(--font-ubuntu)]">{t(p.label, locale)}</h4>
                      <ul className={`space-y-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        {items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="text-[#2cbbbc] mt-0.5 shrink-0">{Icons.checkCircle}</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Mobile Timeline (Vertical) */}
        <motion.div variants={fadeInUp} className="md:hidden">
          <div className={`relative ${dir === 'rtl' ? 'pr-8 border-r-2' : 'pl-8 border-l-2'} border-slate-200 space-y-10`}>
            {content.timeline.phases.map((p, i) => {
              const colors = ["bg-slate-700", "bg-[#374da0]", "bg-[#2cbbbc]"];
              const items = tArr(p.items, locale);
              return (
                <div key={i} className="relative">
                  <div className={`absolute ${dir === 'rtl' ? '-right-[calc(2rem+5px)]' : '-left-[calc(2rem+5px)]'} w-3 h-3 rounded-full ${colors[i]} ring-4 ring-white`} />
                  <span className={`inline-block text-xs font-bold tracking-wider uppercase text-white px-3 py-1 rounded-full ${colors[i]} mb-3`}>
                    {t(p.phase, locale)}
                  </span>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <h4 className="text-lg font-bold text-slate-900 mb-3 font-[family-name:var(--font-ubuntu)]">{t(p.label, locale)}</h4>
                    <ul className="space-y-2">
                      {items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-[#2cbbbc] mt-0.5 shrink-0">{Icons.checkCircle}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8 — TRAINING, SLA & MANAGED SERVICE
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-white">
        <SectionHeader
          title={t(content.training.title, locale)}
          subtitle={t(content.training.subtitle, locale)}
        />

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.training.items.map((item, i) => {
            const icons = [Icons.graduationCap, Icons.wrench, Icons.server];
            const accents = ["border-[#374da0]", "border-[#2cbbbc]", "border-emerald-500"];
            const iconBgs = ["bg-[#374da0]/10 text-[#374da0]", "bg-[#2cbbbc]/10 text-[#2cbbbc]", "bg-emerald-50 text-emerald-600"];
            return (
              <motion.div
                key={i}
                variants={fadeInUp}
                className={`bg-slate-50 rounded-2xl p-8 border-t-4 md:border-t-0 ${dir === 'rtl' ? 'md:border-r-4' : 'md:border-l-4'} ${accents[i]} hover:shadow-lg transition-shadow duration-300`}
              >
                <div className={`w-14 h-14 rounded-xl ${iconBgs[i]} flex items-center justify-center mb-6`}>
                  {icons[i]}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 font-[family-name:var(--font-ubuntu)]">
                  {t(item.title, locale)}
                </h3>
                <p className="text-slate-600 leading-relaxed">{t(item.desc, locale)}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 9 — PROVEN TRACK RECORD (HIGHLIGHT CARD)
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-50">
        <SectionHeader title={t(content.trackRecord.title, locale)} />

        <motion.div variants={scaleIn}>
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-amber-300/10 to-amber-400/20 rounded-[2rem] blur-sm" />

            <div className="relative bg-white rounded-3xl shadow-2xl ring-2 ring-amber-400/40 overflow-hidden">
              {/* Case Study Badge */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 flex items-center gap-3">
                <div className="text-white">{Icons.trophy}</div>
                <span className="text-white font-bold tracking-wider uppercase text-sm">{t(content.trackRecord.badge, locale)}</span>
              </div>

              <div className="p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 font-[family-name:var(--font-ubuntu)]">
                  {t(content.trackRecord.caseTitle, locale)}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  {t(content.trackRecord.caseDesc, locale)}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {content.trackRecord.stats.map((stat, i) => (
                    <div key={i} className="bg-amber-50/70 rounded-xl p-4 text-center border border-amber-200/50">
                      <div className="text-2xl md:text-3xl font-bold text-[#374da0] font-[family-name:var(--font-ubuntu)]">
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-600 font-medium mt-1">{t(stat.label, locale)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 10 — INVESTMENT & COMMERCIALS
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-white">
        <SectionHeader
          title={t(content.investment.title, locale)}
          subtitle={t(content.investment.subtitle, locale)}
        />

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div variants={fadeInUp} className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <div className="w-14 h-14 rounded-xl bg-[#374da0]/10 text-[#374da0] flex items-center justify-center mb-5">
              {Icons.dollarSign}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 font-[family-name:var(--font-ubuntu)]">
              {t(content.investment.capex.title, locale)}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {t(content.investment.capex.desc, locale)}
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <div className="w-14 h-14 rounded-xl bg-[#2cbbbc]/10 text-[#2cbbbc] flex items-center justify-center mb-5">
              {Icons.repeat}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 font-[family-name:var(--font-ubuntu)]">
              {t(content.investment.opex.title, locale)}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {t(content.investment.opex.desc, locale)}
            </p>
          </motion.div>
        </motion.div>

        <motion.p variants={fadeIn} className="text-slate-500 italic text-center">
          {t(content.investment.note, locale)}
        </motion.p>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 11 — NEXT STEPS
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-50">
        <SectionHeader
          title={t(content.nextSteps.title, locale)}
          subtitle={t(content.nextSteps.subtitle, locale)}
        />

        <motion.div variants={stagger} className="max-w-3xl mx-auto">
          {content.nextSteps.steps.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="flex items-start gap-6 mb-8 last:mb-0 relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#374da0] to-[#2cbbbc] flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg shadow-[#374da0]/20 font-[family-name:var(--font-ubuntu)] z-10">
                0{i + 1}
              </div>
              <div className="pt-1">
                <h3 className="text-xl font-bold text-slate-900 mb-1 font-[family-name:var(--font-ubuntu)]">
                  {t(item.title, locale)}
                </h3>
                <p className="text-slate-600 leading-relaxed">{t(item.desc, locale)}</p>
              </div>
              {i < 2 && <div className={`hidden md:block absolute ${dir === 'rtl' ? 'right-[calc(1.75rem-1px)]' : 'left-[calc(1.75rem-1px)]'} mt-16 w-px h-8 bg-slate-200 z-0`} />}
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          CTA — LET'S BUILD
       ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 bg-gradient-to-br from-[#374da0] via-[#2d3f85] to-[#2cbbbc] relative overflow-hidden">
        {/* Decorative bg */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-ubuntu)] leading-tight whitespace-pre-line"
          >
            {t(content.cta.title, locale)}
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-lg text-white/80 mb-12">
            {t(content.cta.subtitle, locale)}
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-10 max-w-lg mx-auto"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-ubuntu)]">{content.cta.contactName}</h3>
              <p className="text-white/70 text-sm mt-1">{t(content.cta.contactRole, locale)}</p>
              <p className="text-white/60 text-sm">{content.cta.contactCompany}</p>
            </div>

            <div className="space-y-4">
              <a
                href={`mailto:${content.cta.email}`}
                className="flex items-center justify-center gap-3 w-full bg-white text-[#374da0] font-bold py-4 px-6 rounded-xl hover:bg-white/90 transition-colors"
              >
                {Icons.mail}
                {content.cta.email}
              </a>
              <a
                href={content.cta.phoneLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-white/10 border border-white/30 text-white font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors"
              >
                {Icons.phone}
                {content.cta.phone}
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER (MINIMAL)
       ═══════════════════════════════════════════════════════════ */}
      <footer className="bg-slate-950 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Shifr Asia" width={100} height={32} className="h-7 w-auto brightness-0 invert opacity-60" />
          </div>
          <p className="text-slate-500 text-sm">
            {t(content.footer.copyright, locale)}
          </p>
          <Link
            href="/"
            className="text-slate-500 hover:text-white text-sm transition-colors flex items-center gap-1"
          >
            {t(content.footer.visitSite, locale)} {Icons.arrowRight}
          </Link>
        </div>
      </footer>
    </div>
  );
}
