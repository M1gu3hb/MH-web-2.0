/**
 * ============================================================
 * CONEXIÓN — lo que entra por la web cae en caja
 * ============================================================
 *
 * Un diagrama, no un adorno: tres entradas a la izquierda, el sistema en
 * medio y cuatro destinos a la derecha, con el pedido viajando por los
 * cables.
 *
 * CÓMO ESTÁ HECHO
 * Los nodos son HTML de verdad en una rejilla de cinco columnas —se leen,
 * se seleccionan y un lector los anuncia como dos listas— y los cables son
 * dos SVG que se ESTIRAN para llenar su hueco (`preserveAspectRatio="none"`).
 * Como las filas de cada lista miden lo mismo, el centro de cada nodo cae
 * siempre en la misma fracción del alto, y el cable llega a su sitio en
 * cualquier ancho sin medir nada con JavaScript.
 *
 * El «pedido» no es un punto que se mueve: es un tramo brillante del propio
 * trazo que avanza. Un círculo dentro de un SVG estirado saldría ovalado;
 * un trazo no se deforma.
 *
 * En teléfono los cables laterales no caben y el diagrama se pone de pie:
 * entradas arriba, sistema en medio, destinos abajo, unidos por un tubo.
 */

import { Globe, LayoutDashboard, Package, QrCode, Soup, UserRound, Wallet } from 'lucide-react';

import { POS_CONEXION } from '../../content/morphiqpos';

const ICONOS = {
  web: Globe,
  qr: QrCode,
  portal: UserRound,
  caja: Wallet,
  cocina: Soup,
  inventario: Package,
  tablero: LayoutDashboard,
};

/* Un cable por nodo: sale del centro de su fila y llega al centro del lado
   contrario. */
function Cables({ n, haciaCentro }) {
  return (
    /* El envoltorio es quien ocupa la celda de la rejilla; el SVG se estira
       dentro de él. Un SVG puesto directamente como celda no toma el alto de
       la fila: se queda en sus 150 px de fábrica y los cables no llegan. */
    <div className="conexion__cables" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
      {Array.from({ length: n }, (_, i) => {
        const y = ((i + 0.5) / n) * 100;
        const d = haciaCentro ? `M0 ${y} C 55 ${y}, 45 50, 100 50` : `M0 50 C 55 50, 45 ${y}, 100 ${y}`;
        return (
          <g key={i}>
            <path className="conexion__cable" d={d} />
            <path className="conexion__pulso" d={d} pathLength="100" style={{ '--i': i }} />
          </g>
        );
      })}
      </svg>
    </div>
  );
}

function Nodo({ nodo }) {
  const Icono = ICONOS[nodo.id];
  return (
    <li className="conexion__nodo">
      <Icono size={18} aria-hidden="true" />
      <span>
        <b>{nodo.nombre}</b>
        <small>{nodo.nota}</small>
      </span>
    </li>
  );
}

export function Conexion() {
  return (
    <div className="conexion">
      <ul className="conexion__lado conexion__lado--entra" aria-label="Por dónde entra un pedido">
        {POS_CONEXION.entradas.map((n) => (
          <Nodo key={n.id} nodo={n} />
        ))}
      </ul>

      <Cables n={POS_CONEXION.entradas.length} haciaCentro />

      {/* El núcleo, dibujado con caracteres. El texto real va en el
          `aria-label`; el dibujo es para la vista. */}
      <div className="conexion__nucleo" role="img" aria-label="MorphiqPOS, el sistema que recibe y reparte cada pedido">
        <pre aria-hidden="true">{`+----------------------+
|                      |
|     M O R P H I Q    |
|        [ POS ]       |
|                      |
+----------------------+`}</pre>
        <p className="conexion__registro" aria-hidden="true">
          <span>&gt; pedido #128 recibido</span>
          <span>&gt; inventario -3 insumos</span>
          <span>&gt; comanda -&gt; cocina</span>
          <span>&gt; suma al corte OK</span>
        </p>
      </div>

      <Cables n={POS_CONEXION.salidas.length} />

      <ul className="conexion__lado conexion__lado--sale" aria-label="A dónde llega">
        {POS_CONEXION.salidas.map((n) => (
          <Nodo key={n.id} nodo={n} />
        ))}
      </ul>
    </div>
  );
}
