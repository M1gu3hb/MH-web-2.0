/**
 * ============================================================
 * UN HTML DE VERDAD POR CADA RUTA
 * ============================================================
 *
 * EL PROBLEMA
 * Una aplicación de React sirve el mismo HTML vacío para todas las rutas.
 * Google sabe ejecutar el JS y lo hace bien, pero eso mete la página en una
 * cola de renderizado; y el resto de rastreadores —redes sociales al
 * compartir un enlace, buscadores pequeños, rastreadores de IA— no ejecutan
 * nada y ven una página en blanco. Doce URLs con el mismo title y la misma
 * description es, además, exactamente el patrón que Search Console reporta
 * como contenido duplicado.
 *
 * LA SOLUCIÓN
 * Al terminar el build, este script escribe dist/<ruta>/index.html para cada
 * ruta, partiendo del index.html que generó Vite y sustituyendo:
 *   · title, description y canonical
 *   · Open Graph y Twitter
 *   · el grafo JSON-LD de esa página, con sus migas
 *   · un resumen legible dentro de <noscript>
 *
 * NO se hace con un navegador headless a propósito: Vercel no tiene uno y
 * añadirlo costaría cien megas de dependencia para conseguir lo mismo. Los
 * datos salen de los mismos módulos que usa la web, importados directamente,
 * así que no pueden desincronizarse del contenido real.
 *
 * El cuerpo lo sigue pintando React. Lo que este script garantiza es que la
 * PRIMERA respuesta de cada URL ya diga quién es, de qué va y a dónde lleva.
 *
 * Si algo falla no se rompe el build: se avisa y el sitio se publica igual.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = resolve(process.cwd(), 'dist');

const importar = (rel) => import(pathToFileURL(resolve(rel)).href);

function escapar(s = '') {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ------------------------------------------------------------
   Construcción del <head> de cada ruta
   ------------------------------------------------------------ */

