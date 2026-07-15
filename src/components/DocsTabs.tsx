import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { ChevronRight, FileText, ExternalLink } from 'lucide-react';

interface DocItem {
  title: string;
  description: string;
  href: string;
}

interface DocSection {
  name: string;
  items: DocItem[];
}

interface DocsTabsProps {
  /** Documentation groups for the page's locale, selected server-side. */
  sections: DocSection[];
}

export function DocsTabs({ sections }: DocsTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = (i: number) => {
    setActiveTab(i);
    tabRefs.current[i]?.focus();
  };

  // WAI-ARIA tabs keyboard pattern: arrows move + activate, Home/End jump.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = sections.length;
    let next: number | null = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (activeTab + 1) % n;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (activeTab - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next !== null) {
      e.preventDefault();
      focusTab(next);
    }
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 items-start"
      role="region"
      aria-label="Documentation sections"
    >
      {/* Tabs */}
      <div
        className="flex flex-col gap-2"
        role="tablist"
        aria-label="Documentation categories"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
      >
        {sections.map((section, i) => {
          const isActive = activeTab === i;

          return (
            <button
              key={i}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              onClick={() => setActiveTab(i)}
              tabIndex={isActive ? 0 : -1}
              className="flex items-center justify-between gap-2.5 text-left cursor-pointer font-heading font-semibold text-base rounded-[var(--radius)] transition-all"
              style={{
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                backgroundColor: isActive ? 'var(--accent-soft)' : 'var(--surface)',
                color: isActive ? 'var(--accent-ink)' : 'var(--text)',
                padding: '15px 18px',
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`docs-panel-${i}`}
              id={`docs-tab-${i}`}
              aria-label={`${section.name} documentation`}
            >
              {section.name}
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {/* Articles — all panels rendered so every aria-controls resolves; inactive hidden */}
      <div>
        {sections.map((section, i) => (
          <div
            key={i}
            className="rounded-[var(--radius)] p-2.5 min-h-[240px]"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
            role="tabpanel"
            id={`docs-panel-${i}`}
            aria-labelledby={`docs-tab-${i}`}
            hidden={activeTab !== i}
            tabIndex={0}
          >
            <ul className="list-none p-0 m-0">
              {section.items.map((item, j) => (
                <li key={j}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center no-underline rounded-[calc(var(--radius)-2px)] transition-colors"
                    style={{
                      color: 'var(--text)',
                      gap: '13px',
                      padding: '14px 16px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    aria-label={`Read ${item.title} (opens in new tab)`}
                  >
                    <FileText size={17} strokeWidth={1.8} className="flex-none" style={{ color: 'var(--accent-ink)' }} aria-hidden="true" />
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold" style={{ fontSize: '15.5px' }}>{item.title}</span>
                      <span className="block mt-0.5" style={{ fontSize: '13px', color: 'var(--muted)' }}>{item.description}</span>
                    </span>
                    <ExternalLink size={15} strokeWidth={1.8} className="flex-none" style={{ color: 'var(--muted)' }} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
