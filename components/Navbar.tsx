'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Phone, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { i18n } from '@/lib/i18n';

const primaryLinks = [
  { href: '/',          key: 'home'      },
  { href: '/about',     key: 'about'     },
  { href: '/mission',   key: 'mission'   },
  { href: '/community', key: 'community' },
  { href: '/impact',    key: 'impact'    },
  { href: '/blog',      key: 'blog'      },
] as const;

const moreLinks = [
  { href: '/gallery', key: 'gallery' },
  { href: '/events',  key: 'events'  },
  { href: '/media',   key: 'media'   },
  { href: '/contact', key: 'contact' },
] as const;

const allLinks = [...primaryLinks, ...moreLinks];

export default function Navbar() {
  const pathname = usePathname();
  const { lang, toggle } = useLanguage();
  const s = useSettings();
  const t = i18n[lang].nav;
  const telHref = `tel:${s.phone.replace(/\s/g, '')}`;

  const [open, setOpen]           = useState(false);
  const [onHero, setOnHero]       = useState(true);
  const [moreOpen, setMoreOpen]   = useState(false);
  const [announced, setAnnounced] = useState(true);

  useEffect(() => {
    const onScroll = () => setOnHero(window.scrollY < window.innerHeight - 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); setMoreOpen(false); }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const handler = () => setMoreOpen(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [moreOpen]);

  const transparent = onHero && !open;
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const label = (key: string) => (t as Record<string, string>)[key] ?? key;

  return (
    <>
      {/* ── Announcement Bar ── */}
      {announced && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-[#FF6F00] text-white text-xs font-semibold flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2 flex-1 justify-center">
            <span className="pulse-live w-1.5 h-1.5 rounded-full bg-white inline-block" />
            <span className="hidden sm:inline">{t.announcement}</span>
            <Link href="/community/join" className="underline underline-offset-2 hover:no-underline font-bold">
              {t.joinNow}
            </Link>
          </div>
          <button
            onClick={() => setAnnounced(false)}
            className="p-0.5 hover:opacity-70 transition-opacity shrink-0"
            aria-label="Close announcement"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Main Navbar ── */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          announced ? 'top-8' : 'top-0'
        } ${
          transparent
            ? 'bg-transparent py-4'
            : 'bg-white/96 backdrop-blur-md border-b border-[#E8E8E8] py-2.5 shadow-sm shadow-black/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-9 h-9 shrink-0">
                <div className="absolute inset-0 rounded-xl bg-[#FF6F00] group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3px]">
                  <div className="w-4 h-[2px] bg-white" style={{ transform: 'skewX(-12deg) translateX(2px)' }} />
                  <div className="w-5 h-[2px] bg-white/70" style={{ transform: 'skewX(-12deg)' }} />
                  <div className="w-3 h-[2px] bg-white/40" style={{ transform: 'skewX(-12deg) translateX(-2px)' }} />
                </div>
              </div>
              <div className="hidden sm:block leading-tight whitespace-nowrap">
                <div className={`font-black text-[13px] tracking-tight transition-colors duration-300 ${transparent ? 'text-white' : 'text-[#0D0D0D]'}`}>
                  Dr. Madhiraj Sairathan
                </div>
                <div className="text-[#FF6F00] text-[9px] font-bold uppercase tracking-[0.12em]">
                  Empowering · Transforming
                </div>
              </div>
            </Link>

            {/* ── Desktop Links ── */}
            <div className="hidden lg:flex items-center gap-0">
              {primaryLinks.map(l => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`relative px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 group ${
                      active
                        ? transparent ? 'text-white' : 'text-[#FF6F00]'
                        : transparent
                          ? 'text-white/75 hover:text-white'
                          : 'text-[#6B6B6B] hover:text-[#0D0D0D]'
                    }`}
                  >
                    {label(l.key)}
                    <span className={`absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full bg-[#FF6F00] transition-all duration-200 ${
                      active ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'
                    }`} />
                  </Link>
                );
              })}

              {/* More dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setMoreOpen(!moreOpen); }}
                  className={`flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 ${
                    moreOpen || moreLinks.some(l => isActive(l.href))
                      ? transparent ? 'text-white' : 'text-[#FF6F00]'
                      : transparent
                        ? 'text-white/75 hover:text-white'
                        : 'text-[#6B6B6B] hover:text-[#0D0D0D]'
                  }`}
                >
                  {t.more}
                  <ChevronDown size={13} className={`transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreOpen && (
                  <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl shadow-black/10 border border-[#E8E8E8] overflow-hidden z-50">
                    {moreLinks.map(l => {
                      const active = isActive(l.href);
                      return (
                        <Link
                          key={l.href}
                          href={l.href}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[#F5F5F5] ${
                            active ? 'text-[#FF6F00] font-semibold bg-[#FFF3E0]' : 'text-[#0D0D0D]'
                          }`}
                        >
                          {active && <span className="w-1 h-1 rounded-full bg-[#FF6F00] shrink-0" />}
                          {label(l.key)}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={telHref}
                className={`hidden xl:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                  transparent
                    ? 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                    : 'border-[#E8E8E8] text-[#6B6B6B] hover:border-[#FF6F00] hover:text-[#FF6F00]'
                }`}
              >
                <Phone size={11} />
                <span className="font-medium">{s.phone}</span>
              </a>

              {/* Language toggle */}
              <button
                onClick={toggle}
                className={`hidden md:flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                  transparent
                    ? 'border-white/20 text-white/70 hover:border-white/50 hover:text-white'
                    : 'border-[#E8E8E8] text-[#6B6B6B] hover:border-[#FF6F00] hover:text-[#FF6F00]'
                }`}
              >
                <Globe size={11} />
                {lang === 'te' ? 'EN' : 'తె'}
              </button>

              {/* CTA */}
              <Link
                href="/community/join"
                className="hidden md:flex items-center gap-1.5 bg-[#FF6F00] hover:bg-[#E65100] text-white text-[13px] font-bold px-4 py-2 rounded-xl transition-all duration-200 hover:scale-[1.03] shadow-md shadow-[#FF6F00]/25"
              >
                {t.join}
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                className={`lg:hidden p-2 rounded-xl transition-colors ${
                  transparent ? 'text-white hover:bg-white/10' : 'text-[#0D0D0D] hover:bg-[#F5F5F5]'
                }`}
              >
                <Menu size={20} className={`transition-all duration-200 ${open ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[min(340px,90vw)] bg-white z-[56] flex flex-col shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8E8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FF6F00] flex items-center justify-center">
              <div className="flex flex-col items-center gap-[2px]">
                <div className="w-3.5 h-[2px] bg-white" style={{ transform: 'skewX(-12deg)' }} />
                <div className="w-4 h-[2px] bg-white/70" style={{ transform: 'skewX(-12deg)' }} />
              </div>
            </div>
            <div>
              <div className="font-black text-[12px] text-[#0D0D0D]">Dr. Madhiraj Sairathan</div>
              <div className="text-[#FF6F00] text-[9px] font-bold uppercase tracking-widest">Bhupalpally · Telangana</div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg bg-[#F5F5F5] hover:bg-[#E8E8E8] flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {allLinks.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#FFF3E0] text-[#FF6F00] font-bold'
                    : 'text-[#0D0D0D] hover:bg-[#F5F5F5] hover:text-[#FF6F00]'
                }`}
              >
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6F00] shrink-0" />
                )}
                <span className={active ? '' : 'ml-[18px]'}>{label(l.key)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div className="px-4 pb-6 pt-3 border-t border-[#E8E8E8] space-y-3">
          <div className="flex gap-2">
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border border-[#E8E8E8] text-[#6B6B6B] hover:border-[#FF6F00] transition-all"
            >
              <Globe size={12} /> {lang === 'te' ? 'English' : 'తెలుగు'}
            </button>
            <a
              href={telHref}
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-[#E8E8E8] text-[#6B6B6B] hover:border-[#FF6F00] transition-all"
            >
              <Phone size={12} /> {s.phone}
            </a>
          </div>
          <Link
            href="/community/join"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-[#FF6F00] hover:bg-[#E65100] text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-md shadow-[#FF6F00]/30"
          >
            {t.join}
          </Link>
        </div>
      </div>
    </>
  );
}
