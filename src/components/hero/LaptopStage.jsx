import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { LaptopScreenUI } from './LaptopScreenUI';
import { setLaptopRect, skipLaptopReady } from './laptopBus';
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
  /* Nodo DOM que la escena coloca dentro de la pantalla del modelo. Ahí se
     monta la web de verdad, no una copia. */
  const [screen, setScreen] = useState(null);

  /* En una referencia además del estado: el bucle por rAF no se rehace cuando
     llega la pantalla, y necesita leerla sin volver a montarse. */
  const screenRoot = useRef(null);
  const handleScreen = useCallback((next) => {
    screenRoot.current = next?.root ?? null;
    setScreen(next);
  }, []);

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
      const ok = Boolean(ctx) && memory >= 4 && cores >= 4;
      /* Si no va a haber escena, el arranque no debe quedarse esperándola. */
      if (!ok) skipLaptopReady();
      setCapable(ok);
    };

    /* Sin esperar a un hueco ocioso: la escena tiene que estar montada
       mientras se ve la pantalla de carga, no varios segundos después. */
    probe();

    return () => {
      cancelled = true;
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

      /* Dónde está la pantalla ahora mismo, para que el clic del hero caiga
         encima de la laptop y no sobre el hueco del layout. Solo en reposo:
         durante el viaje la laptop tapa toda la página y no hay nada que
         pulsar. */
      setLaptopRect(
        s.phase === 'hero' && s.visible && screenRoot.current
          ? screenRoot.current.getBoundingClientRect()
          : null,
      );

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
            onScreenReady={handleScreen}
          />
        </Suspense>
      </div>

      {screen?.root
        ? createPortal(<LaptopScreenUI screen={screen} choreography={choreography} />, screen.root)
        : null}

      <div className="stage-power" ref={power} aria-hidden="true">
        <span />
      </div>
    </>
  );
}
