/**
 * ============================================================
 * GIROS — un sistema, muchos negocios
 * ============================================================
 *
 * Cinco pestañas, cinco pantallas distintas del MISMO sistema. La lista de
 * la izquierda es un `tablist` de verdad: flechas, Inicio y Fin, y un solo
 * punto de tabulación.
 *
 * Avanza sola mientras nadie la toca, para que quien solo está bajando vea
 * que hay más de un negocio. En cuanto alguien elige una pestaña deja de
 * avanzar: si la escena cambia sola después de que elegiste, lo que
 * aprendes es que tus toques no importan.
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { POS_GIROS } from '../../content/morphiqpos';
import { PantallaMesas } from './pantallas';
import { PantallaAgenda, PantallaBarra, PantallaMedida, PantallaTienda } from './pantallas-giros';

const PANTALLAS = {
  restaurante: (p) => <PantallaMesas negocio="Tepalcate" {...p} />,
  cafeteria: PantallaBarra,
  tienda: PantallaTienda,
  ferreteria: PantallaMedida,
  estetica: PantallaAgenda,
};

const CADA = 9000;

export function Giros() {
  const sinMovimiento = useReducedMotion();
  const [activo, setActivo] = useState(0);
  const [manual, setManual] = useState(false);
  const [aLaVista, setALaVista] = useState(false);
  const caja = useRef(null);
  const pestanas = useRef([]);

  useEffect(() => {
    const nodo = caja.current;
    if (!nodo) return undefined;
    const io = new IntersectionObserver(([e]) => setALaVista(e.isIntersecting), { threshold: 0.3 });
    io.observe(nodo);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (manual || !aLaVista || sinMovimiento) return undefined;
    const reloj = setTimeout(() => setActivo((a) => (a + 1) % POS_GIROS.length), CADA);
    return () => clearTimeout(reloj);
  }, [activo, manual, aLaVista, sinMovimiento]);

  const elegir = (i, enfocar = false) => {
    setManual(true);
    setActivo(i);
    if (enfocar) pestanas.current[i]?.focus();
  };

  const alTeclear = (e) => {
    const n = POS_GIROS.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      elegir((activo + 1) % n, true);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      elegir((activo - 1 + n) % n, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      elegir(0, true);
    } else if (e.key === 'End') {
      e.preventDefault();
      elegir(n - 1, true);
    }
  };

  const giro = POS_GIROS[activo];
  const Pantalla = PANTALLAS[giro.id];

  return (
    <div ref={caja} className="giros">
      <div className="giros__lista" role="tablist" aria-label="Tipos de negocio" aria-orientation="vertical" onKeyDown={alTeclear}>
        {POS_GIROS.map((g, i) => (
          <button
            key={g.id}
            ref={(n) => {
              pestanas.current[i] = n;
            }}
            type="button"
            role="tab"
            id={`giro-pestana-${g.id}`}
            aria-selected={i === activo}
            aria-controls="giro-panel"
            tabIndex={i === activo ? 0 : -1}
            className={`giro-pestana ${i === activo ? 'is-activa' : ''}`}
            onClick={() => elegir(i)}
          >
            {/* El dibujo es decoración: el nombre ya está escrito al lado. */}
            <pre className="giro-pestana__arte" aria-hidden="true">
              {g.arte.join('\n')}
            </pre>
            <span className="giro-pestana__texto">
              <strong>{g.nombre}</strong>
              <span>{g.lema}</span>
            </span>
            {/* La barra de tiempo solo existe mientras avanza sola. */}
            {i === activo && !manual && aLaVista && !sinMovimiento && (
              <i className="giro-pestana__tiempo" style={{ '--dura': `${CADA}ms` }} aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      <div className="giros__panel" role="tabpanel" id="giro-panel" aria-labelledby={`giro-pestana-${giro.id}`} tabIndex={0}>
        <div className="giros__pantalla" aria-hidden="true">
          <AnimatePresence mode="popLayout" initial={false}>
            <Motion.div
              key={giro.id}
              initial={sinMovimiento ? false : { opacity: 0, y: 18, scale: 0.97, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={sinMovimiento ? { opacity: 0 } : { opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Pantalla />
            </Motion.div>
          </AnimatePresence>
        </div>
        <div className="giros__pie">
          <p className="giros__cuerpo">{giro.cuerpo}</p>
          <ul className="giros__modulos">
            {giro.modulos.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
