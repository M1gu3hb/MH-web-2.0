/**
 * ============================================================
 * MORPHIQPOS — todo el contenido del producto
 * ============================================================
 *
 * Una sola fuente para tres sitios: la página /morphiqpos, la sección de la
 * home y el HTML que escribe el build para cada ruta. Cambiar un texto es
 * cambiar este archivo.
 *
 * CRITERIO
 *   · Se habla como equipo: «te lo enseñamos», «un asesor te contacta».
 *     Nunca en primera persona del singular ni con nombres propios.
 *   · Cero clientes nombrados. El producto se explica por lo que hace, no
 *     por dónde está instalado.
 *   · Cero cifras de resultados. Los únicos números son los que se pueden
 *     contar en el producto: cinco modelos de negocio y ocho estilos.
 *   · Lo que depende del alcance se dice que depende del alcance.
 */

import { RUTAS } from '../config/rutas.js';

export const POS_SEO = {
  title: 'MorphiqPOS: punto de venta a la medida de tu negocio | Morphiq',
  description:
    'MorphiqPOS es el punto de venta de Morphiq: caja, inventario, cocina, citas, clientes y reportes en un solo sistema, con tu marca y conectado a tu sitio web.',
};

export const POS_MIGAS = [
  { nombre: 'Inicio', path: RUTAS.inicio },
  { nombre: 'MorphiqPOS', path: RUTAS.morphiqpos },
];

/* ------------------------------------------------------------
   Portada
   ------------------------------------------------------------ */

export const POS_HERO = {
  eyebrow: 'Punto de venta a la medida',
  lineas: ['El punto de venta', 'que se arma', 'a tu medida.'],
  resalte: 'a tu medida.',
  entrada:
    'Caja, inventario, cocina, citas, clientes y reportes en un solo sistema. Con tu marca, tus pantallas y tu forma de trabajar: no te adaptas tú al sistema, el sistema se arma para tu negocio.',
  datos: [
    { valor: '5', etiqueta: 'modelos de negocio', nota: 'sobre el mismo núcleo' },
    { valor: '8', etiqueta: 'estilos visuales', nota: 'y el tuyo, si no está' },
    { valor: '1', etiqueta: 'solo sistema', nota: 'en caja, tableta y teléfono' },
  ],
};

/* La cinta de giros que corre bajo la portada. */
export const POS_CINTA = [
  'Restaurantes',
  'Cafeterías',
  'Tiendas de abarrotes',
  'Ferreterías',
  'Estéticas y barberías',
  'Pastelerías',
  'Taquerías',
  'Papelerías',
  'Consultorios',
  'Boutiques',
];

/* ------------------------------------------------------------
   Un día de operación — la demostración que avanza con el scroll
   ------------------------------------------------------------
   Seis momentos del día, en el orden en que pasan. Cada uno enciende una
   pantalla distinta del sistema. */

