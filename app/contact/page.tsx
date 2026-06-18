'use client';
import { useState } from 'react';
import { Phone, Mail, Globe, MapPin, MessageCircle, Send, CheckCircle, Camera, Play, Share2, AtSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { i18n } from '@/lib/i18n';

export default function ContactPage() {
  const { lang } = useLanguage();
  const s = useSettings();
  const t = i18n[lang].contact;

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  const contactItems = [
    { icon: <Phone size={18} />, label: t.phone, value: s.phone, href: `tel:${s.phone.replace(/\s/g, '')}` },
    { icon: <Mail size={18} />, label: t.email, value: s.email, href: `mailto:${s.email}` },
    { icon: <Globe size={18} />, label: t.website, value: s.website.replace(/^https?:\/\//, '').replace(/\/$/, ''), href: s.website },
    { icon: <MapPin size={18} />, label: t.location, value: s.address || t.locationVal, href: '#' },
  ];

  const socialLinks = [
    { label: 'Instagram', href: s.instagram_url, icon: <Camera size={15} /> },
    { label: 'YouTube',   href: s.youtube_url,   icon: <Play size={15} /> },
    { label: 'Facebook',  href: s.facebook_url,  icon: <Share2 size={15} /> },
    { label: 'X',         href: s.twitter_url,   icon: <AtSign size={15} /> },
  ].filter(x => x.href);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0D0D0D] pt-32 pb-24 px-4 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 1440 500" fill="none" preserveAspectRatio="none">
          <line x1="0" y1="500" x2="1440" y2="0" stroke="#FF6F00" strokeWidth="2"/>
        </svg>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="rising-accent" />
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.heroBadge}</span>
            <span className="rising-accent" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            {t.heroTitle.split(' ')[0]} <span className="text-amber-gradient">{t.heroTitle.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">{t.heroDesc}</p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="rising-accent" />
                <h2 className="text-xl font-bold text-[#0D0D0D]">{t.directBadge}</h2>
              </div>

              <div className="space-y-4 mb-10">
                {contactItems.map((c, i) => (
                  <a key={i} href={c.href} className="flex items-start gap-4 p-4 border border-[#E8E8E8] rounded-2xl hover:border-[#FF6F00] transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-[#FF6F00] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                      {c.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider mb-0.5">{c.label}</div>
                      <div className="font-semibold text-[#0D0D0D] text-sm">{c.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* WhatsApp */}
              <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle size={22} className="text-[#25D366]" />
                  <h3 className="font-bold text-[#0D0D0D] text-sm">
                    {lang === 'te' ? 'మా వాట్సాప్ కమ్యూనిటీలో చేరండి' : 'Join Our WhatsApp Community'}
                  </h3>
                </div>
                <p className="text-sm text-[#6B6B6B] mb-4 leading-relaxed">
                  {lang === 'te' ? 'నిజ-సమయ నవీకరణలు, ఈవెంట్ అలర్ట్‌లు పొందండి మరియు మీ జిల్లాలో సభ్యులతో కనెక్ట్ అవ్వండి.' : 'Get real-time updates, event alerts, and connect with members in your district.'}
                </p>
                <a href={s.whatsapp_community_url || `https://wa.me/${s.whatsapp_number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1eb957] transition-colors text-sm">
                  <MessageCircle size={15} /> {lang === 'te' ? 'వాట్సాప్ కమ్యూనిటీలో చేరండి' : 'Join WhatsApp Community'}
                </a>
              </div>

              {/* Social */}
              <div>
                <h3 className="font-semibold text-[#0D0D0D] text-sm mb-4 uppercase tracking-wide">
                  {lang === 'te' ? 'ఉద్యమాన్ని అనుసరించండి' : 'Follow the Movement'}
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {socialLinks.map(soc => (
                    <a key={soc.label} href={soc.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 border border-[#E8E8E8] hover:border-[#FF6F00] rounded-xl px-4 py-2 text-sm font-medium hover:scale-105 transition-all text-[#0D0D0D]">
                      {soc.icon} {soc.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#F5F5F5] rounded-2xl p-8 border border-[#E8E8E8]">
              {sent ? (
                <div className="text-center py-10">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-[#0D0D0D] mb-2">{t.successTitle}</h3>
                  <p className="text-[#6B6B6B] text-sm">{t.successDesc}</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-[#0D0D0D] mb-6">{t.formBadge}</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1.5">{t.name} *</label>
                        <input required type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder={t.namePh}
                          className="w-full bg-white border border-[#E8E8E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6F00] transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1.5">{t.phoneField}</label>
                        <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder={t.phonePh}
                          className="w-full bg-white border border-[#E8E8E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6F00] transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1.5">{t.emailField} *</label>
                      <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder={t.emailPh}
                        className="w-full bg-white border border-[#E8E8E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6F00] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1.5">{t.message} *</label>
                      <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder={t.messagePh} rows={5}
                        className="w-full bg-white border border-[#E8E8E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6F00] transition-colors resize-none" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full bg-[#FF6F00] hover:bg-[#E65100] disabled:opacity-50 text-white font-bold px-6 py-4 rounded-full flex items-center justify-center gap-2 transition-all">
                      {loading ? t.sending : <><Send size={15} /> {t.send}</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
