import { useCallback, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * TiltedCard — inclinación 3D siguiendo el cursor. Patrón ReactBits.
 */
export function TiltedCard({ children, className = '', max = 7, scale = 1.012 }) {
  const reduced = useReducedMotion();
  const node = useRef(null);
  const frame = useRef(0);

  const handleMove = useCallback(
    (event) => {
      if (reduced) return;
      const element = node.current;
      if (!element) return;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();
        const px = (event.clientX - bounds.left) / bounds.width - 0.5;
        const py = (event.clientY - bounds.top) / bounds.height - 0.5;
        element.style.setProperty('--rb-rx', `${(-py * max).toFixed(2)}deg`);
        element.style.setProperty('--rb-ry', `${(px * max).toFixed(2)}deg`);
        element.style.setProperty('--rb-scale', String(scale));
      });
    },
    [max, reduced, scale],
  );

  const handleLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    const element = node.current;
    if (!element) return;
    element.style.setProperty('--rb-rx', '0deg');
    element.style.setProperty('--rb-ry', '0deg');
    element.style.setProperty('--rb-scale', '1');
  }, []);

  return (
    <div ref={node} className={`rb-tilt ${className}`} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </div>
  );
}
