'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

const hrefs   = ['/mission#youth', '/mission#women', '/mission#healthcare', '/mission#education'];
const numbers = ['01', '02', '03', '04'];
const emojis  = ['⚡', '👩', '🏥', '📚'];
const slugs   = ['youth', 'women', 'healthcare', 'education'];

export default function MissionPillars() {
  const { lang } = useLanguage();
  const t = i18n[lang].pillars;
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [pillarImages, setPillarImages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/pillars')
      .then(r => r.json())
      .then((rows: { slug: string; image_url: string }[]) => {
        const map: Record<string, string> = {};
        rows.forEach(r => { if (r.image_url) map[r.slug] = r.image_url; });
        setPillarImages(map);
      })
      .catch(() => {});
  }, []);

  return (
    <section ref={ref} className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0D0D0D] leading-tight">
              {t.heading}
            </h2>
          </div>
          <Link href="/mission" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D0D0D] hover:text-[#FF6F00] transition-colors group shrink-0">
            {t.learnMore}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.items.map((p, i) => (
            <Link
              key={i}
              href={hrefs[i]}
              className="group block"
              style={{
                opacity:    inView ? 1 : 0,
                transform:  inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `opacity 0.6s ${i * 0.12}s ease, transform 0.6s ${i * 0.12}s ease`,
              }}
            >
              <div className="h-full border border-[#E8E8E8] rounded-2xl overflow-hidden hover:border-[#FF6F00] hover:shadow-xl transition-all duration-300 flex flex-col">
                {/* Image or emoji placeholder */}
                <div className="relative w-full aspect-video bg-[#F5F5F5] overflow-hidden">
                  {pillarImages[slugs[i]] ? (
                    <Image
                      src={pillarImages[slugs[i]]}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl opacity-30">{emojis[i]}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute top-3 left-3 text-xs font-mono font-bold text-white/60">{numbers[i]}</span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-[#0D0D0D] text-base mb-0.5 group-hover:text-[#FF6F00] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mb-3">{p.telugu}</p>
                  <div className="w-8 h-px bg-[#FF6F00] mb-4 group-hover:w-full transition-all duration-500" />
                  <p className="text-sm text-[#6B6B6B] leading-relaxed flex-1">{p.desc}</p>
                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-[#FF6F00] opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.learnMore} <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
