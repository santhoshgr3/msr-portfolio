import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sunnyannaadmin2025';
function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-token') === ADMIN_PASS;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNumeric = /^\d+$/.test(id);
  const query = isNumeric
    ? supabaseAdmin.from('blog_posts').select('*').eq('id', Number(id)).single()
    : supabaseAdmin.from('blog_posts').select('*').eq('slug', id).single();
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};
  if ('title' in body) updates.title = body.title;
  if ('slug' in body) updates.slug = body.slug;
  if ('excerpt' in body) updates.excerpt = body.excerpt;
  if ('content' in body) updates.content = body.content;
  if ('image_url' in body) updates.image_url = body.image_url;
  if ('category' in body) updates.category = body.category;
  if ('author' in body) updates.author = body.author;
  if ('publish' in body) updates.published_at = body.publish ? new Date().toISOString() : null;
  const { data, error } = await supabaseAdmin.from('blog_posts').update(updates).eq('id', Number(id)).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
