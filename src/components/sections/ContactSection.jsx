import { useState } from 'react';
import { ArrowUpRight, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { track } from '@vercel/analytics';
import { Reveal, SplitText, StarBorder } from '../reactbits';
import { CONTACT, CONTACT_SECTION } from '../../content';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';

const EMPTY = { nombre: '', negocio: '', necesidad: '' };

/**
 * El formulario no necesita backend: compone el mensaje y deja que la persona
 * elija canal. Así hay una alternativa real a WhatsApp sin infraestructura.
 */
function composeMessage({ nombre, negocio, necesidad }) {
  return [
    `Hola Miguel 👋 Soy ${nombre || '—'}.`,
    negocio ? `Mi negocio: ${negocio}.` : '',
    necesidad ? `Lo que necesito: ${necesidad}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const message = composeMessage(form);
  const ready = form.nombre.trim().length > 1 && form.necesidad.trim().length > 4;

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const sendWhatsApp = () => {
    trackWhatsApp('form');
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  };

  const sendEmail = () => {
    try {
      track('email_click', { source: 'form' });
    } catch {
      /* la analítica nunca bloquea el envío */
    }
    const subject = encodeURIComponent(`Proyecto nuevo — ${form.negocio || form.nombre}`);
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${encodeURIComponent(message)}`;
  };

  return (
    <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
      <p className="contact-form__note">{CONTACT_SECTION.formNote}</p>

      <div className="contact-form__row">
        <label htmlFor="cf-nombre">
          <span>Tu nombre</span>
          <input id="cf-nombre" type="text" autoComplete="name" value={form.nombre} onChange={update('nombre')} required />
        </label>
        <label htmlFor="cf-negocio">
          <span>Tu negocio</span>
          <input
            id="cf-negocio"
            type="text"
            autoComplete="organization"
            value={form.negocio}
            onChange={update('negocio')}
          />
        </label>
      </div>

      <label htmlFor="cf-necesidad">
        <span>¿Qué necesitas?</span>
        <textarea
          id="cf-necesidad"
          rows={4}
          value={form.necesidad}
          onChange={update('necesidad')}
          placeholder="Ej. Tengo una pastelería y necesito página y sistema de caja."
          required
        />
      </label>

      <div className="contact-form__actions">
        <button type="button" className="tactile-button tactile-button--ink" disabled={!ready} onClick={sendWhatsApp}>
          <MessageCircle size={17} aria-hidden="true" />
          Enviar por WhatsApp
        </button>
        <button type="button" className="tactile-button tactile-button--paper" disabled={!ready} onClick={sendEmail}>
          <Send size={16} aria-hidden="true" />
          Enviar por correo
        </button>
      </div>

      <p className="contact-form__hint" aria-live="polite">
        {ready ? 'Listo. Elige por dónde prefieres mandarlo.' : 'Completa tu nombre y qué necesitas.'}
      </p>
    </form>
  );
}

export function ContactSection() {
  return (
    <section className="contact section-pad" id="contacto">
      <div className="contact__top">
        <span className="section-index">{CONTACT_SECTION.eyebrow}</span>
        <span className="contact__kicker">{CONTACT_SECTION.kicker}</span>
      </div>

      <h2 className="contact__title">
        {CONTACT_SECTION.title.map((line, index) => (
          <span key={line} className="contact__title-line">
            <SplitText text={line} as="span" delay={index * 0.1} className={index ? 'contact__title-accent' : ''} />
          </span>
        ))}
      </h2>

      <div className="contact__bottom">
        <Reveal className="contact__identity">
          <div className="contact__logo">
            <img src="/mh-logo-sm.png" alt="Astral Morphiq Systems" width="300" height="268" />
          </div>
          <div className="contact__details">
            <span className="contact__role">{CONTACT.role}</span>
            <strong>{CONTACT.owner}</strong>
            <a href={`mailto:${CONTACT.email}`}>
              <Mail size={15} aria-hidden="true" />
              {CONTACT.email}
            </a>
            <p>
              <MapPin size={15} aria-hidden="true" />
              {CONTACT.location}
            </p>
          </div>
        </Reveal>

        <Reveal className="contact__action" delay={0.08}>
          <p className="contact__pitch">{CONTACT_SECTION.pitch}</p>

          <StarBorder color="#ceff3d" speed={7} className="contact__wa-frame">
            <a
              className="contact__wa"
              href={whatsappUrl('contact')}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsApp('contact')}
            >
              <span>
                <MessageCircle size={22} aria-hidden="true" /> WhatsApp directo
              </span>
              <strong>{CONTACT.phone}</strong>
              <ArrowUpRight size={30} aria-hidden="true" />
            </a>
          </StarBorder>

          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
