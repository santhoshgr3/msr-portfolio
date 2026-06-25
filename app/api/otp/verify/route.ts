import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    if (!rateLimit(`otp-verify:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Too many attempts. Try again in a minute.' }, { status: 429 });
    }

    const { phone, otp } = await req.json();

    if (!rateLimit(`otp-verify-phone:${phone}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many verification attempts for this number.' }, { status: 429 });
    }

    const { data, error } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('phone', phone)
      .eq('otp', otp)
      .eq('verified', false)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    await supabase.from('otp_verifications').update({ verified: true }).eq('phone', phone);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
