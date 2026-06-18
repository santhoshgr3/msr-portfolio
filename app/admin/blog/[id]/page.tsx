'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye } from 'lucide-react';

const CATEGORIES = ['General', 'Education', 'Events', 'Cultural', 'Community', 'Women Empowerment', 'Youth', 'Milestones', 'Spiritual'];

const adminHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-token': typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '',
});

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    image_url: '', category: 'General', author: 'Dr. Madhiraj Sairathan',
  });
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${id}`, { headers: adminHeaders() })
      .then(r => r.json())
      .then(d => {
        if (d.id) {
          setForm({ title: d.title, slug: d.slug, excerpt: d.excerpt || '', content: d.content || '', image_url: d.image_url || '', category: d.category || 'General', author: d.author || '' });
          setPublished(!!d.published_at);
        }
        setLoading(false);
      });
  }, [id]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = async (publish?: boolean) => {
    if (!form.title || !form.slug) { setError('Title and slug are required.'); return; }
    setSaving(true);
    setError('');
    try {
      const body: Record<string, unknown> = { ...form };
      if (publish !== undefined) body.publish = publish;
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT', headers: adminHeaders(), body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push('/admin/blog');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
      setSaving(false);
    }
  };

  const renderContent = (text: string) =>
    text.split('\n\n').filter(Boolean).map((block, i) => {
      if (block.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-[#0D0D0D] mt-8 mb-3">{block.slice(3)}</h2>;
      return <p key={i} className="text-[#3D3D3D] leading-[1.85] mb-4">{block}</p>;
    });

  if (loading) return (
    <div className="p-8 flex justify-center">
      <div className="w-7 h-7 border-2 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/blog" className="p-2 rounded-lg border border-[#E8E8E8] hover:border-[#FF6F00] text-[#6B6B6B] transition-all">
          <ArrowLeft size={15} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#0D0D0D]">Edit Blog Post</h1>
          <p className="text-[#6B6B6B] text-sm">{published ? 'Currently published' : 'Draft — not visible to public'}</p>
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 space-y-5">
        <div>
          <label className="label-field">Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="label-field">Slug (URL) *</label>
          <div className="flex gap-2 items-center">
            <span className="text-[#6B6B6B] text-sm shrink-0">/blog/</span>
            <input value={form.slug} onChange={e => set('slug', e.target.value)} className="input-field flex-1" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className="input-field">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label-field">Author</label>
            <input value={form.author} onChange={e => set('author', e.target.value)} className="input-field" />
          </div>
        </div>
        <div>
          <label className="label-field">Excerpt</label>
          <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2} className="input-field resize-none" />
        </div>
        <div>
          <label className="label-field">Cover Image URL</label>
          <input value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." className="input-field" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label-field !mb-0">Content</label>
            <button onClick={() => setPreview(p => !p)}
              className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#FF6F00] transition-colors font-semibold">
              <Eye size={12} /> {preview ? 'Edit' : 'Preview'}
            </button>
          </div>
          {preview ? (
            <div className="border border-[#E8E8E8] rounded-xl p-5 min-h-[300px] bg-[#F5F5F5]">
              {renderContent(form.content)}
            </div>
          ) : (
            <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={16}
              className="input-field resize-y font-mono text-sm" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5 flex-wrap">
        <button onClick={() => save()} disabled={saving}
          className="flex items-center gap-2 bg-[#0D0D0D] hover:bg-[#FF6F00] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
          <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {!published ? (
          <button onClick={() => save(true)} disabled={saving}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
            Publish
          </button>
        ) : (
          <button onClick={() => save(false)} disabled={saving}
            className="flex items-center gap-2 border border-amber-300 bg-amber-50 text-amber-700 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
            Unpublish
          </button>
        )}
        <Link href="/admin/blog" className="text-[#6B6B6B] text-sm hover:text-[#0D0D0D] transition-colors ml-auto">Cancel</Link>
      </div>

      <style jsx>{`
        .label-field { display: block; font-size: 0.7rem; font-weight: 700; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.375rem; }
        .input-field { width: 100%; border: 1px solid #E8E8E8; border-radius: 0.75rem; padding: 0.625rem 0.875rem; font-size: 0.875rem; transition: border-color 0.15s; outline: none; }
        .input-field:focus { border-color: #FF6F00; }
      `}</style>
    </div>
  );
}
