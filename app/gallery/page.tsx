'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Download, Play } from 'lucide-react';
import type { GalleryItem } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

const CATEGORY_TAGS = ['Healthcare', 'Youth', 'Women Empowerment', 'Education', 'Events', 'Milestones', 'General'];
const TYPE_TABS = ['All', 'Photos', 'Videos'];

const tagColor: Record<string, string> = {
  Healthcare: '#FF8F00',
  Youth: '#FF6F00',
  'Women Empowerment': '#2D2D2D',
  Education: '#FF6F00',
  Events: '#0D0D0D',
  Milestones: '#FF8F00',
  General: '#6B6B6B',
};

async function downloadMedia(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch {
    window.open(url, '_blank');
  }
}

export default function GalleryPage() {
  const { lang } = useLanguage();
  const t = i18n[lang].gallery;

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeTag, setActiveTag] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(d => { setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = items.filter(i => {
    const isVideo = i.media_type === 'video';
    if (activeType === 'Photos' && isVideo) return false;
    if (activeType === 'Videos' && !isVideo) return false;
    if (activeTag !== 'All' && i.tag !== activeTag) return false;
    return true;
  });

  const handleDownload = async (item: GalleryItem) => {
    setDownloading(true);
    const ext = item.image_url.split('.').pop()?.split('?')[0] || (item.media_type === 'video' ? 'mp4' : 'jpg');
    await downloadMedia(item.image_url, `${item.title.replace(/[^a-z0-9]/gi, '_')}.${ext}`);
    setDownloading(false);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0D0D0D] pt-32 pb-24 px-4 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 1440 500" fill="none" preserveAspectRatio="none">
          <line x1="0" y1="500" x2="1440" y2="0" stroke="#FF6F00" strokeWidth="2"/>
        </svg>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="rising-accent" />
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.heroBadge}</span>
            <span className="rising-accent" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            {t.heroTitle.split(' ')[0]} <span className="text-amber-gradient">{t.heroTitle.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">{t.heroDesc}</p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-white border-b border-[#E8E8E8] px-4 py-3">
        <div className="max-w-6xl mx-auto space-y-2">
          {/* Type filter */}
          <div className="flex gap-2">
            {TYPE_TABS.map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeType === type ? 'bg-[#FF6F00] text-white' : 'bg-[#F5F5F5] text-[#6B6B6B] hover:bg-[#E8E8E8]'
                }`}
              >
                {type}
                {type === 'Photos' && <span className="ml-1.5 opacity-60">({items.filter(i => !i.media_type || i.media_type === 'image').length})</span>}
                {type === 'Videos' && <span className="ml-1.5 opacity-60">({items.filter(i => i.media_type === 'video').length})</span>}
                {type === 'All' && <span className="ml-1.5 opacity-60">({items.length})</span>}
              </button>
            ))}
          </div>
          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {['All', ...CATEGORY_TAGS].map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  activeTag === tag ? 'bg-[#0D0D0D] text-white' : 'bg-[#F5F5F5] text-[#6B6B6B] hover:bg-[#E8E8E8]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-12 px-4 bg-[#F5F5F5] min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-[#E8E8E8] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">📷</div>
              <h3 className="text-lg font-bold text-[#0D0D0D] mb-2">
                {activeTag === 'All' ? t.noPhotosAll : t.noPhotosTag}
              </h3>
              <p className="text-[#6B6B6B] text-sm mb-6">
                {activeTag === 'All' ? t.noPhotosAllDesc : t.noPhotosTagDesc}
              </p>
              {(activeTag !== 'All' || activeType !== 'All') && (
                <button
                  onClick={() => { setActiveTag('All'); setActiveType('All'); }}
                  className="bg-[#FF6F00] text-white font-bold px-6 py-2.5 rounded-full text-sm"
                >
                  {t.viewAll}
                </button>
              )}
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filtered.map(item => {
                const isVideo = item.media_type === 'video';
                return (
                  <div
                    key={item.id}
                    className="break-inside-avoid mb-4 group cursor-pointer"
                    onClick={() => setLightbox(item)}
                  >
                    <div className="relative overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white">
                      <div className="relative w-full">
                        {isVideo ? (
                          <video
                            src={item.image_url}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                            muted
                            preload="metadata"
                          />
                        ) : (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            width={400}
                            height={300}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          />
                        )}
                      </div>

                      {/* Video play badge */}
                      {isVideo && (
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                          <Play size={12} className="text-white ml-0.5" />
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-[#0D0D0D]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white w-fit mb-1.5"
                          style={{ backgroundColor: tagColor[item.tag] || '#6B6B6B' }}
                        >
                          {item.tag}
                        </span>
                        <p className="text-white font-bold text-xs leading-tight">{item.title}</p>
                        {item.description && (
                          <p className="text-white/60 text-[10px] mt-0.5 leading-tight line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 px-4 bg-[#0D0D0D] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-3">{t.ctaHeading}</h2>
          <p className="text-white/40 text-sm mb-6">{t.ctaDesc}</p>
          <Link href="/community/join" className="inline-flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-7 py-3 rounded-full text-sm transition-all hover:scale-105">
            {t.ctaBtn} →
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => void handleDownload(lightbox)}
                disabled={downloading}
                className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
              >
                <Download size={13} />
                {downloading ? 'Downloading…' : 'Download'}
              </button>
              <button
                onClick={() => setLightbox(null)}
                className="text-white/60 hover:text-white text-sm font-semibold"
              >
                ✕ {t.close}
              </button>
            </div>

            <div className="bg-[#0D0D0D] rounded-2xl overflow-hidden border border-white/10">
              <div className="relative w-full">
                {lightbox.media_type === 'video' ? (
                  <video
                    src={lightbox.image_url}
                    controls
                    autoPlay
                    className="w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <Image
                    src={lightbox.image_url}
                    alt={lightbox.title}
                    width={1200}
                    height={800}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: tagColor[lightbox.tag] || '#6B6B6B' }}
                  >
                    {lightbox.tag}
                  </span>
                  {lightbox.media_type === 'video' && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FF6F00]/20 text-[#FF6F00] flex items-center gap-1">
                      <Play size={9} /> Video
                    </span>
                  )}
                  <span className="text-white/30 text-xs">
                    {new Date(lightbox.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg">{lightbox.title}</h3>
                {lightbox.description && (
                  <p className="text-white/50 text-sm mt-1 leading-relaxed">{lightbox.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
