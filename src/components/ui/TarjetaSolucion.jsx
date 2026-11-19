/**
 * ============================================================
 * TARJETA DE SOLUCIÓN
 * ============================================================
 *
 * Dentro de cada tarjeta vive una ESCENA del servicio en lugar de un icono:
 * el visitante no lee «hago puntos de venta», ve una caja cobrando.
 * Demostrar cuesta lo mismo que afirmar y convence mucho más.
 *
 * QUÉ CAMBIÓ RESPECTO A LA VERSIÓN ANTERIOR
 * Antes iba aquí la maqueta de la página del servicio, encogida con
 * `scale` y avanzando a saltos cada segundo y medio. Ahora cada tarjeta
 * lleva una escena hecha para este tamaño (`components/escenas`), con un
 * cursor que provoca cada cambio y muelles en todo lo que entra. Las
 * maquetas interactivas siguen donde tienen sentido: en la cabecera de cada
 * página de servicio, donde sí se pueden tocar.
 *
 * LAS TRES ANIMACIONES DE LA TARJETA
 * · Entrada: llega desde abajo, un poco echada hacia atrás, y se endereza
 *   con un muelle. Cada tarjeta sale un instante después de la anterior.
 * · Dentro: la escena, que solo corre cuando se está viendo.
 * · Al acercar el cursor: un foco de luz recorre el borde siguiéndolo, la
 *   tarjeta sube y un barrido cruza el marco. Ya no se inclina: una tarjeta
 *   que cabecea mientras dentro se mueve otra cosa marea.
 *
 * · Táctil: no hay hover y no hace falta; la escena ya cuenta todo y la
 *   tarjeta entera es el enlace.
 * · `prefers-reduced-motion`: sin entrada ni foco, y la escena quieta en
 *   su último cuadro. La tarjeta sigue funcionando igual.
 *
 * RENDIMIENTO
 * Las escenas viajan en su propio trozo y cada una se monta cuando su
 * tarjeta se acerca a la pantalla. La home no las paga al arrancar.
 */

import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion as Motion } from 'motion/react';

import { useReducedMotion } from '../../hooks/useReducedMotion';

const Escena = lazy(() => import('../escenas/escenas'));

export function TarjetaSolucion({ servicio, indice = 0 }) {
  const sinMovimiento = useReducedMotion();
  const caja = useRef(null);
  const [cerca, setCerca] = useState(false);
  const [viva, setViva] = useState(false);

  /* La escena se monta cuando la tarjeta está a media pantalla de entrar. */
  useEffect(() => {
    const nodo = caja.current;
    if (!nodo) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCerca(true);
          io.disconnect();
        }
      },
      { rootMargin: '60% 0px' }
    );
    io.observe(nodo);
    return () => io.disconnect();
  }, []);

  /* El foco se escribe directo en el estilo del nodo, sin pasar por el
     estado: mover el cursor no debe volver a pintar la escena de dentro. */
  const alMover = useCallback(
    (e) => {
      const nodo = caja.current;
      if (sinMovimiento || !nodo || e.pointerType === 'touch') return;
      const b = nodo.getBoundingClientRect();
      nodo.style.setProperty('--luz-x', `${e.clientX - b.left}px`);
      nodo.style.setProperty('--luz-y', `${e.clientY - b.top}px`);
    },
    [sinMovimiento]
  );

  const estilo = { '--acento': servicio.acento };

  return (
    <Motion.article
      ref={caja}
      className={`solucion ${viva ? 'is-viva' : ''}`}
      style={estilo}
      onPointerMove={alMover}
      onPointerEnter={(e) => e.pointerType !== 'touch' && !sinMovimiento && setViva(true)}
      onPointerLeave={() => setViva(false)}
      initial={sinMovimiento ? false : { opacity: 0, y: 56, rotateX: 13, scale: 0.955 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      /* El retardo sigue la columna, no la posición en la lista: en la
         segunda fila las tarjetas vuelven a salir de izquierda a derecha en
         vez de heredar un retardo cada vez más largo. */
      transition={{ type: 'spring', stiffness: 150, damping: 19, mass: 0.9, delay: (indice < 2 ? indice : (indice - 2) % 3) * 0.09 }}
    >
      <Link to={servicio.ruta} className="solucion__enlace">
        <span className="solucion__halo" aria-hidden="true" />

        {/* La escena es decorativa para un lector de pantalla: lo que cuenta
            ya está escrito debajo en texto. */}
        <span className="solucion__marco" aria-hidden="true">
          {cerca && (
            <Suspense fallback={null}>
              <Escena id={servicio.id} />
            </Suspense>
          )}
          <span className="solucion__brillo" />
        </span>

        <span className="solucion__cuerpo">
          <span className="solucion__indice" aria-hidden="true">
            {String(indice + 1).padStart(2, '0')}
          </span>
          <h3 className="solucion__nombre">{servicio.nombre}</h3>
          <p className="solucion__promesa">{servicio.promesa}</p>
          <p className="solucion__para">{servicio.paraTi}</p>
          <span className="solucion__puntos">
            {servicio.puntos.map((punto) => (
              <span key={punto}>{punto}</span>
            ))}
          </span>
          <span className="solucion__ver">
            Ver el servicio
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </span>
      </Link>
    </Motion.article>
  );
}
