/**
 * Fuente única de todo el copy del sitio.
 * Editar aquí no requiere abrir un solo componente.
 *
 * SIN CIFRAS POR DECISIÓN EXPLÍCITA
 * El sitio promete «sin métricas de humo», así que no publica ningún número
 * que no esté confirmado: ni precios, ni plazos, ni conteo de proyectos.
 * Para añadirlos cuando estén validados:
 *   · PRICING.tiers[].price  → sustituir 'A cotizar' por el importe
 *   · PRICING.tiers[].time   → añadir el plazo (el componente ya lo pinta)
 *   · PROCESS[].duration     → añadir la duración por fase
 *   · CAPABILITIES[].meta    → añadir el plazo por frente
 *   · HERO.credentials       → cambiar por cifras si se quieren mostrar
 */

export const CONTACT = {
  owner: 'Miguel Huerta Bautista',
  role: 'Director · Diseñador · Desarrollador',
  phone: '55 2311 8153',
  whatsapp: '525523118153',
  email: 'mhastralsystems@gmail.com',
  location: 'Xochimilco · CDMX',
  site: 'https://www.morphiq.com.mx',
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
  ['Servicios', '#servicios'],
  ['Trabajo', '#trabajo'],
  ['Proceso', '#proceso'],
  ['Inversión', '#inversion'],
  ['Contacto', '#contacto'],
];

export const HERO = {
  eyebrow: 'Estudio digital independiente · CDMX',
  /* El titular se compone de tres renglones con voz distinta: los de fuera
     gritan la promesa en la tipografía de display, y el de en medio la matiza
     en la de texto, más ligera y en minúscula. El contraste es lo que hace que
     se lea como una frase y no como tres líneas del mismo tamaño. */
  title: [
    { text: 'DIGITALIZAMOS', voice: 'mark' },
    { text: 'la operación completa', voice: 'soft' },
    { text: 'DE TU NEGOCIO', voice: 'mark' },
  ],
  /* Lo que era el titular pasa a ser la primera frase de apoyo. */
  claim: ['Diseño lo que tus clientes ', 'ven', '. Construyo lo que tu negocio ', 'necesita.'],
  lead: 'Páginas que convencen. Sistemas que ordenan. Una sola visión para convertir la operación de tu negocio en una ventaja.',
  primaryCta: 'Cuéntame tu proyecto',
  secondaryCta: 'Ver trabajo real',
  credentials: [
    { label: 'Atención directa', note: 'Tratas conmigo, no con una cuenta' },
    { label: 'Diseño + desarrollo', note: 'Las dos disciplinas, una sola persona' },
    { label: 'CDMX', note: 'Voy a verte si hace falta' },
  ],
  chrome: { id: 'MORPHIQ / SYSTEM CORE', status: 'EN LÍNEA', hint: 'Mueve el cursor', tech: 'WEBGL / REALTIME' },
};

/**
 * Carrusel de proyectos. Deduplicado contra los 14 repos públicos de GitHub:
 *   · jardines-club-hipico + JCH1        → un solo proyecto
 *   · mh-photo-booth-studio + ...-web    → un solo producto (app + descargas)
 *   · mh-astral-systems + MH-web-2.0     → este sitio, v1 y v2 (fuera del carrusel)
 * Los que no tienen repo público enlazan al sitio en vivo.
 */
