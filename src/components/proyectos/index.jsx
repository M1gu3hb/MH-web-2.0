/**
 * ============================================================
 * LA DEMOSTRACIÓN DE CADA PROYECTO
 * ============================================================
 *
 * Antes cada proyecto se enseñaba con una maqueta horneada: una imagen. Se
 * ve bien y no explica nada. Ahora encima de esa imagen se monta una escena
 * que enseña el proyecto usándose —alguien elige un paquete, registra un
 * pago, acomoda una mesa— con un rótulo que dice qué está pasando.
 *
 * LA IMAGEN SIGUE AHÍ, Y NO DE ADORNO
 * · Es lo primero que se pinta: la escena llega después, en su propio trozo.
 * · Es lo que ve quien pidió menos movimiento: la escena ni se descarga.
 * · Es la que lleva el texto alternativo. La escena va con `aria-hidden`.
 *
 * RENDIMIENTO
 * Diecinueve escenas en tres trozos —el recinto, los sitios, los productos—
 * que se piden cuando la primera tarjeta de cada grupo se acerca a la
 * pantalla. Una ficha de proyecto descarga solo el suyo. Y una escena fuera
 * de la vista no corre: el guion se detiene y vuelve a empezar al regresar.
 */

import { Suspense, lazy, useEffect, useRef, useState } from 'react';

import { useReducedMotion } from '../../hooks/useReducedMotion';

const GRUPOS = {
  jch: () => import('./jch'),
  web: () => import('./web'),
  producto: () => import('./producto'),
};

/* slug del proyecto → [grupo, componente] */
const DONDE = {
  glyphos: ['producto', 'Glyphos'],
  'pasteleria-confetti': ['producto', 'Confetti'],
  'jardines-club-hipico': ['jch', 'Hipico'],
  'jch-crm': ['jch', 'Crm'],
  'jch-portal-cliente': ['jch', 'Portal'],
  'jch-3d': ['jch', 'Estudio3d'],
  'jch-baile': ['jch', 'Baile'],
  'vero-seguros': ['web', 'Vero'],
  'the-best-moment': ['web', 'BestMoment'],
  'fiesta-total-dj': ['web', 'Fiesta'],
  'paginas-de-enlaces': ['web', 'Enlaces'],
  thexavimtz: ['web', 'Xavi'],
  'electrotecnica-berlin': ['producto', 'Berlin'],
  'portafolio-academico': ['web', 'Academico'],
  gestech: ['producto', 'Gestech'],
  'mh-photo-booth': ['producto', 'PhotoBooth'],
  'nfc-manager': ['producto', 'Nfc'],
  morphiqpos: ['producto', 'MorphiqPos'],
  'morphiq-ui': ['producto', 'MorphiqUi'],
};

const ESCENAS = Object.fromEntries(
  Object.entries(DONDE).map(([slug, [grupo, nombre]]) => [
    slug,
    lazy(() => GRUPOS[grupo]().then((m) => ({ default: m[nombre] }))),
  ])
);

/**
 * Va dentro del marco de la imagen del proyecto, que tiene que ser
 * `position: relative`. `pronto` monta la escena sin esperar a que se
 * acerque: es para la cabecera del caso, que ya está en pantalla.
 */
export function DemoProyecto({ slug, pronto = false }) {
  const sinMovimiento = useReducedMotion();
  const ancla = useRef(null);
  const [cerca, setCerca] = useState(pronto);
  const Escena = ESCENAS[slug];

  useEffect(() => {
    const nodo = ancla.current;
    if (!nodo || cerca || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setCerca(true);
          io.disconnect();
        }
      },
      { rootMargin: '50% 0px' }
    );
    io.observe(nodo);
    return () => io.disconnect();
  }, [cerca]);

  if (!Escena || sinMovimiento) return null;

  return (
    <span ref={ancla} className="demo-proyecto" aria-hidden="true">
      {cerca && (
        <Suspense fallback={null}>
          <Escena />
        </Suspense>
      )}
    </span>
  );
}
