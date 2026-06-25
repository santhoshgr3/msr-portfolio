import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


export async function GET() {
  const { data, error } = await supabase.from('pillars').select('*').order('id');
  if (error) return NextResponse.json([]);
  return NextResponse.json(data ?? []);
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug, image_url } = await req.json();
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('pillars')
    .update({ image_url })
    .eq('slug', slug)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
