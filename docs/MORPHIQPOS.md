# MorphiqPOS en el sitio

Qué se añadió para presentar MorphiqPOS como producto, dónde vive cada pieza y
qué hay que tocar para cambiarla. Publicado en la ruta **`/morphiqpos`**.

## Qué hay

| Pieza | Dónde | Notas |
| --- | --- | --- |
| Página del producto | `src/paginas/MorphiqPos.jsx` | Ruta propia, fuera de `/servicios`. Carga con `lazy` |
| Todo el copy | `src/content/morphiqpos.js` | Fuente única para la página, la sección de la home y el HTML del build |
| Sección en la home | `src/components/pos/SeccionPosInicio.jsx` | Lo primero debajo del hero |
| Tarjetas de servicio | `src/components/ui/TarjetaSolucion.jsx` + `src/components/escenas/` | Escenas nuevas, entrada y foco nuevos |
| Kit de demostraciones | `src/components/pos/kit.jsx` | `useGuion`, `armarGuion`, `Cursor`, `Cifra`, `MarcoPos` |
| Pantallas del sistema | `src/components/pos/pantallas.jsx`, `pantallas-giros.jsx` | HTML de verdad, no capturas |
| Fondo ASCII | `src/components/pos/CampoAscii.jsx` | Un shader con `ogl` |
| Terminal 3D en ASCII | `src/components/pos/TerminalAscii.jsx` | three.js, en su propio trozo |
| Modelo 3D | `public/pos/terminal-v1.glb` | 434 KB. Ver «El modelo» |

Dar de alta la ruta en `src/config/rutas.js` la metió a la vez en el router, el
menú, el pie, el sitemap y el HTML por ruta (`scripts/paginas-html.mjs`), que
además le escribe su `SoftwareApplication` y sus preguntas en JSON-LD.

## Reglas de contenido

- Se habla como equipo. Ni nombres propios ni primera persona del singular.
- Ningún cliente nombrado. Los negocios de las pantallas (Tepalcate, Café
  Origen, Filo…) son de ejemplo.
- Los únicos números son los que se pueden contar en el producto: cinco modelos
  de negocio y ocho estilos. Cero cifras de resultados.
- El precio sale de `PLANES.pos` (`src/config/pricing.js`), con «desde». No se
  escribe a mano en ningún otro sitio salvo en la respuesta de «¿Cuánto cuesta?».

## Cómo funcionan las demostraciones

Cada pantalla o escena declara un **guion** con `armarGuion`:

```js
const G = armarGuion([
  { espera: 700 },                     // dejar respirar
  { x: 34.8, y: 75, marca: 'propina' } // ir a ese punto y pulsar
]);
```

- `x` e `y` son porcentajes de la pantalla. Una acción con coordenadas se parte
  en dos pasos —ir y pulsar— para que el clic ocurra cuando el cursor ya llegó.
- La pantalla pregunta `ya('propina')` en vez de comparar contra un número.
- `useGuion` solo corre cuando la escena está a la vista, se reinicia al volver
  a entrar y, con movimiento reducido, se queda en el paso más elocuente.

**Si se mueve un botón dentro de una pantalla, su coordenada en el guion deja de
coincidir.** Las coordenadas se midieron con el navegador (centro del elemento
respecto a `.pv__cuerpo` o `.esc__lienzo`); son iguales en cualquier ancho porque
todo lo de dentro se mide en `em` sobre el ancho del contenedor.

En teléfono las pantallas del sistema se pintan un 65 % más anchas que su marco
y se desplazan para seguir al cursor (`--foco`). Las cuentas están en la cabecera
de ese bloque en `src/styles/pos-kit.css`.

## Estilos

| Hoja | Quién la carga | Qué lleva |
| --- | --- | --- |
| `styles/pos-base.css` | Todo el sitio (`index.css`) | Marca, punto del menú, campo ASCII, sección de la home, carrete |
| `styles/pos-kit.css` | `kit.jsx` | Las pantallas del sistema y el cursor |
| `styles/pos.css` | `MorphiqPos.jsx` | La página del producto |
| `components/escenas/escenas.css` | `escenas.jsx` | Las escenas de las tarjetas |

Solo la primera bloquea el primer pintado. Las demás viajan con su trozo de
JavaScript: añadir MorphiqPOS costó 1 KB de CSS y 4.6 KB de JS (gzip) al arranque
de la home.

## El modelo

`terminal-v1.glb` es una terminal de punto de venta generada con Meshy
(texto a 3D, Meshy 7.1) y tratada después:

1. **Textura limpiada.** El modelo traía garabatos que imitaban letras. Se
   reclasificó la textura en tres materiales —cuerpo, cristal y papel— y se
   repintó con el gunmetal de la marca.
2. **Normales suavizadas** por posición, con pliegue a 38°: de origen salía
   facetado.
3. **Sin mapa de normales**, que metía ruido.
4. **Optimizado** con `gltf-transform`: geometría meshopt y texturas WebP a 1024.

La interfaz que se ve en su cristal es `public/pos/pantalla-v1.webp`, una captura
de la pantalla de la orden pegada a un plano cuya posición sale de medir la cara
de la pantalla en la geometría.

El nombre lleva versión porque `vercel.json` sirve los `.glb` y `.webp` con caché
inmutable de un año: para cambiarlo hay que publicar `terminal-v2.glb` y
actualizar la constante `MODELO` en `TerminalAscii.jsx`.

## De dónde sale cada patrón

- **React Bits** (MIT + Commons Clause): `CampoAscii` parte de la idea de
  `GradientASCII`; el foco del bento, de `MagicBento`. Reescritos para esta base
  de código, como el resto de `components/reactbits`.
- **21st.dev**: la demostración con panel fijo parte de «Features With Panel» y
  la rejilla de módulos de «Bento Mini UI».
- **Geist Mono** (`@fontsource-variable/geist-mono`): la monoespaciada del arte
  ASCII, solo el subset latino. El arte se escribe con ASCII puro a propósito.

## El personalizador vende

`Personaliza.jsx` ya no enseña una pantalla quieta. Monta `CajaViva.jsx`: la
pantalla de órdenes del kit con botones de verdad. El visitante toca
productos, elige efectivo o tarjeta, cobra, y sale un ticket con el nombre
que escribió y su color.

- La piel le llega por las mismas variables `--pv-*` que a las demostraciones.
- En teléfono no usa la cámara que sigue al cursor: se reordena en vertical y
  cabe entera. Con el ticket abierto crece lo justo para que quepa
  (`--lineas`).
- Mientras el ticket está en pantalla lo de debajo queda `inert` y el foco
  pasa a «Nueva venta».
- Los productos son `PLATILLOS`, exportado desde `pantallas.jsx`.
