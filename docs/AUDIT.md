# AUDIT — hallazgos con severidad

Auditoría del estado actual: rendimiento, accesibilidad, SEO, UX/conversión,
código e infraestructura. Cada hallazgo tiene ID, evidencia verificable y
arreglo concreto.

**Leyenda:** 🔴 crítico · 🟠 importante · 🟡 menor · ✅ resuelto

---

## Resumen

| Área | 🔴 | 🟠 | 🟡 | Total |
| --- | --- | --- | --- | --- |
| Rendimiento | 3 | 3 | 2 | 8 |
| Accesibilidad | 2 | 4 | 3 | 9 |
| SEO | 1 | 4 | 3 | 8 |
| UX / conversión | 3 | 4 | 2 | 9 |
| Código | 0 | 4 | 4 | 8 |
| Infraestructura | 3 | 4 | 1 | 8 |
| **Total** | **12** | **23** | **15** | **50** |

**Lo primero que hay que arreglar, en orden:** A1 (skip link roto), P1 (loader
bloqueante), V3 (sin analítica), U1 (casos sin enlace), V1 (sin caché).

---

## Rendimiento

### 🔴 P1 — El loader oculta el contenido entre 1.5 y 2.5 s
`src/components/PageLoader.jsx:19-36`

El loader espera tres cosas en paralelo: `image.decode()` del logo,
`document.fonts.ready` y el evento `load` de la ventana. **`window.load` espera a
que terminen todos los recursos**, incluidos los PNG de 456 KB y 232 KB. Encima
se impone un mínimo artificial de 900 ms, más 150 ms, más 520 ms de animación de
salida.

Efecto: el LCP no puede ocurrir antes de ~1.8 s ni en la mejor conexión. En 4G
mexicano promedio, más cerca de 3–4 s. Google marca LCP > 2.5 s como
"necesita mejorar".

**Arreglo:** esperar solo `document.fonts.ready` con un `Promise.race` contra un
timeout de 800 ms; eliminar el mínimo de 900 ms; no esperar `window.load`.
Alternativa mejor: eliminar el loader y animar la entrada del hero directamente.

### 🔴 P2 — Chunk 3D de 903 KB (245 KB gzip)
`dist/assets/HeroScene-*.js`

`HeroScene.jsx` importa three.js completo más `@react-three/fiber`, más siete
utilidades de drei (`Line` arrastra `three-stdlib` entero). Todo eso para
renderizar un logo con anillos y partículas.

Mitigación ya existente y correcta: no se descarga en móvil (≤ 640 px) ni con
reduced motion. Pero en escritorio son 245 KB antes de que la escena aparezca.

**Arreglo por orden de esfuerzo:**
1. Quitar `Line` y `Sparkles` de drei (usa `three-stdlib` completo) → ahorro
   estimado 60–80 KB gzip
2. Importar de `three` solo lo necesario en vez del namespace completo
3. Reevaluar: el mismo efecto de profundidad se logra con capas CSS 3D y
   `transform`, a coste cero de red

### 🔴 P3 — 688 KB de PNG sin optimizar
`public/mh-logo-v2-1080.png` (456 KB) · `public/mh-logo-v2-720.png` (232 KB)

Sin WebP, sin AVIF, sin SVG. El de 232 KB se usa como **favicon** y se dibuja a
**44×40 px** en el header. El de 456 KB se usa como textura WebGL y como
`og:image`.

**Arreglo:** exportar el logo a SVG (es un monograma, debería serlo), generar
`favicon.ico` de 32×32, generar WebP para el uso en pantalla, y conservar el PNG
solo como textura WebGL —comprimido. Ahorro estimado: 600 KB.

### 🟠 P4 — Se cargan subsets tipográficos que nunca se usan
`src/main.jsx:3-4`

`import '@fontsource-variable/manrope'` trae latin, latin-ext, cyrillic, greek y
vietnamese. El build genera **8 archivos `.woff2` (~133 KB)** para un sitio en
español.

