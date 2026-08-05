import { lazy, Suspense, useEffect, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useLaptopChoreography } from './useLaptopChoreography';

const LaptopScene = lazy(() => import('./LaptopScene').then((m) => ({ default: m.LaptopScene })));

/**
 * Capa fija donde vive la laptop durante todo el recorrido.
 *
 * Está por encima del contenido pero sin capturar el puntero: la coreografía
 * decide cuándo se ve. Cuando queda oculta, el canvas se desmonta para no
 * gastar GPU en el resto de la página.
 */
export function LaptopStage({ enabled = true }) {
  const reducedMotion = useReducedMotion();
  const isPhone = useMediaQuery('(max-width: 640px)');
  const coarse = useMediaQuery('(pointer: coarse)');
  const choreography = useLaptopChoreography();

  const [capable, setCapable] = useState(false);
  const [awake, setAwake] = useState(true);

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

  /* Se apaga cuando la coreografía la deja invisible durante un momento. */
  useEffect(() => {
    if (!capable) return undefined;
    let quiet = 0;
    const id = window.setInterval(() => {
      const visible = choreography.current.visible;
      if (visible) {
        quiet = 0;
        setAwake(true);
      } else {
        quiet += 1;
        if (quiet > 3) setAwake(false);
      }
    }, 260);
    return () => window.clearInterval(id);
  }, [capable, choreography]);

  if (!enabled || !capable) return null;

  return (
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
  );
}
