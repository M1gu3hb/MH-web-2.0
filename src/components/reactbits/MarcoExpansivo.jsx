/**
 * ============================================================
 * MARCO EXPANSIVO
 * ============================================================
 *
 * Inspirado en `ScrollExpand` de React Bits (reactbits.dev): un marco que
 * empieza contenido y crece hasta ocupar todo el ancho conforme atraviesa la
 * pantalla. Es el gesto de portafolio caro: la pieza no se presenta, entra.
 *
 * NO ES UNA COPIA. El componente de React Bits monta su propia pista de
 * scroll, fija la escena y calcula el avance a mano con un rAF. Esto está
 * escrito sobre `useScroll` de Motion, que ya está en el paquete, y no fija
 * nada ni toca la rueda: el marco se ensancha mientras pasas, y si bajas
 * rápido lo ves ancho y ya está. Nunca hay que esperar a que termine algo
 * para poder seguir leyendo.
 *
 * Lo que se anima es `transform: scaleX/scaleY` sobre el marco y la escala
 * inversa sobre el contenido, no el `width`. Animar `width` obligaría a
 * recalcular el reparto de la página en cada cuadro y, además, contaría
 * como desplazamiento de diseño.
 *
 * Con `prefers-reduced-motion` o en pantalla pequeña el marco se queda
 * directamente en su tamaño final. La pieza se ve entera desde el principio:
 * no se pierde nada de información, solo el gesto.
 */

import { useRef } from 'react';
import { motion as Motion, useScroll, useTransform } from 'motion/react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function MarcoExpansivo({ children, className = '', desde = 0.86, radioInicial = 26, radioFinal = 10 }) {
  const caja = useRef(null);
  const sinMovimiento = useReducedMotion();
  const grande = useMediaQuery('(min-width: 1000px)');
  const activo = grande && !sinMovimiento;

  const { scrollYProgress } = useScroll({
    target: caja,
    /* Del momento en que el borde superior entra por abajo hasta que el
       bloque está centrado. A partir de ahí ya está abierto del todo y
       seguir bajando no lo cambia. */
    offset: ['start end', 'center center'],
  });

  const escala = useTransform(scrollYProgress, [0, 1], [desde, 1]);
  const radio = useTransform(scrollYProgress, [0, 1], [radioInicial, radioFinal]);
  const opacidad = useTransform(scrollYProgress, [0, 0.35], [0.55, 1]);

  if (!activo) {
    return <div className={`marco-expansivo ${className}`}>{children}</div>;
  }

  return (
    <div ref={caja} className={`marco-expansivo ${className}`}>
      <Motion.div
        className="marco-expansivo__escena"
        style={{ scale: escala, borderRadius: radio, opacity: opacidad }}
      >
        {children}
      </Motion.div>
    </div>
  );
}
