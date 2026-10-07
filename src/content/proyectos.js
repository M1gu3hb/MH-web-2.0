/**
 * ============================================================
 * PROYECTOS Y CASOS
 * ============================================================
 *
 * Cada proyecto lleva su ficha larga para `/proyectos/[slug]`.
 *
 * REGLA QUE NO SE ROMPE: aquí no hay ni un número que no se pueda demostrar.
 * Nada de «+300% de ventas» ni «reducimos un 40% el tiempo». Los resultados
 * se cuentan en cualitativo, que es lo que de verdad se puede sostener
 * delante de un cliente. Cuando haya cifras medidas y autorizadas por el
 * cliente, se añaden aquí en un campo `metricas` y los componentes ya las
 * pintarán. Hasta entonces, no existen.
 *
 * `imagen` apunta a /casos/*.webp, las maquetas horneadas. Los productos
 * propios no la llevan: no tienen ninguna pantalla que sirva de retrato, así
 * que en su lugar se pinta una portada tipográfica.
 *
 * `tituloSeo` es el título de la pestaña y del resultado de búsqueda.
 * Existe porque «Nombre: tipo | Morphiq» se iba a setenta y cinco caracteres
 * y Google corta alrededor de sesenta: la mitad del título se perdía justo
 * donde estaba lo que distingue un caso de otro.
 *
 * `estado: 'en-desarrollo'` marca lo que todavía se está construyendo. No
 * cambia la tarjeta del índice: la etiqueta aparece solo dentro de su ficha,
 * junto a la industria.
 *
 * `enlaces` va en lugar de `url` cuando un caso reúne varios sitios en vivo:
 * la ficha pinta un botón por cada uno.
 */

import { RUTAS } from '../config/rutas.js';

export const CATEGORIAS = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'web', etiqueta: 'Web' },
  { id: 'sistemas', etiqueta: 'Sistemas' },
  { id: 'software', etiqueta: 'Software' },
];

