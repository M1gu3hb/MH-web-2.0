# SEO Y SEARCH CONSOLE

> Auditoría pedida a raíz de una pregunta concreta: *«¿por qué Google no
> enseña las secciones del sitio?»*. Se auditó contra el `dist` real, no
> contra el código fuente, porque lo que Google lee es el HTML que sale del
> build.

---

## 1. Lo que NO estaba bloqueado

Antes de buscar culpables conviene descartar lo obvio, y aquí estaba todo
correcto:

| Comprobación | Estado |
|---|---|
| `robots.txt` | `Allow: /` para todos los agentes, con `Sitemap:` declarado |
| `<meta name="robots">` del HTML base | `index, follow, max-image-preview:large, max-snippet:-1` |
| `noindex` | solo en `/404`, que es donde debe estar |
| Cabecera `X-Robots-Tag` | `noindex, nofollow` **únicamente** en `*.vercel.app`, o sea en las vistas previas; producción no la lleva |
| `canonical` | uno por ruta, apuntando a sí misma |
| Estado HTTP del 404 | 404 de verdad, no un soft-404 |

**Conclusión: nada impedía la indexación.** El problema no era permiso, era
que el HTML no decía lo suficiente antes de que se ejecutara el JavaScript.

---

## 2. Lo que sí estaba mal, y ya está arreglado

### 2.1 La misma `og:description` en las diecisiete URLs

El generador de HTML por ruta borraba las etiquetas del HTML base para
escribir las suyas, y lo hacía con expresiones que exigían `<meta property=`
con un espacio literal. En `index.html` esas dos etiquetas concretas —
`og:description` y `twitter:description` — están repartidas en varias líneas:

```html
<meta
  property="og:description"
  content="…"
/>
```

Así que no coincidían, no se borraban, y **la descripción social de la home
viajaba idéntica a todas las páginas**. Ese es exactamente el patrón que
Search Console reporta como duplicado. Ahora los reemplazos usan `\s+` y
toleran el salto de línea.

### 2.2 El `og:image` de los casos declaraba unas medidas y entregaba otras

El HTML base declara `og:image:type: image/jpeg`, `width: 1200`,
`height: 630` — y esas tres etiquetas tampoco se borraban. Las fichas de
proyecto ponían encima un `og:image` que apunta a `/casos/*.webp`, que son
**760×753 y WebP**. O sea: se prometía una tarjeta apaisada en JPEG y se
entregaba una casi cuadrada en WebP. Al compartir, la red social recorta por
su cuenta y la tarjeta sale mal.

Ahora la tarjeta social es siempre `og-morphiq.jpg`, con sus medidas de
verdad declaradas desde un solo sitio (`TARJETA_SOCIAL`). La maqueta del caso
sigue en el JSON-LD, donde no hay ninguna regla de formato que romper.

> Pendiente opcional: si algún día se generan tarjetas 1200×630 por caso, se
> añaden en `TARJETA_SOCIAL` y `imagenSocial` deja de caer en la genérica.

### 2.3 `public/sitemap.xml` con una sola URL

Había un `sitemap.xml` versionado en `public/` con **una** URL. En el build
lo pisa `scripts/sitemap.mjs`, así que no llegaba a publicarse… mientras el
script funcionara. Si un día fallaba, se publicaba un sitemap de una URL sin
que nadie se enterara. Borrado.

### 2.4 Las diecisiete URLs compartían `lastmod`

El `lastmod` salía del último commit del repositorio, así que tocar una hoja
de estilos ponía la misma fecha en todo el sitio. Google solo hace caso al
`lastmod` cuando lo ve consistente; en cuanto deja de creérselo lo ignora en
**todo** el sitemap.

Ahora cada URL lleva la fecha del último commit que tocó **sus** archivos
(`FUENTES` en `scripts/sitemap.mjs`). Los comunes —diseño, tokens, pie— se
dejan fuera a propósito: si entraran, volveríamos al problema.

### 2.5 La home no tenía `WebPage` ni `FAQPage` antes del JavaScript

El HTML de la home lleva a mano `Organization`, `Person` y `WebSite`, pero
`WebPage` y `FAQPage` solo aparecían **después** de que React se ejecutara.
Son justo los dos nodos que pueden hacer que la home salga con sus preguntas
desplegadas en el resultado de búsqueda. Lo mismo pasaba en `/precios` con el
`OfferCatalog`.

Las dos listas de preguntas se movieron a `src/content/index.js` —JavaScript
llano, importable desde Node— para que las use la página al pintar y el build
al escribir el HTML. Una sola fuente, sin copia que se desincronice.

### 2.6 Las siete ofertas apuntaban a la misma URL

`nodoOferta` escribía `url: /precios` en las siete. Siete ofertas con la
misma dirección son, para un buscador, siete formas de decir lo mismo. Ahora
cada una lleva su ancla: `/precios#web-esencial`, `/precios#crm`, etc.

### 2.7 Títulos de proyecto de 66 a 75 caracteres

`Nombre: tipo | Morphiq` se iba a 75 caracteres y Google corta alrededor de
60: se perdía justo lo que distingue un caso de otro. Cada proyecto tiene
ahora un `tituloSeo` corto, todos por debajo de 60 con la marca incluida.

### 2.8 La miga de restaurantes decía una cosa y llevaba a otra

Decía «Soluciones» y apuntaba a `/servicios`. Ahora dice «Servicios».

### 2.9 Las fichas de proyecto solo se enlazaban desde `/proyectos`

Una página con un único enlace entrante se rastrea tarde y se reconsidera
poco. El pie lleva ahora una tira con las once fichas, presente en todas las
páginas.

---

## 3. Lo que se decidió NO hacer

**`SearchAction` / caja de búsqueda de enlaces de sitio.** Google anunció su
retirada el 21 de octubre de 2024 y dejó de usarla el 21 de noviembre de
2024. Añadirla hoy es escribir código para una función que ya no existe.

**Inflar `sameAs`.** La auditoría sugería ampliarlo. El único perfil público
que existe de verdad es GitHub. Inventar un LinkedIn o un Instagram que no
existen sería declarar identidades falsas en datos estructurados, que es peor
que una lista corta. Cuando haya perfiles reales, se añaden en `index.html`,
en los dos nodos (`Organization` y `Person`).

---

## 4. Cómo comprobarlo sin fiarse de nadie

```bash
npm run build

# ninguna description repetida entre rutas
grep -h -o 'name="description" content="[^"]*"' dist/**/index.html | sort | uniq -d

# la home ya trae sus preguntas antes del JavaScript
grep -c FAQPage dist/index.html

# cada oferta con su ancla
grep -o '"url":"[^"]*precios#[a-z-]*"' dist/precios/index.html

# fechas distintas en el sitemap
grep -o '<lastmod>[^<]*' dist/sitemap.xml | sort | uniq -c
```

## 5. En Search Console

Tras publicar: reenviar `sitemap.xml`, y usar «Inspeccionar URL» sobre la
home y sobre `/precios` para comprobar en «HTML probado» que el `FAQPage` y
el `OfferCatalog` aparecen sin necesidad de renderizar. Los resultados
enriquecidos tardan días o semanas en aparecer; que el dato esté en el HTML
es lo único que está en nuestra mano.
