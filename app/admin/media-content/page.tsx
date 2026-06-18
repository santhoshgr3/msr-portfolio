'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const TOKEN = 'sunnyannaadmin2025';
const H = { 'Content-Type': 'application/json', 'x-admin-token': TOKEN };

type Video = { id: number; title: string; url: string; video_url: string; duration: string; views: string };
type Press  = { id: number; outlet: string; date: string; title: string; type: string; url: string };

const emptyV = (): Omit<Video, 'id'> => ({ title: '', url: '', video_url: '', duration: '', views: '' });
const emptyP = (): Omit<Press, 'id'> => ({ outlet: '', date: '', title: '', type: 'TV Coverage', url: '' });

const PRESS_TYPES = ['TV Coverage', 'Print', 'Online News', 'Radio', 'Magazine'];

export default function AdminMediaContentPage() {
  const [tab,    setTab]    = useState<'videos' | 'press'>('videos');
  const [videos, setVideos] = useState<Video[]>([]);
  const [press,  setPress]  = useState<Press[]>([]);
  const [vForm,  setVForm]  = useState<Omit<Video, 'id'>>(emptyV());
  const [pForm,  setPForm]  = useState<Omit<Press, 'id'>>(emptyP());
  const [vEdit,  setVEdit]  = useState<number | null>(null);
  const [pEdit,  setPEdit]  = useState<number | null>(null);
  const [msg,    setMsg]    = useState('');
  const [vMode,  setVMode]  = useState<'link' | 'upload'>('link');
  const [vFile,  setVFile]  = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  useEffect(() => {
    fetch('/api/media-videos').then(r => r.json()).then(setVideos).catch(() => {});
    fetch('/api/press').then(r => r.json()).then(setPress).catch(() => {});
  }, []);

  // ── Video handlers ──
  const saveV = async () => {
    if (!vForm.title) return flash('Title required');
    const payload = { ...vForm };

    // Upload a video file first (direct-to-storage signed upload).
    if (vMode === 'upload' && vFile) {
      if (vFile.size > 200 * 1024 * 1024) return flash('Video too large (max 200 MB)');
      setUploading(true);
      try {
        const signRes = await fetch('/api/media-videos/sign-upload', {
          method: 'POST', headers: H,
          body: JSON.stringify({ filename: vFile.name, contentType: vFile.type }),
        });
        const sign = await signRes.json();
        if (!signRes.ok) { setUploading(false); return flash(sign.error || 'Could not start upload'); }

        const { error: upErr } = await supabase.storage
          .from('videos')
          .uploadToSignedUrl(sign.path, sign.token, vFile);
        if (upErr) { setUploading(false); return flash('Upload failed: ' + upErr.message); }

        payload.video_url = sign.publicUrl;
        payload.url = '';
      } catch {
        setUploading(false); return flash('Upload failed');
      }
      setUploading(false);
    }

    const url    = vEdit ? `/api/media-videos/${vEdit}` : '/api/media-videos';
    const method = vEdit ? 'PUT' : 'POST';
    const res    = await fetch(url, { method, headers: H, body: JSON.stringify(payload) });
    if (!res.ok) return flash('Save failed');
    const saved  = await res.json();
    setVideos(prev => vEdit ? prev.map(v => v.id === vEdit ? saved : v) : [saved, ...prev]);
    setVForm(emptyV()); setVEdit(null); setVFile(null); setVMode('link'); flash('Saved ✓');
  };

  const deleteV = async (id: number) => {
    if (!confirm('Delete this video?')) return;
    await fetch(`/api/media-videos/${id}`, { method: 'DELETE', headers: H });
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  // ── Press handlers ──
  const saveP = async () => {
    if (!pForm.outlet || !pForm.title || !pForm.date) return flash('Outlet, title, and date required');
    const url    = pEdit ? `/api/press/${pEdit}` : '/api/press';
    const method = pEdit ? 'PUT' : 'POST';
    const res    = await fetch(url, { method, headers: H, body: JSON.stringify(pForm) });
    if (!res.ok) return flash('Save failed');
    const saved  = await res.json();
    setPress(prev => pEdit ? prev.map(p => p.id === pEdit ? saved : p) : [saved, ...prev]);
    setPForm(emptyP()); setPEdit(null); flash('Saved ✓');
  };

  const deleteP = async (id: number) => {
    if (!confirm('Delete this press item?')) return;
    await fetch(`/api/press/${id}`, { method: 'DELETE', headers: H });
    setPress(prev => prev.filter(p => p.id !== id));
  };

  const field = 'w-full border border-[#E8E8E8] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF6F00]';
  const btn   = 'px-4 py-2 rounded-xl text-sm font-semibold transition-colors';

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-black text-[#0D0D0D] mb-1">Media Content</h1>
      <p className="text-sm text-[#6B6B6B] mb-6">Manage videos and press coverage shown on the Media page.</p>

      {msg && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-xl">{msg}</div>}

      <div className="flex gap-2 mb-6 border-b border-[#E8E8E8]">
        {(['videos', 'press'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${tab === t ? 'border-[#FF6F00] text-[#FF6F00]' : 'border-transparent text-[#6B6B6B] hover:text-[#0D0D0D]'}`}>
            {t === 'videos' ? 'Videos' : 'Press Coverage'}
          </button>
        ))}
      </div>

      {/* ── Videos tab ── */}
      {tab === 'videos' && (
        <div>
          <div className="bg-[#F5F5F5] rounded-2xl p-5 mb-6 space-y-3">
            <h2 className="font-bold text-sm text-[#0D0D0D] mb-1">{vEdit ? 'Edit Video' : 'Add Video'}</h2>
            <input className={field} placeholder="Video title" value={vForm.title} onChange={e => setVForm(f => ({ ...f, title: e.target.value }))} />

            {/* Source toggle */}
            {!vEdit && (
              <div className="flex gap-1 bg-white border border-[#E8E8E8] rounded-xl p-1 w-fit">
                {(['link', 'upload'] as const).map(m => (
                  <button key={m} onClick={() => setVMode(m)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${vMode === m ? 'bg-[#FF6F00] text-white' : 'text-[#6B6B6B]'}`}>
                    {m === 'link' ? 'YouTube / Link' : 'Upload File'}
                  </button>
                ))}
              </div>
            )}

            {(vMode === 'link' || vEdit) ? (
              <input className={field} placeholder="YouTube URL (e.g. https://youtube.com/watch?v=...)" value={vForm.url} onChange={e => setVForm(f => ({ ...f, url: e.target.value }))} />
            ) : (
              <div>
                <input type="file" accept="video/*" onChange={e => setVFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-[#6B6B6B] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#FF6F00] file:text-white file:font-semibold file:text-xs cursor-pointer" />
                <p className="text-[10px] text-[#6B6B6B] mt-1">MP4/WebM — max 200 MB. Uploads directly to storage.</p>
                {vFile && <p className="text-xs text-[#0D0D0D] mt-1 font-medium">{vFile.name} ({(vFile.size / 1024 / 1024).toFixed(1)} MB)</p>}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <input className={field} placeholder="Duration (e.g. 12:34)" value={vForm.duration} onChange={e => setVForm(f => ({ ...f, duration: e.target.value }))} />
              <input className={field} placeholder="Views (e.g. 2.1K)" value={vForm.views} onChange={e => setVForm(f => ({ ...f, views: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <button onClick={saveV} disabled={uploading} className={`${btn} bg-[#FF6F00] text-white hover:bg-[#E65100] disabled:opacity-50`}>
                {uploading ? 'Uploading…' : vEdit ? 'Update' : 'Add Video'}
              </button>
              {vEdit && <button onClick={() => { setVEdit(null); setVForm(emptyV()); setVFile(null); setVMode('link'); }} className={`${btn} border border-[#E8E8E8] text-[#6B6B6B]`}>Cancel</button>}
            </div>
          </div>

          <div className="space-y-3">
            {videos.map(v => (
              <div key={v.id} className="flex items-center gap-3 border border-[#E8E8E8] rounded-xl p-4">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm ml-0.5">▶</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#0D0D0D] text-sm truncate">{v.title}</p>
                  <p className="text-xs text-[#6B6B6B]">{v.duration} · {v.views} views</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setVEdit(v.id); setVForm({ title: v.title, url: v.url, video_url: v.video_url || '', duration: v.duration, views: v.views }); }} className="text-xs text-[#FF6F00] hover:underline">Edit</button>
                  <button onClick={() => deleteV(v.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Press tab ── */}
      {tab === 'press' && (
        <div>
          <div className="bg-[#F5F5F5] rounded-2xl p-5 mb-6 space-y-3">
            <h2 className="font-bold text-sm text-[#0D0D0D] mb-1">{pEdit ? 'Edit Press Item' : 'Add Press Coverage'}</h2>
            <div className="grid grid-cols-2 gap-3">
              <input className={field} placeholder="Outlet (e.g. Eenadu)" value={pForm.outlet} onChange={e => setPForm(f => ({ ...f, outlet: e.target.value }))} />
              <input type="date" className={field} value={pForm.date} onChange={e => setPForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <input className={field} placeholder="Article / segment title" value={pForm.title} onChange={e => setPForm(f => ({ ...f, title: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <select className={field} value={pForm.type} onChange={e => setPForm(f => ({ ...f, type: e.target.value }))}>
                {PRESS_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
              <input className={field} placeholder="Article URL (optional)" value={pForm.url} onChange={e => setPForm(f => ({ ...f, url: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <button onClick={saveP} className={`${btn} bg-[#FF6F00] text-white hover:bg-[#E65100]`}>{pEdit ? 'Update' : 'Add Coverage'}</button>
              {pEdit && <button onClick={() => { setPEdit(null); setPForm(emptyP()); }} className={`${btn} border border-[#E8E8E8] text-[#6B6B6B]`}>Cancel</button>}
            </div>
          </div>

          <div className="space-y-3">
            {press.map(p => (
              <div key={p.id} className="flex items-start gap-3 border border-[#E8E8E8] rounded-xl p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-bold text-[#FF6F00]">{p.outlet}</span>
                    <span className="text-xs text-[#6B6B6B]">{p.date}</span>
                    <span className="text-xs bg-[#F5F5F5] border border-[#E8E8E8] text-[#6B6B6B] px-2 py-0.5 rounded-full">{p.type}</span>
                  </div>
                  <p className="font-bold text-[#0D0D0D] text-sm">{p.title}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setPEdit(p.id); setPForm({ outlet: p.outlet, date: p.date, title: p.title, type: p.type, url: p.url }); }} className="text-xs text-[#FF6F00] hover:underline">Edit</button>
                  <button onClick={() => deleteP(p.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
