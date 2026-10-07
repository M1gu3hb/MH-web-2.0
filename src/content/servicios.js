/**
 * ============================================================
 * CONTENIDO DE LAS PÁGINAS DE SERVICIO
 * ============================================================
 *
 * Todas las páginas de servicio comparten la misma forma, así que un solo
 * componente las pinta todas. Cambiar el copy es cambiar este archivo.
 *
 * CRITERIO DE ESCRITURA
 *   · Se explica desde el problema del negocio, no desde la tecnología.
 *     El dueño de una pastelería no busca «un CRM»: busca dejar de perder
 *     pedidos. La palabra técnica llega después, cuando ya entendió.
 *   · Nada de «soluciones disruptivas» ni «experiencias extraordinarias».
 *     Si una frase no se puede decir en voz alta sin sonar a folleto, se cae.
 *   · No se promete lo que depende del alcance. Para eso está `puedeIncluir`
 *     en pricing.js y el lenguaje «según el proyecto».
 *   · Cero cifras inventadas.
 */

import { RUTAS } from '../config/rutas.js';

/* ============================================================
   Índice — lo que se pinta en /servicios y en el menú
   ============================================================ */

export const SERVICIOS = [
  {
    id: 'web',
    ruta: RUTAS.paginasWeb,
    nombre: 'Páginas web',
    promesa: 'Que te encuentren, entiendan qué haces y te escriban.',
    resumen:
      'Desde una página sencilla y bien hecha hasta una tienda en línea que tú mismo administras. También remodelo el sitio que ya tienes.',
    acento: '#ff684f',
    imagen: '/servicios/web.webp',
    imagenSq: '/servicios/web-sq.webp',
    paraTi: 'Tu negocio solo vive en redes sociales, o tu página actual da pena enseñarla.',
    puntos: ['Diseño propio', 'Formularios que te llegan', 'Contenido que editas tú'],
  },
  {
    id: 'sistemas',
    ruta: RUTAS.sistemas,
    nombre: 'Sistemas para negocios',
    promesa: 'Que la caja, el inventario y los reportes dejen de pelearse.',
    resumen:
      'Punto de venta, control de existencias y tableros para ver cómo va el negocio de verdad.',
    acento: '#4f95ff',
    imagen: '/servicios/pos.webp',
    imagenSq: '/servicios/pos-sq.webp',
    paraTi: 'Llevas la venta en libreta o en Excel, y no sabes qué tienes hasta que se acaba.',
    puntos: ['Caja e inventario', 'Varias sucursales', 'Reportes del dueño'],
  },
  {
    id: 'crm',
    ruta: RUTAS.crmAutomatizacion,
    nombre: 'CRM y automatización',
    promesa: 'Que no se te caiga ni un cliente por olvido.',
    resumen:
      'Prospectos, seguimiento y procesos que corren solos en vez de vivir en tu cabeza.',
    acento: '#5e63ff',
    imagen: '/servicios/crm.webp',
    imagenSq: '/servicios/crm-sq.webp',
    paraTi: 'Cotizas por WhatsApp y luego no te acuerdas a quién le quedaste de marcar.',
    puntos: ['Clientes en un solo lugar', 'Seguimiento por etapa', 'Avisos automáticos'],
  },
  {
    id: 'software',
    ruta: RUTAS.softwareAMedida,
    nombre: 'Software a medida',
    promesa: 'Cuando la herramienta que necesitas no existe todavía.',
    resumen:
      'Aplicaciones de escritorio, web o móviles hechas desde cero para un problema concreto.',
    acento: '#f5a524',
    imagen: '/servicios/software.webp',
    imagenSq: '/servicios/software-sq.webp',
    paraTi: 'Ya probaste tres programas y ninguno hace exactamente lo que tu negocio necesita.',
    puntos: ['Escritorio, web o móvil', 'Hecho para tu proceso', 'Tuyo, no rentado'],
  },
  {
    id: 'restaurantes',
    ruta: RUTAS.restaurantes,
    nombre: 'Restaurantes',
    promesa: 'Menú, caja y clientes en un solo ecosistema.',
    resumen:
      'La solución completa para restaurantes: página, menú con QR, punto de venta y pedidos.',
    acento: '#36d7d1',
    imagen: '/servicios/automation.webp',
    imagenSq: '/servicios/automation-sq.webp',
    paraTi: 'Reimprimes el menú cada vez que sube un precio, y la comanda sigue siendo de papel.',
    puntos: ['Menú QR que editas tú', 'Punto de venta y cocina', 'Clientes y promociones'],
    vertical: true,
  },
  {
    id: 'facturacion',
    ruta: RUTAS.facturacion,
    nombre: 'Facturación automática',
    promesa: 'Que el ticket se vuelva factura sin capturar nada.',
    resumen:
      'Facturación electrónica conectada a donde ya vendes: el punto de venta, la tienda en línea o el restaurante.',
    acento: '#4fd46a',
    paraTi: 'Facturas a mano, en el portal, con el cliente esperando y el riesgo de teclear mal un RFC.',
    puntos: ['Se conecta a lo que ya tienes', 'PDF y XML al correo', 'Sin capturar dos veces'],
  },
];

