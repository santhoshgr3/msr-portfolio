'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { i18n } from '@/lib/i18n';

type BlogPost = {
  slug: string; title: string; excerpt: string; content: string;
  category: string; published_at: string;
};

const tagColors: Record<string, string> = {
  Education: '#1D4ED8', Events: '#0369A1', Cultural: '#FF6F00', Spiritual: '#B45309',
  Community: '#0D0D0D', 'Women Empowerment': '#BE185D', Youth: '#0F766E',
  Milestones: '#2D6A4F', General: '#6B6B6B',
};

function readTime(content: string) {
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPage() {
  const { lang } = useLanguage();
  const t = i18n[lang].blog;

  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch('/api/blog').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setPosts(data);
    }).catch(() => {});
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0D0D0D] pt-36 pb-28 px-4 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
          <rect x="0" y="0" width="1440" height="600" fill="url(#grid)" />
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
        </svg>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="rising-accent" />
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.heroBadge}</span>
            <span className="rising-accent" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            {t.heroTitle.split(' ')[0]} <span className="text-amber-gradient">{t.heroTitle.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-white/40 text-lg leading-relaxed max-w-xl mx-auto">{t.heroDesc}</p>
        </div>
      </section>

      {/* No posts */}
      {posts.length === 0 && (
        <section className="py-32 px-4 bg-white text-center">
          <p className="text-[#6B6B6B] text-lg">{t.noPosts}</p>
        </section>
      )}

      {/* Featured Post */}
      {featured && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.latestPost}</span>
            </div>
            <Link href={`/blog/${featured.slug}`} className="block group">
              <div className="bg-[#0D0D0D] rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-black/20 transition-all duration-500">
                <div className="h-1 bg-[#FF6F00]" />
                <div className="p-8 md:p-12">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: tagColors[featured.category] ?? '#FF6F00' }}>
                      {featured.category}
                    </span>
                    <time className="text-white/30 text-xs">{formatDate(featured.published_at)}</time>
                    <span className="text-white/20 text-xs">·</span>
                    <span className="text-white/30 text-xs">{readTime(featured.content)} {t.minRead}</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-white mb-4 group-hover:text-[#FF6F00] transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-white/40 leading-relaxed mb-6 max-w-2xl">{featured.excerpt}</p>
                  <div className="flex items-center gap-2 text-[#FF6F00] text-sm font-bold group-hover:gap-3 transition-all">
                    {t.readPost} <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Post grid */}
      {rest.length > 0 && (
        <section className="pb-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <span className="rising-accent" />
              <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.allPosts}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map(post => {
                const tagColor = tagColors[post.category] ?? '#0D0D0D';
                return (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    className="group border border-[#E8E8E8] rounded-2xl overflow-hidden hover:border-[#FF6F00] hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="h-1 shrink-0" style={{ backgroundColor: tagColor }} />
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                          style={{ backgroundColor: tagColor }}>
                          {post.category}
                        </span>
                        <time className="text-[#6B6B6B] text-[10px] truncate">{formatDate(post.published_at)}</time>
                      </div>
                      <h3 className="font-bold text-[#0D0D0D] text-sm mb-2.5 leading-snug group-hover:text-[#FF6F00] transition-colors flex-1">
                        {post.title}
                      </h3>
                      <p className="text-[#6B6B6B] text-xs leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6B6B6B] text-[10px]">{readTime(post.content)} {t.minRead}</span>
                        <div className="flex items-center gap-1 text-[#FF6F00] text-xs font-bold group-hover:gap-2 transition-all">
                          {t.readMore} <ArrowRight size={11} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 bg-[#F5F5F5] text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="rising-accent" />
            <span className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest">{t.ctaBadge}</span>
            <span className="rising-accent" />
          </div>
          <h2 className="text-2xl font-bold text-[#0D0D0D] mb-3">{t.ctaHeading}</h2>
          <p className="text-[#6B6B6B] text-sm mb-8">{t.ctaDesc}</p>
          <Link href="/community/join"
            className="inline-flex items-center justify-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105">
            {t.ctaBtn} <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
