'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

export default function ImpactTicker() {
  const { lang } = useLanguage();
  const t = i18n[lang].ticker;

  const [liveItems, setLiveItems] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/members/recent?limit=5')
      .then(r => r.json())
      .then(data => {
        if (data.length) {
          const live = data.map((m: { full_name: string; city: string }) =>
            lang === 'te'
              ? `✅ ${m.full_name.split(' ')[0]} ${m.city} నుండి ఉద్యమంలో చేరారు`
              : `✅ ${m.full_name.split(' ')[0]} from ${m.city} just joined the movement`
          );
          setLiveItems(live);
        }
      })
      .catch(() => {});
  }, [lang]);

  const items = [...liveItems, ...t.items];
  const text = items.join('   ·   ');

  return (
    <div className="bg-[#0D0D0D] py-3 overflow-hidden border-b border-white/5">
      <div className="flex">
        <div className="ticker-track flex shrink-0">
          <span className="text-white/50 text-xs font-medium px-4 whitespace-nowrap">
            {text}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{text}
          </span>
        </div>
      </div>
    </div>
  );
}
