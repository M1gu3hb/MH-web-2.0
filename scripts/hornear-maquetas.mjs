/**
 * ============================================================
 * HORNEA LAS ILUSTRACIONES DE CASO A IMAGEN
 * ============================================================
 *
 * Las maquetas de `src/components/mockups/ProjectVisuals.jsx` se dibujan con
 * HTML y CSS, pero al sitio llegan como .webp. No es por capricho: compuestas
 * en vivo son decenas de nodos con degradados y sombras dentro de un
 * contenedor con scroll, y hay teléfonos donde eso se queda en blanco. Un
 * <img> lo pinta cualquier motor sin discutir, y pesa entre 11 y 20 KB.
 *
 * USO
 *   npm run dev                        (en otra terminal)
 *   node scripts/hornear-maquetas.mjs  [nombre] [nombre] ...
 *
 * Sin argumentos hornea las doce. Con nombres, solo esas.
 *
 * Se fotografía a densidad 2 —o sea a 1520 px— y después se reduce a los 760
 * px del lienzo con remuestreo Lanczos. Fotografiar directamente a 760 deja
 * el texto pequeño y los trazos de 1 px dentados; fotografiar al doble y
 * reducir es supermuestreo, que es lo que les da el filo. Publicar los 1520
 * tampoco sirve: cuadruplica el peso (66 KB frente a 17) para una nitidez
 * que en la tarjeta más grande del índice, de 744 px, no se llega a ver.
 *
 * 760 es además la medida de las siete originales. Mezclar dos resoluciones
 * en la misma retícula se nota: unas se ven más limpias que otras.
 *
 * Se guarda en WebP con calidad 88, que es donde la diferencia con el
 * original deja de verse y el archivo todavía cabe. El PNG intermedio se
 * borra.
 *
 * IMPORTANTE: se fotografía el PRIMER FOTOGRAMA. Cualquier animación de una
 * maqueta tiene que empezar en su estado bueno; si empieza en opacity 0 o
 * desplazada, la foto sale vacía o a medias.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

const exigir = createRequire(import.meta.url);

/* Playwright NO es dependencia del proyecto y no debe serlo: pesa cien megas
   y solo hace falta para hornear, que pasa cada varios meses. Se busca donde
   esté; si no está en ningún lado, se dice cómo conseguirlo en vez de
   escupir un rastro de pila. */
const { chromium } = await (async () => {
  try {
    return await import('playwright');
  } catch {
    /* `require` y no `import`: playwright es CommonJS y su paquete no declara
       exportaciones para ESM, así que un import de la carpeta falla con
       ERR_UNSUPPORTED_DIR_IMPORT. `require` sí sabe leer su package.json. */
    if (process.env.PLAYWRIGHT_MODULE) {
      return exigir(resolve(process.env.PLAYWRIGHT_MODULE));
    }
    console.error('[horno] falta playwright. Una de dos:');
    console.error('        npm i -D playwright');
    console.error('        PLAYWRIGHT_MODULE=/ruta/a/node_modules/playwright node scripts/hornear-maquetas.mjs');
    process.exit(1);
  }
})();

const SALIDA = resolve(process.cwd(), 'public/casos');
/* El ancho final, que es el de las siete maquetas originales. */
const LADO = 760;
const PAGINA = process.env.HORNO_URL ?? 'http://localhost:5173/herramientas/hornear.html';
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const pedidas = process.argv.slice(2);

mkdirSync(SALIDA, { recursive: true });

const navegador = await chromium.launch({
  executablePath: CHROME,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});

/* Densidad 2: las maquetas llevan texto pequeño y trazos de 1 px, y a
   densidad 1 el horneado los redondea y el dibujo pierde el filo. */
const contexto = await navegador.newContext({
  viewport: { width: 1000, height: 900 },
  deviceScaleFactor: 2,
});
const pagina = await contexto.newPage();

const errores = [];
pagina.on('pageerror', (e) => errores.push(String(e).slice(0, 160)));

await pagina.goto(PAGINA, { waitUntil: 'networkidle', timeout: 60000 });
/* Las tres fuentes de marca tienen que estar cargadas antes de la foto: si
   se hornea con la del sistema, el dibujo sale con otra métrica. */
await pagina.evaluate(() => document.fonts.ready);
await pagina.waitForTimeout(1200);

const nombres = await pagina.$$eval('[data-pieza]', (ns) => ns.map((n) => n.dataset.pieza));
const objetivo = pedidas.length ? nombres.filter((n) => pedidas.includes(n)) : nombres;

if (pedidas.length && objetivo.length !== pedidas.length) {
  const faltan = pedidas.filter((p) => !nombres.includes(p));
  console.error(`[horno] no existe ninguna maqueta llamada: ${faltan.join(', ')}`);
  console.error(`[horno] las que hay: ${nombres.join(', ')}`);
  await navegador.close();
  process.exit(1);
}

for (const nombre of objetivo) {
  const pieza = pagina.locator(`[data-pieza="${nombre}"] .project-ui`);
  const png = `${SALIDA}/${nombre}.png`;
  const webp = `${SALIDA}/${nombre}.webp`;
  await pieza.scrollIntoViewIfNeeded();
  await pagina.waitForTimeout(280);
  await pieza.screenshot({ path: png });

  execFileSync('python3', [
    '-c',
    [
      'import sys',
      'from PIL import Image',
      'i = Image.open(sys.argv[1]).convert("RGB")',
      'lado = int(sys.argv[3])',
      'if i.width != lado:',
      '    i = i.resize((lado, round(i.height * lado / i.width)), Image.LANCZOS)',
      'i.save(sys.argv[2], "WEBP", quality=88, method=6)',
    ].join('\n'),
    png,
    webp,
    String(LADO),
  ]);
  rmSync(png);

  const { size } = await import('node:fs').then((fs) => fs.statSync(webp));
  console.log(`[horno] ${nombre.padEnd(12)} ${(size / 1024).toFixed(1)} KB`);
}

await navegador.close();

if (errores.length) {
  console.error(`[horno] ${errores.length} errores en la página:`);
  errores.slice(0, 5).forEach((e) => console.error('        ' + e));
  process.exit(1);
}

console.log(`[horno] ${objetivo.length} maquetas horneadas en public/casos/`);
