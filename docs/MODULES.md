# MODULES — componentes, estado y contratos

Referencia técnica de cada módulo React: qué recibe, qué guarda, qué efectos
dispara y de qué depende. Consultar antes de modificar cualquier componente.

## Árbol de render

```
<React.StrictMode>
 └─ <App>
    ├─ {loading && <PageLoader onComplete={finishLoading} />}   ← overlay, se desmonta
    ├─ <Motion.div class="scroll-meter" style={{scaleX: scrollYProgress}} />
    ├─ <Navigation whatsappUrl>
    │   ├─ <header class="nav-shell">
    │   │   ├─ <Brand />
    │   │   ├─ <nav> ×4 anclas
    │   │   ├─ <a class="nav-shell__cta">
    │   │   └─ <button class="nav-shell__menu">
    │   └─ <AnimatePresence>{open && <Motion.div class="mobile-nav">}
    │       └─ <Brand inverted />
    ├─ <main>                                    ← sin id (skip link roto)
    │   ├─ <Hero whatsappUrl>
    │   │   ├─ section#inicio
    │   │   └─ hero__canvas
    │   │       ├─ <StaticHeroMark />                      si showStatic
    │   │       └─ <WebGLBoundary fallback={StaticHeroMark}>  si no
    │   │           └─ <Suspense fallback={StaticHeroMark}>
    │   │               └─ <HeroScene reducedMotion />   ← lazy chunk
    │   ├─ <CapabilityDeck>
    │   │   ├─ section.manifesto
    │   │   └─ section#servicios
    │   │       ├─ selector ×4 (tablist)
    │   │       └─ panel → <Screen /> de SCREENS[active.screen]
    │   ├─ <WorkSection>
    │   │   └─ section#trabajo → <ProjectScene> ×4 → <Visual /> de VISUALS[project.visual]
    │   ├─ <ProcessSection>
    │   │   └─ section#proceso → consola + 4 interruptores
    │   └─ <ContactSection whatsappUrl>
    │       ├─ section#contacto
    │       └─ <footer> → <Brand inverted />
    └─ <a class="floating-contact">              ← WhatsApp persistente
```

## Contratos de props

| Componente | Props | Tipo | Obligatoria | Nota |
| --- | --- | --- | --- | --- |
| `App` | — | — | — | Raíz |
| `PageLoader` | `onComplete` | `() => void` | sí | Debe ser estable (`useCallback` en App) o el efecto se reinicia |
| `Navigation` | `whatsappUrl` | `string` | sí | |
| `Brand` | `compact` | `boolean` | no (`false`) | Oculta el wordmark |
| `Brand` | `inverted` | `boolean` | no (`false`) | Tema oscuro |
| `Hero` | `whatsappUrl` | `string` | sí | |
| `HeroScene` | `reducedMotion` | `boolean` | no (`false`) | Congela rotaciones y `Sparkles`; pasa `frameloop` a `demand` |
| `WebGLBoundary` | `fallback`, `children` | `ReactNode` | sí | |
| `CapabilityDeck` | — | — | — | Lee `CAPABILITIES` directamente |
| `WorkSection` | — | — | — | Lee `PROJECTS` directamente |
| `ProjectScene` | `project`, `index` | objeto, número | sí | Interno del módulo |
| `ProcessSection` | — | — | — | Lee `PROCESS` directamente |
| `ContactSection` | `whatsappUrl` | `string` | sí | |

No hay validación de props (`prop-types` ni TypeScript). Los contratos son
implícitos.

## Estado

Todo el estado es local. **No hay contexto, ni store, ni estado de servidor.**

