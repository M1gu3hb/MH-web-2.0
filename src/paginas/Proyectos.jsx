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
  anchoDeProyecto,
} from '../components/ui';
import { Reveal } from '../components/reactbits';
import { Escala } from '../components/motion';
import { Seo, nodoMigas, nodoPagina } from '../lib/seo';
import { CATEGORIAS, PROYECTOS, rutaProyecto } from '../content/proyectos';
import { DOMINIO, RUTAS } from '../config/rutas';
import { ABOUT } from '../content';

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
          <div className="rejilla-proyectos rejilla-proyectos--indice">
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
                  <TarjetaProyecto proyecto={p} ruta={rutaProyecto(p.slug)} formato={formato} />
                </Escala>
              );
            })}
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
