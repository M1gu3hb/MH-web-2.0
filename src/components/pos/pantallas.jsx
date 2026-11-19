/**
 * ============================================================
 * LAS PANTALLAS DE MORPHIQPOS
 * ============================================================
 *
 * Seis momentos de un día de operación, dibujados con HTML de verdad —no
 * capturas— para que escalen, se puedan tematizar y pesen lo que pesa un
 * poco de texto. Lo que enseñan sale de lo que el sistema hace: mapa de
 * mesas, opciones con precio, estaciones de cocina, pago mixto con propina,
 * arqueo por forma de pago y el tablero del dueño.
 *
 * Los datos son los de un restaurante de ejemplo inventado. No es ningún
 * cliente: es el negocio de muestra de la demostración.
 *
 * Todas aceptan `activo`. Solo la pantalla activa corre su guion; las demás
 * esperan quietas. Y todas enseñan lo mismo con movimiento reducido: su
 * último paso, que es el que cuenta la historia entera en una imagen.
 */

import { useRef } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { Check, ChefHat, Clock3, CreditCard, Banknote, Landmark, Printer, TriangleAlert, Users } from 'lucide-react';

import { Cifra, Cursor, MarcoPos, armarGuion, pesos, useGuion } from './kit';

const MUELLE = { type: 'spring', stiffness: 420, damping: 26 };
const ENTRA = { opacity: 0, y: 10, scale: 0.94 };
const ESTA = { opacity: 1, y: 0, scale: 1 };

/* ============================================================
   01 · MESAS
   ============================================================ */

const MESAS = [
  { n: 1, estado: 'comiendo', nota: '32 min', personas: 2 },
  { n: 2, estado: 'libre' },
  { n: 3, estado: 'cocina', nota: 'En cocina', personas: 4 },
  { n: 4, estado: 'cuenta', nota: 'Pidió cuenta', personas: 3 },
  { n: 5, estado: 'libre' },
  { n: 6, estado: 'comiendo', nota: '18 min', personas: 2 },
  { n: 7, estado: 'libre' },
  { n: 8, estado: 'comiendo', nota: '41 min', personas: 6 },
  { n: 9, estado: 'libre' },
  { n: 10, estado: 'cocina', nota: 'En cocina', personas: 2 },
  { n: 11, estado: 'libre' },
  { n: 12, estado: 'comiendo', nota: '9 min', personas: 4 },
];

const G_MESAS = armarGuion([
  { espera: 900 },
  { x: 68.3, y: 50, marca: 'elegida' },
  { x: 61.8, y: 83, marca: 'abierta', ir: 720 },
  { espera: 1100, marca: 'lista' },
  { espera: 1700 },
]);

