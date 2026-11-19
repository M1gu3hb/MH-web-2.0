/**
 * ============================================================
 * LAS ESCENAS DE LAS TARJETAS DE SERVICIO
 * ============================================================
 *
 * Lo que se mueve dentro de cada tarjeta de «¿Qué necesita tu negocio?».
 *
 * POR QUÉ SE REHICIERON
 * Las anteriores avanzaban a saltos: cada segundo y medio la maqueta
 * cambiaba de estado sola, sin que nada lo provocara. Técnicamente era una
 * animación; a la vista era una presentación de diapositivas.
 *
 * LAS TRES REGLAS DE ESTAS
 *   · Nada cambia solo. Hay un cursor —o un dedo, si la escena es un
 *     teléfono— que va a cada cosa, la pulsa, y entonces pasa algo. Se lee
 *     como una persona usando el producto, no como un vídeo de producto.
 *   · Todo lo que entra, entra con muelle: llega, se pasa un poco y asienta.
 *     Lo que se mueve de sitio viaja; no desaparece de un lado y aparece en
 *     otro.
 *   · Pocas piezas y grandes. La tarjeta mide trescientos y pico píxeles en
 *     un teléfono: lo que no se lee a ese tamaño no está.
 *
 * Cada escena cuenta UNA cosa del servicio, la que alguien reconoce sin
 * leer: un sitio que se arma y vende, una caja que cobra, un cliente que
 * avanza de etapa, tres herramientas que se vuelven una, una orden que
 * llega a cocina, un ticket que se vuelve factura.
 *
 * Son decoración —la tarjeta ya dice lo suyo en texto— y van dentro de un
 * marco con `aria-hidden`. Sin movimiento se quedan en su último cuadro.
 */

import { useRef } from 'react';
import { AnimatePresence, LayoutGroup, motion as Motion } from 'motion/react';
import { Check, FileText, Mail, MessageSquareText, NotebookPen, ShoppingBag, Table2, Zap } from 'lucide-react';

import { Cifra, Cursor, armarGuion, pesos, useGuion } from '../pos/kit';
import './escenas.css';

const MUELLE = { type: 'spring', stiffness: 420, damping: 24 };
const REBOTE = { type: 'spring', stiffness: 520, damping: 17 };
const POP = { initial: { opacity: 0, scale: 0.6, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.85 } };

/* El andamio común: observa, corre el guion y pinta el cursor. */
function useEscena(guion) {
  const caja = useRef(null);
  const [paso] = useGuion(guion.duraciones, { ref: caja, quieto: guion.ultimo });
  return { caja, paso, ya: (m) => paso >= guion.marcas[m], en: (m) => paso === guion.marcas[m], p: guion.pasos[paso] };
}

/* ============================================================
   01 · PÁGINAS WEB — un sitio que se arma, vende y se adapta
   ============================================================ */

const G_WEB = armarGuion([
  { espera: 500, marca: 'portada' },
  { espera: 700, marca: 'productos' },
  { x: 50, y: 87, marca: 'agregado', ir: 760 },
  { x: 91, y: 8, marca: 'telefono', ir: 800 },
  { espera: 2300 },
]);

const PRODUCTOS = [
  { n: 'Pastel de fresa', p: 320 },
  { n: 'Caja de galletas', p: 180 },
  { n: 'Tarta de limón', p: 450 },
];