| Dónde | Estado | Valor inicial | Quién lo cambia |
| --- | --- | --- | --- |
| `App` | `loading` | `true` | `PageLoader` vía `onComplete` |
| `Navigation` | `open` | `false` | Botón hamburguesa / botón cerrar / `Escape` / click en enlace |
| `Hero` | `webglAvailable` | `false` | Efecto de detección de contexto |
| `PageLoader` | `progress` | `8` | Intervalo de 80 ms y resolución de promesas |
| `PageLoader` | `leaving` | `false` | Cadena final de temporizadores |
| `CapabilityDeck` | `activeId` | `CAPABILITIES[0].id` | Click en el selector |
| `ProcessSection` | `activeIndex` | `0` | Click en interruptor |

Estado derivado de `motion`: `useScroll().scrollYProgress` en `App`, mapeado a
`scaleX` de la barra superior.

## Efectos secundarios y limpieza

| Componente | Efecto | Limpieza | Estado |
| --- | --- | --- | --- |
| `App` | `useSmoothScroll` — instancia Lenis + bucle RAF | `cancelAnimationFrame` + `lenis.destroy()` | ✅ correcta |
| `App` | Clase `is-loading` en `<body>` | `classList.remove` | ✅ correcta |
| `Navigation` | Clase `menu-open` + listener `keydown` | Ambos removidos | ✅ correcta |
| `Hero` | Crea canvas de prueba WebGL | Llama `WEBGL_lose_context` en `finally` | ✅ correcta |
| `PageLoader` | `setInterval` + 3 `setTimeout` anidados + `window.load` | Bandera `mounted`, limpia intervalo y `finishTimer` | ⚠️ los `setTimeout` internos (150 ms y 520 ms) **no se guardan ni se limpian**; los cubre la bandera `mounted`, así que no hay fuga real, pero es frágil |
| `useMediaQuery` | Listener `change` | `removeEventListener` | ✅ correcta |
| `useReducedMotion` | Listener `change` | `removeEventListener` | ✅ correcta |
| `HeroScene` | `useFrame` ×5, `useTexture` | Gestionadas por R3F | ✅ |

Bajo `StrictMode` en desarrollo los efectos se montan dos veces; ninguno tiene
efectos de red ni mutaciones acumulativas, así que es seguro.

## Mapas de string → componente

Dos registros acoplan datos con componentes por clave de texto. Si una clave de
`data.js` no existe en el mapa, `Screen`/`Visual` es `undefined` y **React lanza
en tiempo de ejecución**, no en el build.

```js
// CapabilityDeck.jsx
const SCREENS = { website, pos, crm, automation };     // ← data.js: capability.screen

// WorkSection.jsx
const VISUALS = { confetti, hipico, fiesta, berlin };  // ← data.js: project.visual
```

## Comunicación entre módulos

- **Descendente:** props (`whatsappUrl` es la única que cruza más de un nivel)
- **Ascendente:** un solo callback, `PageLoader.onComplete`
- **Lateral:** ninguna. Los componentes no se hablan entre sí
- **Global implícito:** clases en `<body>` (`is-loading`, `menu-open`) que el CSS
  consume para bloquear el scroll. Es un canal frágil pero funciona
- **Estilos dinámicos:** custom properties inline (`--accent`, `--panel-ink`,
  `--panel-fg`, `--scene-accent`, `--scene-surface`, `--stack-index`,
  `--rotation`). Este patrón es bueno y conviene conservarlo en el rediseño

## Carga diferida y división de código

Un único punto de división:

```js
const HeroScene = lazy(() => import('./HeroScene').then(m => ({ default: m.HeroScene })));
```

Produce `HeroScene-*.js` de **903 KB (245 KB gzip)**. Solo se descarga si
`!reducedMotion && !compactDevice && webglAvailable`. En móvil (≤ 640 px) nunca
se pide — decisión correcta, es la mayor optimización que ya tiene el sitio.

El resto (React, motion, lenis, lucide, todos los componentes) va en el bundle
principal de 330 KB. `vite.config.js` no define `manualChunks`.

## Accesibilidad por módulo

