'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

const timelineEn = [
  { year: '2018', event: 'Founded Helping Hands Organization' },
  { year: '2019', event: 'Launched Sunny Anna Yuvasena' },
  { year: '2022', event: 'Four mission pillars formalized' },
  { year: 'Now',  event: 'Thousands of members, growing statewide' },
];

const timelineTe = [
  { year: '2018', event: 'హెల్పింగ్ హ్యాండ్స్ ఆర్గనైజేషన్ స్థాపించారు' },
  { year: '2019', event: 'సన్నీ అన్న యువసేన ప్రారంభించారు' },
  { year: '2022', event: 'నాలుగు మిషన్ స్తంభాలు అధికారికం' },
  { year: 'ఇప్పుడు', event: 'వేలాది సభ్యులు, రాష్ట్రవ్యాప్తంగా పెరుగుతున్నారు' },
];

export default function StoryReveal() {
  const { lang } = useLanguage();
  const t = i18n[lang].story;
  const timeline = lang === 'te' ? timelineTe : timelineEn;

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section ref={ref} className="py-24 px-4 bg-[#F5F5F5]">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Photo block */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}
          >
            <div className="aspect-[4/5] max-w-md mx-auto rounded-3xl overflow-hidden relative shadow-2xl">
              <Image
                src="/sunny-anna-story.jpg"
                alt="Dr. Madhiraj Sairathan"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 90vw, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6F00] flex items-center justify-center shrink-0">
                    <span className="text-white text-lg font-bold">S</span>
                  </div>
                  <div>
                    <div className="font-bold text-[#0D0D0D] text-sm">Dr. Madhiraj Sairathan</div>
                    <div className="text-[#6B6B6B] text-xs">Bhupalpally, Telangana</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-[#FF6F00] opacity-10 -z-10" />
            <div className="absolute -top-6 -left-6 w-20 h-20 rounded-2xl bg-[#0D0D0D] opacity-5 -z-10" />
          </div>

          {/* Text */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateX(0)' : 'translateX(40px)',
              transition: 'opacity 0.8s 0.2s ease, transform 0.8s 0.2s ease',
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.badge}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-[#0D0D0D] leading-tight mb-6">
              {t.heading}
            </h2>

            <p className="text-[#6B6B6B] text-base leading-relaxed mb-4">{t.p1}</p>
            <p className="text-[#6B6B6B] text-base leading-relaxed mb-4">{t.p2}</p>
            <p className="text-[#6B6B6B] text-base leading-relaxed mb-8">{t.p3}</p>

            {/* Mini timeline */}
            <div className="space-y-3 mb-10">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-14 text-right shrink-0">
                    <span className="text-xs font-bold font-mono text-[#FF6F00]">{item.year}</span>
                  </div>
                  <div className="w-px h-5 bg-[#E8E8E8]" />
                  <span className="text-sm text-[#0D0D0D]">{item.event}</span>
                </div>
              ))}
            </div>

            <Link href="/about"
              className="inline-flex items-center gap-2 bg-[#0D0D0D] hover:bg-[#FF6F00] text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 group">
              {t.readMore}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
