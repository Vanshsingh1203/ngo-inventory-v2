# NGO Inventory Manager

A full-stack donation tracking and distribution platform built for nonprofit organizations. Covers the entire donation lifecycle — intake, warehousing, distribution, and impact reporting — with role-based access, bilingual support, automated email receipts, and a neumorphic design system.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB%20%2B%20Edge%20Functions-3ECF8E?logo=supabase&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Cost](https://img.shields.io/badge/Hosting%20Cost-$0%2Fmonth-brightgreen)
![WCAG](https://img.shields.io/badge/Accessibility-WCAG%20AA-4F46E5)

---

## The Problem

Small-to-medium NGOs manage donations through paper logs and spreadsheets — no real-time visibility, no donor receipts, no way to track where an item went or who received it. Volunteers waste hours counting inventory, and year-end reports take days to compile.

## The Solution

A free, browser-based system that tracks every donation from arrival to distribution. Any device, any browser, four user roles, real-time sync across all devices. At year-end, one click downloads a full Excel report.

---

## Features

### Donation Intake
- Log physical donations across **7 categories**: Clothing, Footwear, Toiletries, Household, Food, Gift Cards, Miscellaneous — each with typed subcategories and condition grading (New / Gently Used / Worn / Unusable)
- Record **estimated cost per item** with automatic total displayed before submission
- Flag items as **Urgent** to surface them prominently in the inventory view
- Track donors as individuals or organizations with name, email, and phone
- Deduplicate donor records by email on every submission
- Auto-generate unique **Item IDs** in the format `{CAT}-{YYYYMMDD}-{SEQUENCE}` (e.g. `CLO-20240415-0003`)
- Full-review confirmation modal before every save

### Automated Email Receipts
- When a donor email is provided, the app fires a **Supabase Edge Function** (Deno) that calls the Resend API
- The donor receives a formatted HTML email with their name, receipt ID, itemized donation table, estimated total value, date, and a tax deduction notice
- Receipt delivery runs in the background — zero latency impact on the intake form

### Warehouse Management
- **Interactive 2D floor plan** SVG showing 6 storage zones (A–F), each color-coded by category:
  - A (Blue) → Clothing
  - B (Green) → Food
  - C (Amber) → Household
  - D (Pink) → Toiletries
  - E (Purple) → Footwear
  - F (Gray) → Miscellaneous
- 24 individually trackable shelf slots (A1–A4 through F1–F4) with live item counts per shelf
- Assigning a shelf highlights it on the floor plan in real time
- Search inventory by item ID, donor name, or category; filter by status
- Admins can mark items as **Sold** (capturing sale price and date) or delete records

### Distribution
- **Cart-based workflow**: browse available (In Storage) items, add to basket, adjust quantities per item
- Recipient management with full visit history — warns if a recipient visited within the last 7 days
- Support for existing recipients (searchable by name/phone) and new registrations (individual or family with family size)
- Distribution records capture quantity, recipient, staff member, date, and people count

### Gift Card Tracking
- Separate tracking flow for retail, grocery, gas, restaurant, and other gift card types
- Pie chart showing value breakdown by company; full chronological transaction list

### Reports & Analytics
- **Dashboard**: live stat cards for items received, in storage, distributed, gift card total, people served, and sales revenue
- Bar chart (inventory by category), pie chart (status breakdown), trend chart (monthly/yearly toggle)
- **Year-end impact report**: distribution rate, unique donors, people served, families served, individuals served, sales revenue, estimated inventory value, category received-vs-distributed comparison
- **One-click Excel export** (.xlsx) — separate sheets for Summary, Items, and Gift Cards (admin only)

### Activity Calendar
- Monthly calendar showing which days had activity (donations, distributions, gift cards) via color-coded badges
- Click any day for a full breakdown of what was received, distributed, and gifted

### Per-Page Tutorial System
- Spotlight-style guided tour for **every section of the app**, triggered by the Help (?) button
- Each tab has its own 2–4 step walkthrough targeting the actual UI elements on screen
- Global 5-step onboarding runs automatically on first login; returns to the current tab's tutorial on subsequent help requests
- All tutorial content available in both **English and Spanish**
- `Escape` key always dismisses the tutorial or any open modal

---

## Access Control

| Tab | Admin | Reception | Distribution | Inventory |
|-----|-------|-----------|--------------|-----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Receive Donations | ✅ | ✅ | — | — |
| Inventory | ✅ | — | — | ✅ |
| Distribute | ✅ | — | ✅ | — |
| Gift Cards | ✅ | ✅ | — | — |
| Reports + Export | ✅ | — | — | — |
| Calendar | ✅ | ✅ | ✅ | ✅ |

---

## System Flow

```
Donor arrives
  → Reception logs donation via web form (category, condition, quantity, donor info)
      → Confirmation modal → Item saved with unique ID
          → If email provided → automated receipt sent to donor via Resend
              → Inventory volunteer selects shelf on floor plan → Item moves to "In Storage"
                  → Distribution volunteer browses available items → Adds to cart
                      → Selects or registers recipient → Confirms distribution
                          → Dashboard and reports update in real time
                              → Admin downloads Excel at year-end
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 19 |
| Authentication | Supabase Auth (email/password) |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Real-time sync | Supabase Realtime (postgres_changes) |
| Email | Resend API via Supabase Edge Function (Deno) |
| Charts | Recharts |
| Icons | Lucide React |
| Excel export | SheetJS (xlsx) |
| Styling | Inline CSS with JS theme tokens — no CSS framework |
| Fonts | Google Fonts — Plus Jakarta Sans + DM Sans |

**Total monthly cost: $0** (Supabase free tier + Resend free tier)

---

## Database Schema

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | FK → auth.users |
| full_name | text | |
| role | text | `admin` `reception` `distribution` `inventory` |

### `items`
| Column | Type | Notes |
|--------|------|-------|
| id | text | e.g. `CLO-20240415-0003` |
| cat | text | Category code (CLO, FOO, TOI…) |
| cat_name | text | Display name |
| sub | text | Subcategory |
| qty | int | |
| condition | text | New / Gently Used / Worn / Unusable |
| status | text | Received / In Storage / Distributed / Sold |
| location | text | Shelf code (A1–F4) |
| donor | text | |
| donor_email | text | |
| donor_phone | text | |
| estimated_cost | float | Per-item estimated value |
| sale_price | float | Populated when Sold |
| sold_date | date | |
| urgent | boolean | |
| notes | text | |
| date | date | Donation date |
| created_by | uuid | FK → profiles |

### `gift_cards`
| Column | Type |
|--------|------|
| id | text |
| company | text |
| amount | float |
| donor_name | text |
| donor_email | text |
| date | date |

### `distributions`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| recipient_id | uuid | FK → recipients |
| quantity | int | |
| people_count | int | |
| distribution_type | text | `individual` or `family` |
| date | date | |
| distributed_by | uuid | FK → profiles |
| notes | text | |

### `recipients`
| Column | Type |
|--------|------|
| id | uuid |
| name | text |
| phone | text |
| type | text |
| family_size | int |
| last_visit | date |
| visit_count | int |

### `donors`
| Column | Type |
|--------|------|
| id | uuid |
| name | text |
| email | text |
| phone | text |
| type | text |
| organization_name | text |
| donation_count | int |
| first_donation_date | date |
| last_donation_date | date |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier is sufficient)
- A [Resend](https://resend.com) account (free tier: 3,000 emails/month)

### 1. Clone and install

```bash
git clone https://github.com/Vanshsingh1203/ngo-inventory-v2.git
cd ngo-inventory-v2
npm install
```

### 2. Configure environment

Create `.env.local` in the project root:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set up the database

In the Supabase SQL editor, create the tables from the schema above and enable Row Level Security with appropriate policies. Enable **Realtime** on the `items`, `distributions`, `gift_cards`, and `recipients` tables.

Create user accounts in Supabase Auth, then insert corresponding rows in `profiles` with the correct role.

### 4. Deploy the email Edge Function

```bash
# Install Supabase CLI
npm install -g supabase

# Log in and link to your project
supabase login
supabase link --project-ref your-project-ref

# Set the Resend API key as a secret
supabase secrets set RESEND_API_KEY=re_your_resend_key

# Deploy
supabase functions deploy send-receipt
```

### 5. Run locally

```bash
npm start
# → http://localhost:3000
```

### 6. Build for production

```bash
npm run build
```

Deploy the `build/` folder to Vercel, Netlify, or any static host. Add the two environment variables in your hosting dashboard.

---

## Item ID Format

```
{CATEGORY_CODE}-{YYYYMMDD}-{SEQUENCE}
```

| Code | Category |
|------|----------|
| CLO | Clothing |
| FOO | Footwear |
| TOI | Toiletries |
| HOU | Household |
| FOD | Food |
| GFT | Gift Card |
| MIS | Miscellaneous |

**Example:** `TOI-20240601-0012` = the 12th toiletries item logged on June 1, 2024.

---

## Design System

The UI uses a **Neumorphic (Soft UI)** design system built with JavaScript theme tokens — no CSS framework.

**Light mode**
```
Surface:       #E0E5EC  (cool clay)
Accent:        #4F46E5  (indigo)  — 4.5:1 contrast on surface ✓ WCAG AA
Body text:     #2D3748  (charcoal) — 8.9:1 ✓ WCAG AAA
Muted text:    #4B5563  (slate)    — 5.2:1 ✓ WCAG AA
Card shadow:   9px 9px 16px rgb(163,177,198,0.6),
               -9px -9px 16px rgba(255,255,255,0.5)
```

**Dark mode**
```
Surface:       #13151C  (deep navy — not pure black)
Card:          #1B1E2A
Accent:        #818CF8  (indigo-400)
Card shadow:   8px 8px 16px #0D0F15,
               -8px -8px 16px rgba(255,255,255,0.04)
```

**Fonts:** Plus Jakarta Sans (headings, 500–800) + DM Sans (body, 400/500/700) via Google Fonts.

All interactive element contrast ratios meet **WCAG 2.1 AA** (4.5:1 minimum for normal text).

---

## Project Structure

```
ngo-inventory-v2/
├── public/
│   └── index.html                  # Google Fonts preconnect + app shell
├── src/
│   ├── App.js                      # Complete React frontend (single-file)
│   ├── index.css                   # Base reset, body font, scrollbar
│   └── supabaseClient.js           # Supabase client initialization
├── supabase/
│   └── functions/
│       └── send-receipt/
│           └── index.ts            # Deno edge function — Resend email receipts
└── package.json
```

---

## Localization

Full English / Spanish support. All strings are defined in the `T` object at the top of `App.js`:

```js
const T = {
  en: { dashboard: "Dashboard", receive: "Receive", ... },
  es: { dashboard: "Tablero",   receive: "Recibir",  ... },
};
```

The language toggle in the top-right header switches all labels, placeholders, error messages, and tutorial content instantly — no page reload.

---

## What Changed from V1

- Role-based access with 4 distinct user types
- Interactive 2D warehouse floor plan with per-shelf item counts
- Cart-based distribution workflow
- Recipient tracking with visit history and duplicate detection
- Gift card tracking tab
- Activity calendar view
- Automated email receipts via Resend + Supabase Edge Functions
- Per-page interactive tutorial system (7 tab-specific walkthroughs)
- Neumorphic design system (light mode clay + dark mode deep navy)
- WCAG AA compliant color palette
- Full English / Spanish bilingual support
- Responsive layout for tablet and mobile
- Excel export with multi-sheet workbook

---

## Author

**Vansh Singh**
MS in Engineering Management — Northeastern University
BE in Mechanical Engineering — Vellore Institute of Technology

---

## License

MIT — free to use, modify, and deploy for nonprofit and humanitarian purposes.
