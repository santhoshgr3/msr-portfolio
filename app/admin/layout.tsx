'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Lock, LayoutDashboard, Users, FileText, Calendar,
  Image, BarChart3, MessageSquare, Mail, LogOut,
  UserSquare2, Tv2, Settings, Menu, X,
} from 'lucide-react';

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sunnyannaadmin2025';

const NAV = [
  { href: '/admin',               label: 'Overview',       icon: LayoutDashboard, exact: true },
  { href: '/admin/members',       label: 'Members',        icon: Users },
  { href: '/admin/blog',          label: 'Blog',           icon: FileText },
  { href: '/admin/events',        label: 'Events',         icon: Calendar },
  { href: '/admin/gallery',       label: 'Gallery',        icon: Image },
  { href: '/admin/stats',         label: 'Statistics',     icon: BarChart3 },
  { href: '/admin/testimonials',  label: 'Testimonials',   icon: MessageSquare },
  { href: '/admin/about',         label: 'About Content',  icon: UserSquare2 },
  { href: '/admin/media-content', label: 'Media Content',  icon: Tv2 },
  { href: '/admin/settings',      label: 'Site Settings',  icon: Settings },
  { href: '/admin/contact',       label: 'Contact Inbox',  icon: Mail },
];

export const adminFetch = (url: string, opts: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';
  return fetch(url, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'x-admin-token': token, ...(opts.headers ?? {}) },
  });
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setAuthed(localStorage.getItem('admin_token') === ADMIN_PASS);
  }, []);

  // Close the mobile drawer on navigation
  useEffect(() => { setNavOpen(false); }, [pathname]);

  const login = () => {
    if (password === ADMIN_PASS) {
      localStorage.setItem('admin_token', ADMIN_PASS);
      setAuthed(true);
      setError('');
    } else {
      setError('Wrong password.');
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setAuthed(false);
    setPassword('');
  };

  if (authed === null) {
    return (
      <div className="min-h-screen pt-16 bg-[#F5F5F5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen pt-16 bg-[#F5F5F5] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#E8E8E8] p-10 w-full max-w-md text-center shadow-sm">
          <div className="w-14 h-14 bg-[#0D0D0D] rounded-xl flex items-center justify-center mx-auto mb-5">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0D0D0D] mb-1">Admin Access</h1>
          <p className="text-[#6B6B6B] text-sm mb-6">Sunny Anna Yuvasena Dashboard</p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            className="w-full border border-[#E8E8E8] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6F00] mb-3 transition-colors"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <button
            onClick={login}
            className="w-full bg-[#0D0D0D] hover:bg-[#FF6F00] text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const SidebarInner = (
    <>
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#FF6F00] rounded-lg flex items-center justify-center font-black text-sm text-white">S</div>
          <div>
            <div className="text-white text-xs font-bold">Admin Panel</div>
            <div className="text-white/30 text-[10px]">Yuvasena CMS</div>
          </div>
        </div>
        <button onClick={() => setNavOpen(false)} className="lg:hidden text-white/50 hover:text-white p-1" aria-label="Close menu">
          <X size={18} />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(n => {
          const active = n.exact ? pathname === n.href : pathname.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active ? 'bg-[#FF6F00] text-white font-semibold' : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <n.icon size={15} />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-white/5 text-sm transition-all"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen pt-16 bg-[#F5F5F5]">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-[#0D0D0D] flex items-center gap-3 px-4 py-3">
        <button onClick={() => setNavOpen(true)} className="text-white p-1" aria-label="Open menu">
          <Menu size={20} />
        </button>
        <span className="text-white text-sm font-bold">Admin Panel</span>
      </div>

      {/* Mobile drawer overlay */}
      <div
        onClick={() => setNavOpen(false)}
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity ${navOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-56 shrink-0 bg-[#0D0D0D] fixed top-16 left-0 bottom-0 z-30 flex-col">
          {SidebarInner}
        </aside>

        {/* Mobile slide-in sidebar */}
        <aside
          className={`lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-[#0D0D0D] z-50 flex flex-col transition-transform duration-300 ${
            navOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {SidebarInner}
        </aside>

        {/* Main content */}
        <main className="lg:ml-56 flex-1 min-h-[calc(100vh-4rem)] overflow-auto pt-12 lg:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
