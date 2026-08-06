import { useCallback, useEffect, useRef, useState } from 'react';
import { ProjectCarousel } from '../layout/ProjectCarousel';
import { CapabilitiesSection } from '../sections/CapabilitiesSection';
import { FaqSection } from '../sections/FaqSection';
import { launcherSpot } from './brandOS';

/* Punto del que sale la ventana: el lanzador de la web en la barra de
   tareas. Lo dice el propio sistema operativo, así que el icono, el cursor
   que lo pulsa y la ventana que sale de él no pueden descuadrarse. */
const { x: DOCK_X, y: DOCK_Y, size: DOCK_SIZE } = launcherSpot();

const CHROME = 40; // alto del cromo de la ventana, en píxeles de pantalla

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t) => t * t * (3 - 2 * t);

/**
 * Lo que se ve dentro de la pantalla de la laptop.
 *
 * No es un dibujo ni una captura: el escritorio es el mismo lienzo que pinta
 * el sistema operativo, y la ventana contiene las secciones reales de la web,
 * montadas de verdad y corriendo en vivo.
 *
 * Para que el relevo con la página no se note hacen falta tres cosas, y las
 * tres se calculan aquí en cada fotograma:
 *
 *   posición  el documento incrustado se desplaza con el scroll real, así que
 *             la franja que se ve dentro de la ventana es exactamente la que
 *             la página enseñará al terminar. Sin esto la ventana abría por el
 *             principio de la sección mientras la página estaba por la mitad,
 *             y al fundirse se veía todo doble.
 *   escala    al abrirse, el documento cabe entero en la ventana; al final se
 *             ajusta a tamaño real, uno a uno con el viewport, para que la
 *             tipografía mida lo mismo dentro que fuera.
 *   cromo     la barra de la ventana se retira en el último tramo: al final
 *             la ventana ya no es una ventana, es la página.
 */
