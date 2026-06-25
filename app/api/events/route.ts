import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


export async function GET() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { title, description, date, location, district, type, image_url, rsvp_count, is_upcoming } = body;
  if (!title || !date) return NextResponse.json({ error: 'title and date are required' }, { status: 400 });
  const { data, error } = await supabaseAdmin.from('events').insert({
    title,
    description: description || '',
    date,
    location: location || '',
    district: district || '',
    type: type || 'General',
    image_url: image_url || '',
    rsvp_count: rsvp_count || 0,
    is_upcoming: is_upcoming ?? true,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
