import { Reveal, ScrambleText } from '../reactbits';

/**
 * Encabezado de sección. El titular se desfragmenta al pasar el cursor.
 */
export function SectionHeading({ eyebrow, title, lead, tone = 'paper' }) {
  return (
    <div className={`section-heading section-heading--${tone}`}>
      <Reveal className="section-heading__index" as="p">
        <span className="section-index">
          <ScrambleText text={eyebrow} />
        </span>
      </Reveal>

      <h2 className="section-heading__title">
        {title.map((line, index) => (
          <span className="section-heading__line" key={line}>
            <ScrambleText
              text={line}
              className={index ? 'section-heading__soft' : ''}
              speed={26 + index * 5}
            />
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
