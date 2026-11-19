/**
 * ============================================================
 * EL KIT DE LAS DEMOSTRACIONES
 * ============================================================
 *
 * Las cuatro piezas con las que se arman todas las pantallas animadas de
 * MorphiqPOS y las escenas de las tarjetas de servicio:
 *
 *   useGuion   el reloj: una lista de pasos con su duración, que solo corre
 *              cuando la escena se está viendo
 *   Cursor     una flecha (o un dedo) que se mueve y pulsa. Es la regla de
 *              todas las escenas: NADA cambia solo, cada cambio lo provoca
 *              un clic que se ve. Sin eso una interfaz que se mueve sola se
 *              lee como un vídeo; con eso se lee como alguien usándola
 *   Cifra      un número que rueda hasta su valor en vez de saltar
 *   MarcoPos   la carcasa del sistema, que escala con su contenedor
 *
 * Todo respeta `prefers-reduced-motion`: el guion se queda en el paso que
 * mejor se explica solo y nada se mueve.
 */

import { useEffect, useRef, useState } from 'react';
import { motion as Motion } from 'motion/react';

import { useReducedMotion } from '../../hooks/useReducedMotion';
/* La hoja del kit viaja con el kit: quien no monta una pantalla del sistema
   no la descarga. */
import '../../styles/pos-kit.css';

/* ------------------------------------------------------------
   useGuion
   ------------------------------------------------------------
   `duraciones` son los milisegundos que dura cada paso. Al llegar al último
   vuelve al primero. Devuelve `[paso, quieto]`.

   · `activo`  lo apaga desde fuera: en la demostración del día solo corre
               la pantalla que toca, las demás esperan en su primer paso.
   · `ref`     el nodo que se observa. Fuera de pantalla no corre.
   · `quieto`  el paso que se enseña cuando no hay movimiento.
   ------------------------------------------------------------ */
