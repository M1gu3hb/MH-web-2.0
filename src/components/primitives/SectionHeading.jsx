import { Reveal, SplitText } from '../reactbits';

/**
 * Encabezado de sección. Reemplaza los tres bloques casi idénticos que había
 * repartidos por el CSS anterior.
 */
export function SectionHeading({ eyebrow, title, lead, tone = 'paper' }) {
  return (
    <div className={`section-heading section-heading--${tone}`}>
      <Reveal className="section-heading__index" as="p">
        <span className="section-index">{eyebrow}</span>
      </Reveal>

      <h2 className="section-heading__title">
        {title.map((line, index) => (
          <span className="section-heading__line" key={line}>
            <SplitText text={line} as="span" delay={index * 0.08} className={index ? 'section-heading__soft' : ''} />
          </span>
        ))}
      </h2>

      {lead && (
        <Reveal className="section-heading__lead" as="p" delay={0.12}>
          {lead}
        </Reveal>
      )}
    </div>
  );
}
