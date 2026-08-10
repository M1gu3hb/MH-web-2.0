import { useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * El guardia de las animaciones de scroll.
 *
 * Servicios, trabajo y proceso duran varias pantallas. Un deslizamiento
 * fuerte —el gesto normal de quien recorre una página en el teléfono— se las
 * pasaba enteras: se llegaba al otro lado sin haber visto nada.
 *
 * Este guardia vigila los centinelas que esas secciones dejan en su principio
 * y detiene ahí el impulso. Volver a deslizar sigue de largo con normalidad, y
 * al llegar a la siguiente vuelve a frenar.
 *
 * Dos cosas se aprendieron peleándose con esto:
 *
 * 1. El anclaje de CSS no vale: un área más alta que la ventana se ignora, y
 *    aun con un centinela de un píxel, `scroll-snap-stop` no retiene un
 *    impulso de miles de píxeles. Medido: se lo saltaba igual.
 * 2. Un impulso no llega como un salto grande de golpe. Tanto la rueda como
 *    el dedo entregan el recorrido en muchos avisos pequeños seguidos —de dos
 *    a ciento sesenta píxeles cada uno—, así que lo que lo delata es cuánto se
 *    recorre en poco tiempo, no cuánto trae un aviso suelto.
 */

/* Ventana de medición y velocidad a partir de la cual cuenta como impulso:
   media pantalla en un cuarto de segundo son unos dos mil píxeles por
   segundo. Leyendo se va muy por debajo, así que el guardia solo aparece
   cuando de verdad se ha lanzado la página. */
const VENTANA = 260;
const IMPULSO = 0.5;

/* La inercia no se corta sola, y menos en teléfono, donde el scroll vive en
   otro hilo: mientras siga empujando, el guardia sostiene la posición. Se
   renueva a ratos cortos y con un tope, para no agarrar a nadie de más. */
const RETENCION = 260;
const RETENCION_TOPE = 1400;

/* Un centinela usado no vuelve a frenar hasta que se sube por encima de él:
   dentro de la misma sección, quien insiste en avanzar tiene que poder
   hacerlo sin quedarse atrapado en la puerta. */
const REARME = 220;

export function FrenoScroll() {
  const reducidas = useReducedMotion();

  useEffect(() => {
    if (reducidas) return undefined;

    const muestras = [];
    const usados = new WeakSet();
    let centinelas = [];
    let anterior = window.scrollY;
    let tregua = 0;
    let reteniendo = 0;
    let retenerHasta = 0;
    let retenerY = 0;

    /* Ir a una sección desde el menú también cruza centinelas a toda
       velocidad, y ahí frenar sería un estorbo: se pide un destino, no un
       paseo. Cualquier salto a un ancla abre una tregua. */
    const onClick = (event) => {
      if (event.target.closest?.('a[href^="#"]')) tregua = performance.now() + 1600;
    };

    /* Un gesto nuevo manda siempre: suelta la retención al instante para que
       nadie se sienta agarrado. */
    const soltar = () => {
      reteniendo = 0;
    };

    const onScroll = () => {
      const y = window.scrollY;
      const ahora = performance.now();
      const previo = anterior;
      anterior = y;

      if (!centinelas.length) centinelas = Array.from(document.querySelectorAll('.freno-scroll'));

      /* Sostener lo que queda de inercia sobre el centinela recién frenado. */
      if (reteniendo > ahora) {
        if (y > retenerY + 4) {
          window.scrollTo({ top: retenerY, behavior: 'instant' });
          anterior = retenerY;
          reteniendo = Math.min(ahora + RETENCION, retenerHasta);
        }
        return;
      }

      /* Los que quedaron atrás se rearman cuando vuelven a asomar por debajo
         del borde: quiere decir que se ha subido por encima de ellos. */
      for (const nodo of centinelas) {
        if (usados.has(nodo) && nodo.getBoundingClientRect().top > REARME) usados.delete(nodo);
      }

      /* El recorrido se mide contra la muestra más vieja que siga dentro de la
         ventana, y también contra el aviso anterior: el impulso puede llegar
         repartido o de una vez, y las dos formas cuentan. */
      while (muestras.length && ahora - muestras[0][0] > VENTANA) muestras.shift();
      const desde = muestras.length ? muestras[0][1] : previo;
      muestras.push([ahora, y]);

      if (y <= previo) return; // solo bajando
      if (ahora < tregua) return;

      const recorrido = Math.max(y - desde, y - previo);
      if (recorrido < window.innerHeight * IMPULSO) return;

      for (const nodo of centinelas) {
        if (usados.has(nodo)) continue;
        const top = Math.round(nodo.getBoundingClientRect().top + y);
        if (top <= previo || top >= y) continue; // no se cruzó en este aviso
        usados.add(nodo);
        window.scrollTo({ top, behavior: 'instant' });
        anterior = top;
        retenerY = top;
        reteniendo = ahora + RETENCION;
        retenerHasta = ahora + RETENCION_TOPE;
        muestras.length = 0;
        return;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', soltar, { passive: true });
    window.addEventListener('touchstart', soltar, { passive: true });
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', soltar);
      window.removeEventListener('touchstart', soltar);
      document.removeEventListener('click', onClick, true);
    };
  }, [reducidas]);

  return null;
}
