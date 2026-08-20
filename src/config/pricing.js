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
    nota: 'El dominio y el mantenimiento se pueden añadir aparte. Te digo cuánto antes de empezar.',
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
    nota: 'La propuesta final define exactamente qué lleva tu proyecto. No pagas por una lista de botones: pagas por resolver lo que tu negocio necesita.',
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
    nota: 'Es opcional. Si prefieres quedarte solo con tu proyecto entregado, no pasa nada: es tuyo.',
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
    nota: 'La implementación inicial se cotiza aparte y depende del tamaño de tu operación y de cuánta información haya que migrar.',
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
    nota: 'La implementación inicial se cotiza aparte: depende de cuántos productos, sucursales y usuarios haya que dejar listos.',
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
