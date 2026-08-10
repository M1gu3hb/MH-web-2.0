import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * ScrambleText — desfragmentación de letras.
 *
 *   trigger="hover"  se desordena mientras el cursor está encima
 *   trigger="view"   llega desfragmentado y se recompone al entrar en pantalla
 *   trigger="both"   las dos cosas
 *
 * El texto real NUNCA se toca: se queda en el flujo, con su ancho de verdad,
 * y solo se le apaga la visibilidad mientras dura la animación. Los glifos
 * aleatorios se pintan en una capa absoluta encima de cada palabra.
 *
 * Antes se medía cada palabra y se le fijaba el ancho para que los glifos
 * —que no miden lo mismo que las letras— no movieran la maquetación. Esa
 * medida era el problema: si caía mientras la tipografía todavía estaba
 * cambiando, dentro de una capa aún oculta o bajo un ancestro escalado, el
 * ancho salía corto y, como la palabra recorta lo que sobra, el titular se
 * quedaba mutilado para siempre. Sin medir no hay nada que pueda salir mal:
 * la maquetación la sostiene el propio texto y la capa de glifos flota sin
 * ocupar sitio.
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

  /** Recoge las parejas palabra real / capa de glifos. */
  const recoger = useCallback(() => {
    const element = host.current;
    words.current = element
      ? Array.from(element.querySelectorAll('[data-word]')).map((node) => ({
          real: node.querySelector('[data-real]'),
          fx: node.querySelector('[data-fx]'),
          word: node.dataset.word,
        }))
      : [];
  }, []);

  /** Enseña el texto de verdad y apaga la capa de glifos. */
  const mostrar = useCallback(() => {
    words.current.forEach(({ real, fx }) => {
      if (real) real.style.visibility = '';
      if (fx) fx.textContent = '';
    });
  }, []);

  /** Escribe el estado actual: `revealed` letras reales, el resto en glifos. */
  const paint = useCallback((revealed) => {
    let index = 0;
    words.current.forEach(({ real, fx, word }) => {
      let out = '';
      let intactas = 0;
      for (let i = 0; i < word.length; i += 1, index += 1) {
        if (index < revealed) {
          out += word[i];
          intactas += 1;
        } else {
          out += randomGlyph();
        }
      }
      index += 1; // el espacio entre palabras también cuenta
      /* Palabra ya resuelta: se enseña la de verdad, que es la que mide bien
         y la que leen los buscadores. */
      if (intactas === word.length) {
        if (real) real.style.visibility = '';
        if (fx) fx.textContent = '';
      } else {
        if (real) real.style.visibility = 'hidden';
        if (fx) fx.textContent = out;
      }
    });
  }, []);

  const total = source.length;

  /* El avance se mide con el reloj, no contando fotogramas: si el navegador
     se retrasa, la animación sigue acabando en `duration`. */
  const resolve = useCallback((ms = duration) => {
    stop();
    phase.current = 'running';
    const startedAt = performance.now();
    const step = (now) => {
      const t = (now - startedAt) / ms;
      if (t >= 1) {
        timer.current = 0;
        phase.current = 'done';
        mostrar();
        return;
      }
      paint(Math.floor(t * total));
      timer.current = requestAnimationFrame(step);
    };
    timer.current = requestAnimationFrame(step);
  }, [duration, mostrar, paint, stop, total]);

  const churn = useCallback(() => {
    stop();
    phase.current = 'running';
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
  }, [paint, speed, stop]);

  useLayoutEffect(() => {
    if (reduced) return undefined;
    const element = host.current;
    if (!element) return undefined;

    recoger();
    phase.current = 'idle';

    const conVista = trigger === 'view' || trigger === 'both';
    if (!conVista) {
      mostrar();
      return undefined;
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
    return () => observer.disconnect();
  }, [mostrar, paint, recoger, reduced, resolve, source, trigger]);

  /* Red de seguridad: pase lo que pase con la animación —una capa que se
     desmonta a medias, una pestaña que vuelve del fondo— a los seis segundos
     el texto de verdad está a la vista. Nunca se queda a medio componer. */
  useEffect(() => {
    if (reduced) return undefined;
    const t = window.setTimeout(() => {
      if (phase.current !== 'running') mostrar();
    }, 6000);
    return () => window.clearTimeout(t);
  }, [mostrar, reduced, source]);

  useLayoutEffect(() => stop, [stop]);

  if (reduced) return <Tag className={className}>{source}</Tag>;

  const pieces = source.split(' ');
  /* Los manejadores se envuelven a propósito: pasar `resolve` directo le
     entregaría el evento como duración. */
  const settle = () => resolve(exitDuration);
  const hoverProps =
    trigger === 'hover' || trigger === 'both'
      ? { onMouseEnter: churn, onMouseLeave: settle, onFocus: churn, onBlur: settle }
      : {};

  return (
    <Tag ref={host} className={`rb-scramble ${className}`} {...hoverProps}>
      {pieces.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="rb-scramble__word" data-word={word}>
            <span data-real>{word}</span>
            <span className="rb-scramble__fx" data-fx aria-hidden="true" />
          </span>
          {index < pieces.length - 1 ? ' ' : ''}
        </span>
      ))}
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
