'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Trophy, MapPin, ArrowRight, Zap } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

const COLORS = ['#FF6F00', '#0D0D0D', '#2D2D2D', '#FF8F00', '#1A1A1A'];
type Member = { id: number; full_name: string; city: string; created_at: string };

export default function CommunityPage() {
  const { lang } = useLanguage();
  const t = i18n[lang].community;

  const [members, setMembers] = useState<Member[]>([]);
  const [count, setCount] = useState(0);
  const [tab, setTab] = useState<'wall' | 'leaderboard' | 'map'>('wall');

  useEffect(() => {
    const load = async () => {
      const [s, m] = await Promise.all([
        fetch('/api/stats').then(r => r.json()).catch(() => ({})),
        fetch('/api/members/recent?limit=50').then(r => r.json()).catch(() => []),
      ]);
      setCount(s.members || 0);
      setMembers(m);
    };
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0D0D0D] pt-32 pb-24 px-4 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 1440 500" fill="none" preserveAspectRatio="none">
          <line x1="0" y1="500" x2="1440" y2="0" stroke="#FF6F00" strokeWidth="2"/>
        </svg>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {count > 0 && (
            <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full pulse-live" />
              <span className="text-white/50 text-sm"><span className="text-white font-bold">{count.toLocaleString()}</span> {t.membersGrowing}</span>
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            {t.heroTitle.split(' ').slice(0, -1).join(' ')} <span className="text-amber-gradient">{t.heroTitle.split(' ').slice(-1)[0]}</span>
          </h1>
          <p className="text-white/40 text-lg mb-8 max-w-xl mx-auto">{t.heroDesc}</p>
          <Link href="/community/join" className="inline-flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105">
            <Zap size={18} /> {t.joinCta}
          </Link>
          <p className="text-white/25 text-xs mt-4">{t.heroSub}</p>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 px-4 bg-white border-b border-[#E8E8E8]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.benefitsBadge}</span>
              <span className="rising-accent" />
            </div>
            <h2 className="text-2xl font-bold text-[#0D0D0D]">{t.benefitsHeading}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.benefits.map((item, i) => (
              <div key={i} className="border border-[#E8E8E8] rounded-2xl p-6 hover:border-[#FF6F00] hover:shadow-md transition-all card-hover text-center">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-[#0D0D0D] mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-[#6B6B6B]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab section */}
      <section className="py-20 px-4 bg-[#F5F5F5]">
        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-1 mb-10 bg-white rounded-full p-1 max-w-xs mx-auto border border-[#E8E8E8] shadow-sm">
            {[
              { key: 'wall', icon: <Users size={14} />, label: t.wall },
              { key: 'leaderboard', icon: <Trophy size={14} />, label: t.leaderboard },
              { key: 'map', icon: <MapPin size={14} />, label: t.map },
            ].map(tb => (
              <button key={tb.key} onClick={() => setTab(tb.key as 'wall' | 'leaderboard' | 'map')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  tab === tb.key ? 'bg-[#0D0D0D] text-white shadow' : 'text-[#6B6B6B] hover:text-[#0D0D0D]'
                }`}>
                {tb.icon} {tb.label}
              </button>
            ))}
          </div>

          {tab === 'wall' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#0D0D0D]">{t.recent}</h3>
                <span className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full pulse-live" /> {t.liveLabel}
                </span>
              </div>
              {members.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E8E8]">
                  <div className="text-5xl mb-4">🌱</div>
                  <h3 className="text-lg font-bold text-[#0D0D0D] mb-2">{t.foundingTitle}</h3>
                  <p className="text-[#6B6B6B] text-sm mb-6 max-w-xs mx-auto">{t.foundingDesc}</p>
                  <Link href="/community/join" className="bg-[#FF6F00] text-white font-bold px-6 py-3 rounded-full text-sm">{t.foundingBtn}</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {members.map((m, i) => (
                    <div key={m.id} className="bg-white rounded-2xl p-4 text-center border border-[#E8E8E8] hover:border-[#FF6F00] transition-all group">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2 group-hover:scale-110 transition-transform" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                        {m.full_name[0]}
                      </div>
                      <div className="font-semibold text-[#0D0D0D] text-xs truncate">{m.full_name.split(' ')[0]}</div>
                      <div className="text-[#6B6B6B] text-xs truncate">{m.city}</div>
                      <div className="text-[#FF6F00] text-[10px] mt-1">{timeAgo(m.created_at)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'leaderboard' && (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E8E8]">
              <Trophy size={40} className="text-[#FF6F00] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0D0D0D] mb-2">{t.leaderboardTitle}</h3>
              <p className="text-[#6B6B6B] mb-6 text-sm max-w-sm mx-auto">{t.leaderboardDesc}</p>
              <Link href="/community/join" className="inline-flex items-center gap-2 bg-[#FF6F00] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#E65100] transition-colors">
                {t.leaderboardBtn} <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {tab === 'map' && (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E8E8]">
              <MapPin size={40} className="text-[#0D0D0D] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0D0D0D] mb-2">{t.mapTitle}</h3>
              <p className="text-[#6B6B6B] text-sm mb-6">{t.mapDesc}</p>
              <div className="bg-[#F5F5F5] rounded-2xl aspect-video flex items-center justify-center border border-[#E8E8E8]">
                <div className="text-center">
                  <div className="text-4xl mb-3">🗺️</div>
                  <p className="text-[#6B6B6B] text-sm">District density map — powered by Leaflet.js</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 bg-[#0D0D0D] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">{t.ctaHeading}</h2>
          <p className="text-white/40 mb-8">{count > 0 ? `${count.toLocaleString()} ${t.membersGrowing}` : t.ctaDesc}</p>
          <Link href="/community/join" className="inline-flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105">
            {t.ctaBtn} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
