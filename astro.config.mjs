import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://share2brain.app',
  integrations: [
    react(),
    tailwind(),
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
