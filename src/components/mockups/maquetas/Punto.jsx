import { useCallback, useMemo, useRef, useState } from 'react';

import { useCicloVisible } from '../../../hooks/useCicloVisible';

/**
 * ============================================================
 * PUNTO DE VENTA — «aquí se cobra»
 * ============================================================
 *
 * POR QUÉ SE REHIZO
 * La versión anterior tenía un ticket a la izquierda y un TECLADO NUMÉRICO
 * de nueve teclas a la derecha. Encogida a 0.52 dentro de la tarjeta, lo
 * único que sobrevivía eran esas nueve teclas cuadradas: la forma grande
 * mandaba, y la forma grande era una calculadora. La gente lo leía como una
 * calculadora porque, a ese tamaño, ES una calculadora.
 *
 * QUÉ SE MUESTRA AHORA
 * Productos con nombre y precio, un ticket que crece y un total gordo. Nadie
 * teclea precios en un punto de venta que valga la pena: toca el producto.
 * Y esa —tocar el producto, ver subir el total— es la imagen que cualquiera
 * reconoce sin leer una sola palabra.
 *
 * LA REGLA DE LAS DOS DISTANCIAS
 * Esta maqueta se pinta en dos sitios con tamaños muy distintos:
 *
 *   · Tarjeta de la home → dentro de un `<Link>`, encogida a 0.52. Aquí no
 *     puede haber interacción (cualquier toque navega) y el texto pequeño no
 *     se lee. Manda la silueta: rejilla de productos, ticket, total.
 *   · Cabecera de /servicios/sistemas-para-negocios → suelta y a su tamaño.
 *     Aquí sí se toca, y el detalle fino se lee.
 *
 * Es el mismo dibujo con dos comportamientos, no dos dibujos.
 */

const CATALOGO = [
  { id: 'cafe', nombre: 'Café', precio: 35 },
  { id: 'concha', nombre: 'Concha', precio: 18 },
  { id: 'jugo', nombre: 'Jugo', precio: 28 },
  { id: 'torta', nombre: 'Torta', precio: 52 },
  { id: 'agua', nombre: 'Agua', precio: 15 },
  { id: 'pay', nombre: 'Rebanada', precio: 45 },
];

/* La venta que se arma sola cuando nadie toca: cuatro pasos, y el cuarto es
   el cobro. Que el ciclo termine cobrando es lo que cuenta la historia
   entera; si se quedara sumando, la maqueta solo diría «aquí hay una
   lista». */
const GUION = [
  [],
  [{ id: 'cafe', n: 2 }],
  [{ id: 'cafe', n: 2 }, { id: 'concha', n: 1 }],
  [{ id: 'cafe', n: 2 }, { id: 'concha', n: 1 }, { id: 'jugo', n: 1 }],
];

const pesos = (n) => `$${n.toLocaleString('es-MX')}`;

export function Punto({ interactivo = false }) {
  const caja = useRef(null);
  const [cesta, setCesta] = useState([]);
  const [cobrado, setCobrado] = useState(false);
  const [paso, quieto] = useCicloVisible(GUION.length + 1, {
    ms: 1500,
    activo: !interactivo,
    ref: caja,
    /* Con movimiento reducido se congela en el paso 3: la venta completa,
       antes de cobrar. Es el fotograma que más cuenta de los cinco. */
    pasoQuieto: 3,
  });

  /* En modo quieto la cesta la dicta el guion; en modo interactivo, el
     visitante. Una sola fuente para pintar, dos formas de llenarla. */
  const enGuion = paso >= GUION.length;
  const lineas = interactivo ? cesta : GUION[Math.min(paso, GUION.length - 1)];
  const cobrando = interactivo ? cobrado : enGuion;

  const total = useMemo(
    () =>
      lineas.reduce((suma, l) => {
        const p = CATALOGO.find((c) => c.id === l.id);
        return suma + (p ? p.precio * l.n : 0);
      }, 0),
    [lineas]
  );

  const agregar = useCallback((id) => {
    setCobrado(false);
    setCesta((actual) => {
      const ya = actual.find((l) => l.id === id);
      if (ya) return actual.map((l) => (l.id === id ? { ...l, n: l.n + 1 } : l));
      return [...actual, { id, n: 1 }];
    });
  }, []);

  const cobrar = useCallback(() => {
    if (!cesta.length) return;
    setCobrado(true);
    setCesta([]);
  }, [cesta.length]);

  return (
    /* `demo` se conserva además de `mq`: de esa clase cuelgan las reglas de
       encaje de los tres envoltorios que ya existen —el marco de la tarjeta,
       la pantalla de la cabecera y el tope de ancho de `mockups.css`—.
       Quitarla obligaría a tocar esos tres sitios a la vez sin ganar nada. */
    <div
      ref={caja}
      className={`demo mq mq--punto ${interactivo ? 'is-vivo' : ''} ${quieto ? 'is-quieto' : ''}`}
    >
      <div className="mq__barra">
        <span className="mq__pastilla mq__pastilla--viva">Caja abierta</span>
        <b className="mq__marca">Punto de venta</b>
      </div>

      <div className="punto__cuerpo">
        {/* ---- El ticket ---- */}
        <div className="punto__ticket">
          <span className="punto__ticket-cabeza">Ticket</span>

          <div className="punto__lineas">
            {lineas.length === 0 && !cobrando && (
              <p className="punto__vacio">
                {interactivo ? 'Toca un producto' : 'Nueva venta'}
              </p>
            )}
            {cobrando && lineas.length === 0 && (
              <p className="punto__cobrado">
                <i aria-hidden="true" />
                Venta registrada
              </p>
            )}
            {lineas.map((l) => {
              const p = CATALOGO.find((c) => c.id === l.id);
              if (!p) return null;
              return (
                <span key={l.id} className="punto__linea">
                  <b>{l.n}</b>
                  <em>{p.nombre}</em>
                  <i>{pesos(p.precio * l.n)}</i>
                </span>
              );
            })}
          </div>

          {/* El total es lo más grande del dibujo a propósito: es lo único
              que tiene que leerse cuando la maqueta va encogida a la mitad
              dentro de una tarjeta. */}
          <div className="punto__total">
            <span>Total</span>
            <strong>{pesos(total)}</strong>
          </div>
        </div>

        {/* ---- Los productos ---- */}
        <div className="punto__catalogo">
          {CATALOGO.map((p) => {
            const contenido = (
              <>
                <em>{p.nombre}</em>
                <i>{pesos(p.precio)}</i>
              </>
            );
            /* Botón de verdad solo cuando la maqueta es interactiva. En la
               tarjeta de la home el mismo dibujo va como `<span>`: un botón
               dentro de un enlace y bajo `aria-hidden` sería un blanco
               enfocable invisible para el lector de pantalla. */
            return interactivo ? (
              <button
                key={p.id}
                type="button"
                className="punto__producto"
                onClick={() => agregar(p.id)}
              >
                {contenido}
              </button>
            ) : (
              <span key={p.id} className="punto__producto">
                {contenido}
              </span>
            );
          })}
        </div>
      </div>

      {interactivo ? (
        <button
          type="button"
          className={`punto__cobrar ${cesta.length ? '' : 'is-apagado'}`}
          onClick={cobrar}
          disabled={!cesta.length}
        >
          Cobrar {total > 0 ? pesos(total) : ''}
        </button>
      ) : (
        <span className={`punto__cobrar ${cobrando ? 'is-pulsado' : ''}`}>
          Cobrar {total > 0 ? pesos(total) : ''}
        </span>
      )}
    </div>
  );
}
