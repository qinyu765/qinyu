'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { SkewButton } from '@/components/ui/SkewButton';
import { BackgroundEffect } from '@/components/ui/BackgroundEffect';
import { HamburgerMenu, HamburgerButton } from '@/components/ui/HamburgerMenu';
import { Search } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'HOME', path: '/' },
  { label: 'BLOG', path: '/blog' },
  { label: 'ABOUT', path: '/#about' },
  { label: 'FAVORITES', path: '/#favorites' },
];

export const LayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense>
      <LayoutShellInner>{children}</LayoutShellInner>
    </Suspense>
  );
};

const LayoutShellInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isSearchActive = pathname === '/blog' && searchParams.get('search') === '1';

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen relative font-body text-white selection:bg-p3cyan selection:text-black overflow-x-hidden">
      <BackgroundEffect />

      {/* 固定顶栏 */}
      <header
        className="fixed top-0 left-0 right-0 z-50 py-2 pb-8 px-4 md:px-8 flex items-center bg-p3black/60 backdrop-blur-md backdrop-saturate-150"
        style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)' }}
      >
        {/* 左侧 Logo + 状态指示器 */}
        <div className="hidden md:flex flex-1 min-w-0 items-center space-x-2 text-sm font-mono text-p3cyan tracking-wider">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Logo" className="h-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          </Link>
          <span className="text-p3blue"> ❯❯  </span>
          <Link href="/" className="hover:text-white transition-colors">
            SYSTEM
          </Link>
          <span>//</span>
          {pathname === '/' ? (
            <span>ROOT</span>
          ) : (
            pathname
              .substring(1)
              .split('/')
              .map((segment, i, arr) => {
                const path = '/' + arr.slice(0, i + 1).join('/');
                return (
                  <React.Fragment key={path}>
                    {i > 0 && <span>/</span>}
                    <Link
                      href={path}
                      className="hover:text-white transition-colors"
                    >
                      {decodeURIComponent(segment).toUpperCase()}
                    </Link>
                  </React.Fragment>
                );
              })
          )}
        </div>

        {/* 桌面端右侧导航 */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center justify-end gap-2"
        >
          {NAV_ITEMS.map((item) => (
            <SkewButton key={item.path} href={item.path}>
              {item.label}
            </SkewButton>
          ))}
          <div className="ml-10">
            <SkewButton href="/blog?search=1" hoverActive isActive={isSearchActive}>
              <span className="flex items-center gap-1.5"><Search size={14} />Search</span>
            </SkewButton>
          </div>
        </nav>

        {/* 移动端 Logo */}
        <div className="md:hidden flex items-center">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Logo" className="h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          </Link>
        </div>

        {/* 移动端汉堡按钮 */}
        <div className="md:hidden absolute right-4">
          <HamburgerButton
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </header>

      {/* 移动端侧滑菜单 */}
      <HamburgerMenu
        isOpen={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen(false)}
        navItems={NAV_ITEMS}
      />

      <main className="md:pt-20 pt-16 pb-20 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto min-h-screen flex flex-col relative z-10">
        {children}
      </main>
    </div>
  );
};
