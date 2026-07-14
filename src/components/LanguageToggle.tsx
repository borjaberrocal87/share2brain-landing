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
    if (typeof window !== 'undefined') {
      if ((window as any).__applyTranslations) {
        (window as any).__applyTranslations(newLang);
      }
      // Notify React islands (DocsTabs, HowItWorksLoop) that hold their own
      // localized copy and must re-render — data-i18n text nodes are handled
      // by __applyTranslations above, but islands own their DOM. Namespaced to
      // avoid the native window `languagechange` event (navigator.languages).
      window.dispatchEvent(new CustomEvent('s2b:languagechange', { detail: newLang }));
    }
  }, []);

  return (
    <div
      className="flex border rounded-full overflow-hidden font-mono text-[11.5px] font-semibold"
      style={{
        borderColor: 'var(--border)',
        letterSpacing: '0.02em',
      }}
      role="group"
      aria-label="Language selector"
    >
      <button
        onClick={() => toggleLang('es')}
        className="border-none cursor-pointer py-[6px] px-[11px] font-inherit font-semibold"
        style={{
          backgroundColor: lang === 'es' ? 'var(--accent)' : 'transparent',
          color: lang === 'es' ? 'var(--on-accent)' : 'var(--muted)',
        }}
        aria-label="Cambiar a español"
        aria-pressed={lang === 'es'}
      >
        ES
      </button>
      <button
        onClick={() => toggleLang('en')}
        className="border-none cursor-pointer py-[6px] px-[11px] font-inherit font-semibold"
        style={{
          backgroundColor: lang === 'en' ? 'var(--accent)' : 'transparent',
          color: lang === 'en' ? 'var(--on-accent)' : 'var(--muted)',
        }}
        aria-label="Switch to English"
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  );
}
