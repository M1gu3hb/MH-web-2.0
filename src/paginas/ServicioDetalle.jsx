/**
 * Las cinco páginas de servicio salen de aquí.
 *
 * Cada bloque se pinta solo si el contenido lo trae, así que una página
 * puede tener «¿qué es un CRM?» y otra no sin que haya cinco componentes
 * casi iguales. El orden de los bloques está pensado como una conversación
 * de venta: primero te reconozco el problema, luego te enseño qué cambia,
 * luego qué se puede construir, luego cuánto cuesta, luego pruebas de que
 * lo he hecho antes, y al final resuelvo tus dudas.
 */

import { useLocation } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Check } from 'lucide-react';
import {
  Acordeon,
  BotonPrincipal,
  BotonSecundario,
  CabeceraPagina,
  CierreCTA,
  Contenedor,
  Seccion,
  TarjetaPlan,
  TarjetaProyecto,
  TituloSeccion,
  contactoCon,
} from '../components/ui';
import { Reveal } from '../components/reactbits';
import { Cascada, Cortina, Escala, Lateral, Secuencia } from '../components/motion';
import {
  AutomationScreen,
  CrmScreen,
  PosScreen,
  RestauranteScreen,
  SoftwareScreen,
  WebsiteScreen,
} from '../components/mockups/ServiceScreens';
import { Seo, nodoMigas, nodoPagina, nodoPreguntas, nodoServicio } from '../lib/seo';
import { PAGINAS_SERVICIO } from '../content/servicios';
import { PLANES } from '../config/pricing';
import { PROYECTOS, rutaProyecto } from '../content/proyectos';
import { RUTAS } from '../config/rutas';
import NoEncontrada from './NoEncontrada';

/* La maqueta que preside cada página de servicio. Es la misma familia que
   se usa en las tarjetas de la home, así que el visitante que hizo clic
   reconoce dónde ha llegado. */
const MAQUETA_DE = {
  web: WebsiteScreen,
  sistemas: PosScreen,
  crm: CrmScreen,
  software: SoftwareScreen,
  restaurantes: RestauranteScreen,
};

