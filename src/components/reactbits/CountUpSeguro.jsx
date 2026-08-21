import { useCallback, useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * ============================================================
 * COUNTUPSEGURO — la cifra se cuenta sin poder mentir
 * ============================================================
 *
 * Existe porque `CountUp.jsx` no se puede montar. Aquel arranca en
 * `useState(0)` y sube cuando un `IntersectionObserver` con `threshold: 0.5`
 * dispara: si el observador no dispara —entradas agrupadas, un salto de
 * restauración de scroll, JavaScript que se queda a medias; los tres casos
 * están documentados en `ScrambleText.jsx`— la página se queda enseñando un
 * `0`. Eso no es información oculta, es información FALSA, que es peor. Aquel
 * no se toca y no se borra; este se pone al lado.
 *
 * ------------------------------------------------------------
 * LA REGLA, PORTADA DE ScrambleText.jsx
 * ------------------------------------------------------------
 *   EL OCULTAMIENTO DE LA CIFRA TIENE FECHA DE CADUCIDAD ESCRITA EN CSS.
 *
 * · El valor de verdad está en el DOM desde el primer fotograma y nunca sale
 *   del flujo ni del árbol de accesibilidad. Para taparlo se vuelve
 *   TRANSPARENTE, no invisible: un lector de pantalla y el rastreador de
 *   Google leen siempre el número real, esté como esté la animación.
 * · La capa que cuenta va encima, es `aria-hidden` y es decorativa.
 * · El atributo `data-contando` arranca `rb-count-rescate`, una animación con
 *   `step-end` que le devuelve el color SOLA. La lleva el motor de render, no
 *   nosotros. Si este archivo se cuelga a mitad de la cuenta, el navegador
 *   devuelve la cifra igual.
 * · JavaScript se limita a poner y quitar el atributo. Al terminar la
 *   animación de rescate se escucha su final y se limpia el DOM, para que lo
 *   que se ve y lo que dice el DOM sean lo mismo —el fallo 5 de ScrambleText.
 *
 * ------------------------------------------------------------
 * LA DIFERENCIA CON ScrambleText, Y ES LA QUE IMPORTA
 * ------------------------------------------------------------
 * Allí el texto llega cifrado y el observador lo RESCATA: que no dispare es
 * un problema, y por eso hay red de scroll compartida y umbral 0. Aquí la
 * cifra llega LEGIBLE y el observador solo la tapa un momento para contarla.
 * Que no dispare nunca no cuesta nada: se queda el número real, quieto y
 * correcto, que es exactamente lo que la página quiere decir. Por eso este
 * observador puede ser corto y no necesita red de ninguna clase.
 *
 * Por lo mismo el efecto es `useEffect` y no `useLayoutEffect`: aquí no hay
 * nada que tapar antes de que pinte el navegador, y tapar antes de pintar
 * sería justo lo que no queremos.
 */
export function CountUpSeguro({ valor, duracion = 1200, className = '' }) {
  const sinMovimiento = useReducedMotion();
  const caja = useRef(null);
  const reloj = useRef(0);
  const fase = useRef('reposo');

  /**
   * Enseña la cifra de verdad y apaga la capa que cuenta.
   *
   * Cancela el bucle ANTES de tocar el DOM: si no, un `requestAnimationFrame`
   * vivo puede volver a escribir un número intermedio justo después de que la
   * caducidad de CSS lo hubiera limpiado.
   */
  const mostrar = useCallback(() => {
    cancelAnimationFrame(reloj.current);
    reloj.current = 0;
    fase.current = 'hecho';
    const nodo = caja.current;
    if (!nodo) return;
    /* Quitar el atributo descarta la animación de rescate de CSS. */
    nodo.removeAttribute('data-contando');
    const real = nodo.querySelector('[data-real]');
    const fx = nodo.querySelector('[data-fx]');
    if (real) real.style.color = '';
    if (fx) fx.textContent = '';
  }, []);

  /** Escribe un paso de la cuenta: el real transparente, el número encima. */
  const pintar = useCallback((n) => {
    const nodo = caja.current;
    if (!nodo) return;
    const real = nodo.querySelector('[data-real]');
    const fx = nodo.querySelector('[data-fx]');
    /* El real NO se oculta: se vuelve transparente. Sigue midiendo y sigue
       leyéndose. Y el atributo arranca la animación que, pase lo que pase con
       este JavaScript, le devuelve el color al terminar. */
    nodo.setAttribute('data-contando', '');
    if (real) real.style.color = 'transparent';
    if (fx) fx.textContent = String(n);
  }, []);

  const contar = useCallback(() => {
    cancelAnimationFrame(reloj.current);
    /* Con la pestaña en segundo plano `requestAnimationFrame` no corre. Si la
       cuenta arrancara aquí se quedaría congelada en un número intermedio
       —una cifra falsa— hasta que alguien volviera. Así que ni se intenta:
       se queda el valor real, que ya está puesto. */
    if (document.hidden) {
      mostrar();
      return;
    }
    fase.current = 'corriendo';
    const arranque = performance.now();
    const paso = (ahora) => {
      /* El avance se mide con el reloj, no contando fotogramas: si el
         navegador se retrasa, la cuenta sigue acabando en `duracion`. */
      const t = (ahora - arranque) / duracion;
      if (t >= 1) {
        mostrar();
        return;
      }
      const suave = 1 - (1 - t) ** 3;
      pintar(Math.round(suave * valor));
      reloj.current = requestAnimationFrame(paso);
    };
    reloj.current = requestAnimationFrame(paso);
  }, [duracion, mostrar, pintar, valor]);

  useEffect(() => {
    if (sinMovimiento) return undefined;
    const nodo = caja.current;
    if (!nodo) return undefined;

    let vivo = true;
    /* Umbral 0, como en ScrambleText: es el único que marca intersección
       cuando el área es cero. Y se miran TODAS las entradas, no la primera:
       IntersectionObserver las AGRUPA y la primera puede llegar caducada
       diciendo `false`, que fue el fallo 1 de aquel archivo. */
    const observador = new IntersectionObserver(
      (entradas) => {
        if (!vivo || !entradas.some((e) => e.isIntersecting)) return;
        vivo = false;
        observador.disconnect();
        contar();
      },
      { threshold: 0 }
    );
    observador.observe(nodo);

    return () => {
      vivo = false;
      observador.disconnect();
      cancelAnimationFrame(reloj.current);
      reloj.current = 0;
    };
  }, [contar, sinMovimiento]);

  /* Al volver de una pestaña oculta o al restaurar desde la caché de
     atrás/adelante: si la cuenta quedó a medias, se cierra. Un número
     intermedio congelado es la cifra equivocada en pantalla. */
  useEffect(() => {
    if (sinMovimiento) return undefined;
    const alVolver = () => {
      if (document.hidden || fase.current !== 'corriendo') return;
      mostrar();
    };
    document.addEventListener('visibilitychange', alVolver);
    window.addEventListener('pageshow', alVolver);
    return () => {
      document.removeEventListener('visibilitychange', alVolver);
      window.removeEventListener('pageshow', alVolver);
    };
  }, [mostrar, sinMovimiento]);

  /* CSS AVISA, JAVASCRIPT RECOGE. La animación de rescate ya devuelve el
     color por su cuenta, así que la cifra se ve aunque este archivo esté
     muerto. Pero si nadie escucha, el nodo se queda a medias para siempre:
     el `color: transparent` en línea —que la animación pisa, pero no borra—
     y un número intermedio dormido en la capa de encima. Los eventos de
     animación burbujean, así que un oyente en el envoltorio basta; se filtra
     por nombre para no reaccionar a ninguna otra que pase por aquí. */
  const alCaducar = useCallback(
    (e) => {
      if (e.animationName !== 'rb-count-rescate') return;
      mostrar();
    },
    [mostrar]
  );

  if (sinMovimiento) return <span className={className}>{valor}</span>;

  return (
    <span ref={caja} className={`rb-count ${className}`} onAnimationEnd={alCaducar}>
      <span data-real>{valor}</span>
      <span className="rb-count__fx" data-fx aria-hidden="true" />
    </span>
  );
}
