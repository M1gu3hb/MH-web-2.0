# CHANGELOG — rediseño v3

**Publicado en producción** el 5 de agosto de 2026 en
`https://www.mh-astral-systems.com` (commit `50dd1dc`).

Qué cambió respecto de la versión anterior, guardada en la rama
`backup/v2.0-original` (commit `3b2cfe5`).

## Cómo volver atrás

```bash
git checkout backup/v2.0-original     # ver la versión anterior completa
git diff backup/v2.0-original --stat  # comparar
```

---

## 1. Arquitectura de la página

**Antes:** Loader → Hero → Manifiesto → Capacidades → Trabajo → Proceso → Contacto

**Ahora:** Hero → Clientes → **Trabajo** → Capacidades → Proceso → **Inversión** →
**Sobre mí** → **Preguntas** → Contacto

- El trabajo sube por encima del discurso: la prueba llega en el primer scroll
- Tres secciones nuevas: Inversión, Sobre mí, Preguntas
- El manifiesto se absorbe dentro de Sobre mí
- El loader bloqueante desaparece

Ritmo de superficies: papel → hundido → **tinta** → papel → hundido → papel →
**tinta** → papel → **tinta** → pie.

## 2. Hallazgos de la auditoría cerrados

| ID | Hallazgo | Cómo se cerró |
| --- | --- | --- |
| A1 | Skip link roto | `<main id="contenido">`. Verificado con Tab en navegador real |
| A2 | `--muted` con 4.05:1 | `--ink-muted: #5f6059` → 5.6:1 |
| A3 | Menú móvil sin trampa de foco | `role="dialog"`, `aria-modal`, foco entra, Tab circula, vuelve al botón al cerrar |
| A4 | Patrón de tabs incompleto | ←/→/Home/End, `id` + `aria-labelledby`, roving `tabindex`, en Capacidades y Proceso |
| A5 | 51 `<i>` decorativos | `aria-hidden` en decoraciones e iconos |
| A6 | Maquetas leídas por lectores | `aria-hidden` en los 8 contenedores |
| A7 | `aria-live` demasiado amplio | El loader ya no existe |
| A9 | `color-scheme: light dark` sin modo oscuro | `color-scheme: light` |
| P1 | Loader ocultaba 1.5–2.5 s | Eliminado; entrada animada del hero |
| P4 | 8 subsets tipográficos | `fonts.css` con solo latin y latin-ext → 4 archivos |
| P5 | Bundle sin dividir | `manualChunks`: react-vendor, motion, app |
| S2 | OG sin dimensiones | `og:image:width/height/alt` + `twitter:card` |
| S3 | Sin canónica | `<link rel="canonical">` |
| S4 | JSON-LD incompleto | `image`, `logo`, `priceRange`, `geo`, `serviceType`, `knowsLanguage` |
| S7 | `meta keywords` obsoleta | Eliminada |
| U1 | **Casos sin enlace** | «Ver sitio en vivo ↗» a los 4 sitios reales, verificados 200 |
| U2 | Cero medición | `@vercel/analytics` + `@vercel/speed-insights` |
| U3 | Un solo canal | Formulario que compone el mensaje y ofrece WhatsApp **o** correo |
| U4 | Sin precios | Sección Inversión con tres paquetes y condiciones |
| U5 | Sin tiempos | Duración por fase en Proceso y por paquete |
| U6 | CTAs indistinguibles | Mensaje distinto por origen + evento `whatsapp_click` con `source` |
| U7 | Sin «sobre mí» | Sección nueva |
| U8 | Flotante tapaba el CTA | Se oculta al llegar a Contacto; en móvil queda solo el icono |
| U9 | Ticker en inglés | Sustituido por la cinta de clientes reales |
| C1 | Copy partido | Todo en `src/content/index.js` |
| C2 | CSS de 3 152 líneas | 13 archivos en `src/styles/` |
| C5 | Índice incrustado `/3` | `CAPABILITIES.length - 1` |
| C6 | Hook duplicado | `useReducedMotion` sobre `useMediaQuery` |
| C7 | Timers sin limpiar | El loader ya no existe |
| C8 | Encabezado repetido ×3 | Primitiva `SectionHeading` |
| V1 · V5 · V6 | Sin caché ni cabeceras | `vercel.json` |

Pendientes (requieren decisión o acceso al panel): **V2** (retirar el sitio v1 de
`mh-astral-systems.vercel.app`), **V4** (conectar Git), **V7** (dominio),
**P2/P3** (peso del 3D e imágenes), **S1**, **S5**, **C3**, **C4**.

## 3. Componentes nuevos (patrones ReactBits)

En `src/components/reactbits/`, reescritos sin dependencias extra, con la
paleta de la marca y respetando `prefers-reduced-motion` en todos los casos:

