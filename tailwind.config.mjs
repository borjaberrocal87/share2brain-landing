/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom nav breakpoint: the desktop nav (logo + 5 localized items +
      // language/theme toggles) does not fit below ~821px, so the desktop
      // nav / hamburger switch happens here rather than at `md` (768px).
      // Single source of truth for the switch — see Header.astro / MobileMenu.tsx.
      screens: {
        nav: '821px',
      },
      colors: {
        // Primary - Honey/Amber (brand Share2Brain)
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Discord
        discord: '#5865F2',
        // Semantic
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      borderRadius: {
        'hex': 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      },
      clipPath: {
        'hex': 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      },
      animation: {
        'float': 'float 9s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite 1.4s',
        'float-slower': 'float 13s ease-in-out infinite 2.1s',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(4deg)' },
        },
      },
    },
  },
  plugins: [],
};
