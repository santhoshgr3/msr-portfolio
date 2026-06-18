'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { GalleryItem } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

const tagColor: Record<string, string> = {
  Healthcare: '#FF8F00', Youth: '#FF6F00', 'Women Empowerment': '#2D2D2D',
  Education: '#FF6F00', Events: '#0D0D0D', Milestones: '#FF8F00', General: '#6B6B6B',
};

export default function GalleryPreview() {
  const { lang } = useLanguage();
  const t = i18n[lang].galleryPreview;

  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(d => setItems((d as GalleryItem[]).slice(0, 6)))
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-[#F5F5F5]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.badge}</span>
            </div>
            <h2 className="text-3xl font-bold text-[#0D0D0D]">{t.heading}</h2>
          </div>
          <Link href="/gallery" className="text-sm font-bold text-[#FF6F00] hover:text-[#E65100] transition-colors shrink-0">
            {t.viewAll} →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <Link key={item.id} href="/gallery" className="group block">
              <div className={`relative overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <div className="relative w-full aspect-video">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white w-fit mb-1"
                    style={{ backgroundColor: tagColor[item.tag] || '#6B6B6B' }}>
                    {item.tag}
                  </span>
                  <p className="text-white text-xs font-bold leading-tight">{item.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
