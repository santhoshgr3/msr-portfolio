'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, FileText, Calendar, Image, BarChart3, MessageSquare, Mail, ArrowRight, Download } from 'lucide-react';

type Stats = { members: number; lives_impacted: number; events: number; social_followers: number; years_service: number; districts_covered: number };

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sunnyannaadmin2025';

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [blogCount, setBlogCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('admin_token') || '';
    const h = { 'x-admin-token': token };
    Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/blog', { headers: h }).then(r => r.json()),
      fetch('/api/contact', { headers: h }).then(r => r.json()),
    ]).then(([s, b, c]) => {
      setStats(s);
      setBlogCount(Array.isArray(b) ? b.length : 0);
      setContactCount(Array.isArray(c) ? c.length : 0);
    });
  }, []);

  const exportMembers = async () => {
    const res = await fetch('/api/members/recent?limit=1000');
    const members = await res.json();
    const headers = ['Member #', 'Name', 'Phone', 'City', 'District', 'Interest', 'Joined'];
    const rows = members.map((m: Record<string, unknown>) => [
      m.member_number, m.full_name, m.phone, m.city, m.district, m.interest_area,
      new Date(m.created_at as string).toLocaleDateString('en-IN'),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const sections = [
    { href: '/admin/members', icon: Users, label: 'Members', value: stats?.members ?? '—', desc: 'Registered members', color: '#FF6F00' },
    { href: '/admin/blog', icon: FileText, label: 'Blog Posts', value: blogCount || '—', desc: 'Published & drafts', color: '#0369A1' },
    { href: '/admin/events', icon: Calendar, label: 'Events', value: stats?.events ?? '—', desc: 'Total events held', color: '#0D0D0D' },
    { href: '/admin/gallery', icon: Image, label: 'Gallery', value: '—', desc: 'Manage photos', color: '#2D6A4F' },
    { href: '/admin/stats', icon: BarChart3, label: 'Statistics', value: stats?.lives_impacted ?? '—', desc: 'Lives impacted', color: '#B45309' },
    { href: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials', value: '—', desc: 'Community voices', color: '#BE185D' },
    { href: '/admin/contact', icon: Mail, label: 'Contact Inbox', value: contactCount || '—', desc: 'Form submissions', color: '#0F766E' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0D0D0D]">Dashboard Overview</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">Manage all content and data for sunnyannaofficial.com</p>
      </div>

      {/* Quick action */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={exportMembers}
          className="flex items-center gap-2 bg-[#0D0D0D] hover:bg-[#FF6F00] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Download size={14} /> Export Members CSV
        </button>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          <FileText size={14} /> New Blog Post
        </Link>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 border border-[#E8E8E8] hover:border-[#FF6F00] bg-white text-[#0D0D0D] text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Calendar size={14} /> New Event
        </Link>
      </div>

      {/* Section cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sections.map(s => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white border border-[#E8E8E8] hover:border-[#FF6F00] rounded-2xl p-6 transition-all group hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + '18' }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <ArrowRight size={14} className="text-[#E8E8E8] group-hover:text-[#FF6F00] transition-colors mt-1" />
            </div>
            <div className="text-3xl font-black text-[#0D0D0D] tabular-nums mb-1">{s.value}</div>
            <div className="font-bold text-[#0D0D0D] text-sm">{s.label}</div>
            <div className="text-[#6B6B6B] text-xs mt-0.5">{s.desc}</div>
          </Link>
        ))}

        {/* Key stats */}
        {stats && (
          <div className="bg-[#0D0D0D] rounded-2xl p-6 text-white">
            <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-4">Impact Summary</div>
            <div className="space-y-3">
              {[
                { label: 'Lives Impacted', value: stats.lives_impacted },
                { label: 'Districts Covered', value: stats.districts_covered },
                { label: 'Social Followers', value: stats.social_followers },
                { label: 'Years of Service', value: stats.years_service },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-white/50 text-xs">{r.label}</span>
                  <span className="text-[#FF6F00] font-bold text-sm tabular-nums">{r.value?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-[#6B6B6B] text-xs mt-8">
        Admin session is stored in this browser only. Password: change before production.
      </p>
    </div>
  );
}
