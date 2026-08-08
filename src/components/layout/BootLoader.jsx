import { useEffect, useRef, useState } from 'react';
import { motion as Motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { laptopReady, skipLaptopReady } from '../hero/laptopBus';
import { BootRain } from './BootRain';
import { ASCII_COLS, LOGO_ASCII } from './logoAscii';

const STEPS = [
  ['fuentes', () => document.fonts?.ready ?? Promise.resolve()],
  ['identidad', () => preloadImage('/mh-logo.png')],
  ['modelo 3d', () => preloadBinary('/laptop.glb')],
  /* La escena vive detrás del velo de carga; se espera a que haya pintado su
     primer fotograma para que la laptop no aparezca sola a media página. */
  ['escena 3d', () => withDeadline(laptopReady, 3500, skipLaptopReady)],
  ['interfaz', () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))],
];

/** Espera a `promise`, pero nunca más de `ms`. */
function withDeadline(promise, ms, onTimeout) {
  return Promise.race([
    promise,
    new Promise((resolve) => {
      window.setTimeout(() => {
        onTimeout?.();
        resolve(false);
      }, ms);
    }),
  ]);
}

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

/* Lo que tarda el monograma en escribirse, pase lo que pase con la carga. */
const TRAZO = 4200;

/**
 * Arranque del sitio. Carga por adelantado lo pesado —tipografías, monograma
 * y el modelo de la laptop— para que nada se trabe a media página, y no se
 * queda colgado nunca: hay un tope de tiempo.
 *
 * El trazado del monograma lleva su propio reloj y no el de la carga. Atado a
 * la carga tenía tantos fotogramas como pasos —seis— y no se veía escribirse:
 * daba dos saltos y ya estaba. Ahora se escribe en cuatro segundos largos, a
 * ritmo constante, y la página no entra hasta que termina. Si la carga tarda
 * más, el dibujo se queda hecho esperándola.
 *
 * Ni el trazado ni el porcentaje pasan por el estado de React: son sesenta
 * cambios por segundo justo mientras se está montando la escena en 3D, y
 * repintar el árbol a ese ritmo es exactamente el tirón que esta pantalla
 * existe para evitar. Se escriben en el DOM directamente.
 */
export function BootLoader({ onDone }) {
  const reduced = useReducedMotion();
  const [label, setLabel] = useState('iniciando');
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);

  const trazo = useRef(null);
  const caret = useRef(null);
  const barra = useRef(null);
  const cifra = useRef(null);

  useEffect(() => {
    let alive = true;
    let frame = 0;
    /* Lo que de verdad se ha cargado y lo que lleva escrito el dibujo. La
       cifra que se enseña es la menor de las dos, así que la barra llega al
       final justo cuando las dos cosas están hechas y nunca antes. */
    let carga = 6;
    let escrito = 0;
    let finCarga = false;

    const arranque = performance.now();
    const total = LOGO_ASCII.length;

    const pinta = (ahora) => {
      frame = requestAnimationFrame(pinta);
      escrito = reduced ? 1 : Math.min(1, (ahora - arranque) / TRAZO);

      const n = Math.round(total * escrito);
      if (trazo.current && trazo.current.textContent.length !== n) {
        trazo.current.textContent = LOGO_ASCII.slice(0, n);
      }
      if (caret.current) caret.current.style.opacity = escrito < 1 ? '' : '0';

      const v = Math.min(carga, escrito * 100);
      if (barra.current) barra.current.style.transform = `scaleX(${v / 100})`;
      if (cifra.current) cifra.current.textContent = `${String(Math.round(v)).padStart(3, '0')}%`;

      if (escrito >= 1 && finCarga) finish();
    };

    const finish = () => {
      if (!alive || done.current) return;
      done.current = true;
      cancelAnimationFrame(frame);
      if (trazo.current) trazo.current.textContent = LOGO_ASCII;
      if (caret.current) caret.current.style.opacity = '0';
      if (barra.current) barra.current.style.transform = 'scaleX(1)';
      if (cifra.current) cifra.current.textContent = '100%';
      setLabel('listo');
      window.setTimeout(() => {
        if (!alive) return;
        setLeaving(true);
        window.setTimeout(() => alive && onDone(), reduced ? 0 : 620);
      }, 220);
    };

    /* Tope duro: pase lo que pase, la página entra. */
    const bail = window.setTimeout(() => {
      finCarga = true;
      escrito = 1;
      finish();
    }, 7500);

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
        carga = Math.round(((i + 1) / STEPS.length) * 92) + 6;
      }
      window.clearTimeout(bail);
      carga = 100;
      finCarga = true;
      /* Y si el dibujo ya estaba hecho, se sale ahora mismo. */
      if (escrito >= 1) finish();
    })();

    frame = requestAnimationFrame(pinta);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
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
      <BootRain />

      <div className="boot__core">
        {/* El monograma se escribe, no aparece: renglón a renglón, como una
            terminal. El texto completo va debajo en un hueco invisible para
            que el trazado no cambie de sitio conforme crece. */}
        <div className="boot__ascii" style={{ '--cols': ASCII_COLS }} aria-hidden="true">
          <pre className="boot__ascii-ghost">{LOGO_ASCII}</pre>
          <pre className="boot__ascii-live">
            <span ref={trazo} />
            <i className="boot__caret" ref={caret} />
          </pre>
        </div>
        <p className="boot__name">MORPHIQ OS</p>
      </div>

      <div className="boot__foot">
        <div className="boot__track" aria-hidden="true">
          <span ref={barra} style={{ transform: 'scaleX(0.06)' }} />
        </div>
        <div className="boot__meta">
          <span>cargando {label}</span>
          <strong ref={cifra}>006%</strong>
        </div>
      </div>
    </Motion.div>
  );
}