export default function ServicioDetalle() {
  const { pathname } = useLocation();
  const pagina = PAGINAS_SERVICIO[pathname];

  if (!pagina) return <NoEncontrada />;

  const Maqueta = MAQUETA_DE[pagina.id];

  const proyectos = (pagina.proyectos ?? [])
    .map((slug) => PROYECTOS.find((p) => p.slug === slug))
    .filter(Boolean);

  const grafo = [
    nodoPagina({ path: pathname, title: pagina.seo.title, description: pagina.seo.description }),
    nodoMigas(pagina.migas),
    nodoServicio({
      id: pagina.id,
      nombre: pagina.hero.titulo,
      tipo: pagina.schema.tipo,
      descripcion: pagina.schema.descripcion,
      path: pathname,
    }),
    /* El FAQPage solo se emite porque las preguntas están visibles en la
       página. Marcar preguntas que el visitante no ve es justo lo que
       Google considera abuso del dato estructurado. */
    ...(pagina.faq?.length ? [nodoPreguntas({ path: pathname, preguntas: pagina.faq })] : []),
  ];

  return (
    <>
      <Seo
        title={pagina.seo.title}
        description={pagina.seo.description}
        path={pathname}
        grafo={grafo}
      />

      <CabeceraPagina
        migas={pagina.migas}
        eyebrow={pagina.hero.eyebrow}
        titulo={pagina.hero.titulo}
        resalte={pagina.hero.resalte}
        entrada={pagina.hero.entrada}
        acento={pagina.acento}
        maqueta={Maqueta ? <Maqueta /> : null}
        acciones={
          <>
            <BotonPrincipal to={contactoCon(pagina.hero.servicio)} grande>
              Cotizar mi proyecto
            </BotonPrincipal>
            <BotonSecundario to={RUTAS.proyectos} grande>
              Ver proyectos
            </BotonSecundario>
          </>
        }
      />

      {/* ---- ¿Qué es? Solo donde la palabra asusta ---- */}
      {pagina.quees && (
        <Seccion tono="elevado">
          <Contenedor ancho="medio">
            {/* CORTINA. El explicador se descubre tras una máscara: es el
                primer bloque después de la cabecera y conviene que se lea
                como que se abre, no como que llega deslizándose. */}
            <Cortina>
              <div className="explicador">
                <h2 className="explicador__titulo">{pagina.quees.titulo}</h2>
                <p className="explicador__cuerpo">{pagina.quees.cuerpo}</p>
                <p className="explicador__remate">{pagina.quees.remate}</p>
              </div>
            </Cortina>
          </Contenedor>
        </Seccion>
      )}

      {/* ---- El espejo: te reconozco el problema antes de venderte nada ---- */}
      {pagina.problemas && (
        <Seccion>
          <Contenedor>
            <TituloSeccion titulo={pagina.problemas.titulo} />
            {/* SECUENCIA. «¿Esto te suena?» funciona si los problemas van
                cayendo uno a uno mientras bajas: cada línea es un golpe, y
                verlos aparecer de golpe los convierte en una lista. */}
            <Secuencia as="ul" className="problemas" paso={0.045}>
              {pagina.problemas.lista.map((p) => (
                <li key={p} className="problemas__item">
                  <ArrowRight size={16} aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </Secuencia>
            {pagina.problemas.nota && (
              <Reveal>
                <p className="problemas__nota">{pagina.problemas.nota}</p>
              </Reveal>
            )}
          </Contenedor>
        </Seccion>
      )}

      {/* ---- Qué cambia ---- */}
      {pagina.beneficios && (
        <Seccion tono="elevado">
          <Contenedor>
            <TituloSeccion titulo={pagina.beneficios.titulo} />
            {/* CASCADA. Bloques hermanos del mismo peso: escalonado corto. */}
            <Cascada className="beneficios" paso={0.055}>
              {pagina.beneficios.lista.map((b) => (
                <article key={b.titulo} className="beneficio">
                  <h3>{b.titulo}</h3>
                  <p>{b.cuerpo}</p>
                </article>
              ))}
            </Cascada>
          </Contenedor>
        </Seccion>
      )}

      {/* ---- Las piezas del ecosistema (restaurantes) ---- */}
      {pagina.ecosistema && (
        <Seccion tono="elevado">
          <Contenedor>
            <TituloSeccion titulo={pagina.ecosistema.titulo} entrada={pagina.ecosistema.entrada} />
            {/* ESCALA. Las piezas del ecosistema son objetos: llegan desde
                el fondo, no desde abajo. */}
            <div className="piezas">
              {pagina.ecosistema.piezas.map((pieza, i) => (
                <Escala key={pieza.nombre} delay={i * 0.05} desde={0.95}>
                  <article className="pieza">
                    <h3>{pieza.nombre}</h3>
                    <p>{pieza.cuerpo}</p>
                  </article>
                </Escala>
              ))}
            </div>
          </Contenedor>
        </Seccion>
      )}

      {/* ---- Qué se puede construir ---- */}
      {pagina.capacidades && (
        <Seccion>
          <Contenedor>
            <TituloSeccion titulo={pagina.capacidades.titulo} entrada={pagina.capacidades.entrada} />
            {/* LATERAL ALTERNO. Los grupos entran desde lados opuestos:
                es lo que rompe la monotonía de una página larga sin que
                ninguna sección tenga que ser distinta de las demás. */}
            <div className="capacidades">
              {pagina.capacidades.grupos.map((grupo, i) => (
                <Lateral key={grupo.nombre} desde={i % 2 ? 'derecha' : 'izquierda'} delay={i * 0.04} distancia={5}>
                  <article className="capacidad">
                    <h3 className="capacidad__nombre">{grupo.nombre}</h3>
                    <ul>
                      {grupo.items.map((item) => (
                        <li key={item}>
                          <Check size={14} aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Lateral>
              ))}
            </div>
            {pagina.capacidades.nota && (
              <Reveal>
                <p className="capacidades__nota">{pagina.capacidades.nota}</p>
              </Reveal>
            )}
          </Contenedor>
        </Seccion>
      )}

      {/* ---- Automatización (CRM) ---- */}
      {pagina.automatizacion && (
        <Seccion tono="elevado">
          <Contenedor>
            <TituloSeccion titulo={pagina.automatizacion.titulo} entrada={pagina.automatizacion.entrada} />
            {/* SECUENCIA otra vez, y aquí es lo correcto: son reglas de
                automatización, o sea pasos, y verlas encenderse una tras
                otra es literalmente lo que hace el sistema del que hablan. */}
            <Secuencia as="ul" className="ejemplos" paso={0.04}>
              {pagina.automatizacion.ejemplos.map((e) => (
                <li key={e} className="ejemplos__item">{e}</li>
              ))}
            </Secuencia>
          </Contenedor>
        </Seccion>
      )}

      {/* ---- Páginas editables (web) ---- */}
      {pagina.editable && (
        <Seccion tono="elevado">
          <Contenedor ancho="medio">
            <Cortina>
              <div className="explicador">
                <h2 className="explicador__titulo">{pagina.editable.titulo}</h2>
                <p className="explicador__cuerpo">{pagina.editable.cuerpo}</p>
                <p className="explicador__remate">{pagina.editable.remate}</p>
              </div>
            </Cortina>
          </Contenedor>
        </Seccion>
      )}

      {/* ---- Cómo se construye (software) ---- */}
      {pagina.proceso && (
        <Seccion>
          <Contenedor>
            <TituloSeccion titulo={pagina.proceso.titulo} />
            <Secuencia as="ol" className="pasos" paso={0.05}>
              {pagina.proceso.pasos.map((paso, i) => (
                <li key={paso.titulo} className="paso">
                  <span className="paso__numero" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3>{paso.titulo}</h3>
                  <p>{paso.cuerpo}</p>
                </li>
              ))}
            </Secuencia>
          </Contenedor>
        </Seccion>
      )}

      {/* ---- Aviso honesto (facturación en restaurantes) ---- */}
      {pagina.aviso && (
        <Seccion>
          <Contenedor ancho="estrecho">
            {/* El icono lleva clase propia para que el CSS pueda darle su
                golpe de atención sin depender de `.aviso > svg`, que se
                rompe en cuanto alguien añade otro icono aquí. Un golpe y
                quieto: esto es honestidad sobre la facturación, no una
                alarma, y un triángulo ámbar latiendo en bucle convierte una
                decisión de negocio en un banner. El `Reveal` que ya trae el
                bloque no se toca. */}
            <Reveal>
              <aside className="aviso">
                <AlertTriangle size={20} className="aviso__icono" aria-hidden="true" />
                <div>
                  <h2 className="aviso__titulo">{pagina.aviso.titulo}</h2>
                  <p>{pagina.aviso.cuerpo}</p>
                </div>
              </aside>
            </Reveal>
          </Contenedor>
        </Seccion>
      )}

      {/* ---- Precios ---- */}
      {pagina.niveles && (
        <Seccion tono="elevado" id="precios">
          <Contenedor>
            <TituloSeccion titulo={pagina.niveles.titulo} entrada={pagina.niveles.entrada} />
            <div className={`planes planes--${pagina.niveles.planes.length}`}>
              {pagina.niveles.planes.map((clave, i) => (
                <Escala key={clave} delay={i * 0.07} desde={0.96}>
                  <TarjetaPlan plan={PLANES[clave]} detallada servicio={pagina.hero.servicio} />
                </Escala>
              ))}
            </div>
            <Reveal>
              <p className="planes__pie">
                Todos los precios son un punto de partida y se cierran antes de empezar.{' '}
                <a href={RUTAS.precios}>Ver todos los precios</a>
              </p>
            </Reveal>
          </Contenedor>
        </Seccion>
      )}

      {/* ---- Prueba ---- */}
      {proyectos.length > 0 && (
        <Seccion>
          <Contenedor>
            <TituloSeccion
              eyebrow="Trabajo real"
              titulo="Esto ya lo he construido."
              resalte="ya lo he construido"
              entrada="Cada proyecto tiene su caso completo y, cuando está en línea, su enlace para que lo abras."
            />
            <div className="rejilla-proyectos">
              {proyectos.map((p, i) => (
                <Escala key={p.slug} delay={i * 0.07} desde={0.95}>
                  <TarjetaProyecto proyecto={p} ruta={rutaProyecto(p.slug)} />
                </Escala>
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

      {/* ---- Dudas ---- */}
      {pagina.faq && (
        <Seccion tono="elevado">
          <Contenedor ancho="medio">
            <TituloSeccion titulo="Lo que suelen preguntarme" resalte="suelen preguntarme" variante="simple" />
            <Acordeon items={pagina.faq} />
          </Contenedor>
        </Seccion>
      )}

      <CierreCTA
        titulo={pagina.cierre.titulo}
        cuerpo={pagina.cierre.cuerpo}
        servicio={pagina.cierre.servicio}
      />
    </>
  );
}
