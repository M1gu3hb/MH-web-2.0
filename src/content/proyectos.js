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
    url: 'https://pasteleria-confetti.vercel.app',
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

  {
    slug: 'jardines-club-hipico',
    tituloSeo: 'Jardines Club Hípico: sitio y CRM con cotizador',
    nombre: 'Jardines Club Hípico',
    industria: 'Recinto de eventos',
    categorias: ['web', 'sistemas'],
    tipo: 'Sitio + CRM con cotizador y contratos',
    resumen:
      'Sitio, cotizador automatizado, seguimiento de prospectos y generación de contratos para un recinto de eventos.',
    resultado: 'Cotización y contrato generados en minutos, no en días',
    etiquetas: ['CRM', 'Cotizador', 'Contratos', 'Web'],
    acento: '#ceff3d',
    imagen: '/casos/hipico.webp',
    url: 'https://jardines-club-hipico.vercel.app',
    etiquetaEnlace: 'Ver sitio',
    destacado: true,

    contexto:
      'Un jardín de eventos que recibe solicitudes para bodas, XV años y eventos de empresa. Cada solicitud pedía una cotización distinta según fecha, número de personas y servicios.',
    problema: [
      'Cada cotización se armaba a mano en un documento, desde cero.',
      'Los prospectos se perdían entre llamadas, mensajes y correos.',
      'El contrato se redactaba otra vez, copiando datos de la cotización.',
      'Nadie sabía cuántas solicitudes había abiertas ni en qué iba cada una.',
    ],
    objetivo:
      'Convertir una solicitud en una cotización y en un contrato sin volver a escribir los mismos datos tres veces, y no perder de vista ningún prospecto.',
    solucion: [
      'Sitio con la información del recinto y formulario de solicitud.',
      'Cotizador que arma el presupuesto a partir de fecha, personas y servicios.',
      'Tablero de prospectos por etapa, para ver en qué va cada evento.',
      'Generación del contrato con los datos que ya están en la cotización.',
    ],
    construido: [
      'Sitio público',
      'Cotizador automatizado',
      'Seguimiento de prospectos',
      'Generación de contratos',
      'Historial por cliente',
    ],
    tecnologias: ['React', 'Vite', 'Supabase', 'Vercel'],
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
    url: 'https://github.com/M1gu3hb/Vero-seguros-',
    etiquetaEnlace: 'Ver repositorio',
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
    slug: 'electrotecnica-berlin',
    tituloSeo: 'Electrotécnica Berlín: punto de venta y web',
    nombre: 'Electrotécnica Berlín',
    industria: 'Electrónica · negocio familiar',
    categorias: ['web', 'sistemas'],
    tipo: 'Punto de venta + presencia web e identidad',
    resumen:
      'Sistema de cobro y presencia digital para un negocio familiar de electrónica, unidos por una identidad visual propia.',
    resultado: 'Un negocio familiar con identidad propia y caja digital',
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
    url: 'https://github.com/M1gu3hb/nfc-manager',
    etiquetaEnlace: 'Ver repositorio',
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
    url: 'https://github.com/M1gu3hb/GESTCH',
    etiquetaEnlace: 'Ver repositorio',
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

  {
    slug: 'qyro',
    tituloSeo: 'Qyro: envío de archivos por red local',
    nombre: 'Qyro',
    industria: 'Producto propio · transferencia de archivos',
    categorias: ['software', 'sistemas'],
    tipo: 'App de envío de archivos sin internet',
    resumen:
      'Mandar un archivo de un aparato a otro por la red local, sin nube, sin cuentas y sin servidor de por medio. Motor en Rust, interfaz en Flutter, cifrado de extremo a extremo.',
    resultado: 'Archivos que no pasan por nadie',
    etiquetas: ['Rust', 'Flutter', 'Criptografía', 'Sin nube'],
    acento: '#51c8ff',
    imagen: '/casos/qyro.webp',
    url: 'https://github.com/M1gu3hb/-Qyro',
    etiquetaEnlace: 'Ver repositorio',
    destacado: false,

    contexto:
      'Pasar un archivo de una computadora a un teléfono que están en el mismo cuarto casi siempre termina igual: lo subes a un Drive o te lo mandas por WhatsApp. El archivo sale de tu red, se sienta en el servidor de alguien más y regresa comprimido. Qyro nace de esa molestia.',
    problema: [
      'Mandar un archivo a un aparato que está a dos metros obliga a que salga de tu red y pase por un tercero.',
      'En una red pública con aislamiento de cliente los aparatos no se ven, así que el descubrimiento automático no sirve.',
      'Las apps que sí transfieren en local piden permisos de almacenamiento completos y copian el archivo antes de leerlo.',
      'Si el aparato del otro lado cambia de llave, casi ningún sistema avisa: te deja seguir igual.',
    ],
    objetivo:
      'Que dos aparatos en la misma red se manden un archivo cifrado y verificado sin depender de internet, de una cuenta ni de un servidor.',
    solucion: [
      'El emparejamiento se hace tecleando un código, así funciona hasta en redes donde los aparatos no se ven entre sí.',
      'El núcleo en Rust hace el saludo autenticado, cifra cada bloque y verifica cada archivo; el que no verifica no se entrega.',
      'Cada aparato tiene una identidad que sobrevive a cerrar la app y enseña una huella corta para comparar en voz alta.',
      'El receptor siempre decide: ve cuántos archivos son, cómo se llaman y cuánto pesan antes de aceptar.',
      'En Android los archivos se eligen con el selector del sistema, sin pedir un solo permiso de almacenamiento.',
    ],
    /* Honestidad antes que escaparate: el código está completo y probado en
       integración continua, pero la prueba en teléfono físico sigue pendiente.
       Aquí se cuenta como lo que es, un proyecto de ingeniería, no como un
       producto en uso. */
    construido: [
      'Núcleo de protocolo y criptografía en Rust',
      'App para Android y Windows',
      'Binario de terminal',
      'Integración continua por plataforma',
      'Prueba en hardware pendiente',
    ],
    tecnologias: ['Rust', 'Flutter', 'Dart', 'Kotlin', 'Ed25519', 'ChaCha20-Poly1305'],
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
    url: 'https://github.com/M1gu3hb/mh-photo-booth-studio',
    etiquetaEnlace: 'Ver repositorio',
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

