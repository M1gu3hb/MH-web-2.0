import { useEffect, useRef, useState } from 'react';
import { motion as Motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { BrandWordmark } from './BrandLockup';

const STEPS = [
  ['tipografías', () => document.fonts?.ready ?? Promise.resolve()],
  ['identidad', () => preloadImage('/marca/simbolo-md.webp')],
  ['interfaz', () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))],
];

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

/* Lo que dura la presentación aunque la carga acabe antes: el tiempo justo
   para leer la marca una vez, no una pausa artificial. */
const PRESENTACION = 2600;

/**
 * Arranque del sitio: la marca presentándose.
 *
 * Ya no es una pantalla de carga disfrazada de terminal: es el lockup del
 * manual —símbolo, Morphiq, Astral Morphiq Systems— entrando por piezas
 * sobre el negro profundo de la marca, con una barra fina y el porcentaje
 * como único rastro de que algo se está cargando. La carga real casi siempre
 * termina antes que la presentación; cuando tarda más, la marca espera
 * compuesta y la barra sigue diciendo la verdad.
 *
 * El porcentaje y la barra se escriben en el DOM, no en el estado: cambian
 * en cada fotograma y no hay razón para repintar el árbol por eso.
 */
export function BootLoader({ onDone }) {
  const reduced = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  const barra = useRef(null);
  const cifra = useRef(null);

  useEffect(() => {
    let alive = true;
    let frame = 0;
    let carga = 8;
    let finCarga = false;

    const arranque = performance.now();

    const pinta = (ahora) => {
      frame = requestAnimationFrame(pinta);
      const reloj = reduced ? 1 : Math.min(1, (ahora - arranque) / PRESENTACION);
      const v = Math.min(carga, reloj * 100);
      if (barra.current) barra.current.style.transform = `scaleX(${v / 100})`;
      if (cifra.current) cifra.current.textContent = `${Math.round(v)}%`;
      if (reloj >= 1 && finCarga) finish();
    };

    const finish = () => {
      if (!alive || done.current) return;
      done.current = true;
      cancelAnimationFrame(frame);
      if (barra.current) barra.current.style.transform = 'scaleX(1)';
      if (cifra.current) cifra.current.textContent = '100%';
      window.setTimeout(() => {
        if (!alive) return;
        setLeaving(true);
        window.setTimeout(() => alive && onDone(), reduced ? 0 : 560);
      }, 260);
    };

    /* Tope duro: pase lo que pase, la página entra. */
    const bail = window.setTimeout(() => {
      finCarga = true;
      finish();
    }, 7000);

    (async () => {
      for (let i = 0; i < STEPS.length; i += 1) {
        if (!alive) return;
        try {
          await STEPS[i][1]();
        } catch {
          /* un recurso que falle no debe impedir entrar */
        }
        carga = Math.round(((i + 1) / STEPS.length) * 92) + 8;
      }
      window.clearTimeout(bail);
      carga = 100;
      finCarga = true;
    })();

    frame = requestAnimationFrame(pinta);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      window.clearTimeout(bail);
    };
  }, [onDone, reduced]);

  const paso = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <Motion.div
      className={`boot ${leaving ? 'boot--leaving' : ''}`}
      initial={false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-label="Cargando el sitio"
    >
      <div className="boot__core">
        <Motion.img
          className="boot__simbolo"
          src="/marca/simbolo-md.webp"
          alt=""
          width="606"
          height="640"
          {...paso}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <Motion.div {...paso} transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}>
          <BrandWordmark className="boot__nombre" />
        </Motion.div>
        <Motion.p
          className="boot__firma"
          translate="no"
          {...paso}
          transition={{ duration: 0.8, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
        >
          Astral Morphiq Systems
        </Motion.p>
      </div>

      <div className="boot__foot">
        <div className="boot__track" aria-hidden="true">
          <span ref={barra} style={{ transform: 'scaleX(0.08)' }} />
        </div>
        <div className="boot__meta">
          <span>Cargando</span>
          <strong ref={cifra}>8%</strong>
        </div>
      </div>
    </Motion.div>
  );
}
