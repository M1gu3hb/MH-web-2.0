/**
 * ============================================================
 * CAJA VIVA — la pantalla del personalizador, pero de verdad
 * ============================================================
 *
 * Hasta ahora el personalizador enseñaba una pantalla quieta con la piel
 * que el visitante elegía. Se veía su marca; no se sentía suya. Aquí la
 * pantalla se usa: se tocan los productos, se arma la cuenta, se cobra y
 * sale el ticket con el nombre que escribió y su color.
 *
 * Es el mismo marco del sistema (`MarcoPos`) y las mismas clases de la
 * pantalla de órdenes, así que la piel —color, estilo, modo— le llega igual
 * que a las demostraciones. Lo que cambia es que aquí todo son botones.
 *
 * ACCESIBILIDAD
 * · Cada producto es un botón con su nombre y su precio en la etiqueta.
 * · Quitar es otro botón, hermano del de agregar, no uno dentro de otro.
 * · El ticket se anuncia (`role="status"`) y mientras está en pantalla lo de
 *   debajo queda inerte: el foco pasa a «Nueva venta».
 * · Con movimiento reducido el ticket aparece puesto, sin imprimirse.
 *
 * EN TELÉFONO
 * La pantalla del sistema es apaisada y las demostraciones la resuelven con
 * una cámara que sigue al cursor. Aquí no hay cursor: es el dedo del
 * visitante. Así que se reordena en vertical —productos arriba, total y
 * cobro debajo— y cabe entera sin deslizar.
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { Banknote, CreditCard, Minus, Printer, RotateCcw } from 'lucide-react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Cifra, MarcoPos, pesos } from './kit';
import { PLATILLOS } from './pantallas';

const TOPE = 9;
const hora = new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit' });
const centavos = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function CajaViva({ negocio, estilo }) {
  const sinMovimiento = useReducedMotion();
  const [cuenta, setCuenta] = useState({});
  const [pago, setPago] = useState('efectivo');
  const [ticket, setTicket] = useState(null);
  const folio = useRef(128);
  const botonNueva = useRef(null);

  const lineas = PLATILLOS.filter((p) => cuenta[p.id]).map((p) => ({
    id: p.id,
    nombre: p.nombre,
    cantidad: cuenta[p.id],
    importe: p.precio * cuenta[p.id],
  }));
  const total = lineas.reduce((s, l) => s + l.importe, 0);
  const piezas = lineas.reduce((s, l) => s + l.cantidad, 0);

  const mover = (id, cuanto) =>
    setCuenta((c) => {
      const n = Math.max(0, Math.min(TOPE, (c[id] ?? 0) + cuanto));
      const siguiente = { ...c, [id]: n };
      if (!n) delete siguiente[id];
      return siguiente;
    });

  const cobrar = () => {
    if (!total) return;
    folio.current += 1;
    setTicket({ folio: folio.current, hora: hora.format(new Date()), lineas, total, pago });
  };

  const nuevaVenta = () => {
    setTicket(null);
    setCuenta({});
  };

  /* Con el ticket en pantalla lo demás queda inerte: el foco va al único
     botón que hace algo. `preventScroll` porque en teléfono la pantalla va
     pegada arriba y un salto de scroll la sacaría de la vista. */
  useEffect(() => {
    if (ticket) botonNueva.current?.focus({ preventScroll: true });
  }, [ticket]);

  const inerte = ticket ? '' : undefined;
  const inicial = (negocio.trim()[0] ?? 'M').toUpperCase();

  return (
    <MarcoPos negocio={negocio} seccion="Caja" turno="Caja 1" hora="13:41" estilo={estilo} className="pv--viva">
      {/* `--lineas` deja que en teléfono la pantalla crezca lo justo para que
          el ticket quepa entero, tenga dos renglones o seis. */}
      <div className="pv-orden pv-viva" data-ticket={ticket ? '' : undefined} style={ticket ? { '--lineas': ticket.lineas.length } : undefined}>
        <div className="pv-orden__carta" inert={inerte}>
          <p className="pv-viva__pista">Toca un producto para agregarlo a la cuenta.</p>
          <div className="pv-orden__rejilla">
            {PLATILLOS.map((p) => {
              const n = cuenta[p.id] ?? 0;
              return (
                <div key={p.id} className={`pv-platillo ${n ? 'is-en-cuenta' : ''}`}>
                  <button
                    type="button"
                    className="pv-viva__agregar"
                    onClick={() => mover(p.id, 1)}
                    disabled={n >= TOPE}
                    aria-label={`Agregar ${p.nombre}, ${pesos(p.precio)}${n ? `. Llevas ${n}` : ''}`}
                  >
                    <i style={{ '--tono': p.tono }} aria-hidden="true" />
                    <b>{p.nombre}</b>
                    <span>{pesos(p.precio)}</span>
                  </button>
                  {n > 0 && (
                    <div className="pv-viva__cuantos">
                      <button type="button" className="pv-viva__quitar" onClick={() => mover(p.id, -1)} aria-label={`Quitar un ${p.nombre}`}>
                        <Minus size="1.1em" aria-hidden="true" />
                      </button>
                      <em aria-hidden="true">{n}</em>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="pv-orden__cuenta" inert={inerte} aria-label="Cuenta">
          <header>
            <b>Venta</b>
            <span>{piezas === 1 ? '1 artículo' : `${piezas} artículos`}</span>
          </header>
          <ul>
            <AnimatePresence initial={false}>
              {lineas.map((l) => (
                <Motion.li
                  key={l.id}
                  layout={!sinMovimiento}
                  initial={sinMovimiento ? false : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18, transition: { duration: 0.16 } }}
                  transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                >
                  <span>
                    {l.cantidad} × {l.nombre}
                  </span>
                  <b>{pesos(l.importe)}</b>
                </Motion.li>
              ))}
            </AnimatePresence>
            {lineas.length === 0 && <li className="pv-vacio">Aún no hay nada en la cuenta</li>}
          </ul>
          <footer>
            <span>Total</span>
            <Cifra valor={total} className="pv-total" />
          </footer>
          <div className="pv-viva__pagos" role="group" aria-label="Forma de pago">
            <button type="button" className="pv-viva__pago" aria-pressed={pago === 'efectivo'} onClick={() => setPago('efectivo')}>
              <Banknote size="1.2em" aria-hidden="true" />
              Efectivo
            </button>
            <button type="button" className="pv-viva__pago" aria-pressed={pago === 'tarjeta'} onClick={() => setPago('tarjeta')}>
              <CreditCard size="1.2em" aria-hidden="true" />
              Tarjeta
            </button>
          </div>
          <button type="button" className="pv-boton pv-boton--ancho pv-viva__cobrar" onClick={cobrar} disabled={!total}>
            <Printer size="1.1em" aria-hidden="true" />
            {total ? `Cobrar ${pesos(total)}` : 'Cobrar'}
          </button>
        </aside>

        <AnimatePresence>
          {ticket && (
            <Motion.div key="velo" className="pv-viva__velo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Motion.div
                className="pv-viva__ticket"
                role="status"
                initial={sinMovimiento ? false : { y: '-108%' }}
                animate={{ y: '0%' }}
                exit={sinMovimiento ? { opacity: 0 } : { y: '14%', opacity: 0, transition: { duration: 0.22 } }}
                transition={{ duration: 1.15, ease: [0.3, 0, 0.2, 1] }}
              >
                <header>
                  <i aria-hidden="true">{inicial}</i>
                  <strong>{negocio}</strong>
                </header>
                <p className="pv-viva__dato">
                  <span>Venta #{ticket.folio}</span>
                  <span>{ticket.hora}</span>
                </p>
                <ul>
                  {ticket.lineas.map((l) => (
                    <li key={l.id}>
                      <span>
                        {l.cantidad} {l.nombre}
                      </span>
                      <b>{centavos.format(l.importe)}</b>
                    </li>
                  ))}
                </ul>
                <p className="pv-viva__total">
                  <span>Total</span>
                  <b>{pesos(ticket.total)}</b>
                </p>
                <p className="pv-viva__dato">
                  <span>Pago</span>
                  <span>{ticket.pago === 'tarjeta' ? 'Tarjeta' : 'Efectivo'}</span>
                </p>
                <p className="pv-viva__gracias">Gracias por tu compra</p>
              </Motion.div>

              <Motion.button
                ref={botonNueva}
                type="button"
                className="pv-boton pv-viva__nueva"
                onClick={nuevaVenta}
                initial={sinMovimiento ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sinMovimiento ? 0 : 0.9, duration: 0.3 }}
              >
                <RotateCcw size="1.1em" aria-hidden="true" />
                Nueva venta
              </Motion.button>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </MarcoPos>
  );
}
