'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { i18n } from '@/lib/i18n';

type Post = { id: number; title: string; category: string; published_at: string; slug: string };

const catColor: Record<string, string> = {
  Healthcare: '#0D0D0D', Youth: '#FF6F00', Women: '#0D0D0D',
  Community: '#FF8F00', Education: '#2D2D2D', General: '#6B6B6B',
};

export default function MediaStrip() {
  const { lang } = useLanguage();
  const s = useSettings();
  const t = i18n[lang].mediaStrip;

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.json())
      .then((d: Post[]) => setPosts(d.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <section className="py-24 px-4 bg-[#F5F5F5] border-t border-[#E8E8E8]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.badge}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D0D0D]">{t.heading}</h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D0D0D] hover:text-[#FF6F00] transition-colors group shrink-0">
            {t.viewAll} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {posts.map(p => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E8E8] hover:border-[#FF6F00] hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video bg-[#0D0D0D] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] to-[#2A1A00] opacity-80" />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-xs font-bold text-white px-3 py-1 rounded-full" style={{ backgroundColor: catColor[p.category] || '#0D0D0D' }}>
                        {p.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[#0D0D0D] group-hover:text-[#FF6F00] transition-colors leading-snug mb-2">{p.title}</h3>
                    <p className="text-xs text-[#6B6B6B]">
                      {new Date(p.published_at).toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mb-12" />
        )}

        <div className="bg-[#0D0D0D] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">{t.social}</p>
            <p className="text-white/50 text-sm">{t.socialSub}</p>
          </div>
          <div className="flex gap-3 shrink-0 flex-wrap">
            {s.instagram_url && (
              <a href={s.instagram_url} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors">
                📸 Instagram
              </a>
            )}
            {s.youtube_url && (
              <a href={s.youtube_url} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#FF6F00] text-white text-sm font-medium hover:bg-[#E65100] transition-colors">
                ▶ YouTube
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
