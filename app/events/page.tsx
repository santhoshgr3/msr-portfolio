'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

type Event = {
  id: number; title: string; date: string; location: string; district: string;
  type: string; description: string; is_upcoming: boolean; rsvp_count: number;
};

const typeColors: Record<string, string> = {
  Healthcare: '#0D0D0D', Youth: '#FF6F00', Women: '#2D2D2D',
  Education: '#FF8F00', General: '#6B6B6B', Community: '#0369A1',
};

export default function EventsPage() {
  const { lang } = useLanguage();
  const t = i18n[lang].events;

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/events').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setEvents(data);
    }).catch(() => {});
  }, []);

  const upcoming = events.filter(e => e.is_upcoming);
  const past = events.filter(e => !e.is_upcoming);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

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
            {t.heroTitle.split('&')[0]}<span className="text-amber-gradient">& {t.heroTitle.split('& ')[1] || 'Programs'}</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">{t.heroDesc}</p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="rising-accent" />
                <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.upcomingBadge}</span>
              </div>
              <h2 className="text-3xl font-bold text-[#0D0D0D]">{t.upcomingHeading}</h2>
            </div>
            {upcoming.length > 0 && (
              <span className="flex items-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full pulse-live" /> {t.regOpen}
              </span>
            )}
          </div>

          {upcoming.length === 0 ? (
            <div className="text-center py-16 text-[#6B6B6B]">
              <Calendar size={40} className="mx-auto mb-3 opacity-20" />
              <p>{t.noUpcoming}</p>
            </div>
          ) : (
            <div className="space-y-5">
              {upcoming.map(ev => (
                <div key={ev.id} className="border border-[#E8E8E8] hover:border-[#FF6F00] rounded-2xl p-6 md:p-8 transition-all card-hover">
                  <div className="flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-3">
                        <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
                          style={{ backgroundColor: typeColors[ev.type] ?? '#6B6B6B' }}>
                          {ev.type}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-[#6B6B6B]">
                          <Calendar size={13} /> {formatDate(ev.date)}
                        </span>
                        {ev.location && (
                          <span className="flex items-center gap-1 text-sm text-[#6B6B6B]">
                            <MapPin size={13} /> {ev.location}{ev.district ? `, ${ev.district}` : ''}
                          </span>
                        )}
                        {ev.rsvp_count > 0 && (
                          <span className="flex items-center gap-1 text-sm text-[#6B6B6B]">
                            <Users size={13} /> {ev.rsvp_count} {t.spots}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[#0D0D0D] mb-2">{ev.title}</h3>
                      {ev.description && <p className="text-[#6B6B6B] text-sm leading-relaxed">{ev.description}</p>}
                    </div>
                    <div className="shrink-0">
                      <Link href="/community/join"
                        className="block bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-6 py-3 rounded-full transition-all text-center whitespace-nowrap">
                        {t.registerBtn}
                      </Link>
                      <p className="text-xs text-center text-[#6B6B6B] mt-2">{t.membersPriority}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past events */}
      {past.length > 0 && (
        <section className="py-20 px-4 bg-[#F5F5F5]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="rising-accent" />
                <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.pastBadge}</span>
              </div>
              <h2 className="text-3xl font-bold text-[#0D0D0D]">{t.pastHeading}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {past.map(ev => (
                <div key={ev.id} className="bg-white rounded-2xl p-5 border border-[#E8E8E8] hover:border-[#FF6F00] transition-all card-hover">
                  <span className="text-xs font-bold px-2 py-1 rounded-full text-white"
                    style={{ backgroundColor: typeColors[ev.type] ?? '#6B6B6B' }}>
                    {ev.type}
                  </span>
                  <h3 className="font-bold text-[#0D0D0D] mt-3 mb-2 text-sm">{ev.title}</h3>
                  <div className="text-xs text-[#6B6B6B] space-y-1.5">
                    <div className="flex items-center gap-1.5"><Calendar size={11} /> {formatDate(ev.date)}</div>
                    {ev.location && <div className="flex items-center gap-1.5"><MapPin size={11} /> {ev.location}</div>}
                    {ev.rsvp_count > 0 && <div className="flex items-center gap-1.5"><Users size={11} /> {ev.rsvp_count} {t.attended}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Volunteer CTA */}
      <section className="py-20 px-4 bg-[#0D0D0D] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">{t.ctaHeading}</h2>
          <p className="text-white/40 mb-8">{t.ctaDesc}</p>
          <Link href="/community/join"
            className="inline-flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105">
            {t.ctaBtn} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
