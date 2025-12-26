# Product Requirements Document (PRD)
## Shifr Asia - E-commerce Platform for UMKM

**Version:** 1.0  
**Date:** 26 Desember 2025  
**Author:** Founder & AI Assistant

---

## 1. Executive Summary

### Vision
Membangun platform e-commerce yang membantu UMKM Indonesia & Asia untuk scale bisnis mereka dengan mudah, profesional, dan berbasis nilai amanah.

### Products
| Product | Domain | Description |
|---------|--------|-------------|
| **E-commerce Builder** | shifr.asia | Mini-store, catalog, WA checkout, payment |
| **Web Company Profile** | *.shifr.asia / *.bizup.id | Landing page profesional untuk bisnis |
| **Digital Business Card** | bizup.id | vCard, NFC, custom links, profile page |

### Tagline
> "Jualan lebih mudah, lebih profesional, penuh amanah."

---

## 2. Problem Statement

### Masalah UMKM Saat Ini
| Problem | Impact |
|---------|--------|
| Jualan manual via DM | Waktu terbuang, error order |
| Website mahal & ribet | Tidak punya presence online profesional |
| Sulit terlihat profesional | Kehilangan trust dari customer |
| Takut biaya tersembunyi | Ragu berlangganan platform |

### Solusi Shifr
- ✅ Checkout otomatis + WA order manager
- ✅ Template instan, publish dalam 10 menit
- ✅ Domain & branding profesional
- ✅ Pricing transparan, tanpa jebakan

---

## 3. Target Users

### Primary Persona
| Persona | Description | Kebutuhan |
|---------|-------------|-----------|
| **P1: Reseller/Dropship** | Fashion seller via IG/WA | Upload mudah, WA checkout |
| **P3: Agen Travel/Umroh** | Paket wisata halal | Katalog paket, konsultasi WA |
| **P6: Pemilik Produk** | Pempek, frozen food, fashion | Katalog produk, branding |

### Secondary Persona
- P2: F&B rumahan (menu online)
- P4: Jasa (kursus, klinik)
- P5: Creator digital

---

## 4. Product Features (MVP Scope)

### 4.1 Shifr.asia - E-commerce Builder

#### Core Features
| # | Feature | Description | Priority | Status |
|---|---------|-------------|----------|--------|
| 1 | **Mini-store builder** | Link-in-bio dengan produk | P0 | ✅ Done |
| 2 | **Catalog + Variants** | Produk dengan size/color | P0 | ✅ Done |
| 3 | **WA Checkout** | Order otomatis ke WhatsApp | P0 | ✅ Done |
| 4 | **Payment Gateway** | QRIS, VA, E-wallet (Mayar/Duitku) | P0 | ✅ Done |
| 5 | **Simple Website Builder** | Section-based editor | P1 | ✅ Done |
| 6 | **Custom Domain** | *.shifr.asia atau domain sendiri | P1 | ✅ Done |
| 7 | **Multi-language** | Indonesia + English | P1 | ✅ Done |
| 8 | **Store Customization** | Theme color, banner, social links, jam operasional | P1 | ✅ Done |
| 9 | **Link-in-Bio Page** | Public page seperti Linktree | P2 | ✅ Done |
| 10 | **Promo/Discount Codes** | Kode diskon untuk marketing | P2 | ✅ Done |
| 11 | **Simple Analytics** | Views, clicks, orders tracking | P2 | ✅ Done |

#### Out of MVP Scope
- ❌ Digital product delivery
- ❌ Appointment booking
- ❌ Shipping integration (Phase 2)
- ❌ POS system (Phase 2)
- ❌ Marketplace sync (Phase 2)

### 4.2 Bizup.id - Digital Business Card

| Feature | Description |
|---------|-------------|
| Profile page | Nama, foto, bio, jabatan |
| vCard download | Save to contacts |
| NFC support | Tap to share |
| Custom links | Social media, portfolio |
| Analytics | View count |

### 4.3 System Features

