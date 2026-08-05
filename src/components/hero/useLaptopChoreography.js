import { useEffect, useRef } from 'react';

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** Mapea un valor dentro de un tramo a 0..1. */
const span = (v, a, b) => clamp01((v - a) / Math.max(1e-6, b - a));

/* Reposo en el hero. */
const REST = { x: 1.85, y: -0.05, z: 0, scale: 1.78, rotY: -0.42, rotX: 0.06 };
/* Posición desde la que se aleja al salir. */
const AWAY = { x: -0.9, y: 0.1, z: -1.6, scale: 1.1, rotY: -0.5, rotX: 0.1 };

/**
 * Coreografía de la laptop.
 *
 *   1. Hero        flota a la derecha y sigue al cursor
 *   2. Tramo de    todo se oscurece y la laptop se acerca hasta CUBRIR la
 *      entrada     pantalla; entonces se apaga en negro y se enciende: a
 *                  partir de ahí la página ocurre dentro de la laptop
 *   3. Dentro      oculta; el canvas se duerme
 *   4. Tramo de    todo se apaga, la laptop reaparece a pantalla completa y
 *      salida      se aleja: salimos de la laptop y aparece el contacto
 *
 * `focus` es cuánto se acerca a cubrir la pantalla (0 = pose suelta,
 * 1 = tapando el viewport). La pose de «tapando» no se fija aquí: la calcula
 * la escena a partir del tamaño real de la pantalla del modelo y del
 * viewport, que es lo único que garantiza que cubra en cualquier formato.
 *
 * Los dos tramos son elementos reales del documento (#zoom-in y #zoom-out),
 * así que el recorrido es explícito y no depende de adivinar alturas.
 */
export function useLaptopChoreography() {
  const state = useRef({
    visible: true,
    opacity: 1,
    veil: 0,
    power: 0,
    inside: 0,
    pointer: 1,
    focus: 0,
    phase: 'hero',
    ...REST,
  });

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const s = state.current;
      const y = window.scrollY || document.documentElement.scrollTop;
      const vh = window.innerHeight;

      const gapIn = document.getElementById('zoom-in');
      const gapOut = document.getElementById('zoom-out');
      if (!gapIn || !gapOut) return;

      const inTop = gapIn.getBoundingClientRect().top + y;
      const inLen = gapIn.offsetHeight;
      const outTop = gapOut.getBoundingClientRect().top + y;
      const outLen = gapOut.offsetHeight;

      /* La entrada empieza cuando el tramo asoma por abajo. */
      const enter = span(y, inTop - vh * 0.75, inTop + inLen - vh * 0.1);
      const exit = span(y, outTop - vh * 0.85, outTop + outLen - vh * 0.15);

      if (exit > 0) {
        /* ---- Salida: se apaga, reaparece llena y se aleja -------------- */
        s.phase = 'exit';
        s.pointer = 0;

        /* Apagón inmediato; el velo se abre al final para dejar ver el cierre. */
        s.veil = exit < 0.9 ? Math.min(1, exit / 0.12) : 1 - span(exit, 0.9, 1);
        /* Destello del apagado, justo antes de que aparezca la laptop. */
        s.power = Math.max(0, 1 - Math.abs(exit - 0.1) / 0.09);

        s.focus = 1 - easeInOut(span(exit, 0.16, 0.9));
        s.opacity = Math.min(span(exit, 0.1, 0.2), 1 - span(exit, 0.94, 1));
        Object.assign(s, AWAY);
        s.inside = 0;
      } else if (enter > 0) {
        /* ---- Entrada: se acerca hasta cubrir y la pantalla se enciende -- */
        s.phase = 'enter';
        s.pointer = 1 - span(enter, 0, 0.25);

        /* El fondo se va a negro antes de que la laptop llene. */
        s.veil = enter < 0.88 ? span(enter, 0, 0.4) : 1 - span(enter, 0.88, 1);
        s.power = Math.max(0, 1 - Math.abs(enter - 0.9) / 0.1);

        Object.assign(s, REST);
        s.focus = easeInOut(span(enter, 0, 0.86));
        /* Ya tapando del todo: se apaga en negro para encenderse enseguida. */
        s.opacity = 1 - span(enter, 0.87, 0.94);
        s.inside = span(enter, 0.9, 1);
      } else {
        /* ---- Hero ------------------------------------------------------ */
        s.phase = 'hero';
        s.pointer = 1;
        s.veil = 0;
        s.power = 0;
        s.opacity = 1;
        s.inside = 0;
        s.focus = 0;
        Object.assign(s, REST);
      }

      /* Entre los dos tramos seguimos "dentro" de la pantalla. */
      if (s.phase !== 'hero' && enter >= 1 && exit <= 0) s.inside = 1;

      s.visible = s.opacity > 0.012;
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
  }, []);

  return state;
}
