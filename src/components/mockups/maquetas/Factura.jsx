import { useCallback, useRef, useState } from 'react';

import { useCicloVisible } from '../../../hooks/useCicloVisible';

/**
 * ============================================================
 * FACTURACIÓN AUTOMÁTICA — «el ticket se vuelve factura solo»
 * ============================================================
 *
 * Maqueta nueva: este servicio no existía en la web.
 *
 * QUÉ TIENE QUE ENTENDERSE SIN LEER
 * Que de un lado entra una venta y del otro sale una factura timbrada, y
 * que en medio no hay nadie capturando datos. La facturación es un trámite
 * que todo el mundo odia: la imagen tiene que enseñar el trámite RESUELTO,
 * no el formulario.
 *
 * De ahí el reparto: el ticket con su folio a la izquierda, la factura
 * armándose sola a la derecha, y abajo los dos archivos que el cliente de
 * verdad espera —el PDF y el XML—, que son la prueba de que esto es
 * facturación de a de veras y no un recibo bonito.
 *
 * SOBRE LO QUE SE ESCRIBE EN EL DIBUJO
 * El RFC va como `XAXX010101000`, que es el RFC genérico público del SAT
 * para operaciones con el público en general. No es de nadie. Poner uno
 * inventado con pinta de real sería escribir el dato fiscal de una empresa
 * que existe, y eso no se hace ni en una maqueta.
 */

/* Cuatro pasos: el ticket solo, la factura armándose, timbrada, y enviada.
   El bucle termina en «enviada por correo» porque ese es el momento en que
   el dueño deja de tener el problema. */
const PASOS = ['ticket', 'armando', 'timbrada', 'enviada'];

const FOLIO = 'A-2841';

export function Factura({ interactivo = false }) {
  const caja = useRef(null);
  const [estado, setEstado] = useState(0);
  const [paso, quieto] = useCicloVisible(PASOS.length, {
    ms: 1700,
    activo: !interactivo,
    ref: caja,
    /* Quieto se queda en «timbrada»: enseña el sello, que es la prueba, sin
       depender de una animación de envío que nadie va a ver. */
    pasoQuieto: 2,
  });

  const i = interactivo ? estado : paso;
  const armando = i >= 1;
  const timbrada = i >= 2;
  const enviada = i >= 3;

  const facturar = useCallback(() => {
    /* Un solo botón que recorre el ciclo y vuelve al principio: es lo que
       permite verlo otra vez sin recargar, y deja claro que el paso lento
       —el timbrado— existe. */
    setEstado((e) => (e >= PASOS.length - 1 ? 0 : e + 1));
  }, []);

  return (
    <div
      ref={caja}
      className={`demo mq mq--factura ${armando ? 'is-armando' : ''} ${
        timbrada ? 'is-timbrada' : ''
      } ${enviada ? 'is-enviada' : ''} ${interactivo ? 'is-vivo' : ''} ${
        quieto ? 'is-quieto' : ''
      }`}
    >
      <div className="mq__barra">
        <span className="mq__pastilla mq__pastilla--viva">
          {enviada ? 'Enviada' : timbrada ? 'Timbrada' : 'Venta del día'}
        </span>
        <b className="mq__marca">Facturación</b>
      </div>

      <div className="fac__cuerpo">
        {/* ---- La venta ---- */}
        <div className="fac__ticket">
          <span className="fac__ticket-cabeza">Ticket</span>
          <strong className="fac__folio">{FOLIO}</strong>
          <span className="fac__importe">$1,248</span>
          <span className="fac__pie">El cliente pide factura</span>
        </div>

        <span className="fac__flecha" aria-hidden="true" />

        {/* ---- La factura ---- */}
        <div className="fac__cfdi">
          <span className="fac__cfdi-cabeza">
            Factura
            {timbrada && <i className="fac__sello">Timbrada</i>}
          </span>

          <dl className="fac__datos">
            <div>
              <dt>RFC</dt>
              <dd>{armando ? 'XAXX010101000' : '—'}</dd>
            </div>
            <div>
              <dt>Folio fiscal</dt>
              <dd>{timbrada ? '3f9c…a71e' : '—'}</dd>
            </div>
          </dl>

          <div className="fac__archivos">
            <span className={timbrada ? 'is-listo' : ''}>PDF</span>
            <span className={timbrada ? 'is-listo' : ''}>XML</span>
          </div>
        </div>
      </div>

      {interactivo ? (
        <button type="button" className="fac__accion" onClick={facturar}>
          {enviada ? 'Otra venta' : timbrada ? 'Enviar por correo' : armando ? 'Timbrar' : 'Facturar'}
        </button>
      ) : (
        <span className="fac__accion">
          {enviada ? 'Enviada por correo, sin capturar nada' : timbrada ? 'Timbrada ante el SAT' : 'Facturar'}
        </span>
      )}
    </div>
  );
}
