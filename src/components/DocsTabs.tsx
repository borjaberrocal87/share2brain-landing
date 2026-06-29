import { useState } from 'react';
import { ChevronRight, FileText } from 'lucide-react';

interface DocSection {
  name: string;
  items: string[];
}

interface DocsTabsProps {
  sections: DocSection[];
}

export function DocsTabs({ sections }: DocsTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div 
      className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 items-start"
      role="region"
      aria-label="Documentation sections"
    >
      {/* Tabs */}
      <div 
        className="flex flex-col gap-2"
        role="tablist"
        aria-label="Documentation categories"
      >
        {sections.map((section, i) => {
          const isActive = activeTab === i;
          
          return (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
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

      {/* Articles */}
      <div
        className="rounded-[var(--radius)] p-2.5 min-h-[240px]"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
        role="tabpanel"
        id={`docs-panel-${activeTab}`}
        aria-labelledby={`docs-tab-${activeTab}`}
      >
        <ul className="list-none p-0 m-0">
          {sections[activeTab].items.map((item, i) => (
            <li key={i}>
              <a
                href="#"
                className="flex items-center no-underline font-medium rounded-[calc(var(--radius)-2px)] transition-colors"
                style={{ 
                  color: 'var(--text)',
                  gap: '13px',
                  padding: '15px 16px',
                  fontSize: '15.5px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--surface-2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label={`Read ${item}`}
              >
                <FileText size={17} strokeWidth={1.8} className="flex-none" style={{ color: 'var(--accent-ink)' }} aria-hidden="true" />
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
