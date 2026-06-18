import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '12');

  try {
    const { data, error } = await supabase
      .from('members')
      .select('id, full_name, city, created_at')
      .eq('display_on_wall', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}
