# ROADMAP — plan de ejecución

Orden de trabajo con criterios de aceptación. Cada fase deja el sitio en estado
publicable: nada queda a medias entre fases.

Las referencias tipo `A1`, `P3`, `V1`, `U4` corresponden a los IDs de
[`AUDIT.md`](./AUDIT.md).

---

## Fase 0 — Medir antes de tocar
**Por qué primero:** sin línea base, ningún cambio posterior se puede evaluar.

| # | Tarea | Cierra |
| --- | --- | --- |
| 0.1 | Instalar `@vercel/analytics` y `@vercel/speed-insights` | V3, U2 |
| 0.2 | Conectar el repositorio de GitHub al proyecto `mh-web-2-0` en Vercel | V4 |
| 0.3 | Confirmar y consolidar la asignación del dominio en un solo proyecto | V7 |
| 0.4 | Retirar del aire el sitio v1 (`mh-astral-systems.vercel.app`) | V2, S1 |
| 0.5 | Crear `vercel.json` con caché y cabeceras de seguridad | V1, V5, V6 |
| 0.6 | Registrar la línea base: Lighthouse móvil y escritorio, guardada en `docs/baseline/` | — |

**Aceptación:** el panel de Vercel muestra visitas reales; `git push` a la rama
principal dispara un deploy; `curl -I` sobre `/assets/*.js` devuelve
`max-age=31536000, immutable`; `mh-astral-systems.vercel.app` ya no responde 200
con el sitio viejo.

---

## Fase 1 — Arreglos rápidos de alto impacto
Cambios pequeños, sin rediseño, con retorno inmediato. Se pueden publicar el
mismo día.

| # | Tarea | Cierra |
| --- | --- | --- |
| 1.1 | `<main id="contenido">` en `App.jsx` — arregla el enlace de salto | A1 |
| 1.2 | `--muted: #74756f` → `#5f6059` | A2 |
| 1.3 | Importar solo los subsets latinos de las fuentes | P4 |
| 1.4 | **Añadir `url` a los 4 proyectos + enlace «Ver sitio en vivo ↗»** | U1 |
| 1.5 | Variar el mensaje de WhatsApp por origen del CTA | U6 |
| 1.6 | `aria-hidden="true"` en las 8 maquetas decorativas | A6 |
| 1.7 | `aria-hidden` en los 51 `<i>` decorativos | A5 |
| 1.8 | `<link rel="canonical">` + `og:site_name` + `twitter:card` | S3, S8 |
| 1.9 | Quitar `<meta keywords>`; `color-scheme: light` | S7, A9 |
| 1.10 | Corregir `findIndex(...)/3` → `/(CAPABILITIES.length - 1)` | C5 |
| 1.11 | Añadir `<lastmod>` al sitemap | S6 |

**Aceptación:** `npm run lint && npm run build` pasan; Tab desde el inicio lleva
al contenido; las 4 tarjetas de caso enlazan a sitios reales que cargan;
Lighthouse accesibilidad ≥ 95.

> 1.4 es la tarea de mayor retorno del roadmap completo. La prueba social ya
> existe y está desplegada; solo falta enlazarla.

---

## Fase 2 — Peso y velocidad
Sin cambiar el diseño, quitar todo lo que sobra.

| # | Tarea | Cierra |
| --- | --- | --- |
| 2.1 | Eliminar el loader; sustituirlo por entrada animada del hero | P1 |
| 2.2 | Exportar el logo a SVG; generar `favicon.ico` de 32×32 | P3 |
| 2.3 | Generar WebP para los usos en pantalla; comprimir el PNG de la textura | P3 |
| 2.4 | Crear `public/og-image.jpg` de 1200×630 + meta de dimensiones | S2 |
| 2.5 | `manualChunks` para separar el vendor de React | P5 |
| 2.6 | Precargar el woff2 latino de Syne + `font-display: swap` | P6 |
| 2.7 | Decidir ruta A o B para el hero 3D — **prototipar antes de borrar** | P2 |

**Aceptación:** peso total de primera visita < 700 KB; LCP móvil simulado
< 2.5 s; la tarjeta de WhatsApp se ve correcta en el validador de Facebook.

---

## Fase 3 — Sistema de diseño
Refactor de estilos sin cambiar todavía la estructura de la página.

