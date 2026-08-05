/**
 * Fuente única de todo el copy del sitio.
 * Editar aquí no requiere abrir un solo componente.
 *
 * ⚠️ REVISAR ANTES DE PUBLICAR EN PRODUCCIÓN
 * Los siguientes valores son propuestas y deben confirmarse con Miguel:
 *   · HERO.stats           → 12+ proyectos, 4 años
 *   · PRICING.tiers[].price → $18,000 / $35,000 / a cotizar
 *   · PRICING.tiers[].time  → plazos por paquete
 *   · PROCESS[].duration    → duración por fase
 *   · FAQ                   → precios, dominio (~$300/año) y mes de ajustes
 * El sitio promete «sin métricas de humo»: ningún número debe quedar
 * publicado sin que sea verdad.
 */

export const CONTACT = {
  owner: 'Miguel Huerta Bautista',
  role: 'Director · Diseñador · Desarrollador',
  phone: '55 2311 8153',
  whatsapp: '525523118153',
  email: 'mhastralsystems@gmail.com',
  location: 'Xochimilco · CDMX',
  site: 'https://www.mh-astral-systems.com',
};

/** Mensaje de WhatsApp por origen del clic — permite saber qué CTA convierte. */
export const WHATSAPP_MESSAGES = {
  nav: 'Hola Miguel 👋 Quiero platicar sobre un proyecto para mi negocio.',
  hero: 'Hola Miguel 👋 Vi tu página y quiero contarte sobre mi proyecto.',
  work: 'Hola Miguel 👋 Vi tus casos de trabajo y quiero algo parecido para mi negocio.',
  pricing: 'Hola Miguel 👋 Vi los paquetes y quiero cotizar mi proyecto.',
  contact: 'Hola Miguel 👋 Quiero contarte qué necesita mi negocio.',
  floating: 'Hola Miguel 👋 Tengo una duda rápida sobre lo que haces.',
};

export const NAV_LINKS = [
  ['Trabajo', '#trabajo'],
  ['Servicios', '#servicios'],
  ['Proceso', '#proceso'],
  ['Inversión', '#inversion'],
  ['Contacto', '#contacto'],
];

export const HERO = {
  eyebrow: 'Estudio digital independiente · CDMX',
  title: ['Diseño lo que tus clientes', 'ven', 'Construyo lo que tu negocio', 'necesita'],
  lead: 'Páginas que convencen. Sistemas que ordenan. Una sola visión para convertir la operación de tu negocio en una ventaja.',
  primaryCta: 'Cuéntame tu proyecto',
  secondaryCta: 'Ver trabajo real',
  stats: [
    { value: 12, suffix: '+', label: 'Proyectos entregados' },
    { value: 4, suffix: '', label: 'Años construyendo' },
    { value: 100, suffix: '%', label: 'Atención directa' },
  ],
  chrome: { id: 'MH / SYSTEM CORE', status: 'EN LÍNEA', hint: 'Mueve el cursor', tech: 'WEBGL / REALTIME' },
};

export const CLIENT_MARQUEE = [
  'PASTELERÍA CONFETTI',
  'JARDINES CLUB HÍPICO',
  "FIESTA TOTAL DJ'S",
  'ELECTROTÉCNICA BERLÍN',
  'PIQUE JUEGOS',
  'VERO SEGUROS',
];

