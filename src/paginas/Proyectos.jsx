/**
 * /proyectos — el portfolio como activo comercial.
 *
 * El filtro solo aparece si hay categorías con contenido de verdad. Un
 * filtro que devuelve cero resultados es peor que no tener filtro: hace
 * pensar que el sitio está roto.
 */

import { useMemo, useState } from 'react';
import {
  BotonPrincipal,
  BotonSecundario,
  CabeceraPagina,
  CierreCTA,
  Contenedor,
  Seccion,
  TarjetaProyecto,
} from '../components/ui';
import { Reveal } from '../components/reactbits';
import { Seo, nodoMigas, nodoPagina } from '../lib/seo';
import { CATEGORIAS, INVITACION, PROYECTOS, rutaProyecto } from '../content/proyectos';
import { DOMINIO, RUTAS } from '../config/rutas';

const MIGAS = [
  { nombre: 'Inicio', path: RUTAS.inicio },
  { nombre: 'Proyectos', path: RUTAS.proyectos },
];

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
        entrada="Ninguno es una maqueta de portafolio. Son proyectos entregados, y los que están en línea llevan su enlace para que los abras."
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

      <Seccion>
        <Contenedor>
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
                </button>
              ))}
            </div>
          )}

          {/* La retícula son H3. Sin un H2 encima, el documento salta de H1 a
              H3 y un lector de pantalla pierde el nivel. El título ya lo dice
              el H1, así que este va solo para la estructura. */}
          <h2 className="rb-visually-hidden">Todos los proyectos</h2>

          <p className="filtros__conteo" role="status">
            {visibles.length} {visibles.length === 1 ? 'proyecto' : 'proyectos'}
          </p>

          <div className="rejilla-proyectos">
            {visibles.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i, 4) * 0.06}>
                <TarjetaProyecto proyecto={p} ruta={rutaProyecto(p.slug)} />
              </Reveal>
            ))}

            {/* La invitación cierra la retícula: no es un proyecto, es el CTA
                con la forma de los demás para que la cuadrícula no se corte. */}
            <Reveal delay={0.1}>
              <article className="tarjeta-proyecto tarjeta-proyecto--invitacion" style={{ '--acento': INVITACION.acento }}>
                <div className="tarjeta-proyecto__imagen">
                  <img src={INVITACION.imagen} alt="" aria-hidden="true" loading="lazy" width="760" height="480" />
                </div>
                <div className="tarjeta-proyecto__cuerpo">
                  <p className="tarjeta-proyecto__industria">{INVITACION.tipo}</p>
                  <h3 className="tarjeta-proyecto__nombre">{INVITACION.nombre}</h3>
                  <p className="tarjeta-proyecto__resumen">{INVITACION.resumen}</p>
                  <BotonPrincipal to={RUTAS.contacto}>Cuéntame qué necesitas</BotonPrincipal>
                </div>
              </article>
            </Reveal>
          </div>
        </Contenedor>
      </Seccion>

      <CierreCTA
        titulo="¿Viste alguno que se parezca a lo que necesitas?"
        cuerpo="Dime cuál y qué tiene tu negocio de distinto. Con eso te digo qué costaría algo así para ti."
        servicio="otro"
      />
    </>
  );
}
