/**
 * ============================================================
 * MÓDULOS — el control, pieza por pieza
 * ============================================================
 *
 * Una rejilla tipo bento donde cada celda lleva una miniatura que SE MUEVE
 * del módulo que nombra: el inventario baja, la cita cae en la agenda, el
 * PIN se teclea. Sale de dos referencias:
 *
 *   · «Bento Mini UI» (21st.dev): cada tarjeta con su pequeña interfaz
 *     animada, que arranca cuando entra en pantalla
 *   · `MagicBento` (React Bits): el foco de luz que sigue al cursor por
 *     toda la rejilla y enciende el borde de la celda que tiene debajo
 *
 * Las miniaturas son CSS: no hay un temporizador por celda. Sus animaciones
 * están en pausa hasta que la rejilla entra en pantalla, y con movimiento
 * reducido se quedan en su fotograma final.
 */

import { useEffect, useRef, useState } from 'react';
import { CalendarCheck, FileDown, KeyRound, Lock, PackagePlus, QrCode, Store, TriangleAlert, UserRound } from 'lucide-react';

import { POS_MODULOS } from '../../content/morphiqpos';

/* ---- Las ocho miniaturas ---- */

function MiniInventario() {
  const filas = [
    { nombre: 'Tortilla de maíz', nivel: 78, baja: 62 },
    { nombre: 'Queso Oaxaca', nivel: 34, baja: 12, alerta: true },
    { nombre: 'Arrachera', nivel: 61, baja: 48 },
    { nombre: 'Jamaica', nivel: 88, baja: 80 },
  ];
  return (
    <div className="mini mini--inventario">
      {filas.map((f, i) => (
        <div key={f.nombre} className={`mini-stock ${f.alerta ? 'is-alerta' : ''}`} style={{ '--de': `${f.nivel}%`, '--a': `${f.baja}%`, '--i': i }}>
          <span>{f.nombre}</span>
          <i>
            <b />
          </i>
          {f.alerta && (
            <em>
              <TriangleAlert size={12} aria-hidden="true" /> Pedir
            </em>
          )}
        </div>
      ))}
      <pre className="mini-kardex" aria-hidden="true">{`- 0.40 kg  venta #128   13:41\n- 2 pza    venta #129   13:44\n+ 12 kg    compra #37   14:02`}</pre>
    </div>
  );
}

function MiniCitas() {
  /* Columna, fila de inicio y duración de cada cita. La última es la que
     «cae» en bucle. */
  const citas = [
    [1, 1, 2],
    [2, 2, 1],
    [3, 1, 1],
    [4, 3, 2],
    [5, 2, 2],
    [3, 3, 1, true],
  ];
  return (
    <div className="mini mini--citas">
      {['L', 'M', 'X', 'J', 'V'].map((d) => (
        <span key={d} className="mini-dia">
          {d}
        </span>
      ))}
      {citas.map(([col, fila, dura, nueva], i) => (
        <i key={i} className={nueva ? 'is-nueva' : ''} style={{ gridColumn: col, gridRow: `${fila + 1} / span ${dura}` }} />
      ))}
      <em className="mini-citas__aviso">
        <CalendarCheck size={13} aria-hidden="true" /> Jueves 12:00 · confirmada
      </em>
    </div>
  );
}

function MiniClientes() {
  return (
    <div className="mini mini--clientes">
      <div className="mini-ficha">
        <span className="mini-ficha__inicial">
          <UserRound size={16} aria-hidden="true" />
        </span>
        <span>
          <b>Mariana R.</b>
          <small>Cliente desde marzo</small>
        </span>
      </div>
      <ul>
        <li>
          <span>Visitas</span>
          <b>12</b>
        </li>
        <li>
          <span>Lo de siempre</span>
          <b>Latte · concha</b>
        </li>
        <li className="is-saldo">
          <span>Saldo</span>
          <b>$0</b>
        </li>
      </ul>
    </div>
  );
}

function MiniPortal() {
  /* Un QR falso pero fijo: el mismo patrón en cada render, sin azar. */
  const celdas = '1110111101011010011101101101011110110101101101110'.split('');
  return (
    <div className="mini mini--portal">
      <div className="mini-telefono">
        <div className="mini-telefono__capa mini-telefono__capa--qr">
          <div className="mini-qr">
            {celdas.map((c, i) => (
              <i key={i} className={c === '1' ? 'is-on' : ''} />
            ))}
          </div>
          <span>
            <QrCode size={12} aria-hidden="true" /> Mesa 7
          </span>
        </div>
        <div className="mini-telefono__capa mini-telefono__capa--menu">
          <b>Menú de hoy</b>
          <i />
          <i />
          <i />
          <em>Pedir</em>
        </div>
        <div className="mini-telefono__capa mini-telefono__capa--listo">
          <b>Pedido recibido</b>
          <span>Te avisamos cuando salga</span>
        </div>
      </div>
    </div>
  );
}

