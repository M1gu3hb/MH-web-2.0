# Sistema de movimiento de Morphiq — v2

**El sitio responde, revela y narra.**

La primera versión de este documento decía «el sitio responde, no baila», y
eso llevó el diseño demasiado lejos hacia la prudencia: todo entraba igual
—opacidad más 26 px hacia arriba— y a partir de la quinta sección el
movimiento dejaba de existir. Técnicamente había animación; visualmente no.

Morphiq vende diseño y desarrollo. El sitio es a la vez el argumento
comercial y la muestra del trabajo, así que tiene derecho a espectáculo. Lo
que no tiene es derecho a estorbar: **quien quiera ignorar todo el
movimiento tiene que poder leer la página perfectamente.** Ese es el límite.

El orden de prioridades, cuando algo entra en conflicto:

1. contenido
2. jerarquía
3. composición
4. movimiento

Nunca al revés.

---

## Reglas técnicas que aplican a todo

1. **Solo `transform`, `opacity`, `clip-path` y `filter`.** Las cuatro que el
   compositor puede resolver sin recalcular el reparto de la página, y
   ninguna cuenta para CLS. Nada de animar `width`, `height`, `top` ni
   `background-position`.
2. **Curva única:** `cubic-bezier(0.22, 1, 0.36, 1)`. Sale rápido y frena
   suave. Una sola curva en todo el sitio es lo que hace que las cosas se
   sientan del mismo producto.
3. **Duraciones.** Respuesta al cursor 180–350 ms. Entrada de sección
   620–860 ms. Transición de ruta 260 ms. Nada por encima de 900 ms salvo
   los bucles de fondo.
4. **Nada bloquea el scroll.** No hay secuencias que se apoderen de la rueda
   ni animaciones que obliguen a esperar para seguir leyendo. Lo que se
   revela con el scroll se revela mientras pasas: si bajas rápido, lo ves ya
   revelado y sigues.
5. **Nada corre fuera de pantalla.** Todo efecto con `requestAnimationFrame`
   se para al salir del viewport y con la pestaña oculta.
6. **`prefers-reduced-motion` desactiva movimiento, no información.** Con la
   preferencia puesta desaparecen bucles, inclinaciones, barridos y arcos;
   todo el contenido sigue visible y todas las interacciones siguen
   funcionando. Resuelto en CSS **y** en JS, no solo en uno.

---

## 1. Las seis familias de entrada

Viven en `src/components/motion/index.jsx`. La regla de reparto es simple:
**dos secciones seguidas nunca usan la misma familia.** Seis bastan para que
haya ritmo; treinta serían la otra forma de que no se note ninguna.

| Familia | Qué hace | Para qué |
| --- | --- | --- |
| **Cortina** | El bloque se descubre tras una máscara que sube (`clip-path`), sin moverse de su sitio | Explicadores, encabezados de sección, párrafos de apertura |
| **Cascada** | Los hijos entran escalonados, 60 ms de paso, saturado a los 5 primeros | Rejillas de hermanos del mismo peso |
| **Escala** | Llega desde el fondo, de 0.94 a 1 | Piezas que son objetos: maquetas, tarjetas con imagen, planes |
| **Lateral** | Entra desde un costado, medido en % del propio elemento | Listas largas, alternando izquierda y derecha |
| **Secuencia** | Cada elemento se enciende al llegar a su umbral, con desenfoque que se resuelve | Procesos, problemas, reglas: cosas que son pasos |
| **Titular** | Cada línea sube desde debajo de su propia máscara | Statements de nivel A |

Detalles que importan:

- El tope de 5 en `Cascada` no es arbitrario: con 60 ms de paso, el sexto
  entra a 360 ms del primero y a partir de ahí se lee como que la página va
  lenta, no como ritmo.
- `Escala` parte de 0.94 y no de menos: por debajo de 0.9 el texto se ve
  borroso mientras dura la entrada, porque el navegador escala una textura
  ya rasterizada.
