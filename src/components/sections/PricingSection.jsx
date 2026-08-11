import { ArrowUpRight, Check, Globe, MessageCircle, Store, Workflow, Wrench } from 'lucide-react';
import { SectionHeading } from '../primitives/SectionHeading';
import { Reveal, SpotlightCard, StarBorder } from '../reactbits';
import { PRICING } from '../../content';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';

/* El dibujito de cada paquete: un medallón con su icono, que respira. */
const TIER_ICONS = {
  sitio: Globe,
  operacion: Store,
  sistema: Workflow,
};

function Tier({ tier, index }) {
  const Icon = TIER_ICONS[tier.id] ?? Globe;
  const card = (
    <SpotlightCard
      className={`tier ${tier.featured ? 'tier--featured' : ''}`}
      accent={tier.accent}
      style={{ '--tier-accent': tier.accent }}
    >
      {tier.featured && <span className="tier__badge">MÁS PEDIDO</span>}

      <span className="tier__icono" aria-hidden="true">
        <Icon size={22} />
      </span>
      <h3 className="tier__name">{tier.name}</h3>
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

      {/* El cuarto paquete, a lo ancho: el que no viene en catálogo. */}
      <Reveal delay={0.1}>
        <SpotlightCard className="tier tier--custom" accent="#4f95ff">
          <span className="tier__icono" aria-hidden="true">
            <Wrench size={22} />
          </span>
          <div className="tier--custom__texto">
            <h3 className="tier__name">Personalizado</h3>
            <p className="tier__pitch">
              ¿Ninguno te queda? Cuéntame qué necesita tu negocio y armamos un paquete a tu medida,
              con las piezas exactas que te hagan falta.
            </p>
          </div>
          <a
            className="tier__cta tactile-button tactile-button--paper"
            href={whatsappUrl('pricing')}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsApp('pricing')}
          >
            <MessageCircle size={17} aria-hidden="true" />
            Cotizar a la medida
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </SpotlightCard>
      </Reveal>

      <Reveal className="pricing__terms" delay={0.1}>
        {PRICING.terms.map(([title, text]) => (
          <div key={title}>
            <strong>{title}</strong>
            <p>{text}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
