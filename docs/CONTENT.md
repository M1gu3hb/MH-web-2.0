# CONTENT — inventario de copy y datos

Todo el texto que ve el visitante, dónde vive y quién lo controla. Necesario para
el rediseño porque **el copy está partido entre `data.js` y JSX incrustado**.

## Dónde vive cada texto

| Origen | Qué contiene | Editable sin tocar componentes |
| --- | --- | --- |
| `src/data.js` | Contacto, 4 capacidades, 4 casos, 4 fases del proceso | ✅ |
| `index.html` | `<title>`, meta description, keywords, Open Graph, JSON-LD | ✅ |
| JSX de `Hero.jsx` | Titular, lead, etiqueta, credenciales, ticker | ❌ |
| JSX de `CapabilityDeck.jsx` | Manifiesto completo + encabezado de sección | ❌ |
| JSX de `WorkSection.jsx` | Encabezado de sección + frase de cierre | ❌ |
| JSX de `ProcessSection.jsx` | Encabezado de sección | ❌ |
| JSX de `ContactSection.jsx` | Titular, párrafo, rótulos, footer | ❌ |
| JSX de `Navigation.jsx` | 4 etiquetas de menú + CTA | ❌ |
| JSX de `PageLoader.jsx` | «MH / 97», «Fundición digital», «CDMX», «Construyendo la experiencia» | ❌ |
| Maquetas decorativas | ~60 fragmentos de micro-texto simulado | ❌ |

## Estructura de la página, sección por sección

### 0 · Loader
```
MH / 97   ·   Fundición digital   ·   CDMX
[logo]
Construyendo la experiencia
[barra]  008% → 100%
```

### 1 · Navegación
- Marca: `MH ASTRAL` / `SYSTEMS`
- Enlaces: Servicios · Trabajo · Proceso · Contacto
- CTA: **Iniciar proyecto** → WhatsApp
- Móvil: mismos enlaces numerados `01–04` + CTA «Cuéntame tu proyecto»

### 2 · Hero (`#inicio`)
```
● Estudio digital independiente

Diseño lo que tus clientes ven.
Construyo lo que tu negocio necesita.

Páginas que convencen. Sistemas que ordenan. Una sola visión para convertir
la operación de tu negocio en una ventaja.

[Cuéntame tu proyecto]  [Ver trabajo real]

01 Atención directa   02 Diseño + desarrollo   03 CDMX
```
Escenario: `MH / SYSTEM CORE` · `EN LÍNEA` · `Mueve el cursor` · `WEBGL / REALTIME`
Ticker: WEB EXPERIENCE · POINT OF SALE · CRM & DATA · AUTOMATION (×2)

**Nota de conversión:** el hero no dice **qué cuesta**, **cuánto tarda**, ni
**para quién es**. Un dueño de pastelería no sabe todavía si esto es para él.

### 3 · Manifiesto
```
01  Dos disciplinas. Una sola visión.
    Diseño la cara visible y construyo la máquina detrás.
    MH97 · DESIGN × SYSTEMS · CDMX
```

### 4 · Capacidades (`#servicios`)
Encabezado: `01 / CAPACIDADES` — «Un estudio. Cuatro frentes.»

| # | Servicio | Titular | Etiquetas |
| --- | --- | --- | --- |
| 01 | Web | Sitios que se sienten propios, no rentados. | Dirección UI/UX · Desarrollo a medida · SEO técnico |
| 02 | Punto de venta | La caja, el inventario y los pedidos hablando entre sí. | Caja e inventario · Pedidos y cocina · Multi-sucursal |
| 03 | CRM & datos | Cada prospecto, documento y decisión en el mismo mapa. | Prospectos · Cotizadores · Dashboards |
| 04 | Automatización | Menos pendientes persiguiéndote. Más trabajo sucediendo solo. | Flujos · Documentos · Integraciones |

Copy fuerte, concreto, sin jerga. ✅ **Falta:** rango de precio o de tiempo por
frente, y un «esto es para ti si…».

### 5 · Trabajo (`#trabajo`)
Encabezado: `02 / TRABAJO REAL` — «Diseño con pulso. Sistemas con oficio.»

| # | Cliente | Categoría | Etiquetas | ¿Enlace? |
| --- | --- | --- | --- | --- |
| 01 | Pastelería Confetti | Web + POS multi-sucursal | Web · POS · Panel dueño · Multi-sucursal | ❌ |
| 02 | Jardines Club Hípico | Operación comercial | CRM · Cotizador · Contratos · Web | ❌ |
| 03 | Fiesta Total DJ's | Experiencia web | Web · Paquetes · Conversión | ❌ |
| 04 | Electrotécnica Berlín | Punto de venta + presencia web | POS · Web · Identidad | ❌ |

Cierre: «Sin testimonios inventados. Sin métricas de humo. Alcance claro,
producto real y contacto directo.»

**El hallazgo de contenido más importante del sitio:** los cuatro clientes
tienen proyectos desplegados en la misma cuenta de Vercel
(`pasteleria-confetti`, `jardines-club-hipico`, `fiesta-total-dj`,
`electrotecnica-berlin-web`). La página dice «trabajo real» y **no enlaza a
ninguno**. La prueba más contundente que existe está sin usar.

### 6 · Proceso (`#proceso`)
Encabezado: `03 / PROCESO` — «Menos teatro. Más producto.»

