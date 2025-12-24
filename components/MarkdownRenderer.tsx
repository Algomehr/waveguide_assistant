
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = "" }) => {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="my-4 rounded-lg overflow-hidden border border-slate-700 shadow-lg">
                <div className="bg-slate-800 px-4 py-1 text-[10px] text-slate-400 font-mono uppercase flex justify-between items-center border-b border-slate-700">
                  <span>{match[1]}</span>
                  <span className="opacity-50">Code Block</span>
                </div>
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, padding: '1rem', fontSize: '0.85rem' }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={`${className} bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-sm`} {...props}>
                {children}
              </code>
            );
          },
          // Ensure math blocks are centered and styled correctly
          p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
          h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-6 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold text-cyan-400 mt-5 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold text-slate-200 mt-4 mb-2">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
          blockquote: ({ children }) => <blockquote className="border-r-4 border-cyan-500 bg-cyan-500/5 p-4 my-4 italic rounded-l-lg">{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
