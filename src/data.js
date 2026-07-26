export const CONTACT = {
  owner: 'Miguel Huerta Bautista',
  phone: '55 2311 8153',
  whatsapp: '525523118153',
  email: 'mhastralsystems@gmail.com',
  location: 'Xochimilco · CDMX',
};

export const WHATSAPP_MESSAGE =
  'Hola Miguel 👋 Vi la nueva página de MH Astral Systems y quiero platicar sobre un proyecto para mi negocio.';

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
];

export const PROJECTS = [
  {
    index: '01',
    client: 'Pastelería Confetti',
    category: 'Web + POS multi-sucursal',
    description:
      'Catálogo público, pedidos, caja, abonos, cortes y panel de dueño para coordinar tres sucursales desde una sola vista.',
    tags: ['Web', 'POS', 'Panel dueño', 'Multi-sucursal'],
    accent: '#ff765e',
    surface: '#f2c3b9',
    visual: 'confetti',
  },
  {
    index: '02',
    client: 'Jardines Club Hípico',
    category: 'Operación comercial',
    description:
      'Sitio, cotizador automatizado, seguimiento de prospectos y generación de contratos para un recinto de eventos.',
    tags: ['CRM', 'Cotizador', 'Contratos', 'Web'],
    accent: '#d5ff45',
    surface: '#dce8b6',
    visual: 'hipico',
  },
  {
    index: '03',
    client: "Fiesta Total DJ's",
    category: 'Experiencia web',
    description:
      'Una página inmersiva, selector de paquetes y una ruta clara hacia WhatsApp para convertir interés en eventos contratados.',
    tags: ['Web', 'Paquetes', 'Conversión'],
    accent: '#7770ff',
    surface: '#c4c0ff',
    visual: 'fiesta',
  },
  {
    index: '04',
    client: 'Electrotécnica Berlín',
    category: 'Punto de venta + presencia web',
    description:
      'Sistema de cobro y presencia digital para un negocio familiar de electrónica, unidos por una identidad visual propia.',
    tags: ['POS', 'Web', 'Identidad'],
    accent: '#47d8d2',
    surface: '#b9e6e2',
    visual: 'berlin',
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
