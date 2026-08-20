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
  TarjetaProyecto,
  TarjetaServicio,
  TituloSeccion,
} from '../components/ui';
import { Reveal } from '../components/reactbits';
import { Logo3D } from '../components/hero/Logo3D';
import { Seo, nodoPagina, nodoPreguntas } from '../lib/seo';
import { SERVICIOS } from '../content/servicios';
import { PROYECTOS_DESTACADOS, rutaProyecto } from '../content/proyectos';
import { ANCLAS_HOME } from '../config/pricing';
import { RUTAS } from '../config/rutas';
import { CONTACT } from '../content';

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

const PREGUNTAS = [
  {
    q: '¿Cuánto cuesta una página web?',
    a: 'Desde $2,000 MXN una página sencilla y bien hecha, y desde $8,000 MXN un sitio completo con varias páginas, formularios y dominio incluido el primer año. El precio final depende del alcance y te lo doy cerrado antes de empezar.',
  },
  {
    q: '¿Cuánto tiempo tarda?',
    a: 'Depende del alcance, y te doy una fecha antes de arrancar. Lo que no cambia es el ritmo: vas viendo producto funcionando durante el proceso, no reportes de avance.',
  },
  {
    q: '¿Puedo editar el contenido después?',
    a: 'Depende del proyecto. Cuando incluye panel de administración, sí: cambias precios, fotos, servicios y promociones tú mismo, y te capacito antes de entregar. No todas las páginas lo necesitan y te digo con honestidad si la tuya sí.',
  },
  {
    q: '¿Trabajas con negocios fuera de CDMX?',
    a: 'Sí. La mayoría de mis clientes son de la ciudad porque me gusta ir a verlos, pero el proceso funciona igual a distancia: videollamadas, avances en línea y entrega remota.',
  },
  {
    q: '¿Cómo sé que no vas a desaparecer a medio proyecto?',
    a: 'Porque el trabajo está en línea y lo puedes abrir: los proyectos de este sitio tienen enlace directo. Y porque parte del pago va contra entrega: si no entrego, no lo cobro.',
  },
];

