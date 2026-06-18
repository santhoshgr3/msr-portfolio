'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Play, Info, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

const PARTICLES: {
  x: string; y: string; r: number; opacity: number;
  color: string; dur: string; delay: string;
}[] = [
  { x: '18%', y: '22%', r: 2.5, opacity: 0.45, color: '#FF6F00', dur: '4.2s', delay: '0s'   },
  { x: '74%', y: '18%', r: 2,   opacity: 0.25, color: 'white',   dur: '5.1s', delay: '0.7s' },
  { x: '82%', y: '50%', r: 3.5, opacity: 0.18, color: '#FF6F00', dur: '3.8s', delay: '1.2s' },
  { x: '60%', y: '73%', r: 1.5, opacity: 0.22, color: 'white',   dur: '4.6s', delay: '0.3s' },
  { x: '36%', y: '12%', r: 2,   opacity: 0.20, color: '#FF6F00', dur: '5.5s', delay: '1.8s' },
  { x: '91%', y: '82%', r: 1.5, opacity: 0.13, color: 'white',   dur: '4.0s', delay: '0.5s' },
  { x: '11%', y: '62%', r: 2,   opacity: 0.16, color: '#FF6F00', dur: '3.5s', delay: '2.1s' },
  { x: '52%', y: '40%', r: 4.5, opacity: 0.07, color: '#FF6F00', dur: '6.0s', delay: '1.0s' },
  { x: '44%', y: '80%', r: 1.5, opacity: 0.12, color: 'white',   dur: '4.9s', delay: '1.5s' },
  { x: '28%', y: '55%', r: 1,   opacity: 0.10, color: '#FF6F00', dur: '5.8s', delay: '2.5s' },
];

