import { Reveal, ScrambleText } from '../reactbits';
import { ABOUT, CONTACT } from '../../content';

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
            <img src="/mh-logo.png" alt="" width="320" height="286" />
            <span className="about__plate-scan" aria-hidden="true" />
          </div>
          <div className="about__stamp">
            <span>MH97</span>
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
