import { Reveal, RippleDistortion, ScrambleText } from '../reactbits';
import { ABOUT, CONTACT } from '../../content';

/* La placa que distorsiona el agua: el mismo fondo y el mismo monograma que
   pintaba el recuadro, pero horneados en una imagen, porque el efecto deforma
   una textura y no un árbol de nodos. */
export const PLACA = '/placa-lockup.webp';

/**
 * Presentación. Es la sección donde el efecto de desfragmentación se dispara
 * por scroll: al llegar, todo el bloque está desordenado y se recompone.
 */
export function AboutSection() {
  return (
    <section className="about section-pad" id="sobre-mi">
      <div className="about__grid">
        <Reveal className="about__mark">
          <div className="about__plate">
            <RippleDistortion
              src={PLACA}
              brushSize={170}
              strength={0.16}
              swirl={1.2}
              rings={4}
              spread={5}
              fade={2.6}
              spacing={12}
              dispersion={0.3}
              glint={0.35}
              tint="#2a76d6"
              tintAmount={0.22}
              grayscale={false}
              trigger="both"
              clickStrength={2.4}
              quality="low"
            />
            <span className="about__plate-scan" aria-hidden="true" />
          </div>
          <div className="about__stamp">
            <span className="firma3d" translate="no">MH97</span>
            <small><ScrambleText text={ABOUT.signature} trigger="view" /></small>
          </div>
        </Reveal>

        <div className="about__copy">
          <Reveal as="p">
            <span className="section-index">
              <ScrambleText text={ABOUT.eyebrow} trigger="view" />
            </span>
          </Reveal>

          <h2 className="about__title">
            {ABOUT.title.map((line, index) => (
              <span key={line} className="about__title-line">
                <ScrambleText
                  text={line}
                  trigger="view"
                  className={index ? 'section-heading__soft' : ''}
                  speed={30}
                  duration={2200}
                />
              </span>
            ))}
          </h2>

          <p className="about__statement">
            Diseño la <em>cara visible</em> y construyo la <strong>máquina detrás.</strong>
          </p>

          {ABOUT.paragraphs.map((paragraph, index) => (
            <p className="about__paragraph" key={paragraph}>
              <ScrambleText
                text={paragraph}
                trigger="view"
                speed={16}
                duration={1500 + index * 120}
              />
            </p>
          ))}

          <Reveal className="about__signature" delay={0.14}>
            <strong>{CONTACT.owner}</strong>
            <span>{CONTACT.role}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
