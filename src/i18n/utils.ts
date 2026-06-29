import { es, en, type Translations } from './index';

export type Language = 'es' | 'en';

const translations: Record<Language, Translations> = {
  es,
  en,
};

/**
 * Get the current language from localStorage or default to 'es'
 */
export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('language');
    if (saved === 'es' || saved === 'en') {
      return saved;
    }
  }
  return 'es';
}

/**
 * Set the current language in localStorage
 */
export function setLanguage(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }
}

/**
 * Get translations for the current language
 */
export function getTranslations(lang?: Language): Translations {
  const currentLang = lang || getCurrentLanguage();
  return translations[currentLang];
}

/**
 * Toggle between ES and EN
 */
export function toggleLanguage(): Language {
  const current = getCurrentLanguage();
  const next = current === 'es' ? 'en' : 'es';
  setLanguage(next);
  return next;
}

/**
 * Apply translations to all DOM elements with data-i18n attribute.
 * Elements use data-i18n="translations.path" to reference translation keys.
 */
export function applyTranslations(lang?: Language): void {
  if (typeof document === 'undefined') return;
  
  const t = getTranslations(lang);
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    
    // Resolve nested key like "hero.title"
    const value = key.split('.').reduce((obj: any, k) => obj?.[k], t);
    if (value !== undefined && typeof value === 'string') {
      el.textContent = value;
    }
  });

  // Also update aria-labels
  const ariaElements = document.querySelectorAll('[data-i18n-aria]');
  ariaElements.forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (!key) return;
    
    const value = key.split('.').reduce((obj: any, k) => obj?.[k], t);
    if (value !== undefined && typeof value === 'string') {
      el.setAttribute('aria-label', value);
    }
  });
}
