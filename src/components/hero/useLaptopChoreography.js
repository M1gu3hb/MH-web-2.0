import { useEffect, useRef } from 'react';

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const easeIn = (t) => t * t * t;

/**
 * Coreografía de la laptop a lo largo del scroll.
 *
 *   1. Hero          flota a la derecha y sigue al cursor
 *   2. Antes de      se acerca de golpe a la cámara, como si entráramos
 *      Servicios     por la pantalla; al llegar, desaparece
 *   3. Cuerpo        oculta (el canvas deja de pintarse)
 *   4. Contacto      vuelve muy cerca y se aleja hasta desvanecerse antes
 *                    de que la sección la tape
 *
 * Devuelve un ref mutable que la escena lee en cada frame: no provoca
 * renders de React durante el scroll.
 */
export function useLaptopChoreography() {
  const state = useRef({
    visible: true,
    opacity: 1,
    x: 2.15,
    y: -0.1,
    z: 0,
    scale: 1,
    spin: 0,
    tilt: 0,
    phase: 'hero',
  });

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const doc = document.documentElement;
      const vh = window.innerHeight;
      const y = window.scrollY || doc.scrollTop;

      const hero = document.getElementById('inicio');
      const servicios = document.getElementById('servicios');
      const contacto = document.getElementById('contacto');
      if (!hero || !servicios || !contacto) return;

      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const serviciosTop = servicios.offsetTop;
      const contactoTop = contacto.offsetTop;

      const s = state.current;

      /* ---- Zambullida hacia la pantalla ------------------------------ */
      const diveStart = heroBottom - vh * 0.95;
      const diveEnd = serviciosTop - vh * 0.25;
      const dive = clamp01((y - diveStart) / Math.max(1, diveEnd - diveStart));

      /* ---- Regreso en contacto --------------------------------------- */
      const backStart = contactoTop - vh * 0.9;
      const backEnd = contactoTop + vh * 0.5;
      const back = clamp01((y - backStart) / Math.max(1, backEnd - backStart));

      if (back > 0 && back < 1) {
        /* Aparece pegada a la cámara y se aleja hasta irse. */
        const e = easeInOut(back);
        s.phase = 'return';
        s.z = 6.4 - e * 9.2;
        s.x = 0.35 - e * 3.4;
        s.y = -0.25 + e * 0.9;
        s.scale = 1.5 - e * 0.55;
        s.spin = e * 1.5;
        s.tilt = -0.12 + e * 0.2;
        /* Entra rápido, se mantiene y se desvanece al final. */
        s.opacity = Math.min(clamp01(back / 0.16), clamp01((1 - back) / 0.28));
      } else if (dive > 0) {
        /* Se acerca a la cámara acelerando y se apaga al atravesarla. */
        const e = easeIn(dive);
        s.phase = 'dive';
        s.z = e * 8.6;
        s.x = 2.15 - e * 2.15;
        s.y = -0.1 + e * 0.18;
        s.scale = 1 + e * 1.9;
        s.spin = e * 0.55;
        s.tilt = e * 0.16;
        s.opacity = clamp01(1 - Math.max(0, dive - 0.62) / 0.3);
      } else {
        /* Reposo en el hero, con una flotación mínima. */
        s.phase = 'hero';
        s.z = 0;
        s.x = 2.15;
        s.y = -0.1;
        s.scale = 1;
        s.spin = 0;
        s.tilt = 0;
        s.opacity = 1;
      }

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