export default function Inicio() {
  const grafo = [
    nodoPagina({ path: RUTAS.inicio, title: TITLE, description: DESC }),
    nodoPreguntas({ path: RUTAS.inicio, preguntas: PREGUNTAS }),
  ];

  return (
    <>
      <Seo title={TITLE} description={DESC} path={RUTAS.inicio} grafo={grafo} />

      {/* ============ HERO ============ */}
      <header className="portada">
        <div className="portada__fondo" aria-hidden="true" />
        <Contenedor>
          <div className="portada__reparto">
            <div className="portada__texto">
              <h1 className="portada__titulo">
                Páginas web, sistemas y automatización <em>para negocios</em>.
              </h1>
              <p className="portada__entrada">
                Diseño y construyo las herramientas con las que tu negocio vende, se organiza y deja de hacer a
                mano lo que puede hacerse solo.
              </p>

              <div className="portada__acciones">
                <BotonPrincipal to={RUTAS.servicios} grande>
                  Ver soluciones
                </BotonPrincipal>
                <BotonSecundario to={RUTAS.proyectos} grande>
                  Ver proyectos
                </BotonSecundario>
              </div>

              <p className="portada__ancla">
                Páginas web desde <strong>$2,000 MXN</strong> · <Link to={RUTAS.precios}>ver todos los precios</Link>
              </p>

              <ul className="portada__credenciales">
                <li>
                  <Check size={15} aria-hidden="true" />
                  Precio cerrado antes de empezar
                </li>
                <li>
                  <Check size={15} aria-hidden="true" />
                  Tratas conmigo, no con una cuenta
                </li>
                <li>
                  <Check size={15} aria-hidden="true" />
                  {CONTACT.location}
                </li>
              </ul>
            </div>

            <div className="portada__marca" aria-hidden="true">
              <Logo3D />
            </div>
          </div>
        </Contenedor>
      </header>

      {/* ============ ¿QUÉ NECESITAS? ============ */}
      <Seccion tono="elevado" id="que-necesitas">
        <Contenedor>
          <TituloSeccion
            eyebrow="Empieza por aquí"
            titulo="¿Qué necesita tu negocio?"
            entrada="Elige lo que más se parezca a tu situación. Cada camino lleva a una explicación completa, con precios."
            centrado
          />
          <div className="rejilla-servicios">
            {SERVICIOS.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06}>
                <TarjetaServicio servicio={s} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="rejilla-servicios__pie">
              ¿No sabes cuál? <Link to={RUTAS.contacto}>Cuéntame qué te está costando trabajo</Link> y yo te digo.
            </p>
          </Reveal>
        </Contenedor>
      </Seccion>

      {/* ============ PROYECTOS ============ */}
      <Seccion>
        <Contenedor>
          <TituloSeccion
            eyebrow="Trabajo real"
            titulo="Negocios que ya funcionan con esto."
            entrada="No son maquetas de portafolio. Están en línea y los puedes abrir."
          />
          <div className="rejilla-proyectos rejilla-proyectos--destacados">
            {PROYECTOS_DESTACADOS.map((p, i) => (
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

      {/* ============ PRECIOS COMO ANCLA ============ */}
      <Seccion tono="elevado" id="precios">
        <Contenedor>
          <TituloSeccion
            eyebrow="Precios"
            titulo="Hay una opción dentro de tu presupuesto."
            entrada="Estos son los puntos de partida reales. El precio final se cierra antes de empezar, nunca a mitad del proyecto."
          />
          <div className="anclas">
            {ANCLAS_HOME.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 0.06}>
                <Link to={RUTAS.precios} className="ancla">
                  <h3 className="ancla__nombre">{plan.nombre}</h3>
                  <Precio plan={plan} tamano="compacto" />
                  <p className="ancla__resumen">{plan.resumen}</p>
                  <span className="ancla__ver">
                    Ver detalle
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="seccion__pie">
              <BotonSecundario to={RUTAS.precios}>Ver todos los precios</BotonSecundario>
            </div>
          </Reveal>
        </Contenedor>
      </Seccion>

      {/* ============ CÓMO TRABAJO ============ */}
      <Seccion>
        <Contenedor>
          <TituloSeccion
            eyebrow="Cómo trabajo"
            titulo="No entregas dinero y esperas tres semanas."
            entrada="Vas viendo el proyecto y vas opinando mientras todavía es barato cambiar de idea."
          />
          <ol className="proceso-corto">
            {PROCESO_CORTO.map((paso, i) => (
              <Reveal key={paso.titulo} delay={i * 0.06}>
                <li>
                  <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{paso.titulo}</h3>
                  <p>{paso.cuerpo}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Contenedor>
      </Seccion>

      {/* ============ QUIÉN ESTÁ DETRÁS ============ */}
      <Seccion tono="acento">
        <Contenedor ancho="estrecho">
          <Reveal>
            <div className="quien">
              <p className="quien__eyebrow">Quién está detrás</p>
              <h2 className="quien__titulo">Soy Miguel. Diseño, programo y contesto yo.</h2>
              <p className="quien__cuerpo">
                Morphiq no es una agencia con veinte personas. Es un estudio, y el estudio soy yo. Para un negocio
                pequeño eso no es una limitación: es la razón por la que hablas con quien construye tu proyecto y
                no con alguien que te traduce.
              </p>
              <div className="quien__acciones">
                <BotonSecundario to={RUTAS.sobre}>Conocer más</BotonSecundario>
              </div>
            </div>
          </Reveal>
        </Contenedor>
      </Seccion>

      {/* ============ DUDAS ============ */}
      <Seccion>
        <Contenedor ancho="estrecho">
          <TituloSeccion titulo="Lo que todos preguntan primero." />
          <Acordeon items={PREGUNTAS} />
        </Contenedor>
      </Seccion>

      {/* ============ CIERRE ============ */}
      <Seccion tono="elevado" className="cierre">
        <Contenedor ancho="estrecho">
          <Reveal>
            <div className="cierre__caja">
              <h2 className="cierre__titulo">¿Empezamos?</h2>
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
          </Reveal>
        </Contenedor>
      </Seccion>
    </>
  );
}
