import { BrandLockup } from './BrandLockup';

/**
 * La marca de la esquina: el lockup completo del manual, con el simbolo,
 * Morphiq y Astral Morphiq Systems compuestos en vivo. `inverted` sobra ya:
 * el wordmark lleva sus propios degradados y el tema es uno solo.
 */
export function Brand() {
  return (
    <a
      className="brand"
      href="#inicio"
      aria-label="Morphiq, Astral Morphiq Systems. Volver al inicio"
    >
      <BrandLockup layout="horizontal" />
    </a>
  );
}
