# FILEMAP — inventario archivo por archivo

Todo lo que existe en el repositorio (excluyendo `node_modules`, `.git`, `dist`).
**23 archivos versionados. 4 519 líneas de código propio.**

## Árbol

```
MH-web-2.0/
├── .gitignore                      node_modules, dist, .vercel, .env*, *.log, .DS_Store
├── README.md                       39 líneas · presentación breve del proyecto
├── eslint.config.js                27 líneas · flat config ESLint 9
├── index.html                      57 líneas · shell HTML, meta, JSON-LD  ⚠️
├── package.json                    36 líneas · deps y scripts
├── package-lock.json               135 KB
├── vite.config.js                   9 líneas · plugin react, target es2020
│
├── brand-assets/
│   └── mh-logo-source.png          676 KB · fuente del logo, NO se publica
│
├── public/                         → copiado tal cual a la raíz del sitio
│   ├── mh-logo-v2-1080.png         456 KB · textura WebGL + og:image        ⚠️
│   ├── mh-logo-v2-720.png          232 KB · favicon, loader, brand, contacto ⚠️
│   ├── robots.txt                    4 líneas · allow all + sitemap
│   └── sitemap.xml                   8 líneas · una sola URL, sin lastmod
│
└── src/
    ├── main.jsx                    12 líneas · createRoot + imports de fuentes
    ├── App.jsx                     71 líneas · composición, Lenis, loader, scroll meter
    ├── data.js                    139 líneas · CONTACT, CAPABILITIES, PROJECTS, PROCESS
    ├── styles.css               3 152 líneas · TODO el CSS del sitio          ⚠️
    │
    ├── hooks/
    │   ├── useMediaQuery.js        15 líneas
    │   └── useReducedMotion.js     15 líneas
    │
    └── components/
        ├── Brand.jsx               19 líneas · logo + wordmark
        ├── Navigation.jsx          79 líneas · header + menú móvil
        ├── PageLoader.jsx          67 líneas · pantalla de carga
        ├── Hero.jsx               135 líneas · sección 1 + decisión 3D/estático
        ├── HeroScene.jsx          181 líneas · escena three.js
        ├── WebGLBoundary.jsx       20 líneas · ErrorBoundary de clase
        ├── CapabilityDeck.jsx     215 líneas · manifiesto + tabs de servicios
        ├── WorkSection.jsx        134 líneas · 4 casos con maquetas
        ├── ProcessSection.jsx      63 líneas · consola de 4 fases
        └── ContactSection.jsx      49 líneas · contacto + footer
```

## Detalle por archivo

### Raíz

#### `index.html` (57 líneas)
Shell servido por Vercel. Contiene:
- `lang="es"`, `theme-color: #f2efe6`, `color-scheme: light dark`
- Meta description y keywords (keywords ya no la usa ningún buscador)
- Open Graph: `og:type`, `og:locale`, `og:title`, `og:description`,
  `og:image` (`/mh-logo-v2-1080.png`), `og:url`
- `<link rel="icon">` y `<link rel="preload" as="image">` al PNG de 232 KB
- JSON-LD `ProfessionalService` con teléfono, email, dirección, `sameAs` GitHub
- `<a class="skip-link" href="#contenido">` — **el destino `#contenido` no
  existe en ningún archivo del proyecto. El enlace de salto está roto.**
- Faltan: `<link rel="canonical">`, `twitter:card`, `og:image:width/height`

#### `package.json` / `package-lock.json`
10 dependencias de producción, 9 de desarrollo. Sin `engines`, sin
`@vercel/analytics`, sin `@vercel/speed-insights`.

#### `vite.config.js` (9 líneas)
Mínimo: `react()` y `build.target = 'es2020'`. Sin `manualChunks`, sin alias de
rutas, sin plugin de compresión ni de imágenes.

#### `eslint.config.js` (27 líneas)
Flat config con `js.configs.recommended`, `react-hooks` y `react-refresh`.
Regla propia: `no-unused-vars` ignora variables que empiezan en mayúscula
(por eso `motion as Motion` no marca error). No incluye `eslint-plugin-jsx-a11y`
— por eso los problemas de accesibilidad no se detectan solos.

### `public/` — se sirve en la raíz del dominio

