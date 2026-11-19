/**
 * Demostraciones de los productos propios y de los puntos de venta:
 * GLYPHOS, Pastelería Confetti, Electrotécnica Berlín, GESTECH, MH Photo
 * Booth, NFC Manager, Morphiq UI y MorphiqPOS.
 *
 * Los datos que se ven —nombres de piezas, modos, semillas— salen de cada
 * proyecto. Las cifras de venta son de demostración: enseñan cómo se mueve
 * la pantalla, no cuánto vende nadie.
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { Camera, Check, Code2, Dice5, Download, Folder, Globe, Mail, Music, Smartphone, Wifi, WifiOff } from 'lucide-react';

import { Cifra, pesos } from '../pos/kit';
import { Hecho, MUELLE, Marco, POP, REBOTE, SUBE, Ventana, guion, useEscena } from './base';
import './producto.css';

/* ============================================================
   GLYPHOS — tirar el dado, ver la pieza, llevársela como código
   ============================================================ */

const RAMPA = ' .:-=+*#%@';
const COLS = 44;
const FILAS = 12;

/* Un campo de caracteres a partir de una función de brillo. El 1.9 compensa
   que un carácter es casi el doble de alto que de ancho: sin él, una esfera
   sale ovalada. */
function campo(brillo) {
  let s = '';
  for (let y = 0; y < FILAS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const u = ((x / (COLS - 1)) * 2 - 1) * 1.9;
      const v = (y / (FILAS - 1)) * 2 - 1;
      const l = Math.max(0, Math.min(1, brillo(u, v)));
      s += RAMPA[Math.round(l * (RAMPA.length - 1))];
    }
    if (y < FILAS - 1) s += '\n';
  }
  return s;
}

const PIEZAS = [
  {
    nombre: 'Saturno',
    semilla: 'faro-lunar-417',
    campo: campo((u, v) => {
      const r2 = u * u + v * v;
      const elipse = (u * u) / 2.9 + (v * v) / 0.13;
      const anillo = elipse > 0.6 && elipse < 1;
      if (r2 < 0.5 && !(anillo && v > 0)) {
        const z = Math.sqrt(0.5 - r2);
        return 0.2 + 0.8 * Math.max(0, (-0.5 * u - 0.55 * v + 0.67 * z) / 0.707);
      }
      return anillo ? 0.5 : 0;
    }),
  },
  {
    nombre: 'Marea',
    semilla: 'sal-cobre-082',
    campo: campo((u, v) => (0.5 + 0.5 * Math.sin(u * 3.2 + Math.sin(v * 2.6) * 1.6)) * (1 - Math.abs(v) * 0.5)),
  },
  {
    nombre: 'Nudo',
    semilla: 'eco-norte-551',
    campo: campo((u, v) => {
      const d = Math.abs(Math.hypot(u * 0.82, v) - 0.7);
      return d < 0.3 ? (1 - d / 0.3) * (0.62 + 0.38 * Math.sin(Math.atan2(v, u) * 3)) : 0;
    }),
  },
];

const umbral = (i) => (((Math.sin(i * 12.9898) * 43758.5453) % 1) + 1) % 1;

/* De un campo al siguiente carácter a carácter, con un instante de ruido en
   medio: es el gesto de GLYPHOS, y aquí cuesta medio segundo de rAF. */
function useMezcla(destino, ms = 560) {
  const [texto, setTexto] = useState(destino);
  const previo = useRef(destino);

  useEffect(() => {
    const de = previo.current;
    if (de === destino) return undefined;
    const t0 = performance.now();
    let raf = requestAnimationFrame(function cuadro(ahora) {
      const u = Math.min(1, (ahora - t0) / ms);
      let s = '';
      for (let i = 0; i < destino.length; i += 1) {
        if (destino[i] === '\n') s += '\n';
        else if (umbral(i) < u) s += destino[i];
        else if (umbral(i) < u + 0.22) s += RAMPA[(i * 7 + Math.floor(ahora / 50)) % RAMPA.length];
        else s += de[i];
      }
      setTexto(s);
      if (u < 1) raf = requestAnimationFrame(cuadro);
    });
    previo.current = destino;
    return () => cancelAnimationFrame(raf);
  }, [destino, ms]);

  return texto;
}

