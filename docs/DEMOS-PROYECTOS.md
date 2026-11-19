# Demostraciones de proyecto

Cada proyecto del portafolio lleva una escena animada que lo enseña usándose.
Se monta encima de la maqueta horneada, en la tarjeta (índice, home,
relacionados) y en la cabecera de su ficha.

## Dónde vive

| Archivo | Qué es |
| --- | --- |
| `src/components/proyectos/index.jsx` | `DemoProyecto` y el mapa `slug → [grupo, componente]` |
| `src/components/proyectos/base.jsx` + `base.css` | El andamio: `guion`, `useEscena`, `Marco`, el rótulo y las piezas compartidas |
| `src/components/proyectos/jch.jsx` | El recinto: sitio, CRM, portal del cliente, estudio 3D, baile |
| `src/components/proyectos/web.jsx` | Los sitios: Vero, The Best Moment, Fiesta Total, enlaces, TheXaviMTZ, académico |
| `src/components/proyectos/producto.jsx` | Productos y cajas: GLYPHOS, Confetti, Berlín, GESTECH, Photo Booth, NFC, Morphiq UI, MorphiqPOS |

Los tres grupos son tres trozos de JS y CSS que se piden por separado. Una
ficha descarga solo el suyo.

## Las reglas de una escena

1. **Nada cambia solo.** Un cursor va a cada cosa y la pulsa. La excepción
   son GESTECH y NFC Manager, donde quien manda es una mano o un teléfono.
2. **El cursor no lleva coordenadas.** La acción nombra su destino
   (`{ a: 'cobrar' }`) y el andamio mide el nodo con `data-t="cobrar"`.
   Mover un botón en el CSS no descuadra nada.
3. **Lleva rótulo.** `etapas` es la lista `[marca, frase]`: qué está pasando,
   en una línea. Es lo que hace que una interfaz ajena se entienda en tres
   segundos.
4. **16:10 y en `em`.** La capa útil mide 31.5 × 16.9 em. Lo que no se lee en
   una tarjeta de 330 px no entra.
5. **Lo que se ve es del proyecto.** Paleta, nombres de paquetes, modos y
   lanzamientos salen de su repositorio. Las cifras de venta son de
   demostración. De los sistemas internos (CRM, portal) no aparece ningún dato
   real de cliente.

## La imagen sigue debajo

`imagen` en `content/proyectos.js` no se retira. Es lo primero que se pinta,
lo que ve quien pidió menos movimiento (la escena ni se descarga) y la que
lleva el texto alternativo.

## Añadir un proyecto

1. Escribe la escena en el grupo que le toque, con su `guion` y sus `etapas`.
2. Añade el `slug` al mapa `DONDE` de `index.jsx`.
3. Revísala en `/proyectos/<slug>` a 1440 y a 390 de ancho.

Sin el paso 2 la tarjeta se queda con su imagen, que es un fallo que no rompe
nada.
