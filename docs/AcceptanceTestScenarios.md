# Acceptance Test Scenarios (ATS)
## Shifr Asia Platform - End-to-End Testing

**Version:** 1.0  
**Created:** 23 Desember 2024  
**Test Phase:** Post-Sprint 10 (Final QA)

---

## Document Overview

This document contains all acceptance test scenarios for the Shifr Asia platform. Testing should be performed after Sprint 10 completion to validate all features work correctly end-to-end.

### Test Scope
| Sprint | Module | Status |
|--------|--------|--------|
| 0-3 | Foundation, Auth, Dashboard, Store Frontend | ✅ Implemented |
| 4 | Digital Business Card (bizup.id) | ✅ Implemented |
| 5 | Website Builder | ✅ Implemented |
| 6 | Subscription UI | ✅ Implemented |
| 7 | Polish & Multi-language | ✅ Implemented |
| 8 | Domain System | ⏳ Pending |
| 9-10 | Commerce & Billing | ⏳ Pending |

### Pass/Fail Criteria
- **PASS**: All expected results match actual behavior
- **FAIL**: Any deviation from expected results
- **BLOCKED**: Cannot execute due to missing prerequisites

---

## Module 1: Authentication

### ATS-AUTH-001: User Registration
| Field | Value |
|-------|-------|
| **Priority** | P0 (Critical) |
| **Sprint** | 1 |
| **Preconditions** | Fresh browser, no existing account |

**Test Steps:**
1. Navigate to `/register`
2. Enter valid name, email, password
3. Click "Daftar" button
4. Observe result

**Expected Results:**
- [ ] Success message displayed
- [ ] User redirected to `/dashboard`
- [ ] User data visible in dashboard
- [ ] Token stored in localStorage

**Pass Criteria:** All checkboxes marked ✓

---

### ATS-AUTH-002: User Login
| Field | Value |
|-------|-------|
| **Priority** | P0 (Critical) |
| **Sprint** | 1 |
| **Preconditions** | Registered user exists |

**Test Steps:**
1. Navigate to `/login`
2. Enter valid email and password
3. Click "Masuk" button
4. Observe result

**Expected Results:**
- [ ] Redirect to `/dashboard`
- [ ] User name displayed in sidebar
- [ ] Navigation works correctly

---

### ATS-AUTH-003: Login with Invalid Credentials
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 1 |

**Test Steps:**
1. Navigate to `/login`
2. Enter invalid email or password
3. Click "Masuk"

**Expected Results:**
- [ ] Error message displayed
- [ ] User stays on login page
- [ ] No token stored

---

### ATS-AUTH-004: Logout
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 1 |

**Test Steps:**
1. Login successfully
2. Click "Keluar" button in sidebar
3. Observe result

**Expected Results:**
- [ ] Redirect to `/login`
- [ ] Token removed from localStorage
- [ ] Protected routes inaccessible

---

### ATS-AUTH-005: Protected Route Access
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 1 |

**Test Steps:**
1. Clear all cookies/localStorage
2. Try to access `/dashboard` directly

**Expected Results:**
- [ ] Redirect to `/login`
- [ ] Dashboard content not visible

---

## Module 2: Store Management

### ATS-STORE-001: Create Store
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 2 |
| **Preconditions** | Logged in, no store exists |

**Test Steps:**
1. Navigate to `/dashboard/store`
2. Fill store name, description
3. Enter WhatsApp number
4. Select template
5. Click "Buat Toko"

**Expected Results:**
- [ ] Success message displayed
- [ ] Store URL generated
- [ ] Store data persisted on refresh

---

### ATS-STORE-002: Update Store
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 2 |

**Test Steps:**
1. Navigate to `/dashboard/store`
2. Modify store name/description
3. Click "Simpan"

**Expected Results:**
- [ ] Success message displayed
- [ ] Changes reflected in public store

---

### ATS-STORE-003: View Public Store
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 3 |

**Test Steps:**
1. Create store with products
2. Copy store URL
3. Open URL in incognito window

**Expected Results:**
- [ ] Store page loads correctly
- [ ] Products displayed
- [ ] No login required
- [ ] WhatsApp button functional

---

## Module 3: Product Management

### ATS-PROD-001: Create Product
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 2 |

**Test Steps:**
1. Navigate to `/dashboard/products`
2. Click "Tambah Produk"
3. Fill name, price, description
4. Upload image
5. Click "Simpan"

**Expected Results:**
- [ ] Product appears in list
- [ ] Image uploaded successfully
- [ ] Product visible in public store

