/**
 * Envoltorio común de todas las páginas.
 *
 * Se queda con lo bueno del sitio de una sola página —el arranque de marca,
 * el medidor de scroll, el grano, el scroll suave— y le quita lo que solo
 * tenía sentido con un único recorrido: la coreografía de la laptop y los
 * tramos negros.
 *
 * El arranque se ve UNA vez por sesión, no en cada navegación. Volver a
 * ponerle una pantalla de carga a alguien que solo hizo clic en «Precios»
 * sería castigarlo por moverse por el sitio.
 */

import { useCallback, useEffect, useState } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { AnimatePresence, motion as Motion, useScroll, useSpring } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { Navegacion } from './Navegacion';
import { Footer } from './Footer';
import { FloatingCTA } from './FloatingCTA';
import { BootLoader } from './BootLoader';
import { ClickSpark } from '../reactbits';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const CLAVE_ARRANQUE = 'morphiq:arrancado';

function useScrollSuave(activo) {
  useEffect(() => {
    if (!activo) return undefined;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, syncTouch: false, wheelMultiplier: 0.9 });
    let frame;
    const raf = (t) => {
      lenis.raf(t);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [activo]);
}

/** Lee la preferencia de movimiento antes del primer render, para no montar
 *  la pantalla de arranque y quitarla acto seguido. */
function sinMovimientoInicial() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** Lee si ya se mostró el arranque en esta pestaña. Tolera almacenamiento bloqueado. */
function yaArranco() {
  try {
    return sessionStorage.getItem(CLAVE_ARRANQUE) === '1';
  } catch {
    return false;
  }
}

export function Layout() {
  const sinMovimiento = useReducedMotion();
  const { pathname } = useLocation();

  /* La pantalla de arranque es SOLO de la home, y solo la primera vez de la
     sesión. Quien llega desde Google a /precios o a una página de servicio
     viene a leer algo concreto: meterle un velo a pantalla completa antes
     del contenido lo retrasa y, además, convierte ese velo en el elemento
     más grande que se pinta, o sea en el LCP de una página que se supone
     que vende. También se salta con prefers-reduced-motion. */
  const [arrancando, setArrancando] = useState(
    () => pathname === '/' && !sinMovimientoInicial() && !yaArranco()
  );
  const { scrollYProgress } = useScroll();
  const medidor = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  const terminarArranque = useCallback(() => {
    try {
      sessionStorage.setItem(CLAVE_ARRANQUE, '1');
    } catch {
      /* Si el almacenamiento está bloqueado el arranque se repetirá. No es grave. */
    }
    setArrancando(false);
  }, []);

  /* El scroll suave mantiene vivo un requestAnimationFrame compitiendo por
     el hilo principal. En la home acompaña a la coreografía; en las páginas
     que venden no aporta nada y sí cuesta respuesta a la interacción. */
  useScrollSuave(pathname === '/' && !sinMovimiento && !arrancando);

  useEffect(() => {
    document.body.classList.toggle('is-booting', arrancando);
    return () => document.body.classList.remove('is-booting');
  }, [arrancando]);

  /* Cada página es un documento nuevo: el foco vuelve al principio para que
     quien navega con teclado o lector no se quede en el pie de la anterior. */
  useEffect(() => {
    if (arrancando) return;
    document.getElementById('contenido')?.focus?.({ preventScroll: true });
  }, [pathname, arrancando]);

  return (
    <>
      <AnimatePresence>{arrancando && <BootLoader onDone={terminarArranque} />}</AnimatePresence>

      <div className="app-shell" inert={arrancando ? '' : undefined}>
        <Motion.div className="scroll-meter" style={{ scaleX: medidor }} aria-hidden="true" />
        <div className="paper-grain" aria-hidden="true" />

        <Navegacion />

        {/* ---- Transición entre rutas ----
            Un fundido corto con un desplazamiento mínimo. Deliberadamente
            barato: solo `opacity` y `transform`, que van en el compositor y
            no cuentan para CLS, y 260 ms de entrada. Cualquier cosa más
            larga convierte navegar en esperar, que es justo lo que un sitio
            multipágina no debe sentirse.

            La clave es `pathname`: al cambiar, React desmonta y remonta, y
            AnimatePresence hace el relevo. `mode="wait"` no se usa a
            propósito, porque encadenaría salida y entrada y duplicaría el
            tiempo percibido. */}
        <main id="contenido" tabIndex={-1}>
          <AnimatePresence initial={false}>
            <Motion.div
              key={pathname}
              initial={sinMovimiento ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </Motion.div>
          </AnimatePresence>
        </main>

        <Footer />
        <FloatingCTA />
      </div>

      <ClickSpark color="#0a66ff" />
      <ScrollRestoration />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
