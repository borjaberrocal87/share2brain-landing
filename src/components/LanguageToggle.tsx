import { useState, useEffect, useCallback } from 'react';

interface LanguageToggleProps {
  initialLang?: 'es' | 'en';
}

export function LanguageToggle({ initialLang = 'es' }: LanguageToggleProps) {
  const [lang, setLang] = useState<'es' | 'en'>(initialLang);

  useEffect(() => {
    const saved = localStorage.getItem('language');
    const current = saved === 'en' ? 'en' : 'es';
    setLang(current);
    document.documentElement.lang = current;
  }, []);

  const toggleLang = useCallback((newLang: 'es' | 'en') => {
    setLang(newLang);
    localStorage.setItem('language', newLang);
    document.documentElement.lang = newLang;
    // Apply translations via the global function from i18n-client.ts
    if (typeof window !== 'undefined' && (window as any).__applyTranslations) {
      (window as any).__applyTranslations(newLang);
    }
  }, []);

  return (
    <div
      className="flex border rounded-full overflow-hidden font-mono text-xs font-semibold tracking-wide"
      style={{ borderColor: 'var(--border)' }}
      role="group"
      aria-label="Language selector"
    >
      <button
        onClick={() => toggleLang('es')}
        className="border-none cursor-pointer py-1.5 px-2.5 font-inherit font-semibold"
        style={{
          backgroundColor: lang === 'es' ? 'var(--accent-soft)' : 'transparent',
          color: lang === 'es' ? 'var(--accent-ink)' : 'var(--muted)',
        }}
        aria-label="Cambiar a español"
        aria-pressed={lang === 'es'}
      >
        ES
      </button>
      <button
        onClick={() => toggleLang('en')}
        className="border-none cursor-pointer py-1.5 px-2.5 font-inherit font-semibold"
        style={{
          backgroundColor: lang === 'en' ? 'var(--accent-soft)' : 'transparent',
          color: lang === 'en' ? 'var(--accent-ink)' : 'var(--muted)',
        }}
        aria-label="Switch to English"
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  );
}