---

### ATS-PROD-002: Edit Product
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 2 |

**Test Steps:**
1. Go to product list
2. Click edit on existing product
3. Modify price
4. Save changes

**Expected Results:**
- [ ] Changes saved
- [ ] Updated price shown in store

---

### ATS-PROD-003: Delete Product
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 2 |

**Test Steps:**
1. Go to product list
2. Click delete on product
3. Confirm deletion

**Expected Results:**
- [ ] Product removed from list
- [ ] Product not visible in store
- [ ] No broken links

---

### ATS-PROD-004: Product Image Upload
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 2 |

**Test Steps:**
1. Create/edit product
2. Upload multiple images (3+)
3. Save product

**Expected Results:**
- [ ] All images uploaded
- [ ] Images display in gallery
- [ ] First image as thumbnail

---

### ATS-PROD-005: Product Limit by Tier
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 6 |

**Test Steps:**
1. Create Free tier account
2. Add 10 products (exceeds limit)

**Expected Results:**
- [ ] Error message shown at limit
- [ ] Upgrade prompt displayed
- [ ] Cannot add more products

---

## Module 4: Order Management

### ATS-ORD-001: WhatsApp Checkout
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 3 |

**Test Steps:**
1. Open public store
2. Click product "Pesan via WhatsApp"
3. Fill customer details
4. Submit order

**Expected Results:**
- [ ] Order created in system
- [ ] WhatsApp opens with message
- [ ] Order number generated

---

### ATS-ORD-002: View Orders (Seller)
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 3 |

**Test Steps:**
1. Login as seller
2. Navigate to `/dashboard/orders`
3. View order list

**Expected Results:**
- [ ] All orders displayed
- [ ] Order details accessible
- [ ] Status shown correctly

---

### ATS-ORD-003: Update Order Status
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 3 |

**Test Steps:**
1. Open order detail
2. Change status to "confirmed"
3. Save changes

**Expected Results:**
- [ ] Status updated
- [ ] Timestamp recorded

---

### ATS-ORD-004: Track Order (Buyer)
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 3 |

**Test Steps:**
1. Get order number
2. Go to `/track?order=XXX`
3. View order status

**Expected Results:**
- [ ] Order details shown
- [ ] Current status visible
- [ ] No login required

---

## Module 5: Digital Business Card (Bizup.id)

### ATS-CARD-001: Create Business Card
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 4 |

**Test Steps:**
1. Login to bizup.id dashboard
2. Click "Buat Kartu Baru"
3. Fill profile: name, title, company
4. Add social links
5. Save card

**Expected Results:**
- [ ] Card created with slug
- [ ] Card appears in list
- [ ] Public URL accessible

---

### ATS-CARD-002: Edit CV Sections
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 4 |

**Test Steps:**
1. Edit existing card
2. Go to "CV" tab
3. Add experience with start_year, end_year
4. Add achievement with year, organization
5. Add education with graduation_year
6. Save

**Expected Results:**
- [ ] All CV data saved
- [ ] Displayed correctly on public page
- [ ] Format: "2020 - Sekarang" for current job

---

### ATS-CARD-003: Custom Background Color
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 4 |

**Test Steps:**
1. Edit card → "Desain" tab
2. Select color preset
3. Use custom color picker
4. Preview and save

**Expected Results:**
- [ ] Preview shows selected color
- [ ] Public card uses custom color
- [ ] Gradient applied correctly

---

### ATS-CARD-004: Download vCard
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 4 |

**Test Steps:**
1. Open public card page
2. Click "Simpan Kontak"
3. Accept download

**Expected Results:**
- [ ] vCard file downloads
- [ ] File imports to contacts app
- [ ] All info imported correctly

---

### ATS-CARD-005: QR Code Generation
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 4 |

**Test Steps:**
1. Open card detail in dashboard
2. Click QR code button
3. Scan QR with phone

**Expected Results:**
- [ ] QR code displayed
- [ ] Scanning opens public card URL
- [ ] Download option available

---

### ATS-CARD-006: View Profile Expansion
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 4 |

**Test Steps:**
1. Open public card with CV data
2. Click "Lihat Profil" button
3. Scroll through CV sections

**Expected Results:**
- [ ] Smooth scroll animation
- [ ] All CV sections visible
- [ ] Proper formatting

---

## Module 6: Website Builder

### ATS-BUILD-001: Access Builder
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 5 |

**Test Steps:**
1. Login to dashboard
2. Click "Website Builder" in sidebar
3. Wait for page load

