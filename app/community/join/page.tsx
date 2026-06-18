'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, Download, Share2, CheckCircle, Loader2 } from 'lucide-react';

type Step = 'form' | 'otp' | 'welcome' | 'id-card';

function JoinFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    full_name: searchParams.get('name') || '',
    phone: searchParams.get('phone') || '',
    city: '',
    district: '',
    interest_area: 'All',
    how_found: 'Social Media',
    consent: false,
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [memberNumber, setMemberNumber] = useState<number | null>(null);
  const [memberName, setMemberName] = useState('');

  const sendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpSent(true);
      setStep('otp');
    } catch (e: unknown) {
      setError((e as Error).message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) { setError('Please accept the consent checkbox.'); return; }
    await sendOTP();
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Verify OTP
      const otpRes = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone, otp }),
      });
      const otpData = await otpRes.json();
      if (!otpRes.ok) throw new Error(otpData.error);

      // Register member
      const regRes = await fetch('/api/members/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, consent: true }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.error);

      setMemberNumber(regData.member_number);
      setMemberName(form.full_name);
      setStep('welcome');
    } catch (e: unknown) {
      setError((e as Error).message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const interests = ['Youth Empowerment', 'Women Empowerment', 'Healthcare', 'Education', 'All'];
  const howFound = ['Social Media', 'WhatsApp', 'Friend/Family', 'Event', 'Google', 'Other'];

  const shareText = `I just joined Sunny Anna Yuvasena as Member #${memberNumber}! 🎉\nJoin the movement: madhirajsairathan.com`;

  return (
    <div className="min-h-screen pt-16 bg-[#E8EAF6]">
      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            {(['form', 'otp', 'welcome', 'id-card'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s ? 'bg-[#FF6F00] text-white' :
                  (['form', 'otp', 'welcome', 'id-card'].indexOf(step) > i) ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {(['form', 'otp', 'welcome', 'id-card'].indexOf(step) > i) ? <CheckCircle size={14} /> : i + 1}
                </div>
                {i < 3 && <div className={`h-1 flex-1 rounded-full transition-all ${(['form', 'otp', 'welcome', 'id-card'].indexOf(step) > i) ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-xs text-[#555]">
            <span>Details</span>
            <span>Verify</span>
            <span>Welcome</span>
            <span>ID Card</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>
        )}

        {/* STEP 1: Form */}
        {step === 'form' && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🤝</div>
              <h1 className="text-2xl font-bold text-[#1A237E]">Join Sunny Anna Yuvasena</h1>
              <p className="text-[#555] mt-1">Become a Movement Member — free, fast, and impactful</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#1A237E] mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    placeholder="Dr. Ramesh Kumar"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A237E] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A237E] mb-1.5">Phone Number *</label>
                  <div className="flex gap-2">
                    <span className="border border-gray-200 rounded-xl px-3 py-3 text-sm text-[#555] bg-gray-50">+91</span>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                      placeholder="9876543210"
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A237E] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A237E] mb-1.5">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="Warangal"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A237E] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1A237E] mb-1.5">District</label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                    placeholder="Warangal Urban"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A237E] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A237E] mb-1.5">Area of Interest *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {interests.map(i => (
                    <label key={i} className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 cursor-pointer transition-all text-sm ${
                      form.interest_area === i ? 'border-[#FF6F00] bg-[#FFF3E0] text-[#FF6F00] font-semibold' : 'border-gray-200 text-[#555] hover:border-[#FF6F00]'
                    }`}>
                      <input type="radio" name="interest" value={i} checked={form.interest_area === i} onChange={() => setForm(f => ({ ...f, interest_area: i }))} className="hidden" />
                      {i}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A237E] mb-1.5">How did you find us?</label>
                <select
                  value={form.how_found}
                  onChange={e => setForm(f => ({ ...f, how_found: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1A237E] transition-colors"
                >
                  {howFound.map(h => <option key={h}>{h}</option>)}
                </select>
              </div>

              <div className="bg-[#E8EAF6] rounded-xl p-4">
                <label className="flex gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={form.consent}
                    onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 accent-[#FF6F00]"
                  />
                  <span className="text-xs text-[#555] leading-relaxed">
                    I consent to Sunny Anna Yuvasena storing my name, phone, and city for membership purposes.
                    I agree my first name and city may appear on the public member wall.
                    I can request deletion at any time via <a href="mailto:teamsairathansunny@gmail.com" className="text-[#1A237E] underline">email</a>.
                    Data is handled under India's DPDP Act 2023. <a href="/privacy" className="text-[#1A237E] underline">Privacy Policy</a>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !form.consent}
                className="w-full bg-[#FF6F00] hover:bg-[#E65100] disabled:opacity-50 text-white font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-base"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Sending OTP...</> : <>Send OTP to Verify <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === 'otp' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">📱</div>
            <h2 className="text-2xl font-bold text-[#1A237E] mb-2">Verify Your Phone</h2>
            <p className="text-[#555] mb-8">
              We sent a 6-digit OTP to <span className="font-semibold text-[#1A237E]">+91 {form.phone}</span>
            </p>

            <form onSubmit={handleOTPSubmit}>
              <input
                type="text"
                required
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="w-full text-center text-3xl font-bold tracking-[0.5em] border-2 border-gray-200 focus:border-[#FF6F00] rounded-2xl px-4 py-4 mb-6 focus:outline-none transition-colors"
                maxLength={6}
              />
              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-[#FF6F00] disabled:opacity-50 text-white font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : <>Verify & Join <ArrowRight size={18} /></>}
              </button>
            </form>

            <button
              onClick={sendOTP}
              disabled={loading}
              className="mt-4 text-[#1A237E] text-sm underline hover:text-[#FF6F00]"
            >
              Resend OTP
            </button>
            <p className="text-[#999] text-xs mt-2">OTP valid for 10 minutes</p>
          </div>
        )}

        {/* STEP 3: Welcome */}
        {step === 'welcome' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-[#1A237E] mb-2">Welcome to the Movement!</h2>
            <p className="text-[#555] text-lg mb-6">
              You are officially a member of Sunny Anna Yuvasena.
            </p>
            <div className="bg-[#1A237E] text-white rounded-2xl p-6 mb-8 inline-block">
              <div className="text-sm font-medium text-white/70 mb-1">Your Member Number</div>
              <div className="text-5xl font-bold text-[#FF6F00] font-mono">
                #{memberNumber?.toString().padStart(4, '0')}
              </div>
              <div className="text-sm text-white/70 mt-2">{memberName}</div>
            </div>
            <p className="text-[#555] mb-6">
              "Empowering Today. Transforming Tomorrow." — Dr. Madhiraj Sairathan
            </p>
            <button
              onClick={() => setStep('id-card')}
              className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-base"
            >
              Get Your Digital ID Card <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 4: ID Card */}
        {step === 'id-card' && (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-[#1A237E] mb-6">Your Digital Member ID</h2>

            {/* The ID Card */}
            <div id="id-card-element" className="id-card max-w-sm mx-auto p-6 mb-6 text-left">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div>
                  <div className="text-[#FF6F00] text-xs font-bold uppercase tracking-widest">Sunny Anna Yuvasena</div>
                  <div className="text-white/60 text-xs">Helping Hands Organization</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#FF6F00] flex items-center justify-center text-white font-bold">
                  S
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 mb-4 relative z-10">
                <div className="w-14 h-14 rounded-full bg-[#FF6F00] flex items-center justify-center text-white font-bold text-2xl mb-2">
                  {memberName[0]}
                </div>
                <div className="text-white font-bold text-lg">{memberName}</div>
                <div className="text-white/60 text-sm">{form.city}, Telangana</div>
                <div className="text-white/60 text-xs mt-0.5">{form.interest_area}</div>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div>
                  <div className="text-white/60 text-xs uppercase tracking-wider">Member No.</div>
                  <div className="text-[#FF6F00] font-bold text-2xl font-mono">#{memberNumber?.toString().padStart(4, '0')}</div>
                </div>
                <div className="text-right">
                  <div className="text-white/60 text-xs">Joined</div>
                  <div className="text-white text-sm font-medium">{new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 relative z-10">
                <div className="text-white/40 text-xs italic text-center">
                  "Empowering Today. Transforming Tomorrow."
                </div>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'I joined Sunny Anna Yuvasena!', text: shareText, url: 'https://madhirajsairathan.com' });
                  }
                }}
                className="flex-1 bg-[#25D366] text-white font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1eb957] transition-colors"
              >
                <Share2 size={16} /> Share on WhatsApp
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-[#1A237E] text-white font-semibold px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#283593] transition-colors"
              >
                <Download size={16} /> Download ID Card
              </button>
            </div>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A237E] text-sm underline"
            >
              Invite friends to join →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-16 flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <JoinFlow />
    </Suspense>
  );
}
