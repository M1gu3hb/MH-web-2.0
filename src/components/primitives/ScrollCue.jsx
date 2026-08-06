import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Indicador de «desliza para continuar».
 *
 * Va fijo abajo del viewport y se enciende solo cuando el tramo al que
 * pertenece —su elemento padre— está ocupando la pantalla y todavía queda
 * recorrido por delante. Así nunca hay dos a la vez ni se queda uno colgado
 * pidiendo scroll cuando ya no hay nada que ver.
 *
 * La opacidad se escribe a mano en el rAF: son unos pocos elementos y
 * pasarlos por el estado de React sería un render por fotograma.
 */
export function ScrollCue({ label = 'Desliza para continuar' }) {
  const reduced = useReducedMotion();
  const node = useRef(null);

  useEffect(() => {
    if (reduced) return undefined;
    const el = node.current;
    const host = el?.parentElement;
    if (!el || !host) return undefined;

    let frame = 0;
    let shown = -1;

    const measure = () => {
      const r = host.getBoundingClientRect();
      const vh = window.innerHeight;

      /* El recorrido se mide en píxeles, no en fracción del tramo: en
         fracción, un tramo corto apagaba la pista a los pocos píxeles y uno
         largo la dejaba encendida dos pantallas. Así el gesto se pide
         siempre durante la misma distancia, mida lo que mida la sección. */
      const scrolled = vh - r.top;
      const appearing = scrolled > 0;
      const fading = 1 - (scrolled - vh * 0.9) / (vh * 0.6);
      /* Y se retira cuando ya no queda tramo por delante. */
      const ending = (r.bottom - vh * 1.1) / (vh * 0.5);

      const value = appearing ? Math.min(fading, ending) : 0;
      const clamped = Math.max(0, Math.min(1, value));

      if (Math.abs(clamped - shown) > 0.01) {
        shown = clamped;
        el.style.opacity = String(clamped);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <p className="scroll-cue" ref={node} aria-hidden="true">
      <span className="scroll-cue__mouse">
        <i />
      </span>
      {label}
    </p>
  );
}
