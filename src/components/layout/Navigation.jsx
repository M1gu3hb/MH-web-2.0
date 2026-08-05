import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { Brand } from './Brand';
import { Magnet } from '../reactbits';
import { useActiveSection } from '../../hooks/useActiveSection';
import { NAV_LINKS } from '../../content';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';

/* Se observan todas las secciones, no solo las del menú, para que la barra
   sepa cuándo está sobre un bloque en tinta. */
const SECTION_IDS = ['inicio', 'trabajo', 'servicios', 'proceso', 'inversion', 'sobre-mi', 'preguntas', 'contacto'];
const NIGHT_SECTIONS = new Set(['inicio', 'trabajo', 'sobre-mi', 'contacto']);
const FOCUSABLE = 'a[href], button:not([disabled])';

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  const panel = useRef(null);
  const opener = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  /* Barra condensada al salir del hero. */
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 90);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Bloqueo de scroll + Escape + trampa de foco mientras el panel está abierto. */
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (!open) return () => document.body.classList.remove('menu-open');

    const previous = document.activeElement;
    const openerNode = opener.current;
    const nodes = panel.current?.querySelectorAll(FOCUSABLE);
    nodes?.[0]?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !nodes?.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('menu-open');
      (openerNode ?? previous)?.focus?.();
    };
  }, [open]);

  return (
    <>
      <header
        className={`nav-shell ${condensed ? 'nav-shell--condensed' : ''} ${
          NIGHT_SECTIONS.has(activeSection) ? 'nav-shell--night' : ''
        }`}
      >
        <Brand />

        <nav className="nav-shell__links" aria-label="Navegación principal">
          {NAV_LINKS.map(([label, href]) => {
            const current = activeSection === href.slice(1);
            return (
              <a key={href} href={href} className={current ? 'active' : ''} aria-current={current ? 'true' : undefined}>
                {label}
                <i aria-hidden="true" />
              </a>
            );
          })}
        </nav>

        <Magnet strength={0.22} className="nav-shell__cta-wrap">
          <a
            className="nav-shell__cta tactile-button tactile-button--ink"
            href={whatsappUrl('nav')}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsApp('nav')}
          >
            Iniciar proyecto
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </Magnet>

        <button
          ref={opener}
          className="nav-shell__menu"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(true)}
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <Motion.div
            id="mobile-nav"
            ref={panel}
            className="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navegación"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.52, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mobile-nav__top">
              <Brand inverted />
              <button type="button" aria-label="Cerrar menú" onClick={close}>
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Navegación móvil">
              {NAV_LINKS.map(([label, href], index) => (
                <a key={href} href={href} onClick={close}>
                  <span>0{index + 1}</span>
                  {label}
                  <ArrowUpRight size={22} aria-hidden="true" />
                </a>
              ))}
            </nav>

            <a
              className="mobile-nav__cta"
              href={whatsappUrl('nav')}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                trackWhatsApp('nav');
                close();
              }}
            >
              Cuéntame tu proyecto
              <ArrowUpRight size={21} aria-hidden="true" />
            </a>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
