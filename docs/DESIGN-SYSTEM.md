# DESIGN SYSTEM — estado actual

Inventario de todo lo visual que hoy existe en `src/styles.css` (3 152 líneas).
Lo que está bien, lo que está implícito y lo que hay que formalizar antes del
rediseño.

## 1. Tokens declarados

Las únicas 14 variables del proyecto, en `:root` (líneas 1–21):

```css
/* Superficie */
--paper:        #f2efe6;   /* fondo base, papel cálido */
--paper-bright: #faf8f1;   /* superficie elevada */

/* Tinta */
--ink:          #151614;   /* texto principal, botón primario */
--ink-soft:     #272925;   /* texto secundario */
--muted:        #74756f;   /* texto terciario  ⚠️ contraste 4.05:1 */
--line:         rgba(21, 22, 20, 0.16);  /* bordes */

/* Acentos */
--blue:      #345dff;
--blue-deep: #1737b8;
--coral:     #ff684f;
--lime:      #ceff3d;
--aqua:      #36d7d1;
--violet:    #5e63ff;

/* Tipografía */
--display: 'Syne Variable', sans-serif;
--body:    'Manrope Variable', sans-serif;
```

### Contraste verificado

| Combinación | Ratio | WCAG AA texto normal | Veredicto |
| --- | --- | --- | --- |
| `--ink` sobre `--paper` | ~15.5:1 | ✅ | Excelente |
| `--ink-soft` sobre `--paper` | ~13:1 | ✅ | Bien |
| **`--muted` (#74756f) sobre `--paper`** | **4.05:1** | ❌ (requiere 4.5:1) | **Falla** |
| `#545650` (hero lead, valor suelto) sobre `--paper` | ~7.2:1 | ✅ | Bien, pero no es token |
| `--ink` sobre `--lime` | ~14:1 | ✅ | Bien |
| `--paper` sobre `--blue` | ~4.6:1 | ✅ justo | Límite |

`--muted` se usa en etiquetas, metadatos y textos pequeños en varias secciones.
**Es el hallazgo de accesibilidad más extendido del sitio.** Corrección mínima:
llevarlo a `#5f6059` (≈ 5.6:1) sin perder el gris.

### Lo que NO está tokenizado

Hay valores sueltos repetidos por todo el archivo que deberían ser tokens:

- **Espaciado:** ningún token. Se usan literales y `clamp()` ad hoc en 52 lugares
- **Radios:** `8px`, `9px`, `10px`, `12px`, `13px`, `14px`, `16px`, `17px`,
  `18px`, `22px`, `24px` — 11 valores distintos sin escala
- **Sombras:** cada componente define la suya inline; el patrón "tactile"
  (`inset` + offset sólido + difusa) se repite ~15 veces con números distintos
- **Pesos:** `620, 630, 640, 700, 720, 740, 750, 760, 780, 800, 820` — **11
  pesos** para dos familias variables. Sin escala nombrada
- **Tracking:** `-0.08em, -0.072em, -0.07em, -0.065em, -0.055em` en display;
  `0.05em … 0.18em` en etiquetas. Sin sistema
- **Colores literales fuera de `:root`:** `#545650`, `#1c9d79`, `#1fb892`,
  `#ffc455`, `#ffc85d`, `#54ce87`, `#d3d0c7`, `#214f4b`, `#243260`, `#365219`,
  `#061127`, `#173c91`, etc. La mayoría dentro de maquetas decorativas

## 2. Tipografía

| Rol | Familia | Peso | Tracking | Line-height | Tamaño |
| --- | --- | --- | --- | --- | --- |
| Titular hero | Syne Variable | 630 | −0.072em | 0.91 | `clamp(3.35rem, 6.35vw, 7.2rem)` |
| H2 sección | Syne Variable | ~700 | −0.065em | ~0.95 | `clamp(3.3rem, 6.5vw, 7.2rem)` |
| Manifiesto | Syne Variable | ~640 | −0.07em | — | `clamp(3.2rem, 7.6vw, 8.7rem)` |
| H3 panel | Syne Variable | ~700 | — | — | `clamp(2.35rem, 4vw, 4.8rem)` |
| Lead | Manrope Variable | 400 | — | 1.72 | `clamp(1rem, 1.25vw, 1.22rem)` |
| Cuerpo | Manrope Variable | 400–500 | — | ~1.6 | ~1rem |
| Etiqueta (`.section-index`) | Manrope Variable | 800 | 0.16em | — | 0.7rem |
| Micro-lectura de chrome | Manrope Variable | 780–820 | 0.12em | — | 0.6–0.7rem |
| Número gigante (`.project-scene__visual-index`) | Syne | — | — | — | `clamp(8rem, 18vw, 20rem)` |
| Lectura de proceso | Syne | — | — | — | `clamp(13rem, 30vw, 27rem)` |

**Fortaleza:** el uso de `clamp()` es consistente y la escala fluida funciona
bien de 320 px a 1440 px. Es lo mejor del CSS actual.

**Debilidad:** no hay una escala nombrada. Cada `h2` redefine su `clamp` y su
tracking. Duplicación entre `.section-heading h2`, `.work__heading h2` y
`.process__heading h2`, que son casi idénticos.

**Carga:** los dos paquetes de Fontsource se importan completos en `main.jsx`,
lo que trae subsets cirílico, griego y vietnamita que el sitio nunca usa (8
archivos `.woff2`, ~133 KB). Importar `/latin.css` y `/latin-ext.css` reduce a
~40 KB.

## 3. Color aplicado

Cada bloque de contenido tiene su propio acento, inyectado por custom property
inline desde `data.js`:

| Superficie | Acento | Dónde |
| --- | --- | --- |
| Web | `#ff684f` coral | Capacidad 01 |
| POS | `#ceff3d` lima | Capacidad 02 |
| CRM | `#5e63ff` violeta | Capacidad 03 (única con `ink` claro `#f5f2e9`) |
| Automatización | `#36d7d1` aqua | Capacidad 04 |
| Confetti | `#ff765e` + superficie `#f2c3b9` | Caso 01 |
| Club Hípico | `#d5ff45` + superficie `#dce8b6` | Caso 02 |
| Fiesta Total | `#7770ff` + superficie `#c4c0ff` | Caso 03 |
| Berlín | `#47d8d2` + superficie `#b9e6e2` | Caso 04 |

Los acentos de casos **no son los mismos** que los de capacidades (`#ff765e` vs
`#ff684f`, `#d5ff45` vs `#ceff3d`…). Cuatro pares de colores casi iguales pero
distintos, sin razón sistémica. En el rediseño deberían unificarse o justificarse.

**Este mecanismo — pasar `--accent` inline y que el CSS lo consuma — es el mejor
patrón del proyecto y hay que conservarlo.**

## 4. Patrones visuales

### Botón táctil (`.tactile-button`)
La pieza de identidad más definida. Tres capas de sombra:
```css
box-shadow:
  inset 0 1px rgba(255,255,255,.16),   /* brillo superior */
  0 5px 0 #050605,                      /* cuerpo sólido = grosor físico */
  0 12px 24px rgba(10,10,8,.14);        /* sombra proyectada */
```
`:hover` sube 3 px y engorda el cuerpo a 7 px; `:active` baja 1 px. Da sensación
de tecla real. Variantes: `--ink` (primario), `--paper` (secundario),
`--large` (58 px de alto). Altura base 48 px = tamaño táctil correcto. ✅

### Cromo de máquina
Recurso transversal: barras superiores/inferiores con micro-texto en mayúsculas
(`MH / SYSTEM CORE`, `WEBGL / REALTIME`, `MH—01`), tornillos en las esquinas
(`.panel-screen-wrap__screw`), perilla giratoria (`.process-knob`), pilotos
parpadeantes (`.live-signal i`, `0 0 10px currentColor`). Coherente y con
personalidad. ✅

### Ruido de papel
`.hero__noise`: SVG `feTurbulence` en data-URI con `mix-blend-mode: multiply`,
opacidad 0.17. Aporta textura sin coste de red. ✅ **Solo se aplica al hero** —
el resto de la página pierde esa cualidad táctil.

### Fondos radiales
El hero superpone dos gradientes radiales (azul 16 %, lima 13 %) sobre `--paper`.
Ninguna otra sección usa este recurso.

### Maquetas decorativas
8 componentes que simulan interfaces (navegador, POS, CRM Kanban, flujo de
automatización, dashboard, cotizador, disco, ticket). Es contenido visual real
y diferenciado, no stock. Coste: ~830 líneas de CSS (26 % del archivo) y su
texto **es leído por lectores de pantalla** porque nada lleva `aria-hidden`.

## 5. Movimiento

| Efecto | Implementación | Duración | Easing |
| --- | --- | --- | --- |
| Entrada de hero copy | motion `opacity + y` | 0.85 s (delay 0.15) | `[0.22, 1, 0.36, 1]` |
| Entrada de escenario | motion `opacity + scale + rotate` | 1.05 s (delay 0.28) | `[0.22, 1, 0.36, 1]` |
| Cambio de panel/pantalla | `AnimatePresence mode="wait"` | 0.34–0.38 s | `[0.22, 1, 0.36, 1]` |
| Menú móvil | `clipPath inset` | 0.55 s | `[0.76, 0, 0.24, 1]` |
| Salida del loader | CSS | 0.52 s | — |
| Hover de botón | CSS transform | 180 ms | `ease` |
| Ticker | `@keyframes ticker` infinito | — | linear |
| Ecualizador / disco | `@keyframes equalize`, `disc-spin` | — | — |
| Scroll suave | Lenis | 1.05 s | — |
| Barra de progreso | `useScroll` → `scaleX` | — | — |

El easing `[0.22, 1, 0.36, 1]` (easeOutQuint) es consistente en todas las
transiciones de motion. ✅

`@media (prefers-reduced-motion: reduce)` aplica un reset global de animaciones y
transiciones a 0.001 ms, y además el JS desactiva Lenis, el 3D y `Sparkles`.
**Es una implementación completa y correcta de reduced motion.** ✅

**Lo que falta:** ninguna sección tiene animación de entrada al hacer scroll.
Todo el contenido bajo el hero aparece de golpe. Es la mayor oportunidad de
movimiento del rediseño.

## 6. Layout y responsive

- Contenedor: `width: min(100%, 1440px)` en el hero. No hay clase de contenedor
  reutilizable; cada sección resuelve su ancho por su cuenta
- Padding lateral: `.section-pad` → `clamp(24px, 5vw, 82px)` ✅
- Ritmo vertical: `clamp(100px, 12vw, 180px)` por sección, con variaciones
- Rejillas: CSS Grid en hero (2 col), encabezados de sección (`0.28fr 1.72fr`),
  panel de capacidades, escenas de proyecto
- Breakpoints: **3** — `1180px`, `900px`, `640px`. Solo `max-width`, sin
  enfoque mobile-first, sin container queries
- El bloque de móvil (`640px`) ocupa las líneas 2790–3142: **352 líneas**, más
  del 11 % del archivo, casi todo redefiniendo lo mismo con otros números

## 7. Deuda del sistema actual

| # | Deuda | Impacto |
| --- | --- | --- |
| 1 | `--muted` falla contraste AA | Accesibilidad, afecta a todo el sitio |
| 2 | Sin tokens de espaciado, radio, sombra ni elevación | Cada componente reinventa; el rediseño no escalará sin esto |
| 3 | 11 pesos tipográficos sin escala nombrada | Inconsistencia visual sutil |
| 4 | Un solo archivo de 3 152 líneas | Difícil de mantener y de auditar |
| 5 | 26 % del CSS son maquetas decorativas | Peso desproporcionado para elementos no informativos |
| 6 | Acentos duplicados entre capacidades y casos | Sistema de color sin regla |
| 7 | `color-scheme: light dark` declarado sin estilos oscuros | Controles nativos y barras de scroll pueden renderizarse oscuros sobre fondo claro |
| 8 | Sin animaciones de entrada por scroll | La página se siente estática después del hero |
| 9 | Textura de papel solo en el hero | Rompe la promesa táctil de la marca |
| 10 | 352 líneas de overrides móviles | Síntoma de no ser mobile-first |

## 8. Qué conservar sin discusión

Lo bueno del sistema actual, que el rediseño no debe perder:

1. La paleta papel + tinta + acentos eléctricos. Es distintiva y no parece plantilla.
2. `.tactile-button` con su triple sombra.
3. El cromo de máquina (tornillos, perillas, micro-lecturas).
4. El ruido de papel del hero — **extendido al resto de la página**.
5. La escala fluida con `clamp()`.
6. `--accent` inyectado por custom property inline.
7. El manejo completo de `prefers-reduced-motion`.
8. Las maquetas decorativas — pero optimizadas y con `aria-hidden`.
9. El easing `[0.22, 1, 0.36, 1]` como firma de movimiento.
10. La tesis de marca: «Diseño que vende. Sistemas que ordenan.»
