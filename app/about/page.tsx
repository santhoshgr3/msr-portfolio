'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Phone, Mail, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { i18n } from '@/lib/i18n';

const COLORS = ['#FF6F00', '#0D0D0D', '#FF8F00', '#2D2D2D'];

const positions = [
  { label: '✅ Movement Builder', ok: true },
  { label: '✅ Social Innovator', ok: true },
  { label: '✅ Community Leader', ok: true },
  { label: '✅ Change Maker', ok: true },
  { label: '❌ Politician', ok: false },
  { label: '❌ NGO Representative', ok: false },
  { label: '❌ Businessman', ok: false },
];

export default function AboutPage() {
  const { lang } = useLanguage();
  const s = useSettings();
  const t = i18n[lang].about;

  const [timeline, setTimeline] = useState<{ id: number; year: string; title: string; description: string; highlight: boolean }[]>([]);
  const [team, setTeam] = useState<{ id: number; name: string; role: string; initial: string }[]>([]);

  useEffect(() => {
    fetch('/api/timeline').then(r => r.json()).then(setTimeline).catch(() => {});
    fetch('/api/team').then(r => r.json()).then(setTeam).catch(() => {});
  }, []);

  const orgData = lang === 'te'
    ? [
        { emoji: '⚡', name: 'సన్నీ అన్న యువసేన', desc: 'తెలంగాణ అంతటా నాయకత్వం, సామాజిక చర్య మరియు పౌర నిమగ్నత కోసం ఒక యువ ఉద్యమం. సభ్యులు డిజిటల్ ID పొందుతారు మరియు మార్పు సాధకుల నెట్‌వర్క్‌లో భాగమవుతారు.', tags: ['యువత నాయకత్వం', 'పౌర నిమగ్నత', 'నెట్‌వర్కింగ్', 'సామాజిక చర్య'] },
        { emoji: '🤝', name: 'హెల్పింగ్ హ్యాండ్స్ ఆర్గనైజేషన్', desc: 'వెనుకబడిన కుటుంబాలకు ఆరోగ్య సంరక్షణ, స్వచ్ఛ నీరు, ఆహారం, ఆశ్రయం మరియు వృత్తి శిక్షణ అందించే సేవా సంస్థ.', tags: ['ఆరోగ్య సంరక్షణ', 'స్వచ్ఛ నీరు', 'వృత్తి శిక్షణ', 'ఆశ్రయం'] },
      ]
    : [
        { emoji: '⚡', name: 'Sunny Anna Yuvasena', desc: 'A youth movement for leadership, social action, and civic engagement across Telangana. Members receive a digital ID and become part of a growing network of change-makers.', tags: ['Youth Leadership', 'Civic Engagement', 'Networking', 'Social Action'] },
        { emoji: '🤝', name: 'Helping Hands Organization', desc: 'A service organization providing healthcare, clean drinking water, food, shelter, and vocational training to underprivileged families. Built on empathy, collaboration, and the belief that every life deserves dignity.', tags: ['Healthcare', 'Clean Water', 'Vocational Training', 'Shelter'] },
      ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0D0D0D] pt-36 pb-28 px-4 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
          <line x1="0" y1="600" x2="1440" y2="100" stroke="#FF6F00" strokeWidth="2"/>
          <line x1="0" y1="480" x2="1200" y2="0" stroke="white" strokeWidth="1"/>
        </svg>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="rising-accent" />
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.heroBadge}</span>
            <span className="rising-accent" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
            Dr. Madhiraj<br />
            <span className="text-amber-gradient">Sairathan</span>
          </h1>
          <p className="text-white/40 text-lg italic mb-2">{t.heroSub}</p>
          <p className="text-white/25 text-sm">{t.heroTagline}</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] max-w-md mx-auto rounded-3xl bg-[#F5F5F5] flex items-center justify-center border border-[#E8E8E8]">
                <div className="text-center text-[#6B6B6B]">
                  <div className="w-20 h-20 rounded-full bg-[#E8E8E8] mx-auto mb-3 flex items-center justify-center">
                    <span className="text-3xl font-black text-[#0D0D0D]">S</span>
                  </div>
                  <p className="text-sm">[ Portrait photo of Dr. Madhiraj ]</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-2xl bg-[#FF6F00]/10 -z-10" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="rising-accent" />
                <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.introBadge}</span>
              </div>
              <h2 className="text-3xl font-bold text-[#0D0D0D] mb-6 leading-tight">
                {t.introHeading}
              </h2>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">{t.p1}</p>
              <p className="text-[#6B6B6B] leading-relaxed mb-4">{t.p2}</p>
              <p className="text-[#6B6B6B] leading-relaxed mb-8">{t.p3}</p>
              <div className="bg-[#F5F5F5] rounded-2xl p-5 mb-8">
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-3">{t.positionLabel}</p>
                <div className="grid grid-cols-2 gap-1">
                  {positions.map((p, i) => (
                    <div key={i} className={`text-sm py-1 ${p.ok ? 'text-[#0D0D0D] font-medium' : 'text-[#6B6B6B] line-through opacity-50'}`}>
                      {p.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { icon: <Phone size={14} />, text: s.phone, href: `tel:${s.phone.replace(/\s/g, '')}` },
                  { icon: <Mail size={14} />, text: s.email, href: `mailto:${s.email}` },
                  { icon: <Globe size={14} />, text: s.website.replace(/^https?:\/\//, '').replace(/\/$/, ''), href: s.website },
                ].map((c, i) => (
                  <a key={i} href={c.href} className="flex items-center gap-2.5 text-sm text-[#6B6B6B] hover:text-[#FF6F00] transition-colors">
                    <span className="text-[#FF6F00]">{c.icon}</span>{c.text}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-16 px-4 bg-[#0D0D0D]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { v: `${new Date().getFullYear() - 2018}+`, l: t.stats[0] },
              { v: '2', l: t.stats[1] },
              { v: '4', l: t.stats[2] },
              { v: '33', l: t.stats[3] },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-4xl font-black text-[#FF6F00] tabular-nums mb-1">{s.v}</div>
                <div className="w-6 h-px bg-[#FF6F00] mx-auto mb-2" />
                <div className="text-white/40 text-xs uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-24 px-4 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.focusBadge}</span>
              <span className="rising-accent" />
            </div>
            <h2 className="text-3xl font-bold text-[#0D0D0D]">{t.focusHeading}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.areas.map((area, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#E8E8E8] hover:border-[#FF6F00] transition-all card-hover">
                <div className="text-3xl mb-3">{area.emoji}</div>
                <div className="w-6 h-0.5 bg-[#FF6F00] mb-3" style={{ transform: 'skewX(-12deg)' }} />
                <h3 className="font-bold text-[#0D0D0D] text-sm mb-2">{area.title}</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.timelineBadge}</span>
              <span className="rising-accent" />
            </div>
            <h2 className="text-3xl font-bold text-[#0D0D0D]">{t.timelineHeading}</h2>
          </div>
          <div className="relative pl-8 border-l border-[#E8E8E8]">
            {timeline.map((item) => (
              <div key={item.id} className="relative mb-10 last:mb-0">
                <div className={`absolute -left-[25px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${item.highlight ? 'bg-[#FF6F00]' : 'bg-[#0D0D0D]'}`} />
                <div className="bg-[#F5F5F5] rounded-2xl p-5 border border-[#E8E8E8] hover:border-[#FF6F00] transition-colors">
                  <span className="font-mono text-[#FF6F00] font-bold text-sm">{item.year}</span>
                  <h3 className="font-bold text-[#0D0D0D] mt-0.5 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two organizations */}
      <section className="py-24 px-4 bg-[#F5F5F5]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.orgBadge}</span>
              <span className="rising-accent" />
            </div>
            <h2 className="text-3xl font-bold text-[#0D0D0D]">{t.orgHeading}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {orgData.map((org, i) => (
              <div key={i} className="bg-white border border-[#E8E8E8] rounded-2xl p-8 hover:border-[#FF6F00] hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">{org.emoji}</div>
                <h3 className="font-bold text-[#0D0D0D] text-lg mb-3">{org.name}</h3>
                <div className="w-8 h-0.5 bg-[#FF6F00] mb-4" />
                <p className="text-[#6B6B6B] text-sm leading-relaxed mb-5">{org.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {org.tags.map(tag => (
                    <span key={tag} className="text-xs bg-[#F5F5F5] text-[#6B6B6B] border border-[#E8E8E8] px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="rising-accent" />
                <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.teamBadge}</span>
                <span className="rising-accent" />
              </div>
              <h2 className="text-3xl font-bold text-[#0D0D0D]">{t.teamHeading}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {team.map((member, i) => (
                <div key={member.id} className="border border-[#E8E8E8] rounded-2xl p-6 text-center hover:border-[#FF6F00] transition-all card-hover">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-base mx-auto mb-4"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                    {member.initial || member.name[0]}
                  </div>
                  <div className="font-bold text-[#0D0D0D] text-sm mb-1">{member.name}</div>
                  <div className="w-5 h-0.5 bg-[#FF6F00] mx-auto mb-2" style={{ transform: 'skewX(-12deg)' }} />
                  <div className="text-xs text-[#6B6B6B]">{member.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
