import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const { data, error } = await supabase
    .from('media_videos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-admin-token') !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sunnyannaadmin2025')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from('media_videos')
    .insert({ title: body.title, url: body.url || '', video_url: body.video_url || '', duration: body.duration || '', views: body.views || '', thumbnail_url: body.thumbnail_url || '' })
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
