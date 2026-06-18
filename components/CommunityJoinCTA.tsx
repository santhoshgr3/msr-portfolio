'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, ArrowRight } from 'lucide-react';

export default function CommunityJoinCTA() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setMemberCount(data.members || 0);
        }
      } catch {}
    }
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.length < 10) return;
    setLoading(true);
    const params = new URLSearchParams({ name, phone });
    router.push(`/community/join?${params.toString()}`);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1A237E] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#FF6F00] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Live count */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5">
            <Users size={16} className="text-[#FF6F00]" />
            <span className="text-white font-bold">{memberCount.toLocaleString()}</span>
            <span className="text-white/70 text-sm">people have already joined</span>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Will you be the next
          <span className="text-[#FF6F00]"> Change Maker?</span>
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
          Join Sunny Anna Yuvasena and become part of a movement transforming Telangana.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6">
          <input
            type="text"
            placeholder="Your Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="flex-1 px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF6F00] transition-colors"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            required
            className="flex-1 px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF6F00] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-6 py-3.5 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg whitespace-nowrap disabled:opacity-60"
          >
            {loading ? 'Please wait...' : <>Join Now <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-white/40 text-xs">
          No fees. No politics. Just impact. Your data is protected under India DPDP Act 2023.
        </p>
      </div>
    </section>
  );
}
