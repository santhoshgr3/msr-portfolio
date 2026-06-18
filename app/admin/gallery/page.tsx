'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Eye, EyeOff, ImageIcon } from 'lucide-react';
import type { GalleryItem } from '@/lib/supabase';

const GALLERY_TAGS = ['Healthcare', 'Youth', 'Women Empowerment', 'Education', 'Events', 'Milestones', 'General'];

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', tag: 'General' });
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    fetch('/api/gallery').then(r => r.json()).then(d => { setGallery(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = e => setUploadPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!uploadFile || !uploadForm.title) return;
    setUploading(true); setUploadMsg(null);
    const fd = new FormData();
    fd.append('file', uploadFile);
    fd.append('title', uploadForm.title);
    fd.append('description', uploadForm.description);
    fd.append('tag', uploadForm.tag);
    try {
      const res = await fetch('/api/gallery/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setGallery(prev => [data, ...prev]);
      setUploadFile(null); setUploadPreview(null);
      setUploadForm({ title: '', description: '', tag: 'General' });
      setUploadMsg({ type: 'success', text: 'Photo uploaded!' });
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e: unknown) {
      setUploadMsg({ type: 'error', text: e instanceof Error ? e.message : 'Upload failed' });
    } finally { setUploading(false); }
  };

  const toggleVisibility = async (item: GalleryItem) => {
    const res = await fetch(`/api/gallery/${item.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_visible: !item.is_visible }),
    });
    if (res.ok) setGallery(prev => prev.map(g => g.id === item.id ? { ...g, is_visible: !item.is_visible } : g));
  };

  const deleteItem = async (item: GalleryItem) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    const res = await fetch(`/api/gallery/${item.id}`, { method: 'DELETE' });
    if (res.ok) setGallery(prev => prev.filter(g => g.id !== item.id));
  };

  const filtered = filterTag ? gallery.filter(g => g.tag === filterTag) : gallery;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#0D0D0D]">Gallery</h1>
        <p className="text-[#6B6B6B] text-sm mt-0.5">{gallery.length} photos · {gallery.filter(g => g.is_visible).length} visible</p>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 mb-6">
        <h2 className="font-bold text-[#0D0D0D] mb-5">Upload New Photo</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${uploadPreview ? 'border-[#FF6F00]' : 'border-[#E8E8E8] hover:border-[#FF6F00]'}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
          >
            {uploadPreview ? (
              <div className="relative">
                <Image src={uploadPreview} alt="Preview" width={400} height={300} className="w-full h-44 object-contain rounded-xl" />
                <button onClick={e => { e.stopPropagation(); setUploadFile(null); setUploadPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">✕</button>
              </div>
            ) : (
              <div className="py-8">
                <Upload size={28} className="text-[#6B6B6B] mx-auto mb-2" />
                <p className="font-semibold text-[#0D0D0D] text-sm">Click or drag & drop</p>
                <p className="text-xs text-[#6B6B6B] mt-1">JPG, PNG, WEBP — max 10 MB</p>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1">Title *</label>
              <input value={uploadForm.title} onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Free Medical Camp — Bhupalpally 2025"
                className="w-full border border-[#E8E8E8] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF6F00] transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1">Category</label>
              <select value={uploadForm.tag} onChange={e => setUploadForm(f => ({ ...f, tag: e.target.value }))}
                className="w-full border border-[#E8E8E8] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF6F00] transition-colors">
                {GALLERY_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-1">Caption</label>
              <textarea value={uploadForm.description} onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))}
                rows={2} className="w-full border border-[#E8E8E8] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF6F00] resize-none transition-colors" />
            </div>
            {uploadMsg && (
              <div className={`text-xs px-3 py-2.5 rounded-xl font-semibold ${uploadMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {uploadMsg.text}
              </div>
            )}
            <button onClick={handleUpload} disabled={!uploadFile || !uploadForm.title || uploading}
              className="w-full bg-[#FF6F00] disabled:opacity-40 hover:bg-[#E65100] text-white font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
              <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </div>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#0D0D0D]">Manage Photos ({filtered.length})</h2>
          <select value={filterTag} onChange={e => setFilterTag(e.target.value)}
            className="border border-[#E8E8E8] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#FF6F00] transition-colors">
            <option value="">All Categories</option>
            {GALLERY_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-7 h-7 border-2 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[#6B6B6B]">
            <ImageIcon size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No photos yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(item => (
              <div key={item.id} className={`border rounded-xl overflow-hidden ${item.is_visible ? 'border-[#E8E8E8]' : 'border-dashed border-[#E8E8E8] opacity-60'}`}>
                <div className="relative aspect-video bg-[#F5F5F5]">
                  <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="200px" />
                  {!item.is_visible && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#6B6B6B] bg-white px-2 py-0.5 rounded">Hidden</span>
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <span className="text-[9px] font-bold bg-[#F5F5F5] text-[#6B6B6B] px-1.5 py-0.5 rounded">{item.tag}</span>
                  <p className="font-semibold text-[#0D0D0D] text-xs leading-tight truncate mt-1">{item.title}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <button onClick={() => toggleVisibility(item)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold border border-[#E8E8E8] hover:border-[#FF6F00] transition-colors text-[#6B6B6B]">
                      {item.is_visible ? <><EyeOff size={10} /> Hide</> : <><Eye size={10} /> Show</>}
                    </button>
                    <button onClick={() => deleteItem(item)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#E8E8E8] hover:border-red-400 hover:text-red-500 text-[#6B6B6B] transition-all">
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
