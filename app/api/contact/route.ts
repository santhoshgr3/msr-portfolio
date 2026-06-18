import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const ADMIN_PASS = 'sunnyannaadmin2025';

export async function GET(req: NextRequest) {
  if (req.headers.get('x-admin-token') !== ADMIN_PASS) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data, error } = await supabaseAdmin
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, message } = body;
  if (!name || !message) return NextResponse.json({ error: 'name and message are required' }, { status: 400 });
  const { data, error } = await supabase.from('contact_submissions').insert({
    name, email: email || '', phone: phone || '', message,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