- `Secuencia` convierte un `li` en `motion.li` en vez de envolverlo: envolver
  rompería la relación `ol → li` y con ella lo que un lector de pantalla
  anuncia («elemento 3 de 7»).
- Todas se disparan una sola vez. Volver a subir no vuelve a animar nada.

## 2. Entrada de página

Al cambiar de ruta, el contenido entra con un fundido de **260 ms** y **10 px**
de desplazamiento.

- Vive en `components/layout/Layout.jsx`, con `AnimatePresence` sobre el
  `Outlet` y `key={pathname}`.
- **No** se usa `mode="wait"`: encadenar salida y entrada duplicaría el
  tiempo percibido y navegar empezaría a sentirse como esperar.
- El foco vuelve a `#contenido` en cada cambio de ruta.

## 3. Arranque

La pantalla de marca se ve **una vez por sesión y solo en la home**.

Quien llega desde Google a `/precios` viene a leer algo concreto: un velo a
pantalla completa antes del contenido lo retrasa y además convierte ese velo
en el elemento más grande que se pinta, o sea en el LCP de la página que
vende. Se salta también con `prefers-reduced-motion`.

## 4. Texto — desfragmentación

`ScrambleText` sigue siendo la firma tipográfica del sitio.

| Dónde | Disparo |
| --- | --- |
| Titular del hero, títulos de sección, H1 de página | `both`: al entrar en pantalla y al pasar el cursor |
| Eyebrows y etiquetas | `view`: solo al entrar |
| Texto de párrafo | nunca |

El texto real permanece siempre en el DOM y el efecto pinta encima: si falla,
lo que queda es el texto, no un hueco. Hay una red de seguridad que lo revela
a los 6 s pase lo que pase.

## 5. Cursor — qué reacciona

Solo con **puntero fino y con hover disponible**. En táctil ninguna
información depende de acercarse a nada.

| Elemento | Reacción |
| --- | --- |
| Tarjeta de solución | Inclinación ≤3° hacia el cursor, halo del acento que lo sigue, barrido de luz, maqueta al 103,5 % |
| Tarjeta de proyecto | Levantada de 5 px, lámina de luz (`GlareHover`), filo del color del proyecto |
| Tarjeta de precio | Foco que sigue al cursor (`SpotlightCard`); la destacada, arco eléctrico |
| Paso del proceso | El filo superior se enciende en azul |
| Símbolo de marca y texto profundo | Paralaje de las capas hacia el cursor |
| CTA principal del hero | Atracción magnética (`Magnet`), 0,3 de fuerza y 120 px de radio |
| Cualquier clic | Chispa (`ClickSpark`) |

La inclinación se mantiene por debajo de 3°. Más que eso deja de leerse como
respuesta y empieza a leerse como juguete.

## 6. Fondo — lo único que se mueve solo

| Contexto | Qué |
| --- | --- |
| Hero, escritorio con puntero fino | `Scanner`: shader de ondas en `ogl`, DPR a 1,25, pausado fuera de pantalla y con la pestaña oculta |
| Hero, teléfono y tableta | Ola en CSS: tres arcos en un mosaico que se repite cada 520 px y una capa que baja exactamente esos 520 px, así el bucle cierra sin costura |
| Cierre de la home | `CampoPuntos`: retícula que se abulta al paso del cursor, enmascarada hacia el centro para no competir con el titular |
| Cabeceras interiores | Retícula técnica que se desvanece hacia abajo, más un barrido de luz de 11 s |
| Indicador de scroll | Punto que baja, 1,9 s |

Todos son bucles lentos y de bajo contraste. Un fondo que compite con el
texto es un fondo mal hecho. Ninguno de ellos existe en teléfono salvo la
ola, que es la más barata de las cinco.

## 7. Profundidad — cuándo hay 3D