export const CAROUSEL = [
  { name: 'Pastelería Confetti', kind: 'Web + POS', href: 'https://github.com/M1gu3hb/Pasteleria-Confetti' },
  { name: 'Jardines Club Hípico', kind: 'Web + CRM', href: 'https://github.com/M1gu3hb/jardines-club-hipico' },
  { name: 'MH Photo Booth', kind: 'Software de eventos', href: 'https://github.com/M1gu3hb/mh-photo-booth-studio' },
  { name: 'Qyro', kind: 'Software', href: 'https://github.com/M1gu3hb/-Qyro' },
  { name: 'GESTECH', kind: 'Software', href: 'https://github.com/M1gu3hb/GESTCH' },
  { name: 'Vero Seguros', kind: 'Web', href: 'https://github.com/M1gu3hb/Vero-seguros-' },
  { name: 'Pablomics', kind: 'Web', href: 'https://github.com/M1gu3hb/pablomics-' },
  { name: 'Morphiq UI', kind: 'Sistema de diseño', href: 'https://github.com/M1gu3hb/Morphiq-UI' },
  { name: 'Liquid Glass', kind: 'Laboratorio', href: 'https://github.com/M1gu3hb/Liquid-Glass' },
  { name: 'UI Lab', kind: 'Laboratorio', href: 'https://github.com/M1gu3hb/UI-lab' },
  { name: "Fiesta Total DJ's", kind: 'Web', href: 'https://fiesta-total-dj.vercel.app' },
  { name: 'Electrotécnica Berlín', kind: 'Web + POS', href: 'https://electrotecnica-berlin-web.vercel.app' },
  { name: 'Pique Juegos', kind: 'Web', href: 'https://pique-juegos.vercel.app' },
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
    outcome: 'Un negocio familiar con identidad propia y caja digital',
    tags: ['POS', 'Web', 'Identidad'],
    accent: '#36d7d1',
    surface: '#b9e6e2',
    visual: 'berlin',
    url: 'https://electrotecnica-berlin-web.vercel.app',
  },
  {
    index: '05',
    client: 'GESTECH',
    category: 'Software de escritorio',
    description:
      'Controla el cursor, los clics, el scroll y las ventanas de Windows con pura cámara web. Reconoce la mano en tiempo real y solo obedece cuando tú lo activas: palma abierta un segundo para entrar, puño cerrado dos para salir, así no reacciona mientras gesticulas.',
    outcome: 'Manejar la computadora sin tocarla',
    tags: ['Python', 'OpenCV', 'MediaPipe', 'Windows'],
    accent: '#f5a524',
    surface: '#f3ddb4',
    visual: 'gestech',
    url: 'https://github.com/M1gu3hb/GESTCH',
    linkLabel: 'Ver repositorio',
  },
  {
    index: '06',
    client: 'MH Photo Booth',
    category: 'Aplicación de eventos',
    description:
      'Cabina fotográfica que funciona sin internet en el salón y sube todo cuando vuelve la señal, más un portal donde el invitado descarga sus fotos con un folio.',
    outcome: 'Dos aplicaciones, un solo producto',
    tags: ['Electron', 'Offline-first', 'Next.js', 'SQLite'],
    accent: '#5e63ff',
    surface: '#cdcbff',
    visual: 'photobooth',
    url: 'https://github.com/M1gu3hb/mh-photo-booth-studio',
    linkLabel: 'Ver repositorio',
  },
  {
    index: '07',
    client: 'Lo que traes en la cabeza',
    category: 'Tu próxima herramienta',
    description:
      'Punto de venta, CRM, una app para tu equipo, un portal para tus clientes, una herramienta que solo existe en tu cabeza. Si lo puedes explicar, lo puedo construir.',
    outcome: 'El único límite es tu imaginación',
    tags: ['Web', 'Escritorio', 'Móvil', 'Automatización'],
    accent: '#ceff3d',
    surface: '#e2f2ac',
    visual: 'imagination',
    invitation: true,
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
    screen: 'automation',
  },
  {
    id: 'software',
    index: '05',
    label: 'Software a la medida',
    eyebrow: 'Aplicaciones propias',
    title: 'Si no existe la herramienta que necesitas, la construyo.',
    description:
      'Aplicaciones de escritorio, web y móviles hechas desde cero para un problema concreto. GESTECH controla Windows con gestos de la mano; MH Photo Booth opera sin internet en un salón. Ninguna existía antes de necesitarse.',
    accent: '#f5a524',
    ink: '#171817',
    foreground: '#171817',
    tags: ['Apps de escritorio', 'Apps web', 'Funciona sin internet'],
    screen: 'software',
  },
];

