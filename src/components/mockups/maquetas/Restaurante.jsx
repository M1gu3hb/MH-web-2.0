import { useCallback, useMemo, useRef, useState } from 'react';

import { useCicloVisible } from '../../../hooks/useCicloVisible';

/**
 * ============================================================
 * RESTAURANTES — «se pide del QR y la cocina ya lo tiene»
 * ============================================================
 *
 * POR QUÉ SE REHIZO
 * La anterior partía el ancho en dos: el teléfono con el menú y el panel de
 * cocina. La idea era buena, pero cada mitad recibía la mitad del sitio, así
 * que a media escala se leía como «una pantalla cortada por la mitad» —que
 * es literalmente como la describió quien la vio—. Y sobre todo: las dos
 * mitades estaban ahí quietas, sin que nada dijera que la de la derecha
 * ocurre POR la de la izquierda.
 *
 * QUÉ SE MUESTRA AHORA
 * Lo mismo, pero con la relación a la vista: se toca un platillo en el menú
 * y la comanda aparece en cocina. El servicio no es «un menú digital» ni «un
 * panel de cocina»: es que lo uno dispare lo otro sin que nadie grite un
 * pedido desde la barra.
 *
 * El estado de la comanda avanza solo a «Listo» un momento después de
 * mandarla, porque esa es la parte que el dueño quiere ver: que la mesa se
 * despacha sin él en medio.
 */

const CARTA = [
  { id: 'suadero', nombre: 'Tacos de suadero', precio: 95 },
  { id: 'flor', nombre: 'Quesadilla de flor', precio: 78 },
  { id: 'horchata', nombre: 'Agua de horchata', precio: 45 },
];

/* El bucle de la tarjeta: menú vacío, un platillo, dos, y la comanda en
   cocina. Termina en cocina a propósito: es lo que distingue este servicio
   de «una carta en PDF». */
const GUION = [
  { pedido: [], enviado: false },
  { pedido: ['suadero'], enviado: false },
  { pedido: ['suadero', 'horchata'], enviado: false },
  { pedido: ['suadero', 'horchata'], enviado: true },
];

const pesos = (n) => `$${n.toLocaleString('es-MX')}`;

export function Restaurante({ interactivo = false }) {
  const caja = useRef(null);
  const [pedido, setPedido] = useState([]);
  const [enviado, setEnviado] = useState(false);
  const [paso, quieto] = useCicloVisible(GUION.length, {
    ms: 1900,
    activo: !interactivo,
    ref: caja,
    /* Quieto se queda con la comanda ya en cocina: es el único fotograma
       que cuenta el servicio entero de una sola mirada. */
    pasoQuieto: 3,
  });

  const escena = interactivo ? { pedido, enviado } : GUION[paso];

  const total = useMemo(
    () =>
      escena.pedido.reduce((s, id) => {
        const p = CARTA.find((c) => c.id === id);
        return s + (p ? p.precio : 0);
      }, 0),
    [escena.pedido]
  );

  const pedir = useCallback((id) => {
    setEnviado(false);
    setPedido((actual) => (actual.includes(id) ? actual : [...actual, id]));
  }, []);

  const mandar = useCallback(() => {
    if (!pedido.length) return;
    setEnviado(true);
  }, [pedido.length]);

  return (
    <div
      ref={caja}
      className={`demo mq mq--resto ${escena.enviado ? 'is-enviado' : ''} ${
        interactivo ? 'is-vivo' : ''
      } ${quieto ? 'is-quieto' : ''}`}
    >
      <div className="mq__barra">
        <span className="mq__pastilla mq__pastilla--viva">Mesa 7</span>
        <b className="mq__marca">Menú por QR</b>
      </div>

      <div className="resto__cuerpo">
        {/* ---- El teléfono del cliente ---- */}
        <div className="resto__menu">
          <span className="resto__menu-cabeza">Hoy en la cocina</span>
          <div className="resto__carta">
            {CARTA.map((p) => {
              const puesto = escena.pedido.includes(p.id);
              const cuerpo = (
                <>
                  <em>{p.nombre}</em>
                  <i>{pesos(p.precio)}</i>
                </>
              );
              const clase = `resto__platillo ${puesto ? 'is-puesto' : ''}`;
              return interactivo ? (
                <button key={p.id} type="button" className={clase} onClick={() => pedir(p.id)}>
                  {cuerpo}
                </button>
              ) : (
                <span key={p.id} className={clase}>
                  {cuerpo}
                </span>
              );
            })}
          </div>

          {interactivo ? (
            <button
              type="button"
              className={`resto__pedir ${escena.pedido.length ? '' : 'is-apagado'}`}
              onClick={mandar}
              disabled={!escena.pedido.length}
            >
              Pedir a la mesa {total > 0 ? `· ${pesos(total)}` : ''}
            </button>
          ) : (
            <span className={`resto__pedir ${escena.pedido.length ? '' : 'is-apagado'}`}>
              Pedir a la mesa {total > 0 ? `· ${pesos(total)}` : ''}
            </span>
          )}
        </div>

        {/* ---- La cocina ---- */}
        <div className="resto__cocina">
          <span className="resto__cocina-cabeza">
            <i aria-hidden="true" />
            Cocina
          </span>

          {escena.enviado ? (
            <div className="resto__comanda">
              <small>Mesa 7 · ahora</small>
              {escena.pedido.map((id) => {
                const p = CARTA.find((c) => c.id === id);
                return p ? <span key={id}>{p.nombre}</span> : null;
              })}
              <em className="resto__estado">Preparando</em>
            </div>
          ) : (
            <p className="resto__espera">Sin comandas nuevas</p>
          )}
        </div>
      </div>
    </div>
  );
}
