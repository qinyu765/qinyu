import React from 'react';
import { Link } from 'react-router-dom';
import { TOPICS } from '../constants';
import { BookOpen } from 'lucide-react';

export const TopicList: React.FC = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="mb-12">
      <h1 className="text-6xl md:text-8xl font-display font-black uppercase italic text-white leading-none">
        OPERATIONS
      </h1>
      <div className="flex items-center gap-3 mt-4">
        <div className="w-12 h-1 bg-p3cyan -skew-x-12" />
        <p className="text-p3mid text-sm font-mono tracking-widest uppercase">Series / Topics</p>
      </div>
    </div>

    {TOPICS.length === 0 ? (
      <div className="text-center py-20">
        <p className="text-p3mid text-lg font-mono">NO RECORDS FOUND</p>
        <p className="text-white/30 text-sm mt-2">Topics will appear here once created.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TOPICS.map((topic) => (
          <Link
            key={topic.meta.slug}
            to={`/topics/${topic.meta.slug}`}
            className="group block border-l-4 border-white hover:border-p3cyan bg-white/5 hover:bg-white/[0.08] transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-p3cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {topic.meta.coverImage && (
              <div className="relative h-40 overflow-hidden">
                <img src={topic.meta.coverImage} alt={topic.meta.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
            )}

            <div className="p-6 relative">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-xl font-bold text-white group-hover:text-p3cyan transition-colors uppercase tracking-wide">
                  {topic.meta.title}
                </h2>
                <span className="flex-shrink-0 bg-p3red text-white text-xs font-mono px-2 py-1 flex items-center gap-1">
                  <BookOpen size={12} />
                  {topic.posts.length}
                </span>
              </div>

              <p className="text-p3mid text-sm leading-relaxed mb-4 line-clamp-2">
                {topic.meta.description}
              </p>

              {topic.meta.tags && topic.meta.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {topic.meta.tags.map((tag) => (
                    <span key={tag} className="inline-block -skew-x-12 border border-p3mid/30 px-2 py-0.5">
                      <span className="inline-block skew-x-12 text-p3mid text-xs font-mono">{tag}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    )}
  </div>
);
