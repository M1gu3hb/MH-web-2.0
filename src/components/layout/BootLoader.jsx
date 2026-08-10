import { useEffect, useRef, useState } from 'react';
import { motion as Motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* Lo que el hero necesita el primer fotograma. Se descarga Y se descodifica
   aquí, mientras la marca se presenta: si solo se descargara, el navegador
   pagaría la descodificación —que en un teléfono son decenas de milisegundos
   por imagen— justo al entrar, y es lo que hacía que la página apareciera a
   trompicones. Para eso está una pantalla de carga. */
const ESENCIALES = [
  '/marca/lockup-apilado.webp',
  '/marca/simbolo-v2-md.webp',
  '/marca/simbolo-solido.webp',
  '/marca/lockup-horizontal.webp',
  '/marca/nombre.webp',
];

const STEPS = [
  ['tipografías', () => document.fonts?.ready ?? Promise.resolve()],
  ['identidad', () => Promise.all(ESENCIALES.map(preloadImage))],
  ['interfaz', () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))],
];

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      /* `decode` deja el bitmap listo para pintar. Si no existe o falla, se
         sigue igual: nunca puede impedir entrar. */
      if (img.decode) img.decode().then(resolve, resolve);
      else resolve();
    };
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
        <Motion.div
          className="boot__arte"
          {...paso}
          transition={{ duration: 1.05, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            className="boot__lockup"
            src="/marca/lockup-apilado.webp"
            alt=""
            width="960"
            height="1049"
          />
          {/* El reflejo del metal: una franja de luz cruza el lockup de
              izquierda a derecha, recortada a su silueta con la máscara. */}
          <span className="boot__brillo" aria-hidden="true" />
        </Motion.div>
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
