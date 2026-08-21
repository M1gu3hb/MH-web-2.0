/**
 * Barra de navegación del sitio multipágina.
 *
 * Dos navegaciones de verdad, no una comprimida:
 *   · En escritorio, barra horizontal con un desplegable para Servicios.
 *   · En teléfono, un panel a pantalla completa donde los servicios se ven
 *     todos a la vez, con su descripción. Nadie quiere abrir un acordeón
 *     dentro de un menú para saber a dónde va.
 *
 * El desplegable abre al pulsar, no solo al pasar el cursor: en una pantalla
 * táctil el hover no existe, y un menú que solo funciona con ratón es un
 * menú roto para la mitad de las visitas. En puntero fino además abre al
 * pasar por encima, que es lo que la gente espera.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, Menu, MessageCircle, X } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { Brand } from './Brand';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { MENU, RUTAS } from '../../config/rutas';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';

const ENFOCABLE = 'a[href], button:not([disabled])';

/* ------------------------------------------------------------
   La marca de «estás aquí»
   ------------------------------------------------------------
   Hasta ahora un enlace se apagaba y otro se encendía en el mismo
   fotograma, mientras el contenido de abajo sí hacía su fundido de ruta.
   Con `layoutId` la pastilla es un único elemento que Motion mueve del
   enlace viejo al nuevo, así que la barra participa en la navegación en
   vez de mirarla desde fuera.

   El muelle es 380/32 —duro y sin rebote— porque esto acompaña a un
   cambio de página que ya está ocurriendo: si oscila, llega tarde.

   El `color: var(--accent-pos)` del enlace activo NO se toca. La pastilla
   se pinta detrás del texto y se suma; no sustituye a la marca que ya
   existía. */
function PastillaActiva() {
  const reducido = useReducedMotion();

  /* Con reduced motion se renderiza la misma pastilla sin `layoutId`:
     aparece de golpe en su sitio. Se degrada el viaje, nunca el dato de
     en qué página estás. */
  if (reducido) return <span className="nav-enlace__pastilla" aria-hidden="true" />;

  return (
    <Motion.span
      className="nav-enlace__pastilla"
      aria-hidden="true"
      layoutId="nav-activo"
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    />
  );
}

/* ------------------------------------------------------------
   Desplegable de Servicios (escritorio)
   ------------------------------------------------------------ */

