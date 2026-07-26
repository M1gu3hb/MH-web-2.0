import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, MessageCircle, Move3D } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { WebGLBoundary } from './WebGLBoundary';

const HeroScene = lazy(() => import('./HeroScene').then((module) => ({ default: module.HeroScene })));

function StaticHeroMark() {
  return (
    <div className="hero-mark-static">
      <span className="hero-mark-static__orbit" />
      <img src="/mh-logo-v2-1080.png" alt="Monograma de MH Astral Systems" width="700" height="625" />
    </div>
  );
}

export function Hero({ whatsappUrl }) {
  const reducedMotion = useReducedMotion();
  const compactDevice = useMediaQuery('(max-width: 640px)');
  const [webglAvailable, setWebglAvailable] = useState(false);

  useEffect(() => {
    if (reducedMotion || compactDevice) {
      setWebglAvailable(false);
      return;
    }

    const canvas = document.createElement('canvas');
    let context;
    try {
      context = canvas.getContext('webgl2', { powerPreference: 'high-performance' }) || canvas.getContext('webgl');
      setWebglAvailable(Boolean(context));
    } catch {
      setWebglAvailable(false);
    } finally {
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    }
  }, [compactDevice, reducedMotion]);

  const showStatic = reducedMotion || compactDevice || !webglAvailable;

  return (
    <section className="hero" id="inicio">
      <div className="hero__noise" aria-hidden="true" />
      <div className="hero__layout">
        <Motion.div
          className="hero__copy"
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="signal-label">
            <span>●</span>
            Estudio digital independiente
          </p>
          <h1>
            Diseño lo que tus clientes <em>ven.</em>
            <br />
            Construyo lo que tu negocio <strong>necesita.</strong>
          </h1>
          <p className="hero__lead">
            Páginas que convencen. Sistemas que ordenan. Una sola visión para convertir la operación de tu negocio en una ventaja.
          </p>
          <div className="hero__actions">
            <a className="tactile-button tactile-button--ink tactile-button--large" href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={19} />
              Cuéntame tu proyecto
              <ArrowUpRight size={17} />
            </a>
            <a className="tactile-button tactile-button--paper tactile-button--large" href="#trabajo">
              Ver trabajo real
              <ArrowDown size={17} />
            </a>
          </div>
          <div className="hero__credentials" aria-label="Información de confianza">
            <span>
              <i>01</i>
              Atención directa
            </span>
            <span>
              <i>02</i>
              Diseño + desarrollo
            </span>
            <span>
              <i>03</i>
              CDMX
            </span>
          </div>
        </Motion.div>

        <Motion.div
          className="hero__stage"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.93, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.05, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero__stage-top">
            <span>MH / SYSTEM CORE</span>
            <span className="live-signal"><i /> EN LÍNEA</span>
          </div>
          <div className="hero__canvas" aria-label="Sistema 3D interactivo de MH Astral Systems">
            {showStatic ? (
              <StaticHeroMark />
            ) : (
              <WebGLBoundary fallback={<StaticHeroMark />}>
                <Suspense fallback={<StaticHeroMark />}>
                  <HeroScene reducedMotion={reducedMotion} />
                </Suspense>
              </WebGLBoundary>
            )}
          </div>
          <div className="hero__stage-bottom">
            <span><Move3D size={15} /> Mueve el cursor</span>
            <span>WEBGL / REALTIME</span>
          </div>
          <span className="hero__stage-shadow" aria-hidden="true" />
        </Motion.div>
      </div>
      <div className="hero__ticker" aria-hidden="true">
        <div>
          <span>WEB EXPERIENCE</span><i />
          <span>POINT OF SALE</span><i />
          <span>CRM & DATA</span><i />
          <span>AUTOMATION</span><i />
          <span>WEB EXPERIENCE</span><i />
          <span>POINT OF SALE</span><i />
          <span>CRM & DATA</span><i />
          <span>AUTOMATION</span><i />
        </div>
      </div>
    </section>
  );
}
