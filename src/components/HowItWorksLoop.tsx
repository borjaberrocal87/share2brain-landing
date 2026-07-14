import { useState, useEffect, useCallback } from 'react';
import { Bot, Wrench, Eye } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { useLanguage } from '../i18n/useLanguage';
import type { Language } from '../i18n';

interface Step {
  k: string;
  d: string;
  label: string;
  code: string[];
}

interface LoopContent {
  steps: Step[];
  loopback: string;
  note: string;
}

interface HowItWorksLoopProps {
  es: LoopContent;
  en: LoopContent;
  initialLang?: Language;
}

export function HowItWorksLoop({ es, en, initialLang = 'es' }: HowItWorksLoopProps) {
  const lang = useLanguage(initialLang);
  const { steps, loopback, note } = lang === 'en' ? en : es;
  const [activeStep, setActiveStep] = useState(0);

  // Auto-advance steps every 2.2s (matching design)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [steps.length]);

  // Reset auto-advance when user clicks manually
  const handleStepClick = useCallback((i: number) => {
    setActiveStep(i);
  }, []);

  const icons = [Bot, Wrench, Eye];

  return (
    <ErrorBoundary name="HowItWorksLoop">
    <div className="flex flex-col gap-4" role="region" aria-label="How it works interactive demo">
      {/* Steps */}
      <div 
        className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4 max-w-[920px] mx-auto"
        role="tablist"
        aria-label="Process steps"
      >
        {steps.map((step, i) => {
          const Icon = icons[i];
          const isActive = activeStep === i;
          
          return (
            <button
              key={i}
              onClick={() => handleStepClick(i)}
              className="text-left cursor-pointer rounded-[var(--radius)] p-6 font-inherit transition-all"
              style={{
                color: 'var(--text)',
                backgroundColor: 'var(--surface)',
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                boxShadow: isActive ? '0 0 0 4px var(--accent-soft)' : 'none',
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`step-panel-${i}`}
              id={`step-tab-${i}`}
              aria-label={`Step ${i + 1}: ${step.k}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="flex w-[42px] h-[42px] clip-path-hex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--accent-soft)',
                    color: 'var(--accent-ink)',
                  }}
                  aria-hidden="true"
                >
                  <Icon size={21} strokeWidth={1.8} />
                </span>
                <span className="font-mono text-xs font-semibold" style={{ color: 'var(--muted)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-lg m-0">{step.k}</h3>
            </button>
          );
        })}
      </div>

      {/* Loopback indicator */}
      <div 
        className="flex items-center justify-center gap-2.5 font-mono font-semibold" 
        style={{ color: 'var(--accent-ink)', fontSize: '12.5px' }}
        aria-hidden="true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-3.5-7.1" />
          <path d="M21 3v5h-5" />
        </svg>
        {loopback}
      </div>

      {/* Active step detail */}
      <div
        className="max-w-[920px] mx-auto rounded-[var(--radius)] grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 items-center"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: '28px 30px',
        }}
        role="tabpanel"
        id={`step-panel-${activeStep}`}
        aria-labelledby={`step-tab-${activeStep}`}
      >
        <div>
          <p className="font-mono text-xs font-semibold m-0 mb-2" style={{ color: 'var(--accent-ink)' }}>
            {steps[activeStep].label}
          </p>
          <h4 className="font-heading font-semibold m-0 mb-2.5" style={{ fontSize: '22px', letterSpacing: '-0.01em' }}>
            {steps[activeStep].k}
          </h4>
          <p className="m-0" style={{ color: 'var(--muted)', fontSize: '15.5px', lineHeight: '1.65' }}>
            {steps[activeStep].d}
          </p>
        </div>
        <div
          className="rounded-[calc(var(--radius)-2px)] font-mono"
          style={{
            backgroundColor: 'var(--code-bg)',
            color: 'var(--code-text)',
            padding: '18px',
            fontSize: '12.5px',
            lineHeight: '1.85',
          }}
          aria-label={`Code example for ${steps[activeStep].k}`}
        >
          {steps[activeStep].code.map((line, i) => (
            <div key={i} style={{ color: i === steps[activeStep].code.length - 1 ? 'var(--accent)' : 'var(--code-text)' }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center max-w-[62ch] mx-auto mt-6" style={{ color: 'var(--muted)', fontSize: '14.5px', lineHeight: '1.6' }}>
        {note}
      </p>
    </div>
    </ErrorBoundary>
  );
}
