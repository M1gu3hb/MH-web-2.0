import { useCallback, useRef, useState } from 'react';
import { motion as Motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Magnet — el elemento se acerca al cursor dentro de un radio.
 * Patrón ReactBits. Se desactiva con reduced motion y en dispositivos táctiles.
 */
export function Magnet({ children, strength = 0.32, radius = 110, className = '' }) {
  const reduced = useReducedMotion();
  const node = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = useCallback(
    (event) => {
      if (reduced || !node.current || !window.matchMedia('(hover: hover)').matches) return;
      const bounds = node.current.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);
      if (distance > bounds.width / 2 + radius) {
        setOffset({ x: 0, y: 0 });
        return;
      }
      setOffset({ x: dx * strength, y: dy * strength });
    },
    [radius, reduced, strength],
  );

  const reset = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  return (
    <Motion.span
      ref={node}
      className={`rb-magnet ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={offset}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.4 }}
    >
      {children}
    </Motion.span>
  );
}