export const PROJECTS = [
  {
    index: '01',
    client: 'Pastelería Confetti',
    category: 'Web + POS multi-sucursal',
    description:
      'Catálogo público, pedidos, caja, abonos, cortes y panel de dueño para coordinar tres sucursales desde una sola vista.',
    outcome: 'Tres sucursales operando sobre el mismo tablero',
    tags: ['Web', 'POS', 'Panel dueño', 'Multi-sucursal'],
    accent: '#ff684f',
    surface: '#f2c3b9',
    visual: 'confetti',
    url: 'https://pasteleria-confetti.vercel.app',
  },
  {
    index: '02',
    client: 'Jardines Club Hípico',
    category: 'Operación comercial',
    description:
      'Sitio, cotizador automatizado, seguimiento de prospectos y generación de contratos para un recinto de eventos.',
    outcome: 'Cotización y contrato generados en minutos, no en días',
    tags: ['CRM', 'Cotizador', 'Contratos', 'Web'],
    accent: '#ceff3d',
    surface: '#dce8b6',
    visual: 'hipico',
    url: 'https://jardines-club-hipico.vercel.app',
  },
  {
    index: '03',
    client: "Fiesta Total DJ's",
    category: 'Experiencia web',
    description:
      'Una página inmersiva, selector de paquetes y una ruta clara hacia WhatsApp para convertir interés en eventos contratados.',
    outcome: 'Del scroll al WhatsApp en un solo movimiento',
    tags: ['Web', 'Paquetes', 'Conversión'],
    accent: '#5e63ff',
    surface: '#c4c0ff',
    visual: 'fiesta',
    url: 'https://fiesta-total-dj.vercel.app',
  },
  {
    index: '04',
    client: 'Electrotécnica Berlín',
    category: 'Punto de venta + presencia web',
    description:
      'Sistema de cobro y presencia digital para un negocio familiar de electrónica, unidos por una identidad visual propia.',
    outcome: 'Un negocio de 50 años con identidad y caja digital',
    tags: ['POS', 'Web', 'Identidad'],
    accent: '#36d7d1',
    surface: '#b9e6e2',
    visual: 'berlin',
    url: 'https://electrotecnica-berlin-web.vercel.app',
  },
];

export const CAPABILITIES = [
  {
    id: 'web',
    index: '01',
    label: 'Web',
    eyebrow: 'Presencia digital',
    title: 'Sitios que se sienten propios, no rentados.',
    description:
      'Dirección visual, experiencia, desarrollo y panel de control en una misma pieza. Desde una landing hasta un catálogo que tu equipo puede actualizar.',
    accent: '#ff684f',
    ink: '#171817',
    foreground: '#171817',
    tags: ['Dirección UI/UX', 'Desarrollo a medida', 'SEO técnico'],
    meta: 'Desde 2 semanas',
    screen: 'website',
  },
  {
    id: 'pos',
    index: '02',
    label: 'Punto de venta',
    eyebrow: 'Operación diaria',
    title: 'La caja, el inventario y los pedidos hablando entre sí.',
    description:
      'Sistemas de cobro pensados alrededor de tu operación real: cortes, abonos, cocina, sucursales, existencias y reportes sin duplicar trabajo.',
    accent: '#ceff3d',
    ink: '#10110f',
    foreground: '#10110f',
    tags: ['Caja e inventario', 'Pedidos y cocina', 'Multi-sucursal'],
    meta: 'Desde 4 semanas',
    screen: 'pos',
  },
  {
    id: 'crm',
    index: '03',
    label: 'CRM & datos',
    eyebrow: 'Ventas y control',
    title: 'Cada prospecto, documento y decisión en el mismo mapa.',
    description:
      'Seguimiento comercial, cotizaciones, contratos y tableros que convierten conversaciones dispersas en un proceso visible.',
    accent: '#5e63ff',
    ink: '#f5f2e9',
    foreground: '#f8f6ef',
    tags: ['Prospectos', 'Cotizadores', 'Dashboards'],
    meta: 'Desde 4 semanas',
    screen: 'crm',
  },
  {
    id: 'automation',
    index: '04',
    label: 'Automatización',
    eyebrow: 'Flujos conectados',
    title: 'Menos pendientes persiguiéndote. Más trabajo sucediendo solo.',
    description:
      'Avisos, documentos, actualizaciones e integraciones que reaccionan cuando deben y dejan a tu equipo enfocarse en el negocio.',
    accent: '#36d7d1',
    ink: '#10110f',
    foreground: '#10110f',
    tags: ['Flujos', 'Documentos', 'Integraciones'],
    meta: 'Desde 1 semana',
    screen: 'automation',
  },
];

