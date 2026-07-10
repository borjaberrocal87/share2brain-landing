# PRD — Landing Page Share2Brain

**Despliegue en producción del sitio web institucional**

| | |
|---|---|
| **Nombre** | Share2Brain Landing |
| **Versión** | 1.0 |
| **Fecha** | 29 de junio de 2026 |
| **Estado** | En revisión |
| **Autor** | Equipo Share2Brain |
| **Dependencia** | PRD-Share2Brain-v4.md (Producto principal) |

---

## 0. Contexto

Este documento define los requisitos específicos para la **landing page de Share2Brain** y su despliegue en producción. La landing es una superficie del producto separada del sistema self-hosted, hospedada y mantenida por el mantenedor del proyecto.

**Relación con el producto principal:**
- La landing **no forma parte** del sistema self-hosted que despliegan los operadores
- La landing **explica** el producto, hosting documentación y enlace a GitHub
- La landing es **estática** (generada en build time) para máxima performance y SEO

---

## 1. Resumen ejecutivo

La landing de Share2Brain es el punto de entrada principal para潜在 usuarios del proyecto. Debe comunicar claramente:
- Qué es Share2Brain y qué problema resuelve
- Cómo funciona (arquitectura de alto nivel)
- Cómo desplegarlo (guía rápida)
- Dónde encontrar documentación completa

El sitio debe ser **rápido, indexable por buscadores, responsivo y accesible**. Se despliega como sitio estático en un CDN o hosting estático.

---

## 2. Objetivos

| ID | Objetivo | Métrica de éxito |
|----|----------|------------------|
| L-1 | Comunicar el valor del producto en < 5 segundos | Tasa de rebote < 40% |
| L-2 | Generar tráfico orgánico desde buscadores | Top 3 para "Discord AI bot self-hosted" |
| L-3 | Convertir visitantes en usuarios del producto | Click-through a GitHub > 5% |
| L-4 | Proporcionar documentación clara para operadores | Tiempo en página > 2 minutos |
| L-5 | Mantener carga < 2 segundos en 3G | Lighthouse Performance > 90 |

---

## 3. Superficies de la landing

### 3.1 Estructura de páginas

```
share2brain.app (o share2brain.app)
│
├── /                          # Hero + valor + CTA principal
├── /#features                 # Características principales
├── /#how-it-works             # Diagrama de arquitectura
├── /#installation             # Guía rápida de instalación
├── /#comparison               # Comparativa con alternativas
├── /docs                      # Documentación completa (enlace a docs/)
├── /docs/getting-started      # Guía de inicio rápido
├── /docs/configuration        # Referencia de share2brain.config.yml
├── /docs/architecture         # Arquitectura del sistema
├── /docs/security             # Modelo de seguridad
├── /blog                      # Blog técnico (opcional, fase 2)
├── /changelog                 # Registro de cambios
└── /github                    # Redirect a GitHub repo
```

### 3.2 Contenido por sección

#### Hero (sección principal)
- **Título:** "Share2Brain — AI Agent for Discord Communities"
- **Subtítulo:** "Indexa el conocimiento de tu comunidad de Discord y responde preguntas automáticamente con fuentes verificables"
- **CTA primario:** "Get Started" → enlace a docs/getting-started
- **CTA secundario:** "View on GitHub" → enlace a repo
- **Visual:** Diagrama animado o screenshot del producto

#### Features (características)
| Característica | Descripción |
|----------------|-------------|
| Auto-indexing | Lee automáticamente los mensajes de canales seleccionados |
| RAG Responses | Responde con fuentes verificables (canal, autor, fecha) |
| Self-hosted | Tus datos nunca salen de tu infraestructura |
| YAML Config | Configuración como código, Git-friendly |
| Read Tracking | Cada miembro sabe qué ha leído y qué le falta |
| Telegram Alerts | Notificaciones de indexación y errores |

