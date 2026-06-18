-- ============================================
-- Sunny Anna Yuvasena — Supabase Database Schema
-- ============================================

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  member_number INTEGER UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  interest_area TEXT DEFAULT 'All',
  how_found TEXT DEFAULT 'Website',
  display_on_wall BOOLEAN DEFAULT TRUE,
  consent_given BOOLEAN NOT NULL DEFAULT FALSE,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OTP verifications
CREATE TABLE IF NOT EXISTS otp_verifications (
  id SERIAL PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Impact stats (manually updated by admin)
CREATE TABLE IF NOT EXISTS impact_stats (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  value INTEGER DEFAULT 0,
  suffix TEXT DEFAULT '+',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  district TEXT,
  type TEXT DEFAULT 'General',
  image_url TEXT,
  rsvp_count INTEGER DEFAULT 0,
  is_upcoming BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event RSVPs
CREATE TABLE IF NOT EXISTS event_rsvps (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, member_id)
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'General',
  author TEXT DEFAULT 'Dr. Madhiraj Sairathan',
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  role TEXT,
  photo_url TEXT,
  consent_given BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Seed initial impact stats
-- ============================================
INSERT INTO impact_stats (key, label, value, suffix) VALUES
  ('lives_impacted', 'Lives Impacted', 0, '+'),
  ('events', 'Events Conducted', 0, '+'),
  ('social_followers', 'Social Media Followers (K)', 0, 'K+'),
  ('districts_covered', 'Districts Covered', 0, '+'),
  ('volunteers', 'Active Volunteers', 0, '+')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Members: Public can read (display_on_wall=true), authenticated can write
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read wall members" ON members
  FOR SELECT USING (display_on_wall = TRUE);

CREATE POLICY "Service role full access members" ON members
  FOR ALL USING (auth.role() = 'service_role');

-- Impact stats: Public read
ALTER TABLE impact_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read stats" ON impact_stats
  FOR SELECT USING (TRUE);

CREATE POLICY "Service role update stats" ON impact_stats
  FOR ALL USING (auth.role() = 'service_role');

-- OTP: Service role only
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role OTP access" ON otp_verifications
  FOR ALL USING (auth.role() = 'service_role');

-- Events: Public read
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read events" ON events
  FOR SELECT USING (TRUE);

-- Blog: Public read published
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published posts" ON blog_posts
  FOR SELECT USING (published = TRUE);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_members_created ON members(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone);
CREATE INDEX IF NOT EXISTS idx_members_district ON members(district);
CREATE INDEX IF NOT EXISTS idx_members_wall ON members(display_on_wall, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_verifications(phone);
