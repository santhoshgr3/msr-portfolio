'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, Star, StarOff } from 'lucide-react';

type Testimonial = {
  id: number; quote: string; name: string; location: string; role: string;
  photo_url: string; is_featured: boolean; created_at: string;
};

const adminHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-token': typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '',
});

const EMPTY = { quote: '', name: '', location: '', role: '', photo_url: '', is_featured: false };

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/testimonials', { headers: adminHeaders() })
      .then(r => r.json())
      .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.quote || !form.name) { setError('Quote and name are required.'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST', headers: adminHeaders(), body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setItems(prev => [data, ...prev]);
      setForm({ ...EMPTY }); setShowForm(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally { setSaving(false); }
  };

  const toggleFeatured = async (item: Testimonial) => {
    const res = await fetch(`/api/testimonials/${item.id}`, {
      method: 'PATCH', headers: adminHeaders(),
      body: JSON.stringify({ is_featured: !item.is_featured }),
    });
    if (res.ok) setItems(prev => prev.map(t => t.id === item.id ? { ...t, is_featured: !item.is_featured } : t));
  };

  const deleteItem = async (item: Testimonial) => {
    if (!confirm(`Delete testimonial from ${item.name}?`)) return;
    const res = await fetch(`/api/testimonials/${item.id}`, { method: 'DELETE', headers: adminHeaders() });
    if (res.ok) setItems(prev => prev.filter(t => t.id !== item.id));
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0D0D0D]">Testimonials</h1>
          <p className="text-[#6B6B6B] text-sm mt-0.5">{items.length} total · {items.filter(t => t.is_featured).length} featured on homepage</p>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={15} /> {showForm ? 'Cancel' : 'Add Testimonial'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 mb-6 space-y-4">
          <h3 className="font-bold text-[#0D0D0D]">New Testimonial</h3>
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <div>
            <label className="label-field">Quote *</label>
            <textarea value={form.quote} onChange={e => set('quote', e.target.value)} rows={3}
              placeholder="What they said..."
              className="input-field resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" className="input-field" />
            </div>
            <div>
              <label className="label-field">Location</label>
              <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Village / District" className="input-field" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Role / Context</label>
              <input value={form.role} onChange={e => set('role', e.target.value)} placeholder="e.g. Farmer, Youth Leader" className="input-field" />
            </div>
            <div>
              <label className="label-field">Photo URL</label>
              <input value={form.photo_url} onChange={e => set('photo_url', e.target.value)} placeholder="https://..." className="input-field" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)}
              className="w-4 h-4 accent-[#FF6F00]" />
            <span className="text-sm font-semibold text-[#0D0D0D]">Feature on homepage</span>
          </label>
          <button onClick={save} disabled={saving}
            className="bg-[#FF6F00] hover:bg-[#E65100] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
            {saving ? 'Saving...' : 'Add Testimonial'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-7 h-7 border-2 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] p-16 text-center text-[#6B6B6B] text-sm">
          No testimonials yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-[#E8E8E8] p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FF6F00]/10 flex items-center justify-center shrink-0 font-black text-[#FF6F00]">
                {t.name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#3D3D3D] text-sm leading-relaxed mb-2 italic">"{t.quote}"</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#0D0D0D] text-sm">{t.name}</span>
                  {t.location && <span className="text-[#6B6B6B] text-xs">· {t.location}</span>}
                  {t.role && <span className="text-[#6B6B6B] text-xs">· {t.role}</span>}
                  {t.is_featured && (
                    <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">Featured</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleFeatured(t)}
                  className="p-2 rounded-lg border border-[#E8E8E8] hover:border-[#FF6F00] text-[#6B6B6B] hover:text-[#FF6F00] transition-all"
                  title={t.is_featured ? 'Unfeature' : 'Feature on homepage'}>
                  {t.is_featured ? <Star size={13} className="fill-[#FF6F00] text-[#FF6F00]" /> : <StarOff size={13} />}
                </button>
                <button onClick={() => deleteItem(t)}
                  className="p-2 rounded-lg border border-[#E8E8E8] hover:border-red-400 text-[#6B6B6B] hover:text-red-500 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .label-field { display: block; font-size: 0.7rem; font-weight: 700; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.375rem; }
        .input-field { width: 100%; border: 1px solid #E8E8E8; border-radius: 0.75rem; padding: 0.625rem 0.875rem; font-size: 0.875rem; transition: border-color 0.15s; outline: none; }
        .input-field:focus { border-color: #FF6F00; }
      `}</style>
    </div>
  );
}
