/**
 * ============================================================
 * MAPA DE RUTAS — fuente única
 * ============================================================
 *
 * De este archivo salen cuatro cosas que antes se escribían por separado y
 * se desincronizaban solas:
 *
 *   1. las rutas del router
 *   2. el menú de navegación
 *   3. el sitemap.xml
 *   4. la lista de páginas que el build preprocesa a HTML real
 *
 * Añadir una página aquí la da de alta en las cuatro a la vez. Si una ruta
 * no está en esta lista, no existe: ni se enlaza, ni se indexa, ni se
 * prerenderiza. Esa es justamente la idea.
 */

export const DOMINIO = 'https://www.morphiq.com.mx';

/* ------------------------------------------------------------
   Páginas fijas
   ------------------------------------------------------------ */

export const RUTAS = {
  inicio: '/',
  servicios: '/servicios',
  paginasWeb: '/servicios/paginas-web',
  sistemas: '/servicios/sistemas',
  crmAutomatizacion: '/servicios/crm-automatizacion',
  softwareAMedida: '/servicios/software-a-medida',
  restaurantes: '/soluciones/restaurantes',
  proyectos: '/proyectos',
  precios: '/precios',
  sobre: '/sobre-morphiq',
  contacto: '/contacto',
};

/**
 * El menú principal. `hijos` convierte una entrada en desplegable.
 * Se usa igual en escritorio y en el panel de teléfono, para que no haya
 * dos verdades sobre qué se puede visitar.
 */
export const MENU = [
  { etiqueta: 'Inicio', href: RUTAS.inicio },
  {
    etiqueta: 'Servicios',
    href: RUTAS.servicios,
    hijos: [
      { etiqueta: 'Páginas web', href: RUTAS.paginasWeb, resumen: 'Desde una presencia sencilla hasta un sitio que administras tú' },
      { etiqueta: 'Sistemas para negocios', href: RUTAS.sistemas, resumen: 'Punto de venta, inventario y operación diaria' },
      { etiqueta: 'CRM y automatización', href: RUTAS.crmAutomatizacion, resumen: 'Clientes, seguimiento y procesos que corren solos' },
      { etiqueta: 'Software a medida', href: RUTAS.softwareAMedida, resumen: 'Cuando la herramienta que necesitas no existe' },
      { etiqueta: 'Restaurantes', href: RUTAS.restaurantes, resumen: 'Menú QR, punto de venta y ecosistema completo' },
    ],
  },
  { etiqueta: 'Proyectos', href: RUTAS.proyectos },
  { etiqueta: 'Precios', href: RUTAS.precios },
  { etiqueta: 'Sobre Morphiq', href: RUTAS.sobre },
  { etiqueta: 'Contacto', href: RUTAS.contacto },
];

/* ------------------------------------------------------------
   Servicios que el formulario de contacto reconoce
   ------------------------------------------------------------
   El parámetro ?servicio= de /contacto solo acepta estos valores. Cualquier
   otro se ignora y el formulario arranca vacío: así un enlace manipulado no
   puede inyectar texto en el formulario. */

export const SERVICIOS_CONTACTO = [
  { valor: 'pagina-web', etiqueta: 'Página web' },
  { valor: 'sistema', etiqueta: 'Sistema o punto de venta' },
  { valor: 'crm', etiqueta: 'CRM y automatización' },
  { valor: 'software', etiqueta: 'Software a medida' },
  { valor: 'restaurante', etiqueta: 'Solución para restaurante' },
  { valor: 'mantenimiento', etiqueta: 'Mantenimiento de un sitio existente' },
  { valor: 'otro', etiqueta: 'Otra cosa / todavía no lo sé' },
];

export function servicioValido(valor) {
  return SERVICIOS_CONTACTO.some((s) => s.valor === valor);
}

/** Construye el enlace a contacto con el servicio ya elegido. */
export function contactoCon(servicio) {
  return servicio ? `${RUTAS.contacto}?servicio=${servicio}` : RUTAS.contacto;
}

/* ------------------------------------------------------------
   Prioridades del sitemap
   ------------------------------------------------------------
   Solo importan de forma relativa dentro del propio sitemap. */

export const PRIORIDAD = {
  [RUTAS.inicio]: '1.0',
  [RUTAS.servicios]: '0.9',
  [RUTAS.paginasWeb]: '0.9',
  [RUTAS.sistemas]: '0.8',
  [RUTAS.crmAutomatizacion]: '0.8',
  [RUTAS.softwareAMedida]: '0.7',
  [RUTAS.restaurantes]: '0.8',
  [RUTAS.proyectos]: '0.8',
  [RUTAS.precios]: '0.9',
  [RUTAS.sobre]: '0.6',
  [RUTAS.contacto]: '0.7',
};
