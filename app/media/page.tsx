'use client';
import { useState, useEffect } from 'react';
import { Play, Video, FileText, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { i18n } from '@/lib/i18n';

type MediaVideo = { id: number; title: string; url: string; video_url?: string; duration: string; views: string; thumbnail_url?: string };
type Press = { id: number; outlet: string; date: string; title: string; type: string; url: string };

export default function MediaPage() {
  const { lang } = useLanguage();
  const s = useSettings();
  const t = i18n[lang].media;

  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [press, setPress] = useState<Press[]>([]);

  useEffect(() => {
    fetch('/api/media-videos').then(r => r.json()).then(setVideos).catch(() => {});
    fetch('/api/press').then(r => r.json()).then(setPress).catch(() => {});
  }, []);

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
            {t.heroTitle.split('&')[0]}<span className="text-amber-gradient">& {t.heroTitle.split('& ')[1] || 'News'}</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">{t.heroDesc}</p>
        </div>
      </section>

      {/* Video Gallery */}
      {videos.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <Play size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0D0D0D]">{t.videosHeading}</h2>
                {s.youtube_url && (
                  <a href={s.youtube_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6B6B] hover:text-[#FF6F00] transition-colors">
                    {s.youtube_handle} on YouTube →
                  </a>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {videos.map(v => (
                v.video_url ? (
                  /* Uploaded video — native player */
                  <div key={v.id} className="border border-[#E8E8E8] rounded-2xl overflow-hidden">
                    <div className="aspect-video bg-[#0D0D0D]">
                      <video
                        src={v.video_url}
                        poster={v.thumbnail_url || undefined}
                        controls
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#0D0D0D] text-sm mb-1">{v.title}</h3>
                      {v.views && <p className="text-xs text-[#6B6B6B]">{v.views} {t.views}</p>}
                    </div>
                  </div>
                ) : (
                  /* External link (YouTube etc.) */
                  <a key={v.id} href={v.url || s.youtube_url || '#'} target="_blank" rel="noopener noreferrer" className="group block">
                    <div className="border border-[#E8E8E8] rounded-2xl overflow-hidden card-hover group-hover:border-[#FF6F00] transition-all">
                      <div className="aspect-video bg-[#0D0D0D] flex items-center justify-center relative">
                        {v.thumbnail_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={v.thumbnail_url} alt={v.title} className="absolute inset-0 w-full h-full object-cover opacity-70" />
                        )}
                        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                          <span className="text-white text-xl ml-1">▶</span>
                        </div>
                        {v.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded z-10">{v.duration}</div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[#0D0D0D] text-sm group-hover:text-[#FF6F00] transition-colors mb-1">{v.title}</h3>
                        {v.views && <p className="text-xs text-[#6B6B6B]">{v.views} {t.views}</p>}
                      </div>
                    </div>
                  </a>
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Instagram Grid */}
      <section className="py-20 px-4 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E4405F, #833AB4)' }}>
                <Video size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0D0D0D]">{t.igHeading}</h2>
                <a href={s.instagram_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#6B6B6B] hover:text-[#FF6F00] transition-colors">
                  {s.instagram_handle} →
                </a>
              </div>
            </div>
            <a href={s.instagram_url} target="_blank" rel="noopener noreferrer"
              className="text-white text-sm font-semibold px-4 py-2 rounded-full"
              style={{ background: 'linear-gradient(135deg, #E4405F, #833AB4)' }}>
              {i18n[lang].common.follow}
            </a>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <a key={i} href={s.instagram_url} target="_blank" rel="noopener noreferrer">
                <div className="aspect-square bg-[#0D0D0D] rounded-xl hover:opacity-75 transition-opacity flex items-center justify-center">
                  <span className="text-white/20 text-xs">📸</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Press Coverage */}
      {press.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <span className="rising-accent" />
              <h2 className="text-2xl font-bold text-[#0D0D0D]">{t.pressHeading}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {press.map(p => (
                <a key={p.id} href={p.url || '#'} target={p.url ? '_blank' : undefined} rel="noopener noreferrer"
                  className="border border-[#E8E8E8] rounded-2xl p-5 flex gap-4 card-hover hover:border-[#FF6F00] transition-all">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center shrink-0 border border-[#E8E8E8]">
                    <FileText size={18} className="text-[#6B6B6B]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-[#FF6F00]">{p.outlet}</span>
                      <span className="text-xs text-[#6B6B6B]">· {new Date(p.date).toLocaleString(lang === 'te' ? 'te-IN' : 'en-IN', { month: 'short', year: 'numeric' })}</span>
                      <span className="text-xs bg-[#F5F5F5] text-[#6B6B6B] px-2 py-0.5 rounded-full border border-[#E8E8E8]">{p.type}</span>
                    </div>
                    <h3 className="font-bold text-[#0D0D0D] text-sm leading-snug">{p.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Media Kit */}
      <section className="py-20 px-4 bg-[#0D0D0D] text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="rising-accent" />
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.kitBadge}</span>
            <span className="rising-accent" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">{t.kitHeading}</h2>
          <p className="text-white/40 mb-8 text-sm leading-relaxed">{t.kitDesc}</p>
          <a href={`mailto:${s.email}?subject=Media Kit Request`}
            className="inline-flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105">
            {t.kitBtn} <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}
