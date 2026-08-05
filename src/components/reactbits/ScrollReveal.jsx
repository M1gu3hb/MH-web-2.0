import { useRef } from 'react';
import { motion as Motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const blur = useTransform(progress, range, ['blur(5px)', 'blur(0px)']);
  return (
    <Motion.span className="rb-scroll-reveal__word" style={{ opacity, filter: blur }} aria-hidden="true">
      {children}{' '}
    </Motion.span>
  );
}

/**
 * ScrollReveal — el texto se ilumina palabra por palabra conforme se hace
 * scroll sobre él. Patrón ReactBits.
 */
export function ScrollReveal({ children, className = '' }) {
  const reduced = useReducedMotion();
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start 0.85', 'start 0.2'],
  });

  const words = String(children).split(' ');

  if (reduced) return <p className={className}>{children}</p>;

  return (
    <p ref={container} className={`rb-scroll-reveal ${className}`} aria-label={children}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={`${word}-${index}`} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}
