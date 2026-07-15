import { test, expect } from '@playwright/test';

// ─── LOCALIZED ROUTING ───
// Each language is served from its own static URL, fully server-rendered in its
// language, with reciprocal hreflang/canonical metadata so search engines index
// each locale independently. Language selection is by URL, not a runtime swap.

const SITE = 'https://share2brain.app';

const LOCALES = [
  {
    lang: 'es',
    path: '/',
    htmlLang: 'es',
    canonical: `${SITE}/`,
    ogLocale: 'es_ES',
    heroTitle: 'Tu comunidad de Discord ya tiene el conocimiento',
    otherHeroTitle: 'Your Discord community already has the knowledge',
  },
  {
    lang: 'en',
    path: '/en/',
    htmlLang: 'en',
    canonical: `${SITE}/en/`,
    ogLocale: 'en_US',
    heroTitle: 'Your Discord community already has the knowledge',
    otherHeroTitle: 'Tu comunidad de Discord ya tiene el conocimiento',
  },
];

for (const loc of LOCALES) {
  test.describe(`locale: ${loc.lang} (${loc.path})`, () => {
    test('renders its own language and not the other', async ({ page }) => {
      await page.goto(loc.path);
      await expect(page.locator('#hero-title')).toContainText(loc.heroTitle);
      await expect(page.locator('body')).not.toContainText(loc.otherHeroTitle);
    });

    test('declares the correct html lang', async ({ page }) => {
      await page.goto(loc.path);
      await expect(page.locator('html')).toHaveAttribute('lang', loc.htmlLang);
    });

    test('has a self-referential canonical', async ({ page }) => {
      await page.goto(loc.path);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', loc.canonical);
    });

    test('emits reciprocal hreflang alternates and x-default', async ({ page }) => {
      await page.goto(loc.path);
      await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', `${SITE}/`);
      await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `${SITE}/en/`);
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute('href', `${SITE}/`);
    });

    test('sets the matching og:locale', async ({ page }) => {
      await page.goto(loc.path);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', loc.ogLocale);
    });

    test('has a non-empty localized title and description', async ({ page }) => {
      await page.goto(loc.path);
      const title = await page.title();
      expect(title.trim().length).toBeGreaterThan(10);
      const desc = await page.locator('meta[name="description"]').getAttribute('content');
      expect((desc ?? '').trim().length).toBeGreaterThan(10);
    });
  });
}

test.describe('language toggle navigation', () => {
  test('navigates between locale URLs', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[aria-label="Switch to English"]').click();
    await expect(page).toHaveURL(/\/en\/$/);
    await page.locator('a[aria-label="Cambiar a español"]').click();
    await expect(page).toHaveURL(new RegExp(`${'\\/'}$`));
  });

  test('preserves the active section anchor across the switch', async ({ page }) => {
    await page.goto('/#docs');
    const toEnglish = page.locator('a[aria-label="Switch to English"]');
    // The anchor is folded into the href once the island hydrates; waiting on it
    // makes the assertion independent of hydration timing.
    await expect(toEnglish).toHaveAttribute('href', '/en/#docs');
    await toEnglish.click();
    await expect(page).toHaveURL(/\/en\/#docs$/);
  });
});

test.describe('crawler view (JavaScript disabled)', () => {
  test.use({ javaScriptEnabled: false });

  test('Spanish page is fully localized without JS', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#hero-title')).toContainText('Tu comunidad de Discord ya tiene el conocimiento');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  test('English page is fully localized without JS', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('#hero-title')).toContainText('Your Discord community already has the knowledge');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
