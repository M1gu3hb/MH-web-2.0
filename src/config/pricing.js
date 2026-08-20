/**
 * ============================================================
 * FUENTE ÚNICA DE TODOS LOS DATOS COMERCIALES
 * ============================================================
 *
 * Si vas a cambiar un precio, un nombre de plan o el texto de un botón,
 * este es el único archivo que tienes que abrir. Ningún componente escribe
 * un precio a mano: todos leen de aquí.
 *
 * CÓMO CAMBIAR UN PRECIO
 *   PLANES.webEsencial.desde = 2500   →  cambia en toda la web
 *
 * REGLAS QUE NO SE ROMPEN
 *   1. Todo precio publicado lleva «Desde» visible. No hay asteriscos ni
 *      condiciones escondidas: si algo depende del alcance, se dice en la
 *      misma tarjeta, no en letra pequeña al final de la página.
 *   2. `incluye` es lo que SIEMPRE va dentro. `puedeIncluir` es lo que
 *      depende del proyecto. La separación es deliberada: prometer de más
 *      es lo que rompe la confianza en la primera llamada.
 *   3. Nada de métricas, uptime garantizado ni plazos que no se puedan
 *      sostener. Si un dato no está confirmado, no se publica.
 *
 * Los precios de este Preview son provisionales y están para validarse.
 */

/** Formatea 2000 → «$2,000 MXN». Un solo sitio para no tener dos formatos. */
export function formatoMXN(valor) {
  return `$${valor.toLocaleString('es-MX')} MXN`;
}

/** La palabra «Desde» va siempre visible, nunca escondida. */
export const PREFIJO_DESDE = 'Desde';

export const MONEDA = 'MXN';

/**
 * En México el IVA cambia el número final un 16%, así que decirlo es la
 * diferencia entre un precio y una sorpresa. Se declara una vez aquí y la
 * página de precios lo pinta donde el visitante lo va a leer.
 */
export const AVISO_IVA = 'Todos los precios están en pesos mexicanos y no incluyen IVA. Si necesitas factura, dímelo al cotizar y lo contemplo desde el principio.';

/* ============================================================
   PLANES
   ============================================================ */

