import { ArrowDown, ArrowUpRight, MessageCircle } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Magnet, ScrambleText } from '../reactbits';
import Scanner from '../reactbits/Scanner';
import { HERO } from '../../content';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';

export function Hero() {
  const reducedMotion = useReducedMotion();
  const [claimA, claimVen, claimB, claimNec] = HERO.claim;

  return (
    <section className="hero" id="inicio">
      <div className="hero__backdrop" aria-hidden="true">
        <Scanner
          color1="#0a66ff"
          color2="#0846c8"
          color3="#FFFFFF"
          speed={0.5}
          sweepSpeed={0.25}
          sweepWidth={1.6}
          sweepFalloff={6}
          scale={1.5}
          frequency={2}
          ripple={0.22}
          bandDensity={11}
          lineSharpness={5.5}
          glow={0.22}
          scanDirection="vertical"
          colorSpread={0.7}
          brightness={1.0}
          contrast={1.15}
          softness={1.4}
          vignette={0.45}
          scanline
          grain
          grainIntensity={0.05}
          opacity={1.0}
          mouseInteraction
          mouseRadius={0.5}
          mouseStrength={0.5}
          maxDpr={1.25}
        />
        <span className="hero__fade" />
      </div>

      <div className="hero__layout">
        <Motion.div
          className="hero__copy"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="signal-label">
            <span className="signal-label__pulse" />
            <ScrambleText text={HERO.eyebrow} />
          </p>

          <h1 className="hero__title">
            {HERO.title.map((line, i) => (
              <span key={line.text} className={`hero__title-line hero__title-line--${line.voice}`}>
                <ScrambleText text={line.text} />
                {/* El punto cierra la frase entera, no cada renglón. */}
                {i === HERO.title.length - 1 ? <i className="hero__title-dot" aria-hidden="true" /> : null}
              </span>
            ))}
          </h1>

          {/* Lo que antes era el titular: ahora abre el texto de apoyo. */}
          <p className="hero__claim">
            <ScrambleText text={claimA} />
            <ScrambleText text={claimVen} className="hero__accent hero__accent--azul" />
            <ScrambleText text={claimB} />
            <ScrambleText text={claimNec} className="hero__accent hero__accent--plata" />
          </p>

          <p className="hero__lead">
            <ScrambleText text={HERO.lead} speed={22} />
          </p>

          <div className="hero__actions">
            <Magnet>
              <a
                className="tactile-button tactile-button--glow tactile-button--large"
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
            <a className="tactile-button tactile-button--ghost tactile-button--large" href="#servicios">
              {HERO.secondaryCta}
              <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>

          <dl className="hero__credentials">
            {HERO.credentials.map((item, index) => (
              <div key={item.label}>
                <dt>
                  <i aria-hidden="true">{String(index + 1).padStart(2, '0')}</i>
                  <ScrambleText text={item.label} />
                </dt>
                <dd>{item.note}</dd>
              </div>
            ))}
          </dl>
        </Motion.div>

        {/* El símbolo de la marca preside el hero. La escena 3D está apagada
            por ahora; cuando vuelva, este mismo hueco es el suyo. */}
        <Motion.div
          className="hero__viewport"
          id="hero-viewport"
          aria-hidden="true"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            className="hero__simbolo"
            src="/marca/simbolo-lg.webp"
            alt=""
            width="1137"
            height="1200"
            fetchPriority="high"
          />
        </Motion.div>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