**Arreglo:**
```js
import '@fontsource-variable/manrope/latin.css';
import '@fontsource-variable/syne/latin.css';
```
Ahorro: ~90 KB y 5 peticiones.

### 🟠 P5 — Bundle principal de 330 KB sin dividir
`vite.config.js`

React + motion + lenis + lucide + todos los componentes en un solo chunk. Sin
`manualChunks`.

**Arreglo:** separar `react`/`react-dom` en un chunk de vendor (cambia poco entre
deploys, se cachea mejor) y cargar `WorkSection`/`ProcessSection` de forma
diferida al hacer scroll.

### 🟠 P6 — Sin `<link rel="preload">` de la fuente crítica
`index.html`

Se precarga el PNG del logo (232 KB) pero no la fuente del titular. La secuencia
real es: HTML → CSS → CSS de Fontsource → woff2. Cuatro saltos antes de dibujar
el titular.

**Arreglo:** precargar el woff2 latino de Syne y añadir `font-display: swap`.

### 🟡 P7 — 30 elementos posicionados en absoluto animándose
`src/styles.css`

Discos, ecualizadores y pilotos animan propiedades que disparan repintado. En
GPUs integradas suma. Menor porque las animaciones son pequeñas.

### 🟡 P8 — CSS de 53.7 KB en un solo archivo bloqueante
26 % son maquetas decorativas que no aparecen hasta hacer scroll. Podría
diferirse.

---

## Accesibilidad

### 🔴 A1 — El enlace de salto no lleva a ninguna parte
`index.html:53` apunta a `#contenido` · `src/App.jsx:57` renderiza `<main>` **sin `id`**

Verificado: la cadena `contenido` no aparece en ningún otro archivo del
proyecto. Es el **primer elemento enfocable de la página** para quien navega con
teclado o lector de pantalla, y no hace nada.

**Arreglo:** `<main id="contenido">`. Una línea. Corrige un fallo WCAG nivel A
(2.4.1 Bypass Blocks).

### 🔴 A2 — `--muted` falla contraste AA
`src/styles.css:6` — `--muted: #74756f` sobre `--paper: #f2efe6`

Ratio calculado: **4.05:1**. WCAG AA exige 4.5:1 para texto normal. Se usa en
etiquetas, metadatos y textos pequeños de varias secciones —precisamente donde
el texto ya es chico.

**Arreglo:** `--muted: #5f6059` → ~5.6:1, mantiene el gris.

### 🟠 A3 — El menú móvil no atrapa el foco
`src/components/Navigation.jsx:46-76`

Al abrir el panel, el foco se queda en el botón hamburguesa detrás del overlay.
Con Tab se recorren los enlaces ocultos de la página. Al cerrar, el foco no
vuelve al botón. El panel no declara `role="dialog"` ni `aria-modal`.

**Arreglo:** mover el foco al panel al abrir, atrapar Tab dentro, devolverlo al
botón al cerrar, y añadir `role="dialog" aria-modal="true"`. El cierre con
`Escape` ya está bien resuelto.

### 🟠 A4 — Patrón de tabs incompleto en dos secciones
`src/components/CapabilityDeck.jsx:134-165` · `src/components/ProcessSection.jsx:39-54`

`CapabilityDeck` declara `role="tablist"/"tab"/"tabpanel"` y `aria-controls`,
pero los tabs no tienen `id`, el panel no tiene `aria-labelledby` ni
`tabIndex={0}`, y **no hay navegación con flechas**. El patrón ARIA de tabs exige
que ←/→ muevan entre pestañas y que solo la activa esté en el orden de tabulación.

`ProcessSection` es peor: los botones son `role="tab"` pero **la pantalla que
cambia no es un `tabpanel`** y no hay `aria-controls`.

**Arreglo:** completar el patrón en ambos, o quitar los roles ARIA y dejarlos
como botones simples —que es honesto y accesible por defecto.

### 🟠 A5 — 51 elementos `<i>` decorativos sin `aria-hidden`
Todo `src/components/`

