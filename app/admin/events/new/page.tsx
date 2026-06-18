'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const EVENT_TYPES = ['Healthcare', 'Youth', 'Women', 'Education', 'General', 'Community', 'Sports'];
const DISTRICTS = [
  'Adilabad', 'Komaram Bheem', 'Mancherial', 'Nirmal', 'Nizamabad', 'Jagtial', 'Peddapalli',
  'Karimnagar', 'Rajanna Sircilla', 'Kamareddy', 'Siddipet', 'Medak', 'Jayashankar Bhupalpally',
  'Mulugu', 'Hanamkonda', 'Warangal', 'Jangaon', 'Sangareddy', 'Medchal-Malkajgiri',
  'Hyderabad', 'Rangareddy', 'Vikarabad', 'Yadadri Bhuvanagiri', 'Nalgonda', 'Suryapet',
  'Mahabubabad', 'Khammam', 'Bhadradri Kothagudem', 'Narayanpet', 'Mahabubnagar',
  'Nagarkurnool', 'Wanaparthy', 'Jogulamba Gadwal',
];

const adminHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-token': typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '',
});

export default function NewEvent() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', description: '', date: '', location: '',
    district: 'Jayashankar Bhupalpally', type: 'General', image_url: '',
    rsvp_count: '', is_upcoming: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title || !form.date) { setError('Title and date are required.'); return; }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/events', {
        method: 'POST', headers: adminHeaders(),
        body: JSON.stringify({ ...form, rsvp_count: Number(form.rsvp_count) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push('/admin/events');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/events" className="p-2 rounded-lg border border-[#E8E8E8] hover:border-[#FF6F00] text-[#6B6B6B] transition-all">
          <ArrowLeft size={15} />
        </Link>
        <h1 className="text-2xl font-black text-[#0D0D0D]">New Event</h1>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 space-y-5">
        <div>
          <label className="label-field">Event Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="e.g. Free Medical Camp — Bhupalpally" className="input-field" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Date *</label>
            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="label-field">Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)} className="input-field">
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Location (village/city)</label>
            <input value={form.location} onChange={e => set('location', e.target.value)}
              placeholder="e.g. Bhupalpally" className="input-field" />
          </div>
          <div>
            <label className="label-field">District</label>
            <select value={form.district} onChange={e => set('district', e.target.value)} className="input-field">
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label-field">Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4}
            placeholder="What will happen at this event?"
            className="input-field resize-none" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Expected Attendees / Spots</label>
            <input type="number" value={form.rsvp_count} onChange={e => set('rsvp_count', e.target.value)}
              placeholder="200" className="input-field" />
          </div>
          <div>
            <label className="label-field">Image URL (optional)</label>
            <input value={form.image_url} onChange={e => set('image_url', e.target.value)}
              placeholder="https://..." className="input-field" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={form.is_upcoming} onChange={e => set('is_upcoming', e.target.checked)}
              className="w-4 h-4 rounded accent-[#FF6F00]" />
            <span className="text-sm font-semibold text-[#0D0D0D]">Mark as upcoming</span>
          </label>
          <span className="text-xs text-[#6B6B6B]">(shown in "Upcoming Events" section)</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
          <Save size={14} /> {saving ? 'Saving...' : 'Create Event'}
        </button>
        <Link href="/admin/events" className="text-[#6B6B6B] text-sm hover:text-[#0D0D0D] transition-colors">Cancel</Link>
      </div>

      <style jsx>{`
        .label-field { display: block; font-size: 0.7rem; font-weight: 700; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.375rem; }
        .input-field { width: 100%; border: 1px solid #E8E8E8; border-radius: 0.75rem; padding: 0.625rem 0.875rem; font-size: 0.875rem; transition: border-color 0.15s; outline: none; }
        .input-field:focus { border-color: #FF6F00; }
      `}</style>
    </div>
  );
}
