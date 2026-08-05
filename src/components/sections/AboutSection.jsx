import { Reveal, ScrollReveal, SplitText } from '../reactbits';
import { ABOUT, CONTACT } from '../../content';

export function AboutSection() {
  return (
    <section className="about section-pad" id="sobre-mi">
      <div className="about__grid">
        <Reveal className="about__mark">
          <div className="about__plate">
            <img src="/mh-logo-v2-720.png" alt="" width="320" height="286" />
          </div>
          <div className="about__stamp">
            <span>MH97</span>
            <small>{ABOUT.signature}</small>
          </div>
        </Reveal>

        <div className="about__copy">
          <Reveal as="p">
            <span className="section-index">{ABOUT.eyebrow}</span>
          </Reveal>

          <h2 className="about__title">
            {ABOUT.title.map((line, index) => (
              <span key={line} className="about__title-line">
                <SplitText text={line} as="span" delay={index * 0.08} className={index ? 'section-heading__soft' : ''} />
              </span>
            ))}
          </h2>

          <p className="about__statement">
            Diseño la <em>cara visible</em> y construyo la <strong>máquina detrás.</strong>
          </p>

          {ABOUT.paragraphs.map((paragraph, index) =>
            index === 1 ? (
              <ScrollReveal key={paragraph} className="about__paragraph about__paragraph--reveal">
                {paragraph}
              </ScrollReveal>
            ) : (
              <Reveal as="p" key={paragraph} className="about__paragraph" delay={0.06 * index}>
                {paragraph}
              </Reveal>
            ),
          )}

          <Reveal className="about__signature" delay={0.14}>
            <strong>{CONTACT.owner}</strong>
            <span>{CONTACT.role}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
