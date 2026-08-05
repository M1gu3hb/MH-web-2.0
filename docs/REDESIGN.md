# REDESIGN — propuesta de rediseño

Basado en el mapeo de `FILEMAP.md`, `MODULES.md`, `DESIGN-SYSTEM.md`,
`CONTENT.md`, `AUDIT.md` y `VERCEL.md`.

## 1. Diagnóstico en una frase

El sitio actual **se ve bien y no vende**: tiene dirección visual propia, buen
copy y detalles de ingeniería cuidados, pero esconde la prueba que sí tiene
(trabajo real en línea), no responde las dos preguntas que todo cliente hace
(cuánto cuesta, cuánto tarda), y no mide nada.

El rediseño **no es un cambio de estética**. La estética es lo mejor que tiene.
Es un cambio de **estructura, prueba y medición**, con la identidad visual
depurada y sistematizada.

## 2. Principios del rediseño

1. **Conservar la voz.** Papel + tinta + acentos eléctricos, cromo de máquina,
   primera persona, cero humo. No es un rediseño de marca.
2. **La prueba antes del discurso.** El trabajo real sube; el manifiesto baja.
3. **Responder el precio y el tiempo.** Aunque sea en rangos.
4. **Menos peso, más rápido.** El sitio del proveedor de web tiene que ser el
   más rápido que el cliente haya visto.
5. **Todo se mide.** Cada CTA lleva su origen.
6. **Accesible por defecto.** Los 9 hallazgos de accesibilidad se cierran, no se
   posponen.

## 3. Nueva arquitectura de la página

### Estructura actual
```
Loader → Hero → Manifiesto → Capacidades → Trabajo → Proceso → Contacto → Footer
```

### Estructura propuesta
```
Hero (sin loader)
  ↳ prueba inmediata: 4 logos/nombres de cliente sobre el pliegue

Trabajo                       ⬆ SUBE — la prueba primero
  ↳ 4 casos + enlace «Ver sitio en vivo ↗» + resultado concreto

Capacidades                   = se mantiene, + «desde $X» y «~N semanas»

Proceso                       = se mantiene, + duración por fase

Inversión                     ★ NUEVO — rangos y modelo de cobro

Sobre mí                      ★ NUEVO — foto, historia, por qué
  ↳ absorbe el manifiesto actual

FAQ                           ★ NUEVO — objeciones + SEO local

Contacto                      = se mantiene, + formulario junto a WhatsApp

Footer
```

Razón del cambio de orden: hoy el visitante recorre dos secciones de discurso
(manifiesto y capacidades) antes de ver una sola prueba. Con la estructura nueva,
la prueba llega en el primer scroll.

## 4. Dirección visual

### Lo que se mantiene
Paleta papel/tinta/acentos · botón táctil de triple sombra · cromo de máquina ·
ruido de papel · numeración `01–04` · escala fluida con `clamp()` ·
Syne + Manrope · easing `[0.22, 1, 0.36, 1]`.

### Lo que evoluciona

**a) El ruido de papel se extiende a todo el sitio.**
Hoy solo el hero tiene la textura `feTurbulence`. Se mueve a `body::before`
fijo, con opacidad más baja (0.08–0.10). La página entera se siente impresa,
no solo la primera pantalla.

**b) Cada sección hereda un acento y lo usa de verdad.**
Hoy `--accent` solo tiñe detalles pequeños. Propuesta: que el acento tiña el
fondo de la sección con un lavado muy tenue (3–5 %), de modo que hacer scroll
sea recorrer una paleta. Cuatro superficies distintas, misma tinta.

**c) Movimiento al entrar en viewport.**
La mayor carencia actual: bajo el hero, todo aparece de golpe. Se añade una
animación de entrada por sección (`whileInView` de motion, `once: true`,
desplazamiento de 24 px, escalonado de 60 ms). Sutil, no acrobático, y apagada
por completo con `prefers-reduced-motion`.

