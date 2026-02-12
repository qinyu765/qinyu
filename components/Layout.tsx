import React, { useState, useEffect } from "react";
import { NavItem } from "../types";
import { NAV_ITEMS } from "../constants";
import { SkewButton } from "./ui/SkewButton";
import { BackgroundEffect } from "./ui/BackgroundEffect";
import { HamburgerMenu, HamburgerButton } from "./ui/HamburgerMenu";
import { Logo } from "./ui/Logo";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Menu } from "lucide-react";

export const Layout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  // 路由变化时自动关闭移动端菜单
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // 下滑隐藏顶栏、上滑或到顶时显示
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHeaderVisible(y < lastY || y < 10);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 菜单打开时锁定 body 滚动
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Escape 键关闭菜单
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen relative font-body text-white selection:bg-p3cyan selection:text-black">
      <BackgroundEffect />

      {/* 固定顶栏：pointer-events-none 使顶栏不阻挡内容点击，子元素各自恢复 pointer-events */}
      <header className={`fixed top-0 left-0 right-0 z-50 py-3 px-6 flex items-center pointer-events-none transition-transform duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="pointer-events-auto">
          <Logo size={36} />
        </div>

        {/* 桌面端居中导航 */}
        <nav className="hidden md:flex pointer-events-auto items-center space-x-4 absolute left-1/2 -translate-x-1/2">
          {NAV_ITEMS.map((item) => (
            <SkewButton key={item.path} to={item.path}>
              {item.label}
            </SkewButton>
          ))}
        </nav>

        {/* 移动端汉堡按钮 */}
        <div className="md:hidden absolute right-6 pointer-events-auto">
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
        {/* 面包屑路径指示器 */}
        <div className="mb-8 flex items-center space-x-2 text-p3cyan text-sm font-bold uppercase tracking-widest border-b border-p3cyan/30 pb-2 w-fit">
          <Menu size={16} />
          <Link to="/" className="hover:text-white transition-colors">
            SYSTEM
          </Link>
          <span>//</span>
          {location.pathname === "/" ? (
            <span>ROOT</span>
          ) : (
            location.pathname
              .substring(1)
              .split("/")
              .map((segment, i, arr) => {
                const path = "/" + arr.slice(0, i + 1).join("/");
                return (
                  <React.Fragment key={path}>
                    {i > 0 && <span>/</span>}
                    <Link
                      to={path}
                      className="hover:text-white transition-colors"
                    >
                      {decodeURIComponent(segment).toUpperCase()}
                    </Link>
                  </React.Fragment>
                );
              })
          )}
        </div>

        <Outlet />
      </main>

      <div className="fixed bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-p3blue to-p3cyan z-40" />
    </div>
  );
};
