/**
 * ============================================================
 * DESENFOQUE PROGRESIVO
 * ============================================================
 *
 * Versión compacta de `GradualBlur` de React Bits (reactbits.dev, MIT +
 * Commons Clause). La idea prestada: apilar varias franjas con
 * `backdrop-filter` de radio creciente y máscaras solapadas, de forma que el
 * desenfoque no tenga un borde visible sino una rampa.
 *
 * Para qué sirve aquí: para cerrar por abajo los bloques que se salen del
 * marco —el hero, el riel de proyectos—, de manera que el contenido no se
 * corte con una línea recta sino que se disuelva. Es lo que hace que un
 * bloque parezca una escena y no un recorte.
 *
 * QUÉ SE CAMBIÓ
 *
 * · El original trae control de scroll, presets con nombre, y respuesta a
 *   hover. Nada de eso se usa aquí, y cada opción es CSS que se descarga.
 *   Esta versión son cinco franjas y dos props.
 * · Se apaga entero si el navegador no soporta `backdrop-filter`: sin él,
 *   las franjas serían cinco rectángulos semitransparentes, que es peor que
 *   no poner nada.
 * · Es decorativo, así que va `aria-hidden` y no captura el puntero.
 */

const FRANJAS = 5;

export function DesenfoqueProgresivo({ lado = 'abajo', alto = '9rem', radio = 2, className = '' }) {
  const vertical = lado === 'abajo' || lado === 'arriba';

  const franjas = Array.from({ length: FRANJAS }, (_, i) => {
    const paso = 100 / FRANJAS;
    const desde = i * paso;
    const hasta = (i + 1) * paso;
    /* El radio crece con el cuadrado del índice: una rampa lineal se lee
       como cinco escalones, una cuadrática se lee como una rampa. */
    const desenfoque = ((i + 1) / FRANJAS) ** 2 * radio;
    const direccion = lado === 'arriba' || lado === 'izquierda' ? 'to top' : 'to bottom';
    const eje = vertical ? direccion : lado === 'izquierda' ? 'to left' : 'to right';
    /* Cada franja se enmascara con una rampa que solapa con la siguiente:
       ese solape es lo que borra los bordes entre capas. */
    const mascara = `linear-gradient(${eje}, transparent ${desde}%, #000 ${desde + paso * 0.6}%, #000 ${hasta}%, transparent ${Math.min(100, hasta + paso * 0.6)}%)`;

    return (
      <span
        key={i}
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: `blur(${desenfoque.toFixed(2)}px)`,
          WebkitBackdropFilter: `blur(${desenfoque.toFixed(2)}px)`,
          mask: mascara,
          WebkitMask: mascara,
        }}
      />
    );
  });

  return (
    <span
      aria-hidden="true"
      className={`desenfoque-progresivo desenfoque-progresivo--${lado} ${className}`}
      style={vertical ? { height: alto } : { width: alto }}
    >
      {franjas}
    </span>
  );
}
