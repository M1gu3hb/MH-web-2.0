import { useCallback, useEffect, useRef, useState } from 'react';

const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

/**
 * useScrollSequence — convierte el scroll sobre un contenedor alto en un
 * índice de 0 a count-1, para que una sección pegada avance sola.
 *
 * La selección manual no se pisa ni se "corrige": se guarda como un
 * desplazamiento respecto al índice que tocaría por scroll, así que si
 * alguien elige el paso 3 y empieza a scrollear, sigue desde el 3 y no
 * vuelve al 1. Al llegar a un extremo el desplazamiento se recalcula para
 * que cambiar de dirección responda al instante, y se olvida por completo
 * cuando el tramo sale de pantalla.
 */
export function useScrollSequence(count, { enabled = true } = {}) {
  const containerRef = useRef(null);
  const [index, setIndex] = useState(0);
  /* Índice que correspondería solo por scroll. */
  const natural = useRef(0);
  /* Cuánto se separó el usuario de ese índice al elegir a mano. */
  const offset = useRef(0);

  const select = useCallback(
    (next) => {
      const value = clamp(next, 0, count - 1);
      offset.current = value - natural.current;
      setIndex((current) => (current === value ? current : value));
    },
    [count],
  );

  useEffect(() => {
    if (!enabled) return undefined;
    const element = containerRef.current;
    if (!element) return undefined;

    let frame = 0;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      const vh = window.innerHeight;
      /* Progreso mientras el contenedor cruza la pantalla pegado. */
      const total = rect.height - vh;
      if (total <= 0) return;
      const raw = -rect.top / total;

      /* Bien fuera del tramo: la elección manual caduca. */
      if (raw < -0.15 || raw > 1.15) offset.current = 0;

      /* El recorrido se reparte en `count` tramos, pero no a partes iguales:
         los primeros van cortos y los últimos largos. Con tramos iguales el
         primer paso se comía más de un cuarto del recorrido y había que dar
         tres o cuatro vueltas de rueda antes de ver moverse nada, que se lee
         como que la sección no responde. */
      const progress = clamp(raw, 0, 1);
      const eased = clamp(progress ** 0.62, 0, 0.9999);
      const n = Math.min(count - 1, Math.floor(eased * count));
      natural.current = n;

      const next = clamp(n + offset.current, 0, count - 1);
      /* En los extremos el desplazamiento se reajusta: si no, seguir
         scrolleando acumularía deuda y al invertir no pasaría nada. */
      offset.current = next - n;

      setIndex((current) => (current === next ? current : next));
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
  }, [count, enabled]);

  return { containerRef, index, select };
}