| Feature | Description |
|---------|-------------|
| **Reminder System** | T-30, T-7, T-1 email/WA |
| **Product Filtering** | Blacklist: rokok, alkohol, non-syariah |
| **Merchant Dashboard** | Simple (Version A) - CRUD produk, order, settings |

> **⚠️ PENTING:** Ya, setiap user/client yang berlangganan akan memiliki **dashboard sendiri** untuk:
> - Mengubah konten toko/profile
> - Mengelola produk (tambah, edit, hapus)
> - Melihat order masuk
> - Mengatur settings (domain, theme, dll)

---

## 5. Pricing Model

### Shifr.asia E-commerce
| Tier | Limit Produk | Harga |
|------|--------------|-------|
| **Free** | ≤9 produk | Gratis 3 bulan |
| **Starter** | ≤5 produk | Rp 35k/bulan |
| **Growth** | 6-50 produk | Rp 89k/bulan |
| **Pro** | 51-499 produk | Rp 199k/bulan |

### Web Company Profile
| Item | Harga |
|------|-------|
| Subdomain | Rp 50k/bulan |
| Custom Domain Setup | Rp 59k (one-time) |

### Bizup.id
| Item | Harga |
|------|-------|
| Standard | Rp 89k/tahun |

---

## 6. Design System

### 6.1 Color Palette

| Name | HEX | RGB | Usage |
|------|-----|-----|-------|
| **Main** | `#374da0` | 55, 77, 160 | Primary buttons, headers, brand identity |
| **Second** | `#2cbbbc` | 44, 187, 188 | Accents, success states, highlights |
| **Third** | `#327eac` | 50, 126, 172 | Secondary elements, links, info |
| **Fourth** | `#f3f4f5` | 243, 244, 245 | Backgrounds, cards, surfaces |
| **Fifth** | `#ffffff` | 255, 255, 255 | White, light mode base |

**Gradient:**
```css
/* Primary Gradient (Main → Second) */
background: linear-gradient(135deg, #374da0 0%, #2cbbbc 100%);

/* Accent Gradient (Second → Third) */
background: linear-gradient(135deg, #2cbbbc 0%, #327eac 100%);
```

### 6.2 Typography

| Category | Font | Weight | Usage |
|----------|------|--------|-------|
| **Headings** | Ubuntu | 500, 700 | H1-H6, Logo, Titles |
| **Body** | Poppins | 400, 500, 600 | Paragraphs, Labels, Buttons |

**Font Scale:**
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 2.5rem (40px) | 700 | 1.2 |
| H2 | 2rem (32px) | 700 | 1.25 |
| H3 | 1.5rem (24px) | 600 | 1.3 |
| H4 | 1.25rem (20px) | 600 | 1.4 |
| Body | 1rem (16px) | 400 | 1.6 |
| Small | 0.875rem (14px) | 400 | 1.5 |

### 6.3 Component Styles

**Buttons:**
- Primary: `bg-main (#374da0)`, hover: darker 10%
- Secondary: `bg-second (#2cbbbc)`, hover: darker 10%
- Outline: `border-main`, transparent bg, hover: filled

**Cards:**
- Background: `#ffffff` with `shadow-sm`
- Border radius: `12px` (rounded-xl)
- Padding: `24px`

**Forms:**
- Input border: `#e5e7eb` (gray-200)
- Focus ring: `#374da0` (main)
- Border radius: `8px` (rounded-lg)

---

## 7. Technical Architecture

### 6.1 Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Backend** | Laravel 11 | Mature, fast development |
| **Frontend** | Next.js 14 + Tailwind | SEO, PWA support |
| **Database** | PostgreSQL | Reliable, scalable |
| **Cache** | Redis | Session, queue |
| **Storage** | S3-compatible | Media files |
| **CDN** | Cloudflare | Performance |

### 6.2 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                     USERS                            │
│   (Merchants / Buyers / Admin)                       │
└────────────────────┬────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│   shifr.asia    │     │    bizup.id     │
│   (Next.js)     │     │   (Next.js)     │
│                 │     │                 │
│ - Landing Page  │     │ - Landing Page  │
│ - App Dashboard │     │ - Card Editor   │
│ - Store Render  │     │ - Card Viewer   │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   API Gateway         │
         │   (Laravel API)       │
         └───────────┬───────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌────────┐    ┌───────────┐    ┌───────────┐
