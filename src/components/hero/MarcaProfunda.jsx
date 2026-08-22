import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * ============================================================
 * LA MARCA COMPLETA, CON PROFUNDIDAD
 * ============================================================
 *
 * En vertical el hero no enseña el símbolo suelto: enseña el lockup entero
 * —símbolo, MorpHq y ASTRAL MORPHIQ SYSTEMS—, el mismo que aparece en la
 * pantalla de arranque. En un formato alto hay sitio para presentar la marca
 * completa, y presentarla completa una vez vale más que repetir el símbolo.
 *
 * El movimiento es el mismo que ya usa `Logo3D`, en su versión corta: la
 * pieza gira siguiendo el dedo y vuelve sola al soltar. No hay capas ni
 * escena: es UNA imagen dentro de una caja con perspectiva, así que cuesta
 * un `transform` por fotograma y nada más.
 *
 * TRES DECISIONES QUE NO SON OBVIAS
 *
 * · El giro se persigue con interpolación, no se aplica directo. Puesto
 *   directo, el dedo lo mueve a tirones porque los eventos de puntero no
 *   llegan a ritmo de fotograma. Con la persecución al 0.12 el objeto pesa,
 *   que es justo lo que hace que se lea como profundidad y no como un truco.
 * · El bucle se apaga solo cuando llega. Un `requestAnimationFrame` corriendo
 *   para siempre detrás de un logo quieto es batería tirada.
 * · Los oyentes son pasivos. En teléfono el mismo dedo que inclina el logo
 *   está haciendo scroll: si el oyente no fuera pasivo, el navegador tendría
 *   que esperar a ver si alguien llama a `preventDefault` antes de mover la
 *   página, y el scroll se sentiría pegajoso.
 *
 * Con `prefers-reduced-motion` no hay giro ni oyentes: queda la marca quieta,
 * que es la información. Se degrada el movimiento, nunca el contenido.
 */

const GIRO_X = 16; /* grados a los lados */
const GIRO_Y = 12; /* grados arriba y abajo, menos: de canto se lee peor */

export function MarcaProfunda({ className = '' }) {
  const caja = useRef(null);
  const pieza = useRef(null);
  const sinMovimiento = useReducedMotion();

  useEffect(() => {
    if (sinMovimiento) return undefined;
    const zona = caja.current;
    const objeto = pieza.current;
    if (!zona || !objeto) return undefined;

    let reloj = 0;
    let objetivo = [0, 0];
    const actual = [0, 0];

    const pinta = () => {
      actual[0] += (objetivo[0] - actual[0]) * 0.12;
      actual[1] += (objetivo[1] - actual[1]) * 0.12;
      objeto.style.transform = `rotateY(${actual[0].toFixed(2)}deg) rotateX(${actual[1].toFixed(2)}deg)`;
      const llegó =
        Math.abs(objetivo[0] - actual[0]) < 0.04 && Math.abs(objetivo[1] - actual[1]) < 0.04;
      reloj = llegó ? 0 : requestAnimationFrame(pinta);
    };

    const arrancar = () => {
      if (!reloj) reloj = requestAnimationFrame(pinta);
    };

    const alMover = (evento) => {
      const r = zona.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const x = (evento.clientX - r.left) / r.width - 0.5;
      const y = (evento.clientY - r.top) / r.height - 0.5;
      objetivo = [x * GIRO_X * 2, -y * GIRO_Y * 2];
      arrancar();
    };

    const alSoltar = () => {
      objetivo = [0, 0];
      arrancar();
    };

    zona.addEventListener('pointermove', alMover, { passive: true });
    zona.addEventListener('pointerleave', alSoltar, { passive: true });
    zona.addEventListener('pointerup', alSoltar, { passive: true });
    zona.addEventListener('pointercancel', alSoltar, { passive: true });

    return () => {
      cancelAnimationFrame(reloj);
      zona.removeEventListener('pointermove', alMover);
      zona.removeEventListener('pointerleave', alSoltar);
      zona.removeEventListener('pointerup', alSoltar);
      zona.removeEventListener('pointercancel', alSoltar);
    };
  }, [sinMovimiento]);

  return (
    <div ref={caja} className={`marca-profunda ${className}`.trim()}>
      <div ref={pieza} className="marca-profunda__pieza">
        <img
          className="marca-profunda__arte"
          src="/marca/lockup-apilado.webp"
          alt=""
          width="720"
          height="787"
          fetchPriority="high"
        />
        <span className="marca-profunda__brillo" aria-hidden="true" />
      </div>
      <span className="rb-visually-hidden">Morphiq. Astral Morphiq Systems</span>
    </div>
  );
}
