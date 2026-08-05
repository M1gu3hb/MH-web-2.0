import { useEffect, useRef, useState } from 'react';
import { motion as Motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const STEPS = [
  ['fuentes', () => document.fonts?.ready ?? Promise.resolve()],
  ['identidad', () => preloadImage('/mh-logo.png')],
  ['modelo 3d', () => preloadBinary('/laptop.glb')],
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

function preloadBinary(src) {
  return fetch(src, { cache: 'force-cache' })
    .then((r) => r.arrayBuffer())
    .catch(() => null);
}

/**
 * Arranque del sitio. Carga por adelantado lo pesado —tipografías, monograma
 * y el modelo de la laptop— para que nada se trabe a media página, y no se
 * queda colgado nunca: hay un tope de tiempo.
 */
export function BootLoader({ onDone }) {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(6);
  const [label, setLabel] = useState('iniciando');
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    let alive = true;

    const finish = () => {
      if (!alive || done.current) return;
      done.current = true;
      setProgress(100);
      setLabel('listo');
      window.setTimeout(() => {
        if (!alive) return;
        setLeaving(true);
        window.setTimeout(() => alive && onDone(), reduced ? 0 : 620);
      }, 220);
    };

    /* Tope duro: pase lo que pase, la página entra. */
    const bail = window.setTimeout(finish, 7000);

    (async () => {
      for (let i = 0; i < STEPS.length; i += 1) {
        const [name, run] = STEPS[i];
        if (!alive) return;
        setLabel(name);
        try {
          await run();
        } catch {
          /* un recurso que falle no debe impedir entrar */
        }
        if (!alive) return;
        setProgress(Math.round(((i + 1) / STEPS.length) * 92) + 6);
      }
      window.clearTimeout(bail);
      finish();
    })();

    return () => {
      alive = false;
      window.clearTimeout(bail);
    };
  }, [onDone, reduced]);

  return (
    <Motion.div
      className={`boot ${leaving ? 'boot--leaving' : ''}`}
      initial={false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-label="Cargando el sitio"
    >
      <div className="boot__grid" aria-hidden="true" />

      <div className="boot__core">
        <div className="boot__mark">
          <img src="/mh-logo.png" alt="" width="150" height="134" />
          <span className="boot__ring" aria-hidden="true" />
          <span className="boot__ring boot__ring--inner" aria-hidden="true" />
        </div>
        <p className="boot__name">MH ASTRAL OS</p>
      </div>

      <div className="boot__foot">
        <div className="boot__track" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <div className="boot__meta">
          <span>cargando {label}</span>
          <strong>{String(Math.round(progress)).padStart(3, '0')}%</strong>
        </div>
      </div>
    </Motion.div>
  );
}