`SplitText` · `BlurText` · `ShinyText` · `DecryptedText` · `CountUp` ·
`Magnet` · `SpotlightCard` · `TiltedCard` · `ClickSpark` · `ScrollReveal` ·
`DotGrid` · `Marquee` · `StarBorder` · `GlareHover` · `Reveal`

## 4. La escena 3D

Reescrita en `src/components/hero/`:

- **Núcleo con shader propio** (`coreShader.js`): desplazamiento por ruido
  simplex 3D en dos octavas + borde de Fresnel que respira entre los acentos
- Malla exterior de icosaedro rotando
- **Anillo de partículas instanciadas** — un solo draw call para 220 piezas
- Placa holográfica del monograma en tres capas
- Cuatro nodos de acento con luz propia
- Rig con amortiguación que sigue al cursor

Mejoras de comportamiento:
- **Se difiere hasta después del primer pintado** (`requestIdleCallback`), así
  el titular es siempre el LCP
- **Dos niveles de calidad** según `deviceMemory`, `hardwareConcurrency` y tipo
  de puntero: 220 partículas / detalle 42 en escritorio, 90 / 22 en móvil
- Se eliminaron `Line` y `Sparkles` de drei (arrastran `three-stdlib` completo)

## 5. Peso

| | Antes | Ahora |
| --- | --- | --- |
| JS crítico (gzip) | 106 KB en un chunk | 24 KB app + 49 KB react + 46 KB motion |
| Chunk 3D (gzip) | 245 KB | 236 KB, ahora diferido tras el primer pintado |
| Fuentes | 8 archivos · ~133 KB | 4 archivos · ~89 KB |
| CSS (gzip) | 14.2 KB | 12.7 KB |
| Contenido visible | tras 1.5–2.5 s | inmediato |

## 6. Verificación hecha

Con Chromium real (Playwright) contra el build de producción:

- Sin errores de consola (los dos 404 locales son los scripts de analítica de
  Vercel, que solo existen en producción)
- Sin desbordamiento horizontal en 390 px (`scrollWidth === clientWidth`)
- Skip link enfoca y su destino existe
- Flechas mueven entre tabs y el panel queda correctamente etiquetado
- El menú móvil abre con foco dentro y cierra con Escape
- Los 4 enlaces de casos apuntan a sitios que responden 200
- `npm run lint` y `npm run build` limpios

## 7. El sitio se publica sin cifras

Decisión explícita antes de salir a producción: los precios, plazos y conteos
del rediseño eran propuestas, no datos verificados, así que **no se publicaron**.

Retirado:

| Dónde | Antes | Ahora |
| --- | --- | --- |
| Paquetes | Desde $18,000 / $35,000 | «A cotizar» |
| Paquetes | 2–3 / 4–6 / 6–10 semanas | sin plazo |
| Proceso | 3–5 días … 2–6 semanas por fase | sin duración |
| Capacidades | «Desde N semanas» | sin plazo |
| Hero | 12+ proyectos · 4 años · 100 % | credenciales cualitativas |
| Condiciones | «50 / 50» | «Precio cerrado» |
| Paquete Operación | «Un mes de ajustes incluido» | «Ajustes incluidos tras la entrega» |
| FAQ | importes, dominio ~$300/año, medio pago | respuestas sin números |
| Caso Berlín | «negocio de 50 años» | «negocio familiar» |

**Los campos siguen en el modelo de datos y los componentes los pintan si
existen** (`price`, `time`, `duration`, `meta` son opcionales). Añadir las
cifras cuando estén validadas es editar `src/content/index.js` y nada más:
la sección Inversión, el proceso y el hero ya tienen su sitio reservado.

Verificado contra producción: ninguna de las cifras retiradas aparece en el
bundle publicado.

## 8. Estado en producción

Comprobado el día de la publicación contra `www.mh-astral-systems.com`:

- Los 6 archivos del build son byte a byte idénticos al build local
- `cache-control: public, max-age=31536000, immutable` en assets con hash
- Cabeceras de seguridad completas (`nosniff`, `referrer-policy`,
  `permissions-policy`, `x-frame-options`, HSTS)
- El apex redirige 308 a `www`
- `/_vercel/insights/script.js` responde 200 — la analítica está midiendo
- Los cuatro enlaces de casos apuntan a los sitios de cliente en vivo

### Pendiente

- **V2** — el sitio v1 sigue público e indexable en
  `mh-astral-systems.vercel.app`. Borrar el proyecto o protegerlo
- **S2** — `og:image` sigue siendo el logo; falta una tarjeta social 1200×630
- **P2** — el chunk 3D pesa 236 KB gzip; se puede aligerar más
- **S5 · C3 · C4** — páginas por servicio, TypeScript y CI