export const PROCESS = [
  {
    index: '01',
    title: 'Entender',
    duration: '3 – 5 días',
    text: 'Detecto qué debe vender, ordenar o automatizar la solución antes de abrir el editor.',
  },
  {
    index: '02',
    title: 'Dirigir',
    duration: '1 semana',
    text: 'Defino una idea visual y un recorrido claro. Ves la personalidad antes de construir todo.',
  },
  {
    index: '03',
    title: 'Construir',
    duration: '2 – 6 semanas',
    text: 'Diseño, código y lógica avanzan juntos. Te enseño producto real, no presentaciones eternas.',
  },
  {
    index: '04',
    title: 'Lanzar',
    duration: '3 – 5 días',
    text: 'Publicamos, probamos y dejamos una base que tu negocio pueda operar y hacer crecer.',
  },
];

export const PRICING = {
  eyebrow: '04 / INVERSIÓN',
  title: ['Precios claros.', 'Sin sorpresas a medio proyecto.'],
  lead: 'Trabajo por proyecto cerrado. Te digo el número antes de empezar y ese es el número.',
  tiers: [
    {
      id: 'presencia',
      name: 'Presencia',
      price: 'Desde $18,000',
      time: '2 – 3 semanas',
      pitch: 'Para el negocio que necesita verse como lo que ya es.',
      accent: '#ff684f',
      features: [
        'Sitio a medida, no plantilla',
        'Identidad visual aplicada',
        'SEO técnico y velocidad',
        'Panel para editar contenido',
        'Dominio y publicación incluidos',
      ],
    },
    {
      id: 'operacion',
      name: 'Operación',
      price: 'Desde $35,000',
      time: '4 – 6 semanas',
      pitch: 'Para el negocio que ya vende y necesita dejar de perder tiempo.',
      accent: '#ceff3d',
      featured: true,
      features: [
        'Punto de venta o CRM a la medida',
        'Inventario, cortes y reportes',
        'Multi-usuario y permisos',
        'Capacitación a tu equipo',
        'Un mes de ajustes incluido',
      ],
    },
    {
      id: 'sistema',
      name: 'Sistema completo',
      price: 'A cotizar',
      time: '6 – 10 semanas',
      pitch: 'Para el negocio que quiere que todo hable entre sí.',
      accent: '#5e63ff',
      features: [
        'Web + operación + automatizaciones',
        'Diseñado como una sola pieza',
        'Integraciones con lo que ya usas',
        'Tableros de dueño',
        'Soporte prioritario',
      ],
    },
  ],
  terms: [
    ['50 / 50', 'Mitad para arrancar, mitad contra entrega.'],
    ['Sin mensualidades', 'No te amarro a una renta obligatoria.'],
    ['Es tuyo', 'El código, el dominio y los accesos quedan a tu nombre.'],
  ],
};

export const ABOUT = {
  eyebrow: '05 / QUIÉN LO HACE',
  title: ['Dos disciplinas.', 'Una sola persona.'],
  statement: 'Diseño la <em>cara visible</em> y construyo la <strong>máquina detrás.</strong>',
  paragraphs: [
    'Soy Miguel. Llevo cuatro años haciendo páginas y sistemas para negocios de la Ciudad de México: pastelerías, salones de eventos, talleres de electrónica, DJs.',
    'La mayoría de los estudios te diseñan bonito y te dejan solo con la operación. La mayoría de los programadores te resuelven la operación y te dejan un sistema que da pena enseñar. Yo hago las dos cosas porque son la misma cosa.',
    'Trabajo directo contigo. No hay cuenta, ni junior, ni cadena de correos. Si me escribes un martes a las nueve de la noche, te contesto yo.',
  ],
  signature: 'MH97 · DESIGN × SYSTEMS · CDMX',
};

