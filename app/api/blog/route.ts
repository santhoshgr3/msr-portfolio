import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const ADMIN_PASS = 'sunnyannaadmin2025';

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-token') === ADMIN_PASS;
}

export async function GET(req: NextRequest) {
  const admin = isAdmin(req);
  let query = supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
  if (!admin) query = query.not('published_at', 'is', null);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { title, slug, excerpt, content, image_url, category, author, publish } = body;
  if (!title || !slug) return NextResponse.json({ error: 'title and slug are required' }, { status: 400 });
  const { data, error } = await supabaseAdmin.from('blog_posts').insert({
    title,
    slug,
    excerpt: excerpt || '',
    content: content || '',
    image_url: image_url || '',
    category: category || 'General',
    author: author || 'Dr. Madhiraj Sairathan',
    published_at: publish ? new Date().toISOString() : null,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
