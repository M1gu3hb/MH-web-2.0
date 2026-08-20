/**
 * ============================================================
 * BORDE ELÉCTRICO
 * ============================================================
 *
 * Adaptado de `ElectricBorder` de React Bits (reactbits.dev, MIT + Commons
 * Clause). Lo que viene de allí es el método: recorrer el perímetro de un
 * rectángulo redondeado punto a punto y desplazar cada punto con ruido de
 * varias octavas, de forma que el trazo tiemble como un arco eléctrico en
 * lugar de como una línea con una animación encima.
 *
 * QUÉ SE CAMBIÓ, Y POR QUÉ
 *
 * 1. Color. El original es violeta (#5227FF). Aquí el valor por defecto es
 *    el azul de marca (#0a66ff): en Morphiq el azul es el único acento de
 *    interfaz, y un borde violeta sería un componente ajeno pegado encima.
 *
 * 2. Coste. El original deja el `requestAnimationFrame` corriendo siempre,
 *    y el bucle recalcula ruido de diez octavas para cada muestra del
 *    perímetro en cada cuadro. Eso en una tarjeta de precios que vive a
 *    mitad de página es gasto puro. Aquí se para fuera de pantalla y con la
 *    pestaña oculta.
 *
 * 3. Degradación honesta. Sin puntero fino, con `prefers-reduced-motion` o
 *    en pantalla pequeña no se monta el lienzo: queda el borde y el halo,
 *    que en CSS ya distinguen la tarjeta destacada de las demás. La señal
 *    —«esta es la opción recomendada»— no depende de la animación.
 *
 * 4. `oklch(from …)` del CSS original se sustituye por variables propias:
 *    la sintaxis relativa todavía no la resuelven todos los navegadores que
 *    este sitio soporta, y donde falla el borde desaparecía entero.
 */

import { useCallback, useEffect, useRef } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* Márgenes del lienzo respecto a la caja: el arco se desplaza hasta 60 px
   hacia fuera, así que el lienzo tiene que ser más grande que el contenido
   o los picos se recortarían contra su propio borde. */
const MARGEN = 60;
const DESPLAZAMIENTO = 60;

