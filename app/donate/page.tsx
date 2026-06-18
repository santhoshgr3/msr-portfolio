import Link from 'next/link';
import { ArrowRight, Shield, Receipt, Heart } from 'lucide-react';

const goals = [
  { amount: '₹500', impact: 'Clean water for one family for a week', progress: 78, raised: '₹3,900', target: '₹5,000', emoji: '💧', color: '#FF6F00' },
  { amount: '₹1,500', impact: 'School supplies for one child for a year', progress: 45, raised: '₹6,750', target: '₹15,000', emoji: '📚', color: '#0D0D0D' },
  { amount: '₹5,000', impact: 'Fund a free medical camp for 50 families', progress: 62, raised: '₹31,000', target: '₹50,000', emoji: '🏥', color: '#FF8F00' },
  { amount: '₹15,000', impact: 'One month of vocational training for a woman', progress: 33, raised: '₹4,950', target: '₹15,000', emoji: '👩', color: '#2D2D2D' },
];

export default function DonatePage() {
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
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">Make Real Impact</span>
            <span className="rising-accent" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Support <span className="text-amber-gradient">the Cause</span>
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto">
            Every rupee goes directly to families in need. Fund a specific goal and see exactly what your money does.
          </p>
        </div>
      </section>

      {/* Compliance notice */}
      <section className="py-6 px-4 bg-[#FFF3E0] border-b border-[#FF6F00]/20">
        <div className="max-w-4xl mx-auto flex items-start gap-3">
          <Shield size={18} className="text-[#FF6F00] shrink-0 mt-0.5" />
          <p className="text-sm text-[#6B6B6B] leading-relaxed">
            <strong className="text-[#0D0D0D]">Compliance Notice:</strong> Donation infrastructure is being set up. We are in the process of obtaining 80G/12A tax-exempt status and integrating a compliant payment gateway (Razorpay). Until then, please reach out directly at{' '}
            <a href="mailto:teamsairathansunny@gmail.com" className="text-[#FF6F00] underline">teamsairathansunny@gmail.com</a> or{' '}
            <a href="tel:+918886388264" className="text-[#FF6F00] underline">+91 8886388264</a> to contribute. Every donation will be acknowledged with a receipt.
          </p>
        </div>
      </section>

      {/* Funded Micro-Goals */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">Know Where Your Money Goes</span>
              <span className="rising-accent" />
            </div>
            <h2 className="text-3xl font-bold text-[#0D0D0D]">Funded Micro-Goals</h2>
            <p className="text-[#6B6B6B] mt-2 max-w-xl mx-auto text-sm">Choose a specific goal. See its progress. Get an Impact Receipt when it's funded.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {goals.map((g, i) => (
              <div key={i} className="border border-[#E8E8E8] rounded-2xl p-6 card-hover hover:border-[#FF6F00] transition-all">
                <div className="flex items-start gap-4 mb-5">
                  <div className="text-4xl">{g.emoji}</div>
                  <div>
                    <div className="text-2xl font-black font-mono text-[#0D0D0D]">{g.amount}</div>
                    <div className="font-semibold text-[#0D0D0D] text-sm mt-0.5">{g.impact}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[#6B6B6B] mb-1.5">
                    <span>{g.raised} raised</span>
                    <span>Goal: {g.target}</span>
                  </div>
                  <div className="h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${g.progress}%`, backgroundColor: g.color }}
                    />
                  </div>
                  <div className="text-right text-xs text-[#6B6B6B] mt-1">{g.progress}% funded</div>
                </div>

                <a
                  href="mailto:teamsairathansunny@gmail.com?subject=Donation%20Inquiry"
                  className="block text-center font-bold px-4 py-3 rounded-full text-white transition-all hover:opacity-90 text-sm"
                  style={{ backgroundColor: g.color }}
                >
                  Donate {g.amount} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What donors get */}
      <section className="py-20 px-4 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="rising-accent" />
            <h2 className="text-3xl font-bold text-[#0D0D0D]">What Every Donor Receives</h2>
            <span className="rising-accent" />
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: <Receipt size={28} />, title: 'Impact Receipt', desc: 'A personalised receipt showing exactly what your donation funded — with photos when available.' },
              { icon: <Heart size={28} />, title: 'Donor Recognition', desc: 'Named on the Donor Wall (with permission). Monthly impact updates via email/WhatsApp.' },
              { icon: <Shield size={28} />, title: 'Tax Benefits', desc: '80G certificate for tax deduction (once registration is complete). We\'ll notify all donors.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center border border-[#E8E8E8] hover:border-[#FF6F00] transition-all card-hover">
                <div className="text-[#FF6F00] flex justify-center mb-3">{item.icon}</div>
                <div className="w-6 h-0.5 bg-[#FF6F00] mx-auto mb-3" style={{ transform: 'skewX(-12deg)' }} />
                <h3 className="font-bold text-[#0D0D0D] mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other ways to help */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#0D0D0D] mb-8">Can't Donate? Here Are Other Ways to Help</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Volunteer', desc: 'Give your time at events and campaigns', href: '/events' },
              { label: 'Spread the Word', desc: 'Share our work with your network', href: '/community' },
              { label: 'In-Kind Donations', desc: 'Books, medicines, food — contact us', href: '/contact' },
            ].map((item, i) => (
              <Link key={i} href={item.href} className="block border border-[#E8E8E8] hover:border-[#FF6F00] rounded-2xl p-5 transition-all group">
                <div className="font-bold text-[#0D0D0D] group-hover:text-[#FF6F00] transition-colors mb-1 text-sm">{item.label}</div>
                <p className="text-xs text-[#6B6B6B] leading-relaxed mb-3">{item.desc}</p>
                <ArrowRight size={14} className="text-[#FF6F00] group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
