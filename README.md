# MH Web 2.0

Sitio insignia de **Morphiq** (Astral Morphiq Systems): una experiencia editorial
y táctil para presentar desarrollo web, punto de venta, CRM, automatizaciones y
software a la medida para negocios.

En producción: [www.morphiq.com.mx](https://www.morphiq.com.mx/)

## Experiencia

- Dirección visual propia en tema oscuro, con azul eléctrico y plata sobre tinta.
- Símbolo de marca en 3D por capas, con reacciones al clic y sin depender del ratón.
- Consola de capacidades para web, POS, CRM, datos y automatización.
- Casos reales enlazados a su sitio o repositorio, sin testimonios ni métricas inventadas.
- Loader funcional que espera tipografías, logo y carga del documento.
- Movimiento de interfaz con Motion y scroll suave con Lenis, con freno propio
  para que un deslizamiento fuerte no se salte las secciones animadas.
- Navegación accesible y alternativa completa para `prefers-reduced-motion`.
- CTA directo a WhatsApp de Miguel Huerta Bautista.

## Stack

- React 18 + Vite 6
- Three.js, React Three Fiber y Drei (escena 3D pesada, hoy en pausa)
- Motion + Lenis
- Lucide React
- CSS nativo responsive
- Manrope, Syne y Exo 2 servidas localmente con Fontsource

## Desarrollo

```bash
npm install
npm run dev
npm run lint
npm run build
```

`npm run build` compila con Vite y después ejecuta `scripts/sitemap.mjs`, que
sella el `<lastmod>` del sitemap con la fecha del último commit. Si no hay git a
mano usa la fecha del build, y nunca corta el despliegue.

## Despliegue

Vercel publica lo que haya en `main`. Un push a esa rama es un despliegue.

## SEO e indexación

Lo que está montado y conviene no romper sin querer:

| Pieza | Dónde | Nota |
| --- | --- | --- |
| `robots.txt` | `public/robots.txt` | Abre todo y declara el sitemap |
| `sitemap.xml` | `public/sitemap.xml` | El `lastmod` lo sella el build |
| `meta robots` + canonical | `index.html` | `index, follow` y canonical autorreferente |
| JSON-LD | `index.html` | Un solo `@graph`: Organization, Person, WebSite, WebPage, 5 Service, OfferCatalog y FAQPage |
| Nombres | `index.html` | `name` es Morphiq; `alternateName`, Astral Morphiq Systems. Igual en Organization, WebSite y `og:site_name` |
| Favicon | `public/favicon*` | Cuadrados 1:1 sacados del símbolo del hero. Google descarta el favicon que no lo es |
| Imagen social | `public/og-morphiq.jpg` | 1200×630 |
| `<noscript>` | `index.html` | Red de seguridad para rastreadores que no ejecutan JavaScript |
| `noindex` en `*.vercel.app` | `vercel.json` | Evita que la copia de Vercel compita con el dominio real |

## Documentación

El mapeo completo del repositorio, la auditoría y el plan de rediseño están en
[`docs/`](./docs/INDEX.md):

| Documento | Contenido |
| --- | --- |
| [INDEX](./docs/INDEX.md) | Índice de toda la documentación |
| [PROJECT](./docs/PROJECT.md) | Producto, audiencia, objetivos, stack, decisiones |
| [FILEMAP](./docs/FILEMAP.md) | Inventario archivo por archivo y grafo de importaciones |
| [MODULES](./docs/MODULES.md) | Componentes: props, estado, efectos, accesibilidad, coste |
| [DESIGN-SYSTEM](./docs/DESIGN-SYSTEM.md) | Tokens, tipografía, color, movimiento, deuda visual |
| [CONTENT](./docs/CONTENT.md) | Inventario de copy, voz y tono, huecos de conversión |
| [VERCEL](./docs/VERCEL.md) | Proyectos, dominios, caché, cabeceras, hallazgos de infraestructura |
| [AUDIT](./docs/AUDIT.md) | 50 hallazgos con severidad, evidencia y arreglo |
| [REDESIGN](./docs/REDESIGN.md) | Propuesta de rediseño y sistema nuevo |
| [ROADMAP](./docs/ROADMAP.md) | Ejecución por fases con criterios de aceptación |
| [CHANGELOG-REDESIGN](./docs/CHANGELOG-REDESIGN.md) | Qué cambió en el rediseño v3 y cómo volver atrás |

## Contacto

Miguel Huerta Bautista  
contacto@morphiq.com.mx  
WhatsApp: 55 2311 8153  
Xochimilco · CDMX