#### How it works (cómo funciona)
Diagrama de alto nivel:
```
Discord Channels → Share2Brain Bot → pgvector → Web App (Search + Chat)
```

#### Installation (instalación)
```bash
# Clone the repository
git clone https://github.com/borjaberrocal87/share2brain-landing.git
cd share2brain-landing

# Configure
cp share2brain.config.yml.example share2brain.config.yml
cp .env.example .env

# Start
docker compose up -d
```

#### Comparison (comparativa)
| Feature | Share2Brain | Custom Bot | SaaS Solutions |
|---------|----------|------------|----------------|
| Self-hosted | ✅ | ✅ | ❌ |
| Auto-indexing | ✅ | ❌ | ✅ |
| RAG with citations | ✅ | ❌ | Partial |
| Open source | ✅ | N/A | ❌ |
| Data privacy | ✅ | ✅ | ❌ |
| Cost | Free | Dev time | Monthly fee |

---

## 4. Stack tecnológico

| Capa | Elección | Razón |
|------|----------|-------|
| Framework | **Astro** | SSG rápido, islands para interactividad, SEO nativo |
| UI Components | **React** (islands) | Componentes interactivos cuando sea necesario |
| Styling | **Tailwind CSS** | Utility-first, rápido de desarrollar |
| Typography | **Inter** | Legible, moderna, gratuita |
| Icons | **Lucide React** | Consistentes, ligeros |
| Animations | **Framer Motion** | Smooth, performant |
| Analytics | **Plausible** o **Umami** | Privacy-friendly, self-hostable |
| Hosting | **Hostinger VPS (Docker)** | Control total, SSL con Caddy, Docker-based |
| Domain | **share2brain.app** | TLD preferido para proyectos developer |
| CI/CD | **GitHub Actions** | Integración nativa con repo |

---

## 5. Diseño y UX

### 5.1 Principios de diseño

| Principio | Descripción |
|-----------|-------------|
| **Developer-first** | El diseño debe resonar con desarrolladores y sysadmins |
| **Minimal** | Sin distracciones; el contenido es el héroe |
| **Fast** | Carga instantánea; no bloquear渲染 |
| **Accessible** | WCAG 2.1 AA mínimo |
| **Dark mode** | Soporte nativo (los devs prefieren dark mode) |

### 5.2 Paleta de colores

```css
:root {
  /* Primary - Honey/Amber (brand Share2Brain) */
  --color-primary-50: #fffbeb;
  --color-primary-500: #f59e0b;
  --color-primary-600: #d97706;
  --color-primary-700: #b45309;
  
  /* Neutral */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-900: #171717;
  
  /* Semantic */
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
}

/* Dark mode */
.dark {
  --bg-primary: #0a0a0a;
  --bg-secondary: #171717;
  --text-primary: #fafafa;
  --text-secondary: #a3a3a3;
}
```

### 5.3 Tipografía

```css
/* Headings - Space Grotesk (techy, modern) */
h1, h2, h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
}

/* Body - Inter */
body {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  line-height: 1.6;
}

/* Code - JetBrains Mono */
code, pre {
  font-family: 'JetBrains Mono', monospace;
}
```

### 5.4 Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Header (sticky)                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Logo    Features  Docs  GitHub  [Toggle Dark Mode]  │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Hero                                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  Share2Brain — AI Agent for Discord Communities        │   │
│  │                                                     │   │
│  │  Index knowledge, answer questions, cite sources    │   │
│  │                                                     │   │
│  │  [Get Started]  [View on GitHub]                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Features (grid 3 columnas)                                 │
│  ┌──────────────┬──────────────┬──────────────┐            │
│  │ Auto-index   │ RAG+Citations│ Self-hosted  │            │
│  ├──────────────┼──────────────┼──────────────┤            │
│  │ YAML Config  │ Read Track   │ TG Alerts    │            │
│  └──────────────┴──────────────┴──────────────┘            │
├─────────────────────────────────────────────────────────────┤
│  How it works (diagrama)                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Discord → Bot → pgvector → Web (Search + Chat)     │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Installation (código)                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  $ git clone ...                                    │   │
│  │  $ docker compose up -d                             │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Footer                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ GitHub  Docs  Discord  License (MIT)                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Requisitos funcionales

