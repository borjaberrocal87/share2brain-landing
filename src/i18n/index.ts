import esRaw from './es.json';
import enRaw from './en.json';

const es = esRaw as Record<string, unknown>;
const en = enRaw as Record<string, unknown>;

export type Translations = typeof esRaw;
export type Language = 'es' | 'en';

export { es, en };

export const translations: Record<'es' | 'en', Translations> = {
  es: esRaw,
  en: enRaw,
};
