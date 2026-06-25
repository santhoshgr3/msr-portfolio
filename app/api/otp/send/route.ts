import { NextRequest, NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import { supabase } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

function generateOTP(): string {
  return randomInt(100000, 1000000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    if (!rateLimit(`otp-send:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 });
    }

    const { phone } = await req.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    if (!rateLimit(`otp-send-phone:${phone}`, 3, 60_000)) {
      return NextResponse.json({ error: 'Too many OTP requests for this number.' }, { status: 429 });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabase.from('otp_verifications').upsert({
      phone,
      otp,
      expires_at: expiresAt,
      verified: false,
    }, { onConflict: 'phone' });

    const msg91Key = process.env.MSG91_API_KEY;
    if (msg91Key) {
      const msg = encodeURIComponent(`Your Sunny Anna Yuvasena verification code is ${otp}. Valid for 10 minutes.`);
      await fetch(`https://api.msg91.com/api/sendhttp.php?authkey=${msg91Key}&mobiles=91${phone}&message=${msg}&route=4&sender=SANNAY&DLT_TE_ID=${process.env.MSG91_TEMPLATE_ID}`)
        .catch(() => {});
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