export default function HeroSection() {
  const { lang } = useLanguage();
  const t = i18n[lang].hero;

  const sectionRef    = useRef<HTMLElement>(null);
  const bgRef         = useRef<HTMLDivElement>(null);
  const watermarkRef  = useRef<HTMLDivElement>(null);
  const linesRef      = useRef<HTMLDivElement>(null);
  const particlesRef  = useRef<HTMLDivElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);
  const videoRef      = useRef<HTMLVideoElement>(null);

  const [muted,       setMuted]       = useState(true);
  const [visible,     setVisible]     = useState(false);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => setMemberCount(d.members || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      const base = (scrub: number) => ({
        trigger: section, start: 'top top', end: 'bottom top', scrub,
      });

      ctx = gsap.context(() => {
        gsap.to(bgRef.current,        { y: '42%', ease: 'none', scrollTrigger: base(2.0) });
        gsap.to(watermarkRef.current, { y: '28%', ease: 'none', scrollTrigger: base(1.7) });
        gsap.to(linesRef.current,     { y: '15%', ease: 'none', scrollTrigger: base(1.4) });
        gsap.to(particlesRef.current, { y:  '8%', ease: 'none', scrollTrigger: base(1.0) });
        gsap.to(contentRef.current,   { y:  '3%', ease: 'none', scrollTrigger: base(0.6) });
      }, section);
    })();

    return () => { cancelled = true; ctx?.revert(); };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[90vh] min-h-[620px] max-h-[900px] overflow-hidden bg-[#0D0D0D]"
    >
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-11px); }
        }
        .p-float { animation: heroFloat var(--fdur,4s) ease-in-out var(--fdel,0s) infinite; }
      `}</style>

      {/* LAYER 1 — Deep background */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay loop muted playsInline
          poster="/hero-poster.jpg"
          preload="none"
        />
        <div className="absolute inset-0 bg-[#0D0D0D]">
          <div className="absolute bottom-0 left-0 w-[65%] h-[72%]"
            style={{ background: 'radial-gradient(ellipse at bottom left, rgba(255,111,0,0.13) 0%, transparent 68%)' }} />
          <div className="absolute top-0 right-0 w-[48%] h-[65%]"
            style={{ background: 'radial-gradient(ellipse at top right, rgba(255,111,0,0.065) 0%, transparent 68%)' }} />
          <div className="absolute top-1/2 right-[14%] -translate-y-1/2 w-[520px] h-[520px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,111,0,0.045) 0%, transparent 65%)' }} />
        </div>
      </div>

      {/* LAYER 2 — Watermark */}
      <div ref={watermarkRef} className="absolute inset-0 z-[1] will-change-transform pointer-events-none select-none overflow-hidden" aria-hidden>
        <div className="absolute -bottom-2 left-0 font-black leading-[0.82] text-white"
          style={{ fontSize: 'clamp(105px, 15vw, 210px)', opacity: 0.03, letterSpacing: '-0.04em' }}>
          తెలంగాణ
        </div>
        <div className="absolute -bottom-44 -left-28 w-[740px] h-[740px] rounded-full border border-[#FF6F00]/10" />
        <div className="absolute -bottom-28 -left-12 w-[560px] h-[560px] rounded-full border border-[#FF6F00]/7"  />
        <div className="absolute  bottom-2   left-8  w-[390px] h-[390px] rounded-full border border-[#FF6F00]/5"  />
        <div className="absolute top-[38%] -right-52 w-[600px] h-[600px] rounded-full border border-white/[0.038]" />
        <div className="absolute top-[32%] -right-80 w-[800px] h-[800px] rounded-full border border-white/[0.022]" />
      </div>

      {/* LAYER 3 — Diagonal lines */}
      <div ref={linesRef} className="absolute inset-0 z-[2] will-change-transform pointer-events-none overflow-hidden" aria-hidden>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <line x1="0"   y1="900" x2="1440" y2="180" stroke="#FF6F00" strokeWidth="1"   opacity="0.068"/>
          <line x1="0"   y1="700" x2="1100" y2="0"   stroke="#FF6F00" strokeWidth="0.6" opacity="0.042"/>
          <line x1="0"   y1="500" x2="820"  y2="0"   stroke="#FF6F00" strokeWidth="0.4" opacity="0.028"/>
          <line x1="200" y1="900" x2="1440" y2="270" stroke="white"   strokeWidth="0.4" opacity="0.026"/>
          <line x1="0"   y1="300" x2="600"  y2="0"   stroke="white"   strokeWidth="0.3" opacity="0.018"/>
          <line x1="1440" y1="900" x2="760" y2="0"   stroke="#FF6F00" strokeWidth="0.5" opacity="0.032"/>
          <line x1="400" y1="900" x2="1440" y2="390" stroke="#FF6F00" strokeWidth="0.3" opacity="0.022"/>
        </svg>
      </div>

      {/* LAYER 4 — Particles */}
      <div ref={particlesRef} className="absolute inset-0 z-[3] will-change-transform pointer-events-none" aria-hidden>
        {PARTICLES.map((p, i) => (
          <div key={i} className="absolute rounded-full p-float"
            style={{
              left: p.x, top: p.y,
              width: `${p.r * 2}px`, height: `${p.r * 2}px`,
              backgroundColor: p.color, opacity: p.opacity,
              '--fdur': p.dur, '--fdel': p.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Gradient vignettes */}
      <div className="absolute inset-x-0 bottom-0 h-[86%] z-[8] pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0D0D0D 0%, #0D0D0D 18%, rgba(13,13,13,0.88) 40%, rgba(13,13,13,0.42) 65%, transparent 100%)' }} />
      <div className="absolute inset-y-0 left-0 w-[65%] z-[8] pointer-events-none"
        style={{ background: 'linear-gradient(to right, rgba(13,13,13,0.8) 0%, rgba(13,13,13,0.42) 50%, transparent 100%)' }} />
      <div className="absolute inset-x-0 top-0 h-40 z-[8] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(13,13,13,0.72) 0%, transparent 100%)' }} />

      {/* LAYER 5 — Hero content */}
      <div ref={contentRef} className="absolute inset-x-0 z-[20] will-change-transform flex flex-col justify-center" style={{ top: '7rem', bottom: '4rem' }}>
        <div
          className="px-6 sm:px-10 md:px-16 max-w-[88vw] md:max-w-[58vw] lg:max-w-[50vw]"
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? 'none' : 'translateY(36px)',
            transition: 'opacity 1.1s cubic-bezier(0.16,1,0.3,1), transform 1.1s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Badge */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-1 h-6 bg-[#FF6F00]" style={{ borderRadius: '1px' }} />
            <span className="text-[#FF6F00] text-[11px] font-black tracking-[0.22em] uppercase">
              {t.badge}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-black text-white leading-[0.95] tracking-tight mb-3"
            style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}>
            Dr. Madhiraj
            <br />
            <span style={{
              background: 'linear-gradient(135deg,#FF6F00,#FFA040)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Sairathan
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/40 text-sm font-medium tracking-[0.28em] uppercase mb-5">
            {t.subtitle}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-5">
            {t.tags.map((tag, i) => (
              <span key={tag}>
                <span className="text-white/55 text-xs">{tag}</span>
                {i < t.tags.length - 1 && <span className="text-white/20 text-xs mx-1.5">•</span>}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-white/65 text-sm sm:text-base leading-relaxed mb-7 max-w-md">
            {t.desc}
          </p>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 flex-wrap mb-6">
            <Link href="/community"
              className="flex items-center gap-2.5 bg-white text-[#0D0D0D] font-black px-8 py-3 rounded text-sm transition-all duration-200 hover:bg-white/80 active:scale-95 select-none">
              <Play size={16} fill="#0D0D0D" strokeWidth={0} />
              {t.joinBtn}
            </Link>
            <Link href="/about"
              className="flex items-center gap-2.5 font-bold px-8 py-3 rounded text-sm text-white transition-all duration-200 hover:bg-white/20 active:scale-95 select-none"
              style={{ background: 'rgba(109,109,110,0.7)', backdropFilter: 'blur(4px)' }}>
              <Info size={16} />
              {t.infoBtn}
            </Link>
          </div>

          {/* Live member counter */}
          {memberCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 pulse-live" />
              <span className="text-white/40 text-xs">
                <span className="text-white font-bold">{memberCount.toLocaleString()}</span>{' '}
                {t.members}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mute toggle */}
      <div className="absolute z-30" style={{ bottom: '7.5rem', right: '1.5rem' }}>
        <button onClick={toggleMute}
          className="w-10 h-10 border-2 border-white/40 hover:border-white rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
          aria-label={muted ? 'Unmute video' : 'Mute video'}>
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/20 pointer-events-none">
        <span className="text-[9px] tracking-[0.2em] uppercase">{t.scroll}</span>
        <ChevronDown size={13} className="animate-bounce" />
      </div>
    </section>
  );
}
