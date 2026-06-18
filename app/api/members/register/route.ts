import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, phone, city, district, interest_area, how_found, consent } = body;

    if (!full_name || !phone || !city || !consent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    // Check duplicate
    const { data: existing } = await supabase
      .from('members')
      .select('id, member_number')
      .eq('phone', phone)
      .single();

    if (existing) {
      return NextResponse.json({ success: true, member_number: existing.member_number, existing: true });
    }

    // Get next member number
    const { count } = await supabase.from('members').select('id', { count: 'exact', head: true });
    const member_number = (count || 0) + 1;

    const { data, error } = await supabase.from('members').insert({
      full_name: full_name.trim(),
      phone,
      city: city.trim(),
      district: district?.trim() || city.trim(),
      interest_area: interest_area || 'All',
      how_found: how_found || 'Website',
      display_on_wall: true,
      member_number,
      consent_given: true,
    }).select('id, member_number').single();

    if (error) throw error;

    return NextResponse.json({ success: true, member_number: data.member_number });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