export function useGuion(duraciones, { activo = true, ref, quieto, fijo } = {}) {
  const sinMovimiento = useReducedMotion();
  const [paso, setPaso] = useState(0);
  const [aLaVista, setALaVista] = useState(false);
  const total = duraciones.length;

  useEffect(() => {
    const nodo = ref?.current;
    if (!nodo || typeof IntersectionObserver === 'undefined') {
      setALaVista(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => setALaVista(e.isIntersecting), { threshold: 0.2 });
    io.observe(nodo);
    return () => io.disconnect();
  }, [ref]);

  const corriendo = activo && aLaVista && !sinMovimiento;

  /* Al volver a entrar en escena la historia empieza por el principio: verla
     arrancar a la mitad es verla sin entenderla. */
  useEffect(() => {
    if (corriendo) setPaso(0);
  }, [corriendo]);

  useEffect(() => {
    if (!corriendo) return undefined;
    const reloj = setTimeout(() => setPaso((p) => (p + 1) % total), duraciones[paso] ?? 1200);
    return () => clearTimeout(reloj);
    // `duraciones` es una constante de módulo en todos los usos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corriendo, paso, total]);

  /* `fijo` clava la escena en un paso: es como la usa el personalizador, que
     quiere la pantalla completa y quieta mientras se le cambia la piel. */
  if (fijo != null) return [fijo, true];
  if (sinMovimiento) return [quieto ?? total - 1, true];
  return [paso, !corriendo];
}

/* ------------------------------------------------------------
   armarGuion
   ------------------------------------------------------------
   Convierte una lista de acciones en pasos. Una acción con coordenadas se
   parte en DOS pasos —ir y pulsar— porque el clic tiene que ocurrir cuando
   el cursor ya llegó, no mientras viaja. `marca` nombra el paso en el que
   esa acción queda hecha, para que la pantalla pregunte `ya('cobrado')` en
   vez de comparar contra un número que cambia al tocar el guion.

     { x, y, marca, ir?, pulsar? }   mover el cursor y pulsar
     { espera, marca? }              dejar respirar la escena
   ------------------------------------------------------------ */
export function armarGuion(acciones) {
  const pasos = [];
  const marcas = {};
  let x = 50;
  let y = 50;
  for (const a of acciones) {
    if (a.espera) {
      pasos.push({ x, y, ms: a.espera, clic: false });
    } else {
      x = a.x;
      y = a.y;
      pasos.push({ x, y, ms: a.ir ?? 640, clic: false });
      pasos.push({ x, y, ms: a.pulsar ?? 560, clic: true });
    }
    if (a.marca) marcas[a.marca] = pasos.length - 1;
  }
  return { pasos, marcas, duraciones: pasos.map((p) => p.ms), ultimo: pasos.length - 1 };
}

/* ------------------------------------------------------------
   Cursor
   ------------------------------------------------------------
   `x` e `y` van en porcentaje de la caja que lo contiene. `pulsa` es
   cualquier valor que cambia cuando hay un clic: al cambiar, el cursor se
   hunde, rebota y suelta una onda. Dos muelles distintos para cada eje
   hacen que el recorrido salga curvo, que es como se mueve una mano.
   ------------------------------------------------------------ */
export function Cursor({ x = 50, y = 50, pulsa = 0, dedo = false, oculto = false }) {
  const sinMovimiento = useReducedMotion();
  if (sinMovimiento) return null;

  /* La capa mide lo mismo que la caja y se desplaza con `transform`, en
     porcentaje de sí misma, que es porcentaje de la caja. Animar `left` y
     `top` haría lo mismo recalculando maquetación en cada fotograma; así lo
     mueve el compositor. La punta del cursor es su esquina superior
     izquierda. */
  return (
    <Motion.span
      className={`cursor-demo ${dedo ? 'cursor-demo--dedo' : ''}`}
      aria-hidden="true"
      initial={false}
      animate={{ x: `${x}%`, y: `${y}%`, opacity: oculto ? 0 : 1 }}
      transition={{
        x: { type: 'spring', stiffness: 150, damping: 21, mass: 0.9 },
        y: { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 },
        opacity: { duration: 0.2 },
      }}
    >
      <span key={`onda-${pulsa}`} className={pulsa ? 'cursor-demo__onda is-viva' : 'cursor-demo__onda'} />
      <span key={`punta-${pulsa}`} className={pulsa ? 'cursor-demo__punta is-pulsando' : 'cursor-demo__punta'}>
        {dedo ? null : (
          <svg viewBox="0 0 24 30" width="24" height="30">
            <path
              d="M3 2.5 L3 23.5 L8.6 18.4 L12.3 27 L15.9 25.4 L12.3 17 L20 17 Z"
              fill="#0b0d12"
              stroke="#fff"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </Motion.span>
  );
}

/* ------------------------------------------------------------
   Cifra
   ------------------------------------------------------------
   Rueda del valor anterior al nuevo en vez de saltar. El texto real —el
   valor final— va siempre en un `aria-label`: lo que rueda es decoración.
   ------------------------------------------------------------ */
const formato = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });

export function Cifra({ valor, prefijo = '$', sufijo = '', ms = 520, className = '' }) {
  const sinMovimiento = useReducedMotion();
  const [visto, setVisto] = useState(valor);
  const desde = useRef(valor);

  useEffect(() => {
    if (sinMovimiento) {
      desde.current = valor;
      setVisto(valor);
      return undefined;
    }
    const origen = desde.current;
    const t0 = performance.now();
    let raf = requestAnimationFrame(function paso(ahora) {
      const u = Math.min(1, (ahora - t0) / ms);
      const e = 1 - (1 - u) ** 3;
      const v = origen + (valor - origen) * e;
      desde.current = v;
      setVisto(v);
      if (u < 1) raf = requestAnimationFrame(paso);
    });
    return () => cancelAnimationFrame(raf);
  }, [valor, ms, sinMovimiento]);

  return (
    <span className={`cifra ${className}`} aria-label={`${prefijo}${formato.format(valor)}${sufijo}`}>
      <span aria-hidden="true">
        {prefijo}
        {formato.format(Math.round(visto))}
        {sufijo}
      </span>
    </span>
  );
}

export const pesos = (n) => `$${formato.format(n)}`;

/* ------------------------------------------------------------
   MarcoPos
   ------------------------------------------------------------
   La carcasa del sistema: barra con el nombre del negocio, las secciones y
   quién está en turno. Todo lo de dentro se mide en `em` sobre un cuerpo que
   depende del ancho del contenedor, así que la misma pantalla sirve a 300 px
   en una tarjeta y a 900 en la demostración sin que nada se desencaje.

   Los colores entran por variables (`--pv-*`): es lo que permite que el
   personalizador le cambie la piel entera con seis valores.
   ------------------------------------------------------------ */
export function MarcoPos({
  negocio = 'Tu negocio',
  seccion,
  secciones = ['Mesas', 'Caja', 'Cocina', 'Inventario'],
  turno = 'Caja 1',
  hora = '13:41',
  className = '',
  estilo,
  children,
  refCaja,
  /* Dónde está la acción, en porcentaje del ancho. En un teléfono la
     pantalla del sistema —que es apaisada— no cabe legible: se pinta más
     ancha que su marco y se desplaza para tener siempre a la vista el punto
     donde está el cursor. Es una cámara que sigue al protagonista. */
  foco = 50,
  /* Una pantalla clavada en un paso no tiene cursor que seguir: en teléfono
     se deja deslizar con el dedo. */
  fijo = false,
}) {
  const inicial = (negocio.trim()[0] ?? 'M').toUpperCase();
  return (
    <div ref={refCaja} className={`pv ${fijo ? 'pv--fijo' : ''} ${className}`} style={{ ...estilo, '--foco': foco }}>
      <div className="pv__lienzo">
        <div className="pv__barra">
          <span className="pv__marca">
            <i aria-hidden="true">{inicial}</i>
            <b>{negocio}</b>
          </span>
          <span className="pv__secciones">
            {secciones.map((s) => (
              <span key={s} className={s === seccion ? 'is-activa' : ''}>
                {s}
              </span>
            ))}
          </span>
          <span className="pv__turno">
            {turno} <em>{hora}</em>
          </span>
        </div>
        <div className="pv__cuerpo">{children}</div>
      </div>
    </div>
  );
}
