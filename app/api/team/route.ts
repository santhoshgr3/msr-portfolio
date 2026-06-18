import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('order_num', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (req.headers.get('x-admin-token') !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sunnyannaadmin2025')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from('team_members')
    .insert({ name: body.name, role: body.role || '', initial: body.initial || body.name[0], photo_url: body.photo_url || '', order_num: body.order_num || 0 })
    .select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
