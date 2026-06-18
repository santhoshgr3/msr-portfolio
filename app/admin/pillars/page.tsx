'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Upload, Check, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const TOKEN = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sunnyannaadmin2025';

const PILLARS = [
  { slug: 'youth',      label: 'Youth Empowerment',  emoji: '⚡' },
  { slug: 'women',      label: 'Women Empowerment',   emoji: '👩' },
  { slug: 'healthcare', label: 'Healthcare',           emoji: '🏥' },
  { slug: 'education',  label: 'Education',            emoji: '📚' },
];

type PillarRow = { slug: string; image_url: string };

export default function AdminPillarsPage() {
  const [images, setImages]   = useState<Record<string, string>>({});
  const [status, setStatus]   = useState<Record<string, 'idle' | 'uploading' | 'done' | 'error'>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetch('/api/pillars')
      .then(r => r.json())
      .then((rows: PillarRow[]) => {
        const map: Record<string, string> = {};
        rows.forEach(r => { map[r.slug] = r.image_url; });
        setImages(map);
      });
  }, []);

  const upload = async (slug: string, file: File) => {
    setStatus(s => ({ ...s, [slug]: 'uploading' }));
    try {
      const ext  = file.name.split('.').pop();
      const path = `${slug}-${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('pillars')
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage.from('pillars').getPublicUrl(path);

      const res = await fetch('/api/pillars', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': TOKEN },
        body: JSON.stringify({ slug, image_url: publicUrl }),
      });
      if (!res.ok) throw new Error('Save failed');

      setImages(prev => ({ ...prev, [slug]: publicUrl }));
      setStatus(s => ({ ...s, [slug]: 'done' }));
      setTimeout(() => setStatus(s => ({ ...s, [slug]: 'idle' })), 2500);
    } catch {
      setStatus(s => ({ ...s, [slug]: 'error' }));
      setTimeout(() => setStatus(s => ({ ...s, [slug]: 'idle' })), 3000);
    }
  };

  return (
    <div className="p-5 sm:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0D0D0D]">Four Pillars — Images</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          Upload a photo for each pillar. Shown on the home page cards and mission page panels.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {PILLARS.map(p => {
          const st  = status[p.slug] || 'idle';
          const img = images[p.slug];
          return (
            <div key={p.slug} className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden">
              {/* Preview */}
              <div className="relative w-full aspect-video bg-[#F5F5F5] flex items-center justify-center">
                {img ? (
                  <Image src={img} alt={p.label} fill className="object-cover" sizes="400px" />
                ) : (
                  <span className="text-4xl opacity-30">{p.emoji}</span>
                )}
                {st === 'uploading' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader size={28} className="text-white animate-spin" />
                  </div>
                )}
                {st === 'done' && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <Check size={32} className="text-green-600" />
                  </div>
                )}
              </div>

              {/* Info + upload */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-sm text-[#0D0D0D]">{p.emoji} {p.label}</div>
                  <div className="text-xs text-[#6B6B6B] mt-0.5">{img ? 'Image uploaded ✓' : 'No image yet'}</div>
                </div>
                <input
                  ref={el => { inputRefs.current[p.slug] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) upload(p.slug, f); }}
                />
                <button
                  onClick={() => inputRefs.current[p.slug]?.click()}
                  disabled={st === 'uploading'}
                  className="flex items-center gap-1.5 bg-[#FF6F00] hover:bg-[#E65100] disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0"
                >
                  <Upload size={13} />
                  {st === 'uploading' ? 'Uploading…' : img ? 'Replace' : 'Upload'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
