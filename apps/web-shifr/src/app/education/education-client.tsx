'use client';

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

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
  number,
  title,
  subtitle,
  light = false,
}: {
  number: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <motion.div variants={fadeInUp} className="mb-14">
      <div
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5 ${
          light
            ? "bg-white/10 text-white/80 border border-white/20"
            : "bg-[var(--color-main)]/10 text-[var(--color-main)] border border-[var(--color-main)]/20"
        }`}
      >
        <span>Section {number}</span>
      </div>
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
export default function EducationProposal() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
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
              Digital Transformation{" "}
              <span className="bg-gradient-to-r from-[#2cbbbc] to-[#4dd8d8] bg-clip-text text-transparent">
                Masterplan
              </span>
              <br />
              <span className="text-white/90">for Educational Institutions</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
            >
              An Integrated Information System &amp; IT Governance Proposal
            </motion.p>

            <motion.div variants={fadeInUp} className="h-px w-full max-w-xl bg-gradient-to-r from-[#2cbbbc]/50 via-white/20 to-transparent mb-12" />

            {/* Executive Summary */}
            <motion.div variants={fadeInUp} className="max-w-3xl">
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#2cbbbc] mb-5">
                1. Executive Summary
              </h2>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed mb-5">
                In education today, software is often bought in pieces: one application for grading, another for tuition, and a separate one for attendance. This fragmentation leaves the executive board blind to real-time operations.
              </p>
              <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                This proposal outlines the IT Blueprint and execution roadmap to build an Integrated Digital Education Ecosystem. We utilize a modular architecture—meaning you can roll it out in phases based on your immediate priorities—that ultimately connects to a Single Sign-On (SSO) centralized database. The end result is absolute operational control for the board, immediate transparency for parents, and a lighter administrative workload for teachers.
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
          <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — UNDERSTANDING YOUR NEEDS
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-50">
        <SectionHeader
          number="02"
          title="Understanding Your Needs"
          subtitle="Based on our experience auditing modern educational operations, foundations and school boards typically struggle with three systemic bottlenecks:"
        />

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Icons.database,
              title: "Data Silos & Delayed Reporting",
              desc: "Relying on disconnected spreadsheets and manual paperwork means consolidating financial and academic data takes weeks instead of minutes.",
              accent: "border-red-400",
              iconBg: "bg-red-50 text-red-500",
            },
            {
              icon: Icons.users,
              title: "Parent Engagement Gaps",
              desc: "Parents expect instant updates on their child's academic progress and tuition billing, yet most schools lack a secure, two-way communication channel.",
              accent: "border-amber-400",
              iconBg: "bg-amber-50 text-amber-600",
            },
            {
              icon: Icons.alertTriangle,
              title: "The Risk of Stalled IT Projects",
              desc: "Schools often invest in custom software that ultimately fails during implementation due to poor change management and a lack of proper training for the teaching staff.",
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
          number="03"
          title="Our Solution: An Integrated Digital Ecosystem"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Text content */}
          <motion.div variants={fadeInUp} className="lg:col-span-3 space-y-5">
            <p className="text-lg text-slate-600 leading-relaxed">
              We do not just sell software; we deliver operational governance. PT Shifr Asia Inovasi proposes a web-based platform built on a <strong className="text-slate-900">Centralized-Modular framework</strong>.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Each functional module (Academic, Finance, HR) can operate independently during the initial rollout, but they automatically communicate with each other through a <strong className="text-slate-900">Single Sign-On (SSO) gateway</strong>. The backend infrastructure is built on high-performance database technology (PostgreSQL) to ensure the system remains fast and stable, even when accessed by thousands of users simultaneously.
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
                <span className="text-sm font-bold text-slate-900">SSO Gateway</span>
                <span className="text-xs text-slate-500">Single Sign-On</span>
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
                  { label: "Academic", color: "bg-blue-50 border-blue-200 text-blue-700" },
                  { label: "Finance", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                  { label: "HR", color: "bg-purple-50 border-purple-200 text-purple-700" },
                ].map((m, i) => (
                  <div key={i} className={`rounded-xl border p-3 text-center ${m.color}`}>
                    <span className="text-xs font-bold">{m.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">PostgreSQL High-Performance Backend</span>
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
          number="04"
          title="Modular Breakdown"
          subtitle="The system is divided into four strategic pillars, which can be activated based on your foundation's needs:"
        />

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* A. Core Foundation */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-[#374da0] to-[#374da0]/90 p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-white">
                {Icons.command}
              </div>
              <div>
                <span className="text-white/70 text-xs font-bold tracking-wider uppercase">Pillar A</span>
                <h3 className="text-white font-bold text-lg font-[family-name:var(--font-ubuntu)]">Core Foundation</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-4">The Command Center</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#2cbbbc] mt-0.5 shrink-0">{Icons.checkCircle}</span>
                  <span className="text-slate-700"><strong>Single Sign-On (SSO):</strong> One gateway and one password for all school applications.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#2cbbbc] mt-0.5 shrink-0">{Icons.checkCircle}</span>
                  <span className="text-slate-700"><strong>Executive Dashboard:</strong> A real-time analytics dashboard for the C-Suite/Board to monitor cash flow, attendance rates, and branch performance.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* B. Academic & Learning */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-white">
                {Icons.bookOpen}
              </div>
              <div>
                <span className="text-white/70 text-xs font-bold tracking-wider uppercase">Pillar B</span>
                <h3 className="text-white font-bold text-lg font-[family-name:var(--font-ubuntu)]">Academic &amp; Learning</h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-0.5 shrink-0">{Icons.checkCircle}</span>
                  <span className="text-slate-700">Centralized Curriculum &amp; Scheduling Management.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-0.5 shrink-0">{Icons.checkCircle}</span>
                  <span className="text-slate-700">Real-time grading system for teachers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 mt-0.5 shrink-0">{Icons.checkCircle}</span>
                  <span className="text-slate-700">Learning Management System (LMS) for material and assignment distribution.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* C. Operational & Finance */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-white">
                {Icons.briefcase}
              </div>
              <div>
                <span className="text-white/70 text-xs font-bold tracking-wider uppercase">Pillar C</span>
                <h3 className="text-white font-bold text-lg font-[family-name:var(--font-ubuntu)]">Operational &amp; Finance</h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5 shrink-0">{Icons.checkCircle}</span>
                  <span className="text-slate-700">Financial Information System (Tuition billing and payment reconciliation).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5 shrink-0">{Icons.checkCircle}</span>
                  <span className="text-slate-700">HRIS (Staff management, attendance, and payroll).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5 shrink-0">{Icons.checkCircle}</span>
                  <span className="text-slate-700">Integrated POS (Point of Sales) System for the school cafeteria or cooperative.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* D. Engagement Portal */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-[#2cbbbc] to-teal-400 p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-white">
                {Icons.userCheck}
              </div>
              <div>
                <span className="text-white/70 text-xs font-bold tracking-wider uppercase">Pillar D</span>
                <h3 className="text-white font-bold text-lg font-[family-name:var(--font-ubuntu)]">Engagement Portal</h3>
              </div>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#2cbbbc] mt-0.5 shrink-0">{Icons.checkCircle}</span>
                  <span className="text-slate-700">A dedicated <strong>Parent Portal</strong> to track bills, grades, and disciplinary records.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#2cbbbc] mt-0.5 shrink-0">{Icons.checkCircle}</span>
                  <span className="text-slate-700">A <strong>Student Admission Portal (PPDB)</strong> directly linked to the student and finance databases.</span>
                </li>
              </ul>
            </div>
          </motion.div>
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
            number="05"
            title="Data Security & Compliance"
            subtitle="Protecting the data of hundreds of students and teachers is our absolute priority. We implement corporate-grade security standards:"
            light
          />

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Icons.shield,
                title: "Role-Based Access Control (RBAC)",
                desc: "Strict access rights. Teachers only see their classes, finance admins cannot alter grades, and the board has full visibility.",
              },
              {
                icon: Icons.lock,
                title: "Data Privacy Compliance",
                desc: "An architecture designed in alignment with data protection regulations.",
              },
              {
                icon: Icons.cloud,
                title: "Automated Backups",
                desc: "Routine cloud-based backups to ensure zero data loss from hardware failure or human error.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-[#2cbbbc]/15 text-[#2cbbbc] flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3 font-[family-name:var(--font-ubuntu)]">
                  {item.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6 — IMPLEMENTATION & GOVERNANCE
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-white">
        <SectionHeader number="06" title="Implementation & Governance" />

        <motion.div variants={fadeInUp} className="max-w-4xl">
          <div className="flex items-start gap-6">
            <div className="hidden md:flex w-16 h-16 rounded-2xl bg-[var(--color-main)]/10 text-[var(--color-main)] items-center justify-center shrink-0">
              {Icons.settings}
            </div>
            <div className="space-y-5">
              <p className="text-lg text-slate-600 leading-relaxed">
                The success of an IT project lies in its execution, not just the code. We apply strict <strong className="text-slate-900">PMO (Project Management Office) standards</strong> combined with <strong className="text-slate-900">Agile frameworks</strong>.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                To guarantee that teachers and staff actually adopt the new system, we integrate the{" "}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#374da0]/10 text-[#374da0] rounded-lg font-bold text-base">
                  4 Disciplines of Execution (4DX)
                </span>{" "}
                into our change management process. We do not leave the project until the system becomes the new working culture for your institution.
              </p>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7 — TIMELINE & MODULAR ROADMAP (VISUAL TIMELINE)
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-50">
        <SectionHeader
          number="07"
          title="Timeline & Modular Roadmap"
          subtitle='We avoid the rigid "wait a year to see results" approach. Through Agile delivery, your foundation will experience tangible operational benefits in structured phases:'
        />

        {/* Desktop Timeline */}
        <motion.div variants={fadeInUp} className="hidden md:block">
          <div className="relative">
            {/* Horizontal line */}
            <div className="absolute top-[52px] left-0 right-0 h-1 bg-slate-200 rounded-full" />
            <div className="absolute top-[52px] left-0 w-2/3 h-1 bg-gradient-to-r from-slate-500 via-[#374da0] to-[#2cbbbc] rounded-full" />

            <div className="grid grid-cols-3 gap-8 relative">
              {[
                {
                  phase: "Phase 1",
                  label: "Foundation",
                  color: "bg-slate-700",
                  ringColor: "ring-slate-300",
                  items: ["UI/UX Design", "Centralized Database Setup", "Admission Module"],
                },
                {
                  phase: "Phase 2",
                  label: "Operational",
                  color: "bg-[#374da0]",
                  ringColor: "ring-[#374da0]/30",
                  items: ["HRIS", "Tuition Billing", "POS Modules"],
                },
                {
                  phase: "Phase 3",
                  label: "Academic & Go-Live",
                  color: "bg-[#2cbbbc]",
                  ringColor: "ring-[#2cbbbc]/30",
                  items: ["Grading System Rollout", "LMS", "Parent Portal", "Executive Dashboard Full Activation"],
                },
              ].map((p, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  {/* Phase label */}
                  <span className={`text-xs font-bold tracking-wider uppercase text-white px-3 py-1 rounded-full ${p.color} mb-4`}>
                    {p.phase}
                  </span>
                  {/* Node */}
                  <div className={`w-6 h-6 rounded-full ${p.color} ring-4 ${p.ringColor} ring-offset-2 ring-offset-slate-50 mb-8 z-10`} />
                  {/* Content Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 w-full">
                    <h4 className="text-lg font-bold text-slate-900 mb-4 font-[family-name:var(--font-ubuntu)]">{p.label}</h4>
                    <ul className="space-y-2 text-left">
                      {p.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-[#2cbbbc] mt-0.5 shrink-0">{Icons.checkCircle}</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mobile Timeline (Vertical) */}
        <motion.div variants={fadeInUp} className="md:hidden">
          <div className="relative pl-8 border-l-2 border-slate-200 space-y-10">
            {[
              {
                phase: "Phase 1",
                label: "Foundation",
                color: "bg-slate-700",
                items: ["UI/UX Design", "Centralized Database Setup", "Admission Module"],
              },
              {
                phase: "Phase 2",
                label: "Operational",
                color: "bg-[#374da0]",
                items: ["HRIS", "Tuition Billing", "POS Modules"],
              },
              {
                phase: "Phase 3",
                label: "Academic & Go-Live",
                color: "bg-[#2cbbbc]",
                items: ["Grading System Rollout", "LMS", "Parent Portal", "Executive Dashboard Full Activation"],
              },
            ].map((p, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-[calc(2rem+5px)] w-3 h-3 rounded-full ${p.color} ring-4 ring-white`} />
                <span className={`inline-block text-xs font-bold tracking-wider uppercase text-white px-3 py-1 rounded-full ${p.color} mb-3`}>
                  {p.phase}
                </span>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <h4 className="text-lg font-bold text-slate-900 mb-3 font-[family-name:var(--font-ubuntu)]">{p.label}</h4>
                  <ul className="space-y-2">
                    {p.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-[#2cbbbc] mt-0.5 shrink-0">{Icons.checkCircle}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8 — TRAINING, SLA & MANAGED SERVICE
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-white">
        <SectionHeader
          number="08"
          title="Training, SLA & Managed Service"
          subtitle="PT Shifr Asia Inovasi is committed to being a long-term strategic partner:"
        />

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Icons.graduationCap,
              title: "Capacity Building",
              desc: "Comprehensive training for Super Users (admins) and daily users (teachers/staff).",
              accent: "border-[#374da0]",
              iconBg: "bg-[#374da0]/10 text-[#374da0]",
            },
            {
              icon: Icons.wrench,
              title: "SLA & Bug Fixing",
              desc: "Guaranteed system repairs to ensure optimal operational uptime.",
              accent: "border-[#2cbbbc]",
              iconBg: "bg-[#2cbbbc]/10 text-[#2cbbbc]",
            },
            {
              icon: Icons.server,
              title: "Managed Service (Optional)",
              desc: "Ongoing server maintenance, cloud management, and a technical helpdesk so your team can focus on education, not IT troubleshooting.",
              accent: "border-emerald-500",
              iconBg: "bg-emerald-50 text-emerald-600",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className={`bg-slate-50 rounded-2xl p-8 border-l-4 ${item.accent} hover:shadow-lg transition-shadow duration-300`}
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
          SECTION 9 — PROVEN TRACK RECORD (HIGHLIGHT CARD)
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-50">
        <SectionHeader number="09" title="Proven Track Record" />

        <motion.div variants={scaleIn}>
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 via-amber-300/10 to-amber-400/20 rounded-[2rem] blur-sm" />

            <div className="relative bg-white rounded-3xl shadow-2xl ring-2 ring-amber-400/40 overflow-hidden">
              {/* Case Study Badge */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 flex items-center gap-3">
                <div className="text-white">{Icons.trophy}</div>
                <span className="text-white font-bold tracking-wider uppercase text-sm">Case Study</span>
              </div>

              <div className="p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 font-[family-name:var(--font-ubuntu)]">
                  Yayasan Al-Fatih Pilar Peradaban
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  PT Shifr was brought in to rescue a stalled IT project that had been stuck in development for four years. We restructured their IT Blueprint and successfully pushed the system to go live during the peak of the pandemic. Today, the digital ecosystem we built is actively used by over 8,000 users (parents, teachers, and management) across 36 locations nationwide. This became the official technology roadmap for the central foundation, 34 Kuttab (primary education) branches, and 2 Madrasah (secondary education) campuses.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: "8,000+", label: "Active Users" },
                    { value: "36", label: "Locations" },
                    { value: "34", label: "Kuttab Branches" },
                    { value: "2", label: "Madrasah Campuses" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-amber-50/70 rounded-xl p-4 text-center border border-amber-200/50">
                      <div className="text-2xl md:text-3xl font-bold text-[#374da0] font-[family-name:var(--font-ubuntu)]">
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-600 font-medium mt-1">{stat.label}</div>
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
          number="10"
          title="Investment & Commercials"
          subtitle="To ensure transparency and accommodate your foundation's cash flow, our pricing structure is divided into two parts:"
        />

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div variants={fadeInUp} className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <div className="w-14 h-14 rounded-xl bg-[#374da0]/10 text-[#374da0] flex items-center justify-center mb-5">
              {Icons.dollarSign}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 font-[family-name:var(--font-ubuntu)]">
              Capital Expenditure (CAPEX)
            </h3>
            <p className="text-slate-600 leading-relaxed">
              The cost of architectural development and software modules (billed according to phase milestones).
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <div className="w-14 h-14 rounded-xl bg-[#2cbbbc]/10 text-[#2cbbbc] flex items-center justify-center mb-5">
              {Icons.repeat}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 font-[family-name:var(--font-ubuntu)]">
              Operational Expenditure (OPEX)
            </h3>
            <p className="text-slate-600 leading-relaxed">
              The post-launch monthly subscription for cloud hosting infrastructure and Managed Services.
            </p>
          </motion.div>
        </motion.div>

        <motion.p variants={fadeIn} className="text-slate-500 italic text-center">
          (A detailed commercial breakdown will be provided in a separate document once the final scope is agreed upon).
        </motion.p>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 11 — NEXT STEPS
       ═══════════════════════════════════════════════════════════ */}
      <Section className="bg-slate-50">
        <SectionHeader
          number="11"
          title="Next Steps"
          subtitle="To initiate this operational transformation, we propose the following steps:"
        />

        <motion.div variants={stagger} className="max-w-3xl mx-auto">
          {[
            {
              step: "01",
              title: "Alignment Kick-Off",
              desc: "A brief meeting to identify the most urgent module priorities for this academic year.",
            },
            {
              step: "02",
              title: "Contract Signing (NDA/PKS)",
              desc: "Formalizing the scope of work and execution timeline.",
            },
            {
              step: "03",
              title: "IT Blueprint Audit",
              desc: "Our team will begin mapping out your actual day-to-day business processes.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="flex items-start gap-6 mb-8 last:mb-0"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#374da0] to-[#2cbbbc] flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg shadow-[#374da0]/20 font-[family-name:var(--font-ubuntu)]">
                {item.step}
              </div>
              <div className="pt-1">
                <h3 className="text-xl font-bold text-slate-900 mb-1 font-[family-name:var(--font-ubuntu)]">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
              {i < 2 && <div className="hidden md:block absolute left-[calc(50%-1px)] mt-16 w-px h-8 bg-slate-200" />}
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
            className="text-3xl md:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-ubuntu)] leading-tight"
          >
            Let&apos;s Build Your
            <br />
            Digital Ecosystem
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-lg text-white/80 mb-12">
            Please reach out to schedule your Alignment Kick-Off:
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-10 max-w-lg mx-auto"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-ubuntu)]">Dian</h3>
              <p className="text-white/70 text-sm mt-1">Partnership Engagement Specialist - Education</p>
              <p className="text-white/60 text-sm">PT Shifr Asia Inovasi</p>
            </div>

            <div className="space-y-4">
              <a
                href="mailto:marketing@shifr.asia"
                className="flex items-center justify-center gap-3 w-full bg-white text-[#374da0] font-bold py-4 px-6 rounded-xl hover:bg-white/90 transition-colors"
              >
                {Icons.mail}
                marketing@shifr.asia
              </a>
              <a
                href="https://wa.me/62811935083"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-white/10 border border-white/30 text-white font-semibold py-4 px-6 rounded-xl hover:bg-white/20 transition-colors"
              >
                {Icons.phone}
                +62 811 935 083
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
            &copy; {new Date().getFullYear()} PT Shifr Asia Inovasi. All rights reserved.
          </p>
          <Link
            href="/"
            className="text-slate-500 hover:text-white text-sm transition-colors flex items-center gap-1"
          >
            Visit shifr.asia {Icons.arrowRight}
          </Link>
        </div>
      </footer>
    </div>
  );
}
