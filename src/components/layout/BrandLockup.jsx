/**
 * La marca, tal cual está dibujada.
 *
 * El wordmark no es una tipografía: es el arte del logo —el metal azul y
 * plata con sus biseles— y recrearlo con texto le quitaba toda la esencia.
 * Aquí se sirven los PNG oficiales del manual, recortados al arte y con
 * transparencia real; el texto queda solo para los lectores de pantalla.
 */
export function BrandWordmark({ className = '' }) {
  return (
    <span className={`marca marca--nombre ${className}`.trim()} translate="no">
      <img
        className="marca__lockup"
        src="/marca/nombre.webp"
        alt=""
        width="1100"
        height="272"
      />
      <span className="rb-visually-hidden">Morphiq</span>
    </span>
  );
}

export function BrandLockup({ layout = 'horizontal', className = '' }) {
  const stacked = layout === 'stacked';
  return (
    <span className={`marca marca--${layout} ${className}`.trim()} translate="no">
      <img
        className="marca__lockup"
        src={stacked ? '/marca/lockup-apilado.webp' : '/marca/lockup-horizontal.webp'}
        alt=""
        width={stacked ? 960 : 1100}
        height={stacked ? 1049 : 297}
      />
      <span className="rb-visually-hidden">Morphiq. Astral Morphiq Systems</span>
    </span>
  );
}
