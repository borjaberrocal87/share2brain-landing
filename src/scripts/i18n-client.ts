/**
 * Client-side i18n script.
 * Runs after DOM is ready, reads translations from a global __i18n__ map,
 * and applies them to all elements with data-i18n attributes.
 */
import { es, en } from '../i18n/index';
import type { Translations } from '../i18n/index';

type Lang = 'es' | 'en';
const translations: Record<Lang, Translations> = { es, en };

function getCurrentLang(): Lang {
  const saved = localStorage.getItem('language');
  return saved === 'en' ? 'en' : 'es';
}

function resolve(obj: any, path: string): string | undefined {
  return path.split('.').reduce((cur: any, k) => cur?.[k], obj);
}

export function applyTranslations(lang?: Lang): void {
  const t = translations[lang || getCurrentLang()];
  
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    const val = resolve(t, key);
    if (typeof val === 'string') el.textContent = val;
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (!key) return;
    const val = resolve(t, key);
    if (typeof val === 'string') el.innerHTML = val;
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (!key) return;
    const val = resolve(t, key);
    if (typeof val === 'string') el.setAttribute('aria-label', val);
  });
}

// Auto-apply on page load and after Astro navigations
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => applyTranslations());
  document.addEventListener('astro:page-load', () => applyTranslations());
}

// Expose globally for the LanguageToggle to call
if (typeof window !== 'undefined') {
  (window as any).__applyTranslations = applyTranslations;
}
