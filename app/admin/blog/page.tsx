'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';

type BlogPost = {
  id: number; title: string; slug: string; excerpt: string;
  category: string; author: string; published_at: string | null;
};

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sunnyannaadmin2025';
const adminHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-token': typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '',
});

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetch('/api/blog', { headers: adminHeaders() })
      .then(r => r.json())
      .then(d => { setPosts(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const togglePublish = async (post: BlogPost) => {
    const publish = !post.published_at;
    const res = await fetch(`/api/blog/${post.id}`, {
      method: 'PUT',
      headers: adminHeaders(),
      body: JSON.stringify({ publish }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPosts(prev => prev.map(p => p.id === post.id ? updated : p));
    }
  };

  const deletePost = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    const res = await fetch(`/api/blog/${post.id}`, { method: 'DELETE', headers: adminHeaders() });
    if (res.ok) setPosts(prev => prev.filter(p => p.id !== post.id));
  };

  const visible = posts.filter(p =>
    filter === 'all' ? true : filter === 'published' ? !!p.published_at : !p.published_at
  );

  const catColors: Record<string, string> = {
    Education: '#1D4ED8', Events: '#0369A1', Cultural: '#FF6F00', Community: '#0D0D0D',
    'Women Empowerment': '#BE185D', Youth: '#0F766E', Milestones: '#2D6A4F', General: '#6B6B6B',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#0D0D0D]">Blog Posts</h1>
          <p className="text-[#6B6B6B] text-sm mt-0.5">{posts.length} total · {posts.filter(p => !!p.published_at).length} published</p>
        </div>
        <Link href="/admin/blog/new" className="flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
          <Plus size={15} /> New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'published', 'draft'] as const).map(f => (
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
          <div className="text-[#6B6B6B] text-sm">No posts found.{' '}
            <Link href="/admin/blog/new" className="text-[#FF6F00] font-semibold hover:underline">Create one →</Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden">
          {visible.map((post, i) => (
            <div key={post.id} className={`flex items-center gap-4 p-5 ${i < visible.length - 1 ? 'border-b border-[#E8E8E8]' : ''}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                    style={{ backgroundColor: catColors[post.category] ?? '#6B6B6B' }}
                  >{post.category}</span>
                  {post.published_at ? (
                    <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      Published {new Date(post.published_at).toLocaleDateString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Draft</span>
                  )}
                </div>
                <h3 className="font-bold text-[#0D0D0D] text-sm truncate">{post.title}</h3>
                {post.excerpt && <p className="text-[#6B6B6B] text-xs mt-0.5 line-clamp-1">{post.excerpt}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {post.published_at && (
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener"
                    className="p-2 rounded-lg border border-[#E8E8E8] hover:border-[#FF6F00] text-[#6B6B6B] hover:text-[#FF6F00] transition-all" title="View live">
                    <ExternalLink size={13} />
                  </a>
                )}
                <button onClick={() => togglePublish(post)}
                  className="p-2 rounded-lg border border-[#E8E8E8] hover:border-[#FF6F00] text-[#6B6B6B] hover:text-[#0D0D0D] transition-all"
                  title={post.published_at ? 'Unpublish' : 'Publish'}>
                  {post.published_at ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <Link href={`/admin/blog/${post.id}`}
                  className="p-2 rounded-lg border border-[#E8E8E8] hover:border-[#FF6F00] text-[#6B6B6B] hover:text-[#0D0D0D] transition-all" title="Edit">
                  <Edit2 size={13} />
                </Link>
                <button onClick={() => deletePost(post)}
                  className="p-2 rounded-lg border border-[#E8E8E8] hover:border-red-400 text-[#6B6B6B] hover:text-red-500 transition-all" title="Delete">
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
