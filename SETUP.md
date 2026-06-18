# Dr. Madhiraj Sairathan Platform — Setup Guide

## Quick Start (Local Development)

```bash
cd madhiraj-platform
npm run dev
# Open http://localhost:3000
```

## Tech Stack
- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **OTP:** MSG91 or Fast2SMS
- **Hosting:** Vercel (frontend) + Supabase (DB)

---

## Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your **Project URL** and **anon key** from Settings → API
3. Go to SQL Editor → run the file `supabase/schema.sql` to create all tables
4. Update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## Step 2: Configure OTP (MSG91)

1. Sign up at [msg91.com](https://msg91.com)
2. Get API Key and create an SMS template
3. Update `.env.local`:
   ```
   MSG91_API_KEY=your-key
   MSG91_TEMPLATE_ID=your-template-id
   ```

**Dev mode:** Without MSG91 configured, OTPs are printed to the terminal console.

---

## Step 3: Deploy to Vercel

```bash
npm install -g vercel
vercel
# Follow prompts, add environment variables from .env.local
```

Or connect your GitHub repo to Vercel for auto-deploy.

---

## Pages Built

| Page | URL | Status |
|------|-----|--------|
| Home | / | ✅ |
| About | /about | ✅ |
| Our Mission | /mission | ✅ |
| Community Hub | /community | ✅ |
| Join Flow | /community/join | ✅ (6-step with OTP) |
| Impact & Numbers | /impact | ✅ |
| Events | /events | ✅ |
| Blog | /blog | ✅ |
| Donate | /donate | ✅ |
| Contact | /contact | ✅ |
| Media & News | /media | ✅ |
| Privacy Policy | /privacy | ✅ |
| Admin Dashboard | /admin | ✅ (password: sunnyannaadmin2025) |

---

## Admin Dashboard

Visit `/admin` and enter password: `sunnyannaadmin2025`

**Change the admin password** before going live! Edit the `ADMIN_PASS` constant in `app/admin/page.tsx`.

### Admin features:
- View total members, live stats
- Export members as CSV
- Update impact numbers (lives impacted, events, etc.)
- Send broadcast messages (requires MSG91)
- View all member list

---

## Adding Real Photos

Replace the photo placeholders throughout the site:
1. Add photos to `public/images/`
2. Replace placeholder `div`s with `<Image>` components from `next/image`

Key locations:
- `app/page.tsx` — Hero section and Story teaser
- `app/about/page.tsx` — Portrait and story photo

---

## Seeding Initial Members (Before Public Launch)

Import existing WhatsApp/Instagram followers before launch so the member wall isn't empty:

```sql
-- Run in Supabase SQL Editor
INSERT INTO members (member_number, full_name, phone, city, district, display_on_wall, consent_given)
VALUES 
  (1, 'Ravi Kumar', '9876543210', 'Warangal', 'Warangal Urban', true, true),
  (2, 'Lakshmi Devi', '9876543211', 'Bhupalpally', 'Jayashankar', true, true);
```

---

## Updating Live Impact Numbers

1. Go to `/admin`
2. Use "Update Impact Numbers" section
3. Enter the new verified value and click Save

Or update directly in Supabase:
```sql
UPDATE impact_stats SET value = 5284 WHERE key = 'lives_impacted';
```

---

## Domain Configuration

1. Buy/connect `madhirajsairathan.com` on Vercel
2. Update `NEXT_PUBLIC_SITE_URL` in `.env.local`
3. Update WhatsApp community link in `app/contact/page.tsx`

---

## Design System

| Element | Value |
|---------|-------|
| Primary Navy | `#1A237E` |
| Accent Amber | `#FF6F00` |
| Accent Crimson | `#E53935` |
| Background | `#FFFFFF` |
| Light Fill | `#E8EAF6` |
| Text | `#111111` |
| Muted | `#555555` |

**Signature motif:** Rising diagonal lines (represent "always moving forward") used in hero, dividers, and ID card.

---

## WhatsApp Business Integration (Later Phase)

To let people join via WhatsApp:
1. Set up WhatsApp Business API via Meta
2. Create keyword trigger "JOIN" 
3. Auto-respond with registration link + confirmation
4. Deliver ID card as image in chat

---

## Files Structure

```
madhiraj-platform/
├── app/
│   ├── page.tsx              # Home
│   ├── about/page.tsx        # About Sunny Anna
│   ├── mission/page.tsx      # 4 Mission Pillars
│   ├── community/page.tsx    # Community Hub
│   ├── community/join/       # 6-step join flow
│   ├── impact/page.tsx       # Impact stats
│   ├── events/page.tsx       # Events
│   ├── blog/page.tsx         # Blog
│   ├── donate/page.tsx       # Donations
│   ├── contact/page.tsx      # Contact
│   ├── media/page.tsx        # Media & News
│   ├── privacy/page.tsx      # Privacy Policy
│   ├── admin/page.tsx        # Admin Dashboard
│   └── api/
│       ├── stats/            # Live counter API
│       ├── members/recent/   # Member wall API
│       ├── members/register/ # Registration API
│       ├── otp/send/         # OTP send
│       └── otp/verify/       # OTP verify
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CounterStrip.tsx      # Live impact counters
│   ├── MissionPillars.tsx    # 4 pillars grid
│   ├── CommunityJoinCTA.tsx  # Join CTA section
│   ├── MemberWallPreview.tsx # Recent members
│   ├── TestimonialsSlider.tsx
│   └── ActivityTicker.tsx    # Scrolling ticker
├── lib/
│   ├── supabase.ts           # DB client
│   └── utils.ts              # Helpers
├── supabase/
│   └── schema.sql            # Full DB schema
└── .env.local                # Environment variables
```