**Expected Results:**
- [ ] Builder page loads
- [ ] 3-panel layout displayed
- [ ] Existing sections shown

---

### ATS-BUILD-002: Add Section
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 5 |

**Test Steps:**
1. Open builder
2. Click "+" button
3. Select "Hero" section
4. Observe result

**Expected Results:**
- [ ] Modal closed
- [ ] New section in list
- [ ] Section visible in preview
- [ ] Section auto-selected

---

### ATS-BUILD-003: Edit Section Content
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 5 |

**Test Steps:**
1. Select section in list
2. Edit title in settings panel
3. Observe preview

**Expected Results:**
- [ ] Settings form populated
- [ ] Preview updates in real-time
- [ ] Changes not saved until submit

---

### ATS-BUILD-004: Edit Section Style
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 5 |

**Test Steps:**
1. Select section
2. Change background color
3. Change text color
4. Observe preview

**Expected Results:**
- [ ] Color picker works
- [ ] Preview shows new colors
- [ ] Contrast readable

---

### ATS-BUILD-005: Drag-Drop Reorder
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 5 |

**Test Steps:**
1. Grab section drag handle
2. Drag to new position
3. Release

**Expected Results:**
- [ ] Visual feedback during drag
- [ ] Section moves to new position
- [ ] Preview updates order
- [ ] Unsaved indicator shows

---

### ATS-BUILD-006: Toggle Section Visibility
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 5 |

**Test Steps:**
1. Click eye icon on section
2. Observe preview

**Expected Results:**
- [ ] Section opacity changes in list
- [ ] Section hidden in preview
- [ ] Click again to re-enable

---

### ATS-BUILD-007: Delete Section
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 5 |

**Test Steps:**
1. Click trash icon on section
2. Confirm deletion

**Expected Results:**
- [ ] Confirmation prompt shown
- [ ] Section removed from list
- [ ] Section removed from preview

---

### ATS-BUILD-008: Save Changes
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 5 |

**Test Steps:**
1. Make changes to sections
2. Click "Simpan" button
3. Refresh page

**Expected Results:**
- [ ] Success message shown
- [ ] "Belum disimpan" indicator gone
- [ ] Changes persist after refresh

---

### ATS-BUILD-009: Preview Mode Toggle
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 5 |

**Test Steps:**
1. Click mobile icon in header
2. Observe preview area
3. Click desktop icon

**Expected Results:**
- [ ] Preview width changes
- [ ] Mobile: narrow container
- [ ] Desktop: wide container

---

### ATS-BUILD-010: All Section Types
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 5 |

**Test Steps:**
For each section type (hero, about, features, products, gallery, testimonial, cta, contact):
1. Add section
2. Edit content
3. Verify display

**Expected Results:**
- [ ] Hero: title, subtitle, button
- [ ] About: title, description
- [ ] Features: title, items list
- [ ] Products: shows store products
- [ ] Gallery: image grid
- [ ] Testimonial: reviews with rating
- [ ] CTA: title, button
- [ ] Contact: WhatsApp button

---

## Module 7: Subscription UI

### ATS-SUB-001: View Pricing Page
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 6 |

**Test Steps:**
1. Navigate to pricing page
2. View all tiers

**Expected Results:**
- [ ] 4 tiers displayed (Free, Starter, Growth, Pro)
- [ ] Features listed per tier
- [ ] Prices shown correctly

---

### ATS-SUB-002: View Current Subscription
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 6 |

**Test Steps:**
1. Login to dashboard
2. View subscription status in settings

**Expected Results:**
- [ ] Current tier shown
- [ ] Expiry date (if applicable)
- [ ] Product limits displayed

---

### ATS-SUB-003: Upgrade Flow
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 6 |

**Test Steps:**
1. Click upgrade button
2. Select higher tier
3. Proceed to payment

**Expected Results:**
- [ ] Upgrade options shown
- [ ] Price difference calculated
- [ ] Redirects to payment

---

### ATS-SUB-004: Feature Gating
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 6 |

**Test Steps:**
1. Login as Free tier user
2. Try to access Pro feature
3. Observe result

**Expected Results:**
- [ ] Feature blocked
- [ ] Upgrade prompt shown
- [ ] Cannot bypass restriction

---

### ATS-SUB-005: Usage Stats Display
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 6 |

**Test Steps:**
1. Login to dashboard
2. Go to `/dashboard/subscription`
3. Check usage stats

**Expected Results:**
- [ ] Products used/limit shown
- [ ] Progress bar displays correctly
- [ ] Warning at 80%+ usage
- [ ] Error state at 100%