**d) Tipografía sistematizada.**
De 11 pesos sueltos a una escala nombrada de 5 (`400 / 500 / 630 / 700 / 800`).
De 11 radios a 4 (`8 / 12 / 18 / 999px`). De ~15 sombras improvisadas a 3
niveles de elevación con tokens.

**e) El escenario 3D se aligera o se sustituye.**
El logo de MH sigue siendo el protagonista del hero, pero con una décima parte
del peso. Dos rutas, a elegir:
- **Ruta A (conservadora):** mantener three.js quitando `Line` y `Sparkles`,
  reduciendo de 8 luces a 3 y de 6 capas de logo a 3. Estimado: 245 KB → ~160 KB gzip
- **Ruta B (recomendada):** reemplazar por capas CSS 3D con `transform:
  translateZ` y anillos SVG animados. Mismo efecto de profundidad, **0 KB de
  JavaScript**, funciona en móvil (donde hoy no hay escena en absoluto) y elimina
  toda la cascada de fallbacks

**f) El loader desaparece.**
Se sustituye por una entrada animada del hero: fondo, luego titular, luego el
resto. El usuario ve contenido a los ~400 ms en lugar de a los ~2 000 ms. La
sensación de "producción" se conserva; el costo de rendimiento, no.

### Lo que se elimina
- El loader bloqueante (P1)
- El ticker en inglés del hero (U9)
- Los subsets tipográficos no usados (P4)
- La `<meta keywords>` (S7)
- Los PNG de 456 KB y 232 KB para uso en pantalla (P3)

## 5. Sistema de tokens propuesto

```css
:root {
  /* ---- Superficie ---- */
  --surface-base:    #f2efe6;
  --surface-raised:  #faf8f1;
  --surface-sunken:  #e9e5d9;
  --surface-invert:  #151614;

  /* ---- Tinta ---- */
  --ink-strong:  #151614;   /* 15.5:1 ✅ */
  --ink-body:    #272925;   /* 13:1   ✅ */
  --ink-muted:   #5f6059;   /* 5.6:1  ✅ corrige A2 (era #74756f, 4.05:1) */
  --ink-invert:  #faf8f1;

  /* ---- Acentos ---- */
  --accent-web:   #ff684f;
  --accent-pos:   #ceff3d;
  --accent-crm:   #5e63ff;
  --accent-auto:  #36d7d1;
  --accent-brand: #345dff;
  /* Los acentos de casos se unifican con estos: hoy hay 4 pares casi iguales */

  /* ---- Línea ---- */
  --line-soft:   rgba(21, 22, 20, 0.10);
  --line-strong: rgba(21, 22, 20, 0.22);

  /* ---- Espaciado (escala de 4) ---- */
  --sp-1: 4px;   --sp-2: 8px;   --sp-3: 12px;  --sp-4: 16px;
  --sp-5: 24px;  --sp-6: 32px;  --sp-7: 48px;  --sp-8: 64px;
  --sp-9: 96px;  --sp-10: 128px;
  --sp-section: clamp(80px, 11vw, 160px);
  --sp-gutter:  clamp(20px, 5vw, 82px);

  /* ---- Radio ---- */
  --r-sm: 8px;  --r-md: 12px;  --r-lg: 18px;  --r-full: 999px;

  /* ---- Elevación ---- */
  --e-1: 0 1px 2px rgba(21,22,20,.06), 0 2px 8px rgba(21,22,20,.04);
  --e-2: 0 2px 4px rgba(21,22,20,.08), 0 8px 24px rgba(21,22,20,.08);
  --e-3: 0 4px 8px rgba(21,22,20,.10), 0 16px 40px rgba(21,22,20,.12);
  /* Firma táctil: brillo interior + cuerpo sólido + sombra proyectada */
  --e-tactile:       inset 0 1px rgba(255,255,255,.16), 0 5px 0 var(--tactile-body), var(--e-2);
  --e-tactile-hover: inset 0 1px rgba(255,255,255,.16), 0 7px 0 var(--tactile-body), var(--e-3);

  /* ---- Tipografía ---- */
  --font-display: 'Syne Variable', sans-serif;
  --font-body:    'Manrope Variable', sans-serif;

  --w-regular: 400;  --w-medium: 500;  --w-display: 630;
  --w-bold: 700;     --w-label: 800;

  --t-display:  clamp(3.2rem, 6.4vw, 7.2rem);   /* h1 */
  --t-h2:       clamp(2.6rem, 5.2vw, 5.6rem);
  --t-h3:       clamp(1.8rem, 3.2vw, 3.2rem);
  --t-lead:     clamp(1.05rem, 1.3vw, 1.25rem);
  --t-body:     1rem;
  --t-small:    0.875rem;
  --t-label:    0.7rem;

  --tr-display: -0.055em;  --tr-body: 0;  --tr-label: 0.14em;
  --lh-display: 0.94;      --lh-body: 1.65;

  /* ---- Movimiento ---- */
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --d-fast: 180ms;  --d-base: 340ms;  --d-slow: 620ms;
}
```