export function BordeElectrico({
  children,
  color = '#0a66ff',
  velocidad = 0.75,
  caos = 0.1,
  radio = 20,
  className = '',
  style,
}) {
  const lienzo = useRef(null);
  const caja = useRef(null);
  const raf = useRef(null);
  const t = useRef(0);
  const ultimo = useRef(0);

  const sinMovimiento = useReducedMotion();
  const grande = useMediaQuery('(min-width: 900px) and (pointer: fine)');
  const activo = grande && !sinMovimiento;

  const azar = useCallback((x) => (Math.sin(x * 12.9898) * 43758.5453) % 1, []);

  const ruido2D = useCallback(
    (x, y) => {
      const i = Math.floor(x);
      const j = Math.floor(y);
      const fx = x - i;
      const fy = y - j;
      const a = azar(i + j * 57);
      const b = azar(i + 1 + j * 57);
      const c = azar(i + (j + 1) * 57);
      const d = azar(i + 1 + (j + 1) * 57);
      const ux = fx * fx * (3 - 2 * fx);
      const uy = fy * fy * (3 - 2 * fy);
      return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
    },
    [azar]
  );

  const ruidoOctavas = useCallback(
    (x, tiempo, semilla, amplitudBase) => {
      let y = 0;
      let amplitud = amplitudBase;
      let frecuencia = 10;
      /* Seis octavas, no diez. De la séptima en adelante el aporte cae por
         debajo del grosor de la línea: se paga y no se ve. */
      for (let i = 0; i < 6; i++) {
        const a = i === 0 ? 0 : amplitud;
        y += a * ruido2D(frecuencia * x + semilla * 100, tiempo * frecuencia * 0.3);
        frecuencia *= 1.6;
        amplitud *= 0.7;
      }
      return y;
    },
    [ruido2D]
  );

  /* Un punto del perímetro de un rectángulo redondeado, parametrizado de 0 a
     1. Los cuatro tramos rectos y los cuatro arcos se recorren en orden. */
  const puntoDelBorde = useCallback((p, izq, arr, w, h, r) => {
    const rectoW = w - 2 * r;
    const rectoH = h - 2 * r;
    const arco = (Math.PI * r) / 2;
    const total = 2 * rectoW + 2 * rectoH + 4 * arco;
    let d = p * total;
    const enEsquina = (cx, cy, ini, prog) => ({
      x: cx + r * Math.cos(ini + prog * (Math.PI / 2)),
      y: cy + r * Math.sin(ini + prog * (Math.PI / 2)),
    });

    if (d <= rectoW) return { x: izq + r + d, y: arr };
    d -= rectoW;
    if (d <= arco) return enEsquina(izq + w - r, arr + r, -Math.PI / 2, d / arco);
    d -= arco;
    if (d <= rectoH) return { x: izq + w, y: arr + r + d };
    d -= rectoH;
    if (d <= arco) return enEsquina(izq + w - r, arr + h - r, 0, d / arco);
    d -= arco;
    if (d <= rectoW) return { x: izq + w - r - d, y: arr + h };
    d -= rectoW;
    if (d <= arco) return enEsquina(izq + r, arr + h - r, Math.PI / 2, d / arco);
    d -= arco;
    if (d <= rectoH) return { x: izq, y: arr + h - r - d };
    d -= rectoH;
    return enEsquina(izq + r, arr + r, Math.PI, d / arco);
  }, []);

  useEffect(() => {
    if (!activo) return undefined;
    const cv = lienzo.current;
    const cont = caja.current;
    if (!cv || !cont) return undefined;
    const ctx = cv.getContext('2d');
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let visible = false;
    let pestanaViva = !document.hidden;

    function medir() {
      const r = cont.getBoundingClientRect();
      w = r.width + MARGEN * 2;
      h = r.height + MARGEN * 2;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
    }

    function pintar(ahora) {
      const dt = ultimo.current ? (ahora - ultimo.current) / 1000 : 0;
      ultimo.current = ahora;
      t.current += Math.min(dt, 0.05) * velocidad;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const bw = w - 2 * MARGEN;
      const bh = h - 2 * MARGEN;
      const r = Math.min(radio, Math.min(bw, bh) / 2);
      const perimetro = 2 * (bw + bh) + 2 * Math.PI * r;
      /* Una muestra cada 3 px en vez de cada 2: a un trazo de 1 px de grosor
         la diferencia no se ve, y son un tercio menos de cálculos de ruido
         por cuadro. */
      const muestras = Math.max(48, Math.floor(perimetro / 3));

      ctx.beginPath();
      for (let i = 0; i <= muestras; i++) {
        const p = i / muestras;
        const punto = puntoDelBorde(p, MARGEN, MARGEN, bw, bh, r);
        const nx = ruidoOctavas(p * 8, t.current, 0, caos);
        const ny = ruidoOctavas(p * 8, t.current, 1, caos);
        const x = punto.x + nx * DESPLAZAMIENTO;
        const y = punto.y + ny * DESPLAZAMIENTO;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      raf.current = requestAnimationFrame(pintar);
    }

    function arrancar() {
      if (raf.current != null) return;
      ultimo.current = 0;
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

    const ro = new ResizeObserver(medir);
    ro.observe(cont);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        reevaluar();
      },
      { rootMargin: '80px' }
    );
    io.observe(cont);

    function alCambiarPestana() {
      pestanaViva = !document.hidden;
      reevaluar();
    }
    document.addEventListener('visibilitychange', alCambiarPestana);

    medir();

    return () => {
      parar();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', alCambiarPestana);
    };
  }, [activo, color, velocidad, caos, radio, puntoDelBorde, ruidoOctavas]);

  return (
    <div
      ref={caja}
      className={`borde-electrico ${activo ? 'is-vivo' : ''} ${className}`}
      style={{ '--chispa': color, borderRadius: radio, ...style }}
    >
      {activo && (
        <span className="borde-electrico__lienzo" aria-hidden="true">
          <canvas ref={lienzo} />
        </span>
      )}
      <span className="borde-electrico__capas" aria-hidden="true">
        <span className="borde-electrico__filo" />
        <span className="borde-electrico__halo" />
        <span className="borde-electrico__fondo" />
      </span>
      <div className="borde-electrico__contenido">{children}</div>
    </div>
  );
}
