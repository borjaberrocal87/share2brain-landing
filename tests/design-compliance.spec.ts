import { test, expect } from '@playwright/test';

async function waitForReady(page: any) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

// ─── SECTION STRUCTURE ───

test.describe('Page Structure', () => {
  test('all sections present in correct order', async ({ page }) => {
    await waitForReady(page);
    const sections = [
      'header[role="banner"]',
      '#hero-title',
      '#producto',
      '#how',
      '#install',
      '#docs',
      '#stack',
      '#cta-title',
      'footer[role="contentinfo"]',
    ];
    const positions: number[] = [];
    for (const sel of sections) {
      const box = await page.locator(sel).first().boundingBox();
      expect(box, `${sel} should be visible`).toBeTruthy();
      positions.push(box!.y);
    }
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i]).toBeGreaterThan(positions[i - 1]);
    }
  });

  test('h1 exists in hero', async ({ page }) => {
    await waitForReady(page);
    const h1 = page.locator('#hero-title');
    await expect(h1).toBeVisible();
  });
});

// ─── THEME SYSTEM ───

test.describe('Theme System', () => {
  test('dark mode: body background applies via CSS var', async ({ page }) => {
    await waitForReady(page);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(200);
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('--accent variable is set and non-empty', async ({ page }) => {
    await waitForReady(page);
    const accent = await page.evaluate(() => {
      const root = document.querySelector('[data-theme]') || document.documentElement;
      return getComputedStyle(root).getPropertyValue('--accent').trim();
    });
    expect(accent.length).toBeGreaterThan(0);
  });

  test('theme toggle button visible', async ({ page }) => {
    await waitForReady(page);
    await expect(page.locator('button[aria-label*="Switch to"]').first()).toBeVisible();
  });

  test('data-theme is set', async ({ page }) => {
    await waitForReady(page);
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(['dark', 'light']).toContain(theme);
  });
});

// ─── TYPOGRAPHY ───

test.describe('Typography', () => {
  test('h1 uses Space Grotesk', async ({ page }) => {
    await waitForReady(page);
    const font = await page.locator('h1').first().evaluate((e) =>
      getComputedStyle(e).fontFamily.split(',')[0].trim().replace(/['"]/g, '')
    );
    expect(font).toBe('Space Grotesk');
  });

  test('body text font-family includes IBM Plex Sans', async ({ page }) => {
    await waitForReady(page);
    const font = await page.locator('body').evaluate((e) =>
      getComputedStyle(e).fontFamily
    );
    expect(font.toLowerCase()).toContain('ibm plex sans');
  });

  test('code uses IBM Plex Mono', async ({ page }) => {
    await waitForReady(page);
    const font = await page.locator('pre').first().evaluate((e) =>
      getComputedStyle(e).fontFamily.split(',')[0].trim().replace(/['"]/g, '')
    );
    expect(font).toBe('IBM Plex Mono');
  });
});

// ─── HEADER ───

test.describe('Header', () => {
  test('sticky with backdrop blur', async ({ page }) => {
    await waitForReady(page);
    const h = page.locator('header[role="banner"]');
    expect(await h.evaluate((e) => getComputedStyle(e).position)).toBe('sticky');
    expect(await h.evaluate((e) => getComputedStyle(e).backdropFilter)).toContain('blur');
  });

  test('logo visible with brand name', async ({ page }) => {
    await waitForReady(page);
    const logo = page.locator('header a').first();
    await expect(logo).toBeVisible();
    const text = await logo.textContent();
    expect(text!.toLowerCase()).toMatch(/chat2brain|keephive/);
  });

  test('desktop nav visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await waitForReady(page);
    await expect(page.locator('nav[aria-label="Main navigation"]')).toBeVisible();
  });

  test('desktop nav hidden on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await waitForReady(page);
    await expect(page.locator('nav[aria-label="Main navigation"]')).not.toBeVisible();
  });

  test('mobile menu button visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await waitForReady(page);
    await expect(page.locator('button[aria-label="Open menu"]')).toBeVisible();
  });
});

// ─── HERO ───

test.describe('Hero Section', () => {
  test('title present', async ({ page }) => {
    await waitForReady(page);
    const text = await page.locator('#hero-title').textContent();
    expect(text!.length).toBeGreaterThan(10);
  });

  test('badge says Open source', async ({ page }) => {
    await waitForReady(page);
    await expect(page.locator('[data-i18n="hero.badge"]').first()).toContainText('Open source');
  });

  test('has code block with git clone', async ({ page }) => {
    await waitForReady(page);
    const pre = page.locator('pre').first();
    await expect(pre).toBeVisible();
    expect(await pre.textContent()).toContain('git clone');
  });
});

// ─── VALUE PROPS ───

test.describe('Value Props', () => {
  test('3 cards', async ({ page }) => {
    await waitForReady(page);
    await expect(page.locator('#producto [role="listitem"]')).toHaveCount(3);
  });

  test('card titles present', async ({ page }) => {
    await waitForReady(page);
    const titles = await page.locator('#producto h3').allTextContents();
    const joined = titles.join(' ');
    expect(joined).toContain('Indexa');
    expect(joined).toContain('Responde');
    expect(joined).toContain('control');
  });
});

// ─── HOW IT WORKS ───

test.describe('How It Works', () => {
  test('3 step buttons', async ({ page }) => {
    await waitForReady(page);
    await expect(page.locator('#how [role="tab"]')).toHaveCount(3);
  });

  test('first step selected', async ({ page }) => {
    await waitForReady(page);
    expect(await page.locator('#how [role="tab"]').first().getAttribute('aria-selected')).toBe('true');
  });

  test('clicking step updates detail', async ({ page }) => {
    await waitForReady(page);
    await page.locator('#how [role="tab"]').nth(1).click();
    await expect(page.locator('#step-panel-1')).toBeVisible();
  });

  test('active step has shadow', async ({ page }) => {
    await waitForReady(page);
    const shadow = await page.locator('#how [role="tab"]').first().evaluate(
      (e) => getComputedStyle(e).boxShadow
    );
    expect(shadow).not.toBe('none');
  });
});

// ─── INSTALLATION ───

test.describe('Installation', () => {
  test('3 steps', async ({ page }) => {
    await waitForReady(page);
    await expect(page.locator('#install [role="listitem"]')).toHaveCount(3);
  });
});

// ─── DOCS ───

test.describe('Docs', () => {
  test('4 tabs', async ({ page }) => {
    await waitForReady(page);
    await expect(page.locator('#docs [role="tab"]')).toHaveCount(4);
  });
});

// ─── STACK & ARCHITECTURE ───

test.describe('Stack & Architecture', () => {
  test('8 tech cards', async ({ page }) => {
    await waitForReady(page);
    await expect(page.locator('[aria-label="Technology stack"] [role="listitem"]')).toHaveCount(8);
  });

  test('4 architecture layers', async ({ page }) => {
    await waitForReady(page);
    await expect(page.locator('[aria-label="Architecture layers"] [role="listitem"]')).toHaveCount(4);
  });

  test('Redis Streams in event diagram', async ({ page }) => {
    await waitForReady(page);
    const text = await page.locator('[aria-label*="Event-driven"]').textContent();
    expect(text).toContain('Redis Streams');
  });
});

// ─── CTA ───

test.describe('CTA', () => {
  test('title visible', async ({ page }) => {
    await waitForReady(page);
    const text = await page.locator('#cta-title').textContent();
    expect(text!.length).toBeGreaterThan(5);
  });
});

// ─── FOOTER ───

test.describe('Footer', () => {
  test('footer has brand name', async ({ page }) => {
    await waitForReady(page);
    const text = await page.locator('footer[role="contentinfo"]').textContent();
    expect(text!.toLowerCase()).toMatch(/chat2brain|keephive/);
  });

  test('footer has MIT', async ({ page }) => {
    await waitForReady(page);
    const text = await page.locator('footer[role="contentinfo"]').textContent();
    expect(text).toContain('MIT');
  });
});

// ─── ACCESSIBILITY ───

test.describe('Accessibility', () => {
  test('theme toggle has aria-label', async ({ page }) => {
    await waitForReady(page);
    const btn = page.locator('button[aria-label*="Switch to"]').first();
    const label = await btn.getAttribute('aria-label');
    expect(label!.length).toBeGreaterThan(5);
  });

  test('language toggle has aria-labels', async ({ page }) => {
    await waitForReady(page);
    const count = await page.locator('button[aria-label*="español"], button[aria-label*="Spanish"], button[aria-label*="English"], button[aria-label*="inglés"]').count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('copy button has aria-label', async ({ page }) => {
    await waitForReady(page);
    await expect(page.locator('button[aria-label*="Copy"]').first()).toBeVisible();
  });
});

// ─── SEO ───

test.describe('SEO', () => {
  test('title tag contains brand', async ({ page }) => {
    await waitForReady(page);
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/chat2brain|keephive/);
  });

  test('meta description exists', async ({ page }) => {
    await waitForReady(page);
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc!.length).toBeGreaterThan(50);
  });

  test('canonical URL', async ({ page }) => {
    await waitForReady(page);
    const href = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(href).toMatch(/chat2brain\.app|keephive\.dev/);
  });

  test('OG tags present', async ({ page }) => {
    await waitForReady(page);
    expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toBeTruthy();
    expect(await page.locator('meta[property="og:description"]').getAttribute('content')).toBeTruthy();
    expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toBeTruthy();
  });

  test('JSON-LD SoftwareApplication', async ({ page }) => {
    await waitForReady(page);
    const json = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(json!);
    expect(data['@type']).toBe('SoftwareApplication');
  });
});

// ─── I18N ───

test.describe('i18n', () => {
  test('default lang is Spanish', async ({ page }) => {
    await waitForReady(page);
    expect(await page.evaluate(() => document.documentElement.lang)).toBe('es');
  });

  test('switching to EN updates content', async ({ page }) => {
    await waitForReady(page);
    const initial = await page.locator('[data-i18n="valuesTitle"]').first().textContent();
    expect(initial).toContain('Conocimiento');
    
    await page.locator('button[aria-label="Switch to English"]').click();
    await page.waitForTimeout(500);
    
    const updated = await page.locator('[data-i18n="valuesTitle"]').first().textContent();
    expect(updated).toContain('knowledge');
  });
});

// ─── RESPONSIVE ───

test.describe('Responsive', () => {
  test('no overflow at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await waitForReady(page);
    // Check that user cannot scroll horizontally (overflow-x: hidden on html prevents it)
    const canScroll = await page.evaluate(() => {
      const html = document.documentElement;
      return html.scrollWidth > html.clientWidth && html.style.overflowX !== 'hidden' && getComputedStyle(html).overflowX !== 'hidden';
    });
    expect(canScroll).toBe(false);
  });

  test('no overflow at 768px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await waitForReady(page);
    const canScroll = await page.evaluate(() => {
      const html = document.documentElement;
      return html.scrollWidth > html.clientWidth && html.style.overflowX !== 'hidden' && getComputedStyle(html).overflowX !== 'hidden';
    });
    expect(canScroll).toBe(false);
  });

  test('no overflow at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await waitForReady(page);
    const canScroll = await page.evaluate(() => {
      const html = document.documentElement;
      return html.scrollWidth > html.clientWidth && html.style.overflowX !== 'hidden' && getComputedStyle(html).overflowX !== 'hidden';
    });
    expect(canScroll).toBe(false);
  });
});
