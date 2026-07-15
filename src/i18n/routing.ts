import { getRelativeLocaleUrl } from 'astro:i18n';
import { translations } from './index';
import type { Language } from './index';

/** Supported locales, in display/priority order. Spanish is the default. */
export const LOCALES: readonly Language[] = ['es', 'en'] as const;
export const DEFAULT_LOCALE: Language = 'es';

/** Human-readable label for each locale's toggle control. */
export const LOCALE_LABELS: Record<Language, string> = {
  es: 'ES',
  en: 'EN',
};

/**
 * Relative URL for a page in a given locale. With `prefixDefaultLocale: false`,
 * Spanish resolves to `/` and English to `/en/`.
 */
export function localePath(locale: Language, path = ''): string {
  return getRelativeLocaleUrl(locale, path);
}

/** A locale alternate: the locale code plus its relative URL for the given path. */
export interface LocaleAlternate {
  locale: Language;
  url: string;
}

/**
 * All locale alternates for a page path, used to build `hreflang` links and the
 * language selector. Order follows `LOCALES`.
 */
export function localeAlternates(path = ''): LocaleAlternate[] {
  return LOCALES.map((locale) => ({ locale, url: localePath(locale, path) }));
}

/** Localized `<title>`/`description` for the landing page in a given locale. */
export function pageMeta(locale: Language): { title: string; description: string } {
  const meta = (translations[locale] as { meta?: { title: string; description: string } }).meta;
  return {
    title: meta?.title ?? '',
    description: meta?.description ?? '',
  };
}
