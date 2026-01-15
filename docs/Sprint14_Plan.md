# Shifr Asia Sprint 14 - Implementation Plan
**Tanggal:** 15 Januari 2026  
**Status:** 📋 PLANNING

---

## 📋 Ringkasan Fitur

| # | Fitur | Effort | Priority |
|---|-------|--------|----------|
| 1 | **Subscription Reminder System** (30, 15, 10, 5, 3, 1, 0 hari) | 3-4 hari | 🔴 TINGGI |
| 2 | **Cloudflare R2 Image Storage** (10GB gratis, 0 egress) | 2-3 hari | 🔴 TINGGI |
| 3 | **Affiliate Management & Tracking** | 5-7 hari | 🟡 MEDIUM |
| 4 | **Premium Templates** (F&B, Fashion, Portfolio) | 3-5 hari | 🟡 MEDIUM |

---

## 🔍 Status Saat Ini

### ✅ Yang Sudah Ada:
| Komponen | Status | Lokasi |
|----------|--------|--------|
| Admin Dashboard | ✅ Ada | `/admin/payments` dengan sidebar terpisah |
| AdminMiddleware | ✅ Ada | Cek role === 'admin' |
| Subscription Expiring | ✅ Ada | Tab "Expiring Soon" di admin |
| EmailService | ✅ Ada | `sendSubscriptionReminder()` |
| WhatsAppService | ✅ Ada | `sendSubscriptionReminder()` |
| User Roles | ✅ Ada | `merchant` dan `admin` |

### ❌ Yang Belum Ada:
- Scheduler/Cron untuk auto-send reminder
- Tabel tracking reminder sudah terkirim
- Affiliate system (model, tabel, controller)
- Cloud storage (masih local)
- Template premium baru

---

## 📝 Phase 1: Subscription Reminder System

### 1.1 Jadwal Reminder

| Hari ke- | Channel | Tone |
|----------|---------|------|
| 30 | Email + WA | Info ringan |
| 15 | Email + WA | Reminder awal |
| 10 | Email + WA | Reminder |
| 5 | Email + WA | Urgency ringan |
| 3 | Email + WA | Urgency tinggi |
| 1 | Email + WA | Final reminder |
| 0 (Hari H) | Email + WA | Expired notice |

### 1.2 Database Schema

```sql
CREATE TABLE subscription_reminders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    subscription_id BIGINT NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    days_before INT NOT NULL, -- 30, 15, 10, 5, 3, 1, 0
    channel ENUM('email', 'whatsapp', 'both') DEFAULT 'both',
    email_sent_at TIMESTAMP NULL,
    wa_sent_at TIMESTAMP NULL,
    email_response JSON NULL,
    wa_response JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_reminder (subscription_id, days_before)
);
```

### 1.3 Laravel Scheduled Command
```php
// artisan subscription:send-reminders
// Dijalankan setiap jam 8 pagi WIB via cron

class SendSubscriptionReminders extends Command
{
    protected $signature = 'subscription:send-reminders';
    
    public function handle()
    {
        $checkpoints = [30, 15, 10, 5, 3, 1, 0];
        
        foreach ($checkpoints as $days) {
            $subscriptions = Subscription::expiringSoon($days)
                ->whereDoesntHave('reminders', fn($q) => 
                    $q->where('days_before', $days)
                )
                ->get();
                
            foreach ($subscriptions as $sub) {
                // Send email + WA
                $this->sendReminder($sub, $days);
            }
        }
    }
}
```

### 1.4 Admin Dashboard Enhancement

**Tambahan di Admin Panel:**

1. **Menu baru:** `Subscription Reminders`
   - List reminder yang sudah terkirim
   - Filter by days_before, channel, date
   - Status delivery (sent/failed)

2. **Manual Trigger:**
   - Tombol "Kirim Reminder Manual" per user
   - Pilih channel (Email, WA, atau Both)

3. **Settings per Tier (by Super Admin):**
   - Enable/disable reminder per tier
   - Custom message template per tier
   - Adjustable reminder schedule per tier

