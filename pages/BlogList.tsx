import React, { useState, useDeferredValue, useMemo } from "react";
import { Link } from "react-router-dom";
import { BLOG_POSTS } from "../constants";
import { Search, X } from "lucide-react";
import Fuse from "fuse.js";

const fuse = new Fuse(BLOG_POSTS, {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "excerpt", weight: 0.35 },
    { name: "category", weight: 0.15 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

export const BlogList: React.FC = () => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());

  const filteredPosts = useMemo(() => {
    if (!deferredQuery) return BLOG_POSTS;
    return fuse.search(deferredQuery).map((r) => r.item);
  }, [deferredQuery]);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <h1 className="text-6xl font-display font-black italic mb-12 text-white/20">
        ARCHIVE
      </h1>

      {/* 搜索栏 */}
      <div className="mb-10 max-w-lg">
        <div className="relative transform -skew-x-12 border border-p3cyan/60 bg-black/50 hover:border-p3cyan transition-colors">
          <div className="flex items-center px-5 py-3 skew-x-12">
            <Search size={18} className="text-p3cyan shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="> SEARCH ARCHIVES..."
              className="w-full bg-transparent border-none outline-none text-p3cyan font-mono placeholder-p3cyan/40 ml-3 text-sm"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear search" className="text-white/40 hover:text-white transition-colors shrink-0">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p3cyan focus-visible:ring-offset-2 focus-visible:ring-offset-p3dark"
            >
              <div className="absolute inset-0 bg-p3blue transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />

              <div className="relative z-10 flex items-center p-6 border-b border-white/20 group-hover:border-transparent transition-colors">
                <div className="font-mono text-p3cyan text-lg w-32 shrink-0">
                  {post.date}
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold uppercase group-hover:text-white transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-p3mid/70 group-hover:text-white/80 line-clamp-1">
                    {post.excerpt}
                  </p>
                </div>
                <div className="text-4xl font-display italic text-white/10 group-hover:text-white/30 transition-colors">
                  {(index + 1).toString().padStart(2, "0")}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="text-3xl font-display italic text-white/20 mb-4">NO RECORDS FOUND</div>
            <div className="w-3 h-3 bg-p3cyan mx-auto animate-spin rotate-45" />
          </div>
        )}
      </div>
    </div>
  );
};
