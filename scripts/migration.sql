-- ═══════════════════════════════════════════════════════════════
-- SUNNY ANNA YUVASENA — FULL DATABASE MIGRATION
-- Run once in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/sduofgjtelvvdukntyct/sql/new
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- 1. MEMBERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.members (
  id              BIGSERIAL PRIMARY KEY,
  member_number   INTEGER UNIQUE,
  full_name       TEXT NOT NULL,
  phone           TEXT NOT NULL,
  city            TEXT NOT NULL DEFAULT '',
  district        TEXT NOT NULL DEFAULT '',
  interest_area   TEXT NOT NULL DEFAULT '',
  how_found       TEXT NOT NULL DEFAULT '',
  display_on_wall BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE SEQUENCE IF NOT EXISTS member_number_seq START WITH 1001 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION assign_member_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.member_number IS NULL THEN
    NEW.member_number := nextval('member_number_seq');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_member_number ON public.members;
CREATE TRIGGER trg_member_number
  BEFORE INSERT ON public.members
  FOR EACH ROW EXECUTE FUNCTION assign_member_number();

-- ─────────────────────────────────────────────
-- 2. OTP VERIFICATIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id         BIGSERIAL PRIMARY KEY,
  phone      TEXT NOT NULL,
  otp_code   TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '10 minutes'),
  verified   BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 3. IMPACT STATS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.impact_stats (
  id         BIGSERIAL PRIMARY KEY,
  key        TEXT UNIQUE NOT NULL,
  label      TEXT NOT NULL DEFAULT '',
  value      BIGINT NOT NULL DEFAULT 0,
  suffix     TEXT NOT NULL DEFAULT '+',
  icon       TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.impact_stats (key, label, value, suffix, icon) VALUES
  ('lives_impacted',    'Lives Impacted',    50000, '+', '❤️'),
  ('events',            'Events Conducted',  120,   '+', '📅'),
  ('social_followers',  'Social Followers',  25000, '+', '👥'),
  ('districts_covered', 'Districts Covered', 15,    '',  '🗺️'),
  ('volunteers',        'Active Volunteers', 500,   '+', '🙌')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────
-- 4. EVENTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date        DATE NOT NULL,
  location    TEXT NOT NULL DEFAULT '',
  district    TEXT NOT NULL DEFAULT '',
  type        TEXT NOT NULL DEFAULT 'General',
  image_url   TEXT NOT NULL DEFAULT '',
  rsvp_count  INTEGER NOT NULL DEFAULT 0,
  is_upcoming BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.events (title, description, date, location, district, type, rsvp_count, is_upcoming) VALUES
  ('Free Medical Camp',
   'Comprehensive health screening, blood sugar, BP checks, dental camp, and specialist consultations.',
   '2025-07-15', 'Bhupalpally', 'Jayashankar Bhupalpally', 'Healthcare', 200, false),
  ('Youth Leadership Summit',
   'Two-day leadership intensive for college students. Entrepreneurship, public speaking, civic leadership.',
   '2025-07-22', 'Warangal', 'Warangal', 'Youth', 150, false),
  ('Women Entrepreneurship Workshop',
   'Business fundamentals, digital payments, and government schemes for women entrepreneurs.',
   '2025-08-05', 'Karimnagar', 'Karimnagar', 'Women', 80, false),
  ('Blood Donation Drive',
   'Community blood donation camp in partnership with Red Cross.',
   '2025-05-20', 'Warangal', 'Warangal', 'Healthcare', 120, false),
  ('School Book Distribution',
   'Free textbooks and stationery for government school students.',
   '2025-05-01', 'Nalgonda', 'Nalgonda', 'Education', 250, false)
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- 5. BLOG POSTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id           BIGSERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  excerpt      TEXT NOT NULL DEFAULT '',
  content      TEXT NOT NULL DEFAULT '',
  image_url    TEXT NOT NULL DEFAULT '',
  category     TEXT NOT NULL DEFAULT 'General',
  author       TEXT NOT NULL DEFAULT 'Dr. Madhiraj Sairathan',
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed one sample post
INSERT INTO public.blog_posts (title, slug, excerpt, content, category, author, published_at) VALUES
  (
    'Why Telangana''s Villages Need You — Not Your Pity',
    'why-telangana-villages-need-you',
    'Real change does not come from charity. It comes from showing up, listening, and working alongside communities.',
    'Real change does not come from charity. It comes from showing up, listening, and working alongside communities. Across Telangana, thousands of young people are already doing exactly that.

## The Ground Reality

When we first visited remote hamlets in Mulugu district, we expected to find helplessness. What we found instead was extraordinary resilience — women running self-help groups, youth organising tutoring circles, farmers experimenting with drip irrigation. The infrastructure was absent. The will was not.

## What ''Development'' Gets Wrong

Top-down programmes often define communities by what they lack. A road not built. A hospital not built. A scheme not utilised. But every village also has a skilled midwife, a farmer who experiments every season, a young woman who dreams of medicine. Development means amplifying these — not replacing them.

## What We Are Building

Sunny Anna Yuvasena connects these local leaders with resources, mentorship, and a statewide network. A medical camp is one day — but the health awareness it builds lasts years. A scholarship is one year — but the confidence it plants lasts a lifetime.

## How You Can Help

You do not need to come from money or have a degree in social work. You need three things: time, sincerity, and the willingness to listen before you speak. Join us at any event near you. Start small. Let the community teach you first.',
    'Community', 'Dr. Madhiraj Sairathan', now()
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- 6. TESTIMONIALS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.testimonials (
  id            BIGSERIAL PRIMARY KEY,
  quote         TEXT NOT NULL,
  name          TEXT NOT NULL,
  location      TEXT NOT NULL DEFAULT '',
  role          TEXT NOT NULL DEFAULT '',
  photo_url     TEXT NOT NULL DEFAULT '',
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  consent_given BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.testimonials (quote, name, location, role, is_featured) VALUES
  (
    'The free medical camp reached our village for the first time in memory. My mother got treated for diabetes she did not even know she had. Sunny Anna gives hope to people like us.',
    'Ramaiah Naik', 'Mulugu District', 'Farmer', true
  ),
  (
    'I was the first girl from my village to attend college. The scholarship support and mentorship from this network changed everything for me and my family.',
    'Priya Lakshmi', 'Bhupalpally', 'Engineering Student', true
  ),
  (
    'Our self-help group of 20 women now runs a profitable business. The training workshops gave us not just skills — they gave us confidence to dream bigger.',
    'Saraswati Devi', 'Karimnagar', 'SHG Leader', true
  )
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- 7. CONTACT SUBMISSIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 8. GALLERY ITEMS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id           BIGSERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  tag          TEXT NOT NULL DEFAULT 'General',
  image_url    TEXT NOT NULL DEFAULT '',
  storage_path TEXT NOT NULL DEFAULT '',
  is_visible   BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE public.members              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_stats         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items        ENABLE ROW LEVEL SECURITY;

-- Public read
DROP POLICY IF EXISTS "public_read_stats"        ON public.impact_stats;
DROP POLICY IF EXISTS "public_read_events"        ON public.events;
DROP POLICY IF EXISTS "public_read_blog"          ON public.blog_posts;
DROP POLICY IF EXISTS "public_read_testimonials"  ON public.testimonials;
DROP POLICY IF EXISTS "public_read_gallery"       ON public.gallery_items;
DROP POLICY IF EXISTS "member_insert"             ON public.members;
DROP POLICY IF EXISTS "member_select"             ON public.members;
DROP POLICY IF EXISTS "otp_insert"                ON public.otp_verifications;
DROP POLICY IF EXISTS "otp_select"                ON public.otp_verifications;
DROP POLICY IF EXISTS "otp_update"                ON public.otp_verifications;
DROP POLICY IF EXISTS "contact_insert"            ON public.contact_submissions;

CREATE POLICY "public_read_stats"        ON public.impact_stats        FOR SELECT USING (true);
CREATE POLICY "public_read_events"       ON public.events              FOR SELECT USING (true);
CREATE POLICY "public_read_blog"         ON public.blog_posts          FOR SELECT USING (published_at IS NOT NULL);
CREATE POLICY "public_read_testimonials" ON public.testimonials        FOR SELECT USING (true);
CREATE POLICY "public_read_gallery"      ON public.gallery_items       FOR SELECT USING (is_visible = true);

-- Members join flow (anon insert allowed)
CREATE POLICY "member_insert" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "member_select" ON public.members FOR SELECT USING (true);

-- OTP flow
CREATE POLICY "otp_insert"   ON public.otp_verifications FOR INSERT WITH CHECK (true);
CREATE POLICY "otp_select"   ON public.otp_verifications FOR SELECT USING (true);
CREATE POLICY "otp_update"   ON public.otp_verifications FOR UPDATE USING (true);

-- Contact form (public submit)
CREATE POLICY "contact_insert" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- STORAGE BUCKET for gallery uploads
-- ═══════════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "gallery_upload"      ON storage.objects;
DROP POLICY IF EXISTS "gallery_public_read" ON storage.objects;
DROP POLICY IF EXISTS "gallery_delete"      ON storage.objects;

CREATE POLICY "gallery_upload"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "gallery_public_read"
  ON storage.objects FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "gallery_delete"
  ON storage.objects FOR DELETE USING (bucket_id = 'gallery');
