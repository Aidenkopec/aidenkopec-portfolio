'use client';

import { motion } from 'framer-motion';

interface BlogContentProps {
  children: React.ReactNode;
}

export function BlogContent({ children }: BlogContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="prose prose-lg prose-invert max-w-none"
    >
      <article className="blog-content">
        {children}
      </article>
      
      <style jsx global>{`
        .blog-content {
          /* Override prose styles to match your theme */
        }
        
        .blog-content h1,
        .blog-content h2,
        .blog-content h3,
        .blog-content h4,
        .blog-content h5,
        .blog-content h6 {
          color: var(--white-100);
          font-weight: 700;
        }
        
        .blog-content p {
          color: var(--secondary-color);
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }
        
        .blog-content a {
          color: var(--text-color-variable);
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .blog-content a:hover {
          text-decoration: underline;
          color: var(--text-color-variable);
        }
        
        .blog-content code {
          background-color: var(--black-100);
          color: var(--text-color-variable);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: var(--font-mono);
        }
        
        .blog-content pre {
          background-color: var(--black-100);
          border: 1px solid var(--tertiary-color);
          border-radius: 0.5rem;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 2rem 0;
        }
        
        .blog-content pre code {
          background: none;
          padding: 0;
          color: var(--white-100);
        }
        
        .blog-content blockquote {
          border-left: 4px solid var(--text-color-variable);
          background-color: var(--black-100);
          padding: 1rem 1.5rem;
          margin: 2rem 0;
          border-radius: 0 0.5rem 0.5rem 0;
          font-style: italic;
        }
        
        .blog-content blockquote p {
          color: var(--secondary-color);
          margin-bottom: 0;
        }
        
        .blog-content ul,
        .blog-content ol {
          color: var(--secondary-color);
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        
        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          border: 1px solid var(--tertiary-color);
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .blog-content th {
          background-color: var(--black-100);
          color: var(--white-100);
          font-weight: 600;
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid var(--tertiary-color);
        }
        
        .blog-content td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--tertiary-color);
          color: var(--secondary-color);
        }
        
        .blog-content img {
          border-radius: 0.5rem;
          margin: 2rem 0;
          width: 100%;
          height: auto;
        }
        
        .blog-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--text-color-variable),
            transparent
          );
          margin: 3rem 0;
        }
        
        /* Syntax highlighting adjustments */
        .blog-content .token.comment,
        .blog-content .token.prolog,
        .blog-content .token.doctype,
        .blog-content .token.cdata {
          color: #6272a4;
        }
        
        .blog-content .token.punctuation {
          color: #f8f8f2;
        }
        
        .blog-content .token.property,
        .blog-content .token.tag,
        .blog-content .token.constant,
        .blog-content .token.symbol,
        .blog-content .token.deleted {
          color: #ff79c6;
        }
        
        .blog-content .token.boolean,
        .blog-content .token.number {
          color: #bd93f9;
        }
        
        .blog-content .token.selector,
        .blog-content .token.attr-name,
        .blog-content .token.string,
        .blog-content .token.char,
        .blog-content .token.builtin,
        .blog-content .token.inserted {
          color: #50fa7b;
        }
        
        .blog-content .token.operator,
        .blog-content .token.entity,
        .blog-content .token.url,
        .blog-content .language-css .token.string,
        .blog-content .style .token.string,
        .blog-content .token.variable {
          color: #f8f8f2;
        }
        
        .blog-content .token.atrule,
        .blog-content .token.attr-value,
        .blog-content .token.function,
        .blog-content .token.class-name {
          color: #f1fa8c;
        }
        
        .blog-content .token.keyword {
          color: #8be9fd;
        }
        
        .blog-content .token.regex,
        .blog-content .token.important {
          color: #ffb86c;
        }
      `}</style>
    </motion.div>
  );
}