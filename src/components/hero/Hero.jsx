import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, MessageCircle, Move3D } from 'lucide-react';
import { motion as Motion, useScroll, useTransform } from 'motion/react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { CountUp, DecryptedText, DotGrid, Magnet, ShinyText, SplitText } from '../reactbits';
import { HERO } from '../../content';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';
import { StaticHeroMark } from './StaticHeroMark';
import { WebGLBoundary } from './WebGLBoundary';

const HeroScene = lazy(() => import('./HeroScene').then((module) => ({ default: module.HeroScene })));

/**
 * Decide si vale la pena montar la escena 3D y con qué nivel de calidad.
 * La escena se difiere hasta después del primer pintado para que el titular
 * sea siempre el LCP.
 */
function useSceneTier() {
  const reducedMotion = useReducedMotion();
  const isPhone = useMediaQuery('(max-width: 540px)');
  const coarse = useMediaQuery('(pointer: coarse)');
  const [state, setState] = useState({ ready: false, webgl: false });

  useEffect(() => {
    if (reducedMotion) {
      setState({ ready: true, webgl: false });
      return undefined;
    }

    let cancelled = false;
    const probe = () => {
      if (cancelled) return;
      const canvas = document.createElement('canvas');
      let context = null;
      try {
        context = canvas.getContext('webgl2') || canvas.getContext('webgl');
      } catch {
        context = null;
      }
      const memory = navigator.deviceMemory ?? 8;
      const cores = navigator.hardwareConcurrency ?? 8;
      const capable = Boolean(context) && memory >= 4 && cores >= 4;
      context?.getExtension('WEBGL_lose_context')?.loseContext();
      setState({ ready: true, webgl: capable });
    };

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(probe, { timeout: 1200 })
      : window.setTimeout(probe, 420);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback && window.requestIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [reducedMotion]);

  return {
    reducedMotion,
    showScene: state.ready && state.webgl,
    quality: isPhone || coarse ? 'low' : 'high',
  };
}

export function Hero() {
  const { reducedMotion, showScene, quality } = useSceneTier();
  const { scrollYProgress } = useScroll();
  const stageY = useTransform(scrollYProgress, [0, 0.2], [0, reducedMotion ? 0 : -46]);
  const [eyebrow, headlineA, headlineB, headlineC] = [HERO.eyebrow, ...HERO.title];

  return (
    <section className="hero" id="inicio">
      <DotGrid gap={34} proximity={150} />
      <div className="hero__wash" aria-hidden="true" />

      <div className="hero__layout">
        <Motion.div
          className="hero__copy"
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="signal-label">
            <span className="signal-label__pulse" aria-hidden="true" />
            <ShinyText>{eyebrow}</ShinyText>
          </p>

          <h1 className="hero__title">
            <SplitText text={headlineA} as="span" className="hero__title-line" stagger={0.02} />
            <span className="hero__title-line">
              <SplitText text={headlineB} as="span" className="hero__accent hero__accent--coral" delay={0.18} />
              <span className="hero__title-dot" aria-hidden="true">.</span>
            </span>
            <SplitText text={headlineC} as="span" className="hero__title-line" delay={0.28} stagger={0.018} />
            <span className="hero__title-line">
              <SplitText text={HERO.title[3]} as="span" className="hero__accent hero__accent--blue" delay={0.46} />
              <span className="hero__title-dot" aria-hidden="true">.</span>
            </span>
          </h1>

          <p className="hero__lead">{HERO.lead}</p>

          <div className="hero__actions">
            <Magnet>
              <a
                className="tactile-button tactile-button--ink tactile-button--large"
                href={whatsappUrl('hero')}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackWhatsApp('hero')}
              >
                <MessageCircle size={19} aria-hidden="true" />
                {HERO.primaryCta}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </Magnet>
            <a className="tactile-button tactile-button--paper tactile-button--large" href="#trabajo">
              {HERO.secondaryCta}
              <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>

          <dl className="hero__stats">
            {HERO.stats.map((stat) => (
              <div key={stat.label}>
                <dt>
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Motion.div>

        <Motion.div
          className="hero__stage"
          style={{ y: stageY }}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero__stage-top">
            <DecryptedText text={HERO.chrome.id} />
            <span className="live-signal">
              <i aria-hidden="true" /> {HERO.chrome.status}
            </span>
          </div>

          <div className="hero__canvas">
            {showScene ? (
              <WebGLBoundary fallback={<StaticHeroMark />}>
                <Suspense fallback={<StaticHeroMark />}>
                  <HeroScene reducedMotion={reducedMotion} quality={quality} />
                </Suspense>
              </WebGLBoundary>
            ) : (
              <StaticHeroMark />
            )}
          </div>

          <div className="hero__stage-bottom">
            <span>
              <Move3D size={15} aria-hidden="true" /> {HERO.chrome.hint}
            </span>
            <span>{HERO.chrome.tech}</span>
          </div>
          <span className="hero__stage-shadow" aria-hidden="true" />
        </Motion.div>
      </div>
    </section>
  );
}
