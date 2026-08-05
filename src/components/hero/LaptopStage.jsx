import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useLaptopChoreography } from './useLaptopChoreography';

const LaptopScene = lazy(() => import('./LaptopScene').then((m) => ({ default: m.LaptopScene })));

/**
 * Capa fija donde vive la laptop, más el velo negro y el destello de
 * encendido que hacen la transición «entramos a la pantalla».
 *
 * Dos cosas que importan:
 *
 * 1. La escena se monta una vez y no se desmonta nunca. Desmontarla ahorraba
 *    memoria pero rehacía el contexto WebGL y el entorno cada vez que la
 *    laptop volvía a hacer falta: al subir de nuevo al hero o al llegar al
 *    tramo final, la laptop tardaba tanto en aparecer que no se veía. En vez
 *    de eso el bucle de dibujo se apaga cuando no se ve, que sale gratis.
 *
 * 2. El velo y el destello se actualizan por rAF escribiendo el estilo a
 *    mano: pasarlos por el estado de React provocaría un render por
 *    fotograma.
 */
export function LaptopStage({ enabled = true }) {
  const reducedMotion = useReducedMotion();
  const isPhone = useMediaQuery('(max-width: 640px)');
  const coarse = useMediaQuery('(pointer: coarse)');
  const choreography = useLaptopChoreography();

  const [capable, setCapable] = useState(false);
  const [running, setRunning] = useState(true);

  const veil = useRef(null);
  const power = useRef(null);
  const inside = useRef(null);
  const stage = useRef(null);

  /* ¿Tiene sentido montar la escena en este dispositivo? */
  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;

    const probe = () => {
      if (cancelled) return;
      const canvas = document.createElement('canvas');
      let ctx = null;
      try {
        ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
      } catch {
        ctx = null;
      }
      const memory = navigator.deviceMemory ?? 8;
      const cores = navigator.hardwareConcurrency ?? 8;
      ctx?.getExtension('WEBGL_lose_context')?.loseContext();
      setCapable(Boolean(ctx) && memory >= 4 && cores >= 4);
    };

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(probe, { timeout: 1500 })
      : window.setTimeout(probe, 500);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback && window.requestIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [enabled]);

  /* Sin escena no hay transición: los tramos negros se colapsan. */
  useEffect(() => {
    const off = !enabled || !capable;
    document.body.classList.toggle('no-stage', off);
    return () => document.body.classList.remove('no-stage');
  }, [capable, enabled]);

  /* Velo, destello, viñeta interior y encendido del bucle de dibujo. */
  useEffect(() => {
    if (!enabled || !capable) return undefined;
    let frame;
    let transit = false;
    let awake = true;

    const tick = () => {
      const s = choreography.current;
      if (veil.current) veil.current.style.opacity = String(s.veil);
      if (power.current) power.current.style.opacity = String(s.power);
      if (inside.current) inside.current.style.opacity = String(s.inside * 0.9);
      if (stage.current) stage.current.style.visibility = s.visible ? 'visible' : 'hidden';

      /* Mientras dura el viaje, la navegación y el botón flotante estorban:
         flotarían sobre la laptop y romperían la ilusión de entrar en ella. */
      const travelling = s.veil > 0.02;
      if (travelling !== transit) {
        transit = travelling;
        document.body.classList.toggle('in-transit', travelling);
      }

      /* El bucle de la escena solo corre cuando la laptop se ve. */
      if (s.visible !== awake) {
        awake = s.visible;
        setRunning(awake);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.body.classList.remove('in-transit');
    };
  }, [capable, choreography, enabled]);

  if (!enabled || !capable) return null;

  return (
    <>
      <div className="stage-veil" ref={veil} aria-hidden="true" />
      <div className="stage-inside" ref={inside} aria-hidden="true" />

      <div className="laptop-stage" ref={stage} aria-hidden="true">
        <Suspense fallback={null}>
          <LaptopScene
            choreography={choreography}
            reducedMotion={reducedMotion}
            quality={isPhone || coarse ? 'low' : 'high'}
            running={running}
          />
        </Suspense>
      </div>

      <div className="stage-power" ref={power} aria-hidden="true">
        <span />
      </div>
    </>
  );
}
