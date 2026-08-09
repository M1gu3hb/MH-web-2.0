/**
 * La marca, compuesta en vivo.
 *
 * El wordmark no es una imagen: es texto en Exo 2 —la tipografía del manual—
 * con los degradados de la marca recortados a las letras. Así se mantiene
 * nítido a cualquier densidad de píxeles, se puede componer a cualquier
 * tamaño con `font-size`, y el subtítulo siempre queda alineado óptico con
 * el nombre, cosa que con un PNG habría que rehacer por tamaño.
 *
 * La lectura es «Morphiq»: la i vive dentro de la H —el punto que lleva
 * encima del asta derecha— tal como está dibujada en el logotipo.
 */
export function BrandWordmark({ className = '' }) {
  return (
    <span className={`marca-nombre ${className}`.trim()} translate="no">
      <b className="marca-nombre--azul">M</b>
      <span className="marca-nombre--plata">orp</span>
      <b className="marca-nombre--azul marca-nombre__h">H<i aria-hidden="true" /></b>
      <span className="marca-nombre--plata">q</span>
      <span className="rb-visually-hidden">Morphiq</span>
    </span>
  );
}

export function BrandLockup({ layout = 'horizontal', symbol = true, className = '' }) {
  return (
    <span className={`marca marca--${layout} ${className}`.trim()}>
      {symbol ? <img className="marca__simbolo" src="/marca/simbolo-sm.webp" alt="" width="152" height="160" /> : null}
      <span className="marca__texto">
        <BrandWordmark />
        <small className="marca__firma" translate="no">Astral Morphiq Systems</small>
      </span>
    </span>
  );
}
