import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useScrollSequence — convierte el scroll sobre un contenedor alto en un
 * índice de 0 a count-1, para que una sección pegada avance sola.
 *
 * El usuario puede además seleccionar a mano: cuando lo hace, el scroll deja
 * de mandar hasta que vuelve a moverse de verdad, así el clic no se siente
 * "corregido" por la página.
 */
export function useScrollSequence(count, { enabled = true } = {}) {
  const containerRef = useRef(null);
  const [index, setIndex] = useState(0);
  const manual = useRef(false);
  const lastScroll = useRef(0);

  const select = useCallback((next) => {
    manual.current = true;
    setIndex(next);
  }, []);

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
      const progress = Math.min(1, Math.max(0, -rect.top / total));

      const y = window.scrollY;
      if (Math.abs(y - lastScroll.current) > 24) manual.current = false;
      lastScroll.current = y;

      if (manual.current) return;
      /* Se reparte el recorrido en `count` tramos con un poco de margen
         para que el primero y el último respiren. */
      const eased = Math.min(0.9999, Math.max(0, (progress - 0.04) / 0.9));
      const next = Math.min(count - 1, Math.floor(eased * count));
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
