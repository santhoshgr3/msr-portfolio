import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { DEFAULT_SETTINGS } from '@/lib/supabase';

export const dynamic = 'force-dynamic';


const EDITABLE_FIELDS = [
  'phone', 'whatsapp_number', 'email', 'website', 'address',
  'instagram_url', 'instagram_handle', 'youtube_url', 'youtube_handle',
  'facebook_url', 'twitter_url', 'telegram_url', 'linkedin_url',
  'whatsapp_community_url', 'announcement_text',
] as const;

export async function GET() {
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
  // If the table/row doesn't exist yet, fall back to defaults so the site never breaks.
  if (error || !data) return NextResponse.json(DEFAULT_SETTINGS);
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const patch: Record<string, string> = {};
  for (const key of EDITABLE_FIELDS) {
    if (typeof body[key] === 'string') patch[key] = body[key].trim();
  }
  patch.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .upsert({ id: 1, ...patch })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
