# Hivly Landing

Landing page estática para [Hivly](https://github.com/hivly/hivly) — AI Agent for Discord Communities.

Sitio web institucional que explica el producto, documentación de hosting y enlace al repositorio de GitHub.

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | [Astro](https://astro.build/) (SSG) |
| UI Components | React 18 (islands) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Typography | Space Grotesk, IBM Plex Sans, IBM Plex Mono |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com/) |
| CI/CD | GitHub Actions |
| Container | Docker + Nginx |

## Inicio Rápido

### Requisitos

- Node.js `20.19.0` o superior
- npm o yarn
- Docker (opcional)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/hivly/hivly-landing.git
cd hivly-landing

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en el navegador
open http://localhost:4321
```

### Build

```bash
# Generar sitio estático
npm run build

# Vista previa del build
npm run preview
```

### Docker

```bash
# Construir y levantar con Docker
docker compose up -d --build

# Acceder
open http://localhost:8080

# Detener
docker compose down
```

## Estructura del Proyecto

```
.
├── public/                        # Assets estáticos
│   ├── favicon.svg                # Favicon SVG
│   ├── og-image.svg               # 1200x630 para social sharing
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/                # Componentes Astro y React
│   │   ├── Header.astro           # Header sticky con navegación
│   │   ├── Hero.astro             # Sección principal con CTAs
│   │   ├── ValueProps.astro       # Grid de 3 propuestas de valor
│   │   ├── HowItWorks.astro       # Sección interactiva de proceso
│   │   ├── UseCases.astro         # Grid de 4 casos de uso
│   │   ├── Installation.astro     # 3 pasos de instalación
│   │   ├── Docs.astro             # Navegación por pestañas
│   │   ├── StackArch.astro        # Grid de stack y diagramas
│   │   ├── CTA.astro              # Call-to-action final
│   │   ├── Footer.astro           # Footer con enlaces
│   │   ├── ThemeToggle.tsx        # React island: toggle dark/light
│   │   ├── LanguageToggle.tsx     # React island: toggle ES/EN
│   │   ├── HowItWorksLoop.tsx     # React island: steps interactivos
│   │   ├── DocsTabs.tsx           # React island: tabs de docs
│   │   └── CodeBlock.tsx          # React island: bloques de código
│   ├── layouts/
│   │   └── BaseLayout.astro       # Layout base con SEO
│   ├── pages/
│   │   └── index.astro            # Página principal
│   ├── styles/
│   │   └── global.css             # CSS variables y estilos base
│   └── i18n/
│       ├── index.ts               # Traducciones ES/EN
│       └── utils.ts               # Funciones de switching
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── Dockerfile                     # Multi-stage build
├── docker-compose.yml             # Configuración Docker
├── nginx.conf                     # Configuración Nginx
└── .dockerignore
```

## Características

- **Dark mode** con toggle en el header y persistencia
- **Multi-idioma** con toggle ES/EN y persistencia
- **Header sticky** que se mantiene al hacer scroll con backdrop blur
- **Smooth scroll** para links internos
- **Animaciones sutiles** en hexágonos decorativos
- **Syntax highlighting** en bloques de código
- **Iconos hexagonales** con clip-path CSS
- **SEO optimizado** (meta tags, Open Graph, Twitter Cards, JSON-LD)
- **Accesible** (WCAG 2.1 AA, aria-labels, navegación por teclado)
- **Performance** (Lighthouse ≥ 95, lazy loading de React islands)
- **Responsive** (mobile-first, 375px → 1440px)
- **Docker** listo para producción con Nginx

## Sistema de Temas

### CSS Variables

```css
:root {
  --bg: #F4F5F7;          /* Background light */
  --surface: #FFFFFF;     /* Surface light */
  --text: #1B1F27;        /* Text light */
  --accent: #F5A623;      /* Accent (amber) */
}

[data-theme="dark"] {
  --bg: #0E1116;          /* Background dark */
  --surface: #161B22;     /* Surface dark */
  --text: #E6E9EF;        /* Text dark */
  --accent: #F5A623;      /* Accent (same) */
}
```

### Theme Toggle

```tsx
import { ThemeToggle } from './ThemeToggle';

// En tu componente:
<ThemeToggle client:idle />
```

## Sistema i18n

### Traducciones

```typescript
// src/i18n/index.ts
export const es = {
  hero: {
    title: 'El agente de IA que conoce tu comunidad de Discord',
    sub: 'Hivly indexa...',
  },
  // ...
};

export const en = {
  hero: {
    title: 'The AI agent that knows your Discord community',
    sub: 'Hivly indexes...',
  },
  // ...
};
```

### Uso en Componentes

```astro
---
import { es, en } from '../i18n/index';

const lang = 'es';
const translations = es;
---

<h1>{translations.hero.title}</h1>
```

### Language Toggle

```tsx
import { LanguageToggle } from './LanguageToggle';

// En tu componente:
<LanguageToggle client:idle initialLang={lang} />
```

## Métricas de Performance

| Métrica | Target |
|---------|--------|
| Lighthouse Performance | ≥ 95 |
| First Contentful Paint | < 1s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Lighthouse SEO | 100 |
| Lighthouse Accessibility | ≥ 95 |

## Despliegue

### Cloudflare Pages (Recomendado)

1. Conectar el repositorio GitHub a Cloudflare Pages
2. Configurar:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** 20
3. Configurar dominio personalizado en Cloudflare DNS

### Docker

```bash
# Construir imagen
docker build -t hivly-landing .

# Ejecutar
docker run -d -p 8080:80 hivly-landing
```

### Docker Compose

```bash
# Levantar servicio
docker compose up -d --build

# Verificar
docker compose ps
docker compose logs -f
```

## Configuración de Dominio

### DNS Records (Cloudflare Pages)

```
Type    Name    Value                   TTL
A       @       76.76.21.21            300
CNAME   www     hivly.pages.dev     300
```

## Documentación

- [PRD de la Landing](context/PRD.md)
- [Estándares Frontend](docs/frontend-standards.md)
- [Guía de Desarrollo](docs/development_guide.md)
- [Docker Guide](docker-readme.md)

## Licencia

MIT License - Ver [LICENSE](LICENSE)

---

**Hivly** — AI Agent for Discord Communities