export function LaptopScreenUI({ screen, choreography }) {
  const desktop = useRef(null);
  const windowRef = useRef(null);
  const chromeRef = useRef(null);
  const viewportRef = useRef(null);
  const viewRef = useRef(null);
  const cursorRef = useRef(null);
  /* Si ya se dejó la ventana apagada, no hace falta volver a hacerlo. */
  const idle = useRef(false);

  /* Las secciones de la página real contra las que se alinea el reflejo. Se
     leen del DOM en cada fotograma y no de un estado: la variante puede
     cambiar entre renders y un ancla vieja descoloca todo el documento. */
  const anchors = useRef({ next: null, back: null });

  /* Parejas de nodos entre cada sección de verdad y su copia incrustada. */
  const mirror = useRef(new Map());

  const [variant, setVariant] = useState('next');
  const [live, setLive] = useState(false);

  const anchorEl = useCallback((which) => {
    const cache = anchors.current;
    if (!cache[which] || !cache[which].isConnected) {
      cache[which] = which === 'back'
        ? document.querySelector('main .faq')
        : document.querySelector('main .carousel');
    }
    return cache[which];
  }, []);

  /* La copia corre sus propias animaciones, pero fuera de sitio: su caja de
     layout no está donde se la ve, así que las apariciones por scroll se
     disparan cuando no toca. Antes se las forzaba a estado final y por eso al
     relevo saltaba: la página real seguía a media aparición y la copia ya
     estaba puesta. En vez de inventarle un estado se le copia el de verdad
     —estilos, clases y texto— y así la ventana enseña, literalmente, lo que
     la página está enseñando en ese fotograma. */
  const reflect = useCallback((realEl, embEl, key) => {
    let entry = mirror.current.get(key);
    if (!entry || entry.real !== realEl || entry.emb !== embEl || !entry.emb.isConnected || entry.stale) {
      const rs = realEl.querySelectorAll('*');
      const es = embEl.querySelectorAll('*');
      /* Si los árboles no coinciden nodo a nodo no hay pareja fiable que
         copiar, y es mejor no tocar nada que descolocarlo todo. */
      entry = {
        real: realEl,
        emb: embEl,
        pairs: rs.length === es.length ? Array.from(rs, (node, i) => [node, es[i]]) : [],
        moving: [],
        age: 0,
        stale: false,
        watch: null,
      };

      /* Abrir o cerrar una pregunta añade y quita nodos, y con la lista de
         parejas ya hecha cada nodo pasaba a copiarse sobre el que no era: los
         estilos acababan cruzados y, en cuanto una pareja caía sobre un SVG,
         saltaba una excepción que se llevaba por delante el bucle entero y
         dejaba la pantalla congelada. El árbol se vigila y las parejas se
         rehacen en cuanto cambia. */
      entry.watch = new MutationObserver(() => {
        const current = mirror.current.get(key);
        if (current) current.stale = true;
      });
      entry.watch.observe(realEl, { childList: true, subtree: true });

      mirror.current.get(key)?.watch?.disconnect();
      mirror.current.set(key, entry);
    }

    const { pairs } = entry;
    for (let i = 0; i < pairs.length; i += 1) {
      const [r, e] = pairs[i];
      const style = r.style.cssText;
      if (e.style.cssText !== style) e.style.cssText = style;
      /* Solo entre elementos HTML: en SVG `className` es de solo lectura. */
      if (typeof r.className === 'string' && typeof e.className === 'string' && e.className !== r.className) {
        e.className = r.className;
      }
      if (!r.firstElementChild && e.textContent !== r.textContent) e.textContent = r.textContent;
    }

    /* Lo que se mueve solo —la marquesina de proyectos— no lleva el estado en
       un estilo en línea sino en una animación CSS, y cada copia arrancó la
       suya cuando le tocó. Al fundirse se veían las dos listas corriendo
       desfasadas, como un fantasma. Se les iguala el reloj. Buscar qué nodos
       están animados es caro, así que la lista se rehace de tarde en tarde y
       lo de cada fotograma es solo poner el tiempo. */
    entry.age -= 1;
    if (entry.age <= 0) {
      entry.age = 40;
      entry.moving = pairs.filter(([r]) => r.getAnimations?.().length);
    }
    for (let i = 0; i < entry.moving.length; i += 1) {
      const [r, e] = entry.moving[i];
      const ra = r.getAnimations();
      const ea = e.getAnimations?.() ?? [];
      for (let j = 0; j < ea.length && j < ra.length; j += 1) {
        if (ea[j].currentTime !== ra[j].currentTime) ea[j].currentTime = ra[j].currentTime;
      }
    }
  }, []);

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

  /* Todo el movimiento se escribe por rAF: es una animación por fotograma,
     no estado de React. */
  useEffect(() => {
    if (!screen) return undefined;
    let frame = 0;
    const pairs = mirror.current;

    const tick = () => {
      /* El siguiente fotograma se pide ANTES de trabajar, y no después. Con la
         petición al final, cualquier excepción en medio mataba el bucle para
         siempre: la pantalla se quedaba clavada en el último fotograma pintado
         y la transición entera parecía trabada. Así un fallo puntual cuesta un
         fotograma, no la escena. */
      frame = requestAnimationFrame(tick);
      draw();
    };

    const draw = () => {
      const s = choreography.current;

      /* El contenido se monta al empezar la transición y se desmonta en cuanto
         la laptop deja de verse: dentro de la página el tramo sigue siendo
         «enter», y dejarlo montado mantenía el carrusel animando en una capa
         invisible. */
      const wanted = s.visible && s.phase !== 'hero';
      setLive((current) => (current === wanted ? current : wanted));
      setVariant((current) => {
        const next = s.osVariant ?? 'next';
        return current === next ? current : next;
      });

      /* Nada que hacer si no hay contenido montado y tampoco lo va a haber.
         En el hero la laptop sí se ve, pero su ventana está cerrada y vacía, y
         aun así este bucle se pasaba el rato midiendo rectángulos y escribiendo
         estilos a cero, sesenta veces por segundo, al lado de la escena 3D.
         La ventana se apaga una vez al llegar y en adelante se sale de largo. */
      if (!live && !wanted) {
        if (mirror.current.size) {
          mirror.current.forEach((entry) => entry.watch?.disconnect());
          mirror.current.clear();
        }
        if (!idle.current) {
          idle.current = true;
          if (windowRef.current) windowRef.current.style.opacity = '0';
          if (cursorRef.current) cursorRef.current.style.opacity = '0';
        }
        return;
      }
      idle.current = false;

      const open = s.osWindow ?? 0;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      /* Se mide antes de escribir: leer después obligaría a recalcular el
         layout en cada fotograma. Va un fotograma por detrás mientras la
         ventana se mueve, y exacto en cuanto se para, que es lo que importa
         para que el relevo cuadre. */
      const rootRect = screen.root.getBoundingClientRect();
      const vpRect = viewportRef.current?.getBoundingClientRect();

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

      /* El cursor va al lanzador y lo pulsa: sin ese gesto la ventana
         aparecía sola y no se leía como una aplicación abriéndose. */
      const cursor = cursorRef.current;
      if (cursor) {
        const p = s.pointer ?? 0;
        const travel = smooth(clamp01(p / 0.72));
        const press = clamp01((p - 0.72) / 0.18) * (1 - clamp01((p - 0.9) / 0.1));
        const fromX = DOCK_X + 0.34;
        const fromY = DOCK_Y - 0.42;
        cursor.style.opacity = p > 0.01 && open < 0.14 ? String(clamp01(p / 0.14)) : '0';
        cursor.style.left = `${(fromX + (DOCK_X - fromX) * travel) * 100}%`;
        cursor.style.top = `${(fromY + (DOCK_Y - fromY) * travel) * 100}%`;
        cursor.style.transform = `scale(${1 - press * 0.22})`;
      }

      /* El cromo entra al abrirse y se retira al final. */
      const chromeH = CHROME * clamp01(open / 0.2) * (1 - clamp01((open - 0.86) / 0.14));
      if (chromeRef.current) {
        chromeRef.current.style.height = `${chromeH}px`;
        chromeRef.current.style.opacity = String(clamp01(chromeH / 20));
      }

      const view = viewRef.current;
      if (view && vpRect) {
        /* Ancho real en pantalla del plano: con él se sabe cuánto encoger el
           documento para que mida uno a uno con el viewport. */
        const projected = rootRect.width || vw;

        const which = s.osVariant === 'back' ? 'back' : 'next';
        const realEl = anchorEl(which);
        const embEl = view.querySelector(which === 'back' ? '.faq' : '.carousel');
        const realRect = realEl?.getBoundingClientRect();

        /* Píxeles de pantalla por píxel de documento, por unidad de escala.
           Con el panel ya paralelo a la cámara la proyección es una escala
           limpia, así que este número basta: medido contra la página da uno
           a uno exacto y no hace falta corregir nada por encima. */
        const unit = Math.max(0.0001, projected / screen.width);

        /* Uno a uno solo cuando la pantalla está cubriendo el viewport: si se
           atara a la ventana, al alejarse la laptop el documento se quedaría
           a tamaño real dentro de una pantalla cada vez más pequeña y se
           vería un recorte que no encoge. */
        const fitK = (w * screen.width) / vw;
        const oneK = 1 / unit;
        /* Uno a uno cuando la pantalla se come el viewport, que ahora lo dice
           `fill` y no `focus`: con la pantalla entera a la vista el documento
           tiene que caber en la ventana, no medir a tamaño real. */
        const blend = smooth(clamp01(((s.fill ?? 0) - 0.55) / 0.45));
        const k = fitK + (oneK - fitK) * blend;
        const m = Math.max(0.0001, k * unit);

        /* Dónde va el documento incrustado. No se deduce del scroll: se lee
           dónde está ahora mismo la sección de verdad y se coloca su copia
           encima, que es la única forma de que el relevo cuadre al píxel
           venga de donde venga el scroll. La cuenta a ciegas queda de
           reserva por si la sección aún no existe en el DOM. */
        let offset;
        if (realRect && embEl) {
          offset = embEl.offsetTop - (realRect.top - vpRect.top) / m;

          /* Antes y después del contenido hay sendos tramos negros de una
             pantalla de alto, y el reflejo fiel los enseñaba tal cual: en
             teléfono la ventana se abre mucho antes de que el primero termine
             y se veía negra, como si la pantalla estuviera apagada. Mientras
             la ventana es ventana se la sujeta al contenido; en cuanto la
             pantalla cubre el viewport manda el reflejo y solo el reflejo,
             que es donde el relevo tiene que ser exacto. */
          if (blend < 1) {
            let first = null;
            let last = null;
            for (let i = 0; i < view.children.length; i += 1) {
              const c = view.children[i];
              if (c.classList.contains('laptop-screen__gap')) continue;
              if (!first) first = c;
              last = c;
            }
            if (first && last) {
              const lo = first.offsetTop;
              const hi = Math.max(lo, last.offsetTop + last.offsetHeight - vpRect.height / m);
              const held = Math.min(Math.max(offset, lo), hi);
              offset += (held - offset) * (1 - blend);
            }
          }
        } else {
          const lead = which === 'back' ? 0 : vh;
          offset = lead + vpRect.top / m;
        }

        view.style.width = `${vw}px`;
        view.style.left = `${(w * screen.width - vw * k) / 2}px`;
        view.style.transform = `scale(${k}) translateY(${-offset}px)`;

        /* Al final, y nunca antes de medir: copiar estilos no obliga a
           recalcular el layout, pero leer una posición después de haberlos
           escrito sí, y saldría caro en cada fotograma. */
        if (realEl && embEl) reflect(realEl, embEl, which);
        if (which === 'next') {
          const rc = document.querySelector('main .capabilities');
          const ec = view.querySelector('.capabilities');
          if (rc && ec) reflect(rc, ec, 'caps');
        }
      }
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      pairs.forEach((entry) => entry.watch?.disconnect());
      pairs.clear();
    };
  }, [anchorEl, choreography, live, reflect, screen]);

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

        <div className="laptop-screen__viewport" ref={viewportRef}>
          <div className="laptop-screen__view" ref={viewRef}>
            {live && variant === 'back' ? (
              <>
                <FaqSection embedded />
                <div className="laptop-screen__gap" />
              </>
            ) : null}

            {live && variant !== 'back' ? (
              <>
                <div className="laptop-screen__gap" />
                <ProjectCarousel embedded />
                <CapabilitiesSection embedded />
              </>
            ) : null}
          </div>
        </div>
      </div>

      <span className="laptop-screen__cursor" ref={cursorRef} aria-hidden="true">
        <svg viewBox="0 0 12 18" width="22" height="33">
          <path d="M1 1 L1 14.4 L4.5 11.2 L6.9 16.6 L9.3 15.5 L6.9 10.3 L11 10.1 Z"
            fill="#ffffff" stroke="#0b1020" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      </span>

      <span className="laptop-screen__glass" aria-hidden="true" />
    </>
  );
}
