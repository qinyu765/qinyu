import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { BLOG_POSTS } from "../constants";
import { useSEO } from "../lib/use-seo";
import { HeroSection } from "../components/home/HeroSection";
import { RecentLogs } from "../components/home/RecentLogs";
import { AboutSection } from "../components/home/AboutSection";
import { FavoritesSection } from "../components/home/FavoritesSection";

export const Home: React.FC = () => {
  useSEO({ title: '首页', description: 'HF 的技术博客 — 前端开发、React、TypeScript 技术分享与实践记录', path: '/' });
  const location = useLocation();
  const aboutRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);

  // hash 锚点滚动（#about / #favorites）
  useEffect(() => {
    if (location.hash === '#about' || location.hash === '#favorites') {
      const scrollAttempt = () => {
        const targetEl = location.hash === '#about'
          ? aboutRef.current?.querySelector('#about')
          : favoritesRef.current?.querySelector('#favorites');
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        } else {
          setTimeout(scrollAttempt, 50);
        }
      };
      setTimeout(scrollAttempt, 100);
    }
  }, [location.hash, location.pathname]);

  if (!BLOG_POSTS.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-display font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-p3mid">
          PERSONA
          <br />
          BLOG
        </h1>
        <p className="mt-8 text-xl text-p3cyan font-light tracking-widest">
          No records found in the archive.
        </p>
      </div>
    );
  }

  const latestPost = BLOG_POSTS[0];
  const otherPosts = BLOG_POSTS.slice(1);

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <HeroSection latestPost={latestPost} />
      <RecentLogs posts={otherPosts} />
      <div ref={aboutRef}>
        <AboutSection />
      </div>
      <div ref={favoritesRef}>
        <FavoritesSection />
      </div>
    </div>
  );
};
