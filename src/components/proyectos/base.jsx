/**
 * ============================================================
 * EL ANDAMIO DE LAS DEMOSTRACIONES DE PROYECTO
 * ============================================================
 *
 * Cada proyecto del portafolio lleva una escena que enseña qué hace, usada
 * de verdad: alguien elige un paquete, registra un pago, mueve una mesa. Son
 * las mismas tres reglas de las escenas de servicio (`components/escenas`):
 * nada cambia solo, todo entra con muelle, pocas piezas y grandes.
 *
 * LO QUE CAMBIA RESPECTO A AQUELLAS
 * · El cursor ya no lleva coordenadas escritas a mano. Cada acción nombra su
 *   destino (`{ a: 'cobrar' }`) y el andamio busca en la escena el nodo con
 *   `data-t="cobrar"` y mide dónde está. Mover un botón no descuadra nada, y
 *   no hay una tabla de porcentajes que mantener por cada una de las
 *   diecinueve escenas.
 * · Cada escena lleva un rótulo: una frase corta que dice qué está pasando
 *   en este momento. Una interfaz ajena, vista tres segundos y en pequeño,
 *   no se explica sola; con la frase debajo, sí.
 * · Al terminar la vuelta la capa entera se monta de nuevo, así que el
 *   reinicio es una entrada limpia y no un rebobinado a la vista.
 *
 * Son decoración: el marco que las contiene va con `aria-hidden` y lo que
 * cuentan ya está escrito en la ficha del proyecto.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { Check, CheckCheck } from 'lucide-react';

import { Cursor, useGuion } from '../pos/kit';
import './base.css';

export const MUELLE = { type: 'spring', stiffness: 420, damping: 24 };
export const REBOTE = { type: 'spring', stiffness: 520, damping: 17 };
export const POP = {
  initial: { opacity: 0, scale: 0.6, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.85 },
  transition: REBOTE,
};
export const SUBE = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: MUELLE,
};

/* ------------------------------------------------------------
   guion
   ------------------------------------------------------------
   De una lista de acciones a una lista de pasos con duración.

     { a: 'nombre', marca?, ir?, pulsar? }   ir al nodo `data-t` y pulsarlo
     { espera, marca? }                       dejar respirar la escena

   Ir y pulsar son dos pasos: el clic ocurre cuando el cursor ya llegó.
   `marca` nombra el paso en el que la acción queda hecha.
   ------------------------------------------------------------ */
export function guion(acciones) {
  const pasos = [];
  const marcas = {};
  let a = null;
  for (const accion of acciones) {
    if (accion.espera) {
      pasos.push({ a, ms: accion.espera, clic: false });
    } else {
      a = accion.a;
      pasos.push({ a, ms: accion.ir ?? 700, clic: false });
      pasos.push({ a, ms: accion.pulsar ?? 560, clic: true });
    }
    if (accion.marca) marcas[accion.marca] = pasos.length - 1;
  }
  return { pasos, marcas, duraciones: pasos.map((p) => p.ms) };
}

/* ------------------------------------------------------------
   useEscena
   ------------------------------------------------------------ */
export function useEscena(g) {
  const caja = useRef(null);
  const [paso] = useGuion(g.duraciones, { ref: caja });
  const [pos, setPos] = useState({ x: 50, y: 62 });
  const [vuelta, setVuelta] = useState(0);
  const previo = useRef(0);
  const p = g.pasos[paso];

  /* Volver al paso cero desde cualquier otro es empezar otra vuelta. */
  useEffect(() => {
    if (paso === 0 && previo.current !== 0) setVuelta((v) => v + 1);
    previo.current = paso;
  }, [paso]);

  /* Dónde está el destino, en porcentaje del lienzo. Se mide al llegar a
     cada paso y no antes: lo que el cursor va a pulsar puede haber entrado
     o haberse movido en el paso anterior. */
  useLayoutEffect(() => {
    const raiz = caja.current;
    if (!raiz || !p.a) return;
    const lienzo = raiz.querySelector('.pe__lienzo');
    const nodo = raiz.querySelector(`[data-t="${p.a}"]`);
    if (!lienzo || !nodo) return;
    const L = lienzo.getBoundingClientRect();
    const N = nodo.getBoundingClientRect();
    if (!L.width || !N.width) return;
    setPos({
      x: ((N.left + N.width / 2 - L.left) / L.width) * 100,
      y: ((N.top + N.height * 0.56 - L.top) / L.height) * 100,
    });
  }, [paso, p.a]);

  return {
    caja,
    paso,
    vuelta,
    pos,
    clic: p.clic ? paso + 1 : 0,
    sinDestino: p.a == null,
    ya: (m) => paso >= g.marcas[m],
    en: (m) => paso === g.marcas[m],
    /* El destino que el cursor está pulsando ahora mismo, para hundirlo. */
    pulsando: p.clic ? p.a : null,
  };
}

