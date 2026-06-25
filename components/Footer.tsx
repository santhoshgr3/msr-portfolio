'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Globe, Play, Camera, Share2, AtSign, Send, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { i18n } from '@/lib/i18n';

export default function Footer() {
  const { lang } = useLanguage();
  const s = useSettings();
  const t = i18n[lang].footer;
  const nav = i18n[lang].nav;

  const socials = [
    { href: s.instagram_url, icon: <Camera size={14} />,  label: 'Instagram' },
    { href: s.youtube_url,   icon: <Play size={14} />,    label: 'YouTube' },
    { href: s.facebook_url,  icon: <Share2 size={14} />,  label: 'Facebook' },
    { href: s.twitter_url,   icon: <AtSign size={14} />,  label: 'X' },
    { href: s.telegram_url,  icon: <Send size={14} />,    label: 'Telegram' },
    { href: s.linkedin_url,  icon: <Briefcase size={14} />, label: 'LinkedIn' },
    { href: s.website,       icon: <Globe size={14} />,   label: 'Website' },
  ].filter(x => x.href);

  const websiteLabel = s.website.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const navLinks = [
    { href: '/',          label: lang === 'te' ? 'హోమ్' : 'Home' },
    { href: '/about',     label: lang === 'te' ? 'సన్నీ అన్న గురించి' : 'About Sunny Anna' },
    { href: '/mission',   label: lang === 'te' ? 'మా మిషన్' : 'Our Mission' },
    { href: '/community', label: lang === 'te' ? 'ఉద్యమంలో చేరండి' : 'Join the Movement' },
    { href: '/impact',    label: lang === 'te' ? 'ప్రభావం & సంఖ్యలు' : 'Impact & Numbers' },
    { href: '/gallery',   label: nav.gallery },
    { href: '/events',    label: nav.events },
    { href: '/blog',      label: nav.blog },
    { href: '/media',     label: nav.media },
    { href: '/contact',   label: nav.contact },
  ];

  const pillars = lang === 'te'
    ? ['⚡ యువత సాధికారత', '👩 మహిళా సాధికారత', '🏥 ఆరోగ్య సేవలు', '📚 విద్య']
    : ['⚡ Youth Empowerment', '👩 Women Empowerment', '🏥 Healthcare', '📚 Education'];

  const pillarHrefs = ['/mission', '/mission', '/mission', '/mission'];

  return (
    <footer className="bg-[#0D0D0D] text-white">
      <div className="h-0.5 bg-[#FF6F00]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Image
                src="/logo.png"
                alt="Madhiraj Sairathan"
                width={180}
                height={68}
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              {t.tagline}
            </p>
            <div className="flex gap-2 flex-wrap">
              {socials.map(soc => (
                <a key={soc.label} href={soc.href} target="_blank" rel="noopener noreferrer" aria-label={soc.label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#FF6F00] flex items-center justify-center transition-colors">
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-[#FF6F00] uppercase tracking-widest mb-5">{t.navigate}</h3>
            <ul className="space-y-2.5">
              {navLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/40 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mission Pillars */}
          <div>
            <h3 className="text-xs font-semibold text-[#FF6F00] uppercase tracking-widest mb-5">{t.pillars}</h3>
            <ul className="space-y-2.5">
              {pillars.map((p, i) => (
                <li key={p}>
                  <Link href={pillarHrefs[i]} className="text-white/40 hover:text-white text-sm transition-colors">
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <h3 className="text-xs font-semibold text-[#FF6F00] uppercase tracking-widest mb-3">{t.legal}</h3>
              <Link href="/privacy" className="text-white/30 hover:text-white text-xs transition-colors block mb-1">{t.privacy}</Link>
              <Link href="/contact" className="text-white/30 hover:text-white text-xs transition-colors block">{t.terms}</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-[#FF6F00] uppercase tracking-widest mb-5">{t.connect}</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-white/40 hover:text-white transition-colors">
                  <Phone size={14} className="text-[#FF6F00] shrink-0" /> {s.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${s.email}`} className="flex items-center gap-3 text-sm text-white/40 hover:text-white transition-colors break-all">
                  <Mail size={14} className="text-[#FF6F00] shrink-0" /> {s.email}
                </a>
              </li>
              {s.website && (
                <li>
                  <a href={s.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-white/40 hover:text-white transition-colors">
                    <Globe size={14} className="text-[#FF6F00] shrink-0" /> {websiteLabel}
                  </a>
                </li>
              )}
            </ul>
            <Link href="/community" className="block bg-[#FF6F00] hover:bg-[#E65100] text-white text-sm font-bold text-center px-4 py-3 rounded-xl transition-all hover:scale-[1.02]">
              {lang === 'te' ? 'ఉద్యమంలో చేరండి →' : 'Join the Movement →'}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25">
          <p>© {new Date().getFullYear()} {t.copyright}</p>
          <p className="italic">{t.quote}</p>
        </div>
      </div>
    </footer>
  );
}