function Desplegable({ entrada }) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);
  const id = useId();
  const { pathname } = useLocation();
  const activo = entrada.hijos.some((h) => pathname === h.href) || pathname === entrada.href;

  /* Cerrar al hacer clic fuera y al pulsar Escape. */
  useEffect(() => {
    if (!abierto) return undefined;
    const fuera = (e) => {
      if (!contenedor.current?.contains(e.target)) setAbierto(false);
    };
    const tecla = (e) => {
      if (e.key === 'Escape') {
        setAbierto(false);
        contenedor.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('pointerdown', fuera);
    document.addEventListener('keydown', tecla);
    return () => {
      document.removeEventListener('pointerdown', fuera);
      document.removeEventListener('keydown', tecla);
    };
  }, [abierto]);

  return (
    <div
      className="nav-desplegable"
      ref={contenedor}
      onMouseEnter={() => window.matchMedia('(hover: hover)').matches && setAbierto(true)}
      onMouseLeave={() => window.matchMedia('(hover: hover)').matches && setAbierto(false)}
    >
      <button
        type="button"
        className={`nav-enlace nav-desplegable__boton ${activo ? 'is-activo' : ''}`}
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => setAbierto((v) => !v)}
      >
        {entrada.etiqueta}
        <ChevronDown size={15} aria-hidden="true" className={abierto ? 'is-girado' : ''} />
      </button>

      <AnimatePresence>
        {abierto && (
          <Motion.div
            id={id}
            className="nav-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link className="nav-menu__todos" to={entrada.href} onClick={() => setAbierto(false)}>
              Ver todos los servicios
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <ul>
              {entrada.hijos.map((hijo) => (
                <li key={hijo.href}>
                  <Link to={hijo.href} onClick={() => setAbierto(false)}>
                    <strong>{hijo.etiqueta}</strong>
                    <span>{hijo.resumen}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------
   Barra
   ------------------------------------------------------------ */

export function Navegacion() {
  const [abierto, setAbierto] = useState(false);
  const [condensada, setCondensada] = useState(false);
  const panel = useRef(null);
  const boton = useRef(null);
  const { pathname } = useLocation();

  const cerrar = useCallback(() => setAbierto(false), []);

  /* El escalonado del panel se numera de corrido a través de los tres
     grupos porque la persona los recorre como una sola lista, no como
     tres. El `--i` solo viaja hasta el CSS; el retardo lo calcula él. */
  const principales = MENU.filter((e) => !e.hijos);
  const servicios = MENU.find((e) => e.hijos)?.hijos ?? [];

  /* La barra se condensa al bajar. */
  useEffect(() => {
    const alScroll = () => setCondensada(window.scrollY > 40);
    alScroll();
    window.addEventListener('scroll', alScroll, { passive: true });
    return () => window.removeEventListener('scroll', alScroll);
  }, []);

  /* Cambiar de página cierra el panel. */
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  /* Con el panel abierto: sin scroll de fondo, Escape cierra y el foco no
     se escapa por detrás del velo. */
  useEffect(() => {
    document.body.classList.toggle('menu-open', abierto);
    if (!abierto) return () => document.body.classList.remove('menu-open');

    const previo = document.activeElement;
    const abridor = boton.current;
    const nodos = panel.current?.querySelectorAll(ENFOCABLE);
    nodos?.[0]?.focus();

    const alPulsar = (e) => {
      if (e.key === 'Escape') {
        setAbierto(false);
        return;
      }
      if (e.key !== 'Tab' || !nodos?.length) return;
      const primero = nodos[0];
      const ultimo = nodos[nodos.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    window.addEventListener('keydown', alPulsar);
    return () => {
      window.removeEventListener('keydown', alPulsar);
      document.body.classList.remove('menu-open');
      (abridor ?? previo)?.focus?.();
    };
  }, [abierto]);

  return (
    <>
      <header className={`nav-shell ${condensada ? 'nav-shell--condensed' : ''}`}>
        <Brand />

        <nav className="nav-shell__links" aria-label="Navegación principal">
          {MENU.map((entrada) =>
            entrada.hijos ? (
              <Desplegable key={entrada.href} entrada={entrada} />
            ) : (
              <NavLink
                key={entrada.href}
                to={entrada.href}
                end={entrada.href === RUTAS.inicio}
                className={({ isActive }) => `nav-enlace ${isActive ? 'is-activo' : ''}`}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <PastillaActiva />}
                    {entrada.etiqueta}
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>

        <div className="nav-shell__acciones">
          <Link className="nav-cta tactile-button tactile-button--glow" to={RUTAS.contacto}>
            Cotizar proyecto
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>

          <button
            ref={boton}
            type="button"
            className="nav-hamburguesa"
            aria-expanded={abierto}
            aria-controls="panel-navegacion"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setAbierto((v) => !v)}
          >
            {/* Las dos ramas de este ternario eran el MISMO icono, así que el
                botón no contaba su estado. La X en la rama abierta no quita
                nada porque no había nada; el giro lo pone el CSS a partir de
                `aria-expanded`, que ya estaba puesto. */}
            {abierto ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* ---- Panel de teléfono ---- */}
      <AnimatePresence>
        {abierto && (
          <Motion.div
            className="nav-panel"
            id="panel-navegacion"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="nav-panel__barra">
              <span className="nav-panel__titulo">Navegación</span>
              <button type="button" className="nav-panel__cerrar" onClick={cerrar} aria-label="Cerrar menú">
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <div className="nav-panel__cuerpo">
              <ul className="nav-panel__principal">
                {principales.map((entrada, i) => (
                  <li key={entrada.href}>
                    <NavLink
                      to={entrada.href}
                      end={entrada.href === RUTAS.inicio}
                      className={({ isActive }) => (isActive ? 'is-activo' : '')}
                      style={{ '--i': i }}
                    >
                      {entrada.etiqueta}
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="nav-panel__servicios">
                <p className="nav-panel__seccion">Servicios</p>
                <ul>
                  {servicios.map((hijo, i) => (
                    <li key={hijo.href}>
                      <NavLink
                        to={hijo.href}
                        className={({ isActive }) => (isActive ? 'is-activo' : '')}
                        style={{ '--i': principales.length + i }}
                      >
                        <strong>{hijo.etiqueta}</strong>
                        <span>{hijo.resumen}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="nav-panel__pie">
              <Link
                className="tactile-button tactile-button--glow tactile-button--large"
                to={RUTAS.contacto}
                style={{ '--i': principales.length + servicios.length }}
              >
                Cotizar proyecto
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <a
                className="tactile-button tactile-button--paper tactile-button--large"
                href={whatsappUrl('nav')}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackWhatsApp('nav')}
                style={{ '--i': principales.length + servicios.length + 1 }}
              >
                <MessageCircle size={17} aria-hidden="true" />
                Escríbeme por WhatsApp
              </a>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
