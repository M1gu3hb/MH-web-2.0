import { useCallback, useRef, useState } from 'react';

import { useCicloVisible } from '../../../hooks/useCicloVisible';

/**
 * ============================================================
 * CRM Y AUTOMATIZACIÓN — «el cliente avanza y el mensaje sale solo»
 * ============================================================
 *
 * POR QUÉ SE REHIZO
 * En la tarjeta iba un lienzo de nodos y cables tipo n8n. A media escala,
 * los nodos son cuadritos de ocho píxeles y los cables, líneas: la maqueta
 * se leía literalmente como «unas líneas». Y aunque se leyera entera, un
 * diagrama de flujo le habla a quien ya sabe lo que es un diagrama de flujo.
 * El dueño de un negocio no busca un grafo: busca dejar de perder clientes.
 *
 * QUÉ SE MUESTRA AHORA
 * Un cliente con nombre y monto que avanza por tres etapas, y —esta es la
 * pieza que une las dos mitades del servicio— cada vez que avanza, sale un
 * mensaje solo. El CRM es la fila de etapas; la automatización es el mensaje
 * que nadie escribió. Las dos en la misma imagen, sin una palabra técnica.
 *
 * Se toca la etapa, no se arrastra la ficha. Arrastrar es más bonito y peor:
 * en un teléfono el mismo dedo que arrastraría la ficha es el que hace
 * scroll de la página, y pelear por ese gesto se paga en frustración. Tocar
 * la etapa a la que quieres llevarla dice lo mismo y no le quita el dedo a
 * nadie.
 */

const ETAPAS = ['Nuevo', 'Cotizado', 'Cerrado'];

/* El mensaje que sale al llegar a cada etapa. El de «Nuevo» es el que más
   convence, porque es el que todo el mundo reconoce: contestar rápido. */
const AVISOS = [
  'Hola, gracias por escribir. Te paso la cotización hoy mismo.',
  'Te dejo la cotización. Cualquier duda, aquí ando.',
  'Listo, quedamos. Te mando los datos para el anticipo.',
];

export function Seguimiento({ interactivo = false }) {
  const caja = useRef(null);
  const [etapa, setEtapa] = useState(0);
  const [paso, quieto] = useCicloVisible(ETAPAS.length, {
    ms: 2600,
    activo: !interactivo,
    ref: caja,
    /* Quieto se queda en «Cotizado»: es el paso intermedio, el único donde
       se ve a la vez de dónde viene la ficha y a dónde va. */
    pasoQuieto: 1,
  });

  const actual = interactivo ? etapa : paso;

  const mover = useCallback((i) => setEtapa(i), []);

  return (
    <div
      ref={caja}
      className={`demo mq mq--seguimiento ${interactivo ? 'is-vivo' : ''} ${
        quieto ? 'is-quieto' : ''
      }`}
      style={{ '--etapa': actual }}
    >
      <div className="mq__barra">
        <span className="mq__pastilla mq__pastilla--viva">Seguimiento</span>
        <b className="mq__marca">48 clientes</b>
      </div>

      {/* ---- Las tres etapas ---- */}
      <div className="seg__etapas" role={interactivo ? 'group' : undefined} aria-label={interactivo ? 'Mover el cliente de etapa' : undefined}>
        {ETAPAS.map((e, i) => {
          const clase = `seg__etapa ${i === actual ? 'is-aqui' : ''} ${i < actual ? 'is-hecha' : ''}`;
          return interactivo ? (
            <button key={e} type="button" className={clase} onClick={() => mover(i)} aria-pressed={i === actual}>
              {e}
            </button>
          ) : (
            <span key={e} className={clase}>
              {e}
            </span>
          );
        })}
      </div>

      {/* ---- La ficha del cliente, que se desliza a su etapa ---- */}
      <div className="seg__riel">
        <div className="seg__ficha">
          <span className="seg__quien">
            <i aria-hidden="true">PC</i>
            <span>
              <b>Pastelería Confetti</b>
              <em>Pedido para el viernes</em>
            </span>
          </span>
          <strong className="seg__monto">$8,400</strong>
        </div>
      </div>

      {/* ---- Lo que pasa solo ----
          El mensaje se vuelve a montar en cada etapa —de ahí la `key`— para
          que la animación de entrada se dispare otra vez. Sin eso el texto
          cambiaría en silencio y lo que se ve es un cartel, no un envío. */}
      <div className="seg__auto">
        <span className="seg__auto-cabeza">
          <i aria-hidden="true" />
          Automático
        </span>
        <p key={actual} className="seg__burbuja">
          {AVISOS[actual]}
        </p>
        <span className="seg__enviado">Enviado por WhatsApp · sin que nadie lo escribiera</span>
      </div>
    </div>
  );
}
