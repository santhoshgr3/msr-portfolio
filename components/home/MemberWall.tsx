'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { timeAgo } from '@/lib/utils';
import { ArrowRight, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

type Member = { id: number; full_name: string; city: string; created_at: string };

const PALETTE = ['#FF6F00', '#0D0D0D', '#2D2D2D', '#FF8F00', '#1A1A1A', '#FF6F00'];

export default function MemberWall() {
  const { lang } = useLanguage();
  const t = i18n[lang].memberWall;

  const [members, setMembers] = useState<Member[]>([]);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const load = () =>
      fetch('/api/members/recent?limit=12')
        .then(r => r.json())
        .then(d => { setMembers(d); setEmpty(d.length === 0); })
        .catch(() => {});
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 px-4 bg-[#F5F5F5]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="rising-accent" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0D0D0D]">{t.heading}</h2>
            <p className="text-[#6B6B6B] text-sm mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full pulse-live" />
              {t.sub}
            </p>
          </div>
          <Link href="/community" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D0D0D] hover:text-[#FF6F00] transition-colors group shrink-0">
            {t.viewAll} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {empty ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E8E8]">
            <Users size={40} className="text-[#E8E8E8] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0D0D0D] mb-2">
              {lang === 'te' ? 'వ్యవస్థాపక సభ్యుడు అవ్వండి' : 'Be a Founding Member'}
            </h3>
            <p className="text-[#6B6B6B] text-sm mb-6 max-w-xs mx-auto">
              {lang === 'te' ? 'ఉద్యమం ఇప్పుడే మొదలవుతోంది. మొదట చేరండి — మీ పేరు #1 అవుతుంది.' : 'The movement is just beginning. Join first — your name will be #1.'}
            </p>
            <Link href="/community/join" className="inline-flex items-center gap-2 bg-[#FF6F00] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#E65100] transition-colors">
              {lang === 'te' ? 'మొదట చేరండి' : 'Join First'} <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {members.map((m, i) => (
              <div key={m.id} className="bg-white rounded-2xl p-4 text-center border border-[#E8E8E8] hover:border-[#FF6F00] hover:shadow-lg transition-all duration-300 group">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base mx-auto mb-2 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                >
                  {m.full_name[0]}
                </div>
                <div className="font-semibold text-[#0D0D0D] text-xs truncate">{m.full_name.split(' ')[0]}</div>
                <div className="text-[#6B6B6B] text-xs truncate">{m.city}</div>
                <div className="text-[#FF6F00] text-[10px] mt-1 font-medium">{timeAgo(m.created_at)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
