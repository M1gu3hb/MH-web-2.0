/**
 * /proyectos — el portfolio como activo comercial.
 *
 * El filtro solo aparece si hay categorías con contenido de verdad. Un
 * filtro que devuelve cero resultados es peor que no tener filtro: hace
 * pensar que el sitio está roto.
 */

import { useMemo, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import {
  BotonPrincipal,
  BotonSecundario,
  CabeceraPagina,
  CierreCTA,
  Contenedor,
  Seccion,
  TarjetaProyecto,
  anchoDeProyecto,
} from '../components/ui';
import { Reveal } from '../components/reactbits';
import { Escala } from '../components/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Seo, nodoMigas, nodoPagina } from '../lib/seo';
import { CATEGORIAS, PROYECTOS, rutaProyecto } from '../content/proyectos';
import { DOMINIO, RUTAS } from '../config/rutas';
import { ABOUT } from '../content';

const MIGAS = [
  { nombre: 'Inicio', path: RUTAS.inicio },
  { nombre: 'Proyectos', path: RUTAS.proyectos },
];

/* ------------------------------------------------------------
   El indicador que viaja de un filtro a otro
   ------------------------------------------------------------
   Hasta ahora el estado activo saltaba de un botón a otro en el mismo
   fotograma y nada hacía el viaje: por eso el clic no se sentía, aunque la
   rejilla de abajo sí cambiara. Con `layoutId` la pastilla es UN elemento
   que Motion mueve del botón viejo al nuevo.

   Identificador propio y no el `nav-activo` de la barra: los dos viven en
   la misma pantalla a la vez, y compartirlo haría que Motion intentara
   mover una sola pastilla entre la barra y los filtros.

   El muelle es el mismo 380/32 de la barra —duro y sin rebote—: esto
   acompaña a un cambio que ya ocurrió, y si oscila llega tarde.

   El `is-activo` que ya tiñe el botón no se toca; la pastilla se pinta
   detrás y se suma. */
function IndicadorFiltro() {
  const reducido = useReducedMotion();

  /* Con reduced motion se renderiza la misma pastilla sin `layoutId`:
     aparece de golpe en su sitio. Se degrada el viaje, nunca el dato de
     qué filtro está puesto. */
  if (reducido) return <span className="filtro__pastilla" aria-hidden="true" />;

  return (
    <Motion.span
      className="filtro__pastilla"
      aria-hidden="true"
      layoutId="filtro-activo"
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    />
  );
}

/* ------------------------------------------------------------
   La salida de las tarjetas que el filtro descarta
   ------------------------------------------------------------
   Va DENTRO del `Escala`, no en su lugar: la entrada se queda exactamente
   como estaba y esto solo añade el camino de ida. `AnimatePresence`
   propaga la ausencia hacia abajo, así que el `exit` funciona aunque el
   hueco de la rejilla —que es quien lleva el `--span`— no lo declare.

   150 ms y no más: esto es un apoyo del indicador, no un segundo
   espectáculo. Si dura lo suficiente para mirarlo, el ojo se va a la
   rejilla y se pierde justo lo que se quería que se notara, que es el
   clic. */
function SalidaFiltrada({ children }) {
  const reducido = useReducedMotion();

  /* Con reduced motion sale un `div` pelado: `AnimatePresence` no encuentra
     nada que animar y desmonta en el acto. */
  if (reducido) return <div>{children}</div>;

  return (
    <Motion.div exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.15 }}>
      {children}
    </Motion.div>
  );
}

const TITLE = 'Proyectos: sitios y sistemas construidos | Morphiq';
const DESC =
  'Páginas web, puntos de venta, CRM y software que he construido para negocios reales. Cada caso con su problema, su solución y su enlace.';

