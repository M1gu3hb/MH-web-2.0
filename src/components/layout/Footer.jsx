import { ArrowUp, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BrandLockup } from './BrandLockup';
import { CONTACT, FOOTER } from '../../content';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';

/**
 * El pie como cierre útil: la marca con su lockup, todas las vías de
 * contacto reales y el acceso rápido a cada sección, no solo una firma.
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <a className="brand brand--pie" href="#inicio" aria-label="Morphiq. Volver al inicio">
            <BrandLockup layout="horizontal" />
          </a>
          <p className="footer__tagline">
            {FOOTER.tagline[0]}
            <br />
            {FOOTER.tagline[1]}
          </p>
        </div>

        <div className="footer__col">
          <span className="footer__col-title">Contacto</span>
          <a
            className="footer__dato"
            href={whatsappUrl('footer')}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsApp('footer')}
          >
            <MessageCircle size={15} aria-hidden="true" />
            <span>WhatsApp · {CONTACT.phone}</span>
          </a>
          <a className="footer__dato" href={`tel:+${CONTACT.whatsapp}`}>
            <Phone size={15} aria-hidden="true" />
            <span>Llamar · {CONTACT.phone}</span>
          </a>
          <a
            className="footer__dato"
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT.email}`}
            target="_blank"
            rel="noreferrer"
          >
            <Mail size={15} aria-hidden="true" />
            <span>{CONTACT.email}</span>
          </a>
          <p className="footer__dato">
            <MapPin size={15} aria-hidden="true" />
            <span>{CONTACT.location}</span>
          </p>
        </div>

        <nav className="footer__col" aria-label="Enlaces del pie">
          <span className="footer__col-title">Secciones</span>
          {FOOTER.links.map(([label, href]) => (
            <a className="footer__dato" key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className="footer__bar">
        <span className="footer__legal">
          © {new Date().getFullYear()} ASTRAL MORPHIQ SYSTEMS · {CONTACT.location}
        </span>
        <a className="footer__arriba" href="#inicio">
          Volver arriba
          <ArrowUp size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
