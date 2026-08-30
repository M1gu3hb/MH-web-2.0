import { useCallback, useRef, useState } from 'react';

import { useCicloVisible } from '../../../hooks/useCicloVisible';

/**
 * ============================================================
 * SOFTWARE A MEDIDA — «tres herramientas que no encajan, o una que sí»
 * ============================================================
 *
 * POR QUÉ SE REHIZO
 * La anterior era un editor de código: un árbol de archivos y cinco líneas
 * de Python. Encogida quedaba un bloque de texto gris, y aun leída entera
 * contaba lo que menos importa. El código es CÓMO se hace el software; el
 * cliente no compra el cómo. Peor: enseñar código dice «esto es cosa de
 * programadores», que es justo lo contrario de lo que la página necesita.
 *
 * QUÉ SE MUESTRA AHORA
 * El antes y el después. A la izquierda, las tres herramientas con las que
 * hoy se sostiene el proceso —una hoja de cálculo, una libreta y un hilo de
 * WhatsApp—, torcidas y sin encajar entre ellas. A la derecha, una sola
 * aplicación con los campos exactos de ese proceso.
 *
 * Esa es la frase del servicio dicha en imagen: «cuando la herramienta que
 * necesitas no existe todavía». No hace falta saber programar para
 * entenderla; hace falta haber vivido el desorden de la izquierda.
 *
 * El botón dice «Unificar» y no «Ver demo» porque el verbo ES el servicio.
 */

const DESORDEN = [
  { id: 'hoja', etiqueta: 'Hoja de cálculo', nota: 'copia_final_v3' },
  { id: 'libreta', etiqueta: 'Libreta', nota: 'lo de ayer' },
  { id: 'chat', etiqueta: 'WhatsApp', nota: '3 grupos' },
];

const CAMPOS = [
  ['Cliente', 'Pastelería Confetti'],
  ['Proceso', 'Pedido especial'],
  ['Entrega', 'Viernes 18:00'],
];

export function Medida({ interactivo = false }) {
  const caja = useRef(null);
  const [unido, setUnido] = useState(false);
  /* Dos pasos, nada más: el desorden y la herramienta. Es una comparación,
     no una secuencia, y alargarla con pasos intermedios solo la diluye. */
  const [paso, quieto] = useCicloVisible(2, {
    ms: 2800,
    activo: !interactivo,
    ref: caja,
    /* Quieto se queda en la herramienta hecha: es el estado que vende. */
    pasoQuieto: 1,
  });

  const hecho = interactivo ? unido : paso === 1;

  const alternar = useCallback(() => setUnido((u) => !u), []);

  return (
    <div
      ref={caja}
      className={`demo mq mq--medida ${hecho ? 'is-hecho' : ''} ${
        interactivo ? 'is-vivo' : ''
      } ${quieto ? 'is-quieto' : ''}`}
    >
      <div className="mq__barra">
        <span className="mq__pastilla mq__pastilla--viva">{hecho ? 'Hecha a medida' : 'Hoy'}</span>
        <b className="mq__marca">Tu proceso</b>
      </div>

      <div className="medida__escena">
        {/* ---- El desorden ---- */}
        <div className="medida__desorden" aria-hidden={hecho ? 'true' : undefined}>
          {DESORDEN.map((d, i) => (
            <span key={d.id} className="medida__trasto" style={{ '--i': i }}>
              <b>{d.etiqueta}</b>
              <em>{d.nota}</em>
            </span>
          ))}
          <span className="medida__grieta" aria-hidden="true">
            no cuadra
          </span>
        </div>

        {/* ---- La herramienta ---- */}
        <div className="medida__app" aria-hidden={hecho ? undefined : 'true'}>
          <span className="medida__app-cabeza">
            <i aria-hidden="true" />
            Una sola pantalla
          </span>
          <dl className="medida__campos">
            {CAMPOS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <span className="medida__listo">Guardado · nadie copió nada dos veces</span>
        </div>
      </div>

      {interactivo ? (
        <button type="button" className="medida__accion" onClick={alternar}>
          {hecho ? 'Ver cómo está hoy' : 'Unificar en una herramienta'}
        </button>
      ) : (
        <span className="medida__accion">
          {hecho ? 'Una herramienta, hecha para eso' : 'Tres herramientas, ningún dueño'}
        </span>
      )}
    </div>
  );
}