export function EscenaWeb() {
  const { caja, paso, ya, p } = useEscena(G_WEB);
  const movil = ya('telefono');

  return (
    <div ref={caja} className="esc esc--web">
      <div className="esc__lienzo">
        <div className="esc-barra">
          <span className="esc-url">tu-negocio.mx</span>
          <span className="esc-interruptor">
            <em className={movil ? '' : 'is-activo'}>Escritorio</em>
            <em className={movil ? 'is-activo' : ''}>Teléfono</em>
          </span>
        </div>

        <LayoutGroup>
          <Motion.div layout className={`esc-web__pagina ${movil ? 'is-movil' : ''}`} transition={MUELLE}>
            <Motion.div layout className="esc-web__cabeza" transition={MUELLE}>
              <b>Tu negocio</b>
              <Motion.span className="esc-web__carrito" animate={ya('agregado') ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.45 }}>
                <ShoppingBag size="1.1em" aria-hidden="true" />
                {ya('agregado') ? 1 : 0}
              </Motion.span>
            </Motion.div>

            <AnimatePresence>
              {ya('portada') && (
                <Motion.div layout className="esc-web__hero" initial={{ opacity: 0, y: -22, scaleY: 0.6 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} transition={REBOTE}>
                  <strong>Lo que vendes,</strong>
                  <span>con su precio y su botón.</span>
                </Motion.div>
              )}
            </AnimatePresence>

            <div className="esc-web__rejilla">
              {PRODUCTOS.map((prod, i) =>
                ya('productos') && (!movil || i < 2) ? (
                  <Motion.div
                    layout
                    key={prod.n}
                    className="esc-web__producto"
                    initial={{ opacity: 0, scale: 0.5, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ ...REBOTE, delay: movil ? 0 : i * 0.09 }}
                  >
                    <i />
                    <b>{prod.n}</b>
                    <span>{pesos(prod.p)}</span>
                    <em className={i === 1 && ya('agregado') ? 'is-hecho' : ''}>{i === 1 && ya('agregado') ? 'Agregado' : 'Agregar'}</em>
                  </Motion.div>
                ) : null
              )}
            </div>
          </Motion.div>
        </LayoutGroup>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} oculto={!ya('productos')} />
      </div>
    </div>
  );
}

/* ============================================================
   02 · SISTEMAS — una caja que cobra y descuenta
   ============================================================ */

const G_CAJA = armarGuion([
  { espera: 600 },
  { x: 14.5, y: 27, marca: 'cafe' },
  { x: 40, y: 27, marca: 'concha', ir: 520 },
  { x: 14.5, y: 27, marca: 'cafe2', ir: 520 },
  { x: 75.9, y: 86, marca: 'cobrado', ir: 760 },
  { espera: 2400 },
]);

const TECLAS = [
  { id: 'cafe', n: 'Café', p: 35 },
  { id: 'concha', n: 'Concha', p: 18 },
  { id: 'jugo', n: 'Jugo', p: 28 },
  { id: 'torta', n: 'Torta', p: 52 },
];

export function EscenaCaja() {
  const { caja, paso, ya, en, p } = useEscena(G_CAJA);
  const cafes = (ya('cafe') ? 1 : 0) + (ya('cafe2') ? 1 : 0);
  const lineas = [cafes > 0 && { id: 'cafe', n: `${cafes} Café`, p: cafes * 35 }, ya('concha') && { id: 'concha', n: '1 Concha', p: 18 }].filter(Boolean);
  const total = lineas.reduce((s, l) => s + l.p, 0);
  const cobrado = ya('cobrado');

  return (
    <div ref={caja} className="esc esc--caja">
      <div className="esc__lienzo">
        <div className="esc-caja__teclas">
          {TECLAS.map((t) => (
            <div key={t.id} className={`esc-tecla ${en(t.id) || (t.id === 'cafe' && en('cafe2')) ? 'is-tocada' : ''}`}>
              <b>{t.n}</b>
              <span>{pesos(t.p)}</span>
              {t.id === 'cafe' && (
                <i style={{ '--lleno': `${62 - cafes * 9}%` }}>
                  <u />
                </i>
              )}
            </div>
          ))}
        </div>

        <div className="esc-caja__ticket">
          <span className="esc-etiqueta">Ticket</span>
          <ul>
            <AnimatePresence initial={false}>
              {!cobrado &&
                lineas.map((l) => (
                  <Motion.li key={l.id} layout initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: -14 }} transition={MUELLE}>
                    <span>{l.n}</span>
                    <b>{pesos(l.p)}</b>
                  </Motion.li>
                ))}
            </AnimatePresence>
          </ul>
          <div className="esc-caja__total">
            <span>{cobrado ? 'Venta registrada' : 'Total'}</span>
            <Cifra valor={cobrado ? 88 : total} />
          </div>
          <span className={`esc-boton ${cobrado ? 'is-hecho' : ''}`}>
            {cobrado ? (
              <>
                <Check size="1.1em" aria-hidden="true" /> Cobrado
              </>
            ) : (
              'Cobrar'
            )}
          </span>
        </div>

        <AnimatePresence>
          {cobrado && (
            <Motion.pre className="esc-caja__papel" initial={{ y: '-105%' }} animate={{ y: '0%' }} exit={{ opacity: 0 }} transition={{ duration: 1.2, ease: [0.3, 0, 0.2, 1] }}>
              {' TU NEGOCIO \n-------------\n 2 Cafe  70.00\n 1 Concha 18.00\n-------------\n TOTAL  $88.00\n  * GRACIAS *'}
            </Motion.pre>
          )}
        </AnimatePresence>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} />
      </div>
    </div>
  );
}

