import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#$%&*<>[]{}';

/**
 * DecryptedText — el texto se "descifra" carácter por carácter al entrar
 * en pantalla. Patrón ReactBits. Ideal para las micro-lecturas de consola.
 */
export function DecryptedText({ text, className = '', speed = 42 }) {
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(reduced ? text : '');
  const node = useRef(null);

  useEffect(() => {
    if (reduced) {
      setOutput(text);
      return undefined;
    }

    const element = node.current;
    if (!element) return undefined;

    let interval;
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        interval = window.setInterval(() => {
          frame += 1;
          const revealed = Math.floor(frame / 2);
          if (revealed > text.length) {
            window.clearInterval(interval);
            setOutput(text);
            return;
          }
          setOutput(
            text
              .split('')
              .map((character, index) => {
                if (index < revealed) return character;
                if (character === ' ') return ' ';
                return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              })
              .join(''),
          );
        }, speed);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, [reduced, speed, text]);

  return (
    <span ref={node} className={className}>
      <span aria-hidden="true">{output || text.replace(/\S/g, ' ')}</span>
      <span className="rb-visually-hidden">{text}</span>
    </span>
  );
}
