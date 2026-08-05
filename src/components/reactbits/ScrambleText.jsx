import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * ScrambleText — desfragmentación de letras.
 *
 *   trigger="hover"  el texto se desordena mientras el cursor está encima y
 *                    se recompone al salir.
 *   trigger="view"   llega desfragmentado y se recompone al entrar en pantalla.
 *
 * El texto real vive en un nodo oculto para lectores de pantalla; la capa
 * animada es puramente visual.
 */

/* Glifos ASCII de ancho parecido, para que el salto de maquetación sea mínimo. */
const GLYPHS = '#$%&*+-<>=?@[]{}/\\|~^01';

function randomGlyph() {
  return GLYPHS[(Math.random() * GLYPHS.length) | 0];
}

export function ScrambleText({
  text,
  as: Tag = 'span',
  trigger = 'hover',
  speed = 34,
  revealPerFrame = 0.42,
  className = '',
  children,
}) {
  const reduced = useReducedMotion();
  const source = text ?? (typeof children === 'string' ? children : '');
  const [output, setOutput] = useState(trigger === 'view' ? '' : source);
  const node = useRef(null);
  const timer = useRef(0);
  const settled = useRef(trigger !== 'view');

  /* Desordena todo salvo los espacios: conserva la forma de las palabras. */
  const scrambleAll = useCallback(
    () => source.replace(/\S/g, () => randomGlyph()),
    [source],
  );

  const stop = useCallback(() => {
    window.clearInterval(timer.current);
    timer.current = 0;
  }, []);

  /** Recompone de izquierda a derecha. */
  const resolve = useCallback(() => {
    stop();
    let revealed = 0;
    timer.current = window.setInterval(() => {
      revealed += revealPerFrame;
      const cut = Math.floor(revealed);
      if (cut >= source.length) {
        stop();
        settled.current = true;
        setOutput(source);
        return;
      }
      setOutput(
        source
          .split('')
          .map((ch, i) => (i < cut || ch === ' ' ? ch : randomGlyph()))
          .join(''),
      );
    }, speed);
  }, [revealPerFrame, source, speed, stop]);

  /** Mantiene el texto desordenado mientras el cursor sigue encima. */
  const churn = useCallback(() => {
    stop();
    settled.current = false;
    setOutput(scrambleAll());
    timer.current = window.setInterval(() => setOutput(scrambleAll()), speed + 12);
  }, [scrambleAll, speed, stop]);

  useEffect(() => stop, [stop]);

  /* Modo scroll: llega desfragmentado y se recompone al aparecer. */
  useEffect(() => {
    if (trigger !== 'view' || reduced) return undefined;
    const element = node.current;
    if (!element) return undefined;

    setOutput(scrambleAll());
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        resolve();
      },
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced, resolve, scrambleAll, trigger]);

  if (reduced) return <Tag className={className}>{source}</Tag>;

  const hoverProps =
    trigger === 'hover'
      ? {
          onMouseEnter: churn,
          onMouseLeave: resolve,
          onFocus: churn,
          onBlur: resolve,
        }
      : {};

  return (
    <Tag ref={node} className={`rb-scramble ${className}`} {...hoverProps}>
      <span aria-hidden="true">{output || source.replace(/\S/g, ' ')}</span>
      <span className="rb-visually-hidden">{source}</span>
    </Tag>
  );
}

/**
 * ScrambleLines — aplica el efecto a un titular de varias líneas conservando
 * el salto de línea del diseño.
 */
export function ScrambleLines({ lines, trigger = 'hover', className = '', lineClassName = '' }) {
  return (
    <>
      {lines.map((line, index) => (
        <span className={`${className} scramble-line`} key={line}>
          <ScrambleText
            text={line}
            trigger={trigger}
            className={index ? lineClassName : ''}
            speed={30 + index * 4}
          />
        </span>
      ))}
    </>
  );
}