/* ============================================================
   03 · CRM — un cliente que avanza y un mensaje que sale solo
   ============================================================ */

const G_CRM = armarGuion([
  { espera: 700 },
  { x: 17.9, y: 27, marca: 'agarra' },
  { x: 50, y: 27, marca: 'cotizado', ir: 900, pulsar: 420 },
  { espera: 1500, marca: 'mensaje' },
  { x: 50, y: 27, marca: 'agarra2', ir: 200 },
  { x: 82.1, y: 27, marca: 'cerrado', ir: 900, pulsar: 420 },
  { espera: 2200 },
]);

export function EscenaCrm() {
  const { caja, paso, ya, p } = useEscena(G_CRM);
  /* La ficha cambia de columna cuando el cursor EMPIEZA a moverse, no cuando
     llega: así viajan los dos a la vez y se lee como un arrastre. Si
     esperara al clic de soltar, el cursor llegaría solo y la ficha saldría
     detrás, que es un teletransporte con retraso. */
  const etapa = paso >= G_CRM.marcas.cerrado - 1 ? 2 : paso >= G_CRM.marcas.cotizado - 1 ? 1 : 0;
  const enMano = (ya('agarra') && !ya('cotizado')) || (ya('agarra2') && !ya('cerrado'));
  const columnas = ['Nuevo', 'Cotizado', 'Cerrado'];

  return (
    <div ref={caja} className="esc esc--crm">
      <div className="esc__lienzo">
        <LayoutGroup>
          <div className="esc-crm__tablero">
            {columnas.map((c, i) => (
              <div key={c} className={`esc-crm__col ${i === etapa ? 'is-activa' : ''}`}>
                <span className="esc-etiqueta">
                  {c} <em>{i === etapa ? 1 : 0}</em>
                </span>
                {i === etapa && (
                  <Motion.div
                    layoutId="cliente"
                    className={`esc-crm__ficha ${enMano ? 'is-en-mano' : ''} ${etapa === 2 ? 'is-cerrada' : ''}`}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  >
                    <i>AR</i>
                    <b>Ana Ríos</b>
                    <span>Pedido especial</span>
                    <strong>$8,400</strong>
                  </Motion.div>
                )}
              </div>
            ))}
          </div>
        </LayoutGroup>

        <div className="esc-crm__automatico">
          <span className="esc-etiqueta">
            <Zap size="1.1em" aria-hidden="true" /> Automático
          </span>
          <AnimatePresence mode="wait">
            {ya('cerrado') ? (
              <Motion.p key="c" {...POP} transition={REBOTE} className="is-ok">
                <Check size="1.1em" aria-hidden="true" /> Venta cerrada · se agendó la entrega
              </Motion.p>
            ) : ya('mensaje') ? (
              <Motion.p key="m" {...POP} transition={REBOTE}>
                <MessageSquareText size="1.1em" aria-hidden="true" /> «Hola Ana, te paso tu cotización»
              </Motion.p>
            ) : (
              <Motion.p key="e" className="is-espera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Al cambiar de etapa, el mensaje sale solo
              </Motion.p>
            )}
          </AnimatePresence>
        </div>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} />
      </div>
    </div>
  );
}

/* ============================================================
   04 · SOFTWARE A MEDIDA — tres herramientas que se vuelven una
   ============================================================ */

const G_MEDIDA = armarGuion([
  { espera: 1200 },
  { x: 50, y: 50, marca: 'une', ir: 760 },
  { espera: 900, marca: 'filas' },
  { x: 84.2, y: 46, marca: 'listo', ir: 760 },
  { espera: 2300 },
]);

const SUELTAS = [
  { id: 'hoja', nombre: 'Hoja de cálculo', Icono: Table2 },
  { id: 'libreta', nombre: 'Libreta', Icono: NotebookPen },
  { id: 'chat', nombre: 'Mensajes', Icono: MessageSquareText },
];