export const POS_DIA = [
  {
    id: 'mesas',
    hora: '13:02',
    titulo: 'El salón, de un vistazo',
    cuerpo:
      'Cada mesa dice en qué va: libre, ordenando, esperando su comida o pidiendo la cuenta. El mesero la abre desde su teléfono y nadie le grita a nadie.',
    puntos: ['Mapa que acomodas tú', 'Une mesas arrastrándolas', 'Zonas: salón, terraza, barra'],
  },
  {
    id: 'orden',
    hora: '13:06',
    titulo: 'La orden se toma una vez',
    cuerpo:
      'Platillos con foto, opciones que suman o restan, venta por pieza o por peso y notas para cocina. Lo que se captura en la mesa es lo que se cobra en caja.',
    puntos: ['Opciones con precio', 'Venta por peso o porción', 'Agotados que se apagan solos'],
  },
  {
    id: 'cocina',
    hora: '13:07',
    titulo: 'Cocina la ve al instante',
    cuerpo:
      'La comanda cae en la pantalla de su estación —cocina o bebidas— con su tiempo corriendo. Preparar, listo, entregar: el mesero se entera sin ir a preguntar.',
    puntos: ['Estaciones separadas', 'Pantalla o teléfono de cocina', 'Avisa cuando está listo'],
  },
  {
    id: 'cobro',
    hora: '13:41',
    titulo: 'Se cobra como pague el cliente',
    cuerpo:
      'Efectivo con su cambio, tarjeta, transferencia o todo mezclado. Propina, descuento con autorización y el ticket que sale con tu logo.',
    puntos: ['Pagos mixtos y propina', 'Descuento con PIN', 'Ticket de 58 u 80 mm'],
  },
  {
    id: 'corte',
    hora: '22:15',
    titulo: 'El corte cuadra solo',
    cuerpo:
      'Lo que el sistema espera contra lo que hay en el cajón, separado por forma de pago. Retiros, entradas y quién autorizó cada cosa. Sin calculadora.',
    puntos: ['Arqueo por caja', 'Retiros con autorización', 'Cierre del día en PDF'],
  },
  {
    id: 'tablero',
    hora: '22:20',
    titulo: 'El dueño lo ve desde su teléfono',
    cuerpo:
      'Venta del día, lo más vendido, lo que se está acabando y cuánto dejó. Sin esperar a que alguien te mande una foto del corte.',
    puntos: ['Venta y utilidad', 'Lo más vendido', 'Alertas de inventario'],
  },
];

/* ------------------------------------------------------------
   Giros — un sistema, muchos negocios
   ------------------------------------------------------------
   `arte` es el dibujo ASCII de cada giro. Son cinco renglones del mismo
   ancho (11 caracteres) y solo ASCII puro, para que la monoespaciada los
   alinee igual en cualquier aparato. */

export const POS_GIROS = [
  {
    id: 'restaurante',
    nombre: 'Restaurante',
    lema: 'Mesas, comandas y cocina',
    cuerpo:
      'El más completo. Del mapa de mesas al cierre del día, con el menú que el comensal abre desde su teléfono.',
    modulos: ['Mapa de mesas', 'Comandas a cocina', 'Menú con QR', 'Propinas', 'Recetas e insumos', 'Para llevar'],
    arte: ['   _____   ', '  /     \\  ', ' (  o o  ) ', '  \\_____/  ', ' ====+==== '],
  },
  {
    id: 'cafeteria',
    nombre: 'Cafetería',
    lema: 'Barra rápida y fila de pedidos',
    cuerpo:
      'Cobras primero y preparas después. La fila de la barra se ve en pantalla con el nombre de cada cliente.',
    modulos: ['Fila de barra', 'Opciones por bebida', 'Combos', 'Clientes frecuentes', 'Insumos por receta', 'Corte por turno'],
    arte: ['   ) ) )   ', '  ._____.  ', '  |     |) ', '  |_____|  ', ' ========= '],
  },
  {
    id: 'tienda',
    nombre: 'Tienda',
    lema: 'Código de barras y existencias',
    cuerpo:
      'Escaneas y cobras. El inventario baja solo, el mayoreo se aplica por volumen y el fiado lleva su cuenta.',
    modulos: ['Lector de códigos', 'Venta por peso', 'Mayoreo', 'Fiado por cliente', 'Conteo físico', 'Compras por caja'],
    arte: [' ||| | ||| ', ' ||| | ||| ', ' ||| | ||| ', ' ||| | ||| ', ' 7 50104 3 '],
  },
  {
    id: 'ferreteria',
    nombre: 'Ferretería',
    lema: 'Venta por medida y crédito',
    cuerpo:
      'Cable por metro, lámina por corte, tornillo por kilo. Cotizas, apartas y le llevas la cuenta a cada obra.',
    modulos: ['Corte por medida', 'Cotizaciones', 'Crédito a clientes', 'Cuentas por obra', 'Mínimos de stock', 'Proveedores'],
    arte: ['    ___    ', '   /   \\=  ', '   \\___/   ', '    | |    ', '    |_|    '],
  },
  {
    id: 'estetica',
    nombre: 'Estética',
    lema: 'Agenda, citas y comisiones',
    cuerpo:
      'La agenda por persona y por silla, la cita que se cobra al terminar y la comisión de cada quien al cierre.',
    modulos: ['Agenda por empleado', 'Citas y servicios', 'Comisiones', 'Ficha del cliente', 'Productos en venta', 'Propina al prestador'],
    arte: ['  o     o  ', '   \\   /   ', '    \\ /    ', '    / \\    ', '   8   8   '],
  },
];