| Fase | Título | Texto |
| --- | --- | --- |
| 01 | Entender | Detecto qué debe vender, ordenar o automatizar la solución antes de abrir el editor. |
| 02 | Dirigir | Defino una idea visual y un recorrido claro. Ves la personalidad antes de construir todo. |
| 03 | Construir | Diseño, código y lógica avanzan juntos. Te enseño producto real, no presentaciones eternas. |
| 04 | Lanzar | Publicamos, probamos y dejamos una base que tu negocio pueda operar y hacer crecer. |

Pie: `AVANCES REALES` · `MH / METHOD—04`

**Falta:** duración estimada por fase. «¿Cuánto tarda?» es la segunda pregunta
de todo cliente, después del precio.

### 7 · Contacto (`#contacto`)
```
04 / CONTACTO DIRECTO        ¿TIENES UNA IDEA?

Hagamos algo difícil de ignorar.

DIRECTOR / DISEÑADOR / DESARROLLADOR
Miguel Huerta Bautista
mhastralsystems@gmail.com
Xochimilco · CDMX

Cuéntame qué vendes, qué se está atorando y qué quieres mejorar.
Yo te digo con honestidad qué conviene construir.

[WhatsApp · 55 2311 8153 →]
```

### 8 · Footer
Marca · «Diseño que vende. Sistemas que ordenan.» · Servicios / Trabajo /
Proceso / Volver arriba · `© 2026 MH ASTRAL SYSTEMS · CDMX`

## Datos de contacto (única fuente: `data.js`)

```js
owner:    'Miguel Huerta Bautista'
phone:    '55 2311 8153'
whatsapp: '525523118153'          // usado en wa.me
email:    'mhastralsystems@gmail.com'
location: 'Xochimilco · CDMX'
```

Duplicados en `index.html` dentro del JSON-LD (`telephone: "+52 55 2311 8153"`,
mismo email). **Dos fuentes de verdad**: si cambia el teléfono hay que tocar dos
archivos.

## Mensaje pre-cargado de WhatsApp

```
Hola Miguel 👋 Vi la nueva página de MH Astral Systems y quiero platicar
sobre un proyecto para mi negocio.
```

Idéntico desde los 4 CTAs. **No permite saber de dónde vino el contacto.**
Solución trivial: variar la cola del mensaje por origen
(`…para mi negocio. [hero]` / `[flotante]` / `[contacto]`), o usar un parámetro
UTM en el enlace y registrarlo antes de redirigir.

## Voz y tono — reglas observadas

Extraídas del copy existente. Sirven de guía para escribir contenido nuevo:

1. **Primera persona del singular.** «Diseño», «Construyo», «Detecto». Nunca
   «nosotros» — es una persona y lo dice.
2. **Frases cortas, dos tiempos.** «Diseño que vende. Sistemas que ordenan.»
   Estructura de contraste, casi siempre en pares.
3. **Vocabulario del cliente, no del gremio.** «la caja», «los pedidos», «la
   cocina», «cortes», «abonos». Nada de «soluciones end-to-end».
4. **Antipromesa explícita.** «Sin testimonios inventados. Sin métricas de humo.»
   La honestidad es el argumento de venta.
5. **Nombres propios reales.** Confetti, Club Hípico, Berlín. Nada genérico.
6. **Sin signos de exclamación.** Ni un solo `!` en toda la página.
7. **Numeración visible.** `01–04` en todas las secciones. Es identidad, no
   decoración.

## Contenido que falta (huecos de conversión)

| Hueco | Por qué importa | Prioridad |
| --- | --- | --- |
| **Enlaces a los sitios en vivo de los casos** | La prueba social más fuerte, ya existe, no cuesta nada | 🔴 Alta |
| **Rangos de precio o de inversión** | Fricción número uno del mercado objetivo | 🔴 Alta |
| **Tiempos por fase del proceso** | Segunda objeción más común | 🟠 Media |
| **Sección «sobre mí»** | En un estudio de una persona, la persona es el producto | 🟠 Media |
| **FAQ** | Resuelve objeciones y alimenta SEO local | 🟠 Media |
| **Formulario alternativo a WhatsApp** | Hoy hay un solo canal; quien no usa WhatsApp se va | 🟠 Media |
| **«Esto es para ti si…» / «No es para ti si…»** | Califica prospectos y ahorra conversaciones | 🟡 Baja |
| **Qué entrego exactamente** (dominio, hosting, capacitación, soporte) | Define el alcance antes de la llamada | 🟡 Baja |
| **Aviso de privacidad** | Requisito legal en México si se recogen datos | 🟡 Baja (🔴 si se añade formulario) |

## Migración propuesta del contenido

Consolidar todo el copy en `src/content/` para que editar la página no requiera
tocar JSX:

```
src/content/
├── site.js        meta, título, descripción, OG, JSON-LD
├── contact.js     CONTACT + variantes del mensaje de WhatsApp por origen
├── hero.js        etiqueta, titular, lead, CTAs, credenciales, ticker
├── manifesto.js
├── capabilities.js  (hoy CAPABILITIES + encabezado de sección)
├── projects.js      (hoy PROJECTS + url, + encabezado + frase de cierre)
├── process.js       (hoy PROCESS + duraciones + encabezado)
├── faq.js           nuevo
└── footer.js
```