const G_GLYPHOS = guion([
  { espera: 1000 },
  { a: 'dado', marca: 'p1' },
  { espera: 1300 },
  { a: 'dado', marca: 'p2', ir: 260 },
  { espera: 1500 },
  { a: 'react', marca: 'codigo', ir: 780 },
  { espera: 2800 },
]);

const ET_GLYPHOS = [
  [0, 'Tira el dado'],
  ['p1', 'Cada semilla da una pieza distinta'],
  ['codigo', 'Y te la llevas como código para tu web'],
];

export function Glyphos() {
  const e = useEscena(G_GLYPHOS);
  const i = e.ya('p2') ? 2 : e.ya('p1') ? 1 : 0;
  const pieza = PIEZAS[i];
  const texto = useMezcla(pieza.campo);

  return (
    <Marco e={e} clase="pe--glyphos" etapas={ET_GLYPHOS}>
      <div className="gl">
        <header className="gl__barra">
          <b>
            <i className="gl__logo" />
            GLYPHOS
          </b>
          <span data-t="dado" className={`gl__dado ${e.pulsando === 'dado' ? 'is-pulsado' : ''}`}>
            <Dice5 size="1.15em" aria-hidden="true" />
            Tirar el dado
          </span>
        </header>

        <div className="gl__lienzo">
          <pre className="gl__campo">{texto}</pre>
          <div className="gl__ficha">
            <span className="pe-mini">Pieza n.º {i + 1}</span>
            <b>{pieza.nombre}</b>
            <span>semilla: {pieza.semilla}</span>
          </div>
        </div>

        <div className="gl__salidas">
          <em>Sale como</em>
          {['PNG', 'SVG', 'MP4', 'GIF', 'ANSI'].map((s) => (
            <span key={s}>{s}</span>
          ))}
          <span data-t="react" className={e.ya('codigo') ? 'is-activa' : ''}>
            REACT
          </span>
        </div>

        <AnimatePresence>
          {e.ya('codigo') && (
            <Motion.div className="gl__codigo" {...POP}>
              <code>{`<Glyphos semilla="${pieza.semilla}" />`}</code>
              <span>
                <Check size="1em" aria-hidden="true" /> Copiado
              </span>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </Marco>
  );
}

/* ============================================================
   PASTELERÍA CONFETTI — pedido, abono y tres sucursales a la vista
   ============================================================ */

const G_CONFETTI = guion([
  { espera: 900 },
  { espera: 1400, marca: 'pedido' },
  { a: 'abono', marca: 'abono' },
  { espera: 1500 },
  { a: 'corte', marca: 'corte', ir: 760 },
  { espera: 2700 },
]);

const ET_CONFETTI = [
  [0, 'Tres sucursales en la misma pantalla'],
  ['pedido', 'Entra un pedido desde el catálogo'],
  ['abono', 'La sucursal registra el abono'],
  ['corte', 'Y el corte de cada una, sin sumar a mano'],
];

export function Confetti() {
  const e = useEscena(G_CONFETTI);
  const abono = e.ya('abono');
  const corte = e.ya('corte');
  const sucursales = [
    { n: 'Sucursal 1', v: 4280, p: 9 },
    { n: 'Sucursal 2', v: abono ? 3550 : 3150, p: e.ya('pedido') ? 7 : 6 },
    { n: 'Sucursal 3', v: 5020, p: 11 },
  ];

  return (
    <Marco e={e} clase="pe--confetti" etapas={ET_CONFETTI}>
      <Ventana url="confetti / panel de dueño">
        <div className="cf">
          <header className="cf__cabeza">
            <div>
              <span className="pe-mini">Hoy · las tres sucursales</span>
              <Cifra valor={abono ? 12850 : 12450} className="cf__total" />
            </div>
            <span data-t="corte" className={`pe-boton ${corte ? 'is-hecho' : ''} ${e.pulsando === 'corte' ? 'is-pulsado' : ''}`}>
              {corte ? (
                <>
                  <Check size="1.05em" aria-hidden="true" /> Cortes cerrados
                </>
              ) : (
                'Cerrar cortes'
              )}
            </span>
          </header>

          <div className="cf__sucursales">
            {sucursales.map((s, i) => (
              <div key={s.n} className={`cf__sucursal ${i === 1 && e.ya('pedido') && !corte ? 'is-viva' : ''}`}>
                <b>{s.n}</b>
                <Cifra valor={s.v} />
                <span>{s.p} pedidos</span>
                <AnimatePresence>
                  {corte && (
                    <Motion.em {...POP} transition={{ ...REBOTE, delay: i * 0.13 }}>
                      <Check size="1em" aria-hidden="true" /> Corte
                    </Motion.em>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {e.ya('pedido') && !corte && (
              <Motion.div className="cf__pedido" initial={{ opacity: 0, y: 30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16 }} transition={REBOTE}>
                <div>
                  <span className="pe-mini">Pedido del catálogo · Sucursal 2</span>
                  <b>Pastel de base + Velas</b>
                  <span className="cf__barra">
                    <i style={{ width: abono ? '47%' : '0%' }} />
                  </span>
                  <small>{abono ? 'Abono $400 · resta $450' : 'Total $850 · sin abono'}</small>
                </div>
                <span data-t="abono" className={`pe-boton ${abono ? 'is-hecho' : ''} ${e.pulsando === 'abono' ? 'is-pulsado' : ''}`}>
                  {abono ? 'Abonado' : 'Registrar abono'}
                </span>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </Ventana>
    </Marco>
  );
}

/* ============================================================
   ELECTROTÉCNICA BERLÍN — la venta, las existencias y el ticket
   ============================================================ */

const PIEZAS_EB = [
  { id: 'bocina', n: 'Bocina 8″', p: 420, s: 6 },
  { id: 'cable', n: 'Cable RCA', p: 85, s: 14 },
  { id: 'capacitor', n: 'Capacitor', p: 12, s: 40 },
  { id: 'servicio', n: 'Servicio de taller', p: 350, s: null },
];

const G_BERLIN = guion([
  { espera: 800 },
  { a: 'bocina', marca: 'bocina' },
  { a: 'cable', marca: 'cable', ir: 520 },
  { a: 'servicio', marca: 'servicio', ir: 640 },
  { a: 'cobrar', marca: 'cobrado', ir: 760 },
  { espera: 2900 },
]);

const ET_BERLIN = [
  [0, 'Piezas y servicios del taller en la misma venta'],
  ['cable', 'Las existencias bajan solas'],
  ['cobrado', 'Se cobra y la operación queda registrada'],
];

export function Berlin() {
  const e = useEscena(G_BERLIN);
  const lineas = PIEZAS_EB.filter((p) => p.id !== 'capacitor' && e.ya(p.id));
  const total = lineas.reduce((s, l) => s + l.p, 0);
  const cobrado = e.ya('cobrado');

  return (
    <Marco e={e} clase="pe--berlin" etapas={ET_BERLIN}>
      <div className="eb">
        <div className="eb__caja">
          <div className="eb__teclas">
            {PIEZAS_EB.map((p) => {
              const vendida = p.id !== 'capacitor' && e.ya(p.id);
              return (
                <div key={p.id} data-t={p.id} className={`eb__tecla ${e.pulsando === p.id ? 'is-pulsado' : ''} ${vendida ? 'is-vendida' : ''}`}>
                  <b>{p.n}</b>
                  <span>{pesos(p.p)}</span>
                  <em>{p.s == null ? 'taller' : `quedan ${p.s - (vendida ? 1 : 0)}`}</em>
                </div>
              );
            })}
          </div>
          <div className="eb__pie">
            <span>
              Total <Cifra valor={total} />
            </span>
            <span data-t="cobrar" className={`pe-boton ${cobrado ? 'is-hecho' : ''} ${e.pulsando === 'cobrar' ? 'is-pulsado' : ''}`}>
              {cobrado ? 'Cobrado' : 'Cobrar'}
            </span>
          </div>
        </div>

        <Motion.div className="eb__ticket" animate={{ y: cobrado ? '-0.5em' : '0.6em', rotate: cobrado ? -2 : 0 }} transition={MUELLE}>
          <strong>EB / 1974</strong>
          <span className="pe-mini">Venta #01982</span>
          <ul>
            <AnimatePresence initial={false}>
              {lineas.map((l) => (
                <Motion.li key={l.id} layout initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={MUELLE}>
                  <span>1× {l.n}</span>
                  <b>{pesos(l.p)}</b>
                </Motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <p>
            <span>Total</span>
            <b>{pesos(total)}</b>
          </p>
          <AnimatePresence>
            {cobrado && (
              <Motion.em initial={{ opacity: 0, scale: 1.8, rotate: -14 }} animate={{ opacity: 1, scale: 1, rotate: -4 }} transition={{ type: 'spring', stiffness: 600, damping: 20 }}>
                Operación registrada
              </Motion.em>
            )}
          </AnimatePresence>
        </Motion.div>
      </div>
    </Marco>
  );
}

/* ============================================================
   GESTECH — la mano manda: palma, índice, pinza
   ============================================================ */

const DEDOS = [
  { b: [34, 70], ang: -52, l: 19 },
  { b: [41, 54], ang: -13, l: 27 },
  { b: [50, 51], ang: 0, l: 30 },
  { b: [59, 54], ang: 11, l: 27 },
  { b: [66, 61], ang: 23, l: 21 },
];

const POSES = {
  reposo: { ext: [0.55, 0.5, 0.5, 0.5, 0.5], giro: [0, 0, 0, 0, 0] },
  palma: { ext: [1, 1, 1, 1, 1], giro: [0, 0, 0, 0, 0] },
  indice: { ext: [0.5, 1, 0.42, 0.4, 0.4], giro: [0, 0, 0, 0, 0] },
  pinza: { ext: [1, 0.4, 0.42, 0.4, 0.4], giro: [40, -45, 0, 0, 0] },
};

const MUNECA = [50, 91];

function mano(pose) {
  const { ext, giro } = POSES[pose];
  return DEDOS.map((d, i) => {
    const a = ((d.ang + giro[i]) * Math.PI) / 180;
    const dx = Math.sin(a) * d.l * ext[i];
    const dy = -Math.cos(a) * d.l * ext[i];
    return { b: d.b, m: [d.b[0] + dx * 0.55, d.b[1] + dy * 0.55], t: [d.b[0] + dx, d.b[1] + dy] };
  });
}

const HUESO = { type: 'spring', stiffness: 170, damping: 20 };

function Mano({ pose }) {
  const dedos = mano(pose);
  return (
    <g>
      {dedos.map((d, i) => (
        <g key={i}>
          <line x1={MUNECA[0]} y1={MUNECA[1]} x2={d.b[0]} y2={d.b[1]} />
          <Motion.line initial={false} animate={{ x1: d.b[0], y1: d.b[1], x2: d.m[0], y2: d.m[1] }} transition={HUESO} />
          <Motion.line initial={false} animate={{ x1: d.m[0], y1: d.m[1], x2: d.t[0], y2: d.t[1] }} transition={HUESO} />
          <circle cx={d.b[0]} cy={d.b[1]} r="1.5" />
          <Motion.circle r="1.5" initial={false} animate={{ cx: d.m[0], cy: d.m[1] }} transition={HUESO} />
          <Motion.circle r="2" className="es-punta" initial={false} animate={{ cx: d.t[0], cy: d.t[1] }} transition={HUESO} />
        </g>
      ))}
      <circle cx={MUNECA[0]} cy={MUNECA[1]} r="2" />
    </g>
  );
}

const G_GESTECH = guion([
  { espera: 1000 },
  { espera: 1100, marca: 'palma' },
  { espera: 900, marca: 'activo' },
  { espera: 1500, marca: 'indice' },
  { espera: 800, marca: 'pinza' },
  { espera: 2400, marca: 'abierto' },
]);

const ET_GESTECH = [
  [0, 'Sin el gesto de entrada, no hace nada'],
  ['palma', 'Palma abierta un segundo: se activa'],
  ['indice', 'El índice mueve el cursor'],
  ['pinza', 'La pinza hace clic, sin tocar el ratón'],
];

export function Gestech() {
  const e = useEscena(G_GESTECH);
  const pose = e.ya('abierto') ? 'indice' : e.ya('pinza') ? 'pinza' : e.ya('indice') ? 'indice' : e.ya('palma') ? 'palma' : 'reposo';
  const activo = e.ya('activo');
  const lejos = e.ya('indice');

  return (
    <Marco e={e} clase="pe--gestech" etapas={ET_GESTECH} sinCursor>
      <div className="gt">
        <div className="gt__camara">
          <span className="pe-mini">
            <i /> Cámara web
          </span>
          <svg viewBox="18 12 64 84" aria-hidden="true">
            <Motion.g initial={false} animate={{ x: lejos ? -9 : 0, y: lejos ? -5 : 0 }} transition={{ type: 'spring', stiffness: 90, damping: 16 }}>
              <Mano pose={pose} />
            </Motion.g>
          </svg>
          <span className={`gt__estado ${activo ? 'is-activo' : ''}`}>{activo ? 'Activo' : e.ya('palma') ? 'Sosteniendo…' : 'Idle'}</span>
        </div>

        <div className="gt__escritorio">
          <div className="gt__iconos">
            <span className={e.en('pinza') ? 'is-pulsado' : ''}>
              <Folder size="1.5em" aria-hidden="true" />
              Proyecto
            </span>
            <span>
              <Globe size="1.5em" aria-hidden="true" />
              Web
            </span>
            <span>
              <Music size="1.5em" aria-hidden="true" />
              Música
            </span>
          </div>
          <AnimatePresence>
            {e.ya('abierto') && (
              <Motion.div className="gt__ventana" {...POP}>
                <i />
                <b>Proyecto</b>
                <span />
                <span />
              </Motion.div>
            )}
          </AnimatePresence>
          <Motion.span
            className="gt__puntero"
            initial={false}
            animate={{ left: lejos ? '10.5%' : '62%', top: lejos ? '7.5%' : '60%', opacity: activo ? 1 : 0.25, scale: e.en('pinza') ? 0.8 : 1 }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
          <div className="gt__gestos">
            {[
              ['palma', 'Palma', 'activar'],
              ['indice', 'Índice', 'mover'],
              ['pinza', 'Pinza', 'clic'],
            ].map(([id, n, que]) => (
              <span key={id} className={pose === id ? 'is-activa' : ''}>
                <b>{n}</b>
                {que}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Marco>
  );
}

/* ============================================================
   MH PHOTO BOOTH — sin internet, en cola, sincronizado, descargado
   ============================================================ */

const G_FOTO = guion([
  { espera: 700 },
  { a: 'disparo', marca: 'disparo' },
  { espera: 2000 },
  { espera: 1300, marca: 'senal' },
  { espera: 900, marca: 'sync' },
  { a: 'bajar', marca: 'bajada', ir: 800 },
  { espera: 2400 },
]);

const ET_FOTO = [
  [0, 'La cabina trabaja aunque no haya internet'],
  ['disparo', 'Las fotos se guardan en el equipo'],
  ['senal', 'Vuelve la señal y se suben solas'],
  ['sync', 'El invitado las baja con su folio'],
];

export function PhotoBooth() {
  const e = useEscena(G_FOTO);
  const tomadas = e.ya('disparo');
  const senal = e.ya('senal');
  const sync = e.ya('sync');

  return (
    <Marco e={e} clase="pe--foto" etapas={ET_FOTO}>
      <div className="fb">
        <div className={`fb__tira ${tomadas ? 'is-llena' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <i key={i} style={{ '--i': i }} />
          ))}
          <span>MH · PHOTO BOOTH</span>
        </div>

        <div className="fb__cabina">
          <div className={`fb__lente ${e.en('disparo') ? 'is-flash' : ''}`}>
            <Camera size="1.7em" aria-hidden="true" />
          </div>
          <span data-t="disparo" className={`fb__boton ${e.pulsando === 'disparo' ? 'is-pulsado' : ''}`} />
          <small>{tomadas ? '4 de 4' : 'Toca para empezar'}</small>
        </div>

        <div className="fb__lado">
          <div className={`fb__estado ${senal ? 'is-linea' : ''}`}>
            {senal ? <Wifi size="1.3em" aria-hidden="true" /> : <WifiOff size="1.3em" aria-hidden="true" />}
            <div>
              <b>{sync ? 'Sincronizado' : senal ? 'Subiendo…' : 'Sin internet'}</b>
              <span>{sync ? '4 fotos en la nube' : tomadas ? '4 fotos en cola' : 'Guardado local'}</span>
              <span className="fb__barra">
                <i style={{ width: sync ? '100%' : senal ? '55%' : '0%' }} />
              </span>
            </div>
          </div>

          <AnimatePresence>
            {sync && (
              <Motion.div className="fb__portal" {...SUBE}>
                <span className="pe-mini">Portal del invitado</span>
                <b>Folio MH-4821</b>
                <span data-t="bajar" className={`pe-boton ${e.ya('bajada') ? 'is-hecho' : ''} ${e.pulsando === 'bajar' ? 'is-pulsado' : ''}`}>
                  {e.ya('bajada') ? <Check size="1.05em" aria-hidden="true" /> : <Download size="1.05em" aria-hidden="true" />}
                  {e.ya('bajada') ? 'Descargadas' : 'Descargar fotos'}
                </span>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Marco>
  );
}

/* ============================================================
   NFC MANAGER — un toque abre el modo; otro cierra solo lo suyo
   ============================================================ */

const G_NFC = guion([
  { espera: 900 },
  { espera: 800, marca: 'toque1' },
  { espera: 2300, marca: 'abre' },
  { espera: 800, marca: 'toque2' },
  { espera: 2700, marca: 'cierra' },
]);

const ET_NFC = [
  [0, 'Una etiqueta NFC por cada modo'],
  ['toque1', 'La tocas con el teléfono'],
  ['abre', 'La PC abre todo lo de ese modo'],
  ['cierra', 'Al salir cierra solo lo que abrió'],
];

const APPS_NFC = [
  { n: 'VS Code', icono: Code2 },
  { n: 'Carpeta del proyecto', icono: Folder },
  { n: 'Playlist de foco', icono: Music },
];

export function Nfc() {
  const e = useEscena(G_NFC);
  const tocando = e.en('toque1') || e.en('toque2');
  const abierto = e.ya('abre') && !e.ya('cierra');

  return (
    <Marco e={e} clase="pe--nfc" etapas={ET_NFC} sinCursor>
      <div className="nf">
        <div className="nf__toque">
          <Motion.div className="nf__tel" animate={{ y: tocando ? '2.5em' : '0em', rotate: tocando ? -4 : -12 }} transition={{ type: 'spring', stiffness: 200, damping: 16 }}>
            <Smartphone size="1.3em" aria-hidden="true" />
            <span>{abierto || e.en('toque2') ? 'Modo Trabajo' : 'NFC'}</span>
          </Motion.div>
          <div className={`nf__etiqueta ${tocando ? 'is-leida' : ''}`}>
            <i />
            <i />
            <b>TAG 04</b>
          </div>
        </div>

        <div className="nf__pc">
          <header>
            <span className="pe-mini">Tu PC</span>
            <b className={abierto ? 'is-activo' : ''}>{abierto ? 'Modo Trabajo' : 'Sin modo'}</b>
          </header>
          <div className="nf__ventanas">
            <div className="nf__app nf__app--previa">
              <Mail size="1.2em" aria-hidden="true" />
              <b>Tu correo</b>
              <em>ya estaba abierto</em>
            </div>
            <AnimatePresence>
              {abierto &&
                APPS_NFC.map((a, i) => (
                  <Motion.div
                    key={a.n}
                    className="nf__app"
                    initial={{ opacity: 0, scale: 0.5, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: { ...REBOTE, delay: i * 0.14 } }}
                    exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.25, delay: i * 0.1 } }}
                  >
                    <a.icono size="1.2em" aria-hidden="true" />
                    <b>{a.n}</b>
                    <em>lo abrió el modo</em>
                  </Motion.div>
                ))}
            </AnimatePresence>
          </div>
          <Hecho visible={e.ya('cierra')} clase="nf__hecho">
            Tu correo sigue ahí
          </Hecho>
        </div>
      </div>
    </Marco>
  );
}

/* ============================================================
   MORPHIQ UI — el mismo componente en otro material
   ============================================================ */

const MATERIALES = [
  { id: 'clay', n: 'Clay' },
  { id: 'glass', n: 'Glass' },
  { id: 'skeuo', n: 'Skeuo' },
  { id: 'adaptive', n: 'Adaptive' },
];

const G_UI = guion([
  { espera: 1000 },
  { a: 'glass', marca: 'glass' },
  { espera: 1000 },
  { a: 'skeuo', marca: 'skeuo', ir: 420 },
  { espera: 1000 },
  { a: 'exportar', marca: 'exportar', ir: 800 },
  { espera: 2800 },
]);

const ET_UI = [
  [0, 'Un botón, un campo y un interruptor'],
  ['glass', 'Cambia el material, no el código'],
  ['exportar', 'Y exporta justo lo que estás viendo'],
];

export function MorphiqUi() {
  const e = useEscena(G_UI);
  const mat = e.ya('skeuo') ? 'skeuo' : e.ya('glass') ? 'glass' : 'clay';

  return (
    <Marco e={e} clase="pe--ui" etapas={ET_UI}>
      <div className="mu">
        <header className="mu__barra">
          <b>
            <i /> Morphiq UI
          </b>
          <span className="mu__materiales">
            {MATERIALES.map((m) => (
              <span key={m.id} data-t={m.id} className={`pe-ficha ${mat === m.id ? 'is-activa' : ''}`}>
                {m.n}
              </span>
            ))}
          </span>
        </header>

        <div className={`mu__escenario mu--${mat}`}>
          <div className="mu__pieza">
            <span className="mu__campo">correo@negocio.mx</span>
            <span className="mu__fila">
              <span className="mu__interruptor">
                <i />
              </span>
              Recordarme
            </span>
            <span className="mu__boton">Continuar</span>
          </div>
        </div>

        <div className="mu__pie">
          <AnimatePresence>
            {e.ya('exportar') && (
              <Motion.code {...SUBE}>{`<Button material="${mat}">Continuar</Button>`}</Motion.code>
            )}
          </AnimatePresence>
          <span data-t="exportar" className={`pe-boton ${e.ya('exportar') ? 'is-hecho' : ''} ${e.pulsando === 'exportar' ? 'is-pulsado' : ''}`}>
            {e.ya('exportar') ? <Check size="1.05em" aria-hidden="true" /> : <Code2 size="1.05em" aria-hidden="true" />}
            {e.ya('exportar') ? 'Copiado' : 'Exportar'}
          </span>
        </div>
      </div>
    </Marco>
  );
}

/* ============================================================
   MORPHIQPOS — el mismo sistema, otro negocio
   ============================================================ */

const GIROS = [
  { id: 'resto', n: 'Restaurante', color: '#3ddc97', cabeza: 'Mesa 7 · 4 personas', teclas: ['Tacos', 'Enchiladas', 'Agua fresca'], lineas: [['Tacos de sirloin', 145], ['Agua de jamaica', 38]] },
  { id: 'cafe', n: 'Cafetería', color: '#f0a92b', cabeza: 'Para llevar · Ana', teclas: ['Latte', 'Americano', 'Panqué'], lineas: [['Latte grande', 62], ['Panqué de nuez', 45]] },
  { id: 'ferre', n: 'Ferretería', color: '#5b8def', cabeza: 'Venta por medida', teclas: ['Cable · m', 'Tubo · m', 'Tornillo · pza'], lineas: [['Cable 3.5 m', 98], ['12 tornillos', 36]] },
  { id: 'salon', n: 'Estética', color: '#ff7ab8', cabeza: 'Cita 4:30 · Luis', teclas: ['Corte', 'Barba', 'Tinte'], lineas: [['Corte clásico', 180], ['Arreglo de barba', 120]] },
];

const G_POS = guion([
  { espera: 1100 },
  { a: 'cafe', marca: 'cafe' },
  { espera: 1100 },
  { a: 'salon', marca: 'salon', ir: 560 },
  { espera: 1100 },
  { a: 'cobrar', marca: 'cobrado', ir: 800 },
  { espera: 2600 },
]);

const ET_POS = [
  [0, 'Un restaurante cobra por mesa'],
  ['cafe', 'Otro negocio: cambian sus pantallas y sus palabras'],
  ['salon', 'Una estética cobra por cita'],
  ['cobrado', 'El mismo sistema debajo de todos'],
];

export function MorphiqPos() {
  const e = useEscena(G_POS);
  const giro = GIROS[e.ya('salon') ? 3 : e.ya('cafe') ? 1 : 0];
  const total = giro.lineas.reduce((s, [, p]) => s + p, 0);
  const cobrado = e.ya('cobrado');

  return (
    <Marco e={e} clase="pe--mpos" etapas={ET_POS}>
      <div className="mp" style={{ '--pe-ac': giro.color }}>
        <div className="mp__giros">
          {GIROS.map((g) => (
            <span key={g.id} data-t={g.id} className={`pe-ficha ${giro.id === g.id ? 'is-activa' : ''}`}>
              {g.n}
            </span>
          ))}
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          <Motion.div
            key={giro.id}
            className="mp__pantalla"
            initial={{ opacity: 0, x: 26, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -26, filter: 'blur(6px)' }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mp__teclas">
              {giro.teclas.map((t, i) => (
                <Motion.span key={t} initial={{ opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...REBOTE, delay: 0.1 + i * 0.07 }}>
                  <i />
                  {t}
                </Motion.span>
              ))}
            </div>
            <div className="mp__cuenta">
              <b>{giro.cabeza}</b>
              {giro.lineas.map(([n, p]) => (
                <span key={n}>
                  {n}
                  <em>{pesos(p)}</em>
                </span>
              ))}
              <span className="mp__total">
                Total
                <Cifra valor={total} />
              </span>
              <span data-t="cobrar" className={`pe-boton ${cobrado ? 'is-hecho' : ''} ${e.pulsando === 'cobrar' ? 'is-pulsado' : ''}`}>
                {cobrado ? (
                  <>
                    <Check size="1.05em" aria-hidden="true" /> Cobrado
                  </>
                ) : (
                  'Cobrar'
                )}
              </span>
            </div>
          </Motion.div>
        </AnimatePresence>
      </div>
    </Marco>
  );
}
