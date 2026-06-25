'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Section = { name: string; items: string[] };
type Pillar = {
  emoji: string;
  title: string;
  color: string;
  intro: string;
  sections: Section[];
};

interface Props {
  pillars: Pillar[];
  images?: Record<string, string>;
}

const slugs = ['youth', 'women', 'healthcare', 'education'];

export default function HorizontalPillars({ pillars, images = {} }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile !== false) return;

    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;
        const strip = stripRef.current;
        if (!section || !strip) return;

        ctx = gsap.context(() => {
          gsap.to(strip, {
            x: () => -(strip.scrollWidth - window.innerWidth),
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${strip.scrollWidth - window.innerWidth}`,
              scrub: 1.5,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                setProgress(self.progress);
                setActiveIndex(
                  Math.min(
                    pillars.length - 1,
                    Math.floor(self.progress * pillars.length + 0.01)
                  )
                );
              },
            },
          });
        }, section);
      } catch {
        // GSAP init failed — component will remain visible without animation
      }
    };

    init();
    return () => { ctx?.revert(); };
  }, [isMobile, pillars.length]);

  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div className="bg-[#0D0D0D] py-16 px-4 space-y-20">
        {pillars.map((pillar, pi) => (
          <div key={pi} id={`pillar-${pi}`}>
            <div className="mb-8">
              <div className="font-mono text-white/20 text-xs tracking-[0.3em] mb-4">
                {String(pi + 1).padStart(2, '0')} / {String(pillars.length).padStart(2, '0')}
              </div>
              {images[slugs[pi]] ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4">
                  <Image src={images[slugs[pi]]} alt={pillar.title} fill className="object-cover" sizes="100vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              ) : (
                <div className="text-5xl mb-4">{pillar.emoji}</div>
              )}
              <div
                className="w-10 h-1 rounded mb-4"
                style={{ backgroundColor: pillar.color, transform: 'skewX(-12deg)' }}
              />
              <h2 className="text-2xl font-black text-white mb-3">{pillar.title}</h2>
              <p className="text-white/40 text-sm leading-relaxed">{pillar.intro}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {pillar.sections.map((sec, si) => (
                <div
                  key={si}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/25 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0"
                      style={{ backgroundColor: pillar.color }}
                    >
                      {si + 1}
                    </div>
                    <h3 className="text-white/80 text-sm font-bold leading-tight">{sec.name}</h3>
                  </div>
                  <div className="w-full h-px bg-white/10 mb-3" />
                  <ul className="space-y-2">
                    {sec.items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-2">
                        <div
                          className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: pillar.color }}
                        />
                        <span className="text-white/35 text-xs leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0D0D0D]"
      style={{ height: '100vh' }}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/5 z-30 pointer-events-none">
        <div
          className="h-full bg-[#FF6F00]"
          style={{
            width: `${progress * 100}%`,
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* Active pillar label — top left */}
      <div className="absolute top-5 left-8 z-30 pointer-events-none">
        <span className="text-white/20 text-[11px] font-mono tracking-[0.25em] uppercase">
          Pillar {String(activeIndex + 1).padStart(2, '0')} — {pillars[activeIndex]?.title}
        </span>
      </div>

      {/* Dot nav — top right */}
      <div className="absolute top-4 right-8 z-30 flex items-center gap-2.5">
        {pillars.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === activeIndex ? '28px' : '8px',
              height: '8px',
              backgroundColor: i === activeIndex ? '#FF6F00' : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 right-8 z-30 flex items-center gap-2.5 pointer-events-none transition-opacity duration-500"
        style={{ opacity: progress > 0.9 ? 0 : 0.55 }}
      >
        <span className="text-white/50 text-[11px] uppercase tracking-[0.2em]">scroll</span>
        <svg width="22" height="8" viewBox="0 0 22 8" fill="none">
          <path
            d="M0 4h19M15 1l4 3-4 3"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Pillar index — bottom left */}
      <div className="absolute bottom-8 left-8 z-30 pointer-events-none">
        <span
          className="font-black text-white"
          style={{ fontSize: '11px', opacity: 0.12, letterSpacing: '0.1em' }}
        >
          {pillars.map((p) => p.title.toUpperCase()).join(' · ')}
        </span>
      </div>

      {/* Horizontal strip */}
      <div
        ref={stripRef}
        className="flex h-full will-change-transform"
        style={{ width: `${pillars.length * 100}vw` }}
      >
        {pillars.map((pillar, pi) => (
          <div
            key={pi}
            className="relative flex items-center shrink-0"
            style={{ width: '100vw', height: '100vh' }}
          >
            {/* Left accent edge */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{
                background: `linear-gradient(to bottom, ${pillar.color} 0%, transparent 100%)`,
              }}
            />

            {/* Watermark number */}
            <div
              className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none"
              aria-hidden
              style={{ paddingRight: '6vw' }}
            >
              <span
                className="font-black leading-none text-white"
                style={{
                  fontSize: 'clamp(160px, 22vw, 300px)',
                  opacity: 0.035,
                  letterSpacing: '-0.05em',
                }}
              >
                {String(pi + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Panel content */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto grid grid-cols-5 gap-10 xl:gap-16 items-center px-14 xl:px-20">

              {/* Identity column */}
              <div className="col-span-2">
                <div className="font-mono text-white/15 text-[11px] tracking-[0.4em] mb-8">
                  {String(pi + 1).padStart(2, '0')} / {String(pillars.length).padStart(2, '0')}
                </div>
                {images[slugs[pi]] ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6">
                    <Image src={images[slugs[pi]]} alt={pillar.title} fill className="object-cover" sizes="40vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                ) : (
                  <div className="text-5xl xl:text-6xl mb-6 select-none">{pillar.emoji}</div>
                )}
                <div
                  className="w-12 h-[3px] mb-6"
                  style={{
                    backgroundColor: pillar.color,
                    transform: 'skewX(-12deg)',
                  }}
                />
                <h2 className="text-3xl xl:text-5xl font-black text-white leading-[1.05] mb-6">
                  {pillar.title}
                </h2>
                <p className="text-white/40 text-sm xl:text-[15px] leading-relaxed max-w-[280px]">
                  {pillar.intro}
                </p>
              </div>

              {/* Cards column */}
              <div className="col-span-3 grid grid-cols-3 gap-4 xl:gap-5">
                {pillar.sections.map((sec, si) => (
                  <div
                    key={si}
                    className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] hover:border-white/25 transition-all duration-300 flex flex-col"
                  >
                    <div className="flex items-center gap-2.5 mb-4">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0"
                        style={{ backgroundColor: pillar.color }}
                      >
                        {si + 1}
                      </div>
                      <h3 className="text-white/80 text-xs font-bold leading-snug">{sec.name}</h3>
                    </div>
                    <div className="w-full h-px bg-white/10 mb-4" />
                    <ul className="space-y-2.5 flex-1">
                      {sec.items.map((item, ii) => (
                        <li key={ii} className="flex items-start gap-2">
                          <div
                            className="w-1 h-1 rounded-full mt-[5px] shrink-0"
                            style={{ backgroundColor: pillar.color }}
                          />
                          <span className="text-white/35 text-[11px] leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