export default function Proyectos() {
  const [filtro, setFiltro] = useState('todos');

  /* Solo se ofrecen las categorías que tienen al menos un proyecto. */
  const categorias = useMemo(
    () =>
      CATEGORIAS.filter(
        (c) => c.id === 'todos' || PROYECTOS.some((p) => p.categorias.includes(c.id))
      ),
    []
  );

  const visibles = useMemo(
    () => (filtro === 'todos' ? PROYECTOS : PROYECTOS.filter((p) => p.categorias.includes(filtro))),
    [filtro]
  );

  const grafo = [
    nodoPagina({ path: RUTAS.proyectos, title: TITLE, description: DESC }),
    nodoMigas(MIGAS),
    {
      '@type': 'ItemList',
      '@id': `${DOMINIO}${RUTAS.proyectos}#lista`,
      name: 'Proyectos de Morphiq',
      numberOfItems: PROYECTOS.length,
      itemListElement: PROYECTOS.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.nombre,
        url: `${DOMINIO}${rutaProyecto(p.slug)}`,
      })),
    },
  ];

  return (
    <>
      <Seo title={TITLE} description={DESC} path={RUTAS.proyectos} grafo={grafo} />

      <CabeceraPagina
        migas={MIGAS}
        eyebrow="Trabajo real"
        titulo="Negocios que ya están funcionando con esto."
        resalte="ya están funcionando"
        entrada="Once piezas. Unas son encargos de negocios que hoy trabajan con ellas; otras son producto propio, construido para resolverme algo a mí primero. Ninguna es una maqueta de portafolio, y la que está en línea lleva su enlace para que la abras."
        aparte={
          <ul className="tira-industrias">
            {PROYECTOS.map((p) => (
              <li key={p.slug} style={{ '--acento': p.acento }}>
                <span>{p.industria}</span>
                <strong>{p.nombre}</strong>
              </li>
            ))}
          </ul>
        }
        acciones={
          <>
            <BotonPrincipal to={RUTAS.contacto} grande>
              Quiero algo parecido
            </BotonPrincipal>
            <BotonSecundario to={RUTAS.servicios} grande>
              Ver servicios
            </BotonSecundario>
          </>
        }
      />

      <Seccion className="seccion--portafolio">
        <div className="contenedor contenedor--amplio">
          {categorias.length > 2 && (
            <div className="filtros" role="group" aria-label="Filtrar proyectos por tipo">
              {categorias.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`filtro ${filtro === c.id ? 'is-activo' : ''}`}
                  aria-pressed={filtro === c.id}
                  onClick={() => setFiltro(c.id)}
                >
                  {c.etiqueta}
                  {filtro === c.id && <IndicadorFiltro />}
                </button>
              ))}
            </div>
          )}

          {/* La retícula son H3. Sin un H2 encima, el documento salta de H1 a
              H3 y un lector de pantalla pierde el nivel. El título ya lo dice
              el H1, así que este va solo para la estructura. */}
          <h2 className="rb-visually-hidden">Todos los proyectos</h2>

          {/* Un índice, no un catálogo. Cada pieza recibe un ancho distinto
              del ciclo de doce columnas, así que ninguna fila se repite y la
              página deja de leerse como una cuadrícula de artículos. */}
          {/* Sin el prop `layout` de Motion en la rejilla, a propósito:
              `anchoDeProyecto(i)` reparte el ancho POR POSICIÓN, así que al
              filtrar una pieza de 4 columnas puede pasar a ser la destacada
              de 12. Motion corrige ese cambio de caja con escala más
              contra-escala, y con once tarjetas llenas de texto eso son once
              texturas rasterizadas estirándose a la vez. La recolocación se
              hace de golpe, cuando la salida ya terminó.

              `AnimatePresence` sin `initial={false}`: con eso puesto, los
              hijos se saltarían su animación de montaje y el `Escala` de la
              primera carga —que es de quien es esta rejilla— dejaría de
              entrar. */}
          <div className="rejilla-proyectos rejilla-proyectos--indice">
            <AnimatePresence>
              {visibles.map((p, i) => {
                const ancho = anchoDeProyecto(i);
                const formato = ancho === 12 ? 'destacado' : ancho >= 7 ? 'ancho' : 'normal';
                return (
                  <Escala
                    key={p.slug}
                    delay={Math.min(i, 4) * 0.06}
                    desde={0.96}
                    className="rejilla-proyectos__hueco"
                    style={{ '--span': ancho }}
                  >
                    <SalidaFiltrada>
                      <TarjetaProyecto proyecto={p} ruta={rutaProyecto(p.slug)} formato={formato} />
                    </SalidaFiltrada>
                  </Escala>
                );
              })}
            </AnimatePresence>
          </div>
          <Reveal>
            <aside className="indice-cierre">
              <p className="indice-cierre__texto">
                No todo lo que he construido está aquí. Los sistemas internos de un negocio
                —cajas, inventarios, paneles de dueño— no se pueden enseñar en público, y son
                buena parte del trabajo. Detrás de cada caso hay alguien que decidió confiarme
                el suyo.
              </p>
              <div className="indice-cierre__acciones">
                <BotonPrincipal to={RUTAS.contacto}>Cuéntame qué necesitas</BotonPrincipal>
                <BotonSecundario href={ABOUT.github}>Ver el código en GitHub</BotonSecundario>
              </div>
            </aside>
          </Reveal>
        </div>
      </Seccion>

      <CierreCTA
        titulo="¿Viste alguno que se parezca a lo que necesitas?"
        cuerpo="Dime cuál y qué tiene tu negocio de distinto. Con eso te digo qué costaría algo así para ti."
        servicio="otro"
      />
    </>
  );
}