---

## Module 8: Polish & Multi-language (Sprint 7)

### ATS-LANG-001: Language Switcher
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 7 |

**Test Steps:**
1. Visit any page
2. Click language switcher
3. Select English
4. Navigate to other pages

**Expected Results:**
- [ ] All UI text in English
- [ ] Language persists across pages
- [ ] Forms labels translated
- [ ] Error messages translated

---

### ATS-LANG-002: Indonesian Default
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 7 |

**Test Steps:**
1. Open site in new browser/incognito
2. Check default language

**Expected Results:**
- [ ] Indonesian is default
- [ ] All text in Bahasa Indonesia

---

### ATS-MOBILE-001: Mobile Responsive Layout
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 7 |

**Test Steps:**
1. Open dashboard on mobile device (or Chrome DevTools mobile)
2. Navigate to all pages
3. Check layout

**Expected Results:**
- [ ] Sidebar collapsed to hamburger menu
- [ ] Cards stack vertically
- [ ] Buttons touchable (min 44px)
- [ ] No horizontal scroll

---

### ATS-MOBILE-002: Store Mobile View
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 7 |

**Test Steps:**
1. Open public store on mobile
2. Scroll through sections
3. Test product cards

**Expected Results:**
- [ ] Products in single column
- [ ] Images full width
- [ ] WhatsApp button sticky/visible
- [ ] Fast load time

---

### ATS-PERF-001: Page Load Performance
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 7 |

**Test Steps:**
1. Run Lighthouse audit on key pages
2. Check scores

**Expected Results:**
- [ ] Performance score > 70
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 4s
- [ ] No major issues

---

### ATS-ERROR-001: Error Handling
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 7 |

**Test Steps:**
1. Turn off API server
2. Try to submit form
3. Observe error message

**Expected Results:**
- [ ] User-friendly error shown
- [ ] No raw error messages
- [ ] Retry option available
- [ ] Loading states work

---

### ATS-ANALYTICS-001: Card View Analytics
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 7 |

**Test Steps:**
1. View public business card
2. Check dashboard for view count
3. Compare before/after

**Expected Results:**
- [ ] View count increments
- [ ] Dashboard shows stats
- [ ] Chart/graph displays

---

## Module 9: Domain System

### ATS-DOM-001: Default Subdomain
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 8 |

**Test Steps:**
1. Create new store
2. Note generated subdomain

**Expected Results:**
- [ ] Subdomain auto-generated from name
- [ ] Store accessible at subdomain.shifr.asia
- [ ] SSL certificate active

---

### ATS-DOM-002: Custom Domain Setup
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 8 |

**Test Steps:**
1. Go to domain settings
2. Enter custom domain
3. Follow DNS instructions
4. Verify domain

**Expected Results:**
- [ ] DNS instructions provided
- [ ] Verification succeeds after DNS setup
- [ ] SSL auto-provisioned
- [ ] Store accessible at custom domain

---

## Module 9: Payment Gateway

### ATS-PAY-001: Payment Checkout
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 9 |

**Test Steps:**
1. Select product
2. Proceed to checkout
3. Select payment method (QRIS/VA/E-wallet)
4. Complete payment

**Expected Results:**
- [ ] Payment page loads
- [ ] Multiple methods available
- [ ] Payment succeeds
- [ ] Order status updated

---

### ATS-PAY-002: Payment Callback
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 9 |

**Test Steps:**
1. Complete payment via gateway
2. Wait for callback

**Expected Results:**
- [ ] Callback received
- [ ] Order marked as paid
- [ ] Confirmation page shown

---

### ATS-PAY-003: Subscription Payment
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 10 |

**Test Steps:**
1. Select subscription tier
2. Complete payment
3. Verify subscription active

**Expected Results:**
- [ ] Payment processed
- [ ] Tier upgraded
- [ ] Features unlocked

---

### ATS-PAY-004: Invoice Generation
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 10 |

**Test Steps:**
1. Complete payment
2. View invoice

**Expected Results:**
- [ ] Invoice auto-generated
- [ ] PDF downloadable
- [ ] Details accurate

---

## Module 10: Reminder System

### ATS-REM-001: Subscription Reminder
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 10 |

**Test Steps:**
1. Set subscription to expire in 7 days
2. Wait for reminder

**Expected Results:**
- [ ] Email sent T-30
- [ ] Email+WA sent T-7
- [ ] WA sent T-1
- [ ] Auto-suspend on expiry

