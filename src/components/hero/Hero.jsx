import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { motion as Motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Magnet, ScrambleText } from '../reactbits';
import Scanner from '../reactbits/Scanner';
import { Logo3D } from './Logo3D';
import { HERO } from '../../content';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';

export function Hero() {
  const reducedMotion = useReducedMotion();
  /* En teléfono el fondo no monta el shader. Es una tela a pantalla completa
     repintándose sin parar mientras entra la página, justo cuando el
     navegador está montando todo lo demás: es lo que hacía que el arranque se
     sintiera trabado. En su lugar va el mismo aliento de color, pintado una
     sola vez con degradados. */
  const conShader = useMediaQuery('(min-width: 641px)');
  const [claimA, claimVen, claimB, claimNec] = HERO.claim;

  return (
    <section className="hero" id="inicio">
      <div className={`hero__backdrop ${conShader ? '' : 'hero__backdrop--liso'}`} aria-hidden="true">
        {conShader ? (
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
        ) : null}
        <span className="hero__fade" />
      </div>

      <div className="hero__layout">
        <Motion.div
          className="hero__copy"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
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
          </div>

          <div className="hero__meta">
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
            <span className="firma3d hero__firma3d" translate="no" aria-label="MH97">MH97</span>
          </div>
        </Motion.div>

        {/* El símbolo preside el hero con profundidad por capas: inclina con
            el cursor y al clic responde con salto, destello, vuelta o la
            firma. La escena WebGL sigue apagada; este hueco sigue siendo
            suyo cuando vuelva. */}
        <Motion.div
          className="hero__viewport"
          id="hero-viewport"
          aria-hidden="true"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Logo3D />
        </Motion.div>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