│PostgreSQL│  │   Redis   │    │    S3     │
│(Database)│  │  (Cache)  │    │ (Storage) │
└────────┘    └───────────┘    └───────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌────────┐    ┌───────────┐    ┌───────────┐
│ Mayar/ │    │ WA Tools  │    │ Mailer    │
│ Duitku │    │(Dripsender)│   │ (Resend)  │
└────────┘    └───────────┘    └───────────┘
```

### 6.3 Infrastructure (FREE-Tier Strategy)

**Target: $0/month sampai 1-2k users, <$20/month sampai 5-10k users**

| Layer | Free Solution | Free Tier Limit |
|-------|---------------|------------------|
| **Frontend** | Vercel | 100GB bandwidth/month |
| **Backend** | Railway / Render | $5 credit/month |
| **Database** | Supabase | 500MB + 50k MAU |
| **Cache** | Upstash Redis | 10k commands/day |
| **Storage** | Cloudflare R2 | 10GB + 10M requests |
| **CDN** | Cloudflare | Unlimited |
| **Email** | Resend | 3k emails/month |
| **Domain** | Cloudflare | DNS free |

**Upgrade Path (setelah 5k users):**
| Service | Provider | Est. Cost |
|---------|----------|------------|
| Backend | Railway Pro | $20/month |
| Database | Supabase Pro | $25/month |
| **Total** | | **~$45/month** |

*Note: PlanetScale sudah tidak gratis (April 2024)*

---

## 7. Database ERD (Core Tables)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   users     │     │   stores    │     │  products   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │──┐  │ id          │──┐  │ id          │
│ email       │  └─>│ user_id     │  └─>│ store_id    │
│ password    │     │ name        │     │ name        │
│ role        │     │ slug        │     │ description │
│ locale      │     │ domain      │     │ price       │
│ created_at  │     │ template_id │     │ images      │
└─────────────┘     │ settings    │     │ variants    │
                    │ tier        │     │ is_active   │
                    └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │   orders    │     │ business_   │
                    ├─────────────┤     │ cards       │
                    │ id          │     ├─────────────┤
                    │ store_id    │     │ id          │
                    │ customer_*  │     │ user_id     │
                    │ items       │     │ slug        │
                    │ total       │     │ data (json) │
                    │ status      │     │ views       │
                    │ payment_*   │     │ expires_at  │
                    └─────────────┘     └─────────────┘

┌─────────────┐     ┌─────────────┐
│subscriptions│     │  templates  │
├─────────────┤     ├─────────────┤
│ id          │     │ id          │
│ user_id     │     │ name        │
│ product     │     │ type        │
│ tier        │     │ sections    │
│ starts_at   │     │ preview_url │
│ expires_at  │     │ is_premium  │
│ status      │     └─────────────┘
└─────────────┘
```

---

## 8. Development Cost Estimation

### 8.1 Tim Development
| Role | Jumlah | Rate/bulan | Total 6 bln |
|------|--------|------------|-------------|
| Lead Engineer | 1 | 15-20jt | 90-120jt |
| Backend Dev | 1 | 10-15jt | 60-90jt |
| Frontend Dev | 1 | 10-15jt | 60-90jt |
| UI/UX Designer | 1 (part-time) | 5-8jt | 30-48jt |
| **Total Payroll** | | | **240-348jt** |

### 8.2 Operational Cost (6 bulan)
| Item | Estimasi |
|------|----------|
| Domain & SSL | ~500rb |
| Tools & subscriptions | ~3jt |
| Payment gateway setup | ~1jt |
| Contingency (10%) | ~30jt |
| **Total Ops** | **~35jt** |

### 8.3 Grand Total Development
| Skenario | Total |
|----------|-------|
| **Minimum** (founder ikut coding) | **Rp 150-200jt** |
| **Standard** (tim 4 orang) | **Rp 275-380jt** |
| **Comfortable** (dengan buffer) | **Rp 400-450jt** |

