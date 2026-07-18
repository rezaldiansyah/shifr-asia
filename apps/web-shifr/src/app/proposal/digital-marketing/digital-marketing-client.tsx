'use client';

import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
  trendingUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  shuffle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  penTool: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
    </svg>
  ),
  barChart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  car: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
      <circle cx="6.5" cy="16.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  ),
  checkCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1} className="w-5 h-5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  messageCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  award: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
      <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  film: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /><line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
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

// ─── FAQ Item ────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      variants={fadeInUp}
      className="border border-slate-200 rounded-2xl overflow-hidden bg-white"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-lg font-bold text-slate-900 font-[family-name:var(--font-ubuntu)] pr-4">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 text-slate-400"
        >
          {Icons.chevronDown}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════
export default function DigitalMarketingProposal() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════
          [ATTENTION] — HERO BANNER
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
              Confidential Proposal
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto w-full pt-28 pb-20">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-block px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-[#2cbbbc] font-semibold text-sm tracking-wide">
                Prepared by: PT Shifr Asia Inovasi
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] font-[family-name:var(--font-ubuntu)] mb-6"
            >
              Digital Growth &{" "}
              <span className="bg-gradient-to-r from-[#2cbbbc] to-[#4dd8d8] bg-clip-text text-transparent">
                Social Media
              </span>
              <br />
              <span className="text-white/90">Management Strategy</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
            >
              Building Brand Authority and Dominating Your Industry&apos;s Narrative
            </motion.p>

            <motion.div variants={fadeInUp} className="h-px w-full max-w-xl bg-gradient-to-r from-[#2cbbbc]/50 via-white/20 to-transparent" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          [ATTENTION → INTEREST] — EXECUTIVE SUMMARY
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-white">
        <SectionHeader title="Taking Control of Your Narrative" />

        <motion.div variants={fadeInUp} className="max-w-4xl space-y-6">
          <p className="text-lg text-slate-600 leading-relaxed">
            In today&apos;s business landscape, social media is no longer just a digital brochure; it is a{" "}
            <strong className="text-slate-900">public boardroom</strong> where prospects judge your credibility.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Many companies lose potential revenue simply because their digital presence fails to reflect the true quality of their services. We hold onto one fundamental principle:
          </p>

          {/* Pull-quote */}
          <motion.div variants={scaleIn} className="relative my-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#374da0]/10 via-[#2cbbbc]/10 to-[#374da0]/10 rounded-2xl blur-sm" />
            <div className="relative bg-slate-50 border-l-4 border-[#2cbbbc] rounded-2xl p-8 md:p-10">
              <p className="text-xl md:text-2xl font-bold text-slate-800 leading-snug font-[family-name:var(--font-ubuntu)] italic">
                &ldquo;If you don&apos;t give the market the story to talk about, they&apos;ll define your brand&apos;s story for you.&rdquo;
              </p>
            </div>
          </motion.div>

          <p className="text-lg text-slate-600 leading-relaxed">
            If you are not actively controlling your narrative online, your competitors will do it for you.
          </p>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          [INTEREST] — ROOT CAUSE
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-[#fef7e6]/60">
        <SectionHeader
          title="The Root Cause: How Inconsistency Erodes Trust"
          subtitle="Based on our experience auditing corporate digital campaigns, a brand's failure on social media almost always boils down to one critical flaw:"
        />

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: Icons.shuffle,
              title: "Random Publishing",
              desc: "Content posted without strategic direction or a unified visual identity makes a brand look disjointed.",
              accent: "border-red-400",
              iconBg: "bg-red-50 text-red-500",
            },
            {
              icon: Icons.eye,
              title: "Inconsistent Visuals",
              desc: "Without a cohesive design language, every post feels like it belongs to a different brand.",
              accent: "border-amber-400",
              iconBg: "bg-amber-50 text-amber-600",
            },
            {
              icon: Icons.trendingUp,
              title: "Unprofessional Impression",
              desc: "In the eyes of your prospects, visual inconsistency signals an amateur-level operation.",
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

        <motion.div variants={scaleIn} className="relative">
          <div className="relative bg-white border-l-4 border-[#374da0] rounded-2xl p-8">
            <p className="text-xl font-bold text-slate-800 leading-snug font-[family-name:var(--font-ubuntu)] italic">
              &ldquo;Design consistency isn&apos;t optional, it&apos;s what makes your brand memorable at first glance.&rdquo;
            </p>
            <p className="text-sm text-slate-500 mt-3">This consistency is exactly what separates an enterprise-level operation from an amateur one.</p>
          </div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          [INTEREST] — THE SHIFR SOLUTION
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-white">
        <SectionHeader title="The Shifr Solution: Comprehensive Content Management" />

        <motion.div variants={fadeInUp}>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#374da0]/15 via-[#2cbbbc]/15 to-[#374da0]/15 rounded-[2rem] blur-sm" />
            <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 md:p-12 ring-1 ring-slate-200 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#374da0] to-[#2cbbbc] flex items-center justify-center text-white shadow-lg shadow-[#374da0]/25">
                  {Icons.zap}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-[family-name:var(--font-ubuntu)]">
                    Strategic Visual Ecosystem
                  </h3>
                  <p className="text-slate-500 text-sm">Not just designs — a conversion engine</p>
                </div>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                At PT Shifr Asia Inovasi, we provide professional services for social media growth, content execution, and comprehensive digital support.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                We do not just sell a &ldquo;quota of designs&rdquo;; we build a{" "}
                <strong className="text-slate-900">strategic visual ecosystem</strong>{" "}
                engineered to convert your audience into high-quality leads.
              </p>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          [DESIRE] — METHODOLOGY & EXECUTION WORKFLOW
       ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-6xl mx-auto relative z-10"
        >
          <SectionHeader
            title="Methodology & Execution Workflow"
            subtitle="To ensure every marketing dollar you invest delivers an optimal return, we apply disciplined project management standards:"
            light
          />

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                phase: "Phase 1",
                title: "Audit & Positioning",
                desc: "Formulating a communication angle that highlights your core competitive advantage.",
                icon: Icons.search,
                gradient: "from-[#374da0] to-[#2d3f85]",
              },
              {
                phase: "Phase 2",
                title: "Content Blueprint",
                desc: "Developing monthly content pillars aligned with your promotional targets.",
                icon: Icons.map,
                gradient: "from-[#2cbbbc] to-[#25a0a1]",
              },
              {
                phase: "Phase 3",
                title: "Production & QA",
                desc: "Executing professional designs and persuasive copywriting with strict Quality Assurance.",
                icon: Icons.penTool,
                gradient: "from-amber-500 to-amber-600",
              },
              {
                phase: "Phase 4",
                title: "Reporting",
                desc: "Providing transparent monthly performance reports detailing engagement metrics.",
                icon: Icons.barChart,
                gradient: "from-emerald-500 to-emerald-600",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300 group"
              >
                <span className="inline-block text-xs font-bold tracking-wider uppercase text-[#2cbbbc] mb-4">
                  {item.phase}
                </span>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-ubuntu)]">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          [DESIRE] — PROVEN TRACK RECORD
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-50">
        <SectionHeader
          title="Proven Track Record"
          subtitle="Our content strategies have successfully elevated brands across specialized industries:"
        />

        {/* ── Hero Case Study: Akademi Al-Fatih ── */}
        <motion.div variants={scaleIn} className="mb-10">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-[#2cbbbc]/15 to-emerald-400/20 rounded-[2rem] blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-xl ring-1 ring-emerald-200/60 overflow-hidden">
              {/* Header bar */}
              <div className="bg-gradient-to-r from-emerald-600 to-[#2cbbbc] px-6 md:px-10 py-4 flex items-center gap-3">
                <div className="text-white">{Icons.award}</div>
                <span className="text-white font-bold tracking-wider uppercase text-sm">Featured Case Study</span>
              </div>

              <div className="p-6 md:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  {/* Left: Content */}
                  <div className="lg:col-span-2">
                    <span className="inline-block text-xs font-bold tracking-wider uppercase text-emerald-600 mb-2">Islamic Education & E-Learning</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 font-[family-name:var(--font-ubuntu)]">
                      Akademi Al-Fatih
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mb-5">Akademi Quran · Akademi Siroh · Akademi Keluarga</p>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      Managed the complete social media team operations for three distinct academy brands under the Al-Fatih umbrella. Through strategic content planning and consistent visual branding, we successfully grew a combined audience across all three accounts — establishing each academy as a recognized authority in its respective educational niche.
                    </p>
                  </div>

                  {/* Right: Stat */}
                  <div className="lg:col-span-1 flex justify-center">
                    <div className="bg-gradient-to-br from-emerald-50 to-[#2cbbbc]/10 rounded-2xl p-8 text-center border border-emerald-200/50 w-full max-w-[220px]">
                      <div className="text-4xl md:text-5xl font-bold text-emerald-600 font-[family-name:var(--font-ubuntu)] leading-none mb-2">
                        27K+
                      </div>
                      <div className="text-sm text-slate-600 font-medium">
                        Combined Followers
                      </div>
                      <div className="text-xs text-slate-400 mt-1">across 3 accounts</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Supporting Grid: 4 Case Studies ── */}
        <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Icons.target,
              industry: "K-12 Education",
              client: "SIT Asy-Syuuraa Batam",
              desc: "Directed the institution's social media team to build a credible digital presence, strengthening parent trust and driving enrollment awareness.",
              accent: "from-purple-600 to-purple-500",
            },
            {
              icon: Icons.heart,
              industry: "Medical & Healthcare",
              client: "Medicamp",
              desc: "Managed exclusive educational content, resulting in increased engagement among accredited medical professionals.",
              accent: "from-rose-500 to-rose-600",
            },
            {
              icon: Icons.briefcase,
              industry: "Professional Services",
              client: "Chiro Board Review",
              desc: "Translated complex medical materials into an engaging format, driving significant audience retention.",
              accent: "from-[#374da0] to-[#2d3f85]",
            },
            {
              icon: Icons.car,
              industry: "Operations & Training",
              client: "Jarretts Driving School",
              desc: "Established a strong, reliable brand positioning that directly boosted local inquiries.",
              accent: "from-[#2cbbbc] to-teal-500",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`bg-gradient-to-r ${item.accent} p-4 flex items-center gap-3`}>
                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white">
                  {item.icon}
                </div>
                <span className="text-white/80 text-[11px] font-bold tracking-wider uppercase">{item.industry}</span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-[family-name:var(--font-ubuntu)]">
                  {item.client}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          [ACTION] — GROWTH INVESTMENT PACKAGES
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-white">
        <SectionHeader
          title="Growth Investment Packages"
          subtitle="We offer three tiers of collaboration. A minimum 3-month commitment is highly recommended to observe measurable algorithm and engagement growth."
        />

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Package */}
          <motion.div variants={fadeInUp} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-8">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-500">Package A</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-1 font-[family-name:var(--font-ubuntu)]">
                Starter
              </h3>
              <p className="text-sm text-slate-500 mb-6">Designed for consistent market validation.</p>
              <div className="mb-8">
                <span className="text-3xl font-bold text-slate-900 font-[family-name:var(--font-ubuntu)]">IDR 2,750,000</span>
                <span className="text-slate-500 text-sm"> /month</span>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: Icons.image, text: "15 Feed Post Designs" },
                  { icon: Icons.layers, text: "3 Story Designs" },
                  { icon: Icons.film, text: "2 Reels / Videos" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <span className="text-[#2cbbbc]">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-8 pb-8">
              <Link href="https://wa.me/62811935083?text=Hi%20Aldi,%20I%20am%20interested%20in%20the%20Starter%20Package" target="_blank" className="block w-full text-center py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors">
                Get Started
              </Link>
            </div>
          </motion.div>

          {/* Standard Package — HIGHLIGHTED */}
          <motion.div variants={fadeInUp} className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4a843]/30 via-[#d4a843]/20 to-[#d4a843]/30 rounded-[1.25rem] blur-sm" />
            <div className="relative bg-white rounded-2xl border-2 border-[#d4a843] overflow-hidden shadow-xl">
              {/* Recommended badge */}
              <div className="bg-gradient-to-r from-[#d4a843] to-amber-400 px-6 py-2 flex items-center justify-center gap-2">
                <div className="text-white">{Icons.star}</div>
                <span className="text-white font-bold tracking-wider uppercase text-xs">Highly Recommended</span>
              </div>
              <div className="p-8">
                <span className="text-xs font-bold tracking-wider uppercase text-[#d4a843]">Package B</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-1 font-[family-name:var(--font-ubuntu)]">
                  Standard
                </h3>
                <p className="text-sm text-slate-500 mb-6">Ideal for dominating algorithms and maintaining top-of-mind awareness.</p>
                <div className="mb-8">
                  <span className="text-3xl font-bold text-slate-900 font-[family-name:var(--font-ubuntu)]">IDR 3,750,000</span>
                  <span className="text-slate-500 text-sm"> /month</span>
                </div>
                <ul className="space-y-3">
                  {[
                    { icon: Icons.image, text: "20 Feed Post Designs" },
                    { icon: Icons.layers, text: "4 Story Designs" },
                    { icon: Icons.film, text: "4 Reels / Videos" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700">
                      <span className="text-[#d4a843]">{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-8 pb-8">
                <Link href="https://wa.me/62811935083?text=Hi%20Aldi,%20I%20am%20interested%20in%20the%20Standard%20Package" target="_blank" className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#d4a843] to-amber-400 text-white font-bold hover:shadow-lg hover:shadow-[#d4a843]/25 transition-all">
                  Choose Standard
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Pro Package */}
          <motion.div variants={fadeInUp} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-8">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-500">Package C</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-1 font-[family-name:var(--font-ubuntu)]">
                Pro
              </h3>
              <p className="text-sm text-slate-500 mb-6">Enterprise-scale execution for aggressive market penetration.</p>
              <div className="mb-8">
                <span className="text-3xl font-bold text-slate-900 font-[family-name:var(--font-ubuntu)]">IDR 4,500,000</span>
                <span className="text-slate-500 text-sm"> /month</span>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: Icons.image, text: "25 Feed Post Designs" },
                  { icon: Icons.layers, text: "5 Story Designs" },
                  { icon: Icons.film, text: "5 Reels / Videos" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <span className="text-[#2cbbbc]">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-8 pb-8">
              <Link href="https://wa.me/62811935083?text=Hi%20Aldi,%20I%20am%20interested%20in%20the%20Pro%20Package" target="_blank" className="block w-full text-center py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors">
                Go Pro
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          [ACTION] — FAQ
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-50">
        <SectionHeader title="Frequently Asked Questions" />

        <motion.div variants={stagger} className="max-w-3xl mx-auto space-y-4">
          <FAQItem
            question="Who provides the copywriting and captions?"
            answer="Our team handles end-to-end production, including industry-researched captions tailored to your voice. You will receive all content for approval before publication."
          />
          <FAQItem
            question="Can we request revisions?"
            answer="Yes, every package includes a structured revision cycle during the QA phase before anything is published. We ensure every piece of content meets your standards."
          />
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          [ACTION] — NEXT STEPS & CTA
       ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 px-6 bg-gradient-to-br from-[#374da0] via-[#2d3f85] to-[#2cbbbc] relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-[#2cbbbc] rounded-full blur-[80px]" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="max-w-4xl mx-auto relative z-10 text-center"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-ubuntu)] leading-tight">
              Your Digital Presence is the
              <br />
              <span className="bg-gradient-to-r from-[#4dd8d8] to-white bg-clip-text text-transparent">
                Spearhead of Your Growth
              </span>
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-10">
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-white/80 text-sm leading-relaxed max-w-2xl">
              <strong className="text-white">Strategic Add-on:</strong> Once your social media traffic matures, we also possess the full technical capability to build your independent Direct-to-Consumer e-commerce platform to fully automate your sales.
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="text-2xl font-bold text-white mb-3 font-[family-name:var(--font-ubuntu)]">
              Let&apos;s Collaborate!
            </h3>
            <p className="text-white/80 mb-8 text-lg">
              Let&apos;s schedule a brief 15-minute Alignment Call. We will review your current account performance and determine the strategy package that best aligns with your revenue targets.
            </p>
          </motion.div>

          <motion.div variants={scaleIn} className="mb-12">
            <Link
              href="https://wa.me/62811935083?text=Hi%20Aldi,%20I%20would%20like%20to%20schedule%20a%20strategic%20consultation%20for%20Digital%20Marketing."
              target="_blank"
              className="inline-flex items-center gap-3 bg-white text-[#374da0] font-bold text-lg px-10 py-4 rounded-2xl hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              Schedule Your Free Strategic Consultation
              {Icons.arrowRight}
            </Link>
          </motion.div>

          {/* Contact details */}
          <motion.div variants={fadeIn} className="space-y-4">
            <div className="w-20 h-px bg-white/30 mx-auto mb-6" />
            <p className="text-xl font-bold text-white font-[family-name:var(--font-ubuntu)]">Aldi</p>
            <p className="text-white/70 text-sm">Principal Consultant | PT Shifr Asia Inovasi</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-white/70 text-sm">
              <span className="flex items-center gap-2">
                {Icons.globe}
                <Link href="https://shifr.asia" target="_blank" className="hover:text-white transition-colors">
                  shifr.asia
                </Link>
              </span>
              <span className="flex items-center gap-2">
                {Icons.mail}
                <Link href="mailto:partner@shifr.asia" className="hover:text-white transition-colors">
                  partner@shifr.asia
                </Link>
              </span>
              <span className="flex items-center gap-2">
                {Icons.phone}
                <Link href="https://wa.me/62811935083" target="_blank" className="hover:text-white transition-colors">
                  +62 811 935 083
                </Link>
              </span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
       ═══════════════════════════════════════════════════════════ */}
      <footer className="bg-slate-950 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Shifr Asia" width={100} height={32} className="h-7 w-auto brightness-0 invert opacity-50" />
          </div>
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} PT Shifr Asia Inovasi. All rights reserved.
          </p>
          <Link href="/" className="text-slate-500 text-sm hover:text-[#2cbbbc] transition-colors">
            Visit shifr.asia
          </Link>
        </div>
      </footer>
    </div>
  );
}