export const PLANES = {
  webEsencial: {
    id: 'web-esencial',
    nombre: 'Web Esencial',
    familia: 'web',
    desde: 2000,
    periodo: null,
    resumen: 'Tu negocio, con una página profesional y bien hecha, para empezar a existir en internet.',
    paraQuien: 'Negocios que hoy solo tienen redes sociales y necesitan un sitio serio al que mandar a la gente.',
    incluye: [
      'Página de una sola vista, diseñada para tu negocio',
      'Adaptada a teléfono, tablet y computadora',
      'Tus servicios, tus fotos y tus datos de contacto',
      'Botón directo a WhatsApp',
      'Publicación y puesta en línea',
    ],
    /* Lo que NO entra a este precio se dice aquí, no en una nota al pie. */
    noIncluye: [
      'Panel para editar el contenido tú mismo',
      'Dominio propio',
      'Mantenimiento mensual',
    ],
    subeSi: [
      'Necesitas más de una vista o varias páginas',
      'Hay que redactar los textos desde cero',
      'Quieres poder editar el contenido tú mismo',
      'Necesitas catálogo, carrito o cobros en línea',
    ],
    nota: 'El dominio y el mantenimiento se pueden añadir aparte. Te digo cuánto antes de empezar.',
    salida: 'El sitio y el dominio quedan a tu nombre. No hay permanencia: si mañana te lo llevas con otra persona, te lo llevas.',
    cta: 'Cotizar Web Esencial',
    destacado: false,
  },

  webProfesional: {
    id: 'web-profesional',
    nombre: 'Web Profesional',
    familia: 'web',
    desde: 8000,
    periodo: null,
    resumen: 'El sitio completo de tu negocio: varias páginas, contenido que tú administras y todo listo para recibir clientes.',
    paraQuien: 'Negocios con catálogo, varios servicios o que ya reciben solicitudes y necesitan ordenarlas.',
    incluye: [
      'Diseño propio, no una plantilla',
      'Varias páginas: servicios, catálogo, galería, contacto',
      'Formularios que te llegan al correo',
      'SEO técnico inicial y analítica configurada',
      'Dominio incluido el primer año',
      'Publicación, pruebas y acompañamiento en el lanzamiento',
    ],
    puedeIncluir: [
      'Panel para editar servicios, productos, galería y precios',
      'Fichas individuales de producto o servicio',
      'Solicitudes de cotización',
      'Catálogo con categorías',
      'Integraciones con las herramientas que ya usas',
      'Correo empresarial con tu dominio',
    ],
    subeSi: [
      'Son muchas páginas o un catálogo grande',
      'Hay que migrar contenido de un sitio anterior',
      'Necesitas cobros en línea o reservas',
      'Se conecta con tu punto de venta o tu CRM',
      'Hace falta sesión de fotos o redacción completa',
    ],
    nota: 'La propuesta final define exactamente qué lleva tu proyecto. No pagas por una lista de botones: pagas por resolver lo que tu negocio necesita.',
    salida: 'Dominio, código y contenido quedan a tu nombre. A partir del año 2 el dominio se renueva a precio de registro; te digo cuánto es antes de empezar.',
    cta: 'Cotizar Web Profesional',
    destacado: true,
  },

  mantenimiento: {
    id: 'mantenimiento',
    nombre: 'Mantenimiento Web',
    familia: 'web',
    desde: 200,
    periodo: 'mes',
    resumen: 'Tu sitio actualizado, vigilado y con alguien a quien escribirle cuando algo no funcione.',
    paraQuien: 'Cualquiera que ya tenga su sitio en línea y no quiera preocuparse por él.',
    incluye: [
      'Monitoreo de que el sitio esté disponible',
      'Actualizaciones técnicas y de seguridad',
      'Revisión de que los formularios sigan llegando',
      'Corrección de errores',
      'Soporte cuando lo necesites',
      'Ajustes pequeños de contenido',
    ],
    subeSi: [
      'El sitio tiene panel y catálogo que mantener',
      'Quieres cambios de contenido cada mes',
      'Hay integraciones que vigilar',
    ],
    nota: 'Es opcional. Si prefieres quedarte solo con tu proyecto entregado, no pasa nada: es tuyo.',
    salida: 'Se cancela cuando quieras, sin permanencia y sin penalización. Tu sitio sigue siendo tuyo y sigue funcionando.',
    cta: 'Preguntar por mantenimiento',
    destacado: false,
  },

  crm: {
    id: 'crm',
    nombre: 'CRM',
    familia: 'sistemas',
    desde: 3000,
    periodo: 'mes',
    masImplementacion: true,
    resumen: 'Todos tus clientes, prospectos y seguimientos en un solo lugar, en vez de repartidos entre WhatsApp, Excel y la memoria.',
    paraQuien: 'Negocios que venden por cotización o seguimiento y pierden oportunidades por desorden.',
    incluye: [
      'Ficha de cada cliente con su historial',
      'Prospectos por etapa, para ver en qué va cada venta',
      'Tareas y recordatorios de seguimiento',
      'Formularios que entran directo al sistema',
      'Reportes de tu actividad comercial',
      'Usuarios para tu equipo',
    ],
    puedeIncluir: [
      'Cotizaciones y contratos generados solos',
      'Automatizaciones de correo y avisos',
      'Tableros a la medida de tu operación',
      'Conexión con tu sitio web y tu punto de venta',
    ],
    subeSi: [
      'Son muchos usuarios o varios equipos',
      'Hay que migrar mucha información previa',
      'Necesitas automatizaciones o tableros a medida',
      'Se conecta con tu web o tu punto de venta',
    ],
    nota: 'La puesta en marcha se cotiza aparte, una sola vez, y cubre carga de datos, alta de usuarios, migración y capacitación. Depende del tamaño de tu operación.',
    salida: 'Sin permanencia: se cancela cuando quieras. Tus datos son tuyos y te los entrego exportados si te vas.',
    cta: 'Cotizar CRM',
    destacado: false,
  },

  pos: {
    id: 'punto-de-venta',
    nombre: 'Punto de Venta',
    familia: 'sistemas',
    desde: 3000,
    periodo: 'mes',
    masImplementacion: true,
    resumen: 'La caja, el inventario y los reportes de tu negocio funcionando juntos, sin capturar lo mismo dos veces.',
    paraQuien: 'Comercios, restaurantes y negocios con mostrador, inventario o varias sucursales.',
    incluye: [
      'Cobro y registro de ventas',
      'Catálogo de productos',
      'Control de inventario',
      'Cortes de caja',
      'Usuarios con permisos por rol',
      'Reportes de venta',
    ],
    puedeIncluir: [
      'Varias sucursales en un mismo tablero',
      'Pedidos y pantalla de cocina',
      'Clientes y abonos',
      'Tableros para el dueño',
      'Conexión con tu sitio web y tu CRM',
    ],
    subeSi: [
      'Tienes varias sucursales',
      'El catálogo es grande o hay que capturarlo',
      'Necesitas pantalla de cocina o pedidos',
      'Hace falta hardware (lector, impresora, cajón)',
    ],
    nota: 'La puesta en marcha se cotiza aparte, una sola vez, y cubre carga de catálogo, alta de sucursales y usuarios, y capacitación. Depende del tamaño de tu operación.',
    salida: 'Sin permanencia: se cancela cuando quieras. Tus datos son tuyos y te los entrego exportados si te vas.',
    cta: 'Cotizar Punto de Venta',
    destacado: false,
  },

  ecosistema: {
    id: 'ecosistema',
    nombre: 'Ecosistema Empresarial',
    familia: 'sistemas',
    desde: null,
    periodo: null,
    cotizacion: 'Cotización personalizada',
    resumen: 'Tu web, tu punto de venta, tu CRM y tus automatizaciones funcionando como una sola cosa.',
    paraQuien: 'Negocios que ya crecieron y tienen la información partida en herramientas que no se hablan.',
    puedeIncluir: [
      'Página web incluida dentro del paquete',
      'Punto de venta y CRM conectados',
      'Automatizaciones entre las piezas',
      'Correo empresarial con tu dominio',
      'Dominio incluido, hasta dos años según la propuesta',
      'Tableros con la información de todo el negocio',
    ],
    nota: 'En los ecosistemas la página web va dentro del paquete: no es un regalo, está contemplada en el precio del proyecto.',
    salida: 'Sin permanencia. Dominio, código y datos quedan a tu nombre.',
    cta: 'Hablemos de tu ecosistema',
    destacado: false,
  },

  restaurantes: {
    id: 'restaurantes',
    nombre: 'Solución para Restaurantes',
    familia: 'sistemas',
    desde: null,
    periodo: null,
    cotizacion: 'Según la solución',
    resumen: 'Menú digital, punto de venta y clientes, armados alrededor de cómo funciona de verdad un restaurante.',
    paraQuien: 'Restaurantes, cafeterías, fondas y cocinas que quieren ordenar la operación y verse bien en internet.',
    puedeIncluir: [
      'Página web del restaurante',
      'Menú digital con código QR',
      'Menú que actualizas tú, sin llamarme',
      'Punto de venta y pedidos',
      'Pantalla de cocina',
      'Clientes y promociones',
      'Tableros de venta',
    ],
    nota: 'La facturación automática está disponible según el alcance y la integración fiscal de cada caso. Lo revisamos antes de prometerlo.',
    salida: 'Sin permanencia. El menú, el contenido y los datos son tuyos.',
    cta: 'Ver soluciones para restaurantes',
    destacado: false,
  },
};

