/**
 * ============================================================
 * EL MISMO SISTEMA, CON OTRA CARA
 * ============================================================
 *
 * Cuatro pantallas que no son de restaurante: la barra de una cafetería, la
 * caja de una tienda con lector, la venta por medida de una ferretería y la
 * agenda de una estética. Existen para probar una sola frase —«se adapta a
 * tu negocio»— enseñándola en vez de escribiéndola.
 *
 * Usan el mismo marco, el mismo cursor y los mismos colores que las demás:
 * lo que cambia entre giros es qué hay en pantalla, no de qué está hecho.
 * Los negocios y las personas que aparecen son de ejemplo.
 */

import { useRef } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { Check, ScanLine, Scissors, Ruler } from 'lucide-react';

import { Cifra, Cursor, MarcoPos, armarGuion, pesos, useGuion } from './kit';

const MUELLE = { type: 'spring', stiffness: 420, damping: 26 };

/* ============================================================
   CAFETERÍA — la fila de la barra
   ============================================================ */

const BEBIDAS = ['Americano', 'Latte', 'Capuchino', 'Chai', 'Mocha', 'Té helado'];

const G_BARRA = armarGuion([
  { espera: 700 },
  { x: 27.2, y: 23.3, marca: 'latte' },
  { x: 27.2, y: 89, marca: 'cobrada', ir: 620 },
  { espera: 900 },
  { x: 89.7, y: 18.6, marca: 'lista', ir: 760 },
  { espera: 2000 },
]);

