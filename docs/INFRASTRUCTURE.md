# ===========================================
# FREE-TIER Infrastructure Guide
# ===========================================

## Overview

Platform Shifr Asia menggunakan strategi FREE-tier untuk meminimalkan biaya:
- **Target:** $0/month sampai 2k users
- **Scalable:** <$20/month sampai 10k users

---

## Services & Free Limits

| Service | Provider | Free Tier | Limit |
|---------|----------|-----------|-------|
| Frontend | Vercel | ✅ Free | 100GB bandwidth/month |
| Backend | Render | ✅ Free | 750 hours/month |
| Database | Supabase | ✅ Free | 500MB + 50k MAU |
| Cache | Upstash Redis | ✅ Free | 10k commands/day |
| Storage | Cloudflare R2 | ✅ Free | 10GB storage |
| CDN | Cloudflare | ✅ Free | Unlimited |
| Email | Resend | ✅ Free | 3k emails/month |
| DNS | Cloudflare | ✅ Free | Unlimited |

---

## Setup Instructions

### 1. Supabase (Database)

```bash
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Get connection string from Settings > Database
# 4. Update .env with:
DB_CONNECTION=pgsql
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-password
```

### 2. Render (Backend)

```bash
# 1. Go to https://render.com
# 2. Connect GitHub repo
# 3. Create new "Blueprint" from render.yaml
# 4. Or create Web Service manually:
#    - Docker, Singapore region, Free plan
```

### 3. Vercel (Frontend)

```bash
# 1. Go to https://vercel.com
# 2. Import GitHub repo
# 3. Select apps/web-shifr as root
# 4. Add environment variables:
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
```

### 4. Upstash Redis (Cache) - Optional

```bash
# 1. Go to https://upstash.com
# 2. Create Redis database (Singapore)
# 3. Get REST credentials
# 4. Update .env with:
REDIS_HOST=your-redis.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-password
```

### 5. Cloudflare R2 (Storage) - Optional

```bash
# 1. Go to https://dash.cloudflare.com
# 2. Create R2 bucket
# 3. Get API credentials
# 4. Update config/filesystems.php
```

### 6. Resend (Email)

```bash
# 1. Go to https://resend.com
# 2. Get API key
# 3. Update .env:
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PASSWORD=re_xxxxx
```

---

## Domain Setup

### shifr.asia → Vercel

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### api.shifr.asia → Render

```
Type: CNAME
Name: api
Value: your-service.onrender.com
```

---

## Cost Estimation

| Users | Monthly Cost |
|-------|--------------|
| 0 - 2,000 | $0 |
| 2,000 - 5,000 | ~$7 (Render paid) |
| 5,000 - 10,000 | ~$15 |
| 10,000+ | ~$25+ |

---

## GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `RENDER_SERVICE_ID` | Render service ID |
| `RENDER_API_KEY` | Render API key |
| `VERCEL_TOKEN` | Vercel deployment token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