`<i>` se usa como contenedor visual genérico (puntos, barras, pilotos, teclas).
Los lectores de pantalla los recorren y algunos contienen texto real
(`<i>01</i>`, `<i>{item.slice(0,2).toUpperCase()}</i>`, dígitos del teclado POS).

**Arreglo:** `aria-hidden="true"` en todo lo decorativo; usar `<span>` en lugar
de `<i>` (que significa "énfasis por voz alternativa", no "decoración").

### 🟠 A6 — Las maquetas decorativas se leen en voz alta
`CapabilityDeck.jsx:6-96` · `WorkSection.jsx:4-82`

Ninguna de las 8 maquetas lleva `aria-hidden`. Un lector de pantalla anuncia
`ORDEN #0284`, `2 Producto especial $420`, `7 8 9 4 5 6 1 2 3`, `LEVEL 88`… Es
ruido puro: son ilustraciones, no información.

**Arreglo:** `aria-hidden="true"` en el contenedor de cada maqueta, con una
descripción textual breve al lado para quien no las ve.

### 🟡 A7 — `aria-live` demasiado amplio en el loader
`src/components/PageLoader.jsx:46` — `aria-live="polite"` en todo el contenedor.
Debería estar solo en el porcentaje, o usar `role="status"`.

### 🟡 A8 — `<em>` y `<strong>` usados como estilo
`src/components/Hero.jsx:59-61` y varios más. Los lectores de pantalla enfatizan
palabras que no tienen énfasis semántico. Usar `<span>` con clase.

### 🟡 A9 — `color-scheme: light dark` sin estilos oscuros
`index.html:7`. Se le dice al navegador que el sitio soporta modo oscuro, pero
el CSS no tiene ninguna regla `prefers-color-scheme: dark`. Barras de scroll y
controles nativos pueden renderizarse oscuros sobre fondo claro.

**Arreglo:** cambiar a `color-scheme: light` hasta implementar modo oscuro de verdad.

---

## SEO

### 🔴 S1 — El sitio v1 antiguo sigue público e indexable
`https://mh-astral-systems.vercel.app` responde 200 con la versión anterior
completa; `robots.txt` no existe ahí (devuelve el HTML del SPA). Contenido
duplicado compitiendo con el dominio real. Ver `VERCEL.md` §2.

### 🟠 S2 — `og:image` es el logo, no una tarjeta social
`index.html:24` → `/mh-logo-v2-1080.png`

Es un logo con transparencia, no una imagen 1200×630. En WhatsApp, Facebook y
LinkedIn se recorta mal y el fondo transparente se vuelve negro o blanco según
la plataforma. **En un mercado donde el enlace se comparte por WhatsApp, esta es
la primera impresión del sitio.**

**Arreglo:** crear `public/og-image.jpg` de 1200×630 con logo, tesis y datos de
contacto sobre el papel de marca. Añadir `og:image:width`, `og:image:height`,
`og:image:alt` y `twitter:card="summary_large_image"`.

### 🟠 S3 — Sin `<link rel="canonical">`
El sitio responde en `mh-astral-systems.com`, `www.mh-astral-systems.com`,
`mh-web-2-0.vercel.app` y dos alias de equipo. Sin canónica, los buscadores
reparten la autoridad.

**Arreglo:** `<link rel="canonical" href="https://www.mh-astral-systems.com/" />`

### 🟠 S4 — JSON-LD incompleto para negocio local
`index.html:29-50`

`ProfessionalService` tiene nombre, fundador, email, teléfono, dirección y URL.
Le faltan: `image`, `logo`, `priceRange`, `geo`, `openingHoursSpecification`,
`serviceType`, `areaServed` estructurado y `sameAs` más allá de GitHub.

Para búsquedas del tipo *"diseño web Xochimilco"*, esos campos alimentan el panel
de conocimiento. **Es la palanca de SEO local más barata que existe.**

También conviene añadir un bloque `FAQPage` cuando exista la sección de FAQ, y
`WebSite` con `SearchAction`.

### 🟠 S5 — Una sola página, cero superficie de búsqueda
Todo vive en `/`. No hay páginas para *"punto de venta para pastelería CDMX"*,
*"CRM para salón de eventos"*, etc. La landing compite por una sola consulta
genérica.