export function PantallaBarra({ activo = true, negocio = 'Café Origen', estilo }) {
  const caja = useRef(null);
  const [paso] = useGuion(G_BARRA.duraciones, { activo, ref: caja, quieto: G_BARRA.marcas.cobrada });
  const ya = (m) => paso >= G_BARRA.marcas[m];
  const p = G_BARRA.pasos[paso];

  return (
    <MarcoPos refCaja={caja} negocio={negocio} seccion="Barra" secciones={['Barra', 'Caja', 'Insumos']} turno="Barra" hora="08:14" estilo={estilo} foco={p.x}>
      <div className="pv-barra">
        <section className="pv-barra__pad">
          <div className="pv-barra__teclas">
            {BEBIDAS.map((b) => (
              <span key={b} className={`pv-tecla ${b === 'Latte' && paso === G_BARRA.marcas.latte ? 'is-tocada' : ''}`}>
                {b}
              </span>
            ))}
          </div>
          <div className="pv-barra__pedido">
            <span>{ya('latte') && !ya('cobrada') ? 'Latte · deslactosada · a nombre de Ana' : 'Siguiente pedido'}</span>
            <Cifra valor={ya('latte') && !ya('cobrada') ? 62 : 0} />
          </div>
          <span className="pv-boton pv-boton--ancho">Cobrar y mandar a barra</span>
        </section>

        <section className="pv-barra__fila">
          <h4>Fila de barra</h4>
          <AnimatePresence initial={false}>
            <Motion.div key="luis" layout className={`pv-turno ${ya('lista') ? 'es-listo' : 'es-preparando'}`} transition={MUELLE}>
              <b>Luis</b>
              <span>Americano · Concha</span>
              <em>{ya('lista') ? 'Listo' : 'Preparando'}</em>
            </Motion.div>
            <Motion.div key="mar" layout className="pv-turno es-espera" transition={MUELLE}>
              <b>Mar</b>
              <span>Chai · con avena</span>
              <em>En fila</em>
            </Motion.div>
            {ya('cobrada') && (
              <Motion.div key="ana" layout className="pv-turno es-nuevo" initial={{ opacity: 0, x: -40, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={MUELLE}>
                <b>Ana</b>
                <span>Latte · deslactosada</span>
                <em>En fila</em>
              </Motion.div>
            )}
          </AnimatePresence>
        </section>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} />
      </div>
    </MarcoPos>
  );
}

/* ============================================================
   TIENDA — lector de códigos
   ============================================================ */

const G_TIENDA = armarGuion([
  { espera: 900, marca: 'uno' },
  { espera: 1100, marca: 'dos' },
  { espera: 1100, marca: 'tres' },
  { x: 76.1, y: 89, marca: 'cobrada', ir: 700 },
  { espera: 1900 },
]);

const ESCANEADOS = [
  { id: 'uno', nombre: 'Aceite vegetal 1 L', detalle: 'Quedan 11', precio: 48 },
  { id: 'dos', nombre: 'Jitomate · 0.640 kg', detalle: '$32.00 el kilo', precio: 20 },
  { id: 'tres', nombre: '6 Refresco 600 ml', detalle: 'Precio de mayoreo', precio: 84 },
];

export function PantallaTienda({ activo = true, negocio = 'Abarrotes La Esquina', estilo }) {
  const caja = useRef(null);
  const [paso] = useGuion(G_TIENDA.duraciones, { activo, ref: caja, quieto: G_TIENDA.marcas.tres });
  const ya = (m) => paso >= G_TIENDA.marcas[m];
  const p = G_TIENDA.pasos[paso];
  const lineas = ESCANEADOS.filter((e) => ya(e.id));
  const ultimo = lineas[lineas.length - 1];
  const total = lineas.reduce((s, l) => s + l.precio, 0);

  return (
    <MarcoPos refCaja={caja} negocio={negocio} seccion="Caja" secciones={['Caja', 'Inventario', 'Fiado']} turno="Caja 1" hora="11:20" estilo={estilo} foco={ya('tres') ? p.x : 30}>
      <div className="pv-tienda">
        <section className="pv-tienda__lector">
          <div className={`pv-codigo ${ya('cobrada') ? '' : 'is-leyendo'}`} key={lineas.length}>
            <i aria-hidden="true" />
            <ScanLine size="1.6em" aria-hidden="true" />
          </div>
          <AnimatePresence mode="popLayout">
            {ultimo && (
              <Motion.div key={ultimo.id} className="pv-leido" initial={{ opacity: 0, y: 14, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={MUELLE}>
                <b>{ultimo.nombre}</b>
                <span>{ultimo.detalle}</span>
              </Motion.div>
            )}
          </AnimatePresence>
          <div className="pv-existencia">
            <span>Existencia · Aceite 1 L</span>
            <i style={{ '--lleno': ya('uno') ? '46%' : '50%' }} />
          </div>
        </section>

        <section className="pv-orden__cuenta">
          <header>
            <b>Ticket</b>
            <span>#2 041</span>
          </header>
          <ul>
            <AnimatePresence initial={false}>
              {lineas.map((l) => (
                <Motion.li key={l.id} layout initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={MUELLE}>
                  <span>{l.nombre}</span>
                  <b>{pesos(l.precio)}</b>
                </Motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <footer>
            <span>Total</span>
            <Cifra valor={total} className="pv-total" />
          </footer>
          <span className={`pv-boton pv-boton--ancho ${ya('cobrada') ? 'is-hecho' : ''}`}>
            {ya('cobrada') ? (
              <>
                <Check size="1.1em" aria-hidden="true" /> Cobrado
              </>
            ) : (
              'Cobrar'
            )}
          </span>
        </section>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} oculto={!ya('tres')} />
      </div>
    </MarcoPos>
  );
}

/* ============================================================
   FERRETERÍA — venta por medida
   ============================================================ */

const G_MEDIDA = armarGuion([
  { espera: 800 },
  { x: 16.3, y: 63.6, marca: 'agarra' },
  { x: 34.8, y: 63.6, marca: 'mide', ir: 1100, pulsar: 500 },
  { x: 28.6, y: 89, marca: 'agregado', ir: 700 },
  { espera: 2000 },
]);

export function PantallaMedida({ activo = true, negocio = 'Ferretería El Clavo', estilo }) {
  const caja = useRef(null);
  const [paso] = useGuion(G_MEDIDA.duraciones, { activo, ref: caja, quieto: G_MEDIDA.marcas.mide });
  const ya = (m) => paso >= G_MEDIDA.marcas[m];
  const p = G_MEDIDA.pasos[paso];
  const viajando = paso >= G_MEDIDA.marcas.agarra && paso < G_MEDIDA.marcas.mide;
  const metros = ya('mide') || viajando ? 12.5 : 5;

  return (
    <MarcoPos refCaja={caja} negocio={negocio} seccion="Mostrador" secciones={['Mostrador', 'Cotizaciones', 'Crédito']} turno="Mostrador" hora="10:48" estilo={estilo} foco={ya('agregado') ? 70 : p.x}>
      <div className="pv-medida">
        <section className="pv-medida__corte">
          <header>
            <Ruler size="1.3em" aria-hidden="true" />
            <b>Cable THW calibre 12</b>
            <span>$18.00 el metro</span>
          </header>
          <div className="pv-regla">
            <i style={{ '--largo': `${(metros / 20) * 100}%` }} />
            <span className="pv-regla__marcas">
              {[0, 5, 10, 15, 20].map((n) => (
                <em key={n}>{n} m</em>
              ))}
            </span>
          </div>
          <div className="pv-medida__cuenta">
            <span className="pv-medida__metros">
              <b>{metros.toFixed(1)} m</b>
              <small>a la medida</small>
            </span>
            <Cifra valor={metros * 18} ms={900} className="pv-total pv-total--grande" />
          </div>
          <span className={`pv-boton pv-boton--ancho ${ya('agregado') ? 'is-hecho' : ''}`}>
            {ya('agregado') ? (
              <>
                <Check size="1.1em" aria-hidden="true" /> En la cuenta de la obra
              </>
            ) : (
              'Agregar a la cuenta'
            )}
          </span>
        </section>

        <section className="pv-medida__obra">
          <h4>Obra · Privada Los Pinos</h4>
          <div className="pv-obra__fila">
            <span>Cemento gris · 8 bultos</span>
            <b>$1,720</b>
          </div>
          <div className="pv-obra__fila">
            <span>Varilla 3/8 · 20 pzas</span>
            <b>$2,300</b>
          </div>
          <AnimatePresence>
            {ya('agregado') && (
              <Motion.div className="pv-obra__fila is-nueva" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={MUELLE}>
                <span>Cable THW 12 · 12.5 m</span>
                <b>$225</b>
              </Motion.div>
            )}
          </AnimatePresence>
          <footer>
            <span>Saldo a crédito</span>
            <Cifra valor={ya('agregado') ? 4245 : 4020} className="pv-total" />
          </footer>
        </section>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} />
      </div>
    </MarcoPos>
  );
}

/* ============================================================
   ESTÉTICA — la agenda
   ============================================================ */

const G_AGENDA = armarGuion([
  { espera: 800 },
  { x: 53.8, y: 63.5, marca: 'cita' },
  { espera: 1000 },
  { x: 23.9, y: 26.1, marca: 'cobrada', ir: 760 },
  { espera: 2100 },
]);

const EQUIPO = ['Sofi', 'Dani', 'Karla'];
const HORAS_AGENDA = ['10:00', '11:00', '12:00', '13:00'];

export function PantallaAgenda({ activo = true, negocio = 'Filo Barbería', estilo }) {
  const caja = useRef(null);
  const [paso] = useGuion(G_AGENDA.duraciones, { activo, ref: caja, quieto: G_AGENDA.marcas.cita });
  const ya = (m) => paso >= G_AGENDA.marcas[m];
  const p = G_AGENDA.pasos[paso];

  return (
    <MarcoPos refCaja={caja} negocio={negocio} seccion="Agenda" secciones={['Agenda', 'Caja', 'Clientes']} turno="Recepción" hora="11:40" estilo={estilo} foco={p.x}>
      <div className="pv-agenda">
        <div className="pv-agenda__horas">
          <span />
          {HORAS_AGENDA.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
        {EQUIPO.map((persona, col) => (
          <div key={persona} className="pv-agenda__col">
            <span className="pv-agenda__persona">
              <Scissors size="1em" aria-hidden="true" /> {persona}
            </span>
            <div className="pv-agenda__pista">
              {col === 0 && (
                <div className={`pv-cita ${ya('cobrada') ? 'es-cobrada' : 'es-servicio'}`} style={{ '--desde': 0, '--dura': 1.5 }}>
                  <b>Tinte · Paola</b>
                  <span>{ya('cobrada') ? 'Cobrada · $840' : 'En servicio'}</span>
                </div>
              )}
              {col === 0 && (
                <div className="pv-cita" style={{ '--desde': 2.5, '--dura': 1 }}>
                  <b>Corte · Iván</b>
                  <span>13:00</span>
                </div>
              )}
              {col === 1 && (
                <div className="pv-cita" style={{ '--desde': 0.5, '--dura': 1 }}>
                  <b>Barba · Hugo</b>
                  <span>10:30</span>
                </div>
              )}
              {col === 1 && (
                <AnimatePresence>
                  {ya('cita') && (
                    <Motion.div className="pv-cita es-nueva" style={{ '--desde': 2, '--dura': 1 }} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 460, damping: 18 }}>
                      <b>Corte + barba · Marco</b>
                      <span>12:00 · confirmada</span>
                    </Motion.div>
                  )}
                </AnimatePresence>
              )}
              {col === 2 && (
                <div className="pv-cita" style={{ '--desde': 1, '--dura': 2 }}>
                  <b>Uñas · Renata</b>
                  <span>11:00</span>
                </div>
              )}
            </div>
          </div>
        ))}
        <AnimatePresence>
          {ya('cobrada') && (
            <Motion.div className="pv-aviso" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={MUELLE}>
              <Check size="1.1em" aria-hidden="true" /> Comisión de Sofi · +$126
            </Motion.div>
          )}
        </AnimatePresence>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} />
      </div>
    </MarcoPos>
  );
}
