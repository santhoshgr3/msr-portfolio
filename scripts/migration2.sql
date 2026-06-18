-- ═══════════════════════════════════════════════════════════════
-- MIGRATION 2 — Dynamic content tables
-- Paste this into: https://supabase.com/dashboard/project/sduofgjtelvvdukntyct/sql/new
-- ═══════════════════════════════════════════════════════════════

-- ── Timeline items (About page journey) ──
CREATE TABLE IF NOT EXISTS public.timeline_items (
  id          BIGSERIAL PRIMARY KEY,
  year        TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  highlight   BOOLEAN NOT NULL DEFAULT false,
  order_num   INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.timeline_items (year, title, description, highlight, order_num) VALUES
  ('1985', 'Born in Bhupalpally', 'Grew up in Bhupalpally, Jayashankar district, Telangana — the town that would later become the heart of his service mission.', false, 1),
  ('Early Career', 'Business Leadership', 'Built a powerful career as Director, Business Head, and Business Development Manager across multiple industries, achieving financial success and professional recognition.', false, 2),
  ('2015', 'The Turning Point', 'Witnessing systemic poverty and inequality in his hometown triggered a profound personal transformation — a conscious decision to move from wealth accumulation to community transformation.', false, 3),
  ('2018', 'Helping Hands Organization', 'Founded Helping Hands Organization to provide healthcare, clean water, food, shelter, and vocational training to underprivileged families across Telangana.', false, 4),
  ('2019', 'Sunny Anna Yuvasena', 'Launched the Sunny Anna Yuvasena youth movement — focused on empowering young people with leadership skills, civic awareness, and tools for social action.', false, 5),
  ('2022', 'Four Pillars Formalized', 'Youth Empowerment, Women Empowerment, Healthcare, and Education became the official mission pillars guiding all programs and partnerships.', false, 6),
  ('Today', 'A Statewide Movement', 'Thousands of members. Dozens of districts. Still on the ground. Still transforming lives one community at a time.', true, 7)
ON CONFLICT DO NOTHING;

-- ── Team members (About page) ──
CREATE TABLE IF NOT EXISTS public.team_members (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT '',
  initial    TEXT NOT NULL DEFAULT '',
  photo_url  TEXT NOT NULL DEFAULT '',
  order_num  INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.team_members (name, role, initial, order_num) VALUES
  ('Anna Josephine',    'Media Consultant',     'AJ', 1),
  ('Joshua Albukerque', 'Campaign Manager',     'JA', 2),
  ('Armin Sakhir',      'Political Consultant', 'AS', 3),
  ('Amanda Muffin',     'Funding Coordinator',  'AM', 4)
ON CONFLICT DO NOTHING;

-- ── Media videos (Media page) ──
CREATE TABLE IF NOT EXISTS public.media_videos (
  id            BIGSERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  url           TEXT NOT NULL DEFAULT '',
  duration      TEXT NOT NULL DEFAULT '',
  views         TEXT NOT NULL DEFAULT '',
  thumbnail_url TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.media_videos (title, url, duration, views) VALUES
  ('Free Medical Camp — Bhupalpally 2025',    'https://youtube.com/@sunnyannayuvasena', '12:34', '2.1K'),
  ('Youth Leadership Summit Highlights',       'https://youtube.com/@sunnyannayuvasena', '8:45',  '1.8K'),
  ('Sunny Anna Speaks — Why I Left Business', 'https://youtube.com/@sunnyannayuvasena', '15:20', '5.4K')
ON CONFLICT DO NOTHING;

-- ── Press coverage (Media page) ──
CREATE TABLE IF NOT EXISTS public.press_coverage (
  id         BIGSERIAL PRIMARY KEY,
  outlet     TEXT NOT NULL,
  date       DATE NOT NULL,
  title      TEXT NOT NULL,
  type       TEXT NOT NULL DEFAULT 'Print',
  url        TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.press_coverage (outlet, date, title, type) VALUES
  ('Sakshi TV',      '2025-05-01', 'Sunny Anna''s Youth Movement Transforming Bhupalpally',        'TV Coverage'),
  ('Eenadu',         '2025-04-01', 'Free Medical Camp Serves 200 Families in Rural Telangana',     'Print'),
  ('NTV Telugu',     '2025-03-01', 'Community Leader Dr. Madhiraj Sairathan on Youth Empowerment', 'TV Coverage'),
  ('The Hans India', '2025-02-01', 'Helping Hands Organization: A Model for Community Welfare',    'Online News')
ON CONFLICT DO NOTHING;

-- ── RLS ──
ALTER TABLE public.timeline_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_videos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_coverage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_timeline" ON public.timeline_items;
DROP POLICY IF EXISTS "public_read_team"     ON public.team_members;
DROP POLICY IF EXISTS "public_read_videos"   ON public.media_videos;
DROP POLICY IF EXISTS "public_read_press"    ON public.press_coverage;

CREATE POLICY "public_read_timeline" ON public.timeline_items FOR SELECT USING (true);
CREATE POLICY "public_read_team"     ON public.team_members   FOR SELECT USING (true);
CREATE POLICY "public_read_videos"   ON public.media_videos   FOR SELECT USING (true);
CREATE POLICY "public_read_press"    ON public.press_coverage FOR SELECT USING (true);
