/**
 * El pie del sitio multipágina.
 *
 * El pie anterior enlazaba a anclas del sitio de una sola página
 * (#servicios, #trabajo, #inversion…). En un sitio con rutas de verdad esos
 * enlaces estaban rotos en todas las páginas menos una: llevaban a un ancla
 * que no existe en el documento, así que no hacían nada.
 *
 * Ahora enlaza a las rutas reales y funciona además como mapa del sitio:
 * para Google es una fuente de enlaces internos hacia todas las páginas
 * desde cualquier página, que es exactamente lo que ayuda a que se rastree
 * entero.
 */

import { Link } from 'react-router-dom';
import { ArrowUp, Github, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { BrandLockup } from './BrandLockup';
import { CONTACT } from '../../content';
import { MENU, RUTAS } from '../../config/rutas';
import { PLANES, precioEnLinea } from '../../config/pricing';
import { PROYECTOS, rutaProyecto } from '../../content/proyectos';
import { gmailUrl } from '../../lib/correo';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';

const SERVICIOS = MENU.find((e) => e.hijos)?.hijos ?? [];
const PAGINAS = MENU.filter((e) => !e.hijos && e.href !== RUTAS.inicio);

export function Footer() {
  const alInicio = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <Link className="brand brand--pie" to={RUTAS.inicio} aria-label="Morphiq. Ir al inicio">
            <BrandLockup layout="horizontal" />
          </Link>
          <p className="footer__tagline">
            Diseño que vende.
            <br />
            Sistemas que ordenan.
          </p>
          <p className="footer__desde">
            Páginas web {precioEnLinea(PLANES.webEsencial).toLowerCase()}
          </p>
        </div>

        <nav className="footer__col" aria-label="Servicios">
          <h2 className="footer__col-title">Servicios</h2>
          {SERVICIOS.map((s) => (
            <Link key={s.href} className="footer__dato" to={s.href}>
              <span>{s.etiqueta}</span>
            </Link>
          ))}
        </nav>

        <nav className="footer__col" aria-label="Páginas">
          <h2 className="footer__col-title">El sitio</h2>
          {PAGINAS.map((p) => (
            <Link key={p.href} className="footer__dato" to={p.href}>
              <span>{p.etiqueta}</span>
            </Link>
          ))}
        </nav>

        <div className="footer__col">
          <h2 className="footer__col-title">Contacto</h2>
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
          <a className="footer__dato" href={gmailUrl(CONTACT.email)} target="_blank" rel="noreferrer">
            <Mail size={15} aria-hidden="true" />
            <span>{CONTACT.email}</span>
          </a>
          <a className="footer__dato" href="https://github.com/M1gu3hb" target="_blank" rel="noreferrer">
            <Github size={15} aria-hidden="true" />
            <span>github.com/M1gu3hb</span>
          </a>
          <p className="footer__dato footer__dato--plano">
            <MapPin size={15} aria-hidden="true" />
            <span>{CONTACT.location}</span>
          </p>
        </div>
      </div>

      {/* Los casos, enlazados desde todas las páginas.
          Las fichas de proyecto eran las URLs peor enlazadas del sitio: solo
          se llegaba a ellas desde /proyectos, y una página con un único
          enlace entrante se rastrea tarde y se reconsidera poco. Aquí van
          las once, en una tira que además hace de índice para quien llega al
          pie buscando trabajo hecho. */}
      <nav className="footer__casos" aria-label="Casos">
        <h2 className="footer__col-title">Casos</h2>
        <ul>
          {PROYECTOS.map((p) => (
            <li key={p.slug}>
              <Link to={rutaProyecto(p.slug)}>{p.nombre}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="footer__base">
        <p className="footer__legal">
          © {new Date().getFullYear()} Astral Morphiq Systems · Morphiq · {CONTACT.owner}
        </p>
        <button type="button" className="footer__arriba" onClick={alInicio}>
          Volver arriba
          <ArrowUp size={14} aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
