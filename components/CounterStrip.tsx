'use client';
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Users, Heart, Calendar, Share2, Clock } from 'lucide-react';

type Stat = {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
};

const defaultStats: Stat[] = [
  { icon: <Users size={28} />, value: 0, suffix: '+', label: 'Community Members', color: '#FF6F00' },
  { icon: <Heart size={28} />, value: 0, suffix: '+', label: 'Lives Impacted', color: '#E53935' },
  { icon: <Calendar size={28} />, value: 0, suffix: '+', label: 'Events Conducted', color: '#FF6F00' },
  { icon: <Share2 size={28} />, value: 0, suffix: 'K+', label: 'Social Followers', color: '#E53935' },
  { icon: <Clock size={28} />, value: 0, suffix: '+', label: 'Years of Service', color: '#FF6F00' },
];

export default function CounterStrip() {
  const [stats, setStats] = useState(defaultStats);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats([
            { icon: <Users size={28} />, value: data.members || 0, suffix: '+', label: 'Community Members', color: '#FF6F00' },
            { icon: <Heart size={28} />, value: data.lives_impacted || 0, suffix: '+', label: 'Lives Impacted', color: '#E53935' },
            { icon: <Calendar size={28} />, value: data.events || 0, suffix: '+', label: 'Events Conducted', color: '#FF6F00' },
            { icon: <Share2 size={28} />, value: data.social_followers || 0, suffix: 'K+', label: 'Social Followers', color: '#E53935' },
            { icon: <Clock size={28} />, value: data.years_service || (new Date().getFullYear() - 2018), suffix: '+', label: 'Years of Service', color: '#FF6F00' },
          ]);
        }
      } catch {}
    }
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  return (
    <section ref={ref} className="bg-[#1A237E] py-12">
      {/* Live indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-white/70 text-sm font-medium tracking-wider uppercase">Live Impact Numbers</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="flex items-center justify-center mb-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: stat.color + '22', color: stat.color }}
                >
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white font-mono tracking-tight">
                {started ? (
                  <CountUp
                    start={0}
                    end={stat.value}
                    duration={2.5}
                    separator=","
                    delay={i * 0.1}
                  />
                ) : (
                  '0'
                )}
                <span style={{ color: stat.color }}>{stat.suffix}</span>
              </div>
              <div className="text-white/60 text-xs mt-1 font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Rising Line Motif */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="h-px bg-white/20 flex-1 max-w-32" />
          <div className="text-white/40 text-xs italic">Always Moving Forward</div>
          <div className="h-px bg-white/20 flex-1 max-w-32" />
        </div>
      </div>
    </section>
  );
}
