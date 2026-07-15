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
    expect(text!.toLowerCase()).toMatch(/share2brain|keephive/);
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
    const joined = titles.join(' ').toLowerCase();
    // The three value props: index knowledge, verifiable answers, access control.
    expect(joined).toContain('conocimiento');
    expect(joined).toContain('verificables');
    expect(joined).toContain('decides');
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

  test('switches language on toggle', async ({ page }) => {
    await waitForReady(page);
    await page.locator('#how').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // client:visible island hydration
    const before = (await page.locator('#how [role="tab"]').allTextContents()).join(' ');
    expect(before).toContain('Razonar');
    await page.locator('button[aria-label="Switch to English"]').click();
    await page.waitForTimeout(400);
    const after = (await page.locator('#how [role="tab"]').allTextContents()).join(' ');
    expect(after).toContain('Reason');
    expect(after).not.toContain('Razonar');
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

// All four panels are in the DOM (inactive ones hidden), so scope link queries
// to the visible panel.
const VISIBLE_PANEL = '#docs [role="tabpanel"]:not([hidden])';

async function docsReady(page: any) {
  await waitForReady(page);
  // DocsTabs is a client:visible island — scroll it into view and let it hydrate
  // before interacting, otherwise clicks/keys land before React attaches handlers.
  await page.locator('#docs').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
}

test.describe('Docs', () => {
  test('4 tabs in the designed order', async ({ page }) => {
    await waitForReady(page);
    const tabs = page.locator('#docs [role="tab"]');
    await expect(tabs).toHaveCount(4);
    const labels = (await tabs.allTextContents()).map((t) => t.trim());
    expect(labels).toEqual(['Empezar', 'Arquitectura', 'API y Agente', 'Desarrollo']);
  });

  test('items show a title and a description', async ({ page }) => {
    await waitForReady(page);
    const firstItem = page.locator(`${VISIBLE_PANEL} a`).first();
    await expect(firstItem).toBeVisible();
    expect((await firstItem.textContent())!).toContain('Quick start');
    expect((await firstItem.textContent())!).toContain('docker compose up -d');
  });

  test('every item in every tab has a non-empty title and description', async ({ page }) => {
    await docsReady(page);
    const tabCount = await page.locator('#docs [role="tab"]').count();
    for (let t = 0; t < tabCount; t++) {
      await page.locator('#docs [role="tab"]').nth(t).click();
      const items = page.locator(`${VISIBLE_PANEL} a`);
      const n = await items.count();
      expect(n, `tab ${t} should have items`).toBeGreaterThan(0);
      for (let i = 0; i < n; i++) {
        const spans = items.nth(i).locator('span > span');
        expect((await spans.nth(0).textContent())!.trim().length, `tab ${t} item ${i} title`).toBeGreaterThan(0);
        expect((await spans.nth(1).textContent())!.trim().length, `tab ${t} item ${i} description`).toBeGreaterThan(0);
      }
    }
  });

  test('selecting a tab swaps the panel items', async ({ page }) => {
    await docsReady(page);
    await page.locator('#docs [role="tab"]').nth(1).click();
    const panel = page.locator(VISIBLE_PANEL);
    await expect(panel).toContainText('Architecture Spine');
    await expect(panel).toContainText('PRD');
  });

  test('each doc link opens safely in a new tab and targets the app repo', async ({ page }) => {
    await docsReady(page);
    const links = page.locator(`${VISIBLE_PANEL} a`);
    const count = await links.count();
    expect(count).toBe(4);
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      expect(await link.getAttribute('target')).toBe('_blank');
      expect(await link.getAttribute('rel')).toContain('noopener');
      expect(await link.getAttribute('rel')).toContain('noreferrer');
      expect(await link.getAttribute('href')).toMatch(/github\.com\/borjaberrocal87\/share2brain\/blob\/main\//);
    }
  });

  test('each item shows a persistent external-link icon', async ({ page }) => {
    await waitForReady(page);
    const firstItem = page.locator(`${VISIBLE_PANEL} a`).first();
    // FileText (leading) + ExternalLink (trailing) = 2 icons, the trailing one always visible.
    await expect(firstItem.locator('svg')).toHaveCount(2);
    const opacity = await firstItem.locator('svg').last().evaluate(
      (e) => getComputedStyle(e).opacity
    );
    expect(Number(opacity)).toBeGreaterThan(0);
  });

  test('every tab aria-controls references a panel present in the DOM', async ({ page }) => {
    await waitForReady(page);
    const tabs = page.locator('#docs [role="tab"]');
    const n = await tabs.count();
    for (let i = 0; i < n; i++) {
      const controls = await tabs.nth(i).getAttribute('aria-controls');
      expect(controls, `tab ${i} has aria-controls`).toBeTruthy();
      await expect(page.locator(`#${controls}`), `panel #${controls} exists`).toHaveCount(1);
    }
  });

  test('tabs support keyboard navigation (Arrow / Home / End)', async ({ page }) => {
    await docsReady(page);
    await page.locator('#docs-tab-0').focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#docs-tab-1')).toHaveAttribute('aria-selected', 'true');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('docs-tab-1');
    await page.keyboard.press('End');
    await expect(page.locator('#docs-tab-3')).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Home');
    await expect(page.locator('#docs-tab-0')).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowUp'); // wraps to last
    await expect(page.locator('#docs-tab-3')).toHaveAttribute('aria-selected', 'true');
  });

  test('switching language updates the tab labels and item copy', async ({ page }) => {
    await docsReady(page);
    await expect(page.locator('#docs-tab-0')).toContainText('Empezar');
    await expect(page.locator(VISIBLE_PANEL)).toContainText('Despliegue, HTTPS, proveedores y operación');

    await page.locator('button[aria-label="Switch to English"]').click();
    await page.waitForTimeout(400);

    await expect(page.locator('#docs-tab-0')).toContainText('Getting started');
    await expect(page.locator('#docs [role="tab"]').nth(2)).toContainText('API & Agent');
    await expect(page.locator(VISIBLE_PANEL)).toContainText('Deployment, HTTPS, providers and operations');
  });

  test('language toggle round-trips (ES -> EN -> ES)', async ({ page }) => {
    await docsReady(page);
    await expect(page.locator('#docs-tab-0')).toContainText('Empezar');
    await page.locator('button[aria-label="Switch to English"]').click();
    await page.waitForTimeout(300);
    await expect(page.locator('#docs-tab-0')).toContainText('Getting started');
    await page.locator('button[aria-label="Cambiar a español"]').click();
    await page.waitForTimeout(300);
    await expect(page.locator('#docs-tab-0')).toContainText('Empezar');
  });

  test('renders the stored language preference on load', async ({ page }) => {
    // Simulate a returning visitor who previously chose English.
    await page.addInitScript(() => localStorage.setItem('language', 'en'));
    await waitForReady(page);
    await page.locator('#docs').scrollIntoViewIfNeeded();
    await page.waitForTimeout(600); // hydration + mount-time localStorage read
    await expect(page.locator('#docs-tab-0')).toContainText('Getting started');
    await expect(page.locator(VISIBLE_PANEL)).toContainText('Self-hosting guide');
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

// ─── LIVE DEMO CTA ───

test.describe('Live demo CTA', () => {
  const DEMO_HREF = 'https://demo.share2brain.app/';
  const demoSel = 'a[aria-label="Watch the Share2Brain live demo (opens in new tab)"]';

  test('renders in both hero and cta sections', async ({ page }) => {
    await waitForReady(page);
    await expect(page.locator(demoSel)).toHaveCount(2);
  });

  test('links to the live demo, opens safely in a new tab', async ({ page }) => {
    await waitForReady(page);
    const links = page.locator(demoSel);
    const count = await links.count();
    expect(count).toBe(2);
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      expect(await link.getAttribute('href')).toBe(DEMO_HREF);
      expect(await link.getAttribute('target')).toBe('_blank');
      expect(await link.getAttribute('rel')).toContain('noopener');
      expect(await link.getAttribute('rel')).toContain('noreferrer');
    }
  });

  test('has a leading play icon', async ({ page }) => {
    await waitForReady(page);
    const links = page.locator(demoSel);
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i).locator('svg path[d="M8 5v14l11-7z"]')).toHaveCount(1);
    }
  });

  test('is the first action in its button group', async ({ page }) => {
    await waitForReady(page);
    const links = page.locator(demoSel);
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const isFirstAnchor = await links.nth(i).evaluate((el) => {
        const anchors = Array.from(el.parentElement!.querySelectorAll(':scope > a'));
        return anchors[0] === el;
      });
      expect(isFirstAnchor, 'demo CTA must be the first anchor in its group').toBe(true);
    }
  });

  test('primary CTA brightens on hover', async ({ page }) => {
    await waitForReady(page);
    const link = page.locator(demoSel).first();
    const before = await link.evaluate((el) => getComputedStyle(el).filter);
    expect(before === 'none' || before === '').toBe(true);
    await link.hover();
    await page.waitForTimeout(250);
    const after = await link.evaluate((el) => getComputedStyle(el).filter);
    expect(after).toContain('brightness');
  });

  test('label is localized and toggles ES ↔ EN', async ({ page }) => {
    await waitForReady(page);
    const label = page.locator(`${demoSel} [data-i18n="hero.ctaDemo"]`).first();
    await expect(label).toHaveText('Ver demo en vivo');

    await page.locator('button[aria-label="Switch to English"]').click();
    await page.waitForTimeout(500);
    await expect(label).toHaveText('See live demo');
  });
});

// ─── FOOTER ───

test.describe('Footer', () => {
  test('footer has brand name', async ({ page }) => {
    await waitForReady(page);
    const text = await page.locator('footer[role="contentinfo"]').textContent();
    expect(text!.toLowerCase()).toMatch(/share2brain|keephive/);
  });

  test('footer has MIT', async ({ page }) => {
    await waitForReady(page);
    const text = await page.locator('footer[role="contentinfo"]').textContent();
    expect(text).toContain('MIT');
  });
});

// ─── REPOSITORY LINKS ───

test.describe('Repository links', () => {
  test('no link points to the landing repo (share2brain-landing)', async ({ page }) => {
    await waitForReady(page);
    const hrefs = await page.locator('a[href*="github.com"]').evaluateAll(
      (els) => els.map((e) => (e as HTMLAnchorElement).href)
    );
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href, `${href} must target the app repo, not the landing repo`).not.toContain('share2brain-landing');
    }
  });

  test('a GitHub link targets the app repo share2brain', async ({ page }) => {
    await waitForReady(page);
    const hrefs = await page.locator('a[href*="github.com"]').evaluateAll(
      (els) => els.map((e) => (e as HTMLAnchorElement).href)
    );
    expect(hrefs.some((h) => /github\.com\/borjaberrocal87\/share2brain(\/|$)/.test(h))).toBe(true);
  });

  test('install snippet clones the app repo, not the landing repo', async ({ page }) => {
    await waitForReady(page);
    const pre = await page.locator('pre').first().textContent();
    expect(pre).toContain('git clone');
    expect(pre).toContain('share2brain');
    expect(pre).not.toContain('share2brain-landing');
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
    expect(title.toLowerCase()).toMatch(/share2brain|keephive/);
  });

  test('meta description exists', async ({ page }) => {
    await waitForReady(page);
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc!.length).toBeGreaterThan(50);
  });

  test('canonical URL', async ({ page }) => {
    await waitForReady(page);
    const href = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(href).toMatch(/share2brain\.app|keephive\.dev/);
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
    expect(initial!.toLowerCase()).toContain('conocimiento');

    await page.locator('button[aria-label="Switch to English"]').click();
    await page.waitForTimeout(500);

    const updated = await page.locator('[data-i18n="valuesTitle"]').first().textContent();
    expect(updated!.toLowerCase()).toContain('knowledge');
  });
});

