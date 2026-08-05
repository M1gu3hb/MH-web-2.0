import { useCallback, useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * ScrambleText — desfragmentación de letras.
 *
 *   trigger="hover"  se desordena mientras el cursor está encima
 *   trigger="view"   llega desfragmentado y se recompone al entrar en pantalla
 *
 * Dos decisiones que importan:
 *
 * 1. Cada palabra se mide y se le fija el ancho mientras dura la animación.
 *    Los glifos aleatorios no miden lo mismo que las letras, así que sin esto
 *    el texto se reacomoda entero en cada fotograma y parece que salta por
 *    todos lados. Se vuelve a medir cuando terminan de cargar las tipografías
 *    (si no, el ancho se congela con la fuente de reserva y luego la real,
 *    más ancha, se corta) y el ancho se suelta al acabar, para que el texto
 *    definitivo nunca quede recortado.
 *
 * 2. La animación escribe directamente en el DOM, no en el estado de React.
 *    Repintar un párrafo entero 30 veces por segundo con setState traba la
 *    página; mutar `textContent` no.
 */

const GLYPHS = '#$%&*+-<>=?@[]{}/\\|~^01';
const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

export function ScrambleText({
  text,
  as: Tag = 'span',
  trigger = 'hover',
  speed = 34,
  duration = 1700,
  /* Al soltar el cursor la palabra tiene que volver casi de inmediato: la
     duración de entrada, pensada para que se lea la recomposición, se sentía
     como un retraso cuando ya habías apartado el ratón. */
  exitDuration = 380,
  className = '',
  children,
}) {
  const reduced = useReducedMotion();
  const source = text ?? (typeof children === 'string' ? children : '');
  const host = useRef(null);
  const words = useRef([]);
  const timer = useRef(0);
  const phase = useRef('idle');

  const stop = useCallback(() => {
    cancelAnimationFrame(timer.current);
    timer.current = 0;
  }, []);

  /** Restaura el texto real, mide y congela el ancho de cada palabra. */
  const freeze = useCallback(() => {
    words.current.forEach(({ node, word }) => {
      node.style.width = '';
      node.textContent = word;
    });
    /* Se leen todos los anchos y luego se escriben: intercalarlos obligaría
       al navegador a recalcular el layout una vez por palabra. */
    const widths = words.current.map(({ node }) => node.getBoundingClientRect().width);
    words.current.forEach(({ node }, i) => {
      node.style.width = `${widths[i]}px`;
    });
  }, []);

  /** Suelta el ancho: el texto definitivo se muestra entero, pase lo que pase. */
  const release = useCallback(() => {
    words.current.forEach(({ node, word }) => {
      node.style.width = '';
      node.textContent = word;
    });
  }, []);

  /** Escribe el estado actual: `revealed` letras reales, el resto en glifos. */
  const paint = useCallback((revealed) => {
    let index = 0;
    words.current.forEach(({ node, word }) => {
      let out = '';
      for (let i = 0; i < word.length; i += 1, index += 1) {
        out += index < revealed ? word[i] : randomGlyph();
      }
      node.textContent = out;
      index += 1; // el espacio entre palabras también cuenta
    });
  }, []);

  const total = source.length;

  /* El avance se mide con el reloj, no contando fotogramas: con la escena 3D
     en marcha los temporizadores se retrasan y un párrafo largo tardaba
     medio minuto en recomponerse. Así siempre acaba en `duration`. */
  const resolve = useCallback((ms = duration) => {
    stop();
    phase.current = 'running';
    const startedAt = performance.now();
    const step = (now) => {
      const t = (now - startedAt) / ms;
      if (t >= 1) {
        timer.current = 0;
        phase.current = 'done';
        release();
        return;
      }
      paint(Math.floor(t * total));
      timer.current = requestAnimationFrame(step);
    };
    timer.current = requestAnimationFrame(step);
  }, [duration, paint, release, stop, total]);

  const churn = useCallback(() => {
    stop();
    phase.current = 'running';
    freeze();
    paint(0);
    let last = 0;
    const step = (now) => {
      if (now - last >= speed + 14) {
        last = now;
        paint(0);
      }
      timer.current = requestAnimationFrame(step);
    };
    timer.current = requestAnimationFrame(step);
  }, [freeze, paint, speed, stop]);

  /* Medición y bloqueo de anchos, antes del primer pintado. */
  useLayoutEffect(() => {
    if (reduced) return undefined;
    const element = host.current;
    if (!element) return undefined;

    phase.current = 'idle';
    words.current = Array.from(element.querySelectorAll('[data-word]')).map((node) => ({
      node,
      word: node.dataset.word,
    }));
    freeze();

    /* Con la fuente definitiva ya cargada, el ancho cambia: hay que rehacer
       la medida o las últimas letras se quedan fuera del recorte. */
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      if (phase.current === 'done') release();
      else {
        freeze();
        if (phase.current === 'idle' && trigger === 'view') paint(0);
      }
    });

    if (trigger !== 'view') {
      return () => {
        cancelled = true;
      };
    }

    paint(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        resolve();
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [freeze, paint, reduced, release, resolve, source, trigger]);

  useLayoutEffect(() => stop, [stop]);

  if (reduced) return <Tag className={className}>{source}</Tag>;

  const pieces = source.split(' ');
  /* Los manejadores se envuelven a propósito: pasar `resolve` directo le
     entregaría el evento como duración. */
  const settle = () => resolve(exitDuration);
  const hoverProps =
    trigger === 'hover'
      ? { onMouseEnter: churn, onMouseLeave: settle, onFocus: churn, onBlur: settle }
      : {};

  return (
    <Tag ref={host} className={`rb-scramble ${className}`} {...hoverProps}>
      <span aria-hidden="true">
        {pieces.map((word, index) => (
          <span key={`${word}-${index}`}>
            <span className="rb-scramble__word" data-word={word}>
              {word}
            </span>
            {index < pieces.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
      <span className="rb-visually-hidden">{source}</span>
    </Tag>
  );
}

/** Titular de varias líneas conservando el salto del diseño. */
export function ScrambleLines({ lines, trigger = 'hover', className = '', lineClassName = '' }) {
  return (
    <>
      {lines.map((line, index) => (
        <span className={`${className} scramble-line`} key={line}>
          <ScrambleText text={line} trigger={trigger} className={index ? lineClassName : ''} speed={30 + index * 4} />
        </span>
      ))}
    </>
  );
}