function MiniUsuarios() {
  return (
    <div className="mini mini--usuarios">
      <div className="mini-pin" aria-hidden="true">
        <KeyRound size={15} />
        <i />
        <i />
        <i />
        <i />
      </div>
      <ul>
        <li className="is-si">
          <span>Cobrar</span>
          <b />
        </li>
        <li className="is-si">
          <span>Abrir caja</span>
          <b />
        </li>
        <li>
          <span>Dar descuentos</span>
          <Lock size={13} aria-hidden="true" />
        </li>
        <li>
          <span>Ver utilidad</span>
          <Lock size={13} aria-hidden="true" />
        </li>
      </ul>
    </div>
  );
}

function MiniCompras() {
  return (
    <div className="mini mini--compras">
      <div className="mini-entrada">
        <PackagePlus size={18} aria-hidden="true" />
        <span>
          <b>Compra #37</b>
          <small>Lácteos del Valle · 12 kg</small>
        </span>
      </div>
      <div className="mini-flecha" aria-hidden="true">
        {'- - - - >'}
      </div>
      <div className="mini-almacen">
        <span>Almacén</span>
        <b>
          <i>4 kg</i>
          <i>16 kg</i>
        </b>
        <small>Por pagar · $1,980</small>
      </div>
    </div>
  );
}

function MiniReportes() {
  return (
    <div className="mini mini--reportes">
      <svg viewBox="0 0 240 90" preserveAspectRatio="none" aria-hidden="true">
        <path className="mini-area" d="M0 78 L24 66 L48 70 L72 50 L96 56 L120 38 L144 44 L168 24 L192 30 L216 12 L240 18 L240 90 L0 90 Z" />
        <path className="mini-linea" pathLength="100" d="M0 78 L24 66 L48 70 L72 50 L96 56 L120 38 L144 44 L168 24 L192 30 L216 12 L240 18" />
      </svg>
      <div className="mini-reportes__pie">
        <span>Últimos 30 días</span>
        <em>
          <FileDown size={12} aria-hidden="true" /> CSV
        </em>
        <em>
          <FileDown size={12} aria-hidden="true" /> PDF
        </em>
      </div>
    </div>
  );
}

function MiniSucursales() {
  const lista = [
    { nombre: 'Centro', v: 92 },
    { nombre: 'Norte', v: 64 },
    { nombre: 'Sur', v: 78 },
  ];
  return (
    <div className="mini mini--sucursales">
      {lista.map((s, i) => (
        <div key={s.nombre} style={{ '--v': `${s.v}%`, '--i': i }}>
          <span>
            <Store size={13} aria-hidden="true" /> {s.nombre}
          </span>
          <i>
            <b />
          </i>
        </div>
      ))}
    </div>
  );
}

const MINIS = {
  inventario: MiniInventario,
  citas: MiniCitas,
  clientes: MiniClientes,
  portal: MiniPortal,
  usuarios: MiniUsuarios,
  compras: MiniCompras,
  reportes: MiniReportes,
  sucursales: MiniSucursales,
};

export function Modulos() {
  const rejilla = useRef(null);
  const [vista, setVista] = useState(false);

  useEffect(() => {
    const nodo = rejilla.current;
    if (!nodo) return undefined;
    const io = new IntersectionObserver(([e]) => setVista(e.isIntersecting), { threshold: 0.12 });
    io.observe(nodo);
    return () => io.disconnect();
  }, []);

  /* El foco: una sola escucha en la rejilla, que le dice a cada celda dónde
     queda el cursor respecto a ELLA. El borde se pinta con esas dos
     variables, así que la luz cruza de una celda a la vecina sin corte. */
  useEffect(() => {
    const nodo = rejilla.current;
    if (!nodo || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    let raf = 0;
    const mover = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        for (const celda of nodo.children) {
          const b = celda.getBoundingClientRect();
          celda.style.setProperty('--mx', `${e.clientX - b.left}px`);
          celda.style.setProperty('--my', `${e.clientY - b.top}px`);
        }
      });
    };
    nodo.addEventListener('pointermove', mover, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      nodo.removeEventListener('pointermove', mover);
    };
  }, []);

  return (
    <ul ref={rejilla} className={`modulos ${vista ? 'is-vista' : ''}`}>
      {POS_MODULOS.map((m, i) => {
        const Mini = MINIS[m.id];
        return (
          <li key={m.id} className={`modulo modulo--${m.id}`}>
            <div className="modulo__visual" aria-hidden="true">
              <Mini />
            </div>
            <div className="modulo__texto">
              <span className="modulo__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{m.nombre}</h3>
              <p>{m.cuerpo}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
