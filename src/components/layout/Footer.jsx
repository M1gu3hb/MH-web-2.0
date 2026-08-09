import { Brand } from './Brand';
import { CONTACT, FOOTER } from '../../content';

export function Footer() {
  return (
    <footer className="footer">
      <Brand />
      <p className="footer__tagline">
        {FOOTER.tagline[0]}
        <br />
        {FOOTER.tagline[1]}
      </p>
      <nav className="footer__links" aria-label="Enlaces del pie">
        {FOOTER.links.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
      <span className="footer__legal">
        © {new Date().getFullYear()} ASTRAL MORPHIQ SYSTEMS · {CONTACT.location}
      </span>
    </footer>
  );
}
