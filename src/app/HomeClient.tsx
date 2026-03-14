'use client';

import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { BlogPost } from '@/types';
import { CategoryGroup } from '@/lib/favorites';
import { HeroSection } from '@/components/home/HeroSection';
import { RecentLogs } from '@/components/home/RecentLogs';
import { AboutSection } from '@/components/home/AboutSection';
import { FavoritesSection } from '@/components/home/FavoritesSection';

interface HomeClientProps {
  posts: BlogPost[];
  favorites: CategoryGroup[];
}

export const HomeClient: React.FC<HomeClientProps> = ({ posts, favorites }) => {
  const searchParams = useSearchParams();
  const aboutRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);

  // hash 锚点滚动（#about / #favorites）
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#about' || hash === '#favorites') {
      const scrollAttempt = () => {
        const targetEl = hash === '#about'
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
  }, [searchParams]);

  if (!posts.length) {
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

  const latestPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <HeroSection latestPost={latestPost} />
      <RecentLogs posts={otherPosts} />
      <div ref={aboutRef}>
        <AboutSection />
      </div>
      <div ref={favoritesRef}>
        <FavoritesSection favorites={favorites} />
      </div>
    </div>
  );
};