### 8.4 Valuasi Jika Dijual
| Metode | Perhitungan | Nilai |
|--------|-------------|-------|
| Cost-based | 2-3x development cost | Rp 600jt - 1.2M |
| Revenue multiple | 10-15x MRR (target 10jt) | Rp 100-150jt |
| User-based | Rp 500k-1jt per active user | TBD |
| **Realistic Sale Price** | (jika 500+ users, MRR 10jt+) | **Rp 500jt - 1.5M** |

*Note: Valuasi sangat bergantung pada traction, MRR, dan growth rate*

---

## 9. Work Breakdown Structure (WBS)

```
1. SHIFR ASIA PLATFORM
├─ 1.1 FOUNDATION
│   ├─ 1.1.1 Project Setup
│   │   ├─ Repository & monorepo structure
│   │   ├─ CI/CD pipeline
│   │   └─ Development environment
│   ├─ 1.1.2 Design System
│   │   ├─ UI Kit & components
│   │   ├─ Color palette & typography
│   │   └─ Template wireframes
│   └─ 1.1.3 Architecture
│       ├─ Database schema
│       ├─ API structure
│       └─ Auth system
│
├─ 1.2 CORE PLATFORM
│   ├─ 1.2.1 Authentication
│   │   ├─ User registration
│   │   ├─ Login/logout
│   │   └─ Role management
│   ├─ 1.2.2 Merchant Dashboard
│   │   ├─ Dashboard shell
│   │   ├─ Store settings
│   │   └─ Product management
│   ├─ 1.2.3 Store Frontend
│   │   ├─ Template rendering
│   │   ├─ Product catalog
│   │   └─ SEO optimization
│   └─ 1.2.4 Product Management
│       ├─ CRUD products
│       ├─ Variants (size/color)
│       └─ Image upload
│
├─ 1.3 COMMERCE
│   ├─ 1.3.1 Checkout
│   │   ├─ WA checkout flow
│   │   ├─ Cart & order creation
│   │   └─ Order notifications
│   ├─ 1.3.2 Payment
│   │   ├─ Mayar/Duitku integration
│   │   ├─ Payment callback
│   │   └─ Transaction history
│   └─ 1.3.3 Order Management
│       ├─ Order list & detail
│       ├─ Status updates
│       └─ Customer data
│
├─ 1.4 WEBSITE BUILDER
│   ├─ 1.4.1 Section Editor
│   │   ├─ Drag-drop sections
│   │   ├─ Content editing
│   │   └─ Preview mode
│   ├─ 1.4.2 Templates
│   │   ├─ 7-10 starter templates
│   │   └─ Template categories
│   └─ 1.4.3 Domain
│       ├─ Subdomain system
│       ├─ Custom domain binding
│       └─ SSL automation
│
├─ 1.5 SUBSCRIPTION & BILLING
│   ├─ 1.5.1 Subscription
│   │   ├─ Tier management
│   │   ├─ Upgrade/downgrade
│   │   └─ Invoice generation
│   └─ 1.5.2 Reminder System
│       ├─ Email notifications
│       ├─ WA notifications
│       └─ Auto-suspend
│
├─ 1.6 BIZUP.ID
│   ├─ 1.6.1 Card Builder
│   │   ├─ Profile editor
│   │   └─ Link management
│   ├─ 1.6.2 Card Features
│   │   ├─ vCard download
│   │   ├─ NFC support
│   │   └─ Analytics
│   └─ 1.6.3 Subscription
│       └─ Yearly billing (Rp 89k)
│
└─ 1.7 LAUNCH PREPARATION
    ├─ 1.7.1 Testing
    │   ├─ QA & bug fixing
    │   └─ Security audit
    ├─ 1.7.2 Optimization
    │   ├─ Performance tuning
    │   └─ Mobile optimization
    └─ 1.7.3 Go-To-Market
        ├─ Documentation
        └─ Marketing assets
```

## 10. Sprint Breakdown (6 Bulan)

