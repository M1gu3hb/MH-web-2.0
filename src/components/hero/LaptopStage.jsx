import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useLaptopChoreography } from './useLaptopChoreography';

const LaptopScene = lazy(() => import('./LaptopScene').then((m) => ({ default: m.LaptopScene })));

/**
 * Capa fija donde vive la laptop, más el velo negro y el destello de
 * encendido que hacen la transición «entramos a la pantalla».
 *
 * El velo y el destello se actualizan por rAF escribiendo el estilo a mano:
 * pasarlos por el estado de React provocaría un render por fotograma.
 */
export function LaptopStage({ enabled = true }) {
  const reducedMotion = useReducedMotion();
  const isPhone = useMediaQuery('(max-width: 640px)');
  const coarse = useMediaQuery('(pointer: coarse)');
  const choreography = useLaptopChoreography();

  const [capable, setCapable] = useState(false);
  const [awake, setAwake] = useState(true);

  const veil = useRef(null);
  const power = useRef(null);
  const inside = useRef(null);

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

  /* Velo, destello y viñeta interior. */
  useEffect(() => {
    if (!enabled || !capable) return undefined;
    let frame;
    let quiet = 0;
    let transit = false;

    const tick = () => {
      const s = choreography.current;
      if (veil.current) veil.current.style.opacity = String(s.veil);
      if (power.current) power.current.style.opacity = String(s.power);
      if (inside.current) inside.current.style.opacity = String(s.inside * 0.9);

      /* Mientras dura el viaje, la navegación y el botón flotante estorban:
         flotarían sobre la laptop y romperían la ilusión de entrar en ella. */
      const travelling = s.veil > 0.02;
      if (travelling !== transit) {
        transit = travelling;
        document.body.classList.toggle('in-transit', travelling);
      }

      /* Se apaga el canvas cuando lleva un rato invisible. */
      if (s.visible) {
        quiet = 0;
        setAwake((a) => (a ? a : true));
      } else {
        quiet += 1;
        if (quiet === 40) setAwake(false);
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

      <div className="laptop-stage" aria-hidden="true">
        {awake && (
          <Suspense fallback={null}>
            <LaptopScene
              choreography={choreography}
              reducedMotion={reducedMotion}
              quality={isPhone || coarse ? 'low' : 'high'}
            />
          </Suspense>
        )}
      </div>

      <div className="stage-power" ref={power} aria-hidden="true">
        <span />
      </div>
    </>
  );
}
