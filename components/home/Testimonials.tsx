'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

type Item = { id: number; quote: string; name: string; location: string; role: string };

export default function Testimonials() {
  const { lang } = useLanguage();
  const t = i18n[lang].testimonials;

  const [items, setItems] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then((d: Item[]) => setItems(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => setIdx(c => (c === items.length - 1 ? 0 : c + 1)), 6000);
    return () => clearInterval(timer);
  }, [items]);

  if (items.length === 0) return null;

  const prev = () => setIdx(c => (c === 0 ? items.length - 1 : c - 1));
  const next = () => setIdx(c => (c === items.length - 1 ? 0 : c + 1));
  const item = items[idx];

  return (
    <section className="py-24 px-4 bg-white border-t border-[#E8E8E8]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="rising-accent" />
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.badge}</span>
            <span className="rising-accent" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0D0D0D]">{t.heading}</h2>
        </div>

        <div className="relative">
          <div className="absolute -top-6 left-8 text-[100px] leading-none font-serif text-[#F5F5F5] select-none pointer-events-none">"</div>

          <div className="bg-[#F5F5F5] rounded-3xl p-10 md:p-14 relative z-10">
            <p className="text-[#0D0D0D] text-lg md:text-xl leading-relaxed mb-10 font-light">
              "{item.quote}"
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FF6F00] flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {item.name[0]}
                </div>
                <div>
                  <div className="font-bold text-[#0D0D0D]">{item.name}</div>
                  <div className="text-sm text-[#6B6B6B]">{item.location}</div>
                  <div className="text-xs text-[#FF6F00] font-medium mt-0.5">{item.role}</div>
                </div>
              </div>

              {items.length > 1 && (
                <div className="flex items-center gap-3">
                  <button onClick={prev} className="w-10 h-10 rounded-full border border-[#E8E8E8] hover:border-[#FF6F00] flex items-center justify-center text-[#0D0D0D] hover:text-[#FF6F00] transition-all">
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex gap-1.5">
                    {items.map((_, i) => (
                      <button key={i} onClick={() => setIdx(i)}
                        className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-[#FF6F00]' : 'w-1.5 bg-[#E8E8E8]'}`}
                      />
                    ))}
                  </div>
                  <button onClick={next} className="w-10 h-10 rounded-full border border-[#E8E8E8] hover:border-[#FF6F00] flex items-center justify-center text-[#0D0D0D] hover:text-[#FF6F00] transition-all">
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