> **Mapping ke WBS:** Setiap sprint di-align dengan deliverables dari WBS Section 9

### Overview
| Phase | Sprint | Durasi | WBS Reference | Goal |
|-------|--------|--------|---------------|------|
| 0 | Sprint 0 | 2 minggu | 1.1 Foundation | Setup & Design |
| 1 | Sprint 1-3 | 6 minggu | 1.2 Core Platform | Auth, Dashboard, Store |
| 2 | Sprint 4-6 | 6 minggu | 1.3 Commerce + 1.5 Billing | Checkout & Payment → **Soft Beta** |
| 3 | Sprint 7-8 | 4 minggu | 1.4 Website Builder | Editor & Domain |
| 4 | Sprint 9-10 | 4 minggu | 1.6 Bizup.id + Polish | Business Card & UX |
| 5 | Sprint 11-12 | 4 minggu | 1.7 Launch Prep | Testing & Launch |

---

### Sprint 0: Foundation (Week 1-2)
**WBS: 1.1 Foundation**
| Task | WBS Ref |
|------|---------|
| Setup repositories (monorepo) | 1.1.1 |
| Development environment | 1.1.1 |
| UI Kit & design system | 1.1.2 |
| Color palette & typography | 1.1.2 |
| Database schema | 1.1.3 |
| API structure planning | 1.1.3 |

---

### Sprint 1-3: Core Platform (Week 3-8)
**WBS: 1.2 Core Platform**

**Sprint 1 (Week 3-4):** Authentication & Shell
| Task | WBS Ref |
|------|---------|
| User registration | 1.2.1 |
| Login/logout | 1.2.1 |
| Role management | 1.2.1 |
| Merchant dashboard shell | 1.2.2 |

**Sprint 2 (Week 5-6):** Product Management
| Task | WBS Ref |
|------|---------|
| Store settings | 1.2.2 |
| CRUD products | 1.2.4 |
| Variants (size/color) | 1.2.4 |
| Image upload | 1.2.4 |

**Sprint 3 (Week 7-8):** Store Frontend
| Task | WBS Ref |
|------|---------|
| Template wireframes | 1.1.2 |
| Template rendering | 1.2.3 |
| Product catalog page | 1.2.3 |
| SEO optimization | 1.2.3 |

---

### Sprint 4: Digital Business Card (Week 9-10) ✅ COMPLETE
**WBS: 1.6.1-1.6.2 Bizup.id Core**

> **📝 Status (21 Des 2025):** Sprint 4 selesai. Fitur CV dan color picker sudah diimplementasi.

| Task | WBS Ref | Status |
|------|---------|--------|
| BusinessCard model & migration | 1.6.1 | ✅ |
| Profile editor (name, photo, bio, title) | 1.6.1 | ✅ |
| Link management (social + custom) | 1.6.1 | ✅ |
| vCard download | 1.6.2 | ✅ |
| QR code generator | 1.6.2 | ✅ |
| Public card page (`/[slug]`) | 1.6.1 | ✅ |
| CV sections (about, achievements, experience, education, skills, languages) | 1.6.1 | ✅ |
| Custom background color picker | 1.6.1 | ✅ |
| Landing page (bizup.id) | 1.6.1 | ✅ |

**📝 TODO Enhancement (Next Session):**
- [ ] Pengalaman: Format periode → tahun mulai + tahun selesai + opsi "Masih Disini"
- [ ] Prestasi: Tambah field tahun + organisasi pemberi
- [ ] Pendidikan: Tahun lulus → format integer 4 digit

---

### Sprint 5: Website Builder Basic (Week 11-12)
**WBS: 1.4.1-1.4.2 Section Editor**

| Task | WBS Ref |
|------|---------|
| Section editor (add/remove/reorder) | 1.4.1 |
| Content editing (text, images) | 1.4.1 |
| Preview mode | 1.4.1 |
| 3-5 additional store templates | 1.4.2 |

---

### Sprint 6: Subscription UI (Week 13-14)
**WBS: 1.5.1 Tier Management (UI Only)**