/* ------------------------------------------------------------
   Módulos — el control, pieza por pieza
   ------------------------------------------------------------ */

export const POS_MODULOS = [
  {
    id: 'inventario',
    nombre: 'Control de inventario',
    cuerpo: 'Baja solo con cada venta, por pieza o por receta. Te avisa antes de que se acabe.',
  },
  {
    id: 'citas',
    nombre: 'Citas y agenda',
    cuerpo: 'Quién atiende, a qué hora y en dónde. La cita termina en un cobro, no en un cuaderno.',
  },
  {
    id: 'clientes',
    nombre: 'Clientes',
    cuerpo: 'Qué compra cada quien, cuánto debe y cuándo vino. Tus frecuentes dejan de ser anónimos.',
  },
  {
    id: 'portal',
    nombre: 'Portal del cliente',
    cuerpo: 'Tu cliente escanea, pide y sigue su pedido desde el teléfono, sin instalar nada.',
  },
  {
    id: 'usuarios',
    nombre: 'Usuarios y permisos',
    cuerpo: 'Cada persona entra con su PIN y solo ve lo suyo. Lo delicado pide autorización.',
  },
  {
    id: 'compras',
    nombre: 'Compras y proveedores',
    cuerpo: 'Registras la compra, entra al almacén y queda claro a quién se le debe.',
  },
  {
    id: 'reportes',
    nombre: 'Reportes y tablero',
    cuerpo: 'Ventas, utilidad y lo más vendido, por día o por rango. Listos para exportar.',
  },
  {
    id: 'sucursales',
    nombre: 'Varias sucursales',
    cuerpo: 'Cada una con su caja y su inventario, y todas en el mismo tablero.',
  },
];

/* ------------------------------------------------------------
   Conexión con el sitio web
   ------------------------------------------------------------ */

export const POS_CONEXION = {
  eyebrow: 'Conectado a tu sitio web',
  titulo: 'Lo que entra por tu página cae directo en caja.',
  resalte: 'directo en caja',
  entrada:
    'Tu sitio, tu menú con QR y tu portal de clientes no son islas. Un pedido en línea llega al punto de venta como cualquier otro: descuenta inventario, avisa a cocina y aparece en el corte.',
  entradas: [
    { id: 'web', nombre: 'Tu sitio web', nota: 'Pedidos y catálogo' },
    { id: 'qr', nombre: 'Menú con QR', nota: 'Pide desde la mesa' },
    { id: 'portal', nombre: 'Portal de clientes', nota: 'Citas y seguimiento' },
  ],
  salidas: [
    { id: 'caja', nombre: 'Caja', nota: 'Cobra y da el ticket' },
    { id: 'cocina', nombre: 'Cocina', nota: 'Prepara y avisa' },
    { id: 'inventario', nombre: 'Inventario', nota: 'Descuenta solo' },
    { id: 'tablero', nombre: 'Tablero', nota: 'Suma al reporte' },
  ],
  nota: 'La página, el menú y el portal los construimos nosotros mismos, así que hablan el mismo idioma que tu caja desde el primer día.',
};

/* ------------------------------------------------------------
   100 % personalizado
   ------------------------------------------------------------
   Los ocho estilos existen de verdad en el sistema, con estos nombres. */