| Archivo | Peso | Uso |
| --- | --- | --- |
| `mh-logo-v2-1080.png` | 456 KB | Textura de las 6 capas del `LogoStack` en WebGL, `StaticHeroMark`, `og:image` |
| `mh-logo-v2-720.png` | 232 KB | Favicon, `<link preload>`, `PageLoader`, `Brand` (renderizado a 44×40 px), `ContactSection` |
| `robots.txt` | 79 B | `Allow: /` + sitemap |
| `sitemap.xml` | 243 B | Una URL, `changefreq monthly`, `priority 1.0`, sin `lastmod` |

Problema transversal: **un PNG de 232 KB se usa como favicon y se dibuja a
44×40 px en el header**. No hay WebP/AVIF, ni variantes por tamaño, ni SVG.

### `src/` — raíz

#### `main.jsx` (12 líneas)
```
createRoot(#root) → <StrictMode><App/></StrictMode>
```
Importa `@fontsource-variable/manrope` y `@fontsource-variable/syne` **completos**
(el índice de cada paquete incluye latin, latin-ext, cyrillic, greek y
vietnamese). El build genera 8 archivos `.woff2`; el sitio solo necesita latin y
latin-ext.

#### `App.jsx` (71 líneas)
- Calcula `whatsappUrl` una sola vez a nivel de módulo desde `CONTACT` y
  `WHATSAPP_MESSAGE`
- `useSmoothScroll(enabled)`: instancia Lenis con `duration: 1.05`,
  `wheelMultiplier: 0.9`; se salta si `prefers-reduced-motion`; limpia el RAF y
  destruye la instancia al desmontar. Se activa **solo cuando el loader termina**
- Estado `loading` → alterna la clase `is-loading` en `<body>` (bloquea scroll)
- `useScroll()` de motion alimenta la barra `.scroll-meter` fija arriba
- Orden de render: `PageLoader` → `scroll-meter` → `Navigation` → `main`
  (`Hero`, `CapabilityDeck`, `WorkSection`, `ProcessSection`, `ContactSection`)
  → `.floating-contact`
- **`<main>` no tiene `id`**, por eso el skip link de `index.html` no llega a nada

#### `data.js` (139 líneas)
Única fuente de datos estructurados. Cuatro exports:

| Export | Forma | Consumido por |
| --- | --- | --- |
| `CONTACT` | objeto: owner, phone, whatsapp, email, location | `App.jsx`, `ContactSection` |
| `WHATSAPP_MESSAGE` | string con el mensaje pre-cargado | `App.jsx` |
| `CAPABILITIES` | 4 objetos: id, index, label, eyebrow, title, description, accent, ink, foreground, tags[], screen | `CapabilityDeck` |
| `PROJECTS` | 4 objetos: index, client, category, description, tags[], accent, surface, visual | `WorkSection` |
| `PROCESS` | 4 objetos: index, title, text | `ProcessSection` |

Los campos `screen` y `visual` son claves que mapean a componentes de maqueta
(`SCREENS`, `VISUALS`). Acoplamiento por string: si se renombra una clave el
componente se rompe en tiempo de ejecución, no en el build.

**Ningún proyecto tiene campo `url`** — los casos no enlazan a nada.

#### `styles.css` (3 152 líneas, 53.7 KB → 14.2 KB gzip)
Un solo archivo. Estructura real:

| Rango | Contenido |
| --- | --- |
| 1–21 | `:root` con 14 custom properties |
| 22–105 | Reset, `html`/`body`, `::selection`, `:focus-visible`, `.skip-link`, `.scroll-meter` |
| 106–172 | Utilidades: `.section-pad`, `.section-index`, `.tactile-button` + variantes |
| 174–305 | Loader (incluye 2 `@keyframes`) |
| 307–495 | Navegación: `.nav-shell`, `.brand`, `.mobile-nav` |
| 497–783 | Hero: layout, tipografía, escenario 3D, marca estática, ticker |
| 785–900 | Manifiesto |
| 903–1165 | Deck de capacidades: selector, panel, chrome, controles |
| 1167–1587 | **Maquetas decorativas** de los 4 servicios (website, pos, crm, automation) |
| 1589–1705 | Sección de trabajo y contenedor de escenas |
| 1706–2205 | **Maquetas decorativas** de los 4 casos (confetti, hipico, fiesta, berlin) |
| 2207–2396 | Consola de proceso (pantalla, perilla, interruptores) |
| 2398–2595 | Contacto y footer |
| 2596–2635 | Botón flotante de WhatsApp |
| 2636–3142 | Tres breakpoints: `max-width: 1180px`, `900px`, `640px` |
| 3143–3152 | `prefers-reduced-motion: reduce` global |

