import {
  Bot,
  ChartNoAxesCombined,
  ChefHat,
  CircleDollarSign,
  FileText,
  Globe2,
  LayoutDashboard,
  QrCode,
  ScanBarcode,
  Sparkles,
  Store,
  UsersRound,
  Workflow,
} from 'lucide-react';

export const CONTACT = {
  owner: 'Miguel Huerta Bautista',
  phone: '55 2311 8153',
  whatsapp: '525523118153',
  email: 'mhastralsystems@gmail.com',
  location: 'Xochimilco · CDMX',
};

export const WHATSAPP_MESSAGE =
  'Hola Miguel 👋 Vi la nueva página de MH Astral Systems y quiero platicar sobre un proyecto para mi negocio.';

export const SERVICE_VIEWS = [
  {
    id: 'web',
    short: 'Web',
    kicker: 'Presencia digital',
    title: 'Páginas que explican, convencen y convierten.',
    description:
      'Experiencias rápidas, memorables y claras. Desde una landing hasta un catálogo con panel para que tú mismo cambies fotos, precios y promociones.',
    icon: Globe2,
    color: '#6da8ff',
    tags: ['Diseño UI/UX', 'Panel de autoedición', 'SEO técnico'],
    windowTitle: 'Tu negocio · en línea',
    windowStatus: 'Publicado',
    metric: '24 / 7',
    metricLabel: 'tu mejor presentación',
    bars: [88, 67, 78, 95, 72, 86],
  },
  {
    id: 'pos',
    short: 'POS',
    kicker: 'Operación diaria',
    title: 'Puntos de venta hechos para tu forma de trabajar.',
    description:
      'Cobros, caja, inventario, pedidos, cocina y reportes conectados en un flujo simple que tu equipo puede entender desde el primer día.',
    icon: ScanBarcode,
    color: '#8f7cff',
    tags: ['Caja e inventario', 'Pedidos', 'Reportes'],
    windowTitle: 'Punto de venta · hoy',
    windowStatus: 'Sincronizado',
    metric: '01',
    metricLabel: 'operación conectada',
    bars: [54, 82, 63, 91, 76, 97],
  },
  {
    id: 'crm',
    short: 'CRM',
    kicker: 'Ventas y control',
    title: 'Cada cliente, seguimiento y dato en su lugar.',
    description:
      'CRM, cotizadores, contratos y tableros que convierten conversaciones dispersas en un proceso comercial visible y medible.',
    icon: UsersRound,
    color: '#36d9c3',
    tags: ['Prospectos', 'Cotizaciones', 'Dashboards'],
    windowTitle: 'Pipeline · oportunidades',
    windowStatus: 'Al día',
    metric: '100%',
    metricLabel: 'seguimiento visible',
    bars: [42, 58, 71, 66, 89, 96],
  },
  {
    id: 'automation',
    short: 'Auto',
    kicker: 'Automatización',
    title: 'Menos tareas repetidas. Más negocio moviéndose solo.',
    description:
      'Avisos, documentos, actualizaciones y flujos que se ejecutan cuando deben, sin perseguir pendientes ni duplicar capturas.',
    icon: Workflow,
    color: '#ffb86b',
    tags: ['Flujos', 'Documentos', 'Integraciones'],
    windowTitle: 'Automatizaciones · activas',
    windowStatus: 'Operando',
    metric: '↗',
    metricLabel: 'tiempo recuperado',
    bars: [34, 45, 61, 79, 88, 98],
  },
];

export const EXTRA_SERVICES = [
  { label: 'Menús QR', icon: QrCode },
  { label: 'Dashboards', icon: LayoutDashboard },
  { label: 'Cotizadores', icon: CircleDollarSign },
  { label: 'Formularios', icon: FileText },
  { label: 'Control de datos', icon: ChartNoAxesCombined },
  { label: 'IA aplicada', icon: Bot },
];

export const CASES = [
  {
    folio: 'SIS—01',
    client: 'Pastelería Confetti',
    type: 'Web + POS multi-sucursal',
    description:
      'Catálogo público, pedidos, caja, abonos, cortes y panel de dueño para coordinar tres sucursales desde una sola vista.',
    tags: ['Web', 'POS', 'Panel dueño', 'Multi-sucursal'],
    icon: ChefHat,
    material: 'liquid',
  },
  {
    folio: 'SIS—02',
    client: 'Jardines Club Hípico',
    type: 'Operación comercial',
    description:
      'Sitio, cotizador automatizado, seguimiento de prospectos y generación de contratos para un recinto de eventos.',
    tags: ['CRM', 'Cotizador', 'Contratos', 'Web'],
    icon: Sparkles,
    material: 'clay',
  },
  {
    folio: 'SIS—03',
    client: "Fiesta Total DJ's",
    type: 'Experiencia web',
    description:
      'Página inmersiva con selector de paquetes y una ruta clara de conversión hacia WhatsApp para contratar eventos.',
    tags: ['Web', 'Paquetes', 'Conversión'],
    icon: CircleDollarSign,
    material: 'skeuo',
  },
  {
    folio: 'SIS—04',
    client: 'Electrotécnica Berlín',
    type: 'Punto de venta + presencia web',
    description:
      'Sistema de cobro y presencia digital para un negocio familiar de electrónica, unidos por una identidad visual propia.',
    tags: ['POS', 'Web', 'Identidad'],
    icon: Store,
    material: 'glass',
  },
];

export const PROCESS = [
  {
    number: '01',
    title: 'Entiendo el negocio',
    text: 'No empiezo por colores. Primero detecto qué debe vender, ordenar o automatizar la solución.',
  },
  {
    number: '02',
    title: 'Diseño la experiencia',
    text: 'Definimos la estructura y ves una dirección visual clara antes de construir el sistema completo.',
  },
  {
    number: '03',
    title: 'Construyo y conecto',
    text: 'Desarrollo la interfaz, los flujos y la lógica. Te muestro avances reales, no promesas.',
  },
  {
    number: '04',
    title: 'Lanzo y acompaño',
    text: 'Publicamos, probamos y ajustamos. La entrega incluye una forma clara de operar y crecer.',
  },
];