export const POS_ESTILOS = [
  { id: 'morphiq', nombre: 'Morphiq', radio: 14, fuente: 'cuerpo', superficie: 'solida' },
  { id: 'cristal', nombre: 'Cristal', radio: 22, fuente: 'cuerpo', superficie: 'vidrio' },
  { id: 'relieve', nombre: 'Relieve', radio: 18, fuente: 'cuerpo', superficie: 'relieve' },
  { id: 'taller', nombre: 'Taller', radio: 6, fuente: 'cuerpo', superficie: 'solida' },
  { id: 'bloque', nombre: 'Bloque', radio: 0, fuente: 'display', superficie: 'bloque' },
  { id: 'terminal', nombre: 'Terminal', radio: 2, fuente: 'mono', superficie: 'linea' },
  { id: 'papel', nombre: 'Papel', radio: 10, fuente: 'cuerpo', superficie: 'papel' },
  { id: 'noche', nombre: 'Noche', radio: 16, fuente: 'cuerpo', superficie: 'noche' },
];

export const POS_COLORES = [
  { id: 'azul', nombre: 'Azul', valor: '#0a66ff' },
  { id: 'terracota', nombre: 'Terracota', valor: '#d2552c' },
  { id: 'verde', nombre: 'Verde', valor: '#1f9d63' },
  { id: 'ambar', nombre: 'Ámbar', valor: '#e0a021' },
  { id: 'rosa', nombre: 'Rosa', valor: '#e0457b' },
  { id: 'violeta', nombre: 'Violeta', valor: '#7a5cff' },
];

export const POS_PERSONALIZA = {
  eyebrow: '100 % a tu marca',
  titulo: 'No es una plantilla con tu nombre encima.',
  resalte: 'tu nombre encima',
  entrada:
    'Cámbiale el nombre, el color y el estilo aquí mismo. Eso es lo que se ve; por dentro se arma igual: tus pantallas, tus palabras, tus permisos y tus flujos.',
  capas: [
    { titulo: 'Tu marca', cuerpo: 'Logo, colores, tipografía y el ticket impreso.' },
    { titulo: 'Tus palabras', cuerpo: '«Comanda» o «pedido», «mesa» o «cuenta»: el sistema habla como tu equipo.' },
    { titulo: 'Tus pantallas', cuerpo: 'Cada puesto ve lo que necesita, acomodado como trabaja.' },
    { titulo: 'Tus reglas', cuerpo: 'Qué pide autorización, quién descuenta, cuándo se cierra.' },
  ],
};

/* ------------------------------------------------------------
   Dónde corre
   ------------------------------------------------------------ */

export const POS_APARATOS = {
  eyebrow: 'En lo que ya tienes',
  titulo: 'Caja, tableta y teléfono, al mismo tiempo.',
  resalte: 'al mismo tiempo',
  entrada:
    'La computadora de la caja, la tableta de los meseros, la pantalla de cocina y el teléfono del dueño ven lo mismo, cada quien desde su puesto.',
  lista: [
    { nombre: 'Computadora de caja', nota: 'Aplicación para Windows' },
    { nombre: 'Tableta y teléfono', nota: 'Aplicación para Android' },
    { nombre: 'Pantalla de cocina', nota: 'O un teléfono en la estación' },
    { nombre: 'Navegador', nota: 'Para el dueño, desde donde esté' },
  ],
  hospedaje: [
    { titulo: 'En la nube', cuerpo: 'Nos encargamos de servidores, respaldos y actualizaciones.' },
    { titulo: 'En tu negocio', cuerpo: 'Un servidor propio dentro de tu local, con acceso remoto para ti.' },
  ],
};

/* ------------------------------------------------------------
   Cómo se entrega
   ------------------------------------------------------------ */

export const POS_PROCESO = [
  { titulo: 'Te lo enseñamos', cuerpo: 'Una demostración funcionando, con un negocio parecido al tuyo.' },
  { titulo: 'Tomamos medidas', cuerpo: 'Qué vendes, cómo cobras, quién hace qué. Alcance y precio cerrado por escrito.' },
  { titulo: 'Lo armamos', cuerpo: 'Tu catálogo, tu marca y tus pantallas. Ves avances mientras se construye.' },
  { titulo: 'Arranca contigo', cuerpo: 'Instalación, capacitación a tu equipo y acompañamiento los primeros días.' },
];

/* ------------------------------------------------------------
   Preguntas
   ------------------------------------------------------------ */

