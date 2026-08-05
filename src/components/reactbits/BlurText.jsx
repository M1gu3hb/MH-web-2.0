import { motion as Motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * BlurText — las palabras entran desenfocadas y se enfocan en cascada.
 * Patrón ReactBits.
 */
export function BlurText({ text, className = '', delay = 0, stagger = 0.045, as: Tag = 'p' }) {
  const reduced = useReducedMotion();

  if (reduced) return <Tag className={className}>{text}</Tag>;

  const MotionTag = Motion[Tag] ?? Motion.p;
  const words = text.split(' ');

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, index) => (
        <Motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          style={{ display: 'inline-block', willChange: 'filter, transform' }}
          variants={{
            hidden: { filter: 'blur(9px)', opacity: 0, y: 10 },
            visible: { filter: 'blur(0px)', opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </Motion.span>
      ))}
    </MotionTag>
  );
}