## 6. Nueva estructura de archivos

```
src/
├── main.jsx
├── App.jsx
│
├── content/                    ← todo el copy, editable sin tocar JSX
│   ├── site.js       meta, OG, JSON-LD
│   ├── contact.js    datos + mensajes de WhatsApp por origen
│   ├── hero.js
│   ├── capabilities.js
│   ├── projects.js   + url de cada caso  ← cierra U1
│   ├── process.js    + duración por fase ← cierra U5
│   ├── pricing.js    ★ nuevo             ← cierra U4
│   ├── about.js      ★ nuevo             ← cierra U7
│   └── faq.js        ★ nuevo
│
├── styles/                     ← reemplaza styles.css (3 152 líneas)
│   ├── tokens.css
│   ├── reset.css
│   ├── base.css
│   ├── utilities.css
│   └── sections/
│       ├── hero.css
│       ├── work.css
│       ├── capabilities.css
│       ├── process.css
│       ├── pricing.css
│       ├── about.css
│       ├── faq.css
│       └── contact.css
│
├── hooks/
│   ├── useMediaQuery.js
│   ├── useReducedMotion.js     ← reescrito sobre useMediaQuery (C6)
│   └── useInViewAnimation.js   ★ nuevo — entradas por scroll
│
├── lib/
│   ├── analytics.js            ★ nuevo — track de eventos (U2, U6)
│   └── whatsapp.js             ★ nuevo — genera el enlace con origen
│
└── components/
    ├── primitives/
    │   ├── Button.jsx          ← formaliza .tactile-button
    │   ├── SectionHeading.jsx  ← elimina la triple duplicación (C8)
    │   ├── Reveal.jsx          ← wrapper de animación por viewport
    │   └── Tabs.jsx            ← patrón ARIA completo (A4)
    ├── layout/
    │   ├── Navigation.jsx      ← + trampa de foco (A3)
    │   ├── Footer.jsx
    │   └── FloatingCTA.jsx
    ├── mockups/                ← extraídas, con aria-hidden (A6)
    │   ├── screens/   WebsiteScreen, PosScreen, CrmScreen, AutomationScreen
    │   └── projects/  ConfettiVisual, HipicoVisual, FiestaVisual, BerlinVisual
    ├── hero/
    │   ├── Hero.jsx
    │   └── HeroMark.jsx        ← CSS 3D (ruta B) o escena aligerada (ruta A)
    └── sections/
        ├── WorkSection.jsx     ← + enlaces en vivo (U1)
        ├── CapabilitiesSection.jsx
        ├── ProcessSection.jsx
        ├── PricingSection.jsx  ★
        ├── AboutSection.jsx    ★
        ├── FaqSection.jsx      ★
        └── ContactSection.jsx  ← + formulario (U3)
```

## 7. Presupuesto de rendimiento

