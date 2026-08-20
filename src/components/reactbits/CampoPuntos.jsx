/**
 * ============================================================
 * CAMPO DE PUNTOS
 * ============================================================
 *
 * Adaptado de `DotField` de React Bits (reactbits.dev, MIT + Commons Clause,
 * uso comercial permitido). Lo que se conserva de allí es la idea y la
 * matemática del abultamiento: una retícula de puntos que se aparta del
 * cursor con una caída cuadrática y vuelve a su sitio con amortiguación.
 *
 * QUÉ SE CAMBIÓ, Y POR QUÉ
 *
 * 1. Color. El original viene en violeta (#a855f7). Aquí los puntos se
 *    pintan con un degradado del azul de marca a la plata, y el halo del
 *    cursor es el azul pleno. La retícula tiene que leerse como el fondo
 *    técnico de Morphiq, no como el ejemplo de una librería.
 *
 * 2. Pausas. El original deja un `requestAnimationFrame` corriendo para
 *    siempre. Aquí se para cuando el bloque sale de pantalla y cuando la
 *    pestaña se oculta. Un fondo que nadie está viendo no tiene por qué
 *    gastar batería.
 *
 * 3. Puerta de entrada. Sin puntero fino, con `prefers-reduced-motion` o en
 *    pantallas pequeñas no se monta nada: el componente devuelve `null` y
 *    el bloque se queda con su degradado de CSS, que ya es correcto por sí
 *    solo. Toda la información sigue estando: esto es decoración.
 *
 * 4. El seguimiento del cursor pasa de `pageX/pageY` con desplazamiento
 *    acumulado a coordenadas relativas al propio lienzo. Con scroll suave
 *    (Lenis) el cálculo del original se desincroniza y el halo se queda a
 *    varios cientos de píxeles del cursor.
 */

import { memo, useEffect, useRef } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const DOS_PI = Math.PI * 2;