**Arreglo (fase posterior):** una página por servicio, cada una con su JSON-LD y
su caso de estudio. Requiere router — cambio de arquitectura, no de estilo.

### 🟡 S6 — `sitemap.xml` sin `lastmod`
`public/sitemap.xml`. Añadir `<lastmod>` y regenerarlo en el build.

### 🟡 S7 — `<meta name="keywords">` obsoleta
`index.html:12-15`. Ningún buscador la usa desde 2009. Inofensiva, pero delata
prácticas viejas si alguien inspecciona el código de un proveedor de web.

### 🟡 S8 — Sin `og:site_name`
Menor, pero mejora cómo se ve la tarjeta compartida.

---

## UX y conversión

### 🔴 U1 — Los casos no enlazan a nada
`src/data.js:71-116` — ningún proyecto tiene campo `url`

La sección se titula «TRABAJO REAL» y cierra con «Sin testimonios inventados. Sin
métricas de humo». Pero un visitante escéptico **no puede verificar nada**.

Y los sitios existen: en la misma cuenta de Vercel están desplegados
`pasteleria-confetti`, `jardines-club-hipico`, `fiesta-total-dj` y
`electrotecnica-berlin-web`.

**Es el desperdicio más grande de todo el sitio.** La prueba está construida,
pagada y en línea, y la página no la muestra.

**Arreglo:** añadir `url` a cada proyecto y un enlace «Ver sitio en vivo ↗» por
tarjeta. Pedir permiso al cliente antes de enlazar sistemas internos (POS/CRM);
para esos, capturas reales anonimizadas.

### 🔴 U2 — Cero medición
Sin analítica de ningún tipo. No se sabe cuánta gente entra, cuántos hacen clic
en WhatsApp, ni cuál de los 4 CTAs funciona. Ver `VERCEL.md` §6.

### 🔴 U3 — Un solo canal de contacto
Los 4 CTAs van al mismo `wa.me`. Quien esté en una computadora de escritorio sin
WhatsApp Web, o quien prefiera no dar su número, no tiene alternativa: se va.

**Arreglo:** un formulario corto (nombre, negocio, qué necesita, contacto) junto
al botón de WhatsApp. Sin backend: Formspree, Web3Forms o una función serverless
de Vercel. También mostrar el correo como enlace visible, no solo en la ficha.

### 🟠 U4 — Sin ninguna referencia de precio
El mercado objetivo —dueño de negocio local— pregunta el precio antes que nada.
La página no da ni un rango, ni un «desde», ni un modelo de cobro.

Consecuencia: se atraen prospectos no calificados y se pierden los que asumen
que será caro. Ambos errores cuestan tiempo.

**Arreglo:** rangos por tipo de proyecto («Landing desde $X», «POS desde $Y») o,
si se prefiere no publicar cifras, al menos el modelo («proyecto cerrado, 50 %
inicio / 50 % entrega, sin mensualidades obligatorias»).

### 🟠 U5 — Sin tiempos de entrega
`PROCESS` describe cuatro fases sin decir cuánto dura ninguna. «¿Cuándo lo
tengo?» es la segunda pregunta de todo cliente.

### 🟠 U6 — No se puede rastrear qué CTA convierte
`src/App.jsx:14` — un único `whatsappUrl` con el mismo mensaje para los cuatro
puntos de contacto.

**Arreglo:** variar el mensaje por origen o registrar un evento de analítica
antes de redirigir. Sin esto no se puede optimizar la página.

### 🟠 U7 — Sin sección «sobre mí»
En un estudio de una persona, la persona es el diferenciador frente a una
agencia. Hoy Miguel solo aparece en el bloque de contacto, al final, como una
ficha de datos. No hay foto, ni historia, ni por qué hace esto.

### 🟡 U8 — El botón flotante puede tapar contenido en móvil
`.floating-contact` es fijo. Verificar que no cubra el CTA de la sección de
contacto ni los enlaces del footer en pantallas de 360×640.

