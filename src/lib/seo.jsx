/**
 * ============================================================
 * SEO POR RUTA
 * ============================================================
 *
 * En index.html se quedan solo las entidades que son del SITIO entero y no
 * cambian nunca: Organization, Person y WebSite. Todo lo que es de UNA
 * página —su WebPage, sus migas, su Service, sus preguntas— lo pone este
 * componente al montar la ruta y lo retira al salir.
 *
 * Por qué imperativo y no una librería de <head>: el build prerenderiza cada
 * ruta con un navegador de verdad y guarda el HTML resultante, así que lo
 * único que importa es que el <head> esté correcto cuando la página se
 * asienta. Añadir una dependencia para eso no compensaba.
 *
 * Todos los nodos que escribe llevan `data-seo` para poder limpiarlos sin
 * tocar lo que venía en el HTML original.
 */

import { useEffect } from 'react';
import { DOMINIO } from '../config/rutas';

const MARCA = 'data-seo';
const IMAGEN_POR_DEFECTO = `${DOMINIO}/og-morphiq.jpg`;

function fijarMeta(selector, attrs) {
  let nodo = document.head.querySelector(selector);
  if (!nodo) {
    nodo = document.createElement(attrs.tag ?? 'meta');
    nodo.setAttribute(MARCA, '');
    document.head.appendChild(nodo);
  }
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'tag' || v == null) continue;
    nodo.setAttribute(k, v);
  }
  return nodo;
}

/**
 * @param {string} title        el <title> completo, ya con la marca
 * @param {string} description  meta description
 * @param {string} path         ruta absoluta del sitio, p. ej. '/precios'
 * @param {string} [image]      URL absoluta de la imagen social
 * @param {Array}  [grafo]      nodos JSON-LD propios de esta página
 * @param {boolean} [noindex]   solo para páginas que no deben indexarse (404)
 */
export function Seo({ title, description, path, image, grafo, noindex = false }) {
  useEffect(() => {
    const url = `${DOMINIO}${path === '/' ? '/' : path}`;
    const img = image ?? IMAGEN_POR_DEFECTO;

    document.title = title;

    fijarMeta('meta[name="description"]', { name: 'description', content: description });
    fijarMeta('link[rel="canonical"]', { tag: 'link', rel: 'canonical', href: url });

    fijarMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    fijarMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    fijarMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    fijarMeta('meta[property="og:image"]', { property: 'og:image', content: img });
    fijarMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    fijarMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    fijarMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: img });

    /* El 404 es la única página que se marca como no indexable. El resto
       hereda el `index, follow` del HTML base. */
    const robots = 'meta[name="robots"]';
    const previo = document.head.querySelector(robots)?.getAttribute('content');
    if (noindex) fijarMeta(robots, { name: 'robots', content: 'noindex, follow' });

    /* El grafo de la página. Se reemplaza entero en cada ruta. */
    let script = document.head.querySelector('script[data-seo-ruta]');
    if (grafo?.length) {
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-ruta', '');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo });
    } else if (script) {
      script.remove();
    }

    return () => {
      if (noindex && previo) fijarMeta(robots, { name: 'robots', content: previo });
    };
  }, [title, description, path, image, grafo, noindex]);

  return null;
}

/* ------------------------------------------------------------
   Constructores de nodos JSON-LD
   ------------------------------------------------------------ */

const ORG = { '@id': `${DOMINIO}/#organizacion` };
const SITIO = { '@id': `${DOMINIO}/#sitio` };

/** La página en sí, colgada del sitio y de la organización. */
export function nodoPagina({ path, title, description }) {
  const url = `${DOMINIO}${path === '/' ? '/' : path}`;
  return {
    '@type': 'WebPage',
    '@id': `${url}#pagina`,
    url,
    name: title,
    description,
    inLanguage: 'es-MX',
    isPartOf: SITIO,
    about: ORG,
    primaryImageOfPage: { '@id': `${DOMINIO}/#logo` },
  };
}

/**
 * Migas de pan. Aquí sí aplican, al contrario que en la versión de una sola
 * página: hay jerarquía real y Google la puede mostrar en resultados.
 * `ruta` es [{ nombre, path }] empezando por Inicio.
 */
export function nodoMigas(ruta) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${DOMINIO}${ruta[ruta.length - 1].path}#migas`,
    itemListElement: ruta.map((paso, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: paso.nombre,
      item: `${DOMINIO}${paso.path === '/' ? '/' : paso.path}`,
    })),
  };
}

/** Un servicio concreto, prestado por la organización. */
export function nodoServicio({ id, nombre, tipo, descripcion, path }) {
  return {
    '@type': 'Service',
    '@id': `${DOMINIO}/#servicio-${id}`,
    name: nombre,
    serviceType: tipo,
    description: descripcion,
    url: `${DOMINIO}${path}`,
    provider: ORG,
    areaServed: [
      { '@type': 'City', name: 'Ciudad de México' },
      { '@type': 'Country', name: 'México' },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${DOMINIO}/contacto`,
    },
  };
}

/**
 * Preguntas frecuentes. Solo se emite cuando las preguntas están VISIBLES
 * en la página: marcar un FAQPage que el visitante no ve es exactamente lo
 * que Google penaliza.
 */
export function nodoPreguntas({ path, preguntas }) {
  return {
    '@type': 'FAQPage',
    '@id': `${DOMINIO}${path}#preguntas`,
    inLanguage: 'es-MX',
    mainEntity: preguntas.map((p) => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: { '@type': 'Answer', text: p.a },
    })),
  };
}

/**
 * Una oferta con precio de partida. `desde` en número, sin formatear.
 *
 * `ancla` es el identificador del plan dentro de la página. Sin él las siete
 * ofertas apuntaban a la misma URL, y siete ofertas con la misma dirección
 * son, para un buscador, siete formas de decir lo mismo: no hay manera de
 * enviar a nadie al plan concreto. Con el ancla, cada una lleva a su bloque.
 */
export function nodoOferta({ nombre, descripcion, desde, path, ancla }) {
  const oferta = {
    '@type': 'Offer',
    name: nombre,
    description: descripcion,
    url: `${DOMINIO}${path}${ancla ? `#${ancla}` : ''}`,
    priceCurrency: 'MXN',
    availability: 'https://schema.org/InStock',
    seller: ORG,
  };
  /* `minPrice` sin `maxPrice` es la forma correcta de declarar un «desde»:
     decir que el precio ES 2000 sería mentir, porque es el punto de partida. */
  if (desde) {
    oferta.priceSpecification = {
      '@type': 'PriceSpecification',
      minPrice: desde,
      priceCurrency: 'MXN',
    };
  }
  return oferta;
}

/** Un proyecto del portfolio. */
export function nodoCaso({ proyecto, path }) {
  return {
    '@type': 'CreativeWork',
    '@id': `${DOMINIO}${path}#caso`,
    name: proyecto.nombre,
    headline: proyecto.nombre,
    description: proyecto.resumen,
    url: `${DOMINIO}${path}`,
    /* Los productos propios no llevan maqueta horneada; sin este resguardo el
       nodo salía con `image: "…/undefined"`, que es peor que no llevar imagen. */
    image: proyecto.imagen ? `${DOMINIO}${proyecto.imagen}` : IMAGEN_POR_DEFECTO,
    creator: ORG,
    inLanguage: 'es-MX',
    about: proyecto.tipo,
  };
}
