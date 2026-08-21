/**
 * La home deja de ser un recorrido de 9 secciones y pasa a ser un
 * distribuidor: responde en pocos segundos qué es Morphiq y manda a cada
 * visitante a lo suyo.
 *
 * El orden contesta, en este orden, las preguntas que se hace alguien que
 * acaba de llegar:
 *   qué hacen → ¿es para mí? → ¿son buenos? → ¿me alcanza? → ¿cómo trabajan?
 *   → ¿quién está detrás? → dudas → me interesa.
 *
 * Cada bloque de la home es un resumen con salida a su página. Nada se
 * cuenta aquí completo: para eso están las páginas.
 */

import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import {
  Acordeon,
  BotonPrincipal,
  BotonSecundario,
  Contenedor,
  Precio,
  Seccion,
  Statement,
  TarjetaProyecto,
  TituloSeccion,
} from '../components/ui';
import { CampoPuntos, MarcoExpansivo, Reveal } from '../components/reactbits';
import { Cascada, Escala, Lateral, Secuencia } from '../components/motion';
import { TarjetaSolucion } from '../components/ui/TarjetaSolucion';
import { Presentacion } from '../components/ui/Presentacion';
import { PortadaHero } from '../components/hero/PortadaHero';
import { Seo, nodoPagina, nodoPreguntas } from '../lib/seo';
import { SERVICIOS } from '../content/servicios';
import { PROYECTOS_DESTACADOS, rutaProyecto } from '../content/proyectos';
import { ANCLAS_HOME } from '../config/pricing';
import { RUTAS } from '../config/rutas';
import { CONTACT, PREGUNTAS_INICIO } from '../content';

/* El title y la description de la home son los que Miguel eligió para
   producción; se respetan tal cual para no cambiarle una decisión suya de
   posicionamiento dentro de un rediseño que es solo una propuesta. Si
   después del Preview quiere alinearlo con el nuevo H1, se cambia aquí y en
   index.html, que son los dos únicos sitios donde vive. */
const TITLE = 'Morphiq | Digitalizamos la operación de tu negocio en CDMX';
const DESC =
  'Diseño y construyo páginas web, puntos de venta, CRM y automatizaciones para negocios de la Ciudad de México. Páginas desde $2,000 MXN, con precio cerrado antes de empezar.';

const PROCESO_CORTO = [
  { titulo: 'Me cuentas', cuerpo: 'Qué hace tu negocio y qué te está costando trabajo.' },
  { titulo: 'Te propongo', cuerpo: 'Alcance y precio cerrado, por escrito, antes de empezar.' },
  { titulo: 'Construimos', cuerpo: 'Ves avances y opinas mientras todavía es barato cambiar.' },
  { titulo: 'Sale en línea', cuerpo: 'Publicación, capacitación y acompañamiento los primeros días.' },
];