### 6.1 Contenido

| ID | Requisito |
|----|-----------|
| LF-1 | La landing muestra una descripción clara del producto en la hero section |
| LF-2 | Se listan al menos 6 características principales con icono y descripción |
| LF-3 | Se incluye un diagrama de alto nivel de cómo funciona el sistema |
| LF-4 | Se muestra un snippet de código con la instalación rápida |
| LF-5 | Se enlaza a la documentación completa |
| LF-6 | Se enlaza al repositorio de GitHub |
| LF-7 | Se incluye información de licencia (MIT) |
| LF-8 | El contenido es 100% público (no requiere autenticación) |

### 6.2 Interactividad

| ID | Requisito |
|----|-----------|
| LF-9 | Soporte para dark mode con toggle en el header |
| LF-10 | El header es sticky (se queda fijo al hacer scroll) |
| LF-11 | Smooth scroll al hacer clic en links internos |
| LF-12 | Animaciones sutiles al hacer scroll (fade-in) |
| LF-13 | Código con syntax highlighting y botón de copiar |
| LF-14 | Menú responsive para móvil (hamburger menu) |

### 6.3 SEO

| ID | Requisito |
|----|-----------|
| LF-15 | Meta tags optimizados (title, description, OG tags) |
| LF-16 | Schema.org JSON-LD para SoftwareApplication |
| LF-17 | Sitemap.xml generado automáticamente |
| LF-18 | robots.txt configurado correctamente |
| LF-19 | Canonical URLs |
| LF-20 | Imágenes con alt text |
| LF-21 | Heading hierarchy correcta (h1 → h2 → h3) |

### 6.4 Performance

| ID | Requisito |
|----|-----------|
| LF-22 | Lighthouse Performance score ≥ 95 |
| LF-23 | First Contentful Paint < 1s |
| LF-24 | Largest Contentful Paint < 2.5s |
| LF-25 | Cumulative Layout Shift < 0.1 |
| LF-26 | Time to Interactive < 2s |
| LF-27 | Imágenes optimizadas (WebP/AVIF) |
| LF-28 | Lazy loading en imágenes below the fold |

### 6.5 Accesibilidad

| ID | Requisito |
|----|-----------|
| LF-29 | WCAG 2.1 AA compliance |
| LF-30 | Navegación completa por teclado |
| LF-31 | Contraste de colores ≥ 4.5:1 (texto normal) |
| LF-32 | ARIA labels en elementos interactivos |
| LF-33 | Skip-to-content link |

---

## 7. Requisitos no funcionales

### 7.1 Hosting y despliegue

