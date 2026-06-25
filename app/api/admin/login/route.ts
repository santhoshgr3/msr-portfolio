import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPass = process.env.ADMIN_PASSWORD ?? '';
  if (!adminPass || password !== adminPass) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
