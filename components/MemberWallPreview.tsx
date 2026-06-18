'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { timeAgo } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

type Member = { full_name: string; city: string; created_at: string; id: number };

const COLORS = ['#FF6F00', '#E53935', '#1A237E', '#2E7D32', '#7B1FA2', '#0277BD'];

export default function MemberWallPreview() {
  const [members, setMembers] = useState<Member[]>([]);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch('/api/members/recent?limit=12');
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
          setEmpty(data.length === 0);
        }
      } catch {}
    }
    fetch_();
    const interval = setInterval(fetch_, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#FF6F00] font-semibold text-sm uppercase tracking-widest mb-3">Growing Every Day</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A237E] mb-2">Recent Movement Members</h2>
          <p className="text-[#555] text-sm">These real people just joined. You could be next.</p>
        </div>

        {empty ? (
          <div className="text-center py-16 bg-[#E8EAF6] rounded-3xl">
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-[#1A237E] mb-2">Be a Founding Member</h3>
            <p className="text-[#555] mb-6 max-w-sm mx-auto">
              The movement is just beginning. Become one of the first members and inspire thousands to follow.
            </p>
            <Link href="/community" className="bg-[#FF6F00] text-white font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2">
              Join First <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
              {members.map((m, i) => (
                <div key={m.id} className="bg-[#E8EAF6] rounded-2xl p-4 text-center card-hover">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-2"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  >
                    {m.full_name[0]}
                  </div>
                  <div className="font-semibold text-[#111] text-sm truncate">{m.full_name.split(' ')[0]}</div>
                  <div className="text-[#555] text-xs truncate">{m.city}</div>
                  <div className="text-[#FF6F00] text-xs mt-1">{timeAgo(m.created_at)}</div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/community" className="inline-flex items-center gap-2 bg-[#1A237E] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#FF6F00] transition-colors">
                View Full Member Wall <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