| ID | Requisito |
|----|-----------|
| LNF-1 | Despliegue automático al hacer push a `main` |
| LNF-2 | Preview deployments para PRs |
| LNF-3 | HTTPS automático (Let's Encrypt) |
| LNF-4 | CDN global para baja latencia |
| LNF-5 | Dominio personalizado (`share2brain.app`) |
| LNF-6 | Headers de seguridad (CSP, HSTS, X-Frame-Options) |

### 7.2 CI/CD

| ID | Requisito |
|----|-----------|
| LNF-7 | Build automático en GitHub Actions |
| LNF-8 | Linting (ESLint + Prettier) en CI |
| LNF-9 | Lighthouse CI para verificar performance |
| LNF-10 | Link checking (no hay rotos) |
| LNF-11 | Deploy a producción solo desde `main` |

### 7.3 Observabilidad

| ID | Requisito |
|----|-----------|
| LNF-12 | Analytics privacy-friendly (Plausible/Umami) |
| LNF-13 | Error tracking (Sentry o similar) |
| LNF-14 | Uptime monitoring (UptimeRobot/Uptime Kuma) |

### 7.4 Mantenimiento

| ID | Requisito |
|----|-----------|
| LNF-15 | Actualización de dependencias mensual (Dependabot) |
| LNF-16 | Backup del contenido en el repo de Git |
| LNF-17 | Documentación del proceso de actualización |

---

## 8. Estructura del proyecto

```
landing/
├── public/
│   ├── favicon.ico
│   ├── og-image.png           # 1200x630 para social sharing
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Features.astro
│   │   ├── HowItWorks.astro
│   │   ├── Installation.astro
│   │   ├── Comparison.astro
│   │   ├── Footer.astro
│   │   ├── CodeBlock.tsx       # React island
│   │   ├── ThemeToggle.tsx     # React island
│   │   └── MobileMenu.tsx      # React island
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── docs/
│   │   │   ├── getting-started.md
│   │   │   ├── configuration.md
│   │   │   ├── architecture.md
│   │   │   └── security.md
│   │   └── changelog.astro
│   ├── styles/
│   │   └── global.css
│   └── content/
│       └── docs/               # Markdown content
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## 9. Despliegue en producción

### 9.1 Hostinger VPS con Docker (recomendada)

Despliegue automático via GitHub Actions:

1. Se construye la imagen Docker y se sube a GHCR
2. GitHub Actions copia `docker-compose.prod.yml` y `Caddyfile` al VPS via SSH
3. Se ejecuta `docker compose pull` + `docker compose up -d` en el VPS
4. Caddy obtiene el certificado SSL de Let's Encrypt automáticamente

**Secrets requeridos en GitHub:**
- `HOSTINGER_SSH_KEY` — clave SSH privada del VPS
- `HOSTINGER_HOST` — IP del VPS
- `HOSTINGER_USER` — usuario SSH

**Ventajas:**
- Control total del servidor
- SSL automático con Caddy + Let's Encrypt
- Docker-based, reproducible
- Fácil rollback (imágenes etiquetadas por SHA)

### 9.2 Opción B: Vercel

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

**Pasos:**
1. Importar repo en Vercel
2. Configurar dominio personalizado
3. Deploy automático

**Ventajas:**
- DX excelente
- Edge functions si se necesitan
- Analytics integrados

### 9.3 Opción C: GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/deploy-pages@v4
        with:
          artifact_path: ./dist
```

**Ventajas:**
- Gratuito
- Integrado con GitHub
- Sin configuración externa

**Desventajas:**
- Sin deploy previews
- Menos opciones de configuración

### 9.4 Recomendación

**Hostinger VPS con Docker** es la opción recomendada por:
1. Control total del servidor
2. SSL automático con Caddy + Let's Encrypt
3. Despliegue reproducible con Docker
4. Fácil rollback mediante imágenes etiquetadas por SHA

---

## 10. Configuración de dominio

### 10.1 DNS Records

```
Type    Name    Value                   TTL
A       @       <IP_VPS_HOSTINGER>      300
A       www     <IP_VPS_HOSTINGER>      300
```

### 10.2 SSL/TLS

- Caddy maneja SSL automáticamente via Let's Encrypt
- Auto-renovación integrada
- HSTS habilitado
- Minimum TLS version: 1.2

---

## 11. Analytics y monitoreo

### 11.1 Analytics (privacy-friendly)

**Opción A: Plausible Analytics**
```html
<script defer data-domain="share2brain.app" src="https://plausible.io/js/script.js"></script>
```

**Opción B: Umami (self-hosted)**
```html
<script async defer data-website-id="YOUR_ID" src="https://analytics.share2brain.app/script.js"></script>
```

### 11.2 Métricas a tracking

| Métrica | Descripción |
|---------|-------------|
| Pageviews | Vistas totales por página |
| Unique visitors | Visitantes únicos |
| Bounce rate | % de rebote |
| Time on page | Tiempo medio en página |
| CTA clicks | Clicks en "Get Started" y "GitHub" |
| Referrers | De dónde vienen los visitantes |
| Devices | Desktop vs Mobile |
| Countries | Distribución geográfica |

### 11.3 Uptime monitoring

```yaml
# Configuración para UptimeRobot o Uptime Kuma
- Name: Share2Brain Landing
- URL: https://share2brain.app
- Interval: 5 minutes
- Alert: Email + Telegram
```

---

## 12. Checklist de despliegue

### Pre-launch

- [ ] Dominio registrado (`share2brain.app`)
- [ ] DNS configurado
- [ ] SSL/HTTPS funcionando
- [ ] Build exitoso localmente
- [ ] Lighthouse score ≥ 95
- [ ] Meta tags verificados
- [ ] OG image creada (1200x630)
- [ ] Sitemap.xml generado
- [ ] robots.txt configurado
- [ ] Analytics configurado
- [ ] Error tracking configurado
- [ ] Uptime monitoring configurado

### Launch

- [ ] Deploy a producción
- [ ] Verificar HTTPS
- [ ] Verificar velocidad de carga
- [ ] Probar en móvil
- [ ] Probar dark mode
- [ ] Verificar links rotos
- [ ] Submit sitemap a Google Search Console
- [ ] Submit a Bing Webmaster Tools

### Post-launch

- [ ] Monitorear errores 24h
- [ ] Revisar analytics a los 7 días
- [ ] Recoger feedback
- [ ] Planificar mejoras

---

## 13. Roadmap de la landing

| Fase | Alcance |
|------|---------|
| **v1.0 (MVP)** | Hero, Features, How it Works, Installation, Footer. Deploy en Hostinger VPS (Docker). |
| **v1.1** | Páginas de documentación completas. Blog técnico. |
| **v1.2** | Interactive architecture diagram. Animated demos. |
| **v2.0** | Multi-idioma (i18n). Sección de casos de uso. |
| **Posterior** | Calculadora de costos. Comparativa interactiva. |

---

## 14. Métricas de éxito

| ID | Métrica | Target |
|----|---------|--------|
| LM-1 | Lighthouse Performance | ≥ 95 |
| LM-2 | First Contentful Paint | < 1s |
| LM-3 | Lighthouse SEO | 100 |
| LM-4 | Lighthouse Accessibility | ≥ 95 |
| LM-5 | Bounce rate | < 40% |
| LM-6 | Avg. time on page | > 2 min |
| LM-7 | CTA click-through rate | > 5% |
| LM-8 | GitHub stars (3 months) | > 100 |
| LM-9 | Monthly unique visitors | > 1,000 |

---

## 15. Decisiones

| ID | Decisión | Justificación |
|----|----------|---------------|
| LD-1 | Astro como framework | SSG nativo, rápido, islands para interactividad, SEO perfecto |
| LD-2 | Hostinger VPS (Docker) como hosting | Control total, SSL con Caddy, Docker-based |
| LD-3 | Dark mode por defecto | Los desarrolladores prefieren dark mode |
| LD-4 | Plausible/Umami para analytics | Privacy-friendly, sin cookies, GDPR compliant |
| LD-5 | share2brain.app como dominio | TLD preferido para proyectos developer |
| LD-6 | Documentación en el mismo sitio | Mejor SEO, experiencia unificada |
| LD-7 | React islands para interactividad | Solo cargar JS cuando sea necesario |

---

## 16. Referencias

- [Astro Documentation](https://docs.astro.build/)
- [Docker Documentation](https://docs.docker.com/)
- [Caddy Server](https://caddyserver.com/docs/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Plausible Analytics](https://plausible.io/)
- [Web.dev Performance Metrics](https://web.dev/vitals/)

---

*Fin del documento.*