function cabecera({ dominio, path, title, description, image, grafo }) {
  const url = `${dominio}${path === '/' ? '/' : path}`;
  const img = image ?? `${dominio}/og-morphiq.jpg`;
  return [
    `<title>${escapar(title)}</title>`,
    `<meta name="description" content="${escapar(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${escapar(title)}" />`,
    `<meta property="og:description" content="${escapar(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta name="twitter:title" content="${escapar(title)}" />`,
    `<meta name="twitter:description" content="${escapar(description)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    grafo?.length
      ? `<script type="application/ld+json" data-seo-ruta>${JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': grafo,
        })}</script>`
      : '',
  ]
    .filter(Boolean)
    .join('\n    ');
}

/**
 * Sustituye en el HTML base las etiquetas que cambian por ruta.
 * `robots` solo se pasa en el 404: cuando llega, las directivas del HTML
 * base se eliminan antes, porque dos meta robots contradictorias en la
 * misma página son una ambigüedad que no hay razón para dejar ahí.
 */
function aplicar(base, head, noscript, robots) {
  let html = base;
  if (robots) {
    html = html.replace(/\s*<meta name="(robots|googlebot)"[^>]*\/>/g, '');
  }
  html = html.replace(/<title>[\s\S]*?<\/title>/, '@@TITLE@@');
  html = html.replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, '');
  html = html.replace(/\s*<link rel="canonical"[^>]*\/>/, '');
  html = html.replace(/\s*<meta property="og:(title|description|url|image)"[^>]*\/>/g, '');
  html = html.replace(/\s*<meta\s+name="twitter:(title|description|image)"[\s\S]*?\/>/g, '');
  html = html.replace('@@TITLE@@', head);
  if (noscript) html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, noscript);
  return html;
}

function bloqueNoscript(titulo, entrada, enlaces, extra = '') {
  return `<noscript>
      <h1>${escapar(titulo)}</h1>
      <p>${escapar(entrada)}</p>
      ${extra}
      <h2>Ir a</h2>
      <ul>
        ${enlaces.map((e) => `<li><a href="${e.href}">${escapar(e.texto)}</a></li>`).join('\n        ')}
      </ul>
      <p>Morphiq (Astral Morphiq Systems) · Xochimilco, CDMX · <a href="mailto:contacto@morphiq.com.mx">contacto@morphiq.com.mx</a> · <a href="https://wa.me/525523118153">WhatsApp +52 55 2311 8153</a></p>
    </noscript>`;
}

/* ------------------------------------------------------------ */

async function main() {
  const baseRuta = join(DIST, 'index.html');
  if (!existsSync(baseRuta)) {
    console.warn('[paginas] no hay dist/index.html; me salto el paso');
    return;
  }
  const base = readFileSync(baseRuta, 'utf8');

  /* Qué trozo de JavaScript necesita cada ruta.
     Se precarga en su propio HTML con modulepreload para que, cuando React
     monte, el módulo de la página ya esté en memoria y Suspense resuelva sin
     pintar el hueco. Sin esto el hueco mide distinto que la página real y
     todo lo que va debajo se recoloca al llegar el trozo: 0.3 de CLS
     medidos en /precios, tres veces el umbral. */
  let manifiesto = {};
  try {
    manifiesto = JSON.parse(readFileSync(join(DIST, '.vite/manifest.json'), 'utf8'));
  } catch {
    console.warn('[paginas] sin manifiesto: las rutas no precargarán su trozo');
  }

  const trozoDe = (modulo) => {
    const entrada = manifiesto[`src/paginas/${modulo}.jsx`];
    if (!entrada) return [];
    /* El propio trozo más aquello de lo que dependa, para no encadenar
       peticiones en cascada. */
    return [entrada.file, ...(entrada.imports ?? []).map((k) => manifiesto[k]?.file).filter(Boolean)];
  };

  const precargar = (modulo) =>
    trozoDe(modulo)
      .map((f) => `<link rel="modulepreload" crossorigin href="/${f}" />`)
      .join('\n    ');

  const { RUTAS, DOMINIO, MENU } = await importar('src/config/rutas.js');
  const { PAGINAS_SERVICIO, SERVICIOS } = await importar('src/content/servicios.js');
  const { PROYECTOS } = await importar('src/content/proyectos.js');
  const { PLANES, precioEnLinea } = await importar('src/config/pricing.js');

  const org = { '@id': `${DOMINIO}/#organizacion` };
  const sitio = { '@id': `${DOMINIO}/#sitio` };

  const nodoPagina = (path, title, description) => {
    const url = `${DOMINIO}${path === '/' ? '/' : path}`;
    return {
      '@type': 'WebPage',
      '@id': `${url}#pagina`,
      url,
      name: title,
      description,
      inLanguage: 'es-MX',
      isPartOf: sitio,
      about: org,
    };
  };

  const nodoMigas = (ruta) => ({
    '@type': 'BreadcrumbList',
    '@id': `${DOMINIO}${ruta[ruta.length - 1].path}#migas`,
    itemListElement: ruta.map((paso, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: paso.nombre,
      item: `${DOMINIO}${paso.path === '/' ? '/' : paso.path}`,
    })),
  });

  const enlacesPrincipales = MENU.flatMap((e) =>
    e.hijos ? [{ href: e.href, texto: e.etiqueta }, ...e.hijos.map((h) => ({ href: h.href, texto: h.etiqueta }))] : [{ href: e.href, texto: e.etiqueta }]
  );

  /* ---- El catálogo de páginas a escribir ---- */
  const paginas = [];

  /* Servicios (índice) */
  paginas.push({
    path: RUTAS.servicios,
    modulo: 'Servicios',
    title: 'Servicios: web, sistemas, CRM y software | Morphiq',
    description:
      'Todo lo que Morphiq construye para negocios: páginas web, punto de venta, CRM y automatización, software a medida y soluciones para restaurantes. Con precios de partida.',
    migas: [
      { nombre: 'Inicio', path: RUTAS.inicio },
      { nombre: 'Servicios', path: RUTAS.servicios },
    ],
    noscript: bloqueNoscript(
      'Servicios de Morphiq',
      'Páginas web, sistemas para negocios, CRM y automatización, software a medida y soluciones para restaurantes.',
      SERVICIOS.map((s) => ({ href: s.ruta, texto: `${s.nombre}: ${s.promesa}` }))
    ),
  });

  /* Las cinco páginas de servicio */
  for (const [ruta, p] of Object.entries(PAGINAS_SERVICIO)) {
    paginas.push({
      path: ruta,
      modulo: 'ServicioDetalle',
      title: p.seo.title,
      description: p.seo.description,
      migas: p.migas,
      extra: [
        {
          '@type': 'Service',
          '@id': `${DOMINIO}/#servicio-${p.id}`,
          name: p.hero.titulo,
          serviceType: p.schema.tipo,
          description: p.schema.descripcion,
          url: `${DOMINIO}${ruta}`,
          provider: org,
          areaServed: [
            { '@type': 'City', name: 'Ciudad de México' },
            { '@type': 'Country', name: 'México' },
          ],
        },
        ...(p.faq?.length
          ? [
              {
                '@type': 'FAQPage',
                '@id': `${DOMINIO}${ruta}#preguntas`,
                inLanguage: 'es-MX',
                mainEntity: p.faq.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              },
            ]
          : []),
      ],
      noscript: bloqueNoscript(
        p.hero.titulo,
        p.hero.entrada,
        enlacesPrincipales,
        p.capacidades
          ? `<h2>Qué incluye</h2><ul>${p.capacidades.grupos
              .flatMap((g) => g.items)
              .map((i) => `<li>${escapar(i)}</li>`)
              .join('')}</ul>`
          : ''
      ),
    });
  }

  /* Proyectos */
  paginas.push({
    path: RUTAS.proyectos,
    modulo: 'Proyectos',
    title: 'Proyectos: sitios y sistemas construidos | Morphiq',
    description:
      'Páginas web, puntos de venta, CRM y software que he construido para negocios reales. Cada caso con su problema, su solución y su enlace.',
    migas: [
      { nombre: 'Inicio', path: RUTAS.inicio },
      { nombre: 'Proyectos', path: RUTAS.proyectos },
    ],
    extra: [
      {
        '@type': 'ItemList',
        '@id': `${DOMINIO}${RUTAS.proyectos}#lista`,
        numberOfItems: PROYECTOS.length,
        itemListElement: PROYECTOS.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.nombre,
          url: `${DOMINIO}${RUTAS.proyectos}/${p.slug}`,
        })),
      },
    ],
    noscript: bloqueNoscript(
      'Proyectos de Morphiq',
      'Negocios que ya funcionan con lo que construí. Están en línea y los puedes abrir.',
      PROYECTOS.map((p) => ({ href: `${RUTAS.proyectos}/${p.slug}`, texto: `${p.nombre} — ${p.tipo}` }))
    ),
  });

  /* Cada proyecto */
  for (const p of PROYECTOS) {
    const ruta = `${RUTAS.proyectos}/${p.slug}`;
    paginas.push({
      path: ruta,
      modulo: 'ProyectoDetalle',
      title: `${p.nombre}: ${p.tipo} | Morphiq`,
      description: p.resumen,
      image: `${DOMINIO}${p.imagen}`,
      migas: [
        { nombre: 'Inicio', path: RUTAS.inicio },
        { nombre: 'Proyectos', path: RUTAS.proyectos },
        { nombre: p.nombre, path: ruta },
      ],
      extra: [
        {
          '@type': 'CreativeWork',
          '@id': `${DOMINIO}${ruta}#caso`,
          name: p.nombre,
          description: p.resumen,
          url: `${DOMINIO}${ruta}`,
          image: `${DOMINIO}${p.imagen}`,
          creator: org,
          inLanguage: 'es-MX',
        },
      ],
      noscript: bloqueNoscript(
        `${p.nombre} — ${p.tipo}`,
        `${p.contexto} ${p.objetivo}`,
        enlacesPrincipales,
        `<h2>Qué se construyó</h2><ul>${p.construido.map((c) => `<li>${escapar(c)}</li>`).join('')}</ul>`
      ),
    });
  }

  /* Precios */
  paginas.push({
    path: RUTAS.precios,
    modulo: 'Precios',
    title: 'Precios: páginas web desde $2,000 MXN | Morphiq',
    description:
      'Precios de partida para páginas web, punto de venta, CRM, mantenimiento y ecosistemas completos. Todo con «desde» visible y el precio final cerrado antes de empezar.',
    migas: [
      { nombre: 'Inicio', path: RUTAS.inicio },
      { nombre: 'Precios', path: RUTAS.precios },
    ],
    noscript: bloqueNoscript(
      'Precios de Morphiq',
      'Todos los precios son de partida y el final se cierra antes de empezar.',
      enlacesPrincipales,
      `<h2>Planes</h2><ul>${Object.values(PLANES)
        .map((pl) => `<li><strong>${escapar(pl.nombre)}</strong>: ${escapar(precioEnLinea(pl))}. ${escapar(pl.resumen)}</li>`)
        .join('')}</ul>`
    ),
  });

  /* Sobre y contacto */
  paginas.push({
    path: RUTAS.sobre,
    modulo: 'Sobre',
    title: 'Sobre Morphiq: quién está detrás | Morphiq',
    description:
      'Morphiq es el estudio de Miguel Huerta Bautista en CDMX. Diseño y construyo páginas web, sistemas y automatizaciones para negocios. Tratas conmigo, no con una cuenta.',
    migas: [
      { nombre: 'Inicio', path: RUTAS.inicio },
      { nombre: 'Sobre Morphiq', path: RUTAS.sobre },
    ],
    noscript: bloqueNoscript(
      'Sobre Morphiq',
      'Morphiq es el estudio de Miguel Huerta Bautista en la Ciudad de México. Diseño, programo y contesto yo.',
      enlacesPrincipales
    ),
  });

  paginas.push({
    path: RUTAS.contacto,
    modulo: 'Contacto',
    title: 'Contacto: cuéntame tu proyecto | Morphiq',
    description:
      'Cuéntame qué necesita tu negocio y te respondo con una propuesta y un precio cerrado. Por WhatsApp o por correo, como prefieras.',
    migas: [
      { nombre: 'Inicio', path: RUTAS.inicio },
      { nombre: 'Contacto', path: RUTAS.contacto },
    ],
    noscript: bloqueNoscript(
      'Contacto',
      'Cuéntame qué necesita tu negocio y te respondo con una propuesta y un precio cerrado.',
      enlacesPrincipales
    ),
  });

  /* El 404 con marca. Vercel sirve dist/404.html para cualquier URL que no
     exista, y con estado 404 de verdad: así el visitante ve una página del
     sitio desde la que seguir, y Google recibe el código correcto en vez de
     un soft-404 que le haría creer que la URL es válida. */
  const html404 = aplicar(
    base,
    cabecera({
      dominio: DOMINIO,
      path: '/404',
      title: 'Página no encontrada | Morphiq',
      description: 'La página que buscas no existe o cambió de dirección.',
      grafo: null,
    }) + '\n    <meta name="robots" content="noindex, follow" />\n    ' + precargar('NoEncontrada'),
    bloqueNoscript(
      'Esta página no existe',
      'O cambió de sitio. Desde aquí puedes seguir a donde ibas.',
      enlacesPrincipales
    ),
    true
  );
  writeFileSync(join(DIST, '404.html'), html404);

  /* ---- Escritura ---- */
  let escritas = 0;
  for (const pag of paginas) {
    const grafo = [nodoPagina(pag.path, pag.title, pag.description), nodoMigas(pag.migas), ...(pag.extra ?? [])];
    const preload = pag.modulo ? '\n    ' + precargar(pag.modulo) : '';
    const head = cabecera({ dominio: DOMINIO, ...pag, grafo }) + preload;
    const html = aplicar(base, head, pag.noscript);
    const destino = join(DIST, pag.path, 'index.html');
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, html);
    escritas += 1;
  }

  console.log(`[paginas] ${escritas} rutas con su propio HTML, title, canonical y JSON-LD`);
}

try {
  await main();
} catch (error) {
  console.warn('[paginas] no pude generar el HTML por ruta:', error.message);
}
