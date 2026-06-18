'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import TelanganaImpactMap from '@/components/TelanganaImpactMap';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

const PILLAR_COLORS: Record<string, string> = {
  Healthcare: '#FF8F00', Youth: '#FF6F00', Women: '#2D2D2D',
  Education: '#2D2D2D', General: '#6B6B6B',
};

export default function ImpactPage() {
  const { lang } = useLanguage();
  const t = i18n[lang].impact;

  const [stats, setStats] = useState({ members: 0, lives_impacted: 0, events: 0, social_followers: 0, years_service: new Date().getFullYear() - 2018, districts_covered: 0 });
  const [testimonials, setTestimonials] = useState<{ id: number; quote: string; name: string; location: string; role: string }[]>([]);
  const [pastEvents, setPastEvents] = useState<{ title: string; date: string; district: string; type: string; description: string }[]>([]);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
    fetch('/api/testimonials').then(r => r.json()).then(setTestimonials).catch(() => {});
    fetch('/api/events').then(r => r.json()).then(all => {
      if (Array.isArray(all)) {
        const past = all.filter((e: { is_upcoming: boolean }) => !e.is_upcoming)
          .sort((a: { date: string }, b: { date: string }) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4);
        setPastEvents(past);
      }
    }).catch(() => {});
  }, []);

  const bigStats = [
    { value: stats.members, suffix: '+', icon: '👥', label: t.statLabels[0].label, desc: t.statLabels[0].desc },
    { value: stats.lives_impacted, suffix: '+', icon: '❤️', label: t.statLabels[1].label, desc: t.statLabels[1].desc },
    { value: stats.events, suffix: '+', icon: '📅', label: t.statLabels[2].label, desc: t.statLabels[2].desc },
    { value: stats.social_followers || 50, suffix: 'K+', icon: '📱', label: t.statLabels[3].label, desc: t.statLabels[3].desc },
    { value: stats.years_service, suffix: '+', icon: '⏱️', label: t.statLabels[4].label, desc: t.statLabels[4].desc },
    { value: stats.districts_covered || 15, suffix: '+', icon: '🗺️', label: t.statLabels[5].label, desc: t.statLabels[5].desc },
  ];

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
            {t.heroTitle.split('&')[0]}<span className="text-amber-gradient">& {t.heroTitle.split('& ')[1] || 'Numbers'}</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto mb-6">{t.heroDesc}</p>
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full pulse-live" />
            <span className="text-white/50">{t.liveData}</span>
          </div>
        </div>
      </section>

      {/* Map */}
      <TelanganaImpactMap />

      {/* Big stats grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bigStats.map((s, i) => (
              <div key={i} className="border border-[#E8E8E8] rounded-2xl p-8 card-hover text-center hover:border-[#FF6F00] transition-all">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="text-4xl md:text-5xl font-black text-[#0D0D0D] font-mono mb-1">
                  {typeof s.value === 'number' && s.value > 0 ? s.value.toLocaleString() : s.value}{s.suffix}
                </div>
                <div className="w-6 h-0.5 bg-[#FF6F00] mx-auto my-3" style={{ transform: 'skewX(-12deg)' }} />
                <div className="font-bold text-[#0D0D0D] mb-2 text-sm">{s.label}</div>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact stories */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4 bg-[#F5F5F5]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="rising-accent" />
                <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.storiesBadge}</span>
                <span className="rising-accent" />
              </div>
              <h2 className="text-3xl font-bold text-[#0D0D0D]">{t.storiesHeading}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.slice(0, 4).map((tm, idx) => {
                const colors = ['#FF6F00', '#0D0D0D', '#2D2D2D', '#FF8F00'];
                const color = colors[idx % colors.length];
                return (
                  <div key={tm.id} className="bg-white rounded-2xl p-8 border border-[#E8E8E8] hover:border-[#FF6F00] transition-all card-hover">
                    <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
                      style={{ backgroundColor: color + '18', color: color === '#0D0D0D' || color === '#2D2D2D' ? '#0D0D0D' : color }}>
                      {tm.role}
                    </div>
                    <p className="text-[#6B6B6B] leading-relaxed mb-4 italic">"{tm.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: color }}>
                        {tm.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-[#0D0D0D] text-sm">{tm.name}</div>
                        <div className="text-xs text-[#6B6B6B]">{tm.location}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Activity Log */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.logBadge}</span>
              <span className="rising-accent" />
            </div>
            <h2 className="text-3xl font-bold text-[#0D0D0D]">{t.logHeading}</h2>
            <p className="text-[#6B6B6B] mt-2 text-sm">{t.logDesc}</p>
          </div>
          <div className="space-y-4">
            {pastEvents.map((ev) => (
              <div key={ev.title} className="flex gap-4 border border-[#E8E8E8] rounded-2xl p-5 hover:border-[#FF6F00] transition-all">
                <div className="text-[#FF6F00] font-mono text-sm font-bold shrink-0 pt-0.5 tabular-nums whitespace-nowrap">
                  {new Date(ev.date).toLocaleString(lang === 'te' ? 'te-IN' : 'en-IN', { month: 'short', year: 'numeric' })}
                </div>
                <div className="flex-1">
                  <div className="flex items-start gap-2 flex-wrap">
                    <h3 className="font-bold text-[#0D0D0D] text-sm">{ev.title}{ev.district ? ` — ${ev.district}` : ''}</h3>
                    <span className="text-xs bg-[#0D0D0D] text-white px-2 py-0.5 rounded-full">{ev.type}</span>
                  </div>
                  {ev.description && <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">{ev.description}</p>}
                </div>
              </div>
            ))}
            {pastEvents.length === 0 && (
              <p className="text-center text-sm text-[#6B6B6B] py-8">
                {lang === 'te' ? 'కార్యాచరణ లాగ్ త్వరలో వస్తుంది.' : 'Activity log coming soon.'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#0D0D0D] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">{t.ctaHeading}</h2>
          <p className="text-white/40 mb-8">{t.ctaDesc}</p>
          <Link href="/community/join" className="inline-flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105">
            {t.ctaBtn} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