export const FAQ = {
  eyebrow: '06 / PREGUNTAS',
  title: ['Lo que todos', 'preguntan primero.'],
  items: [
    {
      q: '¿Cuánto cuesta una página web?',
      a: 'Una presencia completa arranca en $18,000 MXN. Un sistema de operación en $35,000. El número final depende de cuántas pantallas y cuánta lógica necesites, y te lo doy cerrado antes de empezar — no por hora.',
    },
    {
      q: '¿Cuánto tiempo tarda?',
      a: 'Una página, entre dos y tres semanas. Un punto de venta o CRM, entre cuatro y seis. Un sistema completo, de seis a diez. Te entrego avances reales cada semana, no reportes.',
    },
    {
      q: '¿Yo puedo editar el contenido después?',
      a: 'Sí. Todo lo que sea contenido vivo — precios, productos, fotos, textos — queda en un panel que tú manejas. Te capacito antes de entregar y te dejo el video.',
    },
    {
      q: '¿El dominio y el hosting van incluidos?',
      a: 'La publicación y el primer año de dominio van incluidos. Después el dominio cuesta unos $300 al año y el hosting suele quedarse en cero. Todo queda a tu nombre, no al mío.',
    },
    {
      q: '¿Qué pasa si necesito cambios después de entregar?',
      a: 'Tienes un mes de ajustes incluido. Pasado eso trabajamos por bloque de horas o por proyecto nuevo, lo que te salga mejor. No hay contrato de permanencia.',
    },
    {
      q: '¿Trabajas con negocios fuera de CDMX?',
      a: 'Sí. La mayoría de mis clientes son de la ciudad porque me gusta ir a verlos, pero el proceso funciona igual a distancia: videollamadas, avances en línea y entrega remota.',
    },
    {
      q: '¿Puedo empezar solo con la página y agregar el sistema después?',
      a: 'Es lo que recomiendo si estás empezando. Construyo la página pensando en que el sistema llegará, así que después se conecta en lugar de rehacerse.',
    },
    {
      q: '¿Cómo sé que no vas a desaparecer a medio proyecto?',
      a: 'Porque el trabajo está en línea y lo puedes ver: los cuatro casos de esta página tienen enlace directo. Y porque cobro la mitad al final — si no entrego, no cobro.',
    },
  ],
};

export const CONTACT_SECTION = {
  eyebrow: '07 / CONTACTO DIRECTO',
  kicker: '¿TIENES UNA IDEA?',
  title: ['Hagamos algo', 'difícil de ignorar.'],
  pitch: 'Cuéntame qué vendes, qué se está atorando y qué quieres mejorar. Yo te digo con honestidad qué conviene construir.',
  formNote: '¿Prefieres no dar tu WhatsApp? Escríbeme aquí y te contesto por correo.',
};

export const FOOTER = {
  tagline: ['Diseño que vende.', 'Sistemas que ordenan.'],
  links: [
    ['Trabajo', '#trabajo'],
    ['Servicios', '#servicios'],
    ['Inversión', '#inversion'],
    ['Preguntas', '#preguntas'],
    ['Volver arriba', '#inicio'],
  ],
};

export const SECTIONS = {
  work: {
    eyebrow: '01 / TRABAJO REAL',
    title: ['Diseño con pulso.', 'Sistemas con oficio.'],
    lead: 'Proyectos concretos para negocios reales. Cada uno está en línea y lo puedes abrir ahora mismo.',
    truth: 'Sin testimonios inventados. Sin métricas de humo. Alcance claro, producto real y contacto directo.',
  },
  capabilities: {
    eyebrow: '02 / CAPACIDADES',
    title: ['Un estudio.', 'Cuatro frentes.'],
    lead: 'No vendo una colección de herramientas sueltas. Diseño cómo se conectan para que tu negocio se vea mejor y funcione mejor.',
  },
  process: {
    eyebrow: '03 / PROCESO',
    title: ['Menos teatro.', 'Más producto.'],
    lead: 'Un método compacto para convertir una idea dispersa en algo que tu equipo realmente puede usar.',
  },
};
