/**
 * Genera dist/sitemap.xml con TODAS las rutas del sitio.
 *
 * Las rutas salen de los mismos módulos que usan el router y el generador de
 * HTML por página, así que no pueden desincronizarse: si una página existe,
 * está en el sitemap, y si no existe, no aparece.
 *
 * El `lastmod` de cada URL sale del último commit que tocó LOS ARCHIVOS DE
 * ESA PÁGINA, no del último commit del repositorio. Google solo hace caso al
 * lastmod cuando lo ve consistente; diecisiete URLs con la misma fecha le
 * dicen que la fecha no significa nada y deja de mirarla.
 *
 * Pase lo que pase esto no tumba el build: un sitio sin sitemap se indexa
 * igual, solo que más despacio.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = resolve(process.cwd(), 'dist');
const importar = (rel) => import(pathToFileURL(resolve(rel)).href);

/**
 * Fecha del último commit que tocó ALGUNO de estos archivos.
 *
 * Sin argumentos devuelve la del último commit del repositorio, que es el
 * comodín cuando no se sabe qué archivos alimentan una ruta.
 *
 * Por qué importa: un sitemap donde las diecisiete URLs comparten `lastmod`
 * le dice a Google que el sitio entero cambia a la vez, o sea nada. Google
 * solo hace caso al `lastmod` cuando lo ve consistente con lo que se
 * publica; en cuanto deja de creérselo, lo ignora en todo el sitemap. Con la
 * fecha de los archivos que de verdad componen cada página, las que
 * cambiaron se distinguen de las que llevan meses quietas, y volver a
 * rastrear una página tocada deja de competir con otras dieciséis.
 */
function fechaDeCommit(archivos = []) {
  try {
    const salida = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...archivos], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(salida) ? salida : null;
  } catch {
    return null;
  }
}

/* Qué archivos componen cada ruta. Los comunes —el diseño, los tokens, el
   pie— quedan fuera a propósito: si entraran, tocar una hoja de estilos
   volvería a poner la misma fecha en todas las URLs, que es el problema que
   esto viene a resolver. */
const FUENTES = {
  '/': ['src/paginas/Inicio.jsx', 'src/content/index.js'],
  '/servicios': ['src/paginas/Servicios.jsx', 'src/content/servicios.js'],
  '/servicios/paginas-web': ['src/paginas/ServicioDetalle.jsx', 'src/content/servicios.js'],
  '/servicios/sistemas': ['src/paginas/ServicioDetalle.jsx', 'src/content/servicios.js'],
  '/servicios/crm-automatizacion': ['src/paginas/ServicioDetalle.jsx', 'src/content/servicios.js'],
  '/servicios/software-a-medida': ['src/paginas/ServicioDetalle.jsx', 'src/content/servicios.js'],
  '/soluciones/restaurantes': ['src/paginas/ServicioDetalle.jsx', 'src/content/servicios.js'],
  '/proyectos': ['src/paginas/Proyectos.jsx', 'src/content/proyectos.js'],
  '/precios': ['src/paginas/Precios.jsx', 'src/content/index.js'],
  '/sobre-morphiq': ['src/paginas/Sobre.jsx', 'src/content/index.js'],
  '/contacto': ['src/paginas/Contacto.jsx'],
};

async function main() {
  if (!existsSync(DIST)) {
    console.warn('[sitemap] no hay dist/; me salto el paso');
    return;
  }

  const { RUTAS, DOMINIO, PRIORIDAD } = await importar('src/config/rutas.js');
  const { PROYECTOS } = await importar('src/content/proyectos.js');

  const hoy = new Date().toISOString().slice(0, 10);
  const respaldo = fechaDeCommit() ?? hoy;
  const fechaDe = (archivos) => fechaDeCommit(archivos) ?? respaldo;

  /* Todas las fichas de proyecto salen del mismo archivo de contenido y de
     la misma plantilla, así que comparten fecha, y es la correcta: cuando se
     añade o se reescribe un caso, se toca ese archivo. */
  const fechaCasos = fechaDe(['src/content/proyectos.js', 'src/paginas/ProyectoDetalle.jsx']);

  const entradas = [
    ...Object.values(RUTAS).map((path) => ({
      path,
      lastmod: fechaDe(FUENTES[path] ?? []),
      priority: PRIORIDAD[path] ?? '0.6',
      changefreq: path === RUTAS.inicio ? 'weekly' : 'monthly',
    })),
    /* Las fichas de proyecto cambian poco: son casos cerrados. */
    ...PROYECTOS.map((p) => ({
      path: `${RUTAS.proyectos}/${p.slug}`,
      lastmod: fechaCasos,
      priority: '0.6',
      changefreq: 'yearly',
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entradas
  .map(
    (e) => `  <url>
    <loc>${DOMINIO}${e.path === '/' ? '/' : e.path}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  writeFileSync(join(DIST, 'sitemap.xml'), xml);
  const fechas = new Set(entradas.map((e) => e.lastmod));
  console.log(`[sitemap] ${entradas.length} URLs · ${fechas.size} fechas distintas · más reciente ${[...fechas].sort().pop()}`);
}

try {
  await main();
} catch (error) {
  console.warn('[sitemap] no pude generar el sitemap:', error.message);
}
