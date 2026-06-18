'use client';
import { useState, useEffect } from 'react';

const TOKEN = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sunnyannaadmin2025';
const H = { 'Content-Type': 'application/json', 'x-admin-token': TOKEN };

type TimelineItem = { id: number; year: string; title: string; description: string; highlight: boolean; order_num: number };
type TeamMember   = { id: number; name: string; role: string; initial: string; order_num: number };

const emptyTL = (): Omit<TimelineItem, 'id'> => ({ year: '', title: '', description: '', highlight: false, order_num: 0 });
const emptyTM = (): Omit<TeamMember, 'id'>   => ({ name: '', role: '', initial: '', order_num: 0 });

export default function AdminAboutPage() {
  const [tab, setTab]       = useState<'timeline' | 'team'>('timeline');
  const [items, setItems]   = useState<TimelineItem[]>([]);
  const [team,  setTeam]    = useState<TeamMember[]>([]);
  const [form,  setForm]    = useState<Omit<TimelineItem, 'id'>>(emptyTL());
  const [tForm, setTForm]   = useState<Omit<TeamMember, 'id'>>(emptyTM());
  const [editId, setEditId] = useState<number | null>(null);
  const [tEditId,setTEditId]= useState<number | null>(null);
  const [msg,   setMsg]     = useState('');

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  useEffect(() => {
    fetch('/api/timeline').then(r => r.json()).then(setItems).catch(() => {});
    fetch('/api/team').then(r => r.json()).then(setTeam).catch(() => {});
  }, []);

  // ── Timeline handlers ──
  const saveTL = async () => {
    if (!form.year || !form.title) return flash('Year and title required');
    const url    = editId ? `/api/timeline/${editId}` : '/api/timeline';
    const method = editId ? 'PUT' : 'POST';
    const res    = await fetch(url, { method, headers: H, body: JSON.stringify(form) });
    if (!res.ok) return flash('Save failed');
    const saved = await res.json();
    setItems(prev => editId ? prev.map(i => i.id === editId ? saved : i) : [...prev, saved]);
    setForm(emptyTL()); setEditId(null); flash('Saved ✓');
  };

  const deleteTL = async (id: number) => {
    if (!confirm('Delete this timeline entry?')) return;
    await fetch(`/api/timeline/${id}`, { method: 'DELETE', headers: H });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const editTL = (item: TimelineItem) => {
    setEditId(item.id);
    setForm({ year: item.year, title: item.title, description: item.description, highlight: item.highlight, order_num: item.order_num });
  };

  // ── Team handlers ──
  const saveTM = async () => {
    if (!tForm.name) return flash('Name required');
    const url    = tEditId ? `/api/team/${tEditId}` : '/api/team';
    const method = tEditId ? 'PUT' : 'POST';
    const body   = { ...tForm, initial: tForm.initial || tForm.name[0] };
    const res    = await fetch(url, { method, headers: H, body: JSON.stringify(body) });
    if (!res.ok) return flash('Save failed');
    const saved  = await res.json();
    setTeam(prev => tEditId ? prev.map(t => t.id === tEditId ? saved : t) : [...prev, saved]);
    setTForm(emptyTM()); setTEditId(null); flash('Saved ✓');
  };

  const deleteTM = async (id: number) => {
    if (!confirm('Remove this team member?')) return;
    await fetch(`/api/team/${id}`, { method: 'DELETE', headers: H });
    setTeam(prev => prev.filter(t => t.id !== id));
  };

  const field = 'w-full border border-[#E8E8E8] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF6F00]';
  const btn   = 'px-4 py-2 rounded-xl text-sm font-semibold transition-colors';

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-black text-[#0D0D0D] mb-1">About Page Content</h1>
      <p className="text-sm text-[#6B6B6B] mb-6">Manage timeline milestones and team members.</p>

      {msg && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-xl">{msg}</div>}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#E8E8E8]">
        {(['timeline', 'team'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${tab === t ? 'border-[#FF6F00] text-[#FF6F00]' : 'border-transparent text-[#6B6B6B] hover:text-[#0D0D0D]'}`}>
            {t === 'timeline' ? 'Timeline' : 'Team Members'}
          </button>
        ))}
      </div>

      {/* ── Timeline tab ── */}
      {tab === 'timeline' && (
        <div>
          <div className="bg-[#F5F5F5] rounded-2xl p-5 mb-6 space-y-3">
            <h2 className="font-bold text-sm text-[#0D0D0D] mb-1">{editId ? 'Edit Entry' : 'Add Timeline Entry'}</h2>
            <div className="grid grid-cols-2 gap-3">
              <input className={field} placeholder="Year (e.g. 2019 or Today)" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} />
              <input className={field} placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <textarea className={field} rows={2} placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <div className="flex items-center gap-4">
              <input type="number" className={`${field} w-24`} placeholder="Order" value={form.order_num} onChange={e => setForm(f => ({ ...f, order_num: +e.target.value }))} />
              <label className="flex items-center gap-2 text-sm text-[#6B6B6B] cursor-pointer">
                <input type="checkbox" checked={form.highlight} onChange={e => setForm(f => ({ ...f, highlight: e.target.checked }))} />
                Highlight (orange dot)
              </label>
            </div>
            <div className="flex gap-2">
              <button onClick={saveTL} className={`${btn} bg-[#FF6F00] text-white hover:bg-[#E65100]`}>{editId ? 'Update' : 'Add Entry'}</button>
              {editId && <button onClick={() => { setEditId(null); setForm(emptyTL()); }} className={`${btn} border border-[#E8E8E8] text-[#6B6B6B]`}>Cancel</button>}
            </div>
          </div>

          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-start gap-3 border border-[#E8E8E8] rounded-xl p-4">
                <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${item.highlight ? 'bg-[#FF6F00]' : 'bg-[#0D0D0D]'}`} />
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[#FF6F00] text-xs font-bold">{item.year}</span>
                  <p className="font-bold text-[#0D0D0D] text-sm">{item.title}</p>
                  <p className="text-xs text-[#6B6B6B] line-clamp-1">{item.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => editTL(item)} className="text-xs text-[#FF6F00] hover:underline">Edit</button>
                  <button onClick={() => deleteTL(item.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Team tab ── */}
      {tab === 'team' && (
        <div>
          <div className="bg-[#F5F5F5] rounded-2xl p-5 mb-6 space-y-3">
            <h2 className="font-bold text-sm text-[#0D0D0D] mb-1">{tEditId ? 'Edit Member' : 'Add Team Member'}</h2>
            <div className="grid grid-cols-2 gap-3">
              <input className={field} placeholder="Full Name" value={tForm.name} onChange={e => setTForm(f => ({ ...f, name: e.target.value }))} />
              <input className={field} placeholder="Role / Title" value={tForm.role} onChange={e => setTForm(f => ({ ...f, role: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className={field} placeholder="Initials (e.g. AJ)" value={tForm.initial} onChange={e => setTForm(f => ({ ...f, initial: e.target.value }))} />
              <input type="number" className={field} placeholder="Order" value={tForm.order_num} onChange={e => setTForm(f => ({ ...f, order_num: +e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <button onClick={saveTM} className={`${btn} bg-[#FF6F00] text-white hover:bg-[#E65100]`}>{tEditId ? 'Update' : 'Add Member'}</button>
              {tEditId && <button onClick={() => { setTEditId(null); setTForm(emptyTM()); }} className={`${btn} border border-[#E8E8E8] text-[#6B6B6B]`}>Cancel</button>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {team.map((m, i) => (
              <div key={m.id} className="flex items-center gap-3 border border-[#E8E8E8] rounded-xl p-4">
                <div className="w-10 h-10 rounded-full bg-[#FF6F00] flex items-center justify-center text-white font-bold shrink-0">
                  {m.initial || m.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#0D0D0D] text-sm">{m.name}</p>
                  <p className="text-xs text-[#6B6B6B]">{m.role}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setTEditId(m.id); setTForm({ name: m.name, role: m.role, initial: m.initial, order_num: m.order_num }); }} className="text-xs text-[#FF6F00] hover:underline">Edit</button>
                  <button onClick={() => deleteTM(m.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