export const PROYECTOS = [
  {
    slug: 'glyphos',
    tituloSeo: 'GLYPHOS: estudio de arte ASCII en el navegador',
    nombre: 'GLYPHOS',
    industria: 'Producto propio · arte ASCII en tiempo real',
    categorias: ['software', 'web'],
    tipo: 'Estudio de arte ASCII que corre en el navegador',
    resumen:
      'Convierte fotos, video, la cámara o un texto en arte hecho de caracteres, en tiempo real y sin subir nada a ningún servidor. Lo que creas se lleva como imagen, como video, como código para tu web o como animación para la terminal.',
    resultado: 'De una foto a código que funciona, sin salir del navegador',
    etiquetas: ['Arte generativo', 'WebGL 2', 'Exporta a código', 'Sin servidor'],
    acento: '#ff5b1f',
    imagen: '/casos/glyphos.webp',
    url: 'https://glyphos-ascii.vercel.app',
    etiquetaEnlace: 'Abrir GLYPHOS',
    destacado: false,

    contexto:
      'GLYPHOS no es un encargo: es producto propio, con nombre, marca y sitio público. El arte ASCII vive repartido en herramientas sueltas —una convierte una imagen, otra anima un texto, otra genera un fondo— y casi ninguna deja llevarse el resultado a otro lado que no sea una captura de pantalla.',
    problema: [
      'Cada herramienta de ASCII hace una sola cosa y no habla con las demás.',
      'Lo que sale suele ser una captura: no se edita, no se anima y no se puede pegar en una web.',
      'Antes de ver algo bonito hay que mover decenas de ajustes sin saber qué hace cada uno.',
      'Sin una tarjeta gráfica moderna, la mayoría simplemente no dibuja.',
    ],
    objetivo:
      'Un solo estudio donde cualquiera llegue, tire el dado, encuentre algo que le guste y se lo lleve a donde lo necesite: su web, un video o su terminal.',
    solucion: [
      'Un motor WebGL 2 con más de cien patrones —objetos 3D, partículas, campos— que se combinan en capas, y un motor de respaldo que dibuja la misma pieza donde WebGL no está.',
      'Un dado con semillas legibles: la misma semilla da la misma pieza, y el historial guarda los últimos mil resultados en el propio navegador.',
      'Foto, video y cámara convertidos en caracteres en vivo, con transformaciones como semitono, contorno neón o caleidoscopio.',
      'Vistas de destino —fondo web, pantalla de teléfono, historia vertical, README, terminal— que enseñan la pieza a la medida exacta en la que se va a usar.',
      'Exportación a PNG, SVG, MP4, GIF, texto ANSI, scripts de terminal y código para web en HTML, Web Component o React.',
      'Nada se sube: imagen, video, cámara y micrófono se procesan en el equipo de quien lo usa.',
    ],
    construido: [
      'Motor WebGL 2 y motor de respaldo',
      'Laboratorio con dado e historial',
      'Imagen, video y cámara a ASCII',
      'Exportación a imagen, video y código',
      'Biblioteca de componentes para web',
      'Guías públicas para cada uso',
    ],
    tecnologias: ['TypeScript', 'WebGL 2', 'React', 'Vite', 'WebCodecs', 'Playwright'],
  },

  {
    slug: 'pasteleria-confetti',
    tituloSeo: 'Pastelería Confetti: web y punto de venta',
    nombre: 'Pastelería Confetti',
    industria: 'Pastelería · 3 sucursales',
    categorias: ['web', 'sistemas'],
    tipo: 'Web + punto de venta multi-sucursal',
    resumen:
      'Catálogo público, pedidos, caja, abonos, cortes y panel de dueño para coordinar tres sucursales desde una sola vista.',
    resultado: 'Tres sucursales operando sobre el mismo tablero',
    etiquetas: ['Web', 'Punto de venta', 'Panel de dueño', 'Multi-sucursal'],
    acento: '#ff684f',
    imagen: '/casos/confetti.webp',
    url: 'https://www.pasteleria-confetti.com',
    etiquetaEnlace: 'Ver sitio',
    destacado: true,

    contexto:
      'Una pastelería con tres sucursales en la Ciudad de México. Cada punto llevaba su propia cuenta y el dueño solo se enteraba de cómo había ido el día cuando alguien le mandaba la foto del corte.',
    problema: [
      'Los pedidos entraban por WhatsApp y se anotaban en papel.',
      'Cada sucursal cerraba su caja por su cuenta, con su propio criterio.',
      'No había forma de ver las tres sucursales juntas sin sumarlas a mano.',
      'Los abonos de pedidos grandes se llevaban de memoria.',
    ],
    objetivo:
      'Que el dueño pudiera abrir una sola pantalla y ver el negocio completo, y que cada sucursal siguiera trabajando a su ritmo sin capturar nada dos veces.',
    solucion: [
      'Catálogo público donde el cliente ve los productos y hace su pedido.',
      'Punto de venta en cada sucursal, con la misma base de productos.',
      'Registro de abonos para los pedidos que se pagan en partes.',
      'Cortes de caja por sucursal y por turno.',
      'Panel de dueño que junta las tres sucursales en una sola vista.',
    ],
    construido: [
      'Sitio público con catálogo',
      'Punto de venta',
      'Control de pedidos',
      'Abonos y pagos parciales',
      'Cortes de caja',
      'Panel multi-sucursal',
    ],
    tecnologias: ['React', 'Vite', 'Supabase', 'Vercel'],
  },

  /* ------------------------------------------------------------
     EL ECOSISTEMA DEL CLUB HÍPICO — VARIAS PIEZAS, NO UNA
     ------------------------------------------------------------
     Estaba como una sola ficha porque cuando se escribió era una sola cosa:
     un sitio con cotizador. Hoy son aplicaciones distintas, con usuarios
     distintos y problemas distintos: el sitio que ve cualquiera, el panel
     con el que la casa opera, el portal donde el cliente organiza su propio
     evento, el estudio 3D donde se diseña el montaje y el sitio de las clases
     de baile. Meterlas en una ficha se leía como «una web con extras», que es
     justo lo que no son.

     Los dos sistemas internos van SIN ENLACE. No es un olvido: viven detrás
     de un login y manejan datos de clientes reales —nombres, teléfonos,
     pagos, listas de invitados—. Lo que se cuenta es el problema y cómo se
     resolvió, que es la misma regla que ya sigue el portafolio académico.
     ------------------------------------------------------------ */

  {
    slug: 'jardines-club-hipico',
    tituloSeo: 'Jardines Club Hípico: sitio del recinto',
    nombre: 'Jardines Club Hípico',
    industria: 'Recinto de eventos',
    categorias: ['web'],
    tipo: 'Sitio público con solicitudes',
    resumen:
      'El sitio del recinto: los salones, los servicios, la galería y el formulario por el que entra cada solicitud, que cae directo al panel de la casa.',
    resultado: 'Las solicitudes dejan de vivir en el teléfono de alguien',
    etiquetas: ['Web', 'Formulario', 'SEO local', 'Contenido editable'],
    acento: '#ceff3d',
    imagen: '/casos/hipico.webp',
    url: 'https://jardines-club-hipico.vercel.app',
    etiquetaEnlace: 'Ver sitio',
    destacado: true,

    contexto:
      'Un jardín de eventos que recibe solicitudes para bodas, XV años y eventos de empresa. Antes del sitio, cada solicitud llegaba por mensaje o por llamada, y quedaba en el teléfono de quien la había contestado.',
    problema: [
      'Las solicitudes entraban por tres vías distintas y ninguna quedaba registrada.',
      'La información del recinto —salones, servicios, precios— vivía en fotos de WhatsApp.',
      'Cambiar un texto o subir fotos nuevas obligaba a pedírselo a alguien.',
      'Quien buscaba un salón por su zona no encontraba el lugar.',
    ],
    objetivo:
      'Que el recinto se explicara solo, que la solicitud entrara por un formulario y quedara registrada, y que la casa pudiera cambiar el contenido sin llamar a nadie.',
    solucion: [
      'Sitio con los salones, los servicios, las amenidades y la galería.',
      'Una página por tipo de evento, con su propio texto y sus datos para buscadores.',
      'Formulario de solicitud que entra directo al panel de la casa.',
      'Todo el contenido —textos, fotos, anuncios, servicios— editable desde el panel.',
      'Anuncios con fecha de caducidad, para que se apaguen solos.',
    ],
    construido: [
      'Sitio público',
      'Páginas por tipo de evento',
      'Formulario de solicitud',
      'Galería etiquetada',
      'Contenido editable por la casa',
    ],
    tecnologias: ['React', 'Vite', 'Supabase', 'Vercel'],
  },

  {
    slug: 'jch-crm',
    tituloSeo: 'CRM de un salón de eventos: agenda, cobros y puerta',
    nombre: 'CRM del salón de eventos',
    industria: 'Recinto de eventos · sistema interno',
    categorias: ['sistemas', 'software'],
    tipo: 'Panel de operación con cobros y control de acceso',
    resumen:
      'La trastienda del recinto: la agenda de eventos, el estado de cuenta de cada cliente, las solicitudes que entran por la web y el control de puerta el día del evento.',
    resultado: 'El negocio entero se opera desde una sola pantalla',
    etiquetas: ['CRM', 'Cobros', 'QR de acceso', 'Gestor de contenido'],
    acento: '#5b8def',
    imagen: '/casos/jch-crm.webp',
    destacado: true,

    /* Sin `url` a propósito: es un panel interno, detrás de un login, con
       datos de clientes reales. No hay nada que se pueda enseñar sin enseñar
       información de terceros. */
    contexto:
      'El mismo recinto, por dentro. Con el sitio publicado, las solicitudes ya entraban ordenadas, pero lo que pasaba después —convertirlas en evento, cobrar por partes, saber cuánto falta, organizar la puerta el día del evento— seguía repartido entre una libreta, un chat y la memoria de quien llevaba más tiempo.',
    problema: [
      'El estado de cada evento vivía en la cabeza de quien lo había apartado.',
      'Los pagos se anotaban aparte, así que el saldo se calculaba a mano cada vez.',
      'Un cobro mal registrado se borraba, y con él desaparecía el rastro.',
      'El día del evento, el control de entrada era una lista impresa y buena voluntad.',
      'Cambiar un texto del sitio público seguía siendo una petición a otra persona.',
    ],
    objetivo:
      'Que el dueño pudiera abrir una pantalla y ver el negocio: qué hay contratado, qué se ha cobrado, qué falta, qué solicitudes están sin contestar y cómo va la puerta esta noche.',
    solucion: [
      'Agenda de eventos con estatus y ficha por evento, con lo contratado, los documentos y el cronograma.',
      'Libro de pagos donde un cobro no se edita ni se borra: se anula con motivo, y el saldo lo calcula la base.',
      'Bandeja de solicitudes que convierte una petición del sitio en evento con los datos ya puestos.',
      'Control de puerta con códigos QR por invitación y un enlace para el personal, sin cuenta ni panel.',
      'Gestor del contenido del sitio público, con un botón de publicar.',
      'Correo-resumen diario al dueño: solicitudes sin contestar, eventos de la semana y saldos pendientes.',
    ],
    construido: [
      'Agenda y ficha de evento',
      'Libro de pagos y estado de cuenta',
      'Bandeja de solicitudes',
      'Editor de mesas e invitados',
      'Acceso con QR y vista de personal',
      'Gestor del sitio público',
      'Resumen diario automático',
    ],
    tecnologias: ['React', 'Vite', 'Supabase', 'Funciones serverless', 'Vercel'],
  },

  {
    slug: 'jch-portal-cliente',
    tituloSeo: 'Portal del cliente: organiza tu evento desde tu cuenta',
    nombre: 'Portal del cliente',
    industria: 'Recinto de eventos · portal privado',
    categorias: ['web', 'software'],
    tipo: 'Portal privado con invitación digital y confirmaciones',
    resumen:
      'Quien ya apartó su evento entra con su cuenta y lo organiza: cronograma, música, acomodo de mesas, invitación digital y las confirmaciones de sus invitados.',
    resultado: 'El cliente deja de preguntar y empieza a decidir',
    etiquetas: ['Portal privado', 'Invitación digital', 'Mesas', 'Confirmaciones'],
    acento: '#b06cff',
    imagen: '/casos/jch-portal.webp',
    destacado: false,

    /* Sin `url`: cada cuenta es de un cliente y de su evento. */
    contexto:
      'La tercera pieza del mismo ecosistema. Entre que alguien aparta un salón y el día del evento pasan meses de decisiones pequeñas —a qué hora entra el pastel, qué canción no debe sonar, quién se sienta con quién— y todas ellas iban y venían por mensajes.',
    problema: [
      'El cronograma se armaba por chat y nadie tenía la versión buena.',
      'La lista de canciones llegaba en capturas, y la de las prohibidas se olvidaba.',
      'El acomodo de mesas se dibujaba en papel y se rehacía entero por un cambio.',
      'Las confirmaciones de los invitados se contaban a mano, y nunca cuadraban.',
      'El cliente preguntaba cuánto lleva pagado, y alguien tenía que ir a mirarlo.',
    ],
    objetivo:
      'Darle al cliente su propia pantalla, con lo que ya contrató y con todo lo que sí puede decidir, para que las decisiones queden escritas en un solo sitio y la casa las vea al momento.',
    solucion: [
      'Acceso con su cuenta, o de un clic con un enlace de un solo uso que le llega por correo.',
      'Inicio con la cuenta atrás, su salón y cuánto lleva pagado sobre el total.',
      'Cronograma hora por hora, con sugerencias del siguiente momento según el tipo de evento.',
      'Lista de música en dos columnas: lo que sí debe sonar y lo que no debe sonar nunca.',
      'Editor de mesas sobre el plano real del salón, si la casa le dio permiso de tocarlo.',
      'Invitación digital que arma él mismo y reparte por WhatsApp, con enlace revocable.',
      'Tablero de confirmaciones de sus invitados, con aviso —nunca bloqueo— si se pasa de lo contratado.',
    ],
    construido: [
      'Acceso privado con enlace de un solo uso',
      'Cronograma del evento',
      'Lista de música',
      'Editor de mesas',
      'Invitación digital y su página pública',
      'Confirmaciones de invitados',
      'Aplicación instalable en el teléfono',
    ],
    tecnologias: ['React', 'Vite', 'Supabase', 'PWA', 'Vercel'],
  },

  {
    slug: 'jch-3d',
    tituloSeo: 'Estudio 3D para diseñar el montaje de un evento',
    nombre: 'Estudio 3D de eventos',
    industria: 'Recinto de eventos · montaje en 3D',
    categorias: ['software', 'sistemas'],
    tipo: 'Editor 3D de montajes con presentación para el cliente',
    resumen:
      'Los salones del recinto modelados en 3D para acomodar mesas, sillas y pista, organizar invitados y presupuesto, y mandarle al cliente su montaje para que lo recorra desde el teléfono.',
    resultado: 'El cliente ve su evento antes de que exista',
    etiquetas: ['3D', 'Montaje de mesas', 'Visor sin internet', 'Three.js'],
    acento: '#4fbf7a',
    imagen: '/casos/jch-3d.webp',
    url: 'https://jch3d.vercel.app',
    etiquetaEnlace: 'Abrir el estudio',
    destacado: false,

    contexto:
      'La cuarta pieza del ecosistema del recinto. Entre que alguien aparta un salón y el día del evento, la pregunta que más se repite es cómo se va a ver: cuántas mesas caben, dónde queda la pista, quién se sienta junto al escenario. Contestarla con un plano dibujado a mano pedía mucha imaginación de los dos lados.',
    problema: [
      'Un plano en papel no le dice al cliente cómo se va a sentir el salón lleno.',
      'Cada cambio de mesas obligaba a redibujar el acomodo completo.',
      'La lista de invitados y los lugares vivían separados del dibujo del salón.',
      'Mandar una propuesta visual dependía de que el cliente tuviera buena conexión al abrirla.',
    ],
    objetivo:
      'Que la casa diseñe el montaje sobre el salón de verdad y que el cliente lo recorra él mismo, desde su teléfono, antes de cerrar el evento.',
    solucion: [
      'Los dos salones modelados en 3D, cada uno con su montaje, sus invitados, su programa y su presupuesto por separado.',
      'Mesas redondas, rectangulares y cuadradas con sus sillas, editables una por una o todas a la vez, con aviso cuando dos se encuentran.',
      'Vista 3D, planta y recorrido desde la entrada, con deshacer y rehacer.',
      'Invitados por grupo con confirmaciones y asignación de lugares, programa del evento y presupuesto con pagos.',
      'Un enlace que comparte una instantánea del montaje —sin invitados ni presupuesto— y un visor en un solo archivo que se abre sin internet.',
    ],
    construido: [
      'Salones modelados en 3D',
      'Editor de mesas y sillas',
      'Organización de invitados',
      'Programa y presupuesto',
      'Presentación compartible y visor sin internet',
    ],
    tecnologias: ['JavaScript', 'Three.js', 'WebGL', 'Playwright', 'Vercel'],
  },

  {
    slug: 'jch-baile',
    tituloSeo: 'JCH Baile: sitio de clases de baile en Xochimilco',
    nombre: 'JCH Baile',
    industria: 'Clases de baile · Xochimilco',
    categorias: ['web'],
    tipo: 'Sitio multipágina para clases de baile con membresías',
    resumen:
      'El sitio de las clases de baile del recinto en su salón principal: la maestra, los ritmos, las membresías con su precio, el salón y una ruta directa a WhatsApp para apartar lugar.',
    resultado: 'Quien nunca ha bailado entiende cómo empezar',
    etiquetas: ['Web', 'Membresías', 'SEO local', 'WhatsApp'],
    acento: '#d3ff57',
    imagen: '/casos/jch-baile.webp',
    url: 'https://jch-baile-web.vercel.app',
    etiquetaEnlace: 'Ver sitio',
    destacado: false,

    contexto:
      'El mismo recinto, con otra actividad dentro: clases de salsa, bachata, cumbia y ritmos de salón en su salón principal, con una maestra con trayectoria. Antes de la primera clase hacía falta un lugar que explicara qué se enseña, cuánto cuesta y para quién es.',
    problema: [
      'Las dudas de siempre —si hace falta saber bailar, si hay que llevar pareja— tenían que contestarse antes del primer mensaje.',
      'Los planes y sus precios no podían depender de mandar fotos sueltas por chat.',
      'Quien busca clases de baile en la zona tiene que poder encontrarlas.',
    ],
    objetivo:
      'Que alguien que nunca ha bailado entienda en un minuto qué se ofrece, cuánto cuesta y cómo empezar.',
    solucion: [
      'Sitio multipágina: inicio, la maestra, los ritmos, las membresías, el salón, preguntas y contacto.',
      'Membresías por número de clases al mes, más la clase suelta, con su precio publicado.',
      'Página de la maestra con fotos restauradas de su propio archivo y un reel armado con sus videos.',
      'Un ritmo latino generado en el navegador, que solo suena si la persona lo activa.',
      'SEO local con datos estructurados, para aparecer cuando alguien busca clases en Xochimilco.',
    ],
    construido: [
      'Sitio multipágina',
      'Membresías y precios',
      'Perfil de la maestra',
      'Ritmo generado en el navegador',
      'SEO local',
    ],
    tecnologias: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Motion', 'Vercel'],
  },

  {
    slug: 'vero-seguros',
    tituloSeo: 'Vero Seguros: sitio con administrador propio',
    nombre: 'Vero Seguros',
    industria: 'Seguros · agente independiente',
    categorias: ['web', 'sistemas'],
    tipo: 'Sitio de una página con administrador propio',
    resumen:
      'Una agente de seguros que trabaja por su cuenta ya tiene a dónde mandar a quien pide informes, y ella misma cambia los textos, los ramos y las aseguradoras sin tocar código.',
    resultado: 'Actualiza su propio sitio sin pedir ayuda',
    etiquetas: ['Next.js', 'Administrador propio', 'Supabase', 'WhatsApp'],
    acento: '#0a66ff',
    imagen: '/casos/vero.webp',
    url: 'https://veronica-mendez.vercel.app',
    etiquetaEnlace: 'Ver sitio',
    destacado: false,

    contexto:
      'Una agente de seguros independiente que trabaja con diez aseguradoras y ocho ramos: vida, gastos médicos, auto, camión, responsabilidad civil, hogar, gastos funerarios y membresías de salud. Todo su contacto pasa por WhatsApp. Su marca existía en una tarjeta de presentación impresa y en ningún otro lugar.',
    problema: [
      'No había página a la que mandar a quien pedía informes: solo una tarjeta impresa.',
      'Cada cambio —un ramo nuevo, otra aseguradora, otra forma de pago— iba a depender de que alguien abriera el código.',
      'El número de WhatsApp no podía quedar escrito en la página, pero el contacto tenía que salir por ahí.',
      'Un formulario la obligaba a guardar datos personales de gente que solo quiere preguntar.',
    ],
    objetivo:
      'Que ella mantenga su sitio al día por su cuenta, sin escribir una línea de código y sin pedirle nada a nadie.',
    solucion: [
      'Una sola página con navegación por anclas: ramos, forma de trabajar, proceso, aseguradoras, formas de pago y contacto.',
      'Un administrador donde casi todo el texto visible se edita sobre el diseño real: pulsas la frase en la vista previa y escribes encima.',
      'Los ramos y las aseguradoras se crean, se reordenan, se ocultan y se borran desde el panel.',
      'El contacto sale por WhatsApp con el mensaje ya escrito; el número nunca aparece en la página, solo arma el enlace.',
      'Cuatro cerraduras sobre cada escritura y una bitácora que anota quién cambió qué y cuándo.',
    ],
    construido: [
      'Página pública',
      'Administrador con vista previa editable',
      'Ramos y aseguradoras gestionables',
      'Contacto por WhatsApp sin exponer el número',
      'Bitácora de cambios',
    ],
    tecnologias: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Vercel'],
  },

  {
    slug: 'the-best-moment',
    tituloSeo: 'The Best Moment: sitio de un fotógrafo de bodas',
    nombre: 'The Best Moment',
    industria: 'Fotografía · bodas y XV años',
    categorias: ['web'],
    tipo: 'Sitio editorial con portafolio, paquetes e identidad',
    resumen:
      'El sitio de un fotógrafo de bodas, XV años y retratos: un portafolio de más de ochocientas fotos que se recorre sin trabarse, sus seis paquetes lado a lado y la consulta de fecha directo a WhatsApp.',
    resultado: 'Las fotos hablan primero; la fecha se consulta en un toque',
    etiquetas: ['Web', 'Portafolio', 'Paquetes', 'Identidad'],
    acento: '#c9a46b',
    imagen: '/casos/the-best-moment.webp',
    url: 'https://the-best-moment.vercel.app',
    etiquetaEnlace: 'Ver sitio',
    destacado: false,

    contexto:
      'Un fotógrafo de bodas, XV años y retratos. Su trabajo y sus paquetes vivían en un catálogo en PDF: no se puede buscar, no se actualiza solo y en un teléfono se lee a pellizcos.',
    problema: [
      'Un PDF con cientos de fotos se traba en el teléfono justo cuando alguien lo está viendo.',
      'Los paquetes había que compararlos de memoria, página por página.',
      'Las fotos originales no estaban hechas para la web: pesadas y con los datos de la cámara dentro.',
      'Hacía falta una identidad propia que se reconociera igual en una tarjeta que en una galería.',
    ],
    objetivo:
      'Que el portafolio se recorra como un libro, que cada paquete se entienda solo y que pedir una fecha sea mandar un mensaje que ya viene escrito.',
    solucion: [
      'Identidad de marca: el logo y su aplicación en todo el sitio.',
      'Portada editorial y portafolio por colección —bodas, XV años y retratos— con carga progresiva y visor accesible.',
      'Cada foto preparada en varios tamaños, sin los datos de la cámara y sin ampliarla nunca por encima de su original.',
      'Los seis paquetes con su propia página y una comparación lado a lado.',
      'Páginas para la experiencia y los fotolibros, lo que no cabe en una lista de precios.',
      'Un formulario que prepara la consulta y la abre en WhatsApp con los datos ya escritos.',
    ],
    construido: [
      'Identidad de marca',
      'Sitio editorial multipágina',
      'Portafolio por colecciones',
      'Comparador de paquetes',
      'Consulta de fecha por WhatsApp',
    ],
    tecnologias: ['React', 'TypeScript', 'Vite', 'Supabase', 'Vercel'],
  },

  {
    slug: 'fiesta-total-dj',
    tituloSeo: 'Fiesta Total DJ\'s: sitio de conversión',
    nombre: "Fiesta Total DJ's",
    industria: 'Servicios para eventos',
    categorias: ['web'],
    tipo: 'Sitio de conversión con selector de paquetes',
    resumen:
      'Una página inmersiva, selector de paquetes y una ruta clara hacia WhatsApp para convertir interés en eventos contratados.',
    resultado: 'Del scroll al WhatsApp en un solo movimiento',
    etiquetas: ['Web', 'Paquetes', 'Conversión'],
    acento: '#5e63ff',
    imagen: '/casos/fiesta.webp',
    url: 'https://fiesta-total-dj.vercel.app',
    etiquetaEnlace: 'Ver sitio',
    destacado: true,

    contexto:
      'Un servicio de DJ y audio para fiestas. Toda la contratación pasaba por WhatsApp, pero antes había que explicar por mensaje qué incluía cada paquete.',
    problema: [
      'La misma conversación se repetía con cada persona que preguntaba.',
      'No había dónde mandar a alguien para que viera los paquetes.',
      'El interés se enfriaba entre la pregunta y la respuesta.',
    ],
    objetivo:
      'Que el cliente entendiera los paquetes solo y llegara a WhatsApp sabiendo ya cuál quiere.',
    solucion: [
      'Página con la energía del servicio, no un folleto plano.',
      'Selector de paquetes con lo que incluye cada uno.',
      'Botón a WhatsApp que llega con el paquete ya mencionado en el mensaje.',
    ],
    construido: ['Sitio de una vista', 'Selector de paquetes', 'Ruta directa a WhatsApp'],
    tecnologias: ['React', 'Vite', 'Vercel'],
  },

  {
    slug: 'paginas-de-enlaces',
    tituloSeo: 'Páginas de enlaces para QR, NFC y redes sociales',
    nombre: 'Páginas de enlaces',
    industria: 'Tres negocios · QR, NFC y redes',
    categorias: ['web'],
    tipo: 'Páginas de enlaces con la marca de cada negocio',
    resumen:
      "Una sola dirección para el QR de la tarjeta, la etiqueta NFC y la biografía de redes: WhatsApp primero y todo lo demás a un toque. Tres hechas a la medida, para Morphiq, Jardín La Palapa y Fiesta Total DJ's.",
    resultado: 'Un QR que lleva directo a la conversación',
    etiquetas: ['QR y NFC', 'WhatsApp', 'Animación', 'Marca propia'],
    acento: '#2f7bff',
    imagen: '/casos/enlaces.webp',
    /* Un caso con tres sitios en vivo: la ficha pinta un botón por cada uno. */
    enlaces: [
      { etiqueta: 'Morphiq', url: 'https://morphiq-links.vercel.app' },
      { etiqueta: 'Jardín La Palapa', url: 'https://la-palapa-links.vercel.app' },
      { etiqueta: "Fiesta Total DJ's", url: 'https://fiesta-total-links.vercel.app' },
    ],
    destacado: false,

    contexto:
      'La tarjeta de presentación lleva un QR, el mostrador una etiqueta NFC y el perfil de Instagram un solo enlace. Los tres apuntan al mismo lugar, y ese lugar suele ser una página genérica de otra plataforma, con su logo, su tipografía y sus límites.',
    problema: [
      'Las plataformas de enlaces se ven iguales para todos: la marca del negocio queda en segundo plano.',
      'Lo que más importa —escribir por WhatsApp— queda al mismo nivel que todo lo demás.',
      'Cuántas personas abren cada enlace lo sabe la plataforma, no el negocio.',
      'Un QR impreso no se puede cambiar: si la dirección se cae, la tarjeta se va a la basura.',
    ],
    objetivo:
      'Que cada negocio tenga su propia página de enlaces, con su identidad, sus prioridades en orden y una dirección estable para imprimir.',
    solucion: [
      'WhatsApp primero, y después llamada, ubicación, redes y sitio web, en el orden que le importa a cada negocio.',
      'Morphiq: fondo ASCII animado y un panel privado que cuenta las aperturas de cada enlace por día, sin guardar la IP de nadie.',
      'Jardín La Palapa: el logo se escribe solo con una pluma de oro, las fotos del jardín se funden de fondo, cada botón se forma primero con caracteres y uno de ellos comparte la página con el menú del propio teléfono.',
      "Fiesta Total DJ's: el neón de la marca, WhatsApp al frente y su sitio y sus redes a un toque.",
      'Direcciones estables, pensadas para imprimirse en una tarjeta o grabarse en una etiqueta y no cambiar nunca.',
    ],
    construido: [
      'Tres páginas con la marca de cada negocio',
      'Panel privado de clics',
      'Animaciones de logo y botones',
      'Direcciones estables para QR y NFC',
    ],
    tecnologias: ['JavaScript', 'HTML', 'CSS', 'Funciones serverless', 'Redis', 'Vercel'],
  },

  {
    slug: 'thexavimtz',
    tituloSeo: 'TheXaviMTZ: sitio oficial de un DJ y productor',
    nombre: 'TheXaviMTZ',
    industria: 'Música · DJ y productor',
    categorias: ['web'],
    tipo: 'Sitio oficial de artista con sus lanzamientos',
    resumen:
      'El sitio oficial de un DJ y productor de house de la Ciudad de México: su lanzamiento más reciente al frente, el catálogo completo y todas sus plataformas a un clic.',
    resultado: 'Del enlace de la biografía a escucharlo en Spotify',
    etiquetas: ['Web', 'Música', 'Lanzamientos', 'Next.js'],
    acento: '#7b5cff',
    imagen: '/casos/thexavimtz.webp',
    url: 'https://thexavimtz.vercel.app',
    etiquetaEnlace: 'Ver sitio',
    destacado: false,

    contexto:
      'Un DJ y productor independiente que construye un catálogo entre house, dance y electrónica. Su música vive en Spotify, Apple Music, SoundCloud, Instagram y TikTok, y cada plataforma la presenta con su diseño, no con el suyo.',
    problema: [
      'Sin un sitio propio, cada lanzamiento dependía del formato de otra plataforma.',
      'No había un solo lugar al que mandar a un promotor o a quien quisiera contratarlo.',
      'Los lanzamientos anteriores se perdían en cuanto salía el siguiente.',
    ],
    objetivo:
      'Un sitio con la estética del artista, donde el último lanzamiento mande y el resto del catálogo siga a la mano.',
    solucion: [
      'Portada con el lanzamiento más reciente al frente y salida directa a Spotify.',
      'Catálogo de lanzamientos, cada uno con su portada y sus enlaces.',
      'Reproductor de Spotify dentro de la página.',
      'Sus redes y plataformas a un clic: Instagram, TikTok, SoundCloud y Apple Music.',
      'Tipografía enorme y movimiento con la energía de una cabina, no de un folleto.',
    ],
    construido: [
      'Sitio oficial',
      'Lanzamiento destacado',
      'Catálogo de lanzamientos',
      'Reproductor integrado',
    ],
    tecnologias: ['Next.js', 'React', 'Vercel'],
  },

  {
    slug: 'electrotecnica-berlin',
    tituloSeo: 'Electrotécnica Berlín: punto de venta y web',
    nombre: 'Electrotécnica Berlín',
    industria: 'Electrónica · tienda y taller',
    categorias: ['web', 'sistemas'],
    tipo: 'Punto de venta + presencia web e identidad',
    resumen:
      'Sistema de cobro y presencia digital para una tienda de electrónica, unidos por una identidad visual propia.',
    resultado: 'Un taller de toda la vida con identidad propia y caja digital',
    etiquetas: ['Punto de venta', 'Web', 'Identidad'],
    acento: '#36d7d1',
    imagen: '/casos/berlin.webp',
    url: 'https://electrotecnica-berlin-web.vercel.app',
    etiquetaEnlace: 'Ver sitio',
    destacado: true,

    contexto:
      'Un taller y tienda de electrónica de toda la vida. Tenía clientela y oficio, pero ninguna presencia digital y la venta se anotaba en libreta.',
    problema: [
      'Nadie encontraba el negocio en internet.',
      'No existía una identidad visual: cada letrero decía algo distinto.',
      'Las ventas se registraban a mano, sin control de existencias.',
    ],
    objetivo:
      'Darle al negocio una cara digital que se pareciera a él y, de paso, ordenar la caja.',
    solucion: [
      'Identidad visual propia, aplicada al sitio y al sistema.',
      'Sitio con los servicios del taller y los datos de contacto.',
      'Punto de venta para registrar ventas y llevar existencias.',
    ],
    construido: ['Identidad visual', 'Sitio público', 'Punto de venta', 'Control de inventario'],
    tecnologias: ['React', 'Vite', 'Vercel'],
  },

  {
    slug: 'portafolio-academico',
    tituloSeo: 'Portafolio académico con blog editable',
    nombre: 'Portafolio académico',
    industria: 'Investigación · perfil de estudiante',
    categorias: ['web', 'software'],
    tipo: 'Sitio de perfil con blog editable',
    resumen:
      'Un sitio para un estudiante que hace investigación: el perfil, la línea de trabajo y los artículos se editan en dos archivos y se publican al guardar.',
    resultado: 'Publica sin abrir un componente',
    etiquetas: ['React', 'TypeScript', 'Blog por datos', 'Vercel'],
    acento: '#7ee0a1',
    imagen: '/casos/academico.webp',
    destacado: false,

    /* El cliente no se nombra ni se enlaza a propósito: es un perfil personal
       con foto, universidad y laboratorios, y eso no se publica en el
       portafolio de otro. Lo que se cuenta es el problema y cómo se resolvió. */
    contexto:
      'Un estudiante de ciencias que trabaja en laboratorios de investigación necesitaba un sitio propio: en qué anda, con qué herramientas trabaja, dónde estudió y qué escribe. Escribe código todos los días, pero no hace webs, y el sitio tenía que poder cambiar cada mes sin pedirle ayuda a nadie.',
    problema: [
      'Un perfil académico se mueve seguido: proyectos nuevos, fechas, herramientas, textos.',
      'Si el texto vive dentro de los componentes, cada cambio pequeño obliga a abrir código.',
      'Publicar un artículo suele pedir crear un archivo y una ruta nueva por cada texto.',
      'Un error de sintaxis al editar puede tumbar el sitio publicado.',
    ],
    objetivo:
      'Que el dueño actualice su perfil y publique artículos desde la web de GitHub, sin abrir un solo componente.',
    solucion: [
      'Todo el contenido editorial vive en dos archivos: uno para el perfil y otro para los artículos.',
      'Los tipos cachan el error antes de publicar: una categoría inválida o una propiedad mal escrita no compila.',
      'Cada artículo se escribe como un dato y el sitio arma solo la tarjeta y su página; los borradores se quedan fuera.',
      'Si la validación falla, la versión anterior sigue en línea: no se publica nada roto.',
    ],
    construido: [
      'Archivo único de contenido con tipos',
      'Blog por datos con borradores',
      'Tema claro y oscuro',
      'Validación automática antes de publicar',
    ],
    tecnologias: ['React', 'TypeScript', 'Vite', 'Vercel'],
  },

  {
    slug: 'gestech',
    tituloSeo: 'GESTECH: control por gestos en Windows',
    nombre: 'GESTECH',
    industria: 'Software · accesibilidad',
    categorias: ['software'],
    tipo: 'Software de escritorio con visión por computadora',
    resumen:
      'Controla el cursor, los clics, el scroll y las ventanas de Windows con pura cámara web.',
    resultado: 'Manejar la computadora sin tocarla',
    etiquetas: ['Python', 'OpenCV', 'MediaPipe', 'Windows'],
    acento: '#f5a524',
    imagen: '/casos/gestech.webp',
    destacado: false,

    contexto:
      'Un proyecto propio para resolver un problema concreto: manejar una computadora sin poder usar el ratón.',
    problema: [
      'Los controles por gestos existentes reaccionan a cualquier movimiento.',
      'Gesticular mientras hablas convertía el control en un estorbo.',
    ],
    objetivo:
      'Que el control por gestos solo obedeciera cuando la persona lo pide, y que se sintiera preciso.',
    solucion: [
      'Reconocimiento de mano en tiempo real con la cámara web.',
      'Activación deliberada: palma abierta un segundo para entrar.',
      'Salida igual de explícita: puño cerrado dos segundos.',
      'Control de cursor, clic, scroll y ventanas.',
    ],
    construido: ['Reconocimiento de gestos', 'Control de cursor y clics', 'Scroll y ventanas', 'Modo de activación explícita'],
    tecnologias: ['Python', 'OpenCV', 'MediaPipe', 'Windows'],
  },

  {
    slug: 'mh-photo-booth',
    tituloSeo: 'MH Photo Booth: cabina de fotos sin internet',
    nombre: 'MH Photo Booth',
    industria: 'Eventos · producto propio',
    categorias: ['software', 'web'],
    tipo: 'Aplicación de escritorio + portal de descargas',
    resumen:
      'Cabina fotográfica que funciona sin internet en el salón y sube todo cuando vuelve la señal, más un portal donde el invitado descarga sus fotos con un folio.',
    resultado: 'Dos aplicaciones, un solo producto',
    etiquetas: ['Electron', 'Offline-first', 'Next.js', 'SQLite'],
    acento: '#5e63ff',
    imagen: '/casos/photobooth.webp',
    destacado: false,

    contexto:
      'Las cabinas fotográficas de eventos trabajan en salones donde el internet es malo o directamente no hay. Y el invitado quiere su foto ya.',
    problema: [
      'Depender de internet en el salón significaba perder fotos.',
      'Entregar las fotos por USB o por correo al día siguiente mataba el momento.',
    ],
    objetivo:
      'Que la cabina funcione siempre, haya red o no, y que el invitado se lleve su foto sin esperar.',
    solucion: [
      'Aplicación de escritorio que guarda todo en local y no necesita red.',
      'Sincronización automática cuando vuelve la señal.',
      'Portal web donde el invitado descarga sus fotos con un folio.',
    ],
    construido: ['App de escritorio', 'Base de datos local', 'Sincronización diferida', 'Portal de descargas'],
    tecnologias: ['Electron', 'Next.js', 'SQLite'],
  },

  {
    slug: 'nfc-manager',
    tituloSeo: 'NFC Manager: automatización de escritorio',
    nombre: 'NFC Manager',
    industria: 'Producto propio · automatización de escritorio',
    categorias: ['software', 'sistemas'],
    tipo: 'App de escritorio para Windows con app Android',
    resumen:
      'Tocas una etiqueta NFC con el teléfono y la computadora cambia de modo: abre lo que ese modo necesita y, al salir, cierra solo lo que ese modo abrió.',
    resultado: 'Cambiar de modo en un toque',
    etiquetas: ['NFC', 'Electron', 'Android', 'Automatización'],
    acento: '#b06cff',
    imagen: '/casos/nfc.webp',
    destacado: false,

    contexto:
      'Trabajar, descansar, jugar. Cada cambio en la misma computadora era el mismo ritual a mano: el editor, las pestañas de siempre, la carpeta del proyecto, la música, el volumen. Y al terminar, cerrar todo uno por uno con cuidado de no llevarse lo que ya estaba abierto desde antes.',
    problema: [
      'Entrar en un modo era abrir apps, webs, carpetas y música una por una, siempre en el mismo orden.',
      'Al salir había que cerrar todo a mano, y era fácil cerrar algo que ya tenías abierto de antes.',
      'Las automatizaciones de escritorio piden rutas de archivos y nombres de ejecutables: solo las configura quien programa.',
      'Si el comando va escrito dentro de la etiqueta, cada vez que cambias de opinión hay que reescribirla.',
    ],
    objetivo:
      'Que cambiar de modo sea tocar una etiqueta, sin perder nada de lo que ya tenías abierto.',
    solucion: [
      'Un motor que registra qué abrió cada modo y al desactivarlo cierra solo eso; si una app tiene trabajo sin guardar no la mata, la marca.',
      'Un selector visual que detecta lo que hay instalado en la PC, con sus iconos reales. Nunca escribes una ruta.',
      'La etiqueta solo lleva un identificador: para cambiar lo que hace la re-vinculas desde la app y la etiqueta física no se reescribe nunca.',
      'Un servidor local con emparejamiento por QR y confirmación en la propia PC; las peticiones llevan identificadores, nunca comandos.',
      'App Android nativa que activa el modo al instante, más widget y mosaico de ajustes rápidos para hacerlo sin NFC.',
    ],
    construido: [
      'App de escritorio en Electron',
      'Agente local con historial de ejecuciones',
      'App Android que lee y escribe etiquetas',
      'Emparejamiento por QR',
      'Página móvil servida por la propia PC',
    ],
    tecnologias: ['TypeScript', 'Electron', 'React', 'Fastify', 'SQLite', 'Kotlin', 'Jetpack Compose'],
  },

  {
    slug: 'morphiqpos',
    tituloSeo: 'MorphiqPOS: un punto de venta para cinco negocios',
    nombre: 'MorphiqPOS',
    industria: 'Producto propio · punto de venta',
    categorias: ['sistemas', 'software'],
    tipo: 'Punto de venta para varios modelos de negocio',
    resumen:
      'Un solo sistema que opera una tiendita, una cafetería, un restaurante con mesas, una ferretería que corta por medida y una estética con agenda, cada uno con su vocabulario, sus pantallas y su tablero.',
    resultado: 'Un punto de venta que se adapta al negocio, no al revés',
    etiquetas: ['Punto de venta', 'Multi-negocio', 'Corre en local', 'Next.js'],
    acento: '#3ddc97',
    imagen: '/casos/morphiqpos.webp',
    estado: 'en-desarrollo',
    destacado: false,

    /* Sin enlace: está en desarrollo y sus demostraciones corren en local. */
    contexto:
      'Cada negocio que pide un punto de venta cree que el suyo es distinto, y tiene razón: una tiendita cobra por pieza, un restaurante por mesa, una ferretería por medida y una estética por cita. Hacer un sistema nuevo para cada uno es lento; meterlos a todos en el mismo molde, inservible.',
    problema: [
      'Un punto de venta genérico obliga al negocio a trabajar como el sistema, no al revés.',
      'Construir uno a la medida para cada cliente es repetir el mismo trabajo una y otra vez.',
      'Muchos negocios no quieren depender de internet ni de servicios ajenos para poder cobrar.',
      'En una caja no se perdona un centavo de redondeo.',
    ],
    objetivo:
      'Una sola base que cada negocio active a su medida: las funciones que necesita, con sus palabras y sus pantallas, sin reconstruir el sistema cada vez.',
    solucion: [
      'Cinco modelos de negocio sobre el mismo núcleo —tiendita, cafetería, restaurante, ferretería y estética—, cada uno con su menú, sus pantallas y su tablero.',
      'Capacidades que se activan por negocio, en lugar de una aplicación distinta para cada cliente.',
      'Pensado para correr completo en la computadora del negocio, sin depender de internet ni de cuentas de terceros.',
      'El dinero nunca pasa por decimales sueltos: una suma escrita fuera de su módulo ni siquiera compila.',
      'PIN por empleado y un sistema de diseño propio con estilo, modo y densidad ajustables.',
    ],
    construido: [
      'Núcleo de punto de venta',
      'Cinco modelos de negocio',
      'Motor de capacidades',
      'Sistema de diseño con estilos',
      'Puerta de calidad automática',
    ],
    tecnologias: ['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'Docker', 'Playwright'],
  },

  {
    slug: 'morphiq-ui',
    tituloSeo: 'Morphiq UI: componentes React y editor visual',
    nombre: 'Morphiq UI',
    industria: 'Producto propio · sistema de interfaz',
    categorias: ['software', 'web'],
    tipo: 'Librería de componentes React y editor visual',
    resumen:
      'Más de doscientos componentes React con cuatro acabados de material, y un editor visual encima que exporta exactamente el mismo código que ves.',
    resultado: 'La base de interfaz de la casa',
    etiquetas: ['Sistema de diseño', 'React', 'Editor visual', 'Código exportable'],
    acento: '#ff3d81',
    imagen: '/casos/morphiq-ui.webp',
    url: 'https://morphiq-ui.vercel.app',
    etiquetaEnlace: 'Ver sitio',
    estado: 'en-desarrollo',
    destacado: false,

    contexto:
      'Morphiq UI no es un encargo: es producto propio. La mayoría de las librerías de interfaz dan estructura y nada más. Aquí cada componente llega con material, peso y punto de vista, y el mismo botón se ve en cuatro acabados sin cambiar cómo se comporta.',
    problema: [
      'Cambiar el acabado de un componente obligaba a reconstruirlo: el comportamiento era el mismo, pero el código había que escribirlo otra vez.',
      'Agregar un componente al catálogo significaba editar el mismo archivo compartido, así que dos frentes de trabajo chocaban siempre ahí.',
      'Los editores visuales suelen sacar un formato propio que después nadie puede llevar a producción.',
      'Una captura no dice qué pasa al hacer foco, en estado de carga, ni con el movimiento reducido activado.',
    ],
    objetivo:
      'Tener una base de interfaz propia: componentes que se copian y se usan hoy, y un editor que produce ese mismo código.',
    solucion: [
      'Un registro de componentes repartidos por categorías, cada uno con su código, su vista previa funcional y su ficha.',
      'Cuatro recetas de material que se cambian sin tocar el comportamiento del componente.',
      'Un editor visual con capas, vectores, máscaras, auto layout, variantes, interacciones y línea de tiempo.',
      'Exportadores que sacan componente interactivo, CSS, HTML autónomo, SVG y el proyecto completo sin pérdida.',
      'Cada componente documentado en accesibilidad y dependencias, en español y en inglés.',
    ],
    construido: [
      'Registro de componentes generado',
      'Cuatro acabados de material',
      'Editor visual con historial',
      'Motor de exportación verificado',
      'Puerta de calidad en un solo comando',
    ],
    tecnologias: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Playwright'],
  },

];

/** Los que se pintan en la home. */
export const PROYECTOS_DESTACADOS = PROYECTOS.filter((p) => p.destacado).slice(0, 4);

export function proyectoPorSlug(slug) {
  return PROYECTOS.find((p) => p.slug === slug);
}

export function rutaProyecto(slug) {
  return `${RUTAS.proyectos}/${slug}`;
}

/**
 * La tarjeta de invitación que cierra el portfolio. No es un proyecto:
 * es el CTA con la forma de los demás, para que la retícula no se corte en seco.
 */
/* La tarjeta de invitación —«Lo que traes en la cabeza»— se retira. Tenía
   sentido en el diseño anterior, donde el recorrido de proyectos era una
   animación de scroll y esa pieza servía de continuación. En un índice de
   once proyectos, una tarjeta que no es un proyecto pero tiene forma de
   proyecto solo confunde: parece un caso más y no lo es. Lo que decía ahora
   lo dice el cierre del índice, en texto y sin disfraz. */

