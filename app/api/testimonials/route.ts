import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
  const admin = isAdmin(req);
  let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
  if (!admin) query = query.eq('is_featured', true);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { quote, name, location, role, photo_url, is_featured } = body;
  if (!quote || !name) return NextResponse.json({ error: 'quote and name are required' }, { status: 400 });
  const { data, error } = await supabaseAdmin.from('testimonials').insert({
    quote, name, location: location || '', role: role || '',
    photo_url: photo_url || '', is_featured: is_featured ?? false,
    consent_given: true,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
