-- Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor

-- 1. Donation goals table
CREATE TABLE IF NOT EXISTS donation_goals (
  id         SERIAL PRIMARY KEY,
  emoji      TEXT    NOT NULL DEFAULT '💛',
  amount     TEXT    NOT NULL,
  impact     TEXT    NOT NULL,
  raised     TEXT    NOT NULL DEFAULT '₹0',
  target     TEXT    NOT NULL,
  progress   INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  color      TEXT    NOT NULL DEFAULT '#FF6F00',
  is_active  BOOLEAN NOT NULL DEFAULT true,
  order_num  INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE donation_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "public_read" ON donation_goals FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "service_all" ON donation_goals FOR ALL USING (true);

-- Seed default goals (only if table is empty)
INSERT INTO donation_goals (emoji, amount, impact, raised, target, progress, color, order_num)
SELECT * FROM (VALUES
  ('💧', '₹500',   'Clean water for one family for a week',        '₹3,900',  '₹5,000',  78, '#FF6F00', 1),
  ('📚', '₹1,500', 'School supplies for one child for a year',     '₹6,750',  '₹15,000', 45, '#0D0D0D', 2),
  ('🏥', '₹5,000', 'Fund a free medical camp for 50 families',     '₹31,000', '₹50,000', 62, '#FF8F00', 3),
  ('👩', '₹15,000','Vocational training for a woman (1 month)',    '₹4,950',  '₹15,000', 33, '#2D2D2D', 4)
) AS v(emoji, amount, impact, raised, target, progress, color, order_num)
WHERE NOT EXISTS (SELECT 1 FROM donation_goals LIMIT 1);

-- 2. Add announcement_text to site_settings
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS announcement_text TEXT DEFAULT 'Join the movement transforming Telangana —';

-- 3. Add media_type to gallery_items (for video support)
ALTER TABLE gallery_items
  ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'image';
