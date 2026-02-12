import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

/**
 * Markdown 渲染器：覆写 react-markdown 各元素为 P3R 主题样式
 * h2 带左侧斜切装饰条、blockquote 带蓝色左边框、code block 带 cyan 左边框等
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-4xl md:text-5xl font-display font-bold italic text-p3cyan mb-6 mt-8 border-b-2 border-white/20 pb-4"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <div className="flex items-center space-x-4 mt-8 mb-4">
              <div className="w-2 h-8 bg-p3blue transform -skew-x-12" />
              <h2
                className="text-2xl font-bold text-white uppercase tracking-wider"
                {...props}
              />
            </div>
          ),
          p: ({ node, ...props }) => (
            <p
              className="text-p3white leading-loose mb-4 text-base"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-outside ml-6 mb-6 space-y-2 text-p3white marker:text-p3blue"
              {...props}
            />
          ),
          li: ({ node, ...props }) => <li className="pl-2" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-p3blue bg-p3blue/10 p-4 my-6 text-white/90"
              {...props}
            />
          ),
          code: ({ node, inline, ...props }: any) => {
            return (
              <code
                className="bg-p3dark/60 text-p3cyan font-mono px-2 py-1 text-sm"
                {...props}
              />
            );
          },
          // pre 内嵌的 code 需重置样式（通过 [&_code] 选择器覆盖 inline code 样式）
          pre: ({ node, ...props }) => (
            <pre
              className="bg-p3dark p-4 border-l-4 border-p3cyan border border-white/10 overflow-x-auto my-6 text-sm [&_code]:text-white [&_code]:bg-transparent [&_code]:p-0 [&_code]:border-0"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table
                className="w-full border-collapse border border-white/20 text-sm"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-p3blue/30" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-white/20 px-4 py-2 text-left text-white font-bold uppercase tracking-wider"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="border border-white/20 px-4 py-2 text-p3white"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
