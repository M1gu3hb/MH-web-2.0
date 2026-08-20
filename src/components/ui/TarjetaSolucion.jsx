/**
 * ============================================================
 * TARJETA DE SOLUCIÓN
 * ============================================================
 *
 * Sustituye a la tarjeta plana de la primera iteración.
 *
 * La diferencia importante no es estética: dentro de cada tarjeta vive la
 * MAQUETA REAL del servicio —la misma que ya existía en
 * `components/mockups/ServiceScreens.jsx`— en lugar de un icono. El visitante
 * no lee «hago puntos de venta»: ve una caja con su ticket y su teclado.
 * Demostrar cuesta lo mismo que afirmar y convence mucho más.
 *
 * CÓMO SE MUESTRA LA MAQUETA
 * La maqueta está pensada para ocupar una pantalla entera, así que se pinta
 * a su tamaño natural dentro de un marco y se escala con `transform`. Se
 * escala, no se encoge: encogerla reflowaría todo su contenido y los textos
 * pequeños se romperían. Con `scale` el navegador la trata como una textura.
 *
 * INTERACCIÓN
 * · Puntero fino: la tarjeta se inclina hacia el cursor y el halo del acento
 *   sigue la posición. Es la reacción que tenía el sitio de producción.
 * · Táctil: no hay hover, así que la maqueta ya se ve entera desde el
 *   principio y la tarjeta entera es el enlace. Ninguna información depende
 *   de pasar el cursor.
 * · `prefers-reduced-motion`: sin inclinación ni halo, solo el cambio de
 *   borde. La tarjeta sigue funcionando igual.
 */

import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import {
  AutomationScreen,
  CrmScreen,
  PosScreen,
  RestauranteScreen,
  SoftwareScreen,
  WebsiteScreen,
} from '../mockups/ServiceScreens';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* Qué maqueta le toca a cada servicio. */
const MAQUETAS = {
  web: WebsiteScreen,
  sistemas: PosScreen,
  crm: AutomationScreen,
  software: SoftwareScreen,
  restaurantes: RestauranteScreen,
};

/* Cuánto se reduce cada maqueta dentro del marco. La de restaurantes y la
   del CRM llevan más aire porque su contenido es más ancho. */
const ESCALAS = {
  web: 0.52,
  sistemas: 0.52,
  crm: 0.46,
  software: 0.52,
  restaurantes: 0.5,
};

export function TarjetaSolucion({ servicio, indice = 0 }) {
  const Maqueta = MAQUETAS[servicio.id] ?? WebsiteScreen;
  const escala = ESCALAS[servicio.id] ?? 0.5;
  const sinMovimiento = useReducedMotion();
  const caja = useRef(null);
  const [giro, setGiro] = useState(null);

  const alMover = useCallback(
    (e) => {
      if (sinMovimiento || !caja.current) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      const b = caja.current.getBoundingClientRect();
      const x = (e.clientX - b.left) / b.width;
      const y = (e.clientY - b.top) / b.height;
      setGiro({ x, y });
    },
    [sinMovimiento]
  );

  const alSalir = useCallback(() => setGiro(null), []);

  const estilo = {
    '--acento': servicio.acento,
    '--escala': escala,
    '--retardo': `${indice * 90}ms`,
  };
  if (giro) {
    estilo['--gx'] = `${(giro.x - 0.5) * 2}`;
    estilo['--gy'] = `${(giro.y - 0.5) * 2}`;
    estilo['--luz-x'] = `${giro.x * 100}%`;
    estilo['--luz-y'] = `${giro.y * 100}%`;
  }

  return (
    <article
      ref={caja}
      className={`solucion ${giro ? 'is-viva' : ''}`}
      style={estilo}
      onPointerMove={alMover}
      onPointerLeave={alSalir}
    >
      <Link to={servicio.ruta} className="solucion__enlace">
        <span className="solucion__halo" aria-hidden="true" />

        {/* La maqueta es decorativa para un lector de pantalla: lo que
            cuenta ya está escrito debajo en texto. */}
        <span className="solucion__marco" aria-hidden="true">
          <span className="solucion__lienzo">
            <Maqueta />
          </span>
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
    </article>
  );
}
