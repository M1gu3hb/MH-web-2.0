import { motion as Motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * SplitText — revela un texto letra por letra o palabra por palabra
 * cuando entra en el viewport. Patrón ReactBits, adaptado a la marca.
 */
export function SplitText({
  text,
  as: Tag = 'span',
  by = 'char',
  delay = 0,
  stagger = 0.026,
  duration = 0.62,
  className = '',
}) {
  const reduced = useReducedMotion();
  const MotionTag = Motion[Tag] ?? Motion.span;

  if (reduced) return <Tag className={className}>{text}</Tag>;

  /* Las letras se agrupan por palabra: así una palabra nunca se parte al
     saltar de línea, aunque la animación sea letra por letra. */
  const words = text.split(' ');
  const variants = {
    hidden: { y: '108%', opacity: 0, rotate: 3 },
    visible: { y: '0%', opacity: 1, rotate: 0 },
  };

  return (
    <MotionTag
      className={`rb-split ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, wordIndex) => (
        <span className="rb-split__word" key={`${word}-${wordIndex}`} aria-hidden="true">
          {(by === 'word' ? [word] : Array.from(word)).map((piece, pieceIndex) => (
            <span className="rb-split__mask" key={`${piece}-${pieceIndex}`}>
              <Motion.span
                className="rb-split__piece"
                variants={variants}
                transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
              >
                {piece}
              </Motion.span>
            </span>
          ))}
          {wordIndex < words.length - 1 ? <span className="rb-split__space"> </span> : null}
        </span>
      ))}
    </MotionTag>
  );
}
