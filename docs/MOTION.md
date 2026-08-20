# Sistema de movimiento de Morphiq

Reglas, no animaciones sueltas. Si algo se mueve en este sitio, está en una
de estas ocho categorías; si no encaja en ninguna, no se anima.

El principio: **el sitio responde, no baila.** Casi nada se mueve por su
cuenta. Lo que se mueve, se mueve porque el visitante hizo algo o porque
llegó a algún sitio.

---

## Reglas técnicas que aplican a todo

1. **Solo `transform` y `opacity`.** Son las dos propiedades que el
   compositor puede animar sin repintar y las únicas que no cuentan para
   CLS. Nada de animar `width`, `height`, `top` ni `background-position`.
2. **Curva única:** `cubic-bezier(0.22, 1, 0.36, 1)`. Sale rápido y frena
   suave. Una sola curva en todo el sitio es lo que hace que las cosas se
   sientan del mismo producto.
3. **Duraciones.** Respuesta al cursor 180–350 ms. Entrada de sección
   450–700 ms. Transición de ruta 260 ms. Nada por encima de 900 ms salvo
   los bucles de fondo.
4. **Nada bloquea el scroll.** No hay secuencias que se apoderen de la
   rueda ni animaciones que obliguen a esperar para seguir leyendo.
5. **`prefers-reduced-motion` desactiva movimiento, no información.** Con la
   preferencia puesta desaparecen los bucles, las inclinaciones y los
   barridos; todo el contenido sigue visible y todas las interacciones
   siguen funcionando. Está resuelto en CSS **y** en JS, no solo en uno.

---

## 1. Entrada de página

Al cambiar de ruta, el contenido entra con un fundido de **260 ms** y
**10 px** de desplazamiento hacia arriba.

- Vive en `components/layout/Layout.jsx`, con `AnimatePresence` sobre el
  `Outlet`, con `key={pathname}`.
- **No** se usa `mode="wait"`: encadenar salida y entrada duplicaría el
  tiempo percibido y navegar empezaría a sentirse como esperar.
- El foco vuelve a `#contenido` en cada cambio de ruta, para que quien
  navega con teclado o lector no se quede en el pie de la página anterior.

## 2. Arranque

La pantalla de marca se ve **una vez por sesión y solo en la home**.

Quien llega desde Google a `/precios` viene a leer algo concreto: un velo a
pantalla completa antes del contenido lo retrasa y además convierte ese velo
en el elemento más grande que se pinta, o sea en el LCP de la página que
vende. Se salta también con `prefers-reduced-motion`.

## 3. Reveal — cómo aparecen las secciones

Componente `Reveal` (ya existía). Entrada con opacidad y ~24 px de
desplazamiento, disparada por `IntersectionObserver` cuando el bloque entra
en pantalla.

- El escalonado entre hermanos es de **50–70 ms**, y **nunca más de 5**
  elementos escalonados seguidos: a partir de ahí el último tarda tanto que
  parece que la página se colgó.
- Se dispara una sola vez. Volver a subir no vuelve a animar nada.

## 4. Texto — desfragmentación

`ScrambleText` es la firma tipográfica del sitio.

| Dónde | Disparo |
| --- | --- |
| Titular del hero, títulos de sección, H1 de página | `both`: al entrar en pantalla y al pasar el cursor |
| Eyebrows y etiquetas | `view`: solo al entrar |
| Texto de párrafo | nunca |

El texto real permanece siempre en el DOM y el efecto pinta encima. Eso es
deliberado: si el efecto falla o el navegador no lo soporta, lo que queda es
el texto, no un hueco. Hay además una red de seguridad que lo revela a los
6 s pase lo que pase.

## 5. Cursor — qué reacciona

Solo con **puntero fino y con hover disponible**. En táctil ninguna
información depende de acercarse a nada.

| Elemento | Reacción |
| --- | --- |
| Tarjeta de solución | Inclinación ≤3° hacia el cursor, halo del acento que lo sigue, barrido de luz en el marco, maqueta al 103,5 % |
| Tarjeta de proyecto | Levantada de 5 px, lámina de luz (`GlareHover`), filo del color del proyecto, maqueta al 104,5 % |
| Tarjeta de precio | Foco que sigue al cursor (`SpotlightCard`); la destacada, filo recorrido (`StarBorder`) |
| CTA principal del hero | Atracción magnética (`Magnet`), 0,3 de fuerza y 120 px de radio |
| Cualquier clic | Chispa (`ClickSpark`) |
| Flechas de «ver» | 3 px en diagonal |

La inclinación se mantiene por debajo de 3°. Más que eso deja de leerse como
respuesta y empieza a leerse como juguete.

## 6. Fondo — lo único que se mueve solo

| Contexto | Qué |
| --- | --- |
| Hero, escritorio con puntero fino | `Scanner`: shader de ondas en `ogl`, con DPR limitado a 1,25, pausado fuera de pantalla y con la pestaña oculta |
| Hero, teléfono y tableta | Ola en CSS: tres arcos en un mosaico que se repite cada 520 px y una capa que baja exactamente esos 520 px, así el bucle cierra sin costura |
| Cabeceras interiores | Retícula técnica que se desvanece hacia abajo, más un barrido de luz de 11 s |
| Indicador de scroll | Punto que baja, 1,9 s |

Todos son bucles lentos y de bajo contraste. Un fondo que compite con el
texto es un fondo mal hecho.

## 7. Profundidad — cuándo hay 3D

- **Símbolo de marca** (`Logo3D`): pila de capas con perspectiva, inclina
  con el cursor y reacciona al clic. 14 capas con puntero fino, 7 en táctil.
- **Maqueta de la cabecera de servicio**: `rotateY(-7deg) rotateX(3deg)`
  fija, para que se lea como una pieza y no como una captura pegada. En
  pantallas de menos de 900 px se aplana.
- **Firma MH97**: relieve por sombras, quieta.
- La escena WebGL de la laptop (`LaptopStage`) **sigue apagada**, igual que
  en producción. No se reactiva: existe como código histórico y su coste no
  se justifica dentro de esta arquitectura.

## 8. Reduced motion

Con `prefers-reduced-motion: reduce`:

- No hay pantalla de arranque, ni shader, ni ola de fondo, ni barridos.
- Las secciones aparecen sin desplazamiento.
- Las tarjetas no se inclinan ni se levantan; el cambio de borde y de color
  se queda, porque es información, no decoración.
- La transición de ruta se reduce a un cambio directo.
- `Magnet`, `ScrambleText` y `ClickSpark` se desactivan solos: ya lo
  comprobaban internamente antes de esta iteración.

---

## Dónde vive cada cosa

| Regla | Archivo |
| --- | --- |
| Transición de ruta, arranque, scroll suave | `src/components/layout/Layout.jsx` |
| Reveal, Scramble, Magnet, Spotlight, StarBorder, Glare, ClickSpark | `src/components/reactbits/` |
| Fondo del hero | `src/components/hero/PortadaHero.jsx` + `.portada__fondo` en `sitio.css` |
| Reacción de tarjetas | `src/components/ui/TarjetaSolucion.jsx` + `sitio.css` |
| Señal de cabeceras | `.cabecera-pagina__senal` en `sitio.css` |
| Suelos de accesibilidad y reduced-motion | final de `src/styles/sitio.css` |
