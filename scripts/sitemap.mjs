/* Sella el <lastmod> del sitemap al terminar el build.
 *
 * Estaba escrito a mano, así que en cuanto se publicaba un cambio la fecha
 * empezaba a mentir. Google solo hace caso al lastmod cuando comprueba que es
 * de fiar; una fecha congelada es peor que no ponerla.
 *
 * La fecha sale del último commit, que es cuando cambió el contenido de
 * verdad. Si por lo que sea no hay git a mano —un build desde un tarball, por
 * ejemplo— se usa la fecha del propio build, que es la mejor aproximación que
 * queda. Pase lo que pase esto nunca tumba el build: un sitemap con la fecha
 * de ayer sigue siendo un sitemap válido.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ARCHIVO = resolve(process.cwd(), 'dist/sitemap.xml');

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

function main() {
  if (!existsSync(ARCHIVO)) {
    console.warn('[sitemap] no encuentro dist/sitemap.xml; lo dejo como esté');
    return;
  }

  const origen = fechaDelUltimoCommit();
  const fecha = origen ?? new Date().toISOString().slice(0, 10);
  const antes = readFileSync(ARCHIVO, 'utf8');

  if (!/<lastmod>[^<]*<\/lastmod>/.test(antes)) {
    console.warn('[sitemap] el sitemap no tiene <lastmod>; no toco nada');
    return;
  }

  const despues = antes.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${fecha}</lastmod>`);
  if (despues !== antes) writeFileSync(ARCHIVO, despues);
  console.log(`[sitemap] lastmod ${fecha} (${origen ? 'último commit' : 'fecha del build'})`);
}

try {
  main();
} catch (error) {
  console.warn('[sitemap] no pude sellar la fecha:', error.message);
}