export const CampoPuntos = memo(function CampoPuntos({
  radio = 1.4,
  separacion = 22,
  radioCursor = 420,
  fuerza = 54,
  desde = 'rgba(79, 149, 255, 0.42)',
  hasta = 'rgba(192, 197, 204, 0.16)',
  halo = 'rgba(10, 102, 255, 0.30)',
  radioHalo = 220,
  className = '',
}) {
  const lienzo = useRef(null);
  const haloRef = useRef(null);
  const puntos = useRef([]);
  const cursor = useRef({ x: -9999, y: -9999, px: -9999, py: -9999, v: 0 });
  const raf = useRef(null);
  const caja = useRef({ w: 0, h: 0 });
  const opacidadHalo = useRef(0);
  const enganche = useRef(0);
  const idHalo = useRef(`campo-puntos-${Math.random().toString(36).slice(2, 9)}`);

  const sinMovimiento = useReducedMotion();
  const punteroFino = useMediaQuery('(min-width: 900px) and (pointer: fine)');
  const activo = punteroFino && !sinMovimiento;

  useEffect(() => {
    if (!activo) return undefined;
    const cv = lienzo.current;
    if (!cv) return undefined;

    const ctx = cv.getContext('2d', { alpha: true });
    /* El DPR se topa en 1.5: son puntos de 1.4 px, y a 3x se paga el triple
       de píxeles por una nitidez que nadie va a distinguir. */
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const contenedor = cv.parentElement;
    let temporizador;
    let visible = true;
    let pestanaViva = !document.hidden;

    function construir(w, h) {
      const salto = radio + separacion;
      const cols = Math.floor(w / salto);
      const filas = Math.floor(h / salto);
      const padX = (w % salto) / 2;
      const padY = (h % salto) / 2;
      const lista = new Array(filas * cols);
      let i = 0;
      for (let f = 0; f < filas; f++) {
        for (let c = 0; c < cols; c++) {
          const ax = padX + c * salto + salto / 2;
          const ay = padY + f * salto + salto / 2;
          lista[i++] = { ax, ay, sx: ax, sy: ay };
        }
      }
      puntos.current = lista;
    }

    function medir() {
      const r = contenedor.getBoundingClientRect();
      caja.current = { w: r.width, h: r.height };
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      cv.style.width = `${r.width}px`;
      cv.style.height = `${r.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      construir(r.width, r.height);
    }

    function alRedimensionar() {
      clearTimeout(temporizador);
      temporizador = setTimeout(medir, 120);
    }

    /* Coordenadas relativas al lienzo, leídas del propio evento. Es lo que
       mantiene el halo pegado al cursor aunque el scroll sea interpolado. */
    function alMover(e) {
      const r = cv.getBoundingClientRect();
      cursor.current.x = e.clientX - r.left;
      cursor.current.y = e.clientY - r.top;
    }

    function alSalir() {
      cursor.current.x = -9999;
      cursor.current.y = -9999;
    }

    function pintar() {
      const lista = puntos.current;
      const m = cursor.current;
      const { w, h } = caja.current;

      /* Velocidad del cursor, suavizada: es lo que decide cuánto se abulta
         la retícula. Quieto, la retícula está quieta. */
      const dx = m.px - m.x;
      const dy = m.py - m.y;
      m.v += (Math.hypot(dx, dy) - m.v) * 0.4;
      if (m.v < 0.001) m.v = 0;
      m.px = m.x;
      m.py = m.y;

      const objetivo = Math.min(m.v / 5, 1);
      enganche.current += (objetivo - enganche.current) * 0.06;
      if (enganche.current < 0.001) enganche.current = 0;
      const eng = enganche.current;

      opacidadHalo.current += (eng - opacidadHalo.current) * 0.08;
      if (haloRef.current) {
        haloRef.current.setAttribute('cx', m.x);
        haloRef.current.setAttribute('cy', m.y);
        haloRef.current.style.opacity = opacidadHalo.current;
      }

      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, desde);
      grad.addColorStop(1, hasta);
      ctx.fillStyle = grad;

      const cr = radioCursor;
      const crSq = cr * cr;
      const r = radio / 2;

      ctx.beginPath();
      for (let i = 0; i < lista.length; i++) {
        const d = lista[i];
        const ex = m.x - d.ax;
        const ey = m.y - d.ay;
        const distSq = ex * ex + ey * ey;

        if (distSq < crSq && eng > 0.01) {
          const dist = Math.sqrt(distSq);
          const t = 1 - dist / cr;
          const empuje = t * t * fuerza * eng;
          const ang = Math.atan2(ey, ex);
          d.sx += (d.ax - Math.cos(ang) * empuje - d.sx) * 0.15;
          d.sy += (d.ay - Math.sin(ang) * empuje - d.sy) * 0.15;
        } else {
          d.sx += (d.ax - d.sx) * 0.1;
          d.sy += (d.ay - d.sy) * 0.1;
        }

        ctx.moveTo(d.sx + r, d.sy);
        ctx.arc(d.sx, d.sy, r, 0, DOS_PI);
      }
      ctx.fill();

      raf.current = requestAnimationFrame(pintar);
    }

    function arrancar() {
      if (raf.current != null) return;
      raf.current = requestAnimationFrame(pintar);
    }

    function parar() {
      if (raf.current == null) return;
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }

    function reevaluar() {
      if (visible && pestanaViva) arrancar();
      else parar();
    }

    const observador = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        reevaluar();
      },
      { rootMargin: '120px' }
    );
    observador.observe(contenedor);

    function alCambiarPestana() {
      pestanaViva = !document.hidden;
      reevaluar();
    }

    medir();
    window.addEventListener('resize', alRedimensionar);
    window.addEventListener('pointermove', alMover, { passive: true });
    window.addEventListener('pointerleave', alSalir, { passive: true });
    document.addEventListener('visibilitychange', alCambiarPestana);
    reevaluar();

    return () => {
      parar();
      observador.disconnect();
      clearTimeout(temporizador);
      window.removeEventListener('resize', alRedimensionar);
      window.removeEventListener('pointermove', alMover);
      window.removeEventListener('pointerleave', alSalir);
      document.removeEventListener('visibilitychange', alCambiarPestana);
    };
  }, [activo, radio, separacion, radioCursor, fuerza, desde, hasta]);

  if (!activo) return null;

  return (
    <div className={`campo-puntos ${className}`} aria-hidden="true">
      <canvas ref={lienzo} />
      <svg>
        <defs>
          <radialGradient id={idHalo.current}>
            <stop offset="0%" stopColor={halo} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle ref={haloRef} cx="-9999" cy="-9999" r={radioHalo} fill={`url(#${idHalo.current})`} style={{ opacity: 0 }} />
      </svg>
    </div>
  );
});