export function PantallaMesas({ activo = true, fijo, negocio, estilo }) {
  const caja = useRef(null);
  const [paso] = useGuion(G_MESAS.duraciones, { activo, ref: caja, fijo, quieto: G_MESAS.ultimo });
  const ya = (m) => paso >= G_MESAS.marcas[m];
  const p = G_MESAS.pasos[paso];

  const estadoDe = (m) => {
    if (m.n === 7 && ya('abierta')) return { ...m, estado: 'ordenando', nota: 'Ordenando', personas: 4 };
    if (m.n === 3 && ya('lista')) return { ...m, estado: 'lista', nota: 'Lista' };
    return m;
  };

  return (
    <MarcoPos refCaja={caja} negocio={negocio} seccion="Mesas" turno="Mesero 2" hora="13:02" estilo={estilo} foco={p.x} fijo={fijo != null}>
      <div className="pv-mesas">
        <aside className="pv-mesas__lado">
          <span className="pv-chip is-activo">Salón</span>
          <span className="pv-chip">Terraza</span>
          <span className="pv-chip">Barra</span>
          <ul className="pv-leyenda">
            <li className="es-libre">Libre</li>
            <li className="es-ordenando">Ordenando</li>
            <li className="es-cocina">En cocina</li>
            <li className="es-lista">Lista</li>
            <li className="es-cuenta">Cuenta</li>
          </ul>
        </aside>

        <div className="pv-mesas__mapa">
          {MESAS.map(estadoDe).map((m) => (
            <Motion.div
              key={m.n}
              className={`pv-mesa es-${m.estado} ${m.n === 7 && ya('elegida') && !ya('abierta') ? 'is-elegida' : ''}`}
              animate={m.estado === 'lista' || m.estado === 'ordenando' ? { scale: [1, 1.09, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <b>{m.n}</b>
              <span>{m.nota ?? 'Libre'}</span>
              {m.personas ? (
                <i>
                  <Users size="1em" aria-hidden="true" />
                  {m.personas}
                </i>
              ) : null}
            </Motion.div>
          ))}

          <AnimatePresence>
            {ya('elegida') && !ya('abierta') && (
              <Motion.div className="pv-flotante pv-mesas__abrir" initial={ENTRA} animate={ESTA} exit={{ opacity: 0, scale: 0.94 }} transition={MUELLE}>
                <strong>Mesa 7</strong>
                <span className="pv-personas">
                  {[2, 3, 4, 5].map((n) => (
                    <em key={n} className={n === 4 ? 'is-activo' : ''}>
                      {n}
                    </em>
                  ))}
                </span>
                <span className="pv-boton">Abrir mesa</span>
              </Motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {ya('lista') && (
              <Motion.div className="pv-aviso" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={MUELLE}>
                <Check size="1.1em" aria-hidden="true" /> Mesa 3 lista para entregar
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} oculto={fijo != null} />
      </div>
    </MarcoPos>
  );
}

/* ============================================================
   02 · LA ORDEN
   ============================================================ */

const PLATILLOS = [
  { id: 'tacos', nombre: 'Tacos de sirloin', precio: 145, tono: '#c96a3a' },
  { id: 'enchiladas', nombre: 'Enchiladas', precio: 132, tono: '#5f9d4c' },
  { id: 'sopa', nombre: 'Sopa de tortilla', precio: 78, tono: '#d08a2e' },
  { id: 'guacamole', nombre: 'Guacamole', precio: 95, tono: '#7fb24a' },
  { id: 'jamaica', nombre: 'Agua de jamaica', precio: 38, tono: '#b23a5b' },
  { id: 'flan', nombre: 'Flan de la casa', precio: 62, tono: '#d9a441' },
];

const G_ORDEN = armarGuion([
  { espera: 700 },
  { x: 11.8, y: 33, marca: 'tacos' },
  { x: 32.6, y: 76, marca: 'jamaica' },
  { x: 32.6, y: 33, marca: 'opciones' },
  { x: 20, y: 49.3, marca: 'queso', ir: 520 },
  { x: 27.8, y: 57.5, marca: 'enchiladas', ir: 480 },
  { x: 81.6, y: 89, marca: 'enviada', ir: 760 },
  { espera: 1900 },
]);

export function PantallaOrden({ activo = true, fijo, negocio, estilo }) {
  const caja = useRef(null);
  const [paso] = useGuion(G_ORDEN.duraciones, { activo, ref: caja, fijo, quieto: G_ORDEN.ultimo });
  const ya = (m) => paso >= G_ORDEN.marcas[m];
  const p = G_ORDEN.pasos[paso];

  const lineas = [
    ya('tacos') && { id: 'tacos', nombre: 'Tacos de sirloin', precio: 145 },
    ya('jamaica') && { id: 'jamaica', nombre: 'Agua de jamaica', precio: 38 },
    ya('enchiladas') && { id: 'enchiladas', nombre: 'Enchiladas', nota: 'Verdes · extra queso', precio: 147 },
  ].filter(Boolean);
  const total = lineas.reduce((s, l) => s + l.precio, 0);
  const tocando = ['tacos', 'jamaica', 'opciones'].find((m) => paso === G_ORDEN.marcas[m]);
  const abierta = ya('opciones') && !ya('enchiladas');

  return (
    <MarcoPos refCaja={caja} negocio={negocio} seccion="Mesas" turno="Mesero 2" hora="13:06" estilo={estilo} foco={p.x} fijo={fijo != null}>
      <div className="pv-orden">
        <div className="pv-orden__carta">
          <div className="pv-fila-chips">
            <span className="pv-chip is-activo">Fuertes</span>
            <span className="pv-chip">Entradas</span>
            <span className="pv-chip">Bebidas</span>
            <span className="pv-chip">Postres</span>
          </div>
          <div className="pv-orden__rejilla">
            {PLATILLOS.map((pl) => (
              <div
                key={pl.id}
                className={`pv-platillo ${tocando === pl.id || (tocando === 'opciones' && pl.id === 'enchiladas') ? 'is-tocado' : ''}`}
              >
                <i style={{ '--tono': pl.tono }} aria-hidden="true" />
                <b>{pl.nombre}</b>
                <span>{pesos(pl.precio)}</span>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {abierta && (
              <Motion.div className="pv-flotante pv-orden__opciones" initial={ENTRA} animate={ESTA} exit={{ opacity: 0, scale: 0.95 }} transition={MUELLE}>
                <strong>Enchiladas</strong>
                <span className="pv-opcion is-marcada">
                  <i aria-hidden="true" /> Verdes
                </span>
                <span className={`pv-opcion ${ya('queso') ? 'is-marcada' : ''}`}>
                  <i aria-hidden="true" /> Extra queso <em>+$15</em>
                </span>
                <span className="pv-boton">Agregar · {ya('queso') ? '$147' : '$132'}</span>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="pv-orden__cuenta">
          <header>
            <b>Mesa 7</b>
            <span>4 personas</span>
          </header>
          <ul>
            <AnimatePresence initial={false}>
              {lineas.map((l) => (
                <Motion.li key={l.id} layout initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={MUELLE}>
                  <span>
                    {l.nombre}
                    {l.nota ? <small>{l.nota}</small> : null}
                  </span>
                  <b>{pesos(l.precio)}</b>
                </Motion.li>
              ))}
            </AnimatePresence>
            {lineas.length === 0 && <li className="pv-vacio">Toca un platillo</li>}
          </ul>
          <footer>
            <span>Total</span>
            <Cifra valor={total} className="pv-total" />
          </footer>
          <span className={`pv-boton pv-boton--ancho ${ya('enviada') ? 'is-hecho' : ''}`}>
            {ya('enviada') ? (
              <>
                <Check size="1.1em" aria-hidden="true" /> Enviado a cocina
              </>
            ) : (
              'Enviar a cocina'
            )}
          </span>
        </aside>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} oculto={fijo != null} />
      </div>
    </MarcoPos>
  );
}

/* ============================================================
   03 · COCINA
   ============================================================ */

const G_COCINA = armarGuion([
  { espera: 800, marca: 'llega' },
  { x: 18.8, y: 30.7, marca: 'preparando', ir: 760 },
  { espera: 1300 },
  { x: 18.8, y: 30.7, marca: 'listo', ir: 300 },
  { espera: 2100 },
]);

function Comanda({ mesa, tiempo, estado, items, accion, nueva }) {
  return (
    <Motion.div
      layout
      className={`pv-comanda es-${estado}`}
      initial={{ opacity: 0, y: -18, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.9 }}
      transition={MUELLE}
    >
      <header>
        <b>{mesa}</b>
        {nueva ? <em>Nueva</em> : null}
        <span>
          <Clock3 size="1em" aria-hidden="true" /> {tiempo}
        </span>
      </header>
      <ul>
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
      {accion ? <span className="pv-boton pv-boton--ancho">{accion}</span> : null}
    </Motion.div>
  );
}

export function PantallaCocina({ activo = true, fijo, negocio, estilo }) {
  const caja = useRef(null);
  const [paso] = useGuion(G_COCINA.duraciones, { activo, ref: caja, fijo, quieto: G_COCINA.marcas.preparando });
  const ya = (m) => paso >= G_COCINA.marcas[m];
  const p = G_COCINA.pasos[paso];
  const estado7 = ya('listo') ? 'listo' : ya('preparando') ? 'preparando' : 'nueva';

  return (
    <MarcoPos refCaja={caja} negocio={negocio} seccion="Cocina" turno="Cocina" hora="13:07" estilo={estilo} foco={ya('listo') ? 62 : 26} fijo={fijo != null}>
      <div className="pv-cocina">
        <section>
          <h4>
            <ChefHat size="1.1em" aria-hidden="true" /> Cocina
          </h4>
          <AnimatePresence initial={false}>
            {ya('llega') && !ya('listo') && (
              <Comanda
                key="m7"
                mesa="Mesa 7"
                tiempo={ya('preparando') ? '01:12' : '00:04'}
                estado={estado7}
                nueva={!ya('preparando')}
                items={['1 Tacos de sirloin', '1 Enchiladas · verdes, extra queso']}
                accion={ya('preparando') ? 'Listo' : 'Preparar'}
              />
            )}
            <Comanda key="m3" mesa="Mesa 3" tiempo="08:12" estado="preparando" items={['2 Sopa de tortilla', '1 Guacamole']} />
          </AnimatePresence>
        </section>

        <section>
          <h4>Bebidas</h4>
          <AnimatePresence initial={false}>
            {ya('llega') && <Comanda key="b7" mesa="Mesa 7" tiempo="00:04" estado="nueva" items={['1 Agua de jamaica']} />}
            <Comanda key="b10" mesa="Mesa 10" tiempo="02:40" estado="preparando" items={['2 Limonada', '1 Café de olla']} />
          </AnimatePresence>
        </section>

        <section className="pv-cocina__listos">
          <h4>
            <Check size="1.1em" aria-hidden="true" /> Listos
          </h4>
          <AnimatePresence initial={false}>
            {ya('listo') && (
              <Motion.div key="l7" className="pv-listo" initial={{ opacity: 0, x: -30, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={MUELLE}>
                <b>Mesa 7</b>
                <span>Avisando al mesero</span>
              </Motion.div>
            )}
            <div key="l12" className="pv-listo is-entregado">
              <b>Mesa 12</b>
              <span>Entregado</span>
            </div>
          </AnimatePresence>
        </section>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} oculto={fijo != null || !ya('llega')} />
      </div>
    </MarcoPos>
  );
}

/* ============================================================
   04 · EL COBRO
   ============================================================ */

const CUENTA = [
  { nombre: 'Tacos de sirloin', precio: 145 },
  { nombre: 'Enchiladas · extra queso', precio: 147 },
  { nombre: '2 Agua de jamaica', precio: 76 },
  { nombre: 'Flan de la casa', precio: 62 },
];
const SUBTOTAL = 430;

const G_COBRO = armarGuion([
  { espera: 700 },
  { x: 34.8, y: 75, marca: 'propina' },
  { x: 75.6, y: 25.9, marca: 'tarjeta', ir: 760 },
  { x: 75.6, y: 12.6, marca: 'efectivo', ir: 520 },
  { x: 75.6, y: 89, marca: 'cobrado', ir: 700 },
  { espera: 2400 },
]);

/* El ticket, en caracteres. Es el único sitio de la pantalla donde el arte
   ASCII no es un adorno: un ticket térmico ES texto monoespaciado. */
export const TICKET = [
  '        TU  NEGOCIO        ',
  '   --------------------    ',
  ' Mesa 7        13:41  #128 ',
  ' ------------------------- ',
  ' Tacos de sirloin   145.00 ',
  ' Enchiladas +queso  147.00 ',
  ' 2 Agua de jamaica   76.00 ',
  ' Flan de la casa     62.00 ',
  ' ------------------------- ',
  ' Subtotal           430.00 ',
  ' Propina 10%         43.00 ',
  ' TOTAL             $473.00 ',
  ' ------------------------- ',
  ' Tarjeta            300.00 ',
  ' Efectivo           200.00 ',
  ' Cambio              27.00 ',
  '                           ',
  '   * GRACIAS, VUELVE *     ',
];

export function PantallaCobro({ activo = true, fijo, negocio, estilo }) {
  const caja = useRef(null);
  const [paso] = useGuion(G_COBRO.duraciones, { activo, ref: caja, fijo, quieto: G_COBRO.marcas.efectivo });
  const ya = (m) => paso >= G_COBRO.marcas[m];
  const p = G_COBRO.pasos[paso];
  const propina = ya('propina') ? 43 : 0;
  const total = SUBTOTAL + propina;
  const pagado = (ya('tarjeta') ? 300 : 0) + (ya('efectivo') ? 200 : 0);

  return (
    <MarcoPos refCaja={caja} negocio={negocio} seccion="Caja" turno="Caja 1" hora="13:41" estilo={estilo} foco={p.x} fijo={fijo != null}>
      <div className="pv-cobro">
        <section className="pv-cobro__cuenta">
          <header>
            <b>Mesa 7</b>
            <span>Cuenta #128</span>
          </header>
          <ul>
            {CUENTA.map((l) => (
              <li key={l.nombre}>
                <span>{l.nombre}</span>
                <b>{pesos(l.precio)}</b>
              </li>
            ))}
          </ul>
          <div className="pv-propina">
            <span>Propina</span>
            {['Sin', '10%', '15%', '20%'].map((t) => (
              <em key={t} className={(t === '10%' && ya('propina')) || (t === 'Sin' && !ya('propina')) ? 'is-activo' : ''}>
                {t}
              </em>
            ))}
          </div>
          <footer>
            <span>Total</span>
            <Cifra valor={total} className="pv-total pv-total--grande" />
          </footer>
        </section>

        <section className="pv-cobro__pago">
          <div className={`pv-metodo ${ya('efectivo') ? 'is-usado' : ''}`}>
            <Banknote size="1.5em" aria-hidden="true" />
            <b>Efectivo</b>
            <span>{ya('efectivo') ? '$200 · cambio $27' : 'Con su cambio'}</span>
          </div>
          <div className={`pv-metodo ${ya('tarjeta') ? 'is-usado' : ''}`}>
            <CreditCard size="1.5em" aria-hidden="true" />
            <b>Tarjeta</b>
            <span>{ya('tarjeta') ? '$300' : 'Débito o crédito'}</span>
          </div>
          <div className="pv-metodo">
            <Landmark size="1.5em" aria-hidden="true" />
            <b>Transferencia</b>
            <span>Con referencia</span>
          </div>
          <div className="pv-restante">
            <span>{pagado >= total ? 'Cubierto' : 'Falta'}</span>
            <Cifra valor={Math.max(0, total - pagado)} />
          </div>
          <span className={`pv-boton pv-boton--ancho ${ya('cobrado') ? 'is-hecho' : ''}`}>
            {ya('cobrado') ? (
              <>
                <Check size="1.1em" aria-hidden="true" /> Cobrado
              </>
            ) : (
              'Cobrar'
            )}
          </span>
        </section>

        <AnimatePresence>
          {ya('cobrado') && (
            <Motion.pre
              className="pv-ticket"
              aria-hidden="true"
              initial={{ y: '-104%' }}
              animate={{ y: '0%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.3, 0, 0.2, 1] }}
            >
              {TICKET.join('\n')}
            </Motion.pre>
          )}
        </AnimatePresence>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} oculto={fijo != null} />
      </div>
    </MarcoPos>
  );
}

/* ============================================================
   05 · EL CORTE
   ============================================================ */

const FORMAS = [
  { id: 'efectivo', nombre: 'Efectivo', esperado: 6240 },
  { id: 'tarjeta', nombre: 'Tarjeta', esperado: 9815 },
  { id: 'transferencia', nombre: 'Transferencia', esperado: 2365 },
];

const G_CORTE = armarGuion([
  { espera: 700 },
  { x: 43.7, y: 26.4, marca: 'efectivo' },
  { x: 43.7, y: 38.1, marca: 'tarjeta', ir: 420 },
  { x: 43.7, y: 49.8, marca: 'transferencia', ir: 420 },
  { x: 79.5, y: 89, marca: 'cerrado', ir: 760 },
  { espera: 2300 },
]);

export function PantallaCorte({ activo = true, fijo, negocio, estilo }) {
  const caja = useRef(null);
  const [paso] = useGuion(G_CORTE.duraciones, { activo, ref: caja, fijo, quieto: G_CORTE.ultimo });
  const ya = (m) => paso >= G_CORTE.marcas[m];
  const p = G_CORTE.pasos[paso];
  const contado = FORMAS.reduce((s, f) => s + (ya(f.id) ? f.esperado : 0), 0);

  return (
    <MarcoPos refCaja={caja} negocio={negocio} seccion="Caja" turno="Caja 1" hora="22:15" estilo={estilo} foco={p.x} fijo={fijo != null}>
      <div className="pv-corte">
        <section className="pv-corte__tabla">
          <header>
            <b>Corte de caja</b>
            <span>Turno de 13:00 a 22:15</span>
          </header>
          <div className="pv-corte__fila pv-corte__fila--cabeza">
            <span>Forma de pago</span>
            <span>Esperado</span>
            <span>Contado</span>
            <span>Dif.</span>
          </div>
          {FORMAS.map((f) => (
            <div key={f.id} className={`pv-corte__fila ${ya(f.id) ? 'is-contada' : ''}`}>
              <span>{f.nombre}</span>
              <span>{pesos(f.esperado)}</span>
              <span className="pv-corte__campo">{ya(f.id) ? <Cifra valor={f.esperado} ms={380} /> : <i>—</i>}</span>
              <span className="pv-corte__dif">{ya(f.id) ? '$0' : ''}</span>
            </div>
          ))}
          <div className="pv-corte__notas">
            <span>2 retiros · $1,200 · autorizó Gerente</span>
            <span>Propinas del turno · $1,730</span>
          </div>
        </section>

        <section className="pv-corte__estado">
          <span>Contado</span>
          <Cifra valor={contado} className="pv-total pv-total--grande" />
          <span className="pv-corte__de">de {pesos(18420)}</span>
          <AnimatePresence>
            {ya('cerrado') && (
              <Motion.div className="pv-sello" initial={{ opacity: 0, scale: 1.5, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: -4 }} transition={{ type: 'spring', stiffness: 520, damping: 20 }}>
                <Check size="1.2em" aria-hidden="true" /> Cuadra
              </Motion.div>
            )}
          </AnimatePresence>
          <span className={`pv-boton pv-boton--ancho ${ya('cerrado') ? 'is-hecho' : ''}`}>
            {ya('cerrado') ? (
              <>
                <Printer size="1.1em" aria-hidden="true" /> Cierre en PDF
              </>
            ) : (
              'Cerrar caja'
            )}
          </span>
        </section>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} oculto={fijo != null} />
      </div>
    </MarcoPos>
  );
}

/* ============================================================
   06 · EL TABLERO
   ============================================================ */

const HORAS = [22, 38, 64, 82, 55, 30, 44, 76, 100, 71];
const TOP = [
  { nombre: 'Agua de jamaica', n: 58 },
  { nombre: 'Tacos de sirloin', n: 41 },
  { nombre: 'Enchiladas', n: 33 },
];

const G_TABLERO = armarGuion([{ espera: 500 }, { espera: 1500, marca: 'sube' }, { espera: 1400, marca: 'top' }, { espera: 2600, marca: 'alerta' }]);

export function PantallaTablero({ activo = true, fijo, negocio, estilo }) {
  const caja = useRef(null);
  const [paso] = useGuion(G_TABLERO.duraciones, { activo, ref: caja, fijo, quieto: G_TABLERO.ultimo });
  const ya = (m) => paso >= G_TABLERO.marcas[m];

  return (
    <MarcoPos refCaja={caja} negocio={negocio} seccion="Tablero" secciones={['Tablero', 'Ventas', 'Inventario', 'Equipo']} turno="Dueño" hora="22:20" estilo={estilo} foco={ya('top') ? 78 : 26} fijo={fijo != null}>
      <div className="pv-tablero">
        <div className="pv-kpis">
          <div className="pv-kpi pv-kpi--principal">
            <span>Venta de hoy</span>
            <Cifra valor={ya('sube') ? 18420 : 0} ms={1100} />
          </div>
          <div className="pv-kpi">
            <span>Tickets</span>
            <Cifra valor={ya('sube') ? 96 : 0} prefijo="" ms={1100} />
          </div>
          <div className="pv-kpi">
            <span>Ticket promedio</span>
            <Cifra valor={ya('sube') ? 192 : 0} ms={1100} />
          </div>
        </div>

        <div className="pv-grafica">
          <span className="pv-grafica__titulo">Venta por hora</span>
          <div className="pv-grafica__barras">
            {HORAS.map((h, i) => (
              <i
                key={i}
                style={{ '--alto': ya('sube') ? `${h}%` : '4%', '--retardo': `${i * 55}ms` }}
                className={h === 100 ? 'is-pico' : ''}
              />
            ))}
          </div>
          <div className="pv-grafica__eje">
            <span>13 h</span>
            <span>17 h</span>
            <span>22 h</span>
          </div>
        </div>

        <div className="pv-top">
          <span className="pv-grafica__titulo">Lo más vendido</span>
          {TOP.map((t, i) => (
            <div key={t.nombre} className={`pv-top__fila ${ya('top') ? 'is-vista' : ''}`} style={{ '--retardo': `${i * 110}ms`, '--largo': `${(t.n / 58) * 100}%` }}>
              <span>{t.nombre}</span>
              <b>{t.n}</b>
              <i aria-hidden="true" />
            </div>
          ))}
          <AnimatePresence>
            {ya('alerta') && (
              <Motion.div className="pv-alerta" initial={{ opacity: 0, y: 12, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={MUELLE}>
                <TriangleAlert size="1.15em" aria-hidden="true" />
                <span>
                  <b>Queso Oaxaca</b> quedan 1.8 kg · mínimo 3
                </span>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MarcoPos>
  );
}

/* El paso en el que la cuenta ya tiene sus tres platillos y el botón todavía
   no se ha pulsado: la pantalla más llena, que es la que usa el personalizador. */
export const PASO_ORDEN_LLENA = G_ORDEN.marcas.enchiladas + 1;

/* Cuánto dura una vuelta completa de cada guion. Lo usa el carrusel de la
   home para pasar a la siguiente pantalla justo cuando esta termina su
   historia, y no a mitad de un cobro. */
const suma = (g) => g.duraciones.reduce((a, b) => a + b, 0);
export const DURACION_DIA = {
  mesas: suma(G_MESAS),
  orden: suma(G_ORDEN),
  cocina: suma(G_COCINA),
  cobro: suma(G_COBRO),
  corte: suma(G_CORTE),
  tablero: suma(G_TABLERO),
};

export const PANTALLAS_DIA = {
  mesas: PantallaMesas,
  orden: PantallaOrden,
  cocina: PantallaCocina,
  cobro: PantallaCobro,
  corte: PantallaCorte,
  tablero: PantallaTablero,
};
