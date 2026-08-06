import { useEffect, useRef, useState } from 'react';
import { ProjectCarousel } from '../layout/ProjectCarousel';
import { CapabilitiesSection } from '../sections/CapabilitiesSection';
import { FaqSection } from '../sections/FaqSection';

/* Punto del que sale la ventana: el primer icono de la barra de tareas, en
   fracciones del ancho y alto de la pantalla. */
const DOCK_X = 0.326;
const DOCK_Y = 0.955;
const DOCK_SIZE = 34 / 1024;

/**
 * Lo que se ve dentro de la pantalla de la laptop.
 *
 * No es un dibujo ni una captura: el escritorio es el mismo lienzo que pinta
 * el sistema operativo, y la ventana contiene las secciones reales de la web,
 * montadas de verdad y corriendo en vivo. Cuando la ventana termina de
 * abrirse y la página toma el relevo, lo de dentro y lo de fuera son lo mismo.
 *
 * El contenido solo se monta mientras hay transición: el resto del tiempo la
 * pantalla es únicamente el escritorio, que es barato.
 */
export function LaptopScreenUI({ screen, choreography }) {
  const desktop = useRef(null);
  const windowRef = useRef(null);
  const chromeRef = useRef(null);
  const viewRef = useRef(null);

  const [variant, setVariant] = useState('next');
  const [live, setLive] = useState(false);

  /* El escritorio es el lienzo del sistema, insertado tal cual. */
  useEffect(() => {
    const host = desktop.current;
    const canvas = screen?.desktop;
    if (!host || !canvas) return undefined;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    host.appendChild(canvas);
    return () => {
      if (canvas.parentElement === host) host.removeChild(canvas);
    };
  }, [screen]);

  /* La ventana se abre desde la barra de tareas hasta llenar la pantalla. Se
     escribe por rAF: es una animación por fotograma, no estado de React. */
  useEffect(() => {
    if (!screen) return undefined;
    let frame = 0;

    const tick = () => {
      const s = choreography.current;
      const open = s.osWindow ?? 0;

      /* Con la laptop fuera de plano no hay nada que escribir. */
      if (!s.visible && !live) {
        frame = requestAnimationFrame(tick);
        return;
      }

      /* El contenido real se monta al empezar la transición, no al abrirse la
         ventana: montarlo justo cuando arranca la animación daría un tirón.
         Y se desmonta en cuanto la laptop deja de verse: dentro de la página
         el tramo sigue siendo «enter», y dejarlo montado mantenía el carrusel
         y la baraja animando dentro de una capa invisible. */
      const wanted = s.visible && s.phase !== 'hero';
      setLive((current) => (current === wanted ? current : wanted));
      setVariant((current) => {
        const next = s.osVariant ?? 'next';
        return current === next ? current : next;
      });

      const fromH = DOCK_SIZE * (screen.width / screen.height);
      const w = DOCK_SIZE + (1 - DOCK_SIZE) * open;
      const h = fromH + (1 - fromH) * open;

      const el = windowRef.current;
      if (el) {
        el.style.width = `${w * 100}%`;
        el.style.height = `${h * 100}%`;
        el.style.left = `${(0.5 + (DOCK_X - 0.5) * (1 - open)) * 100}%`;
        el.style.top = `${(0.5 + (DOCK_Y - 0.5) * (1 - open)) * 100}%`;
        el.style.opacity = open > 0.004 ? '1' : '0';
        el.style.borderRadius = `${14 * (1 - open) + 3}px`;
      }

      /* El cromo se encoge con la ventana para no comerse el contenido
         mientras todavía es pequeña. */
      if (chromeRef.current) {
        chromeRef.current.style.height = `${6 + 34 * open}px`;
        chromeRef.current.style.opacity = String(Math.min(1, open * 3));
      }

      /* El documento se maqueta al tamaño del viewport real y se encoge para
         caber en la ventana. Es la pieza que hace que lo de dentro sea
         idéntico a lo de fuera: las medidas en vw y vh de todo el sitio se
         resuelven contra el mismo viewport, así que la tipografía, los aires
         y los puntos de ruptura son exactamente los de la página. */
      if (viewRef.current) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        viewRef.current.style.width = `${vw}px`;
        viewRef.current.style.height = `${vh}px`;
        viewRef.current.style.transform = `scale(${Math.max(0.0005, (w * screen.width) / vw)})`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [choreography, live, screen]);

  if (!screen) return null;

  return (
    <>
      <div className="laptop-screen__desktop" ref={desktop} />

      <div className="laptop-screen__window" ref={windowRef}>
        <div className="laptop-screen__chrome" ref={chromeRef}>
          <span className="laptop-screen__lights"><i /><i /><i /></span>
          <span className="laptop-screen__url">
            <img src="/mh-logo.png" alt="" width="16" height="14" />
            mh-astral-systems.com
          </span>
        </div>

        <div className="laptop-screen__viewport">
          <div className="laptop-screen__view" ref={viewRef}>
            {live && variant === 'back' ? <FaqSection embedded /> : null}
            {live && variant !== 'back' ? (
              <>
                <ProjectCarousel embedded />
                <CapabilitiesSection embedded />
              </>
            ) : null}
          </div>
        </div>
      </div>

      <span className="laptop-screen__glass" aria-hidden="true" />
    </>
  );
}
