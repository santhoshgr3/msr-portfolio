-- ═══════════════════════════════════════════════════════════════
-- MIGRATION 3 — Site Settings (social media + contact, fully dynamic)
--               + Video upload support
-- Paste into: https://supabase.com/dashboard/project/sduofgjtelvvdukntyct/sql/new
-- ═══════════════════════════════════════════════════════════════

-- ── Site settings (single row, id = 1) ──
CREATE TABLE IF NOT EXISTS public.site_settings (
  id                     INTEGER PRIMARY KEY DEFAULT 1,
  -- Contact
  phone                  TEXT NOT NULL DEFAULT '+91 8886388264',
  whatsapp_number        TEXT NOT NULL DEFAULT '918886388264',
  email                  TEXT NOT NULL DEFAULT 'teamsairathansunny@gmail.com',
  website                TEXT NOT NULL DEFAULT 'https://madhirajsairathan.com',
  address                TEXT NOT NULL DEFAULT 'Bhupalpally, Telangana, India',
  -- Social
  instagram_url          TEXT NOT NULL DEFAULT 'https://instagram.com/madhirajsairathan',
  instagram_handle       TEXT NOT NULL DEFAULT '@madhirajsairathan',
  youtube_url            TEXT NOT NULL DEFAULT 'https://youtube.com/@sunnyannayuvasena',
  youtube_handle         TEXT NOT NULL DEFAULT '@sunnyannayuvasena',
  facebook_url           TEXT NOT NULL DEFAULT 'https://facebook.com/share/14PdvF6Wuh/',
  twitter_url            TEXT NOT NULL DEFAULT '',
  telegram_url           TEXT NOT NULL DEFAULT '',
  linkedin_url           TEXT NOT NULL DEFAULT '',
  whatsapp_community_url  TEXT NOT NULL DEFAULT '',
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_settings" ON public.site_settings;
CREATE POLICY "public_read_settings" ON public.site_settings FOR SELECT USING (true);

-- ── Video upload support ──
ALTER TABLE public.media_videos
  ADD COLUMN IF NOT EXISTS video_url TEXT NOT NULL DEFAULT '';

-- ── Storage bucket for uploaded videos (public read) ──
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of the videos bucket objects
DROP POLICY IF EXISTS "public_read_videos_bucket" ON storage.objects;
CREATE POLICY "public_read_videos_bucket" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');
