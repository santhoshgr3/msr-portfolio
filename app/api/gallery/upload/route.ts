import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/mpeg'];
const IMAGE_MAX = 10 * 1024 * 1024;   // 10 MB
const VIDEO_MAX = 200 * 1024 * 1024;  // 200 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string || '').trim();
    const description = (formData.get('description') as string || '').trim();
    const tag = (formData.get('tag') as string || 'General').trim();

    if (!file || !title) {
      return NextResponse.json({ error: 'File and title are required' }, { status: 400 });
    }

    const isImage = IMAGE_TYPES.includes(file.type);
    const isVideo = VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Only JPG, PNG, WEBP, GIF images or MP4, MOV, WEBM videos are allowed' }, { status: 400 });
    }

    const maxSize = isVideo ? VIDEO_MAX : IMAGE_MAX;
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large (max ${isVideo ? '200' : '10'} MB)` }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg');
    const storagePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: storageError } = await supabaseAdmin.storage
      .from('gallery')
      .upload(storagePath, buffer, { contentType: file.type, upsert: false });

    if (storageError) {
      return NextResponse.json({ error: `Storage error: ${storageError.message}` }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage.from('gallery').getPublicUrl(storagePath);
    const media_url = urlData.publicUrl;
    const media_type = isVideo ? 'video' : 'image';

    const { data, error: dbError } = await supabaseAdmin
      .from('gallery_items')
      .insert({
        title,
        description,
        tag,
        image_url: media_url,
        storage_path: storagePath,
        is_visible: true,
        media_type,
      })
      .select()
      .single();

    if (dbError) {
      await supabaseAdmin.storage.from('gallery').remove([storagePath]);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Upload failed' }, { status: 500 });
  }
}
