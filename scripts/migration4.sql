-- Migration 4: Pillar images table + storage bucket
-- Run in Supabase SQL editor (project: sduofgjtelvvdukntyct)

CREATE TABLE IF NOT EXISTS pillars (
  id   SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,  -- youth | women | healthcare | education
  image_url TEXT DEFAULT ''
);

INSERT INTO pillars (slug) VALUES
  ('youth'), ('women'), ('healthcare'), ('education')
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE pillars ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read pillars" ON pillars FOR SELECT USING (TRUE);

INSERT INTO storage.buckets (id, name, public)
  VALUES ('pillars', 'pillars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read pillar images" ON storage.objects
  FOR SELECT USING (bucket_id = 'pillars');

CREATE POLICY "Service role pillar upload" ON storage.objects
  FOR ALL USING (bucket_id = 'pillars' AND auth.role() = 'service_role');
