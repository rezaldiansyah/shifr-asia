# Minutes of Meeting: Shifr Asia Brainstorming Session
**Tanggal:** 19 Desember 2024  
**Peserta:** User (Founder), AI Assistant

---

## 🎯 Executive Summary

Shifr Asia adalah platform e-commerce builder untuk UMKM dengan dua produk utama:
1. **shifr.asia** - E-commerce builder & web company profile
2. **bizup.id** - Digital business card

---

## 📦 Produk & Layanan (FINAL)

### 1. Shifr.asia - E-commerce Builder
| Tier | Kondisi | Harga |
|------|---------|-------|
| **Free** | ≤9 produk | Gratis 3 bulan |
| **Starter** | ≤5 produk | Rp 35k/bulan |
| **Growth** | 6-50 produk | Rp 89k/bulan |
| **Pro** | 51-499 produk | Rp 199k/bulan |

### 2. Shifr.asia - Web Company Profile
| Item | Harga |
|------|-------|
| Subdomain (shifr.asia/bizup.id) | Rp 50k/bulan |
| Custom Domain Setup | Rp 59k (one-time) |

### 3. Bizup.id - Digital Business Card
| Item | Harga |
|------|-------|
| Standard | Rp 89k/tahun |
| Features | vCard, NFC, custom links, profile page |

---

## 🔧 Keputusan Teknis

| Area | Keputusan |
|------|-----------|
| Login System | Terpisah (shifr.asia ≠ bizup.id) |
| Subdomain | User pilih: *.shifr.asia atau *.bizup.id |
| Bahasa | Multi-language (ID + EN) |
| Syariah | Internal process - product filtering |
| WA Integration | Third-party (Dripsender/Sohibot) |
| Timeline | Max 6 bulan |
| Landing vs App | Terpisah |

---

## ⚠️ Fitur Wajib

### Reminder System
- T-30: Email | T-7: Email+WA | T-1: WA | Expire: Auto-deactivate

### Product Filtering (Syariah)
Blacklist: Rokok, Minuman keras, Produk spiritual agama lain

---

## 🏆 Kompetitor

| Kompetitor | Level |
|------------|-------|
| Lynk.id | Tinggi |
| Clicky.id | Tinggi |
| Taplink | Medium |
| Beacons.ai | Medium |

---

## ✅ Phase 1 Complete

**Next:** Implementation Plan → Sprint Breakdown → PRD

---

## 📅 Update: 21 Desember 2024

### Sprint Roadmap Reorganization

**Keputusan:**
| Item | Keputusan |
|------|-----------|
| Sprint 4 | Digital Business Card (bizup.id) - diprioritaskan |
| Sprint 5 | Website Builder (basic) |
| Sprint 6 | Subscription UI (tanpa payment) |
| Sprint 7 | Polish & Preparation |

**Deferred ke Post-Sprint 7:**
- ❌ Dripsender API (WhatsApp notifications)
- ❌ Payment Gateway (Mayar/Duitku)
- ❌ Email Notification (Mailgun/Resend)

**Alasan:** Fokus ke fitur core dulu, integrasi third-party dilakukan setelah platform stabil.

---

## ✅ Progress Update (21 Des 2024 - Sesi 1)

| Sprint | Status |
|--------|--------|
| Sprint 0-3 | ✅ Complete |
| Sprint 4 | ✅ Complete (Digital Business Card) |

---

## 📅 Update: 21 Desember 2024 - Sesi 2 (10:14 - 11:33 WIB)

### Sprint 4: Digital Business Card - COMPLETE ✅

**Backend Implemented:**
- BusinessCard model dengan vCard generation
- BusinessCardController (CRUD, photo upload, QR code)
- PublicCardController (public view, vCard download)
- API routes (protected + public)

**Frontend Implemented (web-bizup):**
- Landing page dengan hero, features, pricing
- Login & Register pages
- Dashboard layout + cards list
- Card create/edit dengan tabs (Profil/CV/Desain)
- Public card page dengan View Profile expandable
- Settings page

**Fitur CV:**
- Tentang Saya (about)
- Prestasi (achievements)
- Pengalaman Kerja (experience)
- Pendidikan (education)
- Keahlian (skills)
- Bahasa (languages)

**Fitur Warna:**
- 6 color presets (Blue Ocean, Purple Dream, Sunset, Forest, Dark, Gold)
- Custom color picker untuk gradient
- Live preview

---

## 📝 TODO: Perbaikan CV (Sesi Selanjutnya)

| Section | Perbaikan |
|---------|-----------|
| **Pengalaman Kerja** | Format periode: tahun mulai + tahun selesai + opsi "Masih Disini/Current" |
| **Prestasi** | Tambah field: tahun perolehan + organisasi pemberi |
| **Pendidikan** | Tahun = tahun lulus, format integer 4 digit (bukan string) |

---

## ✅ Progress Update (22 Des 2024 - Sesi 1)

### Perbaikan CV Format - COMPLETE ✅

**TypeScript Interfaces Updated (`api.ts`):**
- `Achievement`: Tambah `year?: number` dan `organization?: string`
- `Experience`: Ganti `period: string` → `start_year: number`, `end_year?: number`, `is_current?: boolean`
- `Education`: Ganti `year: string` → `graduation_year: number`

**Form Create/Edit Updated:**
- Pengalaman Kerja: Input tahun mulai + tahun selesai + checkbox "Masih bekerja di sini"
- Prestasi: Input tahun perolehan + organisasi pemberi
- Pendidikan: Input number untuk tahun lulus

**Public Card Display Updated:**
- Pengalaman: Format "2020 - Sekarang" atau "2018 - 2020"
- Prestasi: Tampilkan tahun • organisasi
- Pendidikan: Format "Lulus 2022"
