import { NextRequest } from 'next/server';

export function isAdmin(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token') ?? '';
  const pass = process.env.ADMIN_PASSWORD ?? '';
  return pass.length > 0 && token === pass;
}
