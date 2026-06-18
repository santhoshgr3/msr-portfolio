'use client';
import { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';

type Stat = { id: number; key: string; label: string; value: number; suffix: string; icon: string };

const DEFAULT_STATS = [
  { key: 'lives_impacted', label: 'Lives Impacted', suffix: '+', icon: '❤️' },
  { key: 'events', label: 'Events Conducted', suffix: '+', icon: '📅' },
  { key: 'social_followers', label: 'Social Followers', suffix: '+', icon: '👥' },
  { key: 'districts_covered', label: 'Districts Covered', suffix: '', icon: '🗺️' },
  { key: 'volunteers', label: 'Active Volunteers', suffix: '+', icon: '🙌' },
];

const adminHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-token': typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '',
});

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => {
      setStats(d);
      const initial: Record<string, string> = {};
      DEFAULT_STATS.forEach(s => { initial[s.key] = String(d[s.key] ?? ''); });
      setEdits(initial);
      setLoading(false);
    });
  }, []);

  const saveStat = async (key: string, label: string, suffix: string) => {
    const value = Number(edits[key]);
    if (isNaN(value)) return;
    setSaving(key);
    const res = await fetch('/api/stats/update', {
      method: 'POST', headers: adminHeaders(),
      body: JSON.stringify({ key, value, label, suffix }),
    });
    if (res.ok) {
      setStats(prev => ({ ...prev, [key]: value }));
      setSaved(key);
      setTimeout(() => setSaved(null), 2500);
    }
    setSaving(null);
  };

  const refresh = () => {
    setLoading(true);
    fetch('/api/stats').then(r => r.json()).then(d => {
      setStats(d);
      const initial: Record<string, string> = {};
      DEFAULT_STATS.forEach(s => { initial[s.key] = String(d[s.key] ?? ''); });
      setEdits(initial);
      setLoading(false);
    });
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0D0D0D]">Impact Statistics</h1>
          <p className="text-[#6B6B6B] text-sm mt-0.5">These numbers appear publicly on the website. Only update with verified data.</p>
        </div>
        <button onClick={refresh} className="p-2 rounded-lg border border-[#E8E8E8] hover:border-[#FF6F00] text-[#6B6B6B] transition-all" title="Refresh">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-7 h-7 border-2 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {DEFAULT_STATS.map(s => (
            <div key={s.key} className="bg-white rounded-2xl border border-[#E8E8E8] p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="font-bold text-[#0D0D0D] text-sm">{s.label}</div>
                  <div className="text-[#6B6B6B] text-xs">Current: <span className="font-mono text-[#FF6F00] font-bold">{stats[s.key]?.toLocaleString() ?? '0'}{s.suffix}</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={edits[s.key] ?? ''}
                  onChange={e => setEdits(prev => ({ ...prev, [s.key]: e.target.value }))}
                  placeholder="New value"
                  className="flex-1 border border-[#E8E8E8] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF6F00] transition-colors font-mono"
                />
                <button
                  onClick={() => saveStat(s.key, s.label, s.suffix)}
                  disabled={saving === s.key || edits[s.key] === String(stats[s.key])}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 ${
                    saved === s.key ? 'bg-green-500 text-white' : 'bg-[#FF6F00] hover:bg-[#E65100] text-white'
                  }`}
                >
                  {saved === s.key ? '✓ Saved' : saving === s.key ? (
                    <><RefreshCw size={13} className="animate-spin" /> Saving</>
                  ) : (
                    <><Save size={13} /> Update</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-amber-700 text-xs font-semibold mb-1">Important</p>
        <p className="text-amber-600 text-xs">The "members" count is auto-calculated from the members database and cannot be edited here. All other stats update immediately on save.</p>
      </div>
    </div>
  );
}
