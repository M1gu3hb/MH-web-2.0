import { useCallback, useRef, useState } from 'react';

import { useCicloVisible } from '../../../hooks/useCicloVisible';

/**
 * ============================================================
 * PÁGINAS WEB — «aquí te encuentran y te compran»
 * ============================================================
 *
 * POR QUÉ SE REHIZO
 * La anterior era un navegador con un titular grande y una mancha de color.
 * Encogida a la mitad quedaba una caja clara con un renglón de texto: podía
 * ser una web, un documento o una diapositiva. No decía nada del servicio,
 * y menos todavía de que una web sirve para VENDER.
 *
 * QUÉ SE MUESTRA AHORA
 * Una tienda de verdad dentro del navegador —productos, precios, botón de
 * agregar y un carrito que cuenta— y un interruptor de dispositivo que la
 * pasa de escritorio a teléfono delante de tus ojos.
 *
 * Son las dos cosas que el visitante necesita creerse de una página, y
 * ninguna de las dos se puede afirmar sin demostrarla:
 *   · que se ve bien en el teléfono, que es donde la va a ver su cliente;
 *   · que puede cobrar, no solo lucir.
 *
 * El carrito es además lo que mete el ecommerce en la conversación sin
 * escribir la palabra en ningún sitio.
 */

const VITRINA = [
  { id: 'a', nombre: 'Producto', precio: 320 },
  { id: 'b', nombre: 'Producto', precio: 180 },
  { id: 'c', nombre: 'Producto', precio: 450 },
];

/* Cuatro pasos: escritorio vacío, escritorio con dos en el carrito, teléfono
   con dos, teléfono con tres. El ciclo alterna dispositivo Y llena el
   carrito, porque las dos ideas tienen que verse aunque nadie toque. */
const GUION = [
  { movil: false, carrito: 0 },
  { movil: false, carrito: 2 },
  { movil: true, carrito: 2 },
  { movil: true, carrito: 3 },
];

const pesos = (n) => `$${n.toLocaleString('es-MX')}`;

export function Sitio({ interactivo = false }) {
  const caja = useRef(null);
  const [movil, setMovil] = useState(false);
  const [carrito, setCarrito] = useState(0);
  const [paso, quieto] = useCicloVisible(GUION.length, {
    ms: 2100,
    activo: !interactivo,
    ref: caja,
    /* Sin movimiento se congela en teléfono con el carrito lleno: de los
       cuatro fotogramas es el que más cosas dice a la vez. */
    pasoQuieto: 3,
  });

  const escena = interactivo ? { movil, carrito } : GUION[paso];

  const agregar = useCallback(() => setCarrito((n) => Math.min(n + 1, 9)), []);

  return (
    <div
      ref={caja}
      className={`demo mq mq--sitio ${escena.movil ? 'is-movil' : ''} ${
        interactivo ? 'is-vivo' : ''
      } ${quieto ? 'is-quieto' : ''}`}
    >
      <div className="mq__barra">
        <span className="mq__pastilla mq__pastilla--viva">Publicado</span>

        {/* El interruptor de dispositivo. En la tarjeta de la home es un
            dibujo con una de las dos mitades encendida; en la página del
            servicio son dos botones de verdad. */}
        {interactivo ? (
          <span className="sitio__switch" role="group" aria-label="Ver la página en">
            <button
              type="button"
              className={!movil ? 'is-puesto' : ''}
              onClick={() => setMovil(false)}
              aria-pressed={!movil}
            >
              Escritorio
            </button>
            <button
              type="button"
              className={movil ? 'is-puesto' : ''}
              onClick={() => setMovil(true)}
              aria-pressed={movil}
            >
              Teléfono
            </button>
          </span>
        ) : (
          <span className="sitio__switch" aria-hidden="true">
            <span className={!escena.movil ? 'is-puesto' : ''}>Escritorio</span>
            <span className={escena.movil ? 'is-puesto' : ''}>Teléfono</span>
          </span>
        )}
      </div>

      {/* ---- El navegador ---- */}
      <div className="sitio__marco">
        <div className="sitio__cromo">
          <i /><i /><i />
          <em>tu-negocio.mx</em>
          <span className="sitio__carrito" data-lleno={escena.carrito > 0 ? 'si' : 'no'}>
            Carrito <b>{escena.carrito}</b>
          </span>
        </div>

        <div className="sitio__pagina">
          <div className="sitio__hero">
            <strong>Tu negocio</strong>
            <span>Lo que vendes, con su precio y su botón.</span>
          </div>

          <div className="sitio__vitrina">
            {VITRINA.map((p) => {
              const cuerpo = (
                <>
                  <span className="sitio__foto" aria-hidden="true" />
                  <em>{p.nombre}</em>
                  <i>{pesos(p.precio)}</i>
                  <span className="sitio__agregar">Agregar</span>
                </>
              );
              return interactivo ? (
                <button key={p.id} type="button" className="sitio__ficha" onClick={agregar}>
                  {cuerpo}
                </button>
              ) : (
                <span key={p.id} className="sitio__ficha">
                  {cuerpo}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
