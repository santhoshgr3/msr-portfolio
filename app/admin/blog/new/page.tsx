'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye } from 'lucide-react';

const CATEGORIES = ['General', 'Education', 'Events', 'Cultural', 'Community', 'Women Empowerment', 'Youth', 'Milestones', 'Spiritual'];

const adminHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-token': typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '',
});

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function NewBlogPost() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    image_url: '', category: 'General', author: 'Dr. Madhiraj Sairathan',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = async (publish: boolean) => {
    if (!form.title || !form.slug) { setError('Title and slug are required.'); return; }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: adminHeaders(),
        body: JSON.stringify({ ...form, publish }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push('/admin/blog');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save');
      setSaving(false);
    }
  };

  const renderContent = (text: string) =>
    text.split('\n\n').filter(Boolean).map((block, i) => {
      if (block.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-[#0D0D0D] mt-8 mb-3">{block.slice(3)}</h2>;
      return <p key={i} className="text-[#3D3D3D] leading-[1.85] mb-4">{block}</p>;
    });

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/blog" className="p-2 rounded-lg border border-[#E8E8E8] hover:border-[#FF6F00] text-[#6B6B6B] transition-all">
          <ArrowLeft size={15} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#0D0D0D]">New Blog Post</h1>
          <p className="text-[#6B6B6B] text-sm">Use ## Heading on its own line to add section headings</p>
        </div>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 space-y-5">
        <div>
          <label className="label-field">Title *</label>
          <input value={form.title} onChange={e => { set('title', e.target.value); set('slug', slugify(e.target.value)); }}
            placeholder="e.g. How Free Medical Camps Changed Bhupalpally"
            className="input-field" />
        </div>
        <div>
          <label className="label-field">Slug (URL) *</label>
          <div className="flex gap-2 items-center">
            <span className="text-[#6B6B6B] text-sm shrink-0">/blog/</span>
            <input value={form.slug} onChange={e => set('slug', slugify(e.target.value))}
              placeholder="how-free-medical-camps-changed-bhupalpally"
              className="input-field flex-1" />
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
          <label className="label-field">Excerpt (shown in listing)</label>
          <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2}
            placeholder="A brief summary of what this post is about..."
            className="input-field resize-none" />
        </div>
        <div>
          <label className="label-field">Cover Image URL (optional)</label>
          <input value={form.image_url} onChange={e => set('image_url', e.target.value)}
            placeholder="https://..." className="input-field" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label-field !mb-0">Content *</label>
            <button onClick={() => setPreview(p => !p)}
              className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#FF6F00] transition-colors font-semibold">
              <Eye size={12} /> {preview ? 'Edit' : 'Preview'}
            </button>
          </div>
          {preview ? (
            <div className="border border-[#E8E8E8] rounded-xl p-5 min-h-[300px] bg-[#F5F5F5] prose prose-neutral max-w-none">
              {renderContent(form.content)}
            </div>
          ) : (
            <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={16}
              placeholder={'Write your post here.\n\nSeparate paragraphs with a blank line.\n\nUse ## Section Title to add a heading.'}
              className="input-field resize-y font-mono text-sm" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button onClick={() => save(true)} disabled={saving}
          className="flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
          <Save size={14} /> {saving ? 'Saving...' : 'Publish Now'}
        </button>
        <button onClick={() => save(false)} disabled={saving}
          className="flex items-center gap-2 border border-[#E8E8E8] hover:border-[#0D0D0D] bg-white text-[#0D0D0D] font-bold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save as Draft'}
        </button>
        <Link href="/admin/blog" className="text-[#6B6B6B] text-sm hover:text-[#0D0D0D] transition-colors ml-auto">
          Cancel
        </Link>
      </div>

      <style jsx>{`
        .label-field { display: block; font-size: 0.7rem; font-weight: 700; color: #6B6B6B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.375rem; }
        .input-field { width: 100%; border: 1px solid #E8E8E8; border-radius: 0.75rem; padding: 0.625rem 0.875rem; font-size: 0.875rem; transition: border-color 0.15s; outline: none; }
        .input-field:focus { border-color: #FF6F00; }
      `}</style>
    </div>
  );
}
