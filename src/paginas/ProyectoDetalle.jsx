/**
 * /proyectos/[slug] — el caso completo.
 *
 * Estructura fija: contexto, problema, objetivo, solución, qué se construyó
 * y con qué. El resultado se cuenta en cualitativo porque es lo único que se
 * puede sostener: aquí no hay ni un porcentaje inventado.
 */

import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, Check, ExternalLink } from 'lucide-react';
import {
  BotonPrincipal,
  BotonSecundario,
  Contenedor,
  Migas,
  PortadaProyecto,
  Seccion,
  TarjetaProyecto,
  CierreCTA,
  TituloSeccion,
} from '../components/ui';
import { GlareHover, Reveal, ScrambleText } from '../components/reactbits';
import { Seo, nodoCaso, nodoMigas, nodoPagina } from '../lib/seo';
import { PROYECTOS, proyectoPorSlug, rutaProyecto } from '../content/proyectos';
import { RUTAS } from '../config/rutas';
import NoEncontrada from './NoEncontrada';

export default function ProyectoDetalle() {
  const { slug } = useParams();
  const proyecto = proyectoPorSlug(slug);

  if (!proyecto) return <NoEncontrada />;

  const ruta = rutaProyecto(proyecto.slug);
  const title = `${proyecto.tituloSeo ?? `${proyecto.nombre}: ${proyecto.tipo}`} | Morphiq`;
  const description = proyecto.resumen;

  const migas = [
    { nombre: 'Inicio', path: RUTAS.inicio },
    { nombre: 'Proyectos', path: RUTAS.proyectos },
    { nombre: proyecto.nombre, path: ruta },
  ];

  const relacionados = PROYECTOS.filter(
    (p) => p.slug !== proyecto.slug && p.categorias.some((c) => proyecto.categorias.includes(c))
  ).slice(0, 2);

  const grafo = [
    nodoPagina({ path: ruta, title, description }),
    nodoMigas(migas),
    nodoCaso({ proyecto, path: ruta }),
  ];

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={ruta}
        /* Sin `image`: la tarjeta social del sitio mide 1200×630 y la maqueta
           del caso 760×753. Declarar unas medidas y entregar otras es lo que
           hace que el enlace salga recortado al compartirlo. La maqueta sí va
           en el JSON-LD, que no impone formato. */
        grafo={grafo}
      />

      {/* ---- Cabecera del caso ---- */}
      <header className="caso-cabecera" style={{ '--acento': proyecto.acento }}>
        <Contenedor>
          <Migas ruta={migas} />
          <div className="caso-cabecera__reparto">
            <div>
              <p className="caso-cabecera__industria">{proyecto.industria}</p>
              <h1 className="caso-cabecera__titulo">{proyecto.nombre}</h1>
              <p className="caso-cabecera__tipo">{proyecto.tipo}</p>
              <p className="caso-cabecera__resumen">{proyecto.resumen}</p>

              {/* El índice va en el `style` y no en una clase por posición:
                  el número de etiquetas cambia de caso a caso y el CSS lo
                  lee de `--i` para escalonar la llegada. Es la lista que la
                  persona escanea para decidir si este caso se parece a lo
                  suyo, así que se entrega en orden de lectura. */}
              <ul className="caso-cabecera__etiquetas">
                {proyecto.etiquetas.map((e, i) => (
                  <li key={e} style={{ '--i': i }}>
                    {e}
                  </li>
                ))}
              </ul>

              {proyecto.url && (
                <a className="tactile-button tactile-button--glow" href={proyecto.url} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} aria-hidden="true" />
                  {proyecto.etiquetaEnlace ?? 'Ver proyecto'}
                </a>
              )}
            </div>

            {/* Los productos propios no tienen una pantalla que valga como
                retrato —una ventana de terminal no cuenta nada—, así que en vez
                de fingir una captura llevan portada tipográfica. */}
            {/* La misma lámina de luz que ya lleva esta maqueta cuando es
                tarjeta en el índice (`ui/index.jsx`). Hoy tiene gesto en
                pequeño y lo pierde al ampliarse, que es al revés de lo que
                uno espera. Va con `as="figure"` para no meter un div de más
                entre la rejilla del reparto y su hijo. */}
            <GlareHover as="figure" className="caso-cabecera__imagen">
              {proyecto.imagen ? (
                <img
                  src={proyecto.imagen}
                  alt={`Interfaz del proyecto ${proyecto.nombre}`}
                  width="760"
                  height="480"
                  fetchpriority="high"
                />
              ) : (
                <PortadaProyecto proyecto={proyecto} />
              )}
            </GlareHover>
          </div>
        </Contenedor>
      </header>

      {/* ---- Resultado, en una línea ---- */}
      <Seccion tono="acento" className="caso-resultado">
        <Contenedor ancho="estrecho">
          <Reveal>
            {/* Solo la etiqueta, nunca la frase: la frase es la conclusión
                del caso, ya la trae el `Reveal` y ya está tratada como el
                momento de la página; apilarle un segundo gesto encima sería
                animar lo que ya se mueve. La etiqueta está quieta, es corta
                y es la firma del sitio: hace de golpe de atención para que
                la frase se lea con peso. El H1 no se toca — es texto de
                primera pantalla en once páginas. */}
            <p className="caso-resultado__etiqueta">
              <ScrambleText text="El resultado" trigger="view" />
            </p>
            <p className="caso-resultado__frase">{proyecto.resultado}</p>
          </Reveal>
        </Contenedor>
      </Seccion>

      {/* ---- La narrativa ---- */}
      <Seccion>
        <Contenedor ancho="estrecho">
          <div className="caso-cuerpo">
            <Reveal>
              <section className="caso-bloque">
                <h2>El contexto</h2>
                <p>{proyecto.contexto}</p>
              </section>
            </Reveal>

            <Reveal>
              <section className="caso-bloque">
                <h2>El problema</h2>
                <ul className="caso-lista caso-lista--problema">
                  {proyecto.problema.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <section className="caso-bloque">
                <h2>El objetivo</h2>
                <p>{proyecto.objetivo}</p>
              </section>
            </Reveal>

            <Reveal>
              <section className="caso-bloque">
                <h2>La solución</h2>
                <ul className="caso-lista caso-lista--solucion">
                  {proyecto.solucion.map((s) => (
                    <li key={s}>
                      <Check size={15} aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <section className="caso-bloque">
                <h2>Qué se construyó</h2>
                <ul className="caso-piezas">
                  {proyecto.construido.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </section>
            </Reveal>

            {proyecto.tecnologias?.length > 0 && (
              <Reveal>
                <section className="caso-bloque">
                  <h2>Con qué está hecho</h2>
                  <ul className="caso-tecnologias">
                    {proyecto.tecnologias.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}
          </div>
        </Contenedor>
      </Seccion>

      {/* ---- Relacionados ---- */}
      {relacionados.length > 0 && (
        <Seccion tono="elevado">
          <Contenedor>
            <TituloSeccion titulo="Proyectos parecidos" />
            <div className="rejilla-proyectos">
              {relacionados.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.07}>
                  <TarjetaProyecto proyecto={p} ruta={rutaProyecto(p.slug)} />
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="seccion__pie">
                <BotonSecundario to={RUTAS.proyectos}>Ver todos los proyectos</BotonSecundario>
              </div>
            </Reveal>
          </Contenedor>
        </Seccion>
      )}

      <CierreCTA
        titulo={`¿Quieres algo como ${proyecto.nombre}?`}
        cuerpo="Cuéntame qué tiene tu negocio de parecido y de distinto. Con eso te digo qué costaría."
        servicio="otro"
      />
    </>
  );
}
