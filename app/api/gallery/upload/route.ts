import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

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

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WEBP, GIF allowed' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'jpg';
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
    const image_url = urlData.publicUrl;

    const { data, error: dbError } = await supabaseAdmin
      .from('gallery_items')
      .insert({ title, description, tag, image_url, storage_path: storagePath, is_visible: true })
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