| Task | WBS Ref |
|------|---------|
| Subscription model & migration | 1.5.1 |
| Tier display (pricing page) | 1.5.1 |
| Upgrade flow UI | 1.5.1 |
| Feature gates by tier | 1.5.1 |
| **Note:** Payment integration deferred | - |

---

### Sprint 7: Polish & Preparation (Week 15-16)
**WBS: 1.7.2 Optimization**

| Task | WBS Ref |
|------|---------|
| Multi-language (ID/EN) | - |
| Mobile optimization | 1.7.2 |
| Performance (loading, caching) | 1.7.2 |
| Error handling improvements | 1.7.2 |
| Card analytics (bizup.id) | 1.6.2 |

---

### Post-Sprint 7: Third-Party Integrations ⏳
**Deferred integrations (to be scheduled after Sprint 7):**

| Integration | Description | WBS Ref |
|-------------|-------------|---------|
| **Dripsender API** | WhatsApp notifications (verify endpoint) | 1.3.1 |
| **Payment Gateway** | Mayar/Duitku integration | 1.3.2 |
| **Email Notification** | Mailgun/Resend for reminders | 1.5.2 |

---

### Sprint 8: Domain System (Week 17-18)
**WBS: 1.4.3 Domain Management**

| Task | WBS Ref |
|------|---------|
| Subdomain system | 1.4.3 |
| Custom domain binding | 1.4.3 |
| SSL automation | 1.4.3 |

---

### Sprint 9-10: Commerce & Billing (Week 19-22)
**WBS: 1.3 Commerce + 1.5 Subscription (Full)**

**Sprint 9 (Week 19-20):** Payment Integration
| Task | WBS Ref |
|------|---------|
| Payment gateway integration | 1.3.2 |
| Payment callback handling | 1.3.2 |
| Transaction history | 1.3.2 |

**Sprint 10 (Week 21-22):** Billing & Polish
| Task | WBS Ref |
|------|---------|
| Billing automation | 1.5.1 |
| Invoice generation | 1.5.1 |
| Reminder system (Email + WA) | 1.5.2 |
| CI/CD pipeline | 1.1.1 |

---

### Sprint 11-12: Launch (Week 23-26)
**WBS: 1.7 Launch Preparation**

**Sprint 11 (Week 23-24):** Testing & Optimization
| Task | WBS Ref |
|------|---------|
| QA & bug fixing | 1.7.1 |
| Security audit | 1.7.1 |
| Performance tuning | 1.7.2 |

**Sprint 12 (Week 25-26):** Go-To-Market
| Task | WBS Ref |
|------|---------|
| Documentation | 1.7.3 |
| Marketing assets | 1.7.3 |
| **PUBLIC LAUNCH** 🎉 | - |

---

## 11. Success Metrics

### North Star Metric
**Primary:** Number of successful checkouts (WA click + paid)  
**Secondary:** 7-day success rate (signup → publish → transact)

### KPIs
| Metric | Target Month 6 |
|--------|----------------|
| Active merchants | 500+ |
| GMV | Rp 100jt+ |
| Paid subscribers | 100+ |
| MRR | Rp 5-10jt |

---

## 12. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Payment gateway rejection | High | Apply early, have backup |
| WA API limitations | Medium | Use third-party tools |
| Slow adoption | Medium | Focus on 2 personas only |
| Technical debt | Medium | Code review, testing |

---

## 13. Appendix

### References
- [Minutes of Meeting](file:///Users/rezaaldi/.gemini/antigravity/brain/f5f54de0-0150-4f38-873a-50e1dd6924eb/mom_brainstorming.md)
- [Original Project Document](file:///Users/rezaaldi/Documents/Projects/shifr-asia/docs/Shifr%20Asia%20Project.txt)
- [Bizup.id Example](file:///Users/rezaaldi/Documents/Projects/aldiansyah/src/App.js)

### Competitors
| Name | Level |
|------|-------|
| Lynk.id | High |
| Clicky.id | High |
| Taplink | Medium |
| Beacons.ai | Medium |