- **Símbolo de marca** (`Logo3D`): pila de capas con perspectiva, inclina con
  el cursor y reacciona al clic. 14 capas con puntero fino, 7 en táctil.
- **Texto profundo** (`TextoProfundo`): la misma técnica aplicada a una
  palabra. 28 capas con puntero fino, 12 en táctil. Reservado para cuerpos
  por encima de 90 px, que son los únicos que aguantan relieve.
- **Maqueta de la cabecera de servicio**: `rotateY(-7deg) rotateX(3deg)` fija.
  Por debajo de 900 px se aplana.
- **Firma MH97**: relieve por sombras, quieta.
- La escena WebGL de la laptop (`LaptopStage`) **sigue apagada**, igual que en
  producción. No se reactiva: existe como código histórico y su coste no se
  justifica dentro de esta arquitectura.

## 8. Reduced motion

Con `prefers-reduced-motion: reduce`:

- No hay pantalla de arranque, ni shader, ni ola, ni barridos, ni retícula de
  puntos, ni arcos eléctricos —queda el filo estático, que es la señal real.
- Las seis familias devuelven el contenido tal cual, sin envoltorio.
- El marco expansivo se queda directamente en su tamaño final.
- Las tarjetas no se inclinan ni se levantan; el cambio de borde y de color
  se queda, porque es información.
- La transición de ruta se reduce a un cambio directo.
- `Magnet`, `ScrambleText` y `ClickSpark` se desactivan solos.

---

## Piezas adaptadas de React Bits

Cinco componentes parten del código publicado de
[React Bits](https://reactbits.dev) (MIT + Commons Clause, uso comercial
permitido) y están adaptados a este sitio. La cabecera de cada archivo
detalla qué se conservó del original y qué se cambió.

| Aquí | Original | Dónde se usa | Qué se cambió |
| --- | --- | --- | --- |
| `BordeElectrico` | ElectricBorder | Plan destacado, CTA del cierre, número de contacto | Azul de marca en vez de violeta; seis octavas de ruido en vez de diez; pausa fuera de pantalla; sin lienzo en táctil |
| `CampoPuntos` | DotField | Fondo del cierre | Degradado azul→plata; pausa fuera de pantalla y con pestaña oculta; cursor relativo al lienzo para que no se desincronice con Lenis |
| `TextoProfundo` | DepthText | Statements de nivel A | Plata sobre azul; multilínea; capas según dispositivo; sin órbita automática |
| `DesenfoqueProgresivo` | GradualBlur | Bordes de bloques que se salen del marco | Reescrito a cinco franjas y dos props; se apaga sin `backdrop-filter` |
| `MarcoExpansivo` | ScrollExpand | Rejillas de proyectos | Reescrito sobre `useScroll` de Motion en vez de rAF propio; no fija nada ni monta pista de scroll |

Ninguno conserva el color ni el estilo del ejemplo. Los cinco se degradan a
una versión estática sin puntero fino o con movimiento reducido.

---

## Dónde vive cada cosa

| Regla | Archivo |
| --- | --- |
| Las seis familias de entrada | `src/components/motion/index.jsx` |
| Transición de ruta, arranque, scroll suave | `src/components/layout/Layout.jsx` |
| Scramble, Magnet, Spotlight, StarBorder, Glare, ClickSpark | `src/components/reactbits/` |
| Piezas adaptadas de React Bits | `src/components/reactbits/` + final de `src/styles/reactbits.css` |
| Fondo del hero | `src/components/hero/PortadaHero.jsx` + `.portada__fondo` en `sitio.css` |
| Reacción de tarjetas | `src/components/ui/TarjetaSolucion.jsx` + `sitio.css` |
| Señal de cabeceras | `.cabecera-pagina__senal` en `sitio.css` |
| Escala tipográfica | `--t-statement`, `--t-seccion`, `--t-cabecera`, `--t-tarjeta` en `tokens.css` |
| Suelos de accesibilidad y reduced-motion | final de `src/styles/sitio.css` |