### 🟡 U9 — El ticker del hero no aporta información
`WEB EXPERIENCE · POINT OF SALE · CRM & DATA · AUTOMATION` en inglés, en un sitio
en español, repitiendo lo que la sección de capacidades ya dice mejor. Es
decoración que ocupa espacio sobre la línea de pliegue.

---

## Código

### 🟠 C1 — El copy está partido entre `data.js` y el JSX
Capacidades, proyectos y proceso están en datos; hero, manifiesto, encabezados,
contacto y footer están incrustados. Cambiar el titular exige editar un
componente. Ver `CONTENT.md`.

### 🟠 C2 — `styles.css` con 3 152 líneas
Un solo archivo para todo el sitio. 26 % son maquetas decorativas. Sin tokens de
espaciado ni de sombra. Ver `DESIGN-SYSTEM.md` §7.

### 🟠 C3 — Sin validación de tipos ni de props
Sin TypeScript, sin `prop-types`. Los mapas `SCREENS` y `VISUALS` acoplan datos y
componentes por string: una clave mal escrita en `data.js` revienta en tiempo de
ejecución, no en el build.

### 🟠 C4 — Sin tests ni CI
Ningún test. Ningún workflow de GitHub Actions. Nada impide subir código que no
compila. Mínimo razonable: un workflow que corra `npm run lint && npm run build`
en cada push.

### 🟡 C5 — Índice del deck incrustado
`CapabilityDeck.jsx:207` — `findIndex(...) / 3`. El `3` asume exactamente cuatro
capacidades. Debe ser `CAPABILITIES.length - 1`.

### 🟡 C6 — `useReducedMotion` duplica `useMediaQuery`
15 líneas idénticas salvo la consulta. Reescribir sobre `useMediaQuery`.

### 🟡 C7 — Temporizadores sin limpiar en `PageLoader`
`PageLoader.jsx:30-34` — los `setTimeout` de 150 ms y 520 ms no se guardan en
variables ni se limpian. La bandera `mounted` evita la fuga real, pero es frágil.

### 🟡 C8 — Encabezado de sección repetido tres veces
`.section-heading`, `.work__heading` y `.process__heading` son el mismo patrón
con tres bloques de CSS casi idénticos. Extraer un componente `SectionHeading`.

---

## Infraestructura

Detalle completo en [`VERCEL.md`](./VERCEL.md).

| ID | Hallazgo | Severidad |
| --- | --- | --- |
| V1 | Assets con hash servidos con `max-age=0, must-revalidate` | 🔴 |
| V2 | Sitio v1 antiguo público e indexable en `mh-astral-systems.vercel.app` | 🔴 |
| V3 | Sin analítica ni Speed Insights | 🔴 |
| V4 | Sin integración Git — `git push` no despliega | 🟠 |
| V5 | `framework: null` en el proyecto de Vercel | 🟠 |
| V6 | Sin cabeceras de seguridad | 🟠 |
| V7 | El dominio figura en un proyecto y sirve otro | 🟠 |
| V8 | Sin `.env.example` | 🟡 |

---

## Lo que ya está bien hecho

Para no romperlo en el rediseño:

- ✅ Degradación del 3D en tres niveles (reduced motion → móvil → sin WebGL →
  `ErrorBoundary` → PNG estático). Trabajo cuidadoso y poco común
- ✅ `prefers-reduced-motion` respetado en CSS **y** en JS (Lenis, three,
  `Sparkles`, animaciones de motion)
- ✅ Escala tipográfica fluida con `clamp()` en 52 lugares
- ✅ Custom properties inline para temas por bloque (`--accent`)
- ✅ Limpieza correcta de efectos en todos los hooks salvo un detalle en `PageLoader`
- ✅ ESLint pasa sin errores ni advertencias
- ✅ El build funciona y es reproducible
- ✅ Copy con voz propia, específico, sin humo ni jerga
- ✅ Botones de 48 px de alto mínimo: tamaño táctil correcto
- ✅ `:focus-visible` con contorno visible de 3 px
- ✅ Maquetas decorativas hechas a mano, no plantillas de stock
