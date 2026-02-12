import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SkewButtonProps {
  to: string;
  children: React.ReactNode;
  isActive?: boolean;
}

/** P3R 标志性斜切按钮：容器 -skew-x-12，内部文字 skew-x-12 反向抵消 */
export const SkewButton: React.FC<SkewButtonProps> = ({ to, children, isActive }) => {
  const location = useLocation();
  const active = isActive !== undefined ? isActive : location.pathname === to;

  return (
    <Link to={to} className="relative group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p3cyan focus-visible:ring-offset-2 focus-visible:ring-offset-p3dark">
      {/* 斜切背景层 */}
      <div
        className={`
          absolute inset-0 transform -skew-x-12 transition-all duration-300
          border
          ${active ? 'bg-white border-white' : 'bg-transparent border-white/40 hover:bg-p3blue/50'}
        `}
      />

      {/* 文字层（反向斜切保持水平） */}
      <div className="relative px-5 py-1.5">
        <span
          className={`
            font-display text-base tracking-wider transform skew-x-12 block
            transition-colors duration-300
            ${active ? 'text-p3dark font-bold' : 'text-white group-hover:text-p3cyan'}
          `}
        >
          {children}
        </span>
      </div>

      {/* 激活态装饰菱形点 */}
      {active && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-p3cyan rotate-45 animate-pulse" />
      )}
    </Link>
  );
};