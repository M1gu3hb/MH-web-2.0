/**
 * ============================================================
 * CARRETE — el sistema enseñándose solo
 * ============================================================
 *
 * Cuatro pantallas del día que se relevan sin que nadie toque nada. Cada
 * una se queda exactamente lo que dura su historia: el relevo llega cuando
 * el cobro ya se cobró, no a mitad.
 *
 * Las pestañas de abajo dicen cuál se está viendo y dejan saltar a otra.
 * Al elegir una a mano el carrete sigue desde ahí; no se «bloquea», porque
 * aquí no hay nada que leer con calma: es un escaparate.
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { DURACION_DIA, PANTALLAS_DIA } from './pantallas';

const ORDEN = [
  { id: 'mesas', etiqueta: 'Mesas' },
  { id: 'orden', etiqueta: 'Orden' },
  { id: 'cobro', etiqueta: 'Cobro' },
  { id: 'tablero', etiqueta: 'Tablero' },
];

export function Carrete({ negocio = 'Tepalcate' }) {
  const sinMovimiento = useReducedMotion();
  const caja = useRef(null);
  const [activo, setActivo] = useState(0);
  const [aLaVista, setALaVista] = useState(false);

  useEffect(() => {
    const nodo = caja.current;
    if (!nodo) return undefined;
    const io = new IntersectionObserver(([e]) => setALaVista(e.isIntersecting), { threshold: 0.25 });
    io.observe(nodo);
    return () => io.disconnect();
  }, []);

  const actual = ORDEN[activo];
  const dura = DURACION_DIA[actual.id];
  const corre = aLaVista && !sinMovimiento;

  useEffect(() => {
    if (!corre) return undefined;
    const reloj = setTimeout(() => setActivo((a) => (a + 1) % ORDEN.length), dura);
    return () => clearTimeout(reloj);
  }, [corre, activo, dura]);

  const Pantalla = PANTALLAS_DIA[actual.id];

  return (
    <div ref={caja} className="carrete">
      <div className="carrete__pantalla" aria-hidden="true">
        <AnimatePresence initial={false}>
          <Motion.div
            key={actual.id}
            className="carrete__capa"
            initial={sinMovimiento ? false : { opacity: 0, scale: 1.04, filter: 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={sinMovimiento ? { opacity: 0 } : { opacity: 0, scale: 0.97, filter: 'blur(14px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Pantalla negocio={negocio} />
          </Motion.div>
        </AnimatePresence>
      </div>

      <div className="carrete__pestanas" role="group" aria-label="Pantallas de la demostración">
        {ORDEN.map((o, i) => (
          <button
            key={o.id}
            type="button"
            className={`carrete__pestana ${i === activo ? 'is-activa' : ''}`}
            aria-pressed={i === activo}
            onClick={() => setActivo(i)}
          >
            <span>{o.etiqueta}</span>
            {i === activo && corre && <i key={`${o.id}-${activo}`} style={{ '--dura': `${dura}ms` }} aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  );
}