export default function Inicio() {
  const grafo = [
    nodoPagina({ path: RUTAS.inicio, title: TITLE, description: DESC }),
    nodoPreguntas({ path: RUTAS.inicio, preguntas: PREGUNTAS_INICIO }),
  ];

  return (
    <>
      <Seo title={TITLE} description={DESC} path={RUTAS.inicio} grafo={grafo} />

      <PortadaHero />

      {/* ============ ¿QUÉ NECESITAS? ============ */}
      <Seccion tono="elevado" id="que-necesitas">
        <div className="contenedor contenedor--amplio">
          {/* El encabezado deja de estar centrado en una columna estrecha:
              el titular ocupa siete columnas y la entrada se va abajo a la
              derecha. */}
          <TituloSeccion
            eyebrow="Empieza por aquí"
            titulo="¿Qué necesita tu negocio?"
            resalte="tu negocio"
            entrada="Elige lo que más se parezca a tu situación. Cada camino lleva a una explicación completa, con precios."
          />
          {/* Rejilla asimétrica: las dos primeras soluciones —las que más se
              piden— ocupan más ancho que las tres siguientes. Cinco tarjetas
              iguales en una rejilla automática dejaban un hueco impar y se
              leían como una lista; así se leen como una portada. */}
          <Cascada className="rejilla-soluciones" paso={0.07} y={30}>
            {SERVICIOS.map((s, i) => (
              <TarjetaSolucion key={s.id} servicio={s} indice={i} />
            ))}
          </Cascada>
          <Reveal>
            <p className="rejilla-servicios__pie">
              ¿No sabes cuál? <Link to={RUTAS.contacto}>Cuéntame qué te está costando trabajo</Link> y yo te digo.
            </p>
          </Reveal>
        </div>
      </Seccion>

      {/* ============ PROYECTOS ============ */}
      <Seccion className="seccion--portafolio">
        <div className="contenedor contenedor--amplio">
          <TituloSeccion
            eyebrow="Trabajo real"
            titulo="Negocios que ya funcionan con esto."
            resalte="ya funcionan"
            entrada="No son maquetas de portafolio. Están en línea y los puedes abrir."
          />
          {/* El bloque de proyectos se ensancha mientras pasa por la
              pantalla. No fija nada ni toca la rueda: si bajas rápido lo ves
              ya abierto. */}
          <MarcoExpansivo desde={0.92}>
            <div className="rejilla-proyectos rejilla-proyectos--destacados">
              {PROYECTOS_DESTACADOS.map((p, i) => (
                <Escala key={p.slug} delay={i * 0.08} desde={0.95}>
                  <TarjetaProyecto proyecto={p} ruta={rutaProyecto(p.slug)} />
                </Escala>
              ))}
            </div>
          </MarcoExpansivo>
          <Reveal>
            <div className="seccion__pie">
              <BotonSecundario to={RUTAS.proyectos}>Ver todos los proyectos</BotonSecundario>
            </div>
          </Reveal>
        </div>
      </Seccion>

      {/* ============ PRECIOS COMO ANCLA ============ */}
      <Seccion tono="elevado" id="precios">
        <div className="contenedor contenedor--amplio">
          <TituloSeccion
            eyebrow="Precios"
            titulo="Los precios están publicados."
            resalte="publicados"
            entrada="Ninguna agencia te los enseña antes de la llamada. Aquí están, con lo que incluye cada uno y lo que lo encarece."
            aparte={
              <p className="titulo-seccion__dato">
                Desde <strong>$2,000</strong> MXN
              </p>
            }
          />
          <div className="anclas">
            {ANCLAS_HOME.map((plan, i) => (
              <Lateral key={plan.id} desde={i % 2 ? 'derecha' : 'izquierda'} delay={i * 0.05} distancia={4}>
                <Link to={RUTAS.precios} className="ancla">
                  <h3 className="ancla__nombre">{plan.nombre}</h3>
                  <Precio plan={plan} tamano="compacto" />
                  <p className="ancla__resumen">{plan.resumen}</p>
                  <span className="ancla__ver">
                    Ver detalle
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </Link>
              </Lateral>
            ))}
          </div>
          <Reveal>
            <div className="seccion__pie">
              <BotonSecundario to={RUTAS.precios}>Ver todos los precios</BotonSecundario>
            </div>
          </Reveal>
        </div>
      </Seccion>

      {/* ============ CÓMO TRABAJO ============
          El caso más claro de lo que había que arreglar: un lienzo enorme
          con un bloque pequeño dentro. Ahora la frase es un statement de
          nivel A que ocupa su propia pantalla, y los cuatro pasos se
          encienden uno a uno conforme bajas. No se fija nada ni se secuestra
          la rueda: quien baja rápido ve la lista completa y sigue. */}
      <Seccion className="seccion--proceso">
        <div className="contenedor contenedor--amplio">
          <Statement
            lineas={['Aquí no se trabaja', 'a puerta cerrada.']}
            eyebrow="Cómo trabajo"
            kicker="Cuatro pasos"
            resalte="a puerta cerrada"
            className="proceso-statement"
          >
            <p className="proceso-statement__entrada">
              Vas viendo el proyecto y vas opinando mientras todavía es barato cambiar de idea.
            </p>
          </Statement>

          <Secuencia as="ol" className="proceso-corto" paso={0.06}>
            {PROCESO_CORTO.map((paso, i) => (
              <li key={paso.titulo}>
                <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{paso.titulo}</h3>
                <p>{paso.cuerpo}</p>
              </li>
            ))}
          </Secuencia>
        </div>
      </Seccion>

      {/* ============ QUIÉN ESTÁ DETRÁS ============
          Vuelve la sección de producción: la placa del logo con su efecto de
          agua al pasar el cursor, la firma MH97 y la rúbrica con el correo
          personal. Antes era un párrafo centrado en una columna estrecha, o
          sea puro texto, justo en la sección que tiene que demostrar oficio. */}
      <Seccion tono="acento" className="seccion--presentacion">
        <div className="contenedor contenedor--amplio">
          <Presentacion>
            <div className="presentacion__acciones">
              <BotonSecundario to={RUTAS.sobre}>Cómo trabajo, en detalle</BotonSecundario>
            </div>
          </Presentacion>
        </div>
      </Seccion>

      {/* ============ DUDAS ============ */}
      <Seccion>
        <Contenedor ancho="medio">
          {/* Aquí sí conviene el modo simple: un acordeón se lee mejor en
              una columna, y meterle una segunda columna de entrada sería
              composición por composición. */}
          <TituloSeccion titulo="Lo que todos preguntan primero." resalte="preguntan primero" variante="simple" />
          <Acordeon items={PREGUNTAS_INICIO} />
        </Contenedor>
      </Seccion>

      {/* ============ CIERRE ============
          Antes era una caja de 350 px centrada en medio de un monitor de
          1920. Ahora es lo que era en producción: el mensaje ocupa la
          pantalla y el resto de la página trabaja a su favor. */}
      <Seccion tono="elevado" className="cierre">
        <CampoPuntos className="cierre__campo" />
        {/* El símbolo de la marca, enorme y translúcido, detrás del mensaje.
            Es lo que convierte el cierre en un final con firma en vez de en
            una sección más con un botón. */}
        <img className="cierre__marca" src="/marca/simbolo-v2-lg.webp" alt="" aria-hidden="true" loading="lazy" />
        <div className="contenedor contenedor--amplio">
          <Statement
            lineas={['¿Empezamos?']}
            eyebrow="Contacto directo"
            kicker="¿Tienes una idea?"
            className="cierre__statement"
          >
            <div className="cierre__reparto">
              <p className="cierre__cuerpo">
                Cuéntame qué hace tu negocio y qué te está costando trabajo. Con eso ya puedo decirte por dónde
                empezar y cuánto costaría, aunque acabemos en la opción más barata.
              </p>
              <div className="cierre__acciones">
                <BotonPrincipal to={RUTAS.contacto} grande>
                  Cuéntame tu proyecto
                </BotonPrincipal>
                <BotonSecundario to={RUTAS.precios} grande>
                  Ver precios primero
                </BotonSecundario>
              </div>
            </div>
          </Statement>
        </div>
      </Seccion>
    </>
  );
}
