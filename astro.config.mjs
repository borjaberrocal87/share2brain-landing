import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://share2brain.app',
  // Each language is served from its own static URL: Spanish (default) at `/`
  // and English at `/en/`. `prefixDefaultLocale: false` keeps the already
  // indexed Spanish page at the root while giving English its own crawlable URL.
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    tailwind(),
    // Emit a sitemap with reciprocal hreflang alternates for every locale URL.
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es',
          en: 'en',
        },
      },
    }),
  ],
  vite: {
    ssr: {
      noExternal: ['lucide-react'],
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'lucide': ['lucide-react'],
          },
        },
      },
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
