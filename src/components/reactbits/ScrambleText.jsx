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
  /* El plazo de rescate. Se arma cada vez que la animación empieza y se
     desarma cuando termina bien. Es lo único que garantiza que el texto
     acabe visible pase lo que pase. */
  const vigilante = useRef(0);
  /* Una vez que este texto se ha compuesto, NUNCA vuelve a desordenarse por
     scroll. Ver el porqué en el efecto de abajo. */
  const yaResuelto = useRef(false);

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

  /** Enseña el texto de verdad, apaga los glifos y cierra el ciclo. */
  const mostrar = useCallback(() => {
    window.clearTimeout(vigilante.current);
    vigilante.current = 0;
    phase.current = 'done';
    yaResuelto.current = true;
    words.current.forEach(({ real, fx }) => {
      if (real) real.style.visibility = '';
      if (fx) fx.textContent = '';
    });
  }, []);

  /** Arma el plazo de rescate para el ciclo que acaba de empezar. */
  const vigilar = useCallback(
    (ms) => {
      window.clearTimeout(vigilante.current);
      vigilante.current = window.setTimeout(() => {
        cancelAnimationFrame(timer.current);
        timer.current = 0;
        mostrar();
      }, ms);
    },
    [mostrar]
  );

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
    /* Con la pestaña en segundo plano `requestAnimationFrame` no corre. Si
       la animación arrancara aquí, se quedaría congelada en glifos hasta
       que alguien volviera a la pestaña —y ese es exactamente el fallo de
       «las palabras no cargan»—. Así que ni se intenta: se enseña el texto
       y ya está. */
    if (document.hidden) {
      mostrar();
      return;
    }
    phase.current = 'running';
    /* El plazo se arma AQUÍ, cuando el ciclo empieza, no al montar: un
       titular que está a diez pantallas de distancia no debe quedarse sin
       efecto solo porque tarde un minuto en aparecer. */
    vigilar(ms + 2500);
    const startedAt = performance.now();
    const step = (now) => {
      const t = (now - startedAt) / ms;
      if (t >= 1) {
        timer.current = 0;
        mostrar();
        return;
      }
      paint(Math.floor(t * total));
      timer.current = requestAnimationFrame(step);
    };
    timer.current = requestAnimationFrame(step);
  }, [duration, mostrar, paint, stop, total, vigilar]);

  const churn = useCallback(() => {
    stop();
    phase.current = 'running';
    /* Aunque el cursor se quede encima, a los ocho segundos el texto vuelve.
       Sin esto, salir de la página con el ratón encima de un titular lo
       dejaba en glifos hasta recargar. */
    vigilar(8000);
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
  }, [paint, speed, stop, vigilar]);

  useLayoutEffect(() => {
    if (reduced) return undefined;
    const element = host.current;
    if (!element) return undefined;

    recoger();

    const conVista = trigger === 'view' || trigger === 'both';
    if (!conVista) {
      mostrar();
      return undefined;
    }

    /* ------------------------------------------------------------
       POR QUÉ ESTA GUARDA
       ------------------------------------------------------------
       Este efecto puede volver a ejecutarse por motivos que no tienen nada
       que ver con el texto: el componente se re-monta al recomponerse una
       rejilla, al terminar una entrada, al cambiar de ruta. Sin la guarda,
       cada re-ejecución llamaba a `paint(0)` —o sea, volvía a poner glifos
       en un titular que YA estaba compuesto— y creaba un observador nuevo.
       Si para entonces el bloque había quedado fuera de pantalla, ese
       observador no disparaba y el titular se quedaba en glifos hasta
       recargar la página. Es exactamente el fallo de «las palabras no
       cargan».

       La regla ahora es simple y no admite excepciones: un texto que ya se
       compuso no se vuelve a desordenar por scroll. Al cursor sí responde,
       porque eso lo pide la persona y siempre acaba resolviéndose.
       ------------------------------------------------------------ */
    if (yaResuelto.current) {
      mostrar();
      return undefined;
    }

    phase.current = 'idle';
    paint(0);

    /* SUELO ABSOLUTO. Aunque el observador no llegue a disparar nunca —por
       un recorte de un ancestro, por un reparto que cambia debajo, por lo
       que sea—, a los quince segundos el texto está a la vista. Es un solo
       temporizador por titular y se cancela en cuanto se compone, así que no
       cuesta nada; y es lo que convierte «se queda roto hasta recargar» en
       imposible por construcción. */
    const suelo = window.setTimeout(() => {
      if (phase.current !== 'done') mostrar();
    }, 15000);
    /* Umbral casi cero, no 0.3. Con la escala nueva hay titulares metidos
       dentro de una máscara con `overflow: hidden` que arranca con la línea
       fuera de su propio borde: mientras la máscara no se abre, la razón de
       intersección es 0 y con un umbral de 0.3 el observador podía no
       dispararse nunca. Dos animaciones no deben depender una de la otra. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        resolve();
      },
      { threshold: 0.01, rootMargin: '0px 0px -2% 0px' },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      window.clearTimeout(suelo);
    };
  }, [mostrar, paint, recoger, reduced, resolve, source, trigger]);

  /* ------------------------------------------------------------
     RED DE SEGURIDAD
     ------------------------------------------------------------
     La versión anterior estaba al revés: rescataba el texto solo si la
     animación NO estaba corriendo. Pero el fallo real es justo el contrario
     —una animación que ARRANCA y no termina: la pestaña se va al fondo y
     `requestAnimationFrame` deja de correr, o el elemento se desmonta a
     medias durante un cambio de ruta—. En ese caso `phase` se queda en
     `running` para siempre y con ella los glifos en pantalla. De ahí lo de
     «hay que recargar a huevo».

     Ahora el plazo es incondicional: pasado el tiempo, el texto está a la
     vista, esté como esté la animación. Y además se rescata en cuanto la
     pestaña vuelve al frente, sin esperar al plazo.
     ------------------------------------------------------------ */
  useEffect(() => {
    if (reduced) return undefined;

    /* Al volver de una pestaña oculta, o al restaurar la página desde la
       caché de atrás/adelante: si el ciclo quedó a medias, se resuelve sin
       esperar al plazo. */
    const alVolver = () => {
      if (document.hidden || phase.current !== 'running') return;
      stop();
      mostrar();
    };
    document.addEventListener('visibilitychange', alVolver);
    window.addEventListener('pageshow', alVolver);

    return () => {
      document.removeEventListener('visibilitychange', alVolver);
      window.removeEventListener('pageshow', alVolver);
      window.clearTimeout(vigilante.current);
    };
  }, [mostrar, reduced, source, stop]);

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
