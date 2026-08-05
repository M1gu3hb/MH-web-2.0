import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * CountUp — cuenta hasta el valor cuando entra en pantalla. Patrón ReactBits.
 */
export function CountUp({ to, duration = 1500, suffix = '', className = '' }) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? to : 0);
  const node = useRef(null);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return undefined;
    }

    const element = node.current;
    if (!element) return undefined;

    let frame;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const started = performance.now();
        const tick = (now) => {
          const progress = Math.min(1, (now - started) / duration);
          const eased = 1 - (1 - progress) ** 3;
          setValue(Math.round(eased * to));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [duration, reduced, to]);

  return (
    <span ref={node} className={className}>
      {value}
      {suffix}
    </span>
  );
}