export function EscenaMedida() {
  const { caja, paso, ya, p } = useEscena(G_MEDIDA);
  const unido = ya('une');

  return (
    <div ref={caja} className="esc esc--medida">
      <div className="esc__lienzo">
        <AnimatePresence>
          {!unido &&
            SUELTAS.map((s, i) => (
              <Motion.div
                key={s.id}
                className={`esc-suelta esc-suelta--${i}`}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.3, left: '50%', top: '50%', rotate: 0 }}
                transition={{ ...MUELLE, delay: i * 0.06 }}
              >
                <s.Icono size="1.5em" aria-hidden="true" />
                <b>{s.nombre}</b>
                <i />
                <i />
              </Motion.div>
            ))}
        </AnimatePresence>

        {!unido && <span className="esc-medida__pista">Tres herramientas, ningún dueño</span>}

        <AnimatePresence>
          {unido && (
            <Motion.div className="esc-medida__app" initial={{ opacity: 0, scale: 0.55 }} animate={{ opacity: 1, scale: 1 }} transition={REBOTE}>
              <header>
                <b>Tu sistema</b>
                <span>Una sola pantalla</span>
              </header>
              {[
                ['Cliente', 'Pastelería Lirio'],
                ['Proceso', 'Pedido especial'],
                ['Entrega', 'Viernes 18:00'],
              ].map(([k, v], i) => (
                <Motion.div key={k} className="esc-medida__fila" initial={{ opacity: 0, x: -18 }} animate={ya('filas') ? { opacity: 1, x: 0 } : { opacity: 0, x: -18 }} transition={{ ...MUELLE, delay: i * 0.09 }}>
                  <span>{k}</span>
                  <b>{v}</b>
                  {i === 2 && <em className={ya('listo') ? 'is-hecho' : ''}>{ya('listo') ? 'Listo' : 'Marcar'}</em>}
                </Motion.div>
              ))}
              <AnimatePresence>
                {ya('listo') && (
                  <Motion.p {...POP} transition={REBOTE}>
                    <Check size="1.1em" aria-hidden="true" /> Guardado · nadie copió nada dos veces
                  </Motion.p>
                )}
              </AnimatePresence>
            </Motion.div>
          )}
        </AnimatePresence>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} />
      </div>
    </div>
  );
}

/* ============================================================
   05 · RESTAURANTES — del teléfono de la mesa a la cocina
   ============================================================ */

const G_RESTO = armarGuion([
  { espera: 700 },
  { x: 23.4, y: 23, marca: 'elige' },
  { x: 23.4, y: 86, marca: 'pide', ir: 620 },
  { espera: 900, marca: 'llega' },
  { x: 72.4, y: 40, marca: 'prepara', ir: 800 },
  { espera: 1100 },
  { x: 72.4, y: 40, marca: 'lista', ir: 200 },
  { espera: 2200 },
]);

export function EscenaResto() {
  const { caja, paso, ya, p } = useEscena(G_RESTO);
  const enTelefono = !ya('llega');
  const estado = ya('lista') ? 'lista' : ya('prepara') ? 'preparando' : 'nueva';

  return (
    <div ref={caja} className="esc esc--resto">
      <div className="esc__lienzo">
        <div className="esc-resto__telefono">
          <span className="esc-etiqueta">Mesa 4 · Menú</span>
          <div className={`esc-resto__platillo ${ya('elige') ? 'is-elegido' : ''}`}>
            <i />
            <b>Tacos de suadero</b>
            <span>$95</span>
          </div>
          <div className="esc-resto__platillo">
            <i />
            <b>Agua de horchata</b>
            <span>$45</span>
          </div>
          <AnimatePresence mode="wait">
            {ya('lista') ? (
              <Motion.span key="l" className="esc-boton is-hecho" {...POP} transition={REBOTE}>
                <Check size="1.1em" aria-hidden="true" /> Va para tu mesa
              </Motion.span>
            ) : ya('pide') ? (
              <Motion.span key="e" className="esc-boton is-espera" {...POP} transition={REBOTE}>
                Pedido enviado
              </Motion.span>
            ) : (
              <Motion.span key="p" className="esc-boton" exit={{ opacity: 0, scale: 0.9 }}>
                Pedir{ya('elige') ? ' · 1' : ''}
              </Motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="esc-resto__cocina">
          <span className="esc-etiqueta">Cocina</span>
          <AnimatePresence>
            {ya('pide') && (
              <Motion.div className={`esc-resto__comanda es-${estado}`} initial={{ opacity: 0, x: -90, scale: 0.6, rotate: -8 }} animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 240, damping: 20 }}>
                <header>
                  <b>Mesa 4</b>
                  <em>{estado === 'lista' ? 'Lista' : estado === 'preparando' ? 'Preparando' : 'Nueva'}</em>
                </header>
                <p>1 Tacos de suadero</p>
                <span className="esc-boton">{estado === 'nueva' ? 'Preparar' : estado === 'preparando' ? 'Listo' : 'Entregar'}</span>
              </Motion.div>
            )}
          </AnimatePresence>
          {!ya('pide') && <p className="esc-resto__vacio">Sin comandas nuevas</p>}
        </div>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} dedo={enTelefono} />
      </div>
    </div>
  );
}

