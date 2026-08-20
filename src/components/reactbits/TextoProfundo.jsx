/**
 * ============================================================
 * TEXTO PROFUNDO
 * ============================================================
 *
 * Adaptado de `DepthText` de React Bits (reactbits.dev, MIT + Commons
 * Clause). La técnica que se toma de allí es apilar N copias del mismo texto
 * separadas en Z, tintando cada capa un poco más hacia el color del fondo,
 * de modo que el conjunto se lee como tipografía extruida.
 *
 * POR QUÉ ESTE COMPONENTE Y NO OTRO EFECTO DE TEXTO
 *
 * Porque es exactamente la técnica del símbolo de la marca. `Logo3D` ya
 * construye el monograma apilando catorce capas con perspectiva, y este
 * componente aplica ese mismo procedimiento a una palabra. No es un efecto
 * traído de fuera: es la gramática visual que el sitio ya tenía, llevada al
 * único sitio donde la tipografía es tan grande que aguanta relieve.
 *
 * QUÉ SE CAMBIÓ
 *
 * 1. Color. Del violeta del ejemplo al par de la marca: cara en plata
 *    (#c0c5cc) y profundidad en azul (#0846c8). El relieve es azul porque
 *    en Morphiq el azul es lo que está debajo de las cosas.
 *
 * 2. Multilínea. El original es `white-space: nowrap` y una sola palabra.
 *    Aquí acepta varias líneas, porque el sitio lo necesita para un cierre
 *    de dos líneas.
 *
 * 3. Capas según el dispositivo. 28 con puntero fino, 12 en táctil. Cada
 *    capa es un nodo de texto más en el DOM, y con un cuerpo de 150 px eso
 *    se nota al componer la página.
 *
 * 4. Pausas. El original mantiene un rAF girando la pieza en bucle aunque
 *    esté fuera de pantalla. Aquí se para al salir del viewport y con la
 *    pestaña oculta, y el giro automático se apaga: la pieza solo responde
 *    al cursor. Un cierre que se mueve solo compite con el propio mensaje.
 *
 * 5. Accesibilidad. Las capas de relieve son `aria-hidden` y solo la cara
 *    lleva el texto real, para que un lector de pantalla no lea la misma
 *    palabra veintiocho veces.
 */

import { useEffect, useMemo, useRef } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const tope = (v, min, max) => Math.min(Math.max(v, min), max);

export function TextoProfundo({
  texto,
  capas,
  profundidad = 2.1,
  cara = '#d8dde4',
  fondo = '#0846c8',
  inclinacion = 6,
  suavizado = 0.12,
  perspectiva = 1100,
  className = '',
}) {
  const raiz = useRef(null);
  const escena = useRef(null);
  const sinMovimiento = useReducedMotion();
  const punteroFino = useMediaQuery('(hover: hover) and (pointer: fine)');

  const total = tope(Math.round(capas ?? (punteroFino ? 28 : 12)), 2, 48);

  const pila = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => {
        const indice = total - i;
        const avance = total <= 1 ? 1 : indice / total;
        const suave = avance * avance;
        const mezcla = Math.round((1 - suave) * 70 + 5);
        return {
          indice,
          color: `color-mix(in srgb, ${cara} ${mezcla}%, ${fondo})`,
          transform: `translateZ(${-indice * profundidad}px)`,
        };
      }),
    [total, cara, fondo, profundidad]
  );

  useEffect(() => {
    const nodo = raiz.current;
    const pieza = escena.current;
    if (!nodo || !pieza) return undefined;

    const base = { x: -inclinacion * 0.3, y: inclinacion * 0.38 };
    const aplicar = (x, y) => {
      pieza.style.transform = `rotateX(${x.toFixed(3)}deg) rotateY(${y.toFixed(3)}deg)`;
    };

    /* Con movimiento reducido, o sin puntero fino, la pieza se queda en su
       inclinación de reposo. Sigue teniendo relieve —eso es composición, no
       animación— pero no se mueve ni gasta un cuadro. */
    if (sinMovimiento || !punteroFino) {
      aplicar(base.x, base.y);
      return undefined;
    }

    let raf = 0;
    let visible = false;
    let pestanaViva = !document.hidden;
    const actual = { ...base };
    const meta = { ...base };

    function alMover(e) {
      const r = nodo.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const x = tope((e.clientX - (r.left + r.width / 2)) / (r.width * 0.8), -1, 1);
      const y = tope((e.clientY - (r.top + r.height / 2)) / (r.height * 0.8), -1, 1);
      meta.x = base.x - y * inclinacion;
      meta.y = base.y + x * inclinacion;
    }

    function alSalir() {
      meta.x = base.x;
      meta.y = base.y;
    }

    function paso() {
      actual.x += (meta.x - actual.x) * suavizado;
      actual.y += (meta.y - actual.y) * suavizado;
      aplicar(actual.x, actual.y);
      raf = requestAnimationFrame(paso);
    }

    function arrancar() {
      if (raf) return;
      raf = requestAnimationFrame(paso);
    }
    function parar() {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    }
    function reevaluar() {
      if (visible && pestanaViva) arrancar();
      else parar();
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        reevaluar();
      },
      { rootMargin: '100px' }
    );
    io.observe(nodo);

    function alCambiarPestana() {
      pestanaViva = !document.hidden;
      reevaluar();
    }

    aplicar(base.x, base.y);
    window.addEventListener('pointermove', alMover, { passive: true });
    window.addEventListener('pointerleave', alSalir, { passive: true });
    window.addEventListener('blur', alSalir);
    document.addEventListener('visibilitychange', alCambiarPestana);

    return () => {
      parar();
      io.disconnect();
      window.removeEventListener('pointermove', alMover);
      window.removeEventListener('pointerleave', alSalir);
      window.removeEventListener('blur', alSalir);
      document.removeEventListener('visibilitychange', alCambiarPestana);
    };
  }, [sinMovimiento, punteroFino, inclinacion, suavizado]);

  return (
    <span
      ref={raiz}
      className={`texto-profundo ${className}`}
      style={{ '--perspectiva': `${perspectiva}px`, '--relieve': fondo }}
    >
      <span ref={escena} className="texto-profundo__escena">
        {pila.map((capa) => (
          <span
            key={capa.indice}
            aria-hidden="true"
            className="texto-profundo__capa"
            style={{ color: capa.color, transform: capa.transform }}
          >
            {texto}
          </span>
        ))}
        <span className="texto-profundo__cara">{texto}</span>
      </span>
    </span>
  );
}