export const PROCESS = [
  {
    index: '01',
    title: 'Entender',
    text: 'Detecto qué debe vender, ordenar o automatizar la solución antes de abrir el editor.',
  },
  {
    index: '02',
    title: 'Dirigir',
    text: 'Defino una idea visual y un recorrido claro. Ves la personalidad antes de construir todo.',
  },
  {
    index: '03',
    title: 'Construir',
    text: 'Diseño, código y lógica avanzan juntos. Te enseño producto real, no presentaciones eternas.',
  },
  {
    index: '04',
    title: 'Lanzar',
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
      price: 'A cotizar',
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
      price: 'A cotizar',
      pitch: 'Para el negocio que ya vende y necesita dejar de perder tiempo.',
      accent: '#ceff3d',
      featured: true,
      features: [
        'Punto de venta o CRM a la medida',
        'Inventario, cortes y reportes',
        'Multi-usuario y permisos',
        'Capacitación a tu equipo',
        'Ajustes incluidos tras la entrega',
      ],
    },
    {
      id: 'sistema',
      name: 'Sistema completo',
      price: 'A cotizar',
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
    ['Precio cerrado', 'Te doy el número antes de empezar y ese es el número.'],
    /* Antes decía «sin mensualidades». Se cae: hay planes con mensualidad y
       prometer lo contrario dejaba sin cubrir justo esa mitad del catálogo. */
    ['Sin letra chica', 'Lo que entra y lo que no, por escrito antes de empezar.'],
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
      a: 'Depende de cuántas pantallas y cuánta lógica necesites: no es lo mismo una página de presentación que un sistema de caja con inventario. Cuéntame qué haces y te doy un número cerrado antes de empezar, no una tarifa por hora que no puedas prever.',
    },
    {
      q: '¿Cuánto tiempo tarda?',
      a: 'Depende del alcance, y te doy una fecha antes de arrancar. Lo que no cambia es el ritmo: cada semana ves producto real funcionando, no reportes de avance ni presentaciones.',
    },
    {
      q: '¿Yo puedo editar el contenido después?',
      a: 'Sí. Todo lo que sea contenido vivo — precios, productos, fotos, textos — queda en un panel que tú manejas. Te capacito antes de entregar y te dejo el video.',
    },
    {
      q: '¿El dominio y el hosting van incluidos?',
      a: 'La publicación y el dominio los dejo resueltos como parte del proyecto, y el hosting de una página así normalmente no cuesta nada. Lo importante: todo queda registrado a tu nombre, no al mío.',
    },
    {
      q: '¿Qué pasa si necesito cambios después de entregar?',
      a: 'Los ajustes que salen justo después de entregar van incluidos; lo acordamos por escrito al cerrar. Más adelante trabajamos por bloque o por proyecto nuevo, lo que te salga mejor. No hay contrato de permanencia.',
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
      a: 'Porque el trabajo está en línea y lo puedes ver: los cuatro casos de esta página tienen enlace directo, ábrelos. Y porque parte del pago va contra entrega — si no entrego, no lo cobro.',
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
    eyebrow: '02 / TRABAJO REAL',
    title: ['Diseño con pulso.', 'Sistemas con oficio.'],
    lead: 'Negocios reales, software real. Cada caso está en línea o en GitHub y lo puedes abrir ahora mismo.',
    truth: 'Sin testimonios inventados. Sin métricas de humo. Alcance claro, producto real y contacto directo.',
  },
  capabilities: {
    eyebrow: '01 / CAPACIDADES',
    title: ['Un estudio.', 'Cinco frentes.'],
    lead: 'No vendo una colección de herramientas sueltas. Diseño cómo se conectan para que tu negocio se vea mejor y funcione mejor.',
  },
  process: {
    eyebrow: '03 / PROCESO',
    title: ['Menos teatro.', 'Más producto.'],
    lead: 'Un método compacto para convertir una idea dispersa en algo que tu equipo realmente puede usar.',
  },
};
