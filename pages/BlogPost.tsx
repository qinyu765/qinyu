import React, { useState, useCallback } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import Giscus from '@giscus/react';
import { estimateReadingTime } from '../lib/reading-time';
import { ChevronLeft, ChevronRight, Share2 } from 'lucide-react';

export const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postIndex = BLOG_POSTS.findIndex((p) => p.id === id);
  const post = postIndex !== -1 ? BLOG_POSTS[postIndex] : undefined;
  // 按日期排序的前/后文章（用于底部翻页导航）
  const prevPost = postIndex > 0 ? BLOG_POSTS[postIndex - 1] : undefined;
  const nextPost = postIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[postIndex + 1] : undefined;

  const [shareMsg, setShareMsg] = useState('');

  // 分享：优先 Web Share API，不支持则回退到剪贴板复制
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setShareMsg('Link copied!');
      setTimeout(() => setShareMsg(''), 2000);
    }
  }, [post?.title]);

  if (!post) {
    return <Navigate to="/" replace />;
  }

  return (
    <article className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 顶部导航栏：返回按钮 + 分享按钮 */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/blog" className="group flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-p3cyan transition-colors">
           <div className="bg-white/10 p-2 transform -skew-x-12 group-hover:bg-p3cyan group-hover:text-black transition-colors">
             <div className="transform skew-x-12">
               <ChevronLeft size={16} />
             </div>
           </div>
           <span>Return to Base</span>
        </Link>
        <div className="relative">
          <button onClick={handleShare} className="text-white/60 hover:text-white transition-colors" aria-label="Share this post">
             <Share2 size={20} />
          </button>
          {shareMsg && (
            <span className="absolute -bottom-8 right-0 text-xs text-p3cyan whitespace-nowrap">{shareMsg}</span>
          )}
        </div>
      </div>

      {/* 文章头部：日期、分类、标题、封面图 */}
      <header className="mb-8 relative">
         <div className="absolute -left-4 md:-left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-p3cyan via-p3blue to-transparent" />

         <div className="flex flex-wrap gap-4 text-xs font-mono text-p3cyan mb-4">
            <span className="border border-p3cyan px-2 py-1">{post.date}</span>
            <span className="bg-p3blue text-white px-2 py-1">{post.category}</span>
            <span className="border border-white/20 text-p3mid px-2 py-1">{estimateReadingTime(post.content)} MIN READ</span>
         </div>

         <h1 className="text-4xl md:text-6xl font-display font-black uppercase italic leading-tight mb-8">
            {post.title}
         </h1>

         {post.coverImage && (
           <div className="relative w-full aspect-[21/9] overflow-hidden border-2 border-white/20">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] to-transparent opacity-80" />
           </div>
         )}
      </header>

      {/* 正文内容区 */}
      <div className="bg-black p-8 md:p-12 border border-white/5 relative overflow-hidden">
         {/* 右上角装饰三角 */}
         <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/10 to-transparent transform rotate-45 translate-x-8 -translate-y-8" />

         <MarkdownRenderer content={post.content} />
      </div>

      {/* 评论区 */}
      {import.meta.env.VITE_GISCUS_REPO_ID && import.meta.env.VITE_GISCUS_REPO_ID !== 'your-repo-id' && (
        <div className="mt-12 border border-white/10 p-6">
          <Giscus
            key={post.id}
            repo={import.meta.env.VITE_GISCUS_REPO as `${string}/${string}`}
            repoId={import.meta.env.VITE_GISCUS_REPO_ID}
            category={import.meta.env.VITE_GISCUS_CATEGORY}
            categoryId={import.meta.env.VITE_GISCUS_CATEGORY_ID}
            mapping="specific"
            term={post.id}
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="dark_dimmed"
            lang="zh-CN"
          />
        </div>
      )}

      {/* 底部前后文章导航 */}
      <div className="mt-16 pt-8 border-t border-white/10">
         <div className="text-center mb-8">
            <p className="text-sm text-p3mid/50 mb-2">END OF RECORD</p>
            <div className="w-2 h-2 bg-p3cyan transform rotate-45 mx-auto animate-pulse" />
         </div>

         <div className="flex justify-between items-stretch gap-4">
            {prevPost ? (
              <Link to={`/blog/${prevPost.id}`} className="group flex items-center space-x-3 text-sm text-white/50 hover:text-p3cyan transition-colors">
                <ChevronLeft size={16} />
                <div>
                  <div className="text-xs uppercase tracking-widest mb-1">Prev</div>
                  <div className="font-bold uppercase">{prevPost.title}</div>
                </div>
              </Link>
            ) : <div />}

            {nextPost ? (
              <Link to={`/blog/${nextPost.id}`} className="group flex items-center space-x-3 text-sm text-white/50 hover:text-p3cyan transition-colors text-right">
                <div>
                  <div className="text-xs uppercase tracking-widest mb-1">Next</div>
                  <div className="font-bold uppercase">{nextPost.title}</div>
                </div>
                <ChevronRight size={16} />
              </Link>
            ) : <div />}
         </div>
      </div>
    </article>
  );
};