/* ============================================================
   06 · FACTURACIÓN — el ticket que se vuelve factura
   ============================================================ */

const G_FACTURA = armarGuion([
  { espera: 700 },
  { x: 20.4, y: 86, marca: 'pide' },
  { espera: 500, marca: 'rfc1' },
  { espera: 420, marca: 'rfc2' },
  { espera: 420, marca: 'rfc3' },
  { espera: 700, marca: 'timbre' },
  { espera: 900, marca: 'archivos' },
  { espera: 2400, marca: 'correo' },
]);

const RFC = 'XAXX010101000';

export function EscenaFactura() {
  const { caja, paso, ya, p } = useEscena(G_FACTURA);
  const letras = ya('rfc3') ? 13 : ya('rfc2') ? 9 : ya('rfc1') ? 4 : 0;

  return (
    <div ref={caja} className="esc esc--factura">
      <div className="esc__lienzo">
        <div className="esc-factura__ticket">
          <span className="esc-etiqueta">Ticket</span>
          <b>A-2841</b>
          <strong>$1,248</strong>
          <span className={`esc-boton ${ya('timbre') ? 'is-hecho' : ya('pide') ? 'is-espera' : ''}`}>
            {ya('timbre') ? (
              <>
                <Check size="1.1em" aria-hidden="true" /> Facturado
              </>
            ) : ya('pide') ? (
              'Facturando…'
            ) : (
              'Facturar'
            )}
          </span>
        </div>

        {/* El cable entre los dos: el ticket «viaja» a la factura. */}
        <div className={`esc-factura__cable ${ya('pide') ? 'is-vivo' : ''}`}>
          <i />
        </div>

        <div className={`esc-factura__hoja ${ya('pide') ? 'is-activa' : ''}`}>
          <span className="esc-etiqueta">
            <FileText size="1.1em" aria-hidden="true" /> Factura
          </span>
          <div className="esc-factura__campo">
            <span>RFC</span>
            <b>
              {RFC.slice(0, letras)}
              {ya('pide') && letras < 13 ? <u /> : null}
            </b>
          </div>
          <div className="esc-factura__campo">
            <span>Total</span>
            <b>{ya('rfc3') ? '$1,248.00' : ''}</b>
          </div>
          <div className="esc-factura__archivos">
            <AnimatePresence>
              {ya('archivos') &&
                ['PDF', 'XML'].map((a, i) => (
                  <Motion.em key={a} {...POP} transition={{ ...REBOTE, delay: i * 0.12 }}>
                    {a}
                  </Motion.em>
                ))}
              {ya('correo') && (
                <Motion.em key="correo" className="is-correo" {...POP} transition={REBOTE}>
                  <Mail size="1.05em" aria-hidden="true" /> Al correo
                </Motion.em>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {ya('timbre') && (
              <Motion.span className="esc-factura__sello" initial={{ opacity: 0, scale: 2.2, rotate: -22 }} animate={{ opacity: 1, scale: 1, rotate: -9 }} transition={{ type: 'spring', stiffness: 600, damping: 19 }}>
                Timbrada
              </Motion.span>
            )}
          </AnimatePresence>
        </div>
        <Cursor x={p.x} y={p.y} pulsa={p.clic ? paso + 1 : 0} oculto={ya('rfc1')} />
      </div>
    </div>
  );
}

export const ESCENAS = {
  web: EscenaWeb,
  sistemas: EscenaCaja,
  crm: EscenaCrm,
  software: EscenaMedida,
  restaurantes: EscenaResto,
  facturacion: EscenaFactura,
};

export default function Escena({ id }) {
  const Componente = ESCENAS[id] ?? EscenaWeb;
  return <Componente />;
}
