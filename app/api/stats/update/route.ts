import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { key, value, label } = body;
  if (!key || value === undefined) return NextResponse.json({ error: 'key and value required' }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from('impact_stats')
    .upsert({ key, value: Number(value), label: label || key, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
