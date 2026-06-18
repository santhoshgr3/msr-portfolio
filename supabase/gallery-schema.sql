-- ============================================
-- Gallery Table + Storage Bucket Setup
-- ============================================

-- 1. Gallery items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  tag TEXT DEFAULT 'General',
  image_url TEXT NOT NULL,
  storage_path TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- 3. Public can read visible items
CREATE POLICY "Public read visible gallery"
  ON gallery_items FOR SELECT
  USING (is_visible = TRUE);

-- 4. Service role has full access
CREATE POLICY "Service role full access gallery"
  ON gallery_items FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- Storage bucket setup (run in Supabase Dashboard → Storage)
-- ============================================
-- Create a bucket named: gallery
-- Set to PUBLIC so image URLs work without auth
--
-- Or via SQL (Supabase Storage schema):
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of gallery bucket
CREATE POLICY "Public gallery read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

-- Allow service role to insert/delete
CREATE POLICY "Service role gallery write"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Service role gallery delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery');
