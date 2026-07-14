import { useState, useEffect } from 'react';
import type { Language } from './index';

/**
 * Client-side language state for React islands.
 *
 * The site is built as a single Spanish page; language is a client-side toggle.
 * Text nodes with `data-i18n` are swapped by `scripts/i18n-client.ts`, but React
 * islands own their DOM and must re-render themselves. This hook lets an island
 * follow the active language:
 *
 * - initializes from `initial` (the server-rendered language),
 * - on mount, adopts a previously stored preference if it differs,
 * - re-renders when `LanguageToggle` dispatches a `languagechange` CustomEvent.
 *
 * Islands should receive copy for both languages and select with this value.
 */
export function useLanguage(initial: Language = 'es'): Language {
  const [lang, setLang] = useState<Language>(initial);

  useEffect(() => {
    const stored = localStorage.getItem('language');
    if (stored === 'es' || stored === 'en') setLang(stored);

    const onChange = (e: Event) => {
      const next = (e as CustomEvent<Language>).detail;
      if (next === 'es' || next === 'en') setLang(next);
    };
    window.addEventListener('s2b:languagechange', onChange);
    return () => window.removeEventListener('s2b:languagechange', onChange);
  }, []);

  return lang;
}
