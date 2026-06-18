'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

export default function JoinSection() {
  const { lang } = useLanguage();
  const t = i18n[lang].join;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const router = useRouter();

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => setCount(d.members || 0)).catch(() => {});
    const timer = setInterval(() => {
      fetch('/api/stats').then(r => r.json()).then(d => setCount(d.members || 0)).catch(() => {});
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    router.push(`/community/join?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`);
  };

  const perks = lang === 'te'
    ? ['ఉచితం — రుసుము లేదు, రాజకీయాలు లేవు', 'డిజిటల్ మెంబర్ ID కార్డ్', 'మీ జిల్లాలో సభ్యులతో కనెక్ట్', 'సమీపంలో ఈవెంట్ అలర్ట్‌లు పొందండి']
    : ['Free — no fees, no politics', 'Digital Member ID card', 'Connect with local members', 'Get event alerts near you'];

  return (
    <section ref={ref} className="py-24 px-4 bg-[#0D0D0D] relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
        <line x1="0" y1="600" x2="1440" y2="0" stroke="#FF6F00" strokeWidth="2"/>
        <line x1="0" y1="500" x2="1440" y2="100" stroke="white" strokeWidth="1"/>
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.badge}</span>
            </div>

            {count > 0 && (
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 bg-green-400 rounded-full pulse-live" />
                <span className="text-white/50 text-sm">
                  <span className="text-white font-bold">{count.toLocaleString()}</span> {t.members}
                </span>
              </div>
            )}

            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              {t.heading}
            </h2>
            <p className="text-white/50 leading-relaxed mb-6 text-base">
              {t.desc}
            </p>
            <ul className="space-y-2">
              {perks.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                  <span className="w-4 h-4 rounded-full bg-[#FF6F00]/20 border border-[#FF6F00]/50 flex items-center justify-center text-[#FF6F00] text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.7s 0.15s ease, transform 0.7s 0.15s ease' }}>
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="font-bold text-[#0D0D0D] text-xl mb-6">
                {lang === 'te' ? 'త్వరిత నమోదు' : 'Quick Registration'}
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-2">
                    {lang === 'te' ? 'పూర్తి పేరు *' : 'Full Name *'}
                  </label>
                  <input
                    required type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full border border-[#E8E8E8] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] placeholder:text-[#6B6B6B]/50 focus:outline-none focus:border-[#FF6F00] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-2">
                    {lang === 'te' ? 'ఫోన్ నంబర్ *' : 'Phone Number *'}
                  </label>
                  <div className="flex gap-2">
                    <span className="border border-[#E8E8E8] rounded-xl px-3 py-3 text-sm text-[#6B6B6B] bg-[#F5F5F5] shrink-0">+91</span>
                    <input
                      required type="tel" value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                      placeholder={t.phonePlaceholder}
                      className="flex-1 border border-[#E8E8E8] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] placeholder:text-[#6B6B6B]/50 focus:outline-none focus:border-[#FF6F00] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !name || phone.length < 10}
                className="w-full bg-[#FF6F00] disabled:opacity-40 hover:bg-[#E65100] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] group"
              >
                {loading ? t.joining : (
                  <>{t.btn} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>

              <p className="text-xs text-[#6B6B6B] text-center mt-4 leading-relaxed">
                {t.privacy}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
