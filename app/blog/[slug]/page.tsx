import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const tagColors: Record<string, string> = {
  Education: '#1D4ED8', Events: '#0369A1', Cultural: '#FF6F00', Spiritual: '#B45309',
  Community: '#0D0D0D', 'Women Empowerment': '#BE185D', Youth: '#0F766E',
  Milestones: '#2D6A4F', General: '#6B6B6B',
};

function readTime(content: string) {
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderContent(text: string) {
  return text.split('\n\n').filter(Boolean).map((block, i) => {
    if (block.startsWith('## ')) {
      return (
        <div key={i} className="mt-10">
          <h2 className="text-xl font-bold text-[#0D0D0D] mb-3 flex items-center gap-3">
            <span className="w-6 h-0.5 bg-[#FF6F00] shrink-0" style={{ transform: 'skewX(-12deg)' }} />
            {block.slice(3)}
          </h2>
        </div>
      );
    }
    return <p key={i} className="text-[#3D3D3D] leading-[1.85] text-base mt-5">{block}</p>;
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single();

  if (!post) notFound();

  const p = post as BlogPost;
  const tagColor = tagColors[p.category] ?? '#0D0D0D';

  const { data: allPosts } = await supabase
    .from('blog_posts')
    .select('id, slug, title')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false });

  const posts = (allPosts ?? []) as Pick<BlogPost, 'id' | 'slug' | 'title'>[];
  const idx = posts.findIndex(pp => pp.slug === slug);
  const prev = idx < posts.length - 1 ? posts[idx + 1] : null;
  const next = idx > 0 ? posts[idx - 1] : null;

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0D0D0D] pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%" viewBox="0 0 1440 500" fill="none" preserveAspectRatio="none">
            <line x1="0" y1="500" x2="1440" y2="0" stroke="#FF6F00" strokeWidth="1" />
            <line x1="0" y1="300" x2="800" y2="0" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: tagColor }}>
              {p.category}
            </span>
            <span className="flex items-center gap-1.5 text-white/30 text-xs">
              <Calendar size={11} /> {formatDate(p.published_at)}
            </span>
            <span className="flex items-center gap-1.5 text-white/30 text-xs">
              <Clock size={11} /> {readTime(p.content)}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">{p.title}</h1>
          {p.excerpt && (
            <p className="text-white/40 text-lg leading-relaxed border-l-2 border-[#FF6F00] pl-4">{p.excerpt}</p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <article className="prose prose-neutral max-w-none">
            {renderContent(p.content)}
          </article>

          {/* Author strip */}
          <div className="mt-16 border-t border-[#E8E8E8] pt-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FF6F00] flex items-center justify-center text-white font-black text-base shrink-0">
              {p.author?.[0]?.toUpperCase() || 'S'}
            </div>
            <div>
              <div className="font-bold text-[#0D0D0D] text-sm">{p.author || 'Dr. Madhiraj Sairathan'}</div>
              <div className="text-[#6B6B6B] text-xs">Social Innovator · Founder, Sunny Anna Yuvasena</div>
            </div>
          </div>
        </div>
      </section>

      {/* Prev / Next */}
      {(prev || next) && (
        <section className="py-12 px-4 bg-[#F5F5F5] border-t border-[#E8E8E8]">
          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
            {prev && (
              <Link href={`/blog/${prev.slug}`}
                className="group border border-[#E8E8E8] bg-white rounded-2xl p-5 hover:border-[#FF6F00] transition-all">
                <div className="flex items-center gap-2 text-[#6B6B6B] text-xs mb-2"><ArrowLeft size={12} /> Previous</div>
                <div className="font-bold text-[#0D0D0D] text-sm leading-snug group-hover:text-[#FF6F00] transition-colors">{prev.title}</div>
              </Link>
            )}
            {next && (
              <Link href={`/blog/${next.slug}`}
                className={`group border border-[#E8E8E8] bg-white rounded-2xl p-5 hover:border-[#FF6F00] transition-all ${!prev ? 'sm:col-start-2' : ''}`}>
                <div className="flex items-center justify-end gap-2 text-[#6B6B6B] text-xs mb-2">Next <ArrowRight size={12} /></div>
                <div className="font-bold text-[#0D0D0D] text-sm leading-snug text-right group-hover:text-[#FF6F00] transition-colors">{next.title}</div>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Back CTA */}
      <section className="py-16 px-4 bg-white text-center">
        <Link href="/blog"
          className="inline-flex items-center gap-2 border-2 border-[#0D0D0D] text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white font-bold px-8 py-4 rounded-full transition-all">
          <ArrowLeft size={16} /> All Posts
        </Link>
      </section>
    </div>
  );
}
