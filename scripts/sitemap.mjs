/**
 * Genera dist/sitemap.xml con TODAS las rutas del sitio.
 *
 * Las rutas salen de los mismos módulos que usan el router y el generador de
 * HTML por página, así que no pueden desincronizarse: si una página existe,
 * está en el sitemap, y si no existe, no aparece.
 *
 * El `lastmod` sale del último commit, que es cuando cambió el contenido de
 * verdad. Google solo hace caso al lastmod cuando comprueba que es de fiar;
 * una fecha escrita a mano deja de serlo en cuanto se publica algo.
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

function fechaDelUltimoCommit() {
  try {
    const salida = execFileSync('git', ['log', '-1', '--format=%cs'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(salida) ? salida : null;
  } catch {
    return null;
  }
}

async function main() {
  if (!existsSync(DIST)) {
    console.warn('[sitemap] no hay dist/; me salto el paso');
    return;
  }

  const { RUTAS, DOMINIO, PRIORIDAD } = await importar('src/config/rutas.js');
  const { PROYECTOS } = await importar('src/content/proyectos.js');

  const origen = fechaDelUltimoCommit();
  const lastmod = origen ?? new Date().toISOString().slice(0, 10);

  const entradas = [
    ...Object.values(RUTAS).map((path) => ({
      path,
      priority: PRIORIDAD[path] ?? '0.6',
      changefreq: path === RUTAS.inicio ? 'weekly' : 'monthly',
    })),
    /* Las fichas de proyecto cambian poco: son casos cerrados. */
    ...PROYECTOS.map((p) => ({
      path: `${RUTAS.proyectos}/${p.slug}`,
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
    <lastmod>${lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  writeFileSync(join(DIST, 'sitemap.xml'), xml);
  console.log(`[sitemap] ${entradas.length} URLs · lastmod ${lastmod} (${origen ? 'último commit' : 'fecha del build'})`);
}

try {
  await main();
} catch (error) {
  console.warn('[sitemap] no pude generar el sitemap:', error.message);
}