| # | Tarea | Cierra |
| --- | --- | --- |
| 3.1 | Crear `styles/tokens.css` con el sistema de `REDESIGN.md` §5 | C2 |
| 3.2 | Dividir `styles.css` en `styles/sections/*.css` | C2 |
| 3.3 | Extraer las maquetas a `components/mockups/` | C2 |
| 3.4 | Crear la primitiva `Button` sobre `.tactile-button` | — |
| 3.5 | Crear `SectionHeading` y eliminar la triple duplicación | C8 |
| 3.6 | Crear `Tabs` con patrón ARIA completo (flechas, `id`, `aria-labelledby`) | A4 |
| 3.7 | Trampa de foco en el menú móvil + `role="dialog"` | A3 |
| 3.8 | `Reveal` + `useInViewAnimation` — entradas por scroll | — |
| 3.9 | Extender el ruido de papel a toda la página | — |
| 3.10 | Reescribir `useReducedMotion` sobre `useMediaQuery`; limpiar timers | C6, C7 |

**Aceptación:** ningún valor de color, espaciado, radio o sombra fuera de
`tokens.css`; navegación con flechas funciona en ambos grupos de tabs; el foco
queda atrapado en el menú móvil; con `prefers-reduced-motion` no se mueve nada.

---

## Fase 4 — Contenido y estructura
Aquí ocurre el rediseño de verdad.

| # | Tarea | Cierra |
| --- | --- | --- |
| 4.1 | Migrar todo el copy a `src/content/` | C1 |
| 4.2 | Reordenar: Trabajo sube por encima de Capacidades | — |
| 4.3 | Sección **Inversión** con rangos y modelo de cobro | U4 |
| 4.4 | Duración por fase en Proceso | U5 |
| 4.5 | Sección **Sobre mí** (absorbe el manifiesto) | U7 |
| 4.6 | Sección **FAQ** con 8 preguntas | — |
| 4.7 | Formulario de contacto junto a WhatsApp | U3 |
| 4.8 | Quitar el ticker en inglés del hero | U9 |
| 4.9 | Acento tenue de fondo por sección | — |
| 4.10 | Verificar el botón flotante a 360×640 | U8 |

**Aceptación:** el copy se edita sin abrir un componente; la página responde
precio y tiempo sin necesidad de escribir; el formulario entrega mensajes de
prueba correctamente.

---

## Fase 5 — SEO y cierre
| # | Tarea | Cierra |
| --- | --- | --- |
| 5.1 | JSON-LD completo: `image`, `logo`, `priceRange`, `geo`, `serviceType`, `sameAs` | S4 |
| 5.2 | JSON-LD `FAQPage` desde `content/faq.js` | S4 |
| 5.3 | `.env.example` + variables documentadas | V8 |
| 5.4 | Workflow de GitHub Actions: `lint` + `build` en cada push | C4 |
| 5.5 | Actualizar `README.md` y los documentos de `docs/` al estado nuevo | — |
| 5.6 | Lighthouse final móvil y escritorio; comparar contra la línea base | — |

**Aceptación:** el validador de resultados enriquecidos de Google acepta ambos
bloques JSON-LD sin errores; CI en verde; Lighthouse rendimiento > 92 y
accesibilidad = 100.

---

## Fase 6 — Opcional, según lo que digan los datos
No empezar antes de tener 4 semanas de analítica.

| # | Tarea | Cierra |
| --- | --- | --- |
| 6.1 | Router + una página por servicio, cada una con su JSON-LD | S5 |
| 6.2 | Migración a TypeScript | C3 |
| 6.3 | Tests de componentes (Vitest + Testing Library) | C4 |
| 6.4 | Modo oscuro real | A9 |
| 6.5 | Casos de estudio extendidos, uno por proyecto | — |
| 6.6 | Aviso de privacidad (obligatorio si el formulario guarda datos) | — |

---

## Orden recomendado si el tiempo es poco

Si solo hubiera tiempo para cinco cosas, en este orden:

1. **1.4** — enlazar los casos a los sitios en vivo *(prueba social gratis, ya existe)*
2. **0.1** — instalar la analítica *(sin datos no se puede decidir nada)*
3. **2.1** — eliminar el loader *(el mayor golpe de velocidad percibida)*
4. **4.3** — sección de inversión *(la objeción número uno del mercado objetivo)*
5. **1.1 + 1.2** — skip link y contraste *(dos líneas, cierran dos fallos WCAG)*

## Convenciones de trabajo

- Rama de desarrollo: `claude/website-audit-redesign-yqxavo`
- Un commit por tarea del roadmap, referenciando su ID:
  `fix(a11y): añade id al main para el skip link (A1)`
- `npm run lint && npm run build` deben pasar antes de cada commit
- Al cerrar un hallazgo, marcarlo ✅ en `AUDIT.md` — no borrarlo
- Al cambiar estructura de archivos, actualizar `FILEMAP.md` y `MODULES.md` en
  el mismo commit
