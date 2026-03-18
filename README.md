# NGO Inventory Management System V2

A production-grade donation tracking and distribution platform built for nonprofit organizations. Features role-based authentication, real-time multi-device sync, bilingual support, dark mode, and comprehensive reporting.

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%2B%20Auth-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Cost](https://img.shields.io/badge/Hosting%20Cost-$0%2Fmonth-brightgreen)

---

## The Problem

Small-to-medium NGOs manage donations manually using paper logs and spreadsheets, leading to no real-time visibility, lost items between reception and distribution, hours of manual counting for reports, and no way to tell donors how their contributions were used.

## The Solution

A free, web-based inventory system that tracks every donation from arrival to distribution. Works on any device with a browser. Four user roles ensure each volunteer sees only what they need.

---

## Features

### Authentication & Roles
Four access levels — Admin (full access), Reception (receive and log donations), Inventory (manage storage), and Distribution (distribute items). Each role sees only their relevant tabs. Supabase Auth handles login with email/password. Sessions persist across refreshes.

### Donation Reception
Simple form-based entry with dropdown categories. Seven broad categories covering Clothing, Footwear, Toiletries, Household, Food, Monetary, and Miscellaneous. Confirmation modal with full review before every submission. Auto-generated unique tracking IDs. Urgent/perishable flagging for time-sensitive items. Separate flow for monetary donations.

### Inventory Management
Searchable and filterable inventory table. Volunteers manually enter shelf locations when moving items to storage. Admin can soft-delete entries with warning confirmation. Deleted items are hidden but preserved in the database for audit trail.

### Distribution & People Served
Look up items by ID from the available inventory list. Quantity validation prevents distributing more than available stock. Supports partial distribution from bulk items. Tracks recipient type — Individual or Family. If Family, records the number of people. All distribution data feeds into dashboard and reports.

### Live Dashboard
Real-time stat cards for items received, in storage, distributed, monetary total, people served, and urgent items. Bar chart for inventory by category. Pie chart for status breakdown. Monthly/Yearly toggle for donation trend analysis.

### Reports & Excel Export (Admin Only)
Year-end executive summary with all key metrics including distribution rate, unique donors, people served, families served, and individuals served. Category breakdown chart comparing received vs distributed. One-click Excel download generating a .xlsx file with four sheets — Items, Monetary, Distributions, and Summary.

### Bilingual Support
English/Spanish toggle in the header. All UI labels, buttons, placeholders, error messages, and tutorial text switch instantly. Language preference saved per user in the database.

### Dark Mode
Light/dark theme toggle in the header. Full theme system covering backgrounds, cards, inputs, tables, charts, tooltips, and modals. Preference persists in browser storage. Available on both login screen and main app.

### Onboarding Tutorial
Spotlight-style walkthrough highlighting actual UI elements. Tooltip appears next to each highlighted feature. Shows automatically on first login, skippable. Re-accessible anytime via the help icon. Available in both English and Spanish. Completion remembered in the database.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend framework |
| Supabase Auth | Authentication and user roles |
| Supabase Database | PostgreSQL storage with Row Level Security |
| Supabase Realtime | Live sync across devices |
| Recharts | Charts and data visualization |
| Lucide React | Icon library |
| SheetJS (xlsx) | Client-side Excel generation |
| Vercel | Hosting and auto-deployment |

**Total monthly cost: $0**

---

## Database Schema

**profiles** — User accounts linked to Supabase Auth with role, language preference, and tutorial completion status.

**items** — Physical donations with category, subcategory, quantity, condition, donor, status, shelf location, urgency flag, soft-delete flag, and creator reference.

**monetary** — Cash, check, and transfer donations with amount, type, donor, purpose, and soft-delete flag.

**distributions** — Distribution records tracking item reference, quantity distributed, recipient type (individual/family), people count, and distributor reference.

---

## User Roles

| Role | Access |
|------|--------|
| Admin | Dashboard, Receive, Inventory, Distribute, Monetary, Reports, Delete entries, Excel download |
| Reception | Receive donations, Log monetary donations |
| Inventory | View inventory, Move items to storage with shelf location |
| Distribution | Distribute items, Record recipients |

---

## System Flow

```
Donor arrives → Reception volunteer logs donation via web form
    → Confirmation modal → Item saved with unique ID
        → Inventory volunteer assigns shelf location → Moves to storage
            → Distribution volunteer looks up item → Selects quantity
                → Chooses Individual or Family → Records people count
                    → Dashboard updates in real-time across all devices
                        → Admin downloads Excel report at year-end
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- A free Supabase account
- A free Vercel account

### 1. Clone and Install

```bash
git clone https://github.com/Vanshsingh1203/ngo-inventory-v2.git
cd ngo-inventory-v2
npm install
```

### 2. Set Up Supabase

Create a new project at supabase.com. Run the SQL setup in the SQL Editor to create the profiles, items, monetary, and distributions tables with Row Level Security policies and realtime subscriptions. Create user accounts in Authentication and assign roles in the profiles table.

### 3. Configure Environment

Create `.env.local` in the project root:

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Locally

```bash
npm start
```

### 5. Deploy to Vercel

Push to GitHub, import into Vercel, add the environment variables, and deploy. Site is live in under 3 minutes.

---

## What Changed from V1

- Role-based login system (Admin, Reception, Inventory, Distribution)
- Modern UI with sidebar navigation and professional icons
- Dark mode toggle
- English/Spanish language switching
- Confirmation modals before every submission
- Delete entries with warning prompts
- Manual shelf location input for inventory
- Quantity validation on distribution (can't exceed stock)
- People served tracking (Individual vs Family)
- Monthly/Yearly trends toggle on dashboard
- Excel report download for admins
- Interactive onboarding tutorial for new users
- Removed barcode system
- Real-time sync across all devices
- Soft delete for audit trail

---

## Author

**Vansh Singh**
- MS in Engineering Management — Northeastern University
- BE in Mechanical Engineering — Vellore Institute of Technology

## License

MIT — free to use, modify, and distribute.
