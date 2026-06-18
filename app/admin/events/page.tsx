'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Calendar, MapPin } from 'lucide-react';

type Event = {
  id: number; title: string; description: string; date: string;
  location: string; district: string; type: string; is_upcoming: boolean;
};

const typeColors: Record<string, string> = {
  Healthcare: '#0D0D0D', Youth: '#FF6F00', Women: '#BE185D', Education: '#0369A1', General: '#6B6B6B',
};

const adminHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-token': typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '',
});

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(d => { setEvents(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const toggleUpcoming = async (ev: Event) => {
    const res = await fetch(`/api/events/${ev.id}`, {
      method: 'PUT', headers: adminHeaders(),
      body: JSON.stringify({ is_upcoming: !ev.is_upcoming }),
    });
    if (res.ok) {
      const updated = await res.json();
      setEvents(prev => prev.map(e => e.id === ev.id ? updated : e));
    }
  };

  const deleteEvent = async (ev: Event) => {
    if (!confirm(`Delete "${ev.title}"?`)) return;
    const res = await fetch(`/api/events/${ev.id}`, { method: 'DELETE', headers: adminHeaders() });
    if (res.ok) setEvents(prev => prev.filter(e => e.id !== ev.id));
  };

  const visible = events.filter(e =>
    filter === 'all' ? true : filter === 'upcoming' ? e.is_upcoming : !e.is_upcoming
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0D0D0D]">Events</h1>
          <p className="text-[#6B6B6B] text-sm mt-0.5">{events.length} total · {events.filter(e => e.is_upcoming).length} upcoming</p>
        </div>
        <Link href="/admin/events/new" className="flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={15} /> New Event
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'upcoming', 'past'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${
              filter === f ? 'bg-[#0D0D0D] text-white' : 'bg-white border border-[#E8E8E8] text-[#6B6B6B] hover:text-[#0D0D0D]'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-7 h-7 border-2 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] p-16 text-center">
          <p className="text-[#6B6B6B] text-sm">No events.{' '}
            <Link href="/admin/events/new" className="text-[#FF6F00] font-semibold hover:underline">Create one →</Link>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(ev => (
            <div key={ev.id} className="bg-white border border-[#E8E8E8] hover:border-[#FF6F00]/40 rounded-2xl p-5 flex items-center gap-4 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: typeColors[ev.type] ?? '#6B6B6B' }}>
                    {ev.type}
                  </span>
                  {ev.is_upcoming ? (
                    <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">Upcoming</span>
                  ) : (
                    <span className="text-[10px] text-[#6B6B6B] font-semibold bg-[#F5F5F5] px-2 py-0.5 rounded-full">Past</span>
                  )}
                </div>
                <h3 className="font-bold text-[#0D0D0D] text-sm">{ev.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[#6B6B6B] text-xs"><Calendar size={10} /> {new Date(ev.date).toLocaleDateString('en-IN')}</span>
                  {ev.location && <span className="flex items-center gap-1 text-[#6B6B6B] text-xs"><MapPin size={10} /> {ev.location}{ev.district ? `, ${ev.district}` : ''}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleUpcoming(ev)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    ev.is_upcoming ? 'border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100' : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                  }`}>
                  {ev.is_upcoming ? 'Mark Past' : 'Mark Upcoming'}
                </button>
                <Link href={`/admin/events/${ev.id}`}
                  className="p-2 rounded-lg border border-[#E8E8E8] hover:border-[#FF6F00] text-[#6B6B6B] transition-all">
                  <Edit2 size={13} />
                </Link>
                <button onClick={() => deleteEvent(ev)}
                  className="p-2 rounded-lg border border-[#E8E8E8] hover:border-red-400 text-[#6B6B6B] hover:text-red-500 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
