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
 * `imagen` apunta a /casos/*.webp, las maquetas horneadas.
 */

import { RUTAS } from '../config/rutas';

export const CATEGORIAS = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'web', etiqueta: 'Web' },
  { id: 'sistemas', etiqueta: 'Sistemas' },
  { id: 'software', etiqueta: 'Software' },
];

export const PROYECTOS = [
  {
    slug: 'pasteleria-confetti',
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
    slug: 'fiesta-total-dj',
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
    slug: 'gestech',
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
    slug: 'mh-photo-booth',
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
export const INVITACION = {
  nombre: 'Lo que traes en la cabeza',
  tipo: 'Tu próxima herramienta',
  resumen:
    'Punto de venta, CRM, una app para tu equipo, un portal para tus clientes, una herramienta que solo existe en tu cabeza. Si lo puedes explicar, lo puedo construir.',
  etiquetas: ['Web', 'Escritorio', 'Móvil', 'Automatización'],
  acento: '#ceff3d',
  imagen: '/casos/imagination.webp',
};
