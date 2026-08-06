import { useEffect, useRef } from 'react';

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeIn = (t) => t * t * t;

/** Mapea un valor dentro de un tramo a 0..1. */
const span = (v, a, b) => clamp01((v - a) / Math.max(1e-6, b - a));

/* Reposo en el hero. A la derecha si hay sitio; en cuanto el layout se
   apila, centrada y más pequeña, o se salía por el borde. */
/* La posición ya no va a mano: sale del hueco que el hero le reserva, así
   que la laptop cae siempre junto a la frase y el clic la encuentra donde se
   la ve. Aquí solo queda el tamaño y el giro. */
const REST_WIDE = { x: 0, y: 0, z: 0, scale: 1.52, rotY: -0.42, rotX: 0.06 };
const REST_MID = { x: 0, y: 0, z: 0, scale: 1.3, rotY: -0.4, rotX: 0.06 };
const REST_NARROW = { x: 0, y: 0, z: 0, scale: 0.98, rotY: -0.3, rotX: 0.08 };

const restFor = (w) => (w >= 1180 ? REST_WIDE : w >= 900 ? REST_MID : REST_NARROW);

/* Teléfono: la laptop entera y de frente mientras se abre la ventana, antes
   del zoom. Es la pose que pidió verse completa. */
const SHOW_NARROW = { x: 0, y: 0, z: 0, scale: 1.5, rotY: -0.1, rotX: 0.04 };

/* Lejos y de lado: la pose a la que se va al final, ya pequeña. */
const AWAY = { x: -0.55, y: 0.05, z: -3.2, scale: 0.95, rotY: -0.55, rotX: 0.12 };

/**
 * Coreografía de la laptop.
 *
 *   1. Hero        flota quieta, sin seguir al cursor
 *   2. Entrada     todo a negro, la laptop se acerca hasta que su pantalla
 *                  cubre el viewport, y entonces se abre la ventana del
 *                  navegador desde la barra de tareas hasta llenarla: al
 *                  terminar, esa ventana se funde con la web de verdad
 *   3. Dentro      oculta; el bucle de dibujo se apaga
 *   4. Salida      la ventana se cierra, vuelve el escritorio y la laptop se
 *                  aleja hasta irse; aparece el contacto
 *
 * En teléfono el orden cambia a propósito: primero se ve la laptop entera
 * con la ventana abriéndose en su pantalla, y solo después entra el zoom,
 * rápido pero visible.
 *
 * `focus` es cuánto se acerca a cubrir la pantalla y `osWindow` cuánto está
 * abierta la ventana. La pose de «cubriendo» no se fija aquí: la calcula la
 * escena con el tamaño real de la pantalla del modelo y el viewport.
 *
 * Los dos tramos son elementos reales del documento (#zoom-in y #zoom-out),
 * así que el recorrido es explícito y no depende de adivinar alturas.
 */