/* ------------------------------------------------------------
   Marco — la caja de toda escena
   ------------------------------------------------------------
   `etapas` es la lista de rótulos: `[marca, frase]`, con `0` como marca del
   primero. El lienzo es siempre 16:10 y se centra en el marco que le toque,
   sea la tarjeta del índice, la destacada o la cabecera del caso; lo que
   sobre lo rellena el fondo de la escena.
   ------------------------------------------------------------ */
export function Marco({ e, clase = '', etapas, children, dedo = false, sinCursor = false }) {
  const actual = etapas.reduce((i, [marca], k) => (marca === 0 || e.ya(marca) ? k : i), 0);
  return (
    <div ref={e.caja} className={`pe ${clase}`}>
      <div className="pe__lienzo">
        <div key={e.vuelta} className="pe__capa">
          {children}
        </div>
        <Rotulo n={actual} total={etapas.length} texto={etapas[actual][1]} />
        {!sinCursor && <Cursor x={e.pos.x} y={e.pos.y} pulsa={e.clic} dedo={dedo} oculto={e.sinDestino} />}
      </div>
    </div>
  );
}

function Rotulo({ n, total, texto }) {
  return (
    <div className="pe-rotulo">
      <span className="pe-rotulo__n">
        {n + 1}
        <i>/{total}</i>
      </span>
      <span className="pe-rotulo__caja">
        <AnimatePresence mode="popLayout" initial={false}>
          <Motion.span
            key={texto}
            className="pe-rotulo__t"
            initial={{ opacity: 0, y: '0.7em', filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: '-0.7em', filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {texto}
          </Motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------
   Piezas compartidas
   ------------------------------------------------------------ */

/* Una ventana de navegador: tres puntos, la dirección y el cuerpo. */
export function Ventana({ url, clase = '', children, extra }) {
  return (
    <div className={`pe-ventana ${clase}`}>
      <div className="pe-ventana__barra">
        <i />
        <i />
        <i />
        <span>{url}</span>
        {extra}
      </div>
      <div className="pe-ventana__cuerpo">{children}</div>
    </div>
  );
}

/* Un teléfono. */
export function Telefono({ clase = '', children, ...resto }) {
  return (
    <Motion.div className={`pe-tel ${clase}`} {...resto}>
      <i className="pe-tel__isla" />
      <div className="pe-tel__pantalla">{children}</div>
    </Motion.div>
  );
}

/* El texto que se escribe solo. Devuelve lo escrito hasta ahora. */
export function useTecleo(texto, activo, ms = 34) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!activo) {
      setN(0);
      return undefined;
    }
    if (n >= texto.length) return undefined;
    const reloj = setTimeout(() => setN((v) => v + 1), ms);
    return () => clearTimeout(reloj);
  }, [activo, n, texto, ms]);
  return texto.slice(0, n);
}

/* El mensaje que llega a WhatsApp ya escrito: es el final de casi todos los
   sitios del portafolio, así que tiene una sola forma. */
export function Mensaje({ texto, visible, clase = '' }) {
  const escrito = useTecleo(texto, visible, 26);
  const listo = escrito.length >= texto.length;
  return (
    <AnimatePresence>
      {visible && (
        <Motion.div className={`pe-wa ${clase}`} {...POP}>
          <span className="pe-wa__quien">
            <i />
            WhatsApp
          </span>
          <p>
            {escrito}
            {!listo && <b className="pe-cursor-texto" />}
          </p>
          <span className={`pe-wa__visto ${listo ? 'is-listo' : ''}`}>
            <CheckCheck size="1.15em" aria-hidden="true" />
          </span>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

/* Unas barras de ecualizador. Se mueven solo con `vivo`. */
export function Barras({ n = 14, vivo = false, clase = '' }) {
  return (
    <span className={`pe-barras ${vivo ? 'is-vivo' : ''} ${clase}`}>
      {Array.from({ length: n }, (_, i) => (
        <i key={i} style={{ '--i': i, '--h': `${38 + ((i * 53) % 62)}%` }} />
      ))}
    </span>
  );
}

/* El aviso de «hecho» que cierra una acción. */
export function Hecho({ visible, children, clase = '' }) {
  return (
    <AnimatePresence>
      {visible && (
        <Motion.span className={`pe-hecho ${clase}`} {...POP}>
          <Check size="1.05em" aria-hidden="true" />
          {children}
        </Motion.span>
      )}
    </AnimatePresence>
  );
}
