import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl md:text-5xl font-display font-bold italic text-p3cyan mb-6 mt-8 border-b-2 border-white/20 pb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <div className="flex items-center space-x-4 mt-8 mb-4">
              <div className="w-2 h-8 bg-p3blue transform -skew-x-12" />
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider" {...props} />
            </div>
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-300 leading-loose mb-4 text-base" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-gray-300 marker:text-p3blue" {...props} />
          ),
          li: ({ node, ...props }) => (
             <li className="pl-2" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-p3cyan bg-p3blue/10 p-4 my-6 text-white/90" {...props} />
          ),
          code: ({ node, ...props }) => { // Correctly destructing props to separate inline from others if needed (though types might vary based on react-markdown version, simple pass-through usually works)
            return (
              <code className="bg-black/50 text-p3cyan font-mono px-2 py-1 rounded text-sm" {...props} />
            )
          },
          pre: ({ node, ...props }) => (
            <pre className="bg-p3dark p-4 rounded-md border border-white/10 overflow-x-auto my-6 text-sm" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-white/20 text-sm" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-p3blue/30" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-white/20 px-4 py-2 text-left text-p3cyan font-bold uppercase tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-white/20 px-4 py-2 text-gray-300" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};