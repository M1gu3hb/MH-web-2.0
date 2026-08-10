import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* Capas del arte apiladas en Z: las traseras hacen de canto con una versión
   del logo en colores sólidos (los mismos azul, oscuro y plata, pero sin los
   reflejos del frente), y el PNG original queda delante intacto. Es
   profundidad real de composición sin WebGL: el navegador decodifica dos
   bitmaps y compone el resto. */
/* Catorce capas dan un canto precioso en escritorio, pero en teléfono son
   catorce copias del mismo bitmap compuestas en cada fotograma del vaivén:
   se paga en el arranque, que es justo cuando menos sobra. Con siete a doble
   separación el grosor se ve igual y cuesta la mitad. */
const CAPAS_ESCRITORIO = 14;
const CAPAS_TACTIL = 7;
const PASO_ESCRITORIO = 6.5;
const PASO_TACTIL = 13;

/* Al clic no reacciona igual dos veces seguidas: salto, destello metálico,
   una vuelta completa y la firma revelándose debajo, en turno. */
const ACCIONES = ['salto', 'destello', 'giro', 'nombre'];

export function Logo3D() {
  const reduced = useReducedMotion();
  const marco = useRef(null);
  const pila = useRef(null);
  const [accion, setAccion] = useState('');
  const [conNombre, setConNombre] = useState(false);
  const turno = useRef(0);
  const timer = useRef(0);

  /* La inclinación sigue al cursor solo con puntero fino: en táctil el
     seguimiento se siente lento y ahí mandan las animaciones ya hechas. */
  useEffect(() => {
    if (reduced) return undefined;
    if (!window.matchMedia?.('(pointer: fine)').matches) return undefined;
    const el = marco.current;
    const objeto = pila.current;
    if (!el || !objeto) return undefined;

    let raf = 0;
    let objetivo = [0, 0];
    const actual = [0, 0];

    const pinta = () => {
      actual[0] += (objetivo[0] - actual[0]) * 0.09;
      actual[1] += (objetivo[1] - actual[1]) * 0.09;
      objeto.style.transform = `rotateX(${actual[1].toFixed(2)}deg) rotateY(${actual[0].toFixed(2)}deg)`;
      const quieto = Math.abs(objetivo[0] - actual[0]) < 0.03 && Math.abs(objetivo[1] - actual[1]) < 0.03;
      raf = quieto ? 0 : requestAnimationFrame(pinta);
    };

    const onMove = (event) => {
      const caja = el.getBoundingClientRect();
      const x = (event.clientX - caja.left) / caja.width - 0.5;
      const y = (event.clientY - caja.top) / caja.height - 0.5;
      objetivo = [x * 26, -y * 18];
      if (!raf) raf = requestAnimationFrame(pinta);
    };

    const onLeave = () => {
      objetivo = [0, 0];
      if (!raf) raf = requestAnimationFrame(pinta);
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const actuar = () => {
    if (reduced) return;
    const cual = ACCIONES[turno.current % ACCIONES.length];
    turno.current += 1;
    window.clearTimeout(timer.current);

    if (cual === 'nombre') {
      setAccion('');
      setConNombre(true);
      timer.current = window.setTimeout(() => setConNombre(false), 3600);
      return;
    }

    setConNombre(false);
    setAccion('');
    /* Doble rAF: la clase debe soltarse un fotograma para que la misma
       animación pueda volver a dispararse más adelante en el ciclo. */
    requestAnimationFrame(() => requestAnimationFrame(() => setAccion(cual)));
    timer.current = window.setTimeout(() => setAccion(''), cual === 'giro' ? 1600 : 1050);
  };

  const fino = typeof window !== 'undefined' && window.matchMedia?.('(pointer: fine)').matches;
  const total = fino ? CAPAS_ESCRITORIO : CAPAS_TACTIL;
  const PASO_Z = fino ? PASO_ESCRITORIO : PASO_TACTIL;
  const merma = fino ? 0.045 : 0.09;

  const capas = [];
  for (let i = total - 1; i >= 0; i -= 1) capas.push(i);

  return (
    <div
      className={[
        'logo3d',
        accion ? `logo3d--${accion}` : '',
        conNombre ? 'logo3d--nombre' : '',
      ].join(' ').trim()}
      ref={marco}
      onClick={actuar}
    >
      <div className="logo3d__escena">
        <div className="logo3d__pila" ref={pila}>
          {capas.map((i) => (
            <img
              key={i}
              className={`logo3d__capa ${i === 0 ? 'logo3d__capa--frente' : ''}`.trim()}
              style={
                i === 0
                  ? { transform: 'translateZ(0px)' }
                  : {
                      transform: `translateZ(${(-i * PASO_Z).toFixed(1)}px)`,
                      /* El canto se apaga hacia el fondo: es lo que dibuja el
                         grosor cuando la pieza gira. */
                      filter: `brightness(${(0.92 - i * merma).toFixed(3)})`,
                    }
              }
              src={i === 0 ? '/marca/simbolo-v2-md.webp' : '/marca/simbolo-solido.webp'}
              alt=""
              width="600"
              height="607"
              draggable={false}
              fetchPriority={i === 0 ? 'high' : 'low'}
            />
          ))}
          <span className="logo3d__brillo" aria-hidden="true" />
        </div>
      </div>
      <img
        className="logo3d__nombre"
        src="/marca/nombre.webp"
        alt=""
        width="1100"
        height="272"
        draggable={false}
        loading="lazy"
      />
    </div>
  );
}
