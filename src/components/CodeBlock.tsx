import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = 'bash', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Simple syntax highlighting for bash
  const highlightCode = (text: string) => {
    if (language !== 'bash') return text;
    
    return text
      .split('\n')
      .map((line) => {
        // Comments
        if (line.trim().startsWith('#')) {
          return `<span style="color:var(--code-comment)">${line}</span>`;
        }
        // Commands with $ prefix
        if (line.includes('$')) {
          const parts = line.split('$');
          return `<span style="color:var(--accent)">$</span>${parts[1] || ''}`;
        }
        // Success messages
        if (line.includes('✓')) {
          return `<span style="color:var(--code-comment)">${line}</span>`;
        }
        return line;
      })
      .join('\n');
  };

  const ariaLabel = filename 
    ? `Code block: ${filename}` 
    : 'Code block';

  return (
    <div
      className="rounded-[calc(var(--radius)+4px)] overflow-hidden"
      style={{
        border: '1px solid var(--border-strong)',
        backgroundColor: 'var(--code-bg)',
      }}
      role="region"
      aria-label={ariaLabel}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 py-3 px-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <span className="w-[11px] h-[11px] rounded-full bg-red-400" aria-hidden="true" />
        <span className="w-[11px] h-[11px] rounded-full bg-yellow-400" aria-hidden="true" />
        <span className="w-[11px] h-[11px] rounded-full bg-green-400" aria-hidden="true" />
        {filename && (
          <span className="ml-2.5 font-mono text-xs" style={{ color: 'var(--code-comment)' }}>
            {filename}
          </span>
        )}
        <button
          onClick={copyToClipboard}
          className="ml-auto p-1 rounded cursor-pointer transition-colors"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: copied ? 'var(--accent)' : 'var(--code-comment)',
          }}
          aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
          aria-live="polite"
        >
          {copied ? (
            <Check size={14} aria-hidden="true" />
          ) : (
            <Copy size={14} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Code */}
      <pre 
        className="m-0 p-5 font-mono text-sm leading-loose overflow-x-auto" 
        style={{ color: 'var(--code-text)' }}
        tabIndex={0}
      >
        <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
      </pre>
    </div>
  );
}