| Módulo | Bien | Mal |
| --- | --- | --- |
| `Brand` | `aria-label` en el enlace, `alt=""` en la imagen | — |
| `Navigation` | `aria-label` en `<nav>`, cierre con `Escape`, bloqueo de scroll | Sin `aria-controls`; el foco no entra ni queda atrapado en el panel móvil; el panel no es `role="dialog"`; al cerrar el foco no vuelve al botón |
| `PageLoader` | `role="progressbar"` con `aria-valuenow/min/max` | `aria-live="polite"` en todo el contenedor anuncia de más; oculta el contenido 1.5–2.5 s |
| `Hero` | Respeta `prefers-reduced-motion`, ticker con `aria-hidden` | `<em>`/`<strong>` usados como estilo en el `h1`; `<i>` decorativos sin `aria-hidden` |
| `CapabilityDeck` | `role=tablist/tab/tabpanel`, `aria-selected`, `aria-controls` | Tabs sin `id`; panel sin `aria-labelledby` ni `tabIndex={0}`; sin navegación con flechas ni `Home`/`End` |
| `WorkSection` | `<article>` semántico | Maquetas decorativas con texto real leído por lectores de pantalla; sin `aria-hidden` |
| `ProcessSection` | `role="tablist"`, `aria-selected` | La pantalla no es `tabpanel`; sin `aria-controls`; sin teclado de flechas |
| `ContactSection` | Enlaces `mailto:` y `wa.me` claros | El bloque de datos usa `<span>`/`<strong>` en lugar de una lista o `<address>` |
| `App` | `.scroll-meter` con `aria-hidden` | `<main>` sin `id="contenido"` → el skip link de `index.html` no funciona |

Conteo global: **51 elementos `<i>` decorativos** en los componentes y solo **20
atributos `aria-*`** en todo el proyecto.

## Rendimiento por módulo

| Módulo | Coste | Comentario |
| --- | --- | --- |
| `HeroScene` | 245 KB gzip + 8 luces + 6 planos con textura de 456 KB | El más caro con diferencia. Se puede lograr un efecto equivalente con CSS 3D o un canvas 2D ligero |
| `PageLoader` | Bloquea el render 1.5–2.5 s | Espera `window.load`, que a su vez espera los PNG grandes |
| Fuentes | 8 archivos `.woff2` (~133 KB) | Se cargan subsets cirílico, griego y vietnamita que el sitio nunca usa |
| `styles.css` | 14.2 KB gzip | Aceptable, pero 26 % son maquetas decorativas |
| Lenis | ~5 KB | Correcto, se apaga con reduced motion |
| `motion` | ~40 KB | Se usa en 5 componentes; `AnimatePresence` es la parte cara |
| `lucide-react` | ~8 KB efectivos | 10 iconos importados por nombre, tree-shaking funciona |

## Oportunidades de refactor identificadas

1. `useReducedMotion` puede reescribirse sobre `useMediaQuery` (elimina 15 líneas duplicadas).
2. Extraer las 8 maquetas decorativas (`SCREENS` + `VISUALS`) a
   `src/components/mockups/` — hoy inflan dos archivos de componente y ~830
   líneas de CSS.
3. Mover el copy incrustado (hero, manifiesto, encabezados de sección,
   contacto, footer) a `data.js` o a `src/content/`, para tener una sola fuente
   de texto.
4. Añadir `id` a `<main>` y arreglar el skip link — una línea, arregla un fallo
   de accesibilidad de nivel A.
5. Extraer un componente `SectionHeading` reutilizable: hoy el patrón
   `section-index + h2 + p` está repetido en `.section-heading`,
   `.work__heading` y `.process__heading`, con tres bloques de CSS casi
   idénticos.
6. Extraer un componente `WhatsAppCTA` que centralice el enlace y permita
   añadir parámetros de seguimiento por ubicación.
7. Dividir `styles.css` en archivos por sección importados desde `main.jsx`, o
   migrar a CSS Modules por componente.
