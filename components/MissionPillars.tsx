'use client';
import Link from 'next/link';
import { GraduationCap, Users, Stethoscope, BookOpen, ArrowRight } from 'lucide-react';

const pillars = [
  {
    icon: <Users size={36} />,
    title: 'Youth Empowerment',
    titleTe: 'యువత సాధికారత',
    desc: 'Building tomorrow\'s leaders through skill development, leadership programs, and opportunities.',
    color: '#FF6F00',
    bg: '#FFF3E0',
    href: '/mission#youth',
  },
  {
    icon: <GraduationCap size={36} />,
    title: 'Women Empowerment',
    titleTe: 'మహిళా సాధికారత',
    desc: 'Supporting women with vocational training, entrepreneurship, and self-reliance programs.',
    color: '#E53935',
    bg: '#FFEBEE',
    href: '/mission#women',
  },
  {
    icon: <Stethoscope size={36} />,
    title: 'Healthcare',
    titleTe: 'ఆరోగ్య సేవలు',
    desc: 'Providing free medical camps, clean water access, and healthcare awareness in rural areas.',
    color: '#1A237E',
    bg: '#E8EAF6',
    href: '/mission#healthcare',
  },
  {
    icon: <BookOpen size={36} />,
    title: 'Education',
    titleTe: 'విద్య',
    desc: 'Investing in education infrastructure, scholarships, and learning support for underprivileged children.',
    color: '#2E7D32',
    bg: '#E8F5E9',
    href: '/mission#education',
  },
];

export default function MissionPillars() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#FF6F00] font-semibold text-sm uppercase tracking-widest mb-3">Our Focus Areas</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A237E] mb-4">
            Four Pillars of Change
          </h2>
          <div className="w-16 h-1 bg-[#FF6F00] mx-auto skew-x-[-10deg] mb-4" />
          <p className="text-[#555555] max-w-xl mx-auto text-base">
            Every action we take, every life we touch — it all comes back to these four core commitments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <Link key={i} href={p.href} className="group block">
              <div
                className="rounded-2xl p-7 h-full transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl border border-transparent group-hover:border-gray-100"
                style={{ backgroundColor: p.bg }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: p.color + '18', color: p.color }}
                >
                  {p.icon}
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: p.color }}>{p.title}</h3>
                <p className="text-xs text-[#555] mb-1 font-medium">{p.titleTe}</p>
                <p className="text-sm text-[#444] leading-relaxed mb-4">{p.desc}</p>
                <span
                  className="inline-flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2"
                  style={{ color: p.color }}
                >
                  Learn More <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
