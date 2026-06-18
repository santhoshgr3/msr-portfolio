'use client';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

type Stat = { value: number; suffix: string; label: string; sublabel: string };

export default function LiveCounters() {
  const { lang } = useLanguage();
  const t = i18n[lang].counters;

  const [values, setValues] = useState({ members: 0, lives: 0, events: 0, followers: 0, years: 0 });
  const [started, setStarted] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.25 });

  useEffect(() => {
    const load = () =>
      fetch('/api/stats').then(r => r.json()).then(d =>
        setValues({
          members:   d.members || 0,
          lives:     d.lives_impacted || 0,
          events:    d.events || 0,
          followers: d.social_followers || 0,
          years:     d.years_service || (new Date().getFullYear() - 2018),
        })
      ).catch(() => {});
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { if (inView) setStarted(true); }, [inView]);

  const stats: Stat[] = [
    { value: values.members,   suffix: '+',  label: t.labels[0].label, sublabel: t.labels[0].sub },
    { value: values.lives,     suffix: '+',  label: t.labels[1].label, sublabel: t.labels[1].sub },
    { value: values.events,    suffix: '+',  label: t.labels[2].label, sublabel: t.labels[2].sub },
    { value: values.followers, suffix: 'K+', label: t.labels[3].label, sublabel: t.labels[3].sub },
    { value: values.years,     suffix: '+',  label: t.labels[4].label, sublabel: t.labels[4].sub },
  ];

  return (
    <section ref={ref} className="py-20 px-4 bg-white border-b border-[#E8E8E8]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-14">
          <span className="rising-accent" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-green-500 rounded-full pulse-live" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.sub}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D0D0D]">{t.heading}</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-4">
          {stats.map((s, i) => (
            <div key={i} className="group text-center md:text-left">
              <div className="text-4xl md:text-5xl font-black text-[#0D0D0D] tracking-tight leading-none mb-1 tabular-nums">
                {started ? (
                  <CountUp start={0} end={s.value} duration={2.2} separator="," delay={i * 0.12} />
                ) : '0'}
                <span className="text-[#FF6F00]">{s.suffix}</span>
              </div>
              <div className="w-8 h-0.5 bg-[#FF6F00] my-3 mx-auto md:mx-0 group-hover:w-12 transition-all duration-300" />
              <div className="font-semibold text-[#0D0D0D] text-sm">{s.label}</div>
              <div className="text-[#6B6B6B] text-xs mt-0.5">{s.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
