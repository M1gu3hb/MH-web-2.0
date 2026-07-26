import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { Brand } from './Brand';

const LINKS = [
  ['Servicios', '#servicios'],
  ['Trabajo', '#trabajo'],
  ['Proceso', '#proceso'],
  ['Contacto', '#contacto'],
];

export function Navigation({ whatsappUrl }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    const closeOnEscape = (event) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <header className="nav-shell">
        <Brand />
        <nav className="nav-shell__links" aria-label="Navegación principal">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="nav-shell__cta tactile-button tactile-button--ink" href={whatsappUrl} target="_blank" rel="noreferrer">
          Iniciar proyecto
          <ArrowUpRight size={16} />
        </a>
        <button className="nav-shell__menu" type="button" aria-label="Abrir menú" aria-expanded={open} onClick={() => setOpen(true)}>
          <Menu size={20} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <Motion.div
            className="mobile-nav"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mobile-nav__top">
              <Brand inverted />
              <button type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
                <X size={22} />
              </button>
            </div>
            <nav aria-label="Navegación móvil">
              {LINKS.map(([label, href], index) => (
                <a key={href} href={href} onClick={() => setOpen(false)}>
                  <span>0{index + 1}</span>
                  {label}
                  <ArrowUpRight size={22} />
                </a>
              ))}
            </nav>
            <a className="mobile-nav__cta" href={whatsappUrl} target="_blank" rel="noreferrer">
              Cuéntame tu proyecto
              <ArrowUpRight size={21} />
            </a>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
