# Sprint 2: Product Management - Backlog

**Sprint Period:** Week 5-6  
**Status:** ✅ Complete  
**Last Updated:** 20 Desember 2024

---

## 🎯 Sprint Goal
Membangun sistem manajemen toko dan produk, sehingga merchant dapat mengatur toko, memilih template, dan menambahkan produk.

---

## 📦 Backend Tasks

| ID | Task | Description | Status |
|----|------|-------------|--------|
| B1 | Template Model & Migration | Model Template + seed 5-7 templates | [ ] |
| B2 | Store Model & Migration | Store dengan relasi User (1:1) + Template | [ ] |
| B3 | Product Model & Migration | Product dengan relasi Store (N:1) | [ ] |
| B4 | ProductVariant Model | Varian produk (size/color) | [ ] |
| B5 | TemplateController | GET /api/templates | [ ] |
| B6 | StoreController | GET/POST/PUT /api/store | [ ] |
| B7 | ProductController | CRUD /api/products | [ ] |
| B8 | Image Upload Service | Upload gambar ke storage | [ ] |

### API Endpoints
```
# Templates
GET    /api/templates          # List available templates
GET    /api/templates/{id}     # Get template detail

# Store
GET    /api/store              # Get merchant's store
POST   /api/store              # Create store
PUT    /api/store              # Update store settings

# Products
GET    /api/products           # List products
POST   /api/products           # Create product
GET    /api/products/{id}      # Get product detail
PUT    /api/products/{id}      # Update product
DELETE /api/products/{id}      # Delete product
POST   /api/products/{id}/images  # Upload images
```

---

## 📱 Frontend Tasks

| ID | Task | Description | Status |
|----|------|-------------|--------|
| F1 | Store Settings Page | `/dashboard/store` - nama, logo, WA | [ ] |
| F2 | Template Selector | UI pilih template + preview | [ ] |
| F3 | Products List Page | `/dashboard/products` - list + search | [ ] |
| F4 | Create Product Page | `/dashboard/products/create` | [ ] |
| F5 | Edit Product Page | `/dashboard/products/[id]` | [ ] |
| F6 | Image Upload Component | Drag & drop uploader | [ ] |
| F7 | Variant Manager | UI kelola size/color variants | [ ] |

---

## 📐 Database Schema

### templates
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| name | string | "Minimalist", "Bold", etc |
| slug | string | unique |
| type | enum | store, company_profile |
| preview_image | string | URL |
| sections | json | config |
| is_premium | boolean | default false |

### stores
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| user_id | FK | unique, users |
| template_id | FK | templates |
| name | string | |
| slug | string | unique |
| description | text | nullable |
| logo | string | nullable |
| whatsapp_number | string | |
| theme_color | string | hex color |
| settings | json | |
| tier | enum | free, starter, growth, pro |

### products
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| store_id | FK | stores |
| name | string | |
| slug | string | |
| description | text | nullable |
| price | decimal | |
| compare_price | decimal | nullable |
| images | json | array of URLs |
| is_active | boolean | default true |

### product_variants
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | PK |
| product_id | FK | products |
| name | string | "size", "color" |
| value | string | "M", "Red" |
| price_modifier | decimal | default 0 |
| stock | integer | nullable |

---

## 🎨 Templates to Create

| # | Name | Style | Use Case |
|---|------|-------|----------|
| 1 | Minimalist | Clean, whitespace | Fashion, Lifestyle |
| 2 | Bold | Strong colors | Food, Events |
| 3 | Classic | Traditional | Professional |
| 4 | Modern | Gradient, sleek | Tech, Digital |
| 5 | Catalog | Grid-focused | Large inventory |

---

## ✅ Definition of Done

- [ ] Merchant bisa mengatur setting toko (nama, logo, WA)
- [ ] Merchant bisa memilih template toko dari yang tersedia
- [ ] Merchant bisa menambahkan produk baru
- [ ] Merchant bisa mengelola varian produk (size/color)
- [ ] Merchant bisa upload gambar produk
- [ ] Semua data tersimpan dan tampil di dashboard

---

## 📝 Notes
- Template preview menggunakan gambar statis di awal
- Image upload ke local storage (dev), S3 (prod)
- Variant UI menggunakan dynamic form fields