Observaciones: 52 usos de `clamp()` (escala fluida bien aplicada), 30
`position: absolute`, **~830 líneas (26 %) dedicadas exclusivamente a las
maquetas decorativas** de servicios y casos. Sin variables de espaciado, sin
escala tipográfica nombrada, sin modo oscuro pese a declarar
`color-scheme: light dark`.

### `src/hooks/`

#### `useMediaQuery.js` (15 líneas)
`matchMedia` + listener `change`. Estado inicial `false` — durante el primer
render siempre reporta "no coincide", se corrige en el efecto. Suficiente para
un sitio sin SSR.

#### `useReducedMotion.js` (15 líneas)
Idéntico al anterior pero con la consulta fija
`(prefers-reduced-motion: reduce)`. Podría implementarse como
`useMediaQuery('(prefers-reduced-motion: reduce)')` — duplicación menor.

### `src/components/`

#### `Brand.jsx` (19 líneas)
Enlace a `#inicio` con placa del logo + wordmark (`MH ASTRAL` / `SYSTEMS`).
Props: `compact` (oculta el texto), `inverted` (tema oscuro). El `<img>` lleva
`alt=""` correcto porque el `aria-label` del enlace ya nombra la marca.

#### `Navigation.jsx` (79 líneas)
Header fijo + panel móvil.
- `LINKS` es una constante local con 4 pares `[etiqueta, ancla]`
- Estado `open`; alterna la clase `menu-open` en `<body>` y escucha `Escape`
- El panel móvil se anima con `clipPath` vía `AnimatePresence`
- El botón hamburguesa declara `aria-expanded` pero **no `aria-controls`**, y al
  abrir **no se mueve el foco al panel ni se atrapa dentro** — ver `AUDIT.md`

#### `PageLoader.jsx` (67 líneas)
Pantalla de carga con barra de progreso simulada.
- Un `setInterval` de 80 ms sube el progreso asintóticamente hasta 88 %
- Espera en paralelo: `image.decode()` del logo, `document.fonts.ready` y el
  evento `load` de la ventana
- Cuando todo resuelve, impone un **mínimo de 900 ms** desde el arranque, luego
  100 %, luego 150 ms, luego animación de salida de 520 ms
- **Coste real: entre 1.5 y 2.5 s de contenido oculto**, porque `window.load`
  espera también a las imágenes de 456 KB y 232 KB
- `aria-live="polite"` en el contenedor completo: anuncia demasiado

#### `Hero.jsx` (135 líneas)
Sección 1 y la lógica de degradación del 3D.
- `HeroScene` se importa con `lazy()` → chunk separado
- Detecta WebGL creando un `<canvas>` de prueba y llamando `getContext('webgl2')`
  con fallback a `webgl`; libera el contexto con `WEBGL_lose_context`
- `showStatic = reducedMotion || compactDevice || !webglAvailable`
- Envuelve la escena en `WebGLBoundary` + `Suspense`, ambos con
  `StaticHeroMark` como respaldo. **Esta cascada de respaldos está bien hecha**
- Contiene copy incrustado: titular, lead, credenciales (`01 Atención directa`,
  `02 Diseño + desarrollo`, `03 CDMX`) y el ticker de 8 elementos
- Usa `<em>` y `<strong>` en el `<h1>` solo por estilo visual

#### `HeroScene.jsx` (181 líneas) — el archivo más caro del proyecto
Escena three.js. Genera el chunk de **903 KB (245 KB gzip)**.
- `LogoStack`: 6 planos con la misma textura PNG a distintas profundidades y
  opacidades, simulando grosor
- `OrbitNode` ×4: `RoundedBox` con material emisivo + `pointLight` cada uno
- `SystemCore`: disco `meshPhysicalMaterial` con clearcoat, dos grupos de anillos
  (`torusGeometry`) que rotan, una `Line` de señal, `Sparkles` (34 partículas)
- Rig que sigue el puntero con `THREE.MathUtils.damp`
- Iluminación: 1 ambiental + 2 direccionales + 1 puntual + 4 puntuales de los
  nodos = **8 luces**, varias con materiales físicos. Caro para GPUs integradas
