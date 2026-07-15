import { useEffect, useState } from 'react';
import type { Language } from '../i18n';

interface LocaleAlternate {
  locale: Language;
  url: string;
}

interface LanguageToggleProps {
  /** The locale of the current page (fixed by its URL). */
  lang: Language;
  /** Relative URL for each locale's equivalent page, provided by the server. */
  alternates: LocaleAlternate[];
}

const LABELS: Record<Language, string> = { es: 'ES', en: 'EN' };
const SWITCH_LABEL: Record<Language, string> = {
  es: 'Cambiar a español',
  en: 'Switch to English',
};

/**
 * Language selector as navigation links. Each locale has its own URL, so
 * switching language is a navigation, not an in-place swap. The active locale
 * is marked and non-navigating. Selecting another locale navigates to its URL.
 *
 * Progressive enhancement: the server renders each link pointing at the locale
 * root (crawlable, works without JS). Once hydrated, we fold the current in-page
 * section anchor into the href so switching language keeps the visitor in the
 * same section — and, because the anchor lives in the href itself, this is
 * independent of hydration timing at click time.
 */
export function LanguageToggle({ lang, alternates }: LanguageToggleProps) {
  const [hash, setHash] = useState('');

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
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
      {alternates.map(({ locale, url }) => {
        const isActive = locale === lang;
        return (
          <a
            key={locale}
            href={isActive ? url : `${url}${hash}`}
            className="no-underline cursor-pointer py-[6px] px-[11px] font-inherit font-semibold"
            style={{
              backgroundColor: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? 'var(--on-accent)' : 'var(--muted)',
            }}
            aria-label={SWITCH_LABEL[locale]}
            aria-current={isActive ? 'true' : undefined}
          >
            {LABELS[locale]}
          </a>
        );
      })}
    </div>
  );
}