export function useLaptopChoreography() {
  const state = useRef({
    visible: true,
    opacity: 1,
    veil: 0,
    power: 0,
    inside: 0,
    focus: 0,
    /* Cuánto pasa de «la pantalla entera a la vista» a «la pantalla tapa el
       viewport». Separarlo de `focus` es lo que permite que la ventana se
       abra con la pantalla completa delante y no ya recortada. */
    fill: 0,
    osWindow: 0,
    /* El cursor yendo al lanzador y pulsándolo. */
    pointer: 0,
    osVariant: 'next',
    anchor: 0,
    anchorX: 0,
    progress: 0,
    phase: 'hero',
    ...REST_WIDE,
  });

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const s = state.current;
      const y = window.scrollY || document.documentElement.scrollTop;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      const gapIn = document.getElementById('zoom-in');
      const gapOut = document.getElementById('zoom-out');
      if (!gapIn || !gapOut) return;

      const inTop = gapIn.getBoundingClientRect().top + y;
      const inLen = gapIn.offsetHeight;
      const outTop = gapOut.getBoundingClientRect().top + y;
      const outLen = gapOut.offsetHeight;

      /* La entrada empieza cuando el tramo asoma por abajo. */
      const enter = span(y, inTop - vh * 0.75, inTop + inLen - vh * 0.1);
      const exit = span(y, outTop - vh * 0.85, outTop + outLen - vh * 0.15);

      const narrow = window.innerWidth < 900;
      const REST = restFor(window.innerWidth);

      /* La laptop se ancla al hueco que el hero le reserva, en los dos ejes y
         en cualquier ancho. Antes la pose iba a mano en unidades de mundo, y
         eso tenía dos costes: en tableta caía descolocada, y el clic —que lo
         recoge ese hueco— no estaba donde se veía la laptop. Se guarda en
         fracciones de pantalla y la escena lo pasa a mundo, que es quien
         conoce la cámara.

         En vertical se sigue el hueco de cerca porque está debajo del titular
         y taparlo sería peor. En horizontal la laptop se queda a media altura
         y apenas acompaña al scroll: se pedía que no se fuera hacia arriba
         mientras se recorre el hero. */
      const box = document.getElementById('hero-viewport');
      if (box) {
        const r = box.getBoundingClientRect();
        const limit = narrow ? 0.85 : 0.16;
        s.anchor = Math.max(-limit, Math.min(limit, (r.top + r.height / 2) / vh - 0.5));
        s.anchorX = Math.max(-0.85, Math.min(0.85, (r.left + r.width / 2) / vw - 0.5));
      } else {
        s.anchor = 0;
        s.anchorX = 0;
      }

      if (exit > 0) {
        /* ---- Salida: la ventana se cierra y la laptop se va ------------ */
        s.phase = 'exit';
        s.progress = exit;
        /* Al salir la ventana enseña lo que se deja atrás: las preguntas. */
        s.osVariant = 'back';
        s.anchor = 0;
        s.anchorX = 0;
        Object.assign(s, AWAY);

        if (narrow) {
          /* Zoom hacia fuera de golpe y ya se ve la laptop entera. */
          s.opacity = Math.min(span(exit, 0, 0.05), 1 - span(exit, 0.9, 1));
          s.veil = exit < 0.88 ? Math.min(1, exit / 0.05) : 1 - span(exit, 0.88, 1);
          s.focus = 1 - easeOut(span(exit, 0.02, 0.16));
          s.fill = s.focus;
          s.pointer = 0;
          s.osWindow = 1 - easeInOut(span(exit, 0.22, 0.46));
          s.power = Math.max(0, 1 - Math.abs(exit - 0.16) / 0.09);
          Object.assign(s, SHOW_NARROW);
          /* Ya cerrada la ventana, se aleja de verdad. */
          const leave = easeInOut(span(exit, 0.5, 0.9));
          s.x = SHOW_NARROW.x + (AWAY.x - SHOW_NARROW.x) * leave;
          s.y = SHOW_NARROW.y + (AWAY.y - SHOW_NARROW.y) * leave;
          s.z = SHOW_NARROW.z + (AWAY.z - SHOW_NARROW.z) * leave;
          s.scale = SHOW_NARROW.scale + (AWAY.scale - SHOW_NARROW.scale) * leave;
          s.rotY = SHOW_NARROW.rotY + (AWAY.rotY - SHOW_NARROW.rotY) * leave;
          s.rotX = SHOW_NARROW.rotX + (AWAY.rotX - SHOW_NARROW.rotX) * leave;
        } else {
          s.opacity = Math.min(span(exit, 0, 0.08), 1 - span(exit, 0.9, 1));
          s.veil = exit < 0.88 ? Math.min(1, span(exit, 0.05, 0.13)) : 1 - span(exit, 0.88, 1);
          /* Mismo camino que a la entrada pero del revés: primero la pantalla
             se despega del viewport y se ve entera, y solo entonces se cierra
             la ventana. Cerrarla estando aún recortada era lo que hacía que no
             se leyera como una aplicación cerrándose. */
          s.fill = 1 - easeInOut(span(exit, 0.04, 0.2));
          s.osWindow = 1 - easeInOut(span(exit, 0.22, 0.46));
          s.focus = 1 - easeInOut(span(exit, 0.5, 0.92));
          s.pointer = 0;
          s.power = Math.max(0, 1 - Math.abs(exit - 0.5) / 0.07);
        }
        s.inside = 0;
      } else if (enter > 0) {
        /* ---- Entrada: cubre, abre la ventana y se funde con la web ----- */
        s.phase = 'enter';
        s.progress = enter;
        /* Al entrar enseña lo que continúa: el carrusel y las capacidades. */
        s.osVariant = 'next';

        if (narrow) {
          s.anchor = 0;
          Object.assign(s, SHOW_NARROW);
          s.veil = enter < 0.7 ? span(enter, 0, 0.12) : 1 - span(enter, 0.7, 0.77);
          s.pointer = span(enter, 0.06, 0.18);
          s.osWindow = easeOut(span(enter, 0.18, 0.52));
          /* El zoom entra tarde y corto: rápido, pero se ve. */
          s.focus = easeIn(span(enter, 0.55, 0.76));
          s.fill = s.focus;
          s.power = Math.max(0, 1 - Math.abs(enter - 0.56) / 0.06);
          /* En vertical, cubriendo del todo solo cabe un trozo de la ventana:
             el relevo con la página real entra en cuanto el zoom aprieta, no
             después, para no quedarse en ese primer plano ilegible. */
          s.opacity = 1 - span(enter, 0.71, 0.8);
          s.inside = span(enter, 0.78, 1);
        } else {
          Object.assign(s, REST);
          s.anchor = 0;
          s.anchorX = 0;
          s.veil = enter < 0.88 ? span(enter, 0, 0.14) : 1 - span(enter, 0.88, 0.94);
          /* La laptop se acerca hasta que su pantalla se ve entera y centrada,
             y ahí se para. Antes seguía hasta recortar el viewport y la ventana
             se abría sobre un escritorio ya cortado por los bordes. */
          s.focus = easeInOut(span(enter, 0.04, 0.4));
          /* El cursor va al lanzador y lo pulsa; la ventana sale de ahí. */
          s.pointer = span(enter, 0.4, 0.54);
          s.osWindow = easeOut(span(enter, 0.54, 0.76));
          /* Y solo al final la pantalla termina de comerse el viewport. */
          s.fill = easeInOut(span(enter, 0.76, 0.9));
          s.power = Math.max(0, 1 - Math.abs(enter - 0.52) / 0.05);
          /* Fundido corto: si se alarga, la maqueta de la ventana se lee como
             un fantasma encima del contenido real. */
          s.opacity = 1 - span(enter, 0.9, 0.96);
          s.inside = span(enter, 0.93, 1);
        }
      } else {
        /* ---- Hero ------------------------------------------------------ */
        s.phase = 'hero';
        s.progress = 0;
        s.veil = 0;
        s.power = 0;
        s.opacity = 1;
        s.inside = 0;
        s.focus = 0;
        s.fill = 0;
        s.pointer = 0;
        s.osWindow = 0;
        Object.assign(s, REST);
      }

      /* Entre los dos tramos seguimos "dentro" de la pantalla. */
      if (s.phase !== 'hero' && enter >= 1 && exit <= 0) s.inside = 1;

      s.visible = s.opacity > 0.012;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return state;
}
