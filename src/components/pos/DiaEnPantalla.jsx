/**
 * ============================================================
 * UN DÍA EN MORPHIQPOS — la demostración que avanza con el scroll
 * ============================================================
 *
 * Parte del patrón «lista de funciones + panel fijo» (Features With Panel,
 * del catálogo de 21st.dev), pero con dos cambios de fondo:
 *
 *   · el panel no enseña imágenes: enseña la pantalla del sistema
 *     funcionando, con un cursor que la opera
 *   · no se elige con clic sino bajando. La lista ES el día: abrir, tomar
 *     la orden, cocinar, cobrar, cerrar, revisar. El orden importa, y el
 *     scroll es la forma natural de recorrer algo que pasa en orden.
 *
 * NO SE SECUESTRA LA RUEDA
 * El panel es `position: sticky`, nada más. Quien baja rápido ve pasar las
 * seis pantallas y sigue; quien baja despacio las ve trabajar. No hay
 * tramos fijados ni scroll horizontal disfrazado.
 *
 * EN TELÉFONO ES OTRA COMPOSICIÓN
 * Un panel fijo en una pantalla de 390 px se come la mitad del alto y deja
 * el texto en una rendija. Ahí cada momento lleva su propia pantalla encima,
 * y la pantalla corre cuando entra en vista.
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';

import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { PANTALLAS_DIA } from './pantallas';
import { POS_DIA } from '../../content/morphiqpos';

/* Lo que «dice» el sistema en cada momento. Una línea de bitácora en
   monoespaciada: es el arte ASCII más honesto que hay en la página, porque
   es literalmente lo que un sistema escribe cuando trabaja. */
const BITACORA = {
  mesas: 'mesa 07 abierta  ·  4 personas  ·  mesero 2',
  orden: 'orden #128  ->  3 platillos  ·  $330.00',
  cocina: 'comanda #128  ->  cocina + bebidas  ·  OK',
  cobro: 'cobro #128  ·  tarjeta 300 + efectivo 200  ·  cambio 27',
  corte: 'corte caja 1  ·  esperado 18420  contado 18420  ·  dif 0',
  tablero: 'venta del dia 18420  ·  96 tickets  ·  1 alerta',
};

function Momento({ momento, indice, total, activo, conPantalla, negocio, refPaso }) {
  const Pantalla = PANTALLAS_DIA[momento.id];
  return (
    <li ref={refPaso} data-indice={indice} className={`dia-paso ${activo ? 'is-activo' : ''}`}>
      {conPantalla && (
        /* La pantalla es una ilustración de lo que dice el texto de abajo:
           para un lector de pantalla sería ruido —precios, mesas, botones
           que no se pueden pulsar—, así que queda fuera del árbol. */
        <div className="dia-paso__pantalla" aria-hidden="true">
          <Pantalla negocio={negocio} />
        </div>
      )}
      <p className="dia-paso__meta">
        <span className="dia-paso__num">
          [{String(indice + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}]
        </span>
        <span className="dia-paso__hora">{momento.hora}</span>
      </p>
      <h3 className="dia-paso__titulo">{momento.titulo}</h3>
      <p className="dia-paso__cuerpo">{momento.cuerpo}</p>
      <ul className="dia-paso__puntos">
        {momento.puntos.map((punto) => (
          <li key={punto}>{punto}</li>
        ))}
      </ul>
    </li>
  );
}

export function DiaEnPantalla({ negocio = 'La Terraza' }) {
  const ancho = useMediaQuery('(min-width: 1000px)');
  const sinMovimiento = useReducedMotion();
  const [activo, setActivo] = useState(0);
  const pasos = useRef([]);

  /* Activo es el momento que cruza la franja central de la ventana. La
     franja es estrecha a propósito —el 10 % del alto—: con una más ancha
     dos momentos cumplen a la vez y la pantalla parpadea entre los dos. */
  useEffect(() => {
    if (!ancho) return undefined;
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setActivo(Number(e.target.dataset.indice));
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    pasos.current.forEach((n) => n && io.observe(n));
    return () => io.disconnect();
  }, [ancho]);

  const momento = POS_DIA[activo];
  const Pantalla = PANTALLAS_DIA[momento.id];

  return (
    <div className={`dia ${ancho ? 'dia--fijo' : 'dia--apilado'}`}>
      <ol className="dia__pasos">
        {POS_DIA.map((m, i) => (
          <Momento
            key={m.id}
            momento={m}
            indice={i}
            total={POS_DIA.length}
            activo={ancho ? i === activo : true}
            conPantalla={!ancho}
            negocio={negocio}
            refPaso={(n) => {
              pasos.current[i] = n;
            }}
          />
        ))}
      </ol>

      {ancho && (
        <div className="dia__riel" aria-hidden="true">
          <div className="dia__marco">
            {/* La hora del día, como la barra de un reproductor: dónde vas. */}
            <ol className="dia__horas">
              {POS_DIA.map((m, i) => (
                <li key={m.id} className={i === activo ? 'is-activa' : i < activo ? 'is-pasada' : ''}>
                  {m.hora}
                </li>
              ))}
            </ol>

            <div className="dia__pantalla">
              <AnimatePresence initial={false}>
                <Motion.div
                  key={momento.id}
                  className="dia__capa"
                  initial={sinMovimiento ? false : { opacity: 0, scale: 1.035, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={sinMovimiento ? { opacity: 0 } : { opacity: 0, scale: 0.975, filter: 'blur(12px)' }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Pantalla negocio={negocio} />
                </Motion.div>
              </AnimatePresence>
            </div>

            <p className="dia__bitacora">
              <span>&gt;</span>
              <span key={momento.id} className="dia__linea">
                {momento.hora} {BITACORA[momento.id]}
              </span>
              <i />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
