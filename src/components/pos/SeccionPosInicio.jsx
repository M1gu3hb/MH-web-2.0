/**
 * ============================================================
 * MORPHIQPOS EN LA HOME
 * ============================================================
 *
 * Lo primero que aparece debajo del hero. No es una tarjeta más de la
 * rejilla de servicios: es el producto de la casa, y se presenta como una
 * marca con su propio escenario.
 *
 * QUÉ LA HACE DISTINTA DEL RESTO DE LA HOME
 *   · el fondo es un campo de caracteres que se enciende cerca del cursor
 *   · la pantalla del sistema llega inclinada y se endereza conforme bajas
 *     —atada al scroll, sin fijar nada—, y dentro va el sistema funcionando
 *   · lleva su marca: «MorphiqPOS», no «punto de venta»
 *
 * RENDIMIENTO
 * La home es la entrada más frecuente y su LCP costó bajarlo. Aquí no entra
 * three.js: el campo es un solo shader con `ogl`, que la home ya carga, y
 * tanto él como las pantallas del sistema se montan cuando la sección se
 * acerca a la pantalla, no antes.
 */

import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion as Motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Check } from 'lucide-react';

import { BotonPrincipal, BotonSecundario } from '../ui';
import { Titular } from '../motion';
import { Reveal } from '../reactbits';
import { CampoAscii } from './CampoAscii';
import { MarcaPos } from './MarcaPos';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { POS_INICIO } from '../../content/morphiqpos';
import { RUTAS, contactoCon } from '../../config/rutas';

/* Las pantallas del sistema pesan lo suyo y están debajo del primer
   pantallazo: viajan en su propio trozo y se piden cuando la sección se
   acerca. La home no las paga al arrancar. */
const Carrete = lazy(() => import('./Carrete').then((m) => ({ default: m.Carrete })));

/* El hueco que ocupa el carrete mientras llega. Mide lo mismo que él —la
   pantalla en 16:10 y la fila de pestañas— para que nada salte al montarlo. */
function Hueco() {
  return (
    <div className="carrete" aria-hidden="true">
      <div className="carrete__pantalla" />
      <div className="carrete__pestanas carrete__pestanas--hueco" />
    </div>
  );
}

function conResalte(linea, resalte) {
  const i = linea.indexOf(resalte);
  if (i === -1) return linea;
  return (
    <>
      {linea.slice(0, i)}
      <em className="statement__acento">{resalte}</em>
      {linea.slice(i + resalte.length)}
    </>
  );
}

export function SeccionPosInicio() {
  const sinMovimiento = useReducedMotion();
  const seccion = useRef(null);
  const escenario = useRef(null);
  const [cerca, setCerca] = useState(false);

  /* El campo ASCII se monta cuando la sección está a una pantalla de
     distancia. Antes de eso no existe ni su contexto WebGL. */
  useEffect(() => {
    const nodo = seccion.current;
    if (!nodo) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setCerca(true);
          io.disconnect();
        }
      },
      { rootMargin: '100% 0px' }
    );
    io.observe(nodo);
    return () => io.disconnect();
  }, []);

  /* La pantalla se endereza con el scroll: entra acostada y termina de pie
     cuando su centro pasa por el centro de la ventana. */
  const { scrollYProgress } = useScroll({ target: escenario, offset: ['start 0.95', 'start 0.3'] });
  const suave = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });
  const giro = useTransform(suave, [0, 1], [26, 0]);
  const escala = useTransform(suave, [0, 1], [0.86, 1]);
  const sube = useTransform(suave, [0, 1], [70, 0]);
  const brillo = useTransform(suave, [0, 1], [0.55, 1]);

  return (
    <section ref={seccion} className="pos-inicio" id="morphiqpos" aria-labelledby="pos-inicio-titulo">
      <div className="pos-inicio__fondo" aria-hidden="true">
        {cerca && <CampoAscii fuerza={0.62} densidad={0.5} celda={15} />}
      </div>

      <div className="contenedor contenedor--amplio pos-inicio__reparto">
        <div className="pos-inicio__texto">
          <Reveal>
            <p className="pos-inicio__eyebrow">
              <span>[</span> {POS_INICIO.eyebrow} <span>]</span>
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <MarcaPos etiqueta="p" className="marca-pos--grande" />
          </Reveal>
          <Titular
            as="h2"
            className="pos-inicio__titulo"
            lineas={POS_INICIO.lineas.map((l) => (
              <span key={l} id={l === POS_INICIO.lineas[0] ? 'pos-inicio-titulo' : undefined}>
                {conResalte(l, POS_INICIO.resalte)}
              </span>
            ))}
          />
          <Reveal delay={0.2}>
            <p className="pos-inicio__entrada">{POS_INICIO.entrada}</p>
            <ul className="pos-inicio__puntos">
              {POS_INICIO.puntos.map((p) => (
                <li key={p}>
                  <Check size={15} aria-hidden="true" /> {p}
                </li>
              ))}
            </ul>
            <div className="pos-inicio__acciones">
              <BotonPrincipal to={RUTAS.morphiqpos} grande>
                Conocer MorphiqPOS
              </BotonPrincipal>
              <BotonSecundario to={contactoCon('sistema')} grande>
                Pedir una demostración
              </BotonSecundario>
            </div>
          </Reveal>
        </div>

        <div ref={escenario} className="pos-inicio__escenario">
          <Motion.div
            className="pos-inicio__aparato"
            style={sinMovimiento ? undefined : { rotateX: giro, scale: escala, y: sube, opacity: brillo }}
          >
            {cerca ? (
              <Suspense fallback={<Hueco />}>
                <Carrete />
              </Suspense>
            ) : (
              <Hueco />
            )}
          </Motion.div>
        </div>
      </div>
    </section>
  );
}
