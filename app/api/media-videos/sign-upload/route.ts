import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';


// Returns a short-lived signed URL the admin browser can upload a video file to
// directly — this avoids the serverless function body-size limit for large files.
export async function POST(req: NextRequest) {
  if (!isAdmin(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { filename, contentType } = await req.json();

  if (!contentType || !String(contentType).startsWith('video/'))
    return NextResponse.json({ error: 'Only video files are allowed' }, { status: 400 });

  const ext = (filename || 'video.mp4').split('.').pop() || 'mp4';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabaseAdmin.storage
    .from('videos')
    .createSignedUploadUrl(path);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: pub } = supabaseAdmin.storage.from('videos').getPublicUrl(path);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path,
    publicUrl: pub.publicUrl,
  });
}