// ─── RESPONSIVE ───

// Overflow is asserted on scrollWidth vs clientWidth directly, independent of
// any `overflow-x: hidden` styling. A page that clips content with overflow-x
// (instead of genuinely fitting) must still fail these checks.
const OVERFLOW_WIDTHS = [320, 375, 414, 768, 820, 1024, 1440];

test.describe('Responsive', () => {
  for (const width of OVERFLOW_WIDTHS) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await waitForReady(page);
      const { scrollWidth, clientWidth } = await page.evaluate(() => {
        const html = document.documentElement;
        return { scrollWidth: html.scrollWidth, clientWidth: html.clientWidth };
      });
      // 1px tolerance for sub-pixel rounding.
      expect(scrollWidth, `page overflows viewport at ${width}px`).toBeLessThanOrEqual(clientWidth + 1);
    });
  }
});

// ─── RESPONSIVE NAVIGATION ───

test.describe('Responsive Navigation', () => {
  const nav = 'nav[aria-label="Main navigation"]';
  const hamburger = 'button[aria-label="Open menu"]';

  // The former 768–820px dead-zone: exactly one navigation control must render.
  for (const width of [768, 800, 819]) {
    test(`exactly one navigation control at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await waitForReady(page);
      const navVisible = await page.locator(nav).isVisible();
      const hamburgerVisible = await page.locator(hamburger).isVisible();
      expect(navVisible || hamburgerVisible, `no navigation control at ${width}px`).toBe(true);
      expect(navVisible && hamburgerVisible, `both nav controls shown at ${width}px`).toBe(false);
    });
  }

  test('hamburger visible at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await waitForReady(page);
    await expect(page.locator(hamburger)).toBeVisible();
  });

  test('desktop nav visible at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await waitForReady(page);
    await expect(page.locator(nav)).toBeVisible();
  });

  test('opening the mobile menu shows the nav links', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await waitForReady(page);
    await page.locator(hamburger).click();
    // The drawer panel must actually render with visible links — guards against
    // the panel collapsing to zero height (header's backdrop-filter makes it the
    // containing block for the fixed drawer, so `bottom-0` would resolve to 0).
    const panel = page.locator('#mobile-menu');
    await expect(panel).toBeVisible();
    const box = await panel.boundingBox();
    expect(box!.height, 'drawer panel collapsed to zero height').toBeGreaterThan(50);
    await expect(panel.locator('a').first()).toBeVisible();
    // Overlay click closes it.
    await page.locator('div.fixed.z-40').first().click({ position: { x: 20, y: 400 } });
    await expect(page.locator(hamburger)).toBeVisible();
  });
});

// ─── ANCHOR NAVIGATION ───

test.describe('Anchor Navigation', () => {
  test('section heading clears sticky header after anchor click', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await waitForReady(page);
    const headerHeight = await page
      .locator('header[role="banner"]')
      .evaluate((e) => e.getBoundingClientRect().height);
    const anchors = ['#producto', '#features', '#how', '#docs', '#stack', '#install'];
    for (const anchor of anchors) {
      // Drive via hash navigation so every section id is covered (some sections,
      // e.g. #install, have no nav link). scroll-padding-top must still apply.
      await page.evaluate((a) => {
        window.location.hash = '';
        window.location.hash = a;
      }, anchor);
      await page.waitForTimeout(700); // allow smooth scroll to settle
      const top = await page.locator(anchor).evaluate((e) => e.getBoundingClientRect().top);
      // Target top must sit at or below the sticky header (not scrolled underneath).
      expect(top, `${anchor} is hidden under the sticky header`).toBeGreaterThanOrEqual(headerHeight - 2);
    }
  });
});