- `dpr={[1, 1.5]}`, `AdaptiveDpr`, `frameloop` en `demand` si hay reduced motion
- Importa de drei: `AdaptiveDpr, Float, Line, Preload, RoundedBox, Sparkles,
  useTexture` — `Line` arrastra `three-stdlib` completo

#### `WebGLBoundary.jsx` (20 líneas)
`ErrorBoundary` de clase (obligatorio, no hay equivalente en hooks). Muestra
`props.fallback` si la escena revienta. Solo hace `console.warn` en DEV.

#### `CapabilityDeck.jsx` (215 líneas)
Exporta **dos secciones**: `.manifesto` y `.capabilities`.
- 4 componentes de maqueta locales: `WebsiteScreen`, `PosScreen`, `CrmScreen`,
  `AutomationScreen`, registrados en el mapa `SCREENS`
- Estado `activeId`; el panel recibe `--accent`, `--panel-ink` y `--panel-fg`
  por estilo inline desde `data.js`
- `AnimatePresence mode="wait"` para copy y pantalla por separado
- Patrón tabs: `role="tablist"` / `role="tab"` / `role="tabpanel"`, pero **sin
  `id` en los tabs, sin `aria-labelledby` en el panel, sin `tabindex` y sin
  navegación con flechas** — patrón ARIA incompleto
- El indicador de progreso calcula `findIndex(...) / 3` — el `3` está
  incrustado; si se agrega una quinta capacidad, se rompe

#### `WorkSection.jsx` (134 líneas)
4 componentes de maqueta locales (`ConfettiVisual`, `HipicoVisual`,
`FiestaVisual`, `BerlinVisual`) en el mapa `VISUALS`, más `ProjectScene`, que
recibe `--scene-accent`, `--scene-surface` y `--stack-index` por estilo inline.
Cierra con `.work__truth` («Sin testimonios inventados…»).
**Ninguna tarjeta enlaza al sitio real del cliente.**

#### `ProcessSection.jsx` (63 líneas)
Consola de 4 fases con perilla giratoria (`--rotation: ${i*78 - 110}deg`) e
interruptores. Estado `activeIndex`. Marca los botones con `role="tab"` pero
**la pantalla que cambia no es un `tabpanel`** y no hay `aria-controls`.

#### `ContactSection.jsx` (49 líneas)
Sección de contacto + `<footer>`. Lee `CONTACT` para email, nombre, ubicación y
teléfono. Tarjeta grande de WhatsApp. Footer con `Brand inverted`, 4 enlaces y
copyright con año dinámico.

## Grafo de importaciones

```
main.jsx
└── App.jsx
    ├── data.js ....................... CONTACT, WHATSAPP_MESSAGE
    ├── lenis, motion/react, lucide-react
    ├── PageLoader.jsx
    ├── Navigation.jsx ──── Brand.jsx
    ├── Hero.jsx
    │   ├── hooks/useMediaQuery.js
    │   ├── hooks/useReducedMotion.js
    │   ├── WebGLBoundary.jsx
    │   └── HeroScene.jsx  (lazy) ──── three, @react-three/fiber, @react-three/drei
    ├── CapabilityDeck.jsx ─── data.js (CAPABILITIES)
    ├── WorkSection.jsx ────── data.js (PROJECTS)
    ├── ProcessSection.jsx ─── data.js (PROCESS)
    └── ContactSection.jsx ─── data.js (CONTACT) + Brand.jsx
```

Sin dependencias circulares. `Brand.jsx` es el único componente reutilizado
(Navigation ×2, ContactSection ×1). Todos los demás se usan una sola vez.

## Archivos que faltan

| Archivo | Para qué |
| --- | --- |
| `vercel.json` | Cabeceras de caché y seguridad — hoy los PNG se sirven con `max-age=0` |
| `.env.example` | El `.gitignore` ya lo contempla, pero no existe |
| `og-image.jpg` (1200×630) | Hoy la tarjeta social es el logo con transparencia |
| `site.webmanifest` | PWA / icono en Android |
| `favicon.svg` / `.ico` | Hoy el favicon es un PNG de 232 KB |
| `CLAUDE.md` o `CONTRIBUTING.md` | Convenciones del repo |
| Tests / CI | No hay ninguno |