export const POS_PREGUNTAS = [
  {
    q: '¿Sirve para mi tipo de negocio?',
    a: 'Hoy opera restaurantes, cafeterías, tiendas, ferreterías y estéticas sobre el mismo núcleo, y el de restaurante es el más completo. Si tu giro no está en la lista, lo más probable es que se arme con piezas que ya existen: caja, inventario, clientes y citas no cambian tanto de un negocio a otro. Te lo decimos con claridad antes de cotizar.',
  },
  {
    q: '¿Qué tan personalizado es?',
    a: 'Todo lo que ve tu equipo: logo, colores, estilo, nombres de las cosas, pantallas por puesto y permisos. Y lo que no se ve: qué pide autorización, cómo se cierra la caja, qué reportes salen. Si necesitas una función que no existe, se desarrolla para ti.',
  },
  {
    q: '¿Se conecta con mi página web?',
    a: 'Sí. Los pedidos de tu sitio, el menú con QR y el portal de clientes pueden caer directo en el punto de venta. Si la página la construimos nosotros, la conexión viene pensada desde el principio; si ya tienes una, revisamos cómo enlazarla.',
  },
  {
    q: '¿En qué aparatos funciona?',
    a: 'En la computadora de la caja, en tabletas y en teléfonos, todos sincronizados. Hay aplicación para Windows y para Android, y el dueño puede entrar desde el navegador. La impresora de tickets, el lector y el cajón se revisan según tu equipo.',
  },
  {
    q: '¿Necesito internet para vender?',
    a: 'Depende de cómo se instale. En la nube necesita conexión; si tu internet falla seguido, se puede instalar en un servidor dentro de tu negocio para que la operación no dependa de la calle. Lo definimos contigo según tu caso, sin prometerte algo que tu instalación no lleve.',
  },
  {
    q: '¿Cuánto cuesta?',
    a: 'El punto de venta parte de $3,000 MXN al mes más la implementación inicial, que depende de cuántos productos, sucursales y usuarios haya que dejar listos. El precio final se cierra por escrito antes de empezar.',
  },
  {
    q: '¿Puedo empezar con poco y crecer después?',
    a: 'Sí. Puedes arrancar con caja e inventario y sumar cocina, citas, portal de clientes o más sucursales cuando lo necesites, sin rehacer lo que ya funciona.',
  },
];

export const POS_CIERRE = {
  lineas: ['Míralo funcionando', 'con tu negocio.'],
  resalte: 'con tu negocio',
  cuerpo:
    'Cuéntanos qué vendes y cómo operas hoy. Un asesor te contacta, te enseña el sistema con un negocio parecido al tuyo y te dice qué necesitas y cuánto costaría.',
};

/* ------------------------------------------------------------
   La sección de la home
   ------------------------------------------------------------ */

export const POS_INICIO = {
  eyebrow: 'Nuestro producto',
  lineas: ['Tu negocio', 'entero en', 'una pantalla.'],
  resalte: 'una pantalla.',
  entrada:
    'MorphiqPOS es nuestro punto de venta: caja, inventario, cocina, citas y clientes en un solo sistema, armado 100 % con tu marca y conectado a tu sitio web.',
  puntos: ['Para cualquier tipo de negocio', 'Control de inventario y caja', '100 % personalizado'],
};

/* ------------------------------------------------------------
   El nombre, en caracteres
   ------------------------------------------------------------
   Generado con figlet (fuente «slant») y guardado como lista de renglones
   para no pelearse con las barras invertidas dentro de una plantilla. Todos
   los renglones miden lo mismo. */

export const POS_ROTULO = [
  "    __  ___                 __    _       ____  ____  _____",
  "   /  |/  /___  _________  / /_  (_)___ _/ __ \\/ __ \\/ ___/",
  "  / /|_/ / __ \\/ ___/ __ \\/ __ \\/ / __ `/ /_/ / / / /\\__ \\ ",
  " / /  / / /_/ / /  / /_/ / / / / / /_/ / ____/ /_/ /___/ / ",
  "/_/  /_/\\____/_/  / .___/_/ /_/_/\\__, /_/    \\____//____/  ",
  "                 /_/               /_/                     "
];