export function servicioPorRuta(ruta) {
  return SERVICIOS.find((s) => s.ruta === ruta);
}

/* ============================================================
   Las páginas completas
   ============================================================ */

export const PAGINAS_SERVICIO = {
  /* ---------------------------------------------------------- */
  [RUTAS.paginasWeb]: {
    id: 'web',
    acento: '#ff684f',
    pista: 'Cambia de escritorio a teléfono y agrega algo al carrito.',
    seo: {
      title: 'Páginas web para negocios en CDMX | Morphiq',
      description:
        'Diseño y desarrollo de páginas web para negocios: desde una presencia sencilla desde $2,000 MXN hasta un sitio con catálogo que administras tú. Precio cerrado antes de empezar.',
    },
    migas: [
      { nombre: 'Inicio', path: RUTAS.inicio },
      { nombre: 'Servicios', path: RUTAS.servicios },
      { nombre: 'Páginas web', path: RUTAS.paginasWeb },
    ],
    schema: {
      tipo: 'Diseño y desarrollo de sitios web',
      descripcion:
        'Diseño y desarrollo de páginas web para negocios en la Ciudad de México, desde sitios de presentación hasta sitios administrables con catálogo y formularios.',
    },

    hero: {
      eyebrow: 'Servicio 01 · Presencia digital',
      titulo: 'Una página que trabaja para tu negocio.',
      resalte: 'trabaja',
      entrada:
        'No un folleto bonito que nadie visita. Una página que la gente encuentra, entiende en diez segundos y usa para escribirte.',
      servicio: 'pagina-web',
    },

    problemas: {
      titulo: '¿Alguna de estas te suena?',
      lista: [
        'Cuando alguien te pide información, le mandas capturas de tu Instagram.',
        'Tienes página, pero te da pena pasarla y prefieres explicar por WhatsApp.',
        'Tu sitio se hizo hace años y hoy se ve viejo al lado del de tu competencia.',
        'Para cambiar un precio o una foto tienes que buscar a quien te la hizo.',
        'Te buscan en Google por tu nombre y no apareces.',
        'Vendes por mensajes y anotas los pedidos a mano, uno por uno.',
        'Tu página se ve mal en el teléfono, que es donde te ve casi todo el mundo.',
      ],
    },

    niveles: {
      titulo: 'Dos formas de empezar',
      entrada:
        'La diferencia no es «más botones». Es cuánto trabajo quieres que haga la página por ti.',
      planes: ['webEsencial', 'webProfesional'],
    },

    capacidades: {
      titulo: 'Qué se puede construir',
      entrada: 'Según el proyecto, tu página puede llegar hasta donde tu negocio la necesite.',
      grupos: [
        {
          nombre: 'Para que te encuentren',
          items: [
            'Diseño propio, con la identidad de tu negocio',
            'Adaptada a teléfono, tablet y computadora',
            'SEO técnico para que Google la entienda',
            'Velocidad de carga cuidada',
            'Analítica para saber qué buscan tus visitantes',
          ],
        },
        {
          nombre: 'Para que te contacten',
          items: [
            'Formularios que te llegan al correo',
            'Botón directo a WhatsApp',
            'Solicitudes de cotización',
            'Fichas de servicio o de producto',
            'Galería de trabajos',
          ],
        },
        {
          nombre: 'Para que crezcas sin llamarme',
          items: [
            'Panel para editar servicios y productos',
            'Alta y baja de artículos y fotos',
            'Cambio de precios y promociones',
            'Categorías y catálogo',
            'Publicación de novedades',
          ],
        },
        {
          nombre: 'Tienda en línea, cuando toca vender',
          items: [
            'Catálogo con carrito y cobro en línea',
            'Pedidos, reservas y envíos',
            'Existencias que bajan solas al vender',
            'Cotizador automático',
            'Conexión con tu punto de venta y con la facturación',
            'Correo empresarial con tu dominio',
          ],
        },
      ],
      nota: 'No todos los proyectos llevan todo. La propuesta define exactamente qué lleva el tuyo, y el precio se cierra antes de empezar.',
    },

    /* Remodelación. Va en Páginas web y no como servicio aparte porque no lo
       es: es el mismo trabajo empezando desde algo que ya existe. Y conviene
       decirlo en la página, porque mucha gente con sitio viejo da por hecho
       que su única opción es tirarlo y empezar de cero. */
    remodelacion: {
      titulo: '¿Y si ya tienes una página?',
      cuerpo:
        'No hace falta tirarla. Se puede remodelar: mismo dominio, mismo contenido que sirve, y encima un diseño de ahora, que cargue rápido y se vea bien en el teléfono. Lo que ya funciona se queda; lo que estorba se va.',
      remate:
        'Primero la reviso y te digo la verdad: hay sitios donde remodelar sale más caro que rehacer, y en esos te lo digo antes de cobrarte nada.',
    },

    editable: {
      titulo: 'Tu página puede crecer contigo',
      cuerpo:
        'Hay páginas que se quedan congeladas el día que se entregan. Cuando el proyecto lo justifica, te construyo un panel para que tú cambies precios, subas fotos, publiques promociones y des de alta servicios nuevos. Sin depender de mí para cada cosa pequeña.',
      remate: 'No todas las páginas lo necesitan. Si la tuya no cambia casi nunca, es dinero que te ahorras.',
    },

    faq: [
      {
        q: '¿Qué diferencia real hay entre la de $2,000 y la de $8,000?',
        a: 'La Web Esencial es una página, bien hecha, con tu información y un botón a WhatsApp: sirve para existir y para que te escriban. La Web Profesional es un sitio con varias páginas, formularios que te llegan al correo, dominio el primer año y, según el proyecto, un panel para que tú administres el contenido. Una te pone en internet; la otra trabaja para ti.',
      },
      {
        q: '¿El dominio va incluido?',
        a: 'En la Web Profesional sí, el primer año. En la Web Esencial no viene incluido, pero te lo puedo conseguir y configurar aparte, y te digo cuánto cuesta antes de empezar. En ecosistemas completos puede llegar a dos años según la propuesta.',
      },
      {
        q: '¿Puedo editar el contenido yo mismo?',
        a: 'Depende del proyecto. Cuando el sitio incluye panel, sí: cambias precios, fotos, servicios y promociones tú mismo, y te capacito antes de entregar. La Web Esencial no incluye panel; los cambios los hago yo.',
      },
      {
        q: '¿Cuánto tarda?',
        a: 'Depende del alcance y te doy una fecha antes de arrancar. Lo que no cambia es que ves avances reales durante el proceso, no un silencio de tres semanas.',
      },
      {
        q: '¿Qué pasa si necesito cambios después de entregar?',
        a: 'Los ajustes que salen justo después de entregar van incluidos, y lo dejamos por escrito al cerrar. Después puedes contratar mantenimiento desde $200 MXN al mes o pedirme cambios por bloque. No hay contrato de permanencia.',
      },
      {
        q: 'Ya tengo una página vieja. ¿La rehaces o la remodelas?',
        a: 'Las dos cosas son posibles y depende de con qué esté hecha. Si se puede aprovechar, se remodela y conservas dominio, textos y posicionamiento. Si por dentro está armada de una forma que va a dar problemas cada vez que la toques, sale más barato rehacerla, y te lo digo antes de empezar en vez de cobrarte por parchear.',
      },
      {
        q: '¿Puedo vender en línea desde mi página?',
        a: 'Sí: catálogo con carrito, cobro en línea, pedidos y envíos. Y como lo construyo yo, se puede conectar con tu punto de venta para que las existencias bajen solas al vender, y con la facturación para que el ticket se vuelva factura. Ese es el sentido de tener una tienda hecha a la medida y no una plantilla alquilada.',
      },
      {
        q: '¿La página es mía?',
        a: 'Sí. El dominio queda a tu nombre y el sitio es tuyo. Si mañana quieres llevártelo con otra persona, te lo llevas.',
      },
    ],

    proyectos: ['pasteleria-confetti', 'fiesta-total-dj', 'electrotecnica-berlin'],

    cierre: {
      titulo: '¿Empezamos por tu página?',
      cuerpo: 'Cuéntame qué hace tu negocio y te digo cuál de las dos te conviene. Si con la de $2,000 te alcanza, te lo voy a decir.',
      servicio: 'pagina-web',
    },
  },

  /* ---------------------------------------------------------- */
  [RUTAS.sistemas]: {
    id: 'sistemas',
    acento: '#4f95ff',
    /* El pie de la maqueta de la cabecera. Existe porque una demo que nadie
       sabe que se puede tocar es un dibujo caro: sin esta línea, la
       interacción no la descubre nadie. */
    pista: 'Toca un producto y cóbralo: así se ve una venta.',
    seo: {
      title: 'Sistemas y punto de venta para negocios | Morphiq',
      description:
        'Punto de venta, inventario y reportes para negocios en CDMX. Desde $3,000 MXN al mes más implementación. Multi-sucursal, pedidos y panel de dueño según el alcance.',
    },
    migas: [
      { nombre: 'Inicio', path: RUTAS.inicio },
      { nombre: 'Servicios', path: RUTAS.servicios },
      { nombre: 'Sistemas para negocios', path: RUTAS.sistemas },
    ],
    schema: {
      tipo: 'Sistemas de punto de venta e inventario',
      descripcion:
        'Sistemas de punto de venta, control de inventario y reportes para comercios y negocios con mostrador o varias sucursales.',
    },

    hero: {
      eyebrow: 'Servicio 02 · Operación diaria',
      titulo: 'Deja de llevar tu negocio de memoria.',
      resalte: 'de memoria',
      entrada:
        'La caja, lo que hay en bodega y lo que se vendió ayer deberían ser el mismo dato. Casi nunca lo son.',
      servicio: 'sistema',
    },

    problemas: {
      titulo: '¿Alguna de estas te suena?',
      lista: [
        'Cierras la caja sumando en la calculadora del teléfono.',
        'No sabes qué producto se está acabando hasta que un cliente lo pide.',
        'Tienes dos sucursales y cada una lleva su propia cuenta.',
        'Capturas la misma venta en el cuaderno y luego en Excel.',
        'Para saber cómo te fue el mes tienes que sentarte una tarde entera.',
      ],
    },

    beneficios: {
      titulo: 'Lo que cambia el día que lo tienes',
      lista: [
        { titulo: 'Sabes qué tienes', cuerpo: 'El inventario baja solo cuando vendes. Sin recontar.' },
        { titulo: 'Cierras en minutos', cuerpo: 'El corte de caja sale del sistema, no de la memoria.' },
        { titulo: 'Ves todo junto', cuerpo: 'Si tienes varias sucursales, las ves en un solo tablero.' },
        { titulo: 'Delegas sin miedo', cuerpo: 'Cada quien entra con su usuario y ves quién hizo qué.' },
      ],
    },

    capacidades: {
      titulo: 'Qué incluye y qué depende del alcance',
      entrada: 'La base va siempre. Lo demás se arma según cómo funcione tu negocio.',
      grupos: [
        {
          nombre: 'La base, siempre',
          items: [
            'Cobro y registro de ventas',
            'Catálogo de productos',
            'Control de inventario',
            'Cortes de caja',
            'Usuarios con permisos',
            'Reportes de venta',
          ],
        },
        {
          nombre: 'Según el alcance',
          items: [
            'Varias sucursales en un tablero',
            'Pedidos y pantalla de cocina',
            'Clientes, abonos y pagos parciales',
            'Tableros para el dueño',
            'Conexión con tu página web',
            'Conexión con tu CRM',
          ],
        },
      ],
      nota: 'La implementación inicial se cotiza aparte y depende de cuántos productos, sucursales y usuarios haya que dejar listos.',
    },

    niveles: {
      titulo: 'Cuánto cuesta',
      entrada: 'Es un servicio mensual porque incluye que el sistema siga funcionando, actualizado y con soporte.',
      planes: ['pos', 'ecosistema'],
    },

    faq: [
      {
        q: '¿Por qué es mensual y no un pago único?',
        a: 'Porque un sistema que cobra dinero todos los días necesita mantenerse: servidores, respaldos, actualizaciones y alguien que conteste cuando algo falla. La mensualidad cubre eso. La implementación inicial, que es dejarlo funcionando con tus productos y tu equipo, se cotiza aparte una sola vez.',
      },
      {
        q: '¿Qué incluye la implementación inicial?',
        a: 'Cargar tu catálogo, configurar sucursales y usuarios, dejar el sistema andando en tu equipo y capacitar a quien lo va a usar. Lo cotizo cuando sé cuántos productos y cuántas personas hay.',
      },
      {
        q: '¿Funciona si se me va el internet?',
        a: 'Depende de la solución. Hay operaciones donde tiene sentido construirlo para que aguante sin red y sincronice después, como hice con MH Photo Booth. Lo hablamos según tu caso: no te voy a prometer que funciona sin internet si tu solución no lo lleva.',
      },
      {
        q: '¿Y si ya tengo un sistema?',
        a: 'Se puede migrar. Lo primero que reviso es si de verdad te conviene cambiar: si lo que tienes funciona y solo le falta una pieza, te sale más barato que le construya esa pieza.',
      },
    ],

    proyectos: ['pasteleria-confetti', 'morphiqpos', 'electrotecnica-berlin'],

    cierre: {
      titulo: 'Cuéntame cómo opera tu negocio hoy',
      cuerpo: 'Con saber qué vendes, cuántas sucursales tienes y cómo cobras, te digo qué sistema necesitas y cuánto costaría dejarlo andando.',
      servicio: 'sistema',
    },
  },

  /* ---------------------------------------------------------- */
  [RUTAS.crmAutomatizacion]: {
    id: 'crm',
    acento: '#5e63ff',
    pista: 'Mueve al cliente de etapa: el mensaje sale solo.',
    seo: {
      title: 'CRM y automatización para negocios | Morphiq',
      description:
        'CRM para organizar clientes, prospectos y seguimiento, más automatizaciones que hacen solo el trabajo repetitivo. Desde $3,000 MXN al mes más implementación.',
    },
    migas: [
      { nombre: 'Inicio', path: RUTAS.inicio },
      { nombre: 'Servicios', path: RUTAS.servicios },
      { nombre: 'CRM y automatización', path: RUTAS.crmAutomatizacion },
    ],
    schema: {
      tipo: 'CRM y automatización de procesos',
      descripcion:
        'Sistemas de gestión de clientes y prospectos, con seguimiento comercial, cotizaciones y automatizaciones de procesos para negocios.',
    },

    hero: {
      eyebrow: 'Servicio 03 · Ventas y control',
      titulo: 'Tus clientes, en un solo lugar. No en tu cabeza.',
      resalte: 'en un solo lugar',
      entrada:
        'Un CRM no es un programa complicado: es saber a quién le quedaste de marcar, cuánto le cotizaste y en qué quedaron.',
      servicio: 'crm',
    },

    quees: {
      titulo: 'Antes de nada: ¿qué es un CRM?',
      cuerpo:
        'Es el lugar donde vive todo lo que sabes de cada cliente: qué te pidió, cuánto le cotizaste, cuándo hablaron por última vez y qué sigue. Hoy eso está repartido entre tu WhatsApp, un cuaderno, tu correo y tu memoria. Un CRM lo junta.',
      remate: 'Si alguna vez perdiste una venta porque se te pasó marcar, ya sabes para qué sirve.',
    },

    problemas: {
      titulo: '¿Alguna de estas te suena?',
      lista: [
        'Alguien pidió cotización hace dos semanas y no recuerdas si le contestaste.',
        'Cada cotización la escribes desde cero, aunque sea casi igual a la anterior.',
        'Si te vas de vacaciones, nadie más sabe en qué iba cada cliente.',
        'Tienes tres conversaciones abiertas del mismo cliente en tres lugares distintos.',
        'No sabes cuántas oportunidades tienes abiertas ahora mismo.',
      ],
    },

    beneficios: {
      titulo: 'Lo que cambia',
      lista: [
        { titulo: 'Nada se cae', cuerpo: 'Cada prospecto tiene su etapa y su próxima tarea.' },
        { titulo: 'Cotizas en minutos', cuerpo: 'La cotización sale de datos que ya están capturados.' },
        { titulo: 'Tu equipo ve lo mismo', cuerpo: 'La información deja de vivir en un solo teléfono.' },
        { titulo: 'Sabes dónde estás', cuerpo: 'Cuántas oportunidades hay y cuánto valen.' },
      ],
    },

    automatizacion: {
      titulo: 'Y lo que se puede automatizar',
      entrada:
        'Automatizar es quitarte de encima lo que haces igual todos los días. No es magia: es decidir una vez qué debe pasar y que pase solo.',
      ejemplos: [
        'Entra una solicitud por tu web y aparece sola como prospecto.',
        'Se manda el correo de seguimiento sin que te acuerdes.',
        'Se genera el contrato con los datos de la cotización.',
        'Te llega un aviso cuando un prospecto lleva días sin moverse.',
        'Se actualiza tu hoja de cálculo sin que nadie la toque.',
        'Recibes el resumen del día en WhatsApp o en el correo.',
      ],
    },

    niveles: {
      titulo: 'Cuánto cuesta',
      entrada: 'Mensualidad más implementación inicial, igual que el punto de venta y por las mismas razones.',
      planes: ['crm', 'ecosistema'],
    },

    faq: [
      {
        q: 'Mi negocio es chico, ¿de verdad necesito un CRM?',
        a: 'Si vendes por cotización o por seguimiento y ya se te ha caído alguna venta por olvido, sí. Si vendes de mostrador y cobras al momento, probablemente te sirve más un punto de venta. Te lo digo con honestidad cuando me cuentes cómo vendes.',
      },
      {
        q: '¿Tengo que capturar todo a mano al principio?',
        a: 'No necesariamente. Parte de la implementación es migrar lo que ya tengas, aunque esté en Excel o en una libreta. Lo que no se pueda migrar se captura, y eso lo contemplo en la cotización.',
      },
      {
        q: '¿Se conecta con lo que ya uso?',
        a: 'Según el caso. Correo, hojas de cálculo, WhatsApp y tu página web son las conexiones más comunes. Antes de prometerte una integración reviso que la herramienta lo permita.',
      },
      {
        q: '¿Y si solo quiero automatizar una cosa, sin CRM?',
        a: 'También se puede. Hay negocios a los que solo les hace falta que un proceso concreto deje de ser manual. Eso se cotiza como proyecto, no como mensualidad.',
      },
    ],

    proyectos: ['jch-crm', 'jch-portal-cliente', 'pasteleria-confetti'],

    cierre: {
      titulo: 'Cuéntame cómo vendes hoy',
      cuerpo: 'Con saber cómo llegan tus clientes y qué pasa después, te digo si necesitas un CRM completo o solo automatizar dos cosas.',
      servicio: 'crm',
    },
  },

  /* ---------------------------------------------------------- */
  [RUTAS.softwareAMedida]: {
    id: 'software',
    acento: '#f5a524',
    pista: 'Toca «Unificar» y mira qué sustituye.',
    seo: {
      title: 'Software a medida para empresas | Morphiq',
      description:
        'Desarrollo de aplicaciones de escritorio, web y móviles hechas desde cero para un problema concreto de tu negocio, cuando ningún programa del mercado encaja.',
    },
    migas: [
      { nombre: 'Inicio', path: RUTAS.inicio },
      { nombre: 'Servicios', path: RUTAS.servicios },
      { nombre: 'Software a medida', path: RUTAS.softwareAMedida },
    ],
    schema: {
      tipo: 'Desarrollo de software a medida',
      descripcion:
        'Desarrollo de aplicaciones de escritorio, web y móviles a la medida para procesos que no resuelve el software comercial.',
    },

    hero: {
      eyebrow: 'Servicio 04 · Herramienta propia',
      titulo: 'Cuando ningún programa hace lo que necesitas.',
      resalte: 'lo que necesitas',
      entrada:
        'Hay procesos que no caben en un producto de catálogo. Si ya probaste tres opciones y en todas acabas exportando a Excel, ese es el síntoma.',
      servicio: 'software',
    },

    problemas: {
      titulo: 'Cuándo tiene sentido mandar a hacer software',
      lista: [
        'Pagas dos o tres herramientas y ninguna hace del todo lo que necesitas.',
        'Tu proceso es tu ventaja y ningún programa comercial lo respeta.',
        'Acabas exportando a Excel para hacer a mano lo que falta.',
        'Necesitas que funcione sin internet, o en una máquina concreta.',
        'Lo que quieres simplemente no existe.',
      ],
      nota: 'Y cuándo NO: si un producto del mercado te resuelve el 90%, te conviene ese producto. Te lo voy a decir aunque signifique no venderte un proyecto.',
    },

    proceso: {
      titulo: 'Cómo se construye',
      pasos: [
        { titulo: 'Entender el problema', cuerpo: 'Qué haces hoy, paso a paso, y dónde se rompe.' },
        { titulo: 'Definir el alcance', cuerpo: 'Qué entra en la primera versión y qué puede esperar.' },
        { titulo: 'Construir por partes', cuerpo: 'Ves algo funcionando pronto, no al final.' },
        { titulo: 'Probar con tu operación real', cuerpo: 'Con tus datos y tu gente, no en una demo.' },
        { titulo: 'Entregar y acompañar', cuerpo: 'Capacitación y los ajustes que salen al usarlo.' },
      ],
    },

    capacidades: {
      titulo: 'Qué se puede construir',
      entrada: 'Lo que corre en una pantalla, se puede construir. La pregunta útil es si conviene.',
      grupos: [
        {
          nombre: 'Dónde vive',
          items: [
            'Aplicaciones de escritorio para Windows',
            'Aplicaciones web a las que entras desde el navegador',
            'Herramientas internas para tu equipo',
            'Portales para tus clientes',
            'Aplicaciones que funcionan sin internet',
          ],
        },
        {
          nombre: 'Qué puede hacer',
          items: [
            'Automatizar un proceso manual completo',
            'Conectar herramientas que hoy no se hablan',
            'Procesar y ordenar información',
            'Generar documentos y reportes',
            'Controlar equipo o dispositivos',
          ],
        },
      ],
    },

    faq: [
      {
        q: '¿Cuánto cuesta un software a medida?',
        a: 'Depende completamente del alcance, así que no publico un precio de partida: sería inventarlo. Lo que sí hago es cotizarlo cerrado antes de empezar, después de entender el problema. Si es un proyecto grande, se puede partir en fases para que no pagues todo de golpe.',
      },
      {
        q: '¿El código es mío?',
        a: 'Sí. Es tu herramienta. Te entrego el código y queda a tu nombre.',
      },
      {
        q: '¿Qué pasa si a medio camino cambia lo que necesito?',
        a: 'Pasa siempre, y por eso construyo por partes y te enseño avances. Los cambios dentro del alcance acordado entran; los que amplían el alcance se cotizan aparte y lo hablamos antes, no en la factura.',
      },
      {
        q: '¿Quién le da mantenimiento después?',
        a: 'Puedo yo, con un acuerdo de soporte, o puedes llevártelo con tu equipo. El código queda documentado para que eso sea posible de verdad, no en teoría.',
      },
    ],

    proyectos: ['glyphos', 'gestech', 'mh-photo-booth'],

    cierre: {
      titulo: 'Cuéntame qué necesitas que exista',
      cuerpo: 'Explícamelo como se lo explicarías a un amigo. Si lo puedes explicar, lo puedo construir, y si no te conviene construirlo, te lo digo.',
      servicio: 'software',
    },
  },

  /* ---------------------------------------------------------- */
  /* Facturación automática. Es el único servicio que se vende igual solo que
     pegado a otro: se puede conectar al punto de venta, a la tienda en línea
     o al restaurante, y también contratarse a secas. Por eso el texto habla
     todo el rato de «donde ya vendes» en vez de describir un producto
     cerrado.

     NO LLEVA BLOQUE `niveles`, y es a propósito. El precio depende del
     negocio —no cuesta lo mismo una sucursal que ocho, ni un negocio que
     empieza que uno con años de operación—, así que publicar un «desde»
     sería inventarlo. Es el mismo precedente que `software a medida`, que
     tampoco lo lleva. */
  [RUTAS.facturacion]: {
    id: 'facturacion',
    acento: '#4fd46a',
    pista: 'Factura el ticket y mira salir el PDF y el XML.',
    seo: {
      title: 'Facturación automática para negocios | Morphiq',
      description:
        'Facturación electrónica conectada a tu punto de venta, tu tienda en línea o tu restaurante. El ticket se vuelve factura con su PDF y su XML, sin capturar los datos dos veces.',
    },
    migas: [
      { nombre: 'Inicio', path: RUTAS.inicio },
      { nombre: 'Servicios', path: RUTAS.servicios },
      { nombre: 'Facturación automática', path: RUTAS.facturacion },
    ],
    schema: {
      tipo: 'Facturación electrónica automatizada',
      descripcion:
        'Integración de facturación electrónica con el punto de venta, la tienda en línea o el sistema del negocio, para emitir comprobantes sin capturar los datos otra vez.',
    },

    hero: {
      eyebrow: 'Servicio 06 · Complemento',
      titulo: 'El ticket se vuelve factura solo.',
      resalte: 'factura solo',
      entrada:
        'Se conecta a donde ya vendes —el punto de venta, la tienda en línea, el restaurante— y de ahí sale el comprobante. También se puede hacer solo, si lo único que te duele es facturar.',
      servicio: 'facturacion',
    },

    quees: {
      titulo: '¿Qué significa «automática»?',
      cuerpo:
        'Que los datos de la venta ya están en el sistema, así que nadie los vuelve a teclear. El cliente pide factura con su folio, y el comprobante se genera, se timbra y le llega con su PDF y su XML.',
      remate: 'Lo que hoy son diez minutos y un portal abierto, pasa a ser un botón.',
    },

    problemas: {
      titulo: '¿Alguna de estas te suena?',
      lista: [
        'Facturas a mano, en el portal, con el cliente esperando enfrente.',
        'Alguien teclea el RFC y una letra mal obliga a cancelar y rehacer.',
        'Te piden factura de una venta de hace tres semanas y hay que buscar el ticket.',
        'Cierras el mes y no cuadra lo facturado con lo vendido.',
        'La persona que sabe facturar se va de vacaciones y el negocio se detiene.',
      ],
      nota: 'Y si tu negocio factura tres veces al mes, no necesitas esto: necesitas diez minutos. Te lo voy a decir aunque signifique no venderte un proyecto.',
    },

    capacidades: {
      titulo: 'Dónde se puede conectar',
      entrada:
        'La facturación no es una isla: vive pegada a donde ocurre la venta. Estas son las puertas por las que entra.',
      grupos: [
        {
          nombre: 'De dónde sale la venta',
          items: [
            'Del punto de venta, al cerrar el ticket',
            'De la tienda en línea, al confirmar el pedido',
            'Del restaurante, al cerrar la cuenta de la mesa',
            'De una pantalla propia, si prefieres capturarla ahí',
            'De un folio que el cliente escribe en tu página',
          ],
        },
        {
          nombre: 'Qué queda resuelto',
          items: [
            'Comprobante con su PDF y su XML',
            'Envío por correo al cliente, sin reenviarlo a mano',
            'Registro de lo facturado junto a lo vendido',
            'Facturación de una venta pasada, buscándola por folio',
            'Cancelaciones y sustituciones cuando toca',
          ],
        },
      ],
    },

    faq: [
      {
        q: '¿Cuánto cuesta?',
        a: 'Se cotiza, y no es por no querer decirlo: depende del negocio. No cuesta lo mismo conectarlo a una sucursal que a ocho, ni a un sistema que ya existe que a uno que hay que hacer. Publicar un «desde» aquí sería inventarlo. Cuéntame cómo vendes hoy y te doy un número cerrado.',
      },
      {
        q: '¿Tengo que contratar también un sistema contigo?',
        a: 'No. Si ya tienes punto de venta o tienda en línea, se conecta a lo que tienes, siempre que permita conectarse; eso lo reviso antes de cotizar. Y si no tienes nada todavía, sale más barato hacerlo junto con el sistema que después por separado.',
      },
      {
        q: '¿Y el timbrado ante el SAT?',
        a: 'El timbrado lo hace un proveedor autorizado por el SAT, que es como funciona la facturación electrónica en México para todo el mundo. Lo que yo construyo es lo que lleva tu venta hasta ahí y trae de vuelta el comprobante, sin que nadie capture nada.',
      },
      {
        q: '¿Qué pasa si el cliente pide factura días después?',
        a: 'Se busca la venta por su folio y se factura desde ahí, con los datos que ya estaban. Ese es justo el caso que hoy obliga a alguien a ponerse a buscar tickets.',
      },
    ],

    cierre: {
      titulo: 'Cuéntame cómo facturas hoy',
      cuerpo: 'Con saber cómo vendes y cuántas facturas emites al mes me alcanza para decirte si te conviene automatizarlo o todavía no.',
      servicio: 'facturacion',
    },
  },

  /* ---------------------------------------------------------- */
  [RUTAS.restaurantes]: {
    id: 'restaurantes',
    acento: '#36d7d1',
    pista: 'Pide algo del menú y velo entrar a cocina.',
    vertical: true,
    seo: {
      title: 'Soluciones digitales para restaurantes | Morphiq',
      description:
        'Página web, menú digital con QR, punto de venta, pedidos y CRM para restaurantes en CDMX. Un solo ecosistema para el menú, la caja y tus clientes.',
    },
    migas: [
      { nombre: 'Inicio', path: RUTAS.inicio },
      /* Decía «Soluciones» y llevaba a /servicios. Una miga cuyo nombre no
         coincide con su destino es la que Search Console marca como
         inconsistente, y además desorienta a quien la lee. */
      { nombre: 'Servicios', path: RUTAS.servicios },
      { nombre: 'Restaurantes', path: RUTAS.restaurantes },
    ],
    schema: {
      tipo: 'Digitalización de restaurantes',
      descripcion:
        'Página web, menú digital con código QR, punto de venta, pedidos y CRM para restaurantes, cafeterías y cocinas.',
    },

    hero: {
      eyebrow: 'Solución por industria',
      titulo: 'Tu restaurante, ordenado por dentro y por fuera.',
      resalte: 'por dentro y por fuera',
      entrada:
        'El menú que el cliente escanea, la comanda que entra a cocina y el corte del día no deberían ser tres mundos distintos.',
      servicio: 'restaurante',
    },

    problemas: {
      titulo: 'Lo que pasa en casi todos los restaurantes',
      lista: [
        'Sube el aguacate, cambias el precio, y hay que reimprimir todos los menús.',
        'La comanda se pierde entre la mesa y la cocina.',
        'Al cerrar, nadie sabe qué platillo se vendió más.',
        'La gente busca tu menú en Google y encuentra una foto borrosa de 2021.',
        'Los clientes frecuentes no están en ningún lado.',
      ],
    },

    ecosistema: {
      titulo: 'Las piezas',
      entrada: 'Se pueden contratar por separado, pero funcionan mejor juntas. Ahí está la gracia.',
      piezas: [
        {
          nombre: 'Página web',
          cuerpo: 'Tu restaurante en internet, con fotos que dan hambre, ubicación y horarios.',
        },
        {
          nombre: 'Menú digital con QR',
          cuerpo: 'El cliente escanea y ve el menú de hoy. Sin app que descargar.',
        },
        {
          nombre: 'Menú que editas tú',
          cuerpo: 'Cambias un precio, agotas un platillo o subes la sugerencia del día desde el teléfono.',
        },
        {
          nombre: 'Punto de venta',
          cuerpo: 'Cobro, mesas, cuentas divididas y corte de caja al cerrar.',
        },
        {
          nombre: 'Pedidos y cocina',
          cuerpo: 'La comanda entra directo a cocina y se ve en pantalla.',
        },
        {
          nombre: 'Clientes y promociones',
          cuerpo: 'Quién viene seguido, qué pide y a quién le mandas la promoción del martes.',
        },
      ],
    },

    aviso: {
      titulo: 'Sobre la facturación automática',
      cuerpo:
        'Se puede integrar, pero depende del alcance del proyecto y del proveedor fiscal que se use. No te voy a prometer cumplimiento fiscal antes de revisar tu caso concreto: es de esas cosas donde prometer de más sale caro para los dos.',
    },

    niveles: {
      titulo: 'Cuánto cuesta',
      entrada: 'Depende de qué piezas necesites. Estas son las referencias.',
      planes: ['restaurantes', 'pos', 'webProfesional'],
    },

    faq: [
      {
        q: '¿Puedo empezar solo con el menú QR?',
        a: 'Sí, y para muchos restaurantes es por donde conviene empezar. El menú QR con panel para editarlo entra dentro de una web profesional. El punto de venta se puede sumar después sin rehacer nada.',
      },
      {
        q: '¿El menú QR necesita que el cliente descargue algo?',
        a: 'No. Escanea con la cámara y se abre en el navegador, como cualquier página.',
      },
      {
        q: '¿Sirve si tengo dos sucursales?',
        a: 'Sí. El punto de venta puede manejar varias sucursales en un solo tablero, con su menú y sus precios propios si hace falta. Ya lo hice así con una pastelería de tres sucursales.',
      },
      {
        q: '¿Y la facturación?',
        a: 'Se puede integrar según el alcance y el proveedor fiscal. Lo reviso contigo antes de incluirlo en la propuesta, para no prometerte algo que dependa de una integración que todavía no verifiqué.',
      },
    ],

    proyectos: ['pasteleria-confetti'],

    cierre: {
      titulo: 'Cuéntame de tu restaurante',
      cuerpo: 'Cuántas mesas, cuántas sucursales y qué te está costando más trabajo hoy. Con eso te digo por dónde empezar.',
      servicio: 'restaurante',
    },
  },
};
