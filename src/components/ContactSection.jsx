import { ArrowUpRight, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Brand } from './Brand';
import { CONTACT } from '../data';

export function ContactSection({ whatsappUrl }) {
  return (
    <>
      <section className="contact" id="contacto">
        <div className="contact__top">
          <p className="section-index">04 / CONTACTO DIRECTO</p>
          <span>¿TIENES UNA IDEA?</span>
        </div>
        <h2>Hagamos algo<br /><em>difícil de ignorar.</em></h2>
        <div className="contact__bottom">
          <div className="contact__identity">
            <div className="contact__logo">
              <img src="/mh-logo-v2-720.png" alt="MH Astral Systems" width="360" height="322" />
            </div>
            <div>
              <span>DIRECTOR / DISEÑADOR / DESARROLLADOR</span>
              <strong>{CONTACT.owner}</strong>
              <a href={`mailto:${CONTACT.email}`}><Mail size={15} />{CONTACT.email}</a>
              <p><MapPin size={15} />{CONTACT.location}</p>
            </div>
          </div>
          <div className="contact__action">
            <p>Cuéntame qué vendes, qué se está atorando y qué quieres mejorar. Yo te digo con honestidad qué conviene construir.</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <span><MessageCircle size={22} /> WhatsApp</span>
              <strong>{CONTACT.phone}</strong>
              <ArrowUpRight size={32} />
            </a>
          </div>
        </div>
      </section>
      <footer className="footer">
        <Brand inverted />
        <p>Diseño que vende.<br />Sistemas que ordenan.</p>
        <div>
          <a href="#servicios">Servicios</a>
          <a href="#trabajo">Trabajo</a>
          <a href="#proceso">Proceso</a>
          <a href="#inicio">Volver arriba</a>
        </div>
        <span>© {new Date().getFullYear()} MH ASTRAL SYSTEMS · CDMX</span>
      </footer>
    </>
  );
}