---

## Cross-Module Scenarios

### ATS-E2E-001: Full Seller Journey
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | All |

**Test Steps:**
1. Register new account
2. Create store
3. Add 3 products
4. Customize with builder
5. Share store URL
6. Receive order
7. Update order status

**Expected Results:**
- [ ] All steps complete without error
- [ ] Data persists correctly
- [ ] Public store functional

---

### ATS-E2E-002: Full Buyer Journey
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | All |

**Test Steps:**
1. Open store URL
2. Browse products
3. Select product
4. Submit order via WhatsApp
5. Track order status

**Expected Results:**
- [ ] Store loads correctly
- [ ] Products displayed
- [ ] Order submitted
- [ ] Tracking works

---

### ATS-E2E-003: Business Card Full Flow
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 4 |

**Test Steps:**
1. Register on bizup.id
2. Create card with all CV sections
3. Customize colors
4. Share public URL
5. Download vCard
6. View analytics

**Expected Results:**
- [ ] All features work
- [ ] Public page displays correctly
- [ ] vCard imports successfully

---

## Regression Tests

### ATS-REG-001: After Sprint 6
Test all Module 1-5 scenarios still work after Sprint 6 changes.

### ATS-REG-002: After Sprint 8
Test all Module 1-7 scenarios still work after domain system.

### ATS-REG-003: After Sprint 10
Full regression on all modules before launch.

---

## Test Environment Requirements

| Item | Requirement |
|------|-------------|
| Browser | Chrome 120+, Firefox 120+, Safari 17+ |
| Mobile | iOS Safari, Android Chrome |
| API Server | Laravel running locally or staging |
| Frontend | Next.js running locally or staging |
| Database | PostgreSQL with test data |
| WhatsApp | Test phone number for WA checkout |
| Payment | Sandbox/test gateway credentials |

---

## Module 12: Store Customization (Sprint 12)

### ATS-CUSTOM-001: Theme Color Picker
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 12 |

**Test Steps:**
1. Login to dashboard
2. Navigate to `/dashboard/store`
3. Find "Warna Tema" section
4. Use color picker to select new color
5. Click save

**Expected Results:**
- [ ] Color picker displays correctly
- [ ] Hex code input syncs with picker
- [ ] Public store header uses new color
- [ ] Profile avatar gradient uses theme color

---

### ATS-CUSTOM-002: Banner URL
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 12 |

**Test Steps:**
1. Go to store settings
2. Enter banner image URL
3. Save changes
4. View public store

**Expected Results:**
- [ ] Banner displays at top of store (Instagram template)
- [ ] Banner as hero background (Company Profile template)
- [ ] Image loads correctly
- [ ] Fallback to gradient if no banner

---

### ATS-CUSTOM-003: Social Links
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 12 |

**Test Steps:**
1. Go to store settings
2. Enter Instagram URL
3. Enter Shopee URL
4. Save changes
5. View public store

**Expected Results:**
- [ ] Social links icons appear in profile section
- [ ] Each link opens correct URL in new tab
- [ ] Icons only show for filled links

---

### ATS-CUSTOM-004: Working Hours
| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Sprint** | 12 |

**Test Steps:**
1. Go to store settings
2. Set Monday-Friday: Open 09:00-17:00
3. Set Saturday-Sunday: Closed
4. Save changes
5. View public store during open hours
6. View public store during closed hours

**Expected Results:**
- [ ] "🟢 Buka" badge during open hours
- [ ] "⚪ Tutup" badge during closed hours
- [ ] Working hours form saves correctly
- [ ] Time inputs work properly

---

### ATS-CUSTOM-005: Public Store Theme Integration
| Field | Value |
|-------|-------|
| **Priority** | P0 |
| **Sprint** | 12 |

**Test Steps:**
1. Set custom theme color (e.g., #e91e63)
2. Set banner URL
3. Add Instagram + Shopee links
4. Set working hours
5. View public store

**Expected Results:**
- [ ] Header background uses theme color
- [ ] Avatar uses theme color gradient
- [ ] Banner displays correctly
- [ ] Social links visible and clickable
- [ ] Open/Closed badge reflects current time

---

## Test Data Requirements

| Data | Quantity |
|------|----------|
| Test Users | 5 (1 per tier + admin) |
| Test Stores | 3 with products |
| Test Products | 10-15 per store |
| Test Orders | 5-10 with various statuses |
| Business Cards | 3 with full CV data |

---

## Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Tester | | | |
| Developer | | | |
| Product Owner | | | |