---

## 📝 Phase 2: Cloudflare R2 Storage

### 2.1 Cara Membuat R2 Bucket

> [!IMPORTANT]
> Karena shifr.asia sudah pakai Cloudflare DNS, Anda sudah punya akun Cloudflare!

**Step-by-Step:**

1. **Login ke Cloudflare Dashboard**
   - Buka [dash.cloudflare.com](https://dash.cloudflare.com)
   - Gunakan akun yang sama dengan DNS shifr.asia

2. **Buka Menu R2**
   - Di sidebar kiri, klik "R2" (di bawah "Storage")
   - Mungkin diminta verifikasi payment method (kartu kredit), tapi tidak akan di-charge untuk free tier

3. **Create Bucket**
   - Klik "Create bucket"
   - **Nama:** `shifr-asia` (hanya lowercase, angka, dash)
   - **Location:** Automatic (recommended)
   - Klik "Create Bucket"

4. **Enable Public Access**
   - Buka bucket `shifr-asia`
   - Klik tab "Settings"
   - Enable "Public Development URL" (untuk testing)
   - Untuk production, setup custom domain: `assets.shifr.asia`

5. **Create API Token**
   - Kembali ke halaman R2
   - Klik "Manage API tokens"
   - Klik "Create API Token"
   - **Name:** `shifr-api-access`
   - **Permissions:** Object Read & Write
   - **Bucket:** `shifr-asia`
   - Klik "Create"
   - **CATAT Access Key ID dan Secret Access Key** (hanya tampil sekali!)

### 2.2 Free Tier Limits

| Resource | Free Limit | Estimasi Kapasitas |
|----------|------------|---------------------|
| Storage | **10 GB** | ~10.000 foto produk (1MB/foto) |
| Class A (write) | 1 juta/bulan | Cukup besar |
| Class B (read) | 10 juta/bulan | Cukup besar |
| Egress | **UNLIMITED GRATIS** | Tidak ada biaya transfer! |

### 2.3 Laravel Configuration

```php
// config/filesystems.php
'disks' => [
    // ... existing disks
    
    'r2' => [
        'driver' => 's3',
        'key' => env('CLOUDFLARE_R2_ACCESS_KEY_ID'),
        'secret' => env('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
        'region' => 'auto',
        'bucket' => env('CLOUDFLARE_R2_BUCKET', 'shifr-assets'),
        'endpoint' => env('CLOUDFLARE_R2_ENDPOINT'),
        'url' => env('CLOUDFLARE_R2_URL'),
        'visibility' => 'public',
        'throw' => true,
    ],
],
```

```env
# .env
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET=shifr-assets
CLOUDFLARE_R2_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
CLOUDFLARE_R2_URL=https://assets.shifr.asia
```

---

## 📝 Phase 3: Affiliate Management

### 3.1 Commission Configuration

> [!NOTE]
> Commission rate bisa diset oleh Super Admin per paket subscription

**Default Commission Rates:**

| Tier | Commission | Contoh |
|------|------------|--------|
| Starter | 15% | Rp 35k × 15% = Rp 5.250 |
| Growth | 15% | Rp 89k × 15% = Rp 13.350 |
| Pro | 20% | Rp 199k × 20% = Rp 39.800 |

### 3.2 Database Schema

```sql
-- Affiliate Partners
CREATE TABLE affiliates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL REFERENCES users(id),
    code VARCHAR(20) NOT NULL UNIQUE, -- REZA123
    status ENUM('pending', 'active', 'suspended') DEFAULT 'pending',
    
    -- Commission settings (dapat di-override admin)
    default_commission_rate DECIMAL(5,2) DEFAULT 15.00,
    
    -- Stats
    total_referrals INT DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    pending_earnings DECIMAL(12,2) DEFAULT 0,
    
    -- Bank info for payout
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(50),
    bank_account_name VARCHAR(100),
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Per-tier commission override (set by admin)
CREATE TABLE affiliate_tier_commissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    affiliate_id BIGINT REFERENCES affiliates(id),
    tier VARCHAR(50) NOT NULL, -- starter, growth, pro
    commission_rate DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    UNIQUE KEY (affiliate_id, tier)
);

-- Tracking
CREATE TABLE affiliate_referrals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    affiliate_id BIGINT NOT NULL REFERENCES affiliates(id),
    referred_user_id BIGINT REFERENCES users(id),
    subscription_id BIGINT REFERENCES subscriptions(id),
    payment_id BIGINT REFERENCES payments(id),
    
    tier VARCHAR(50),
    commission_rate DECIMAL(5,2),
    commission_amount DECIMAL(12,2),
    
    status ENUM('pending', 'approved', 'paid', 'rejected') DEFAULT 'pending',
    paid_at TIMESTAMP NULL,
    
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Cookie tracking
CREATE TABLE affiliate_clicks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    affiliate_id BIGINT NOT NULL REFERENCES affiliates(id),
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer_url TEXT,
    landing_page TEXT,
    created_at TIMESTAMP,
    
    INDEX idx_affiliate_date (affiliate_id, created_at)
);
```

### 3.3 Affiliate Dashboard Features

**Untuk Affiliate Partner:**
- Dashboard dengan total earnings, pending, paid
- Generate & copy link referral
- Track clicks dan conversions
- Request payout (minimum Rp 100.000)
- Lihat history referral

**Untuk Admin:**
- List semua affiliate partners
- Approve/reject applications
- Set commission rate per tier
- Manage payouts
- View performance reports

---

## 📝 Phase 4: Premium Templates

### 4.1 Template Baru

| Template | Kategori | Inspirasi |
|----------|----------|-----------|
| **Foodie** | F&B | Modern food delivery, cafe menu |
| **Boutique** | Fashion | Minimal clothing store |
| **Creative** | Portfolio | Photographer, artist showcase |

### 4.2 Template Features

Setiap template akan punya:
- Mobile-first responsive design
- Customizable color scheme
- Hero section dengan CTA
- Product grid dengan filter
- Contact form atau WhatsApp button
- Social proof section
- SEO-friendly structure

---

## 🏛️ Rekomendasi Arsitektur Admin Dashboard

Berdasarkan analisis codebase, admin dashboard sudah ada di `/admin/payments`. Berikut rekomendasi struktur:

```
/admin
├── /payments          ✅ Sudah ada (Payment Dashboard)
├── /subscriptions     🆕 Subscription Reminders
├── /affiliates        🆕 Affiliate Management
├── /users             🆕 User Management
└── /settings          🆕 System Settings
```

### UX/UI Recommendations

1. **Consistent Sidebar:** Gunakan sidebar yang sama seperti `/admin/payments`
2. **Color Coding:** Tetap gunakan `second` color untuk admin (membedakan dari user dashboard)
3. **Quick Stats Cards:** Overview di atas, detail di bawah
4. **Action Buttons:** Tombol aksi jelas (Approve, Reject, Send Reminder)
5. **Real-time Alerts:** Badge notification untuk item yang perlu perhatian

---

## ⏳ Timeline

| Minggu | Task | Deliverable |
|--------|------|-------------|
| 1 | Cloudflare R2 Setup | Image upload berfungsi |
| 1-2 | Subscription Reminders | Scheduler + tracking |
| 2-3 | Affiliate Backend | Database + API |
| 3 | Affiliate Dashboard | Admin + user UI |
| 4 | Premium Templates | 3 template baru |

---

## 🔧 Environment Variables Baru

```env
# Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=shifr-assets
CLOUDFLARE_R2_ENDPOINT=https://ACCOUNT_ID.r2.cloudflarestorage.com
CLOUDFLARE_R2_URL=https://assets.shifr.asia

# Affiliate Settings
AFFILIATE_MIN_PAYOUT=100000
AFFILIATE_DEFAULT_COMMISSION=15
```

---

*Last Updated: 15 Januari 2026*
