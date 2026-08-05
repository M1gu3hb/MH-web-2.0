import { ArrowDown, ArrowUpRight, MessageCircle, MousePointer2 } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Magnet, ScrambleText } from '../reactbits';
import Scanner from '../reactbits/Scanner';
import { pokeLaptop } from './laptopBus';
import { HERO } from '../../content';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';

export function Hero() {
  const reducedMotion = useReducedMotion();
  const [lineA, accentA, lineB, accentB] = HERO.title;

  return (
    <section className="hero" id="inicio">
      <div className="hero__backdrop" aria-hidden="true">
        <Scanner
          color1="#5227FF"
          color2="#1a14d3"
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
            <span className="hero__title-line">
              <ScrambleText text={lineA} />
            </span>
            <span className="hero__title-line">
              <ScrambleText text={accentA} className="hero__accent hero__accent--coral" />
              <span className="hero__title-dot">.</span>
            </span>
            <span className="hero__title-line">
              <ScrambleText text={lineB} />
            </span>
            <span className="hero__title-line">
              <ScrambleText text={accentB} className="hero__accent hero__accent--lime" />
              <span className="hero__title-dot">.</span>
            </span>
          </h1>

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

        {/* La laptop 3D vive en una capa fija (LaptopStage), que es inerte a
            los clics para no tapar la página entera. Este hueco le reserva el
            sitio en el layout y recoge el clic por ella. */}
        <div className="hero__viewport" id="hero-viewport">
          <button type="button" className="hero__viewport-hit" onClick={pokeLaptop}>
            <span className="rb-visually-hidden">Encender el modo desarrollador de la laptop</span>
          </button>
          <p className="hero__viewport-hint" aria-hidden="true">
            <MousePointer2 size={14} /> Haz clic en la laptop
          </p>
        </div>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
