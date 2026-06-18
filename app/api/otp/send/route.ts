import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Store OTP (upsert)
    await supabase.from('otp_verifications').upsert({
      phone,
      otp,
      expires_at: expiresAt,
      verified: false,
    }, { onConflict: 'phone' });

    // Send via MSG91 (configure in production)
    const msg91Key = process.env.MSG91_API_KEY;
    if (msg91Key) {
      const msg = encodeURIComponent(`Your Sunny Anna Yuvasena verification code is ${otp}. Valid for 10 minutes.`);
      await fetch(`https://api.msg91.com/api/sendhttp.php?authkey=${msg91Key}&mobiles=91${phone}&message=${msg}&route=4&sender=SANNAY&DLT_TE_ID=${process.env.MSG91_TEMPLATE_ID}`)
        .catch(() => {});
    } else {
      // Dev mode: log OTP
      console.log(`[DEV OTP] Phone: ${phone}, OTP: ${otp}`);
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
