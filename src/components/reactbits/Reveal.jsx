import { motion as Motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Reveal — entrada al entrar en viewport. Base de todas las secciones.
 */
export function Reveal({ children, delay = 0, y = 26, className = '', as = 'div', amount = 0.25 }) {
  const reduced = useReducedMotion();
  const MotionTag = Motion[as] ?? Motion.div;

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
