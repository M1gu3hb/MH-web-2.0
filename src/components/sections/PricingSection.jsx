import { ArrowUpRight, Check, MessageCircle } from 'lucide-react';
import { SectionHeading } from '../primitives/SectionHeading';
import { Magnet, Reveal, SpotlightCard, StarBorder } from '../reactbits';
import { PRICING } from '../../content';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';

function Tier({ tier, index }) {
  const card = (
    <SpotlightCard
      className={`tier ${tier.featured ? 'tier--featured' : ''}`}
      accent={tier.accent}
      style={{ '--tier-accent': tier.accent }}
    >
      {tier.featured && <span className="tier__badge">MÁS PEDIDO</span>}

      <p className="tier__name">{tier.name}</p>
      <p className="tier__price">{tier.price}</p>
      <p className="tier__time">{tier.time}</p>
      <p className="tier__pitch">{tier.pitch}</p>

      <ul className="tier__features">
        {tier.features.map((feature) => (
          <li key={feature}>
            <Check size={14} aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <a
        className={`tier__cta tactile-button ${tier.featured ? 'tactile-button--ink' : 'tactile-button--paper'}`}
        href={whatsappUrl('pricing')}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackWhatsApp('pricing')}
      >
        <MessageCircle size={17} aria-hidden="true" />
        Cotizar {tier.name.toLowerCase()}
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </SpotlightCard>
  );

  return (
    <Reveal delay={index * 0.08} amount={0.15}>
      {tier.featured ? (
        <StarBorder color={tier.accent} speed={6} className="tier__frame">
          {card}
        </StarBorder>
      ) : (
        card
      )}
    </Reveal>
  );
}

export function PricingSection() {
  return (
    <section className="pricing section-pad" id="inversion">
      <SectionHeading eyebrow={PRICING.eyebrow} title={PRICING.title} lead={PRICING.lead} />

      <div className="pricing__grid">
        {PRICING.tiers.map((tier, index) => (
          <Tier key={tier.id} tier={tier} index={index} />
        ))}
      </div>

      <Reveal className="pricing__terms" delay={0.1}>
        {PRICING.terms.map(([title, text]) => (
          <div key={title}>
            <strong>{title}</strong>
            <p>{text}</p>
          </div>
        ))}
      </Reveal>

      <Reveal as="p" className="pricing__note" delay={0.16}>
        <Magnet strength={0.18}>
          <span>
            ¿Tu proyecto no cabe en ninguno? Escríbeme y lo armamos a la medida.
          </span>
        </Magnet>
      </Reveal>
    </section>
  );
}