/* ============================================================
   VISTAS AGRUPADAS — para no repetir arrays por la web
   ============================================================ */

/** Las cuatro anclas de precio que van en la home. */
export const ANCLAS_HOME = [
  PLANES.webEsencial,
  PLANES.webProfesional,
  PLANES.crm,
  PLANES.mantenimiento,
];

export const PLANES_WEB = [PLANES.webEsencial, PLANES.webProfesional, PLANES.mantenimiento];
export const PLANES_SISTEMAS = [PLANES.pos, PLANES.crm, PLANES.ecosistema];
export const PLANES_TODOS = Object.values(PLANES);

/* ============================================================
   HELPERS DE PRESENTACIÓN
   ============================================================ */

/**
 * Devuelve las piezas del precio ya listas para pintar, sin que el
 * componente tenga que decidir nada.
 *   { prefijo: 'Desde', importe: '$2,000 MXN', periodo: null, extra: null }
 */
export function precioDe(plan) {
  if (!plan.desde) {
    return { prefijo: null, importe: plan.cotizacion ?? 'Cotización personalizada', periodo: null, extra: null };
  }
  return {
    prefijo: PREFIJO_DESDE,
    importe: formatoMXN(plan.desde),
    periodo: plan.periodo ? `al ${plan.periodo}` : null,
    extra: plan.masImplementacion ? '+ implementación inicial' : null,
  };
}

/** Versión de una sola línea, para tarjetas apretadas y para metadatos. */
export function precioEnLinea(plan) {
  const p = precioDe(plan);
  return [p.prefijo, p.importe, p.periodo, p.extra].filter(Boolean).join(' ');
}