| Métrica | Hoy | Objetivo |
| --- | --- | --- |
| Peso total (primera visita, escritorio) | ~1.9 MB | **< 500 KB** |
| JS crítico (gzip) | 106 KB | **< 70 KB** |
| JS diferido (gzip) | 245 KB | **0 KB** (ruta B) o **< 160 KB** (ruta A) |
| CSS (gzip) | 14.2 KB | **< 16 KB** |
| Fuentes | 8 archivos, ~133 KB | **2 archivos, ~40 KB** |
| Imágenes | 688 KB PNG | **< 60 KB** (SVG + WebP) |
| LCP (4G, móvil) | ~3–4 s | **< 2.0 s** |
| CLS | por medir | **< 0.05** |
| Lighthouse rendimiento | por medir | **> 92** |
| Lighthouse accesibilidad | por medir | **100** |

## 8. Secciones nuevas — contenido propuesto

### Inversión
Sin publicar cifras exactas si no se quiere, pero sí el marco:

```
04 / INVERSIÓN
Precios claros. Sin sorpresas a medio proyecto.

  PRESENCIA          desde $X       2–3 semanas
  Sitio, identidad aplicada, SEO técnico, panel para editar contenido.

  OPERACIÓN          desde $Y       4–6 semanas
  Punto de venta o CRM a la medida, con capacitación e implementación.

  SISTEMA COMPLETO   a cotizar      6–10 semanas
  Web + operación + automatizaciones, diseñados como una sola pieza.

Cómo cobro: proyecto cerrado. 50 % para arrancar, 50 % contra entrega.
Sin mensualidades obligatorias. El código y los accesos son tuyos.
```

Ese último párrafo es el más valioso: es exactamente lo que diferencia a un
estudio independiente de una agencia con retainer.

### Sobre mí
Foto real, no ilustración. Tres párrafos: quién es, por qué diseña y programa a
la vez, y qué significa eso para el cliente. Absorbe el manifiesto actual
(«Diseño la cara visible y construyo la máquina detrás»), que hoy flota sin
dueño.

### FAQ
Ocho preguntas, redactadas como las hace un cliente real:

1. ¿Cuánto cuesta una página web?
2. ¿Cuánto tiempo tarda?
3. ¿Yo puedo editar el contenido después?
4. ¿El dominio y el hosting van incluidos?
5. ¿Qué pasa si necesito cambios después de entregar?
6. ¿Trabajas con negocios fuera de CDMX?
7. ¿Puedo empezar solo con la página y agregar el sistema después?
8. ¿Cómo sé que no vas a desaparecer a medio proyecto?

Cada una alimenta el JSON-LD `FAQPage` → resultados enriquecidos en Google (S4).

## 9. Riesgos del rediseño

| Riesgo | Mitigación |
| --- | --- |
| Perder la personalidad al sistematizar | Los 10 elementos de `DESIGN-SYSTEM.md` §8 son intocables |
| Publicar precios y ahuyentar clientes | Empezar con rangos «desde»; medir 4 semanas antes de decidir |
| Que la ruta B (CSS 3D) se vea peor que three.js | Prototipar antes de borrar `HeroScene.jsx`; comparar lado a lado |
| Enlazar sistemas de clientes sin permiso | Solo enlazar sitios públicos; para POS/CRM, capturas anonimizadas |
| Romper algo que hoy funciona | Cerrar `AUDIT.md` por fases, verificando build y lint en cada una |
| Que el sitio y el repo diverjan | Conectar la integración Git de Vercel **antes** de empezar (V4) |

## 10. Cómo se mide el éxito

No por gusto. Cuatro números, medidos desde el día 1 con `@vercel/analytics`:

1. **Tasa de clic a WhatsApp** — clics / visitantes únicos
2. **De qué CTA vienen** — hero / flotante / contacto / header
3. **Profundidad de scroll** — cuánta gente llega a Trabajo, a Inversión, a Contacto
4. **LCP de campo en móvil** — vía Speed Insights

Sin línea base no hay rediseño evaluable: **instalar la analítica es el primer
commit del proyecto, antes de tocar el diseño.**
