import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// ─── I18N STRUCTURAL PARITY ───
// en.json and es.json must share the same key set and array cardinality so that
// no locale can silently drop or desync copy. Values are NOT compared (they differ
// by language), only the shape of the dictionaries.

type Shape =
  | { kind: 'array'; length: number; items: Shape[] }
  | { kind: 'object'; keys: Record<string, Shape> }
  | { kind: 'leaf' };

function shapeOf(value: unknown): Shape {
  if (Array.isArray(value)) {
    return { kind: 'array', length: value.length, items: value.map(shapeOf) };
  }
  if (value !== null && typeof value === 'object') {
    const keys: Record<string, Shape> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      keys[key] = shapeOf((value as Record<string, unknown>)[key]);
    }
    return { kind: 'object', keys };
  }
  return { kind: 'leaf' };
}

function load(name: string) {
  const path = fileURLToPath(new URL(`../src/i18n/${name}`, import.meta.url));
  return JSON.parse(readFileSync(path, 'utf-8'));
}

test.describe('i18n parity', () => {
  test('en.json and es.json have identical structure and array lengths', () => {
    const en = load('en.json');
    const es = load('es.json');
    expect(JSON.stringify(shapeOf(es))).toBe(JSON.stringify(shapeOf(en)));
  });

  test('es.json is translated, not a copy of en.json, for prose keys', () => {
    const en = load('en.json');
    const es = load('es.json');
    // These carry real prose and must differ between locales (short brand-y
    // strings like hero.badge are intentionally identical and excluded).
    const proseKeys: Array<[string, string]> = [
      ['hero.title', 'hero.title'],
      ['hero.sub', 'hero.sub'],
      ['valuesTitle', 'valuesTitle'],
      ['howSub', 'howSub'],
      ['installSub', 'installSub'],
      ['ctaTitle', 'ctaTitle'],
    ];
    const get = (o: any, p: string) => p.split('.').reduce((c, k) => c?.[k], o);
    for (const [k] of proseKeys) {
      expect(get(es, k), `es.${k} should be translated`).not.toBe(get(en, k));
    }
  });
});
