/**
 * /precios — con revelación progresiva.
 *
 * El error clásico de una página de precios es enseñar noventa palomitas de
 * golpe. Aquí primero eliges qué buscas (web o sistema), y solo entonces
 * aparecen las opciones de esa familia con su detalle. Todo el contenido
 * sigue en el DOM: lo que cambia es qué se muestra, no qué existe, para que
 * Google lo lea completo y quien use Ctrl+F lo encuentre.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import {
  Acordeon,
  BotonPrincipal,
  BotonSecundario,
  CabeceraPagina,
  CierreCTA,
  Contenedor,
  Precio,
  Seccion,
  TarjetaPlan,
  TituloSeccion,
} from '../components/ui';
import { Reveal } from '../components/reactbits';
import { Escala } from '../components/motion';
import { Seo, nodoMigas, nodoOferta, nodoPagina, nodoPreguntas } from '../lib/seo';
import { AVISO_IVA, PLANES, PLANES_SISTEMAS, PLANES_WEB } from '../config/pricing';
import { DOMINIO, RUTAS } from '../config/rutas';
import { PREGUNTAS_PRECIOS } from '../content';

const MIGAS = [
  { nombre: 'Inicio', path: RUTAS.inicio },
  { nombre: 'Precios', path: RUTAS.precios },
];

const TITLE = 'Precios: páginas web desde $2,000 MXN | Morphiq';
const DESC =
  'Precios de partida para páginas web, punto de venta, CRM, mantenimiento y ecosistemas completos. Todo con «desde» visible y el precio final cerrado antes de empezar.';

const FAMILIAS = [
  {
    id: 'web',
    etiqueta: 'Quiero una página web',
    ayuda: 'Presencia, catálogo, formularios',
    planes: PLANES_WEB,
  },
  {
    id: 'sistemas',
    etiqueta: 'Quiero ordenar mi operación',
    ayuda: 'Punto de venta, CRM, ecosistema',
    planes: PLANES_SISTEMAS,
  },
];


export default function Precios() {
  const [familia, setFamilia] = useState('web');
  const activa = FAMILIAS.find((f) => f.id === familia);

  const grafo = [
    nodoPagina({ path: RUTAS.precios, title: TITLE, description: DESC }),
    nodoMigas(MIGAS),
    {
      '@type': 'OfferCatalog',
      '@id': `${DOMINIO}${RUTAS.precios}#catalogo`,
      name: 'Precios de Morphiq',
      url: `${DOMINIO}${RUTAS.precios}`,
      itemListElement: Object.values(PLANES).map((p) =>
        nodoOferta({
          nombre: p.nombre,
          descripcion: p.resumen,
          desde: p.desde,
          path: RUTAS.precios,
          ancla: p.id,
        })
      ),
    },
    nodoPreguntas({ path: RUTAS.precios, preguntas: PREGUNTAS_PRECIOS }),
  ];

  return (
    <>
      <Seo title={TITLE} description={DESC} path={RUTAS.precios} grafo={grafo} />

      <CabeceraPagina
        migas={MIGAS}
        eyebrow="Precios"
        titulo="Cuánto cuesta, sin que tengas que preguntar."
        resalte="sin que tengas que preguntar"
        entrada="Todos los precios son de partida y el final se cierra antes de empezar. Nunca a mitad del proyecto."
        aparte={
          <ul className="anclas-cabecera">
            {[PLANES.webEsencial, PLANES.webProfesional, PLANES.crm, PLANES.mantenimiento].map((plan) => (
              <li key={plan.id}>
                <span className="anclas-cabecera__nombre">{plan.nombre}</span>
                <Precio plan={plan} tamano="compacto" />
              </li>
            ))}
          </ul>
        }
        acciones={
          <>
            <BotonPrincipal to={RUTAS.contacto} grande>
              Pedir cotización
            </BotonPrincipal>
            <BotonSecundario to={RUTAS.servicios} grande>
              Ver servicios
            </BotonSecundario>
          </>
        }
      />

      {/* ---- Paso 1: qué buscas ---- */}
      <Seccion tono="elevado">
        <Contenedor>
          <TituloSeccion
            titulo="¿Qué estás buscando?"
            entrada="Elige por dónde va tu necesidad y te enseño solo lo que aplica."
            centrado
          />
          <div className="selector-familia" role="group" aria-label="Elige qué tipo de solución buscas">
            {FAMILIAS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`selector-familia__opcion ${familia === f.id ? 'is-activa' : ''}`}
                aria-pressed={familia === f.id}
                onClick={() => setFamilia(f.id)}
              >
                <strong>{f.etiqueta}</strong>
                <span>{f.ayuda}</span>
              </button>
            ))}
          </div>
        </Contenedor>
      </Seccion>

      {/* ---- Paso 2: los planes de esa familia ---- */}
      <Seccion>
        <div className="contenedor contenedor--amplio">
          <div className={`planes planes--${activa.planes.length}`}>
            {activa.planes.map((plan, i) => (
              <Escala key={plan.id} delay={i * 0.07} desde={0.96}>
                <TarjetaPlan plan={plan} detallada />
              </Escala>
            ))}
          </div>

          <Reveal>
            <aside className="nota-precio">
              <Info size={18} aria-hidden="true" />
              <p>
                <strong>Lo que «desde» significa aquí:</strong> es el precio real del alcance más sencillo de ese
                plan, no un gancho. Si tu proyecto cabe ahí, ese es tu precio. Cada tarjeta te dice además qué
                encarece el proyecto, para que lo sepas antes de escribirme y no en la llamada.
                <br />
                <br />
                {AVISO_IVA}
              </p>
            </aside>
          </Reveal>
        </div>
      </Seccion>

      {/* ---- Los que no caben en la elección ---- */}
      <Seccion tono="elevado">
        <Contenedor>
          <TituloSeccion
            titulo="Y dos que se cotizan aparte"
            entrada="Porque dependen tanto del caso que publicar un número sería inventarlo."
          />
          <div className="planes planes--2">
            <Reveal>
              <TarjetaPlan plan={PLANES.ecosistema} detallada />
            </Reveal>
            <Reveal delay={0.07}>
              <TarjetaPlan plan={PLANES.restaurantes} detallada />
            </Reveal>
          </div>
          <Reveal>
            <p className="planes__pie">
              ¿Tienes un restaurante? Hay una página entera dedicada a eso.{' '}
              <Link to={RUTAS.restaurantes}>Ver soluciones para restaurantes</Link>
            </p>
          </Reveal>
        </Contenedor>
      </Seccion>

      {/* ---- Qué incluye siempre, cueste lo que cueste ---- */}
      <Seccion>
        <Contenedor ancho="estrecho">
          <TituloSeccion titulo="Lo que va incluido siempre, elijas lo que elijas" />
          <Reveal>
            <ul className="incluido-siempre">
              <li>
                <strong>Precio cerrado antes de empezar.</strong> Si me equivoqué al calcular, es mi problema.
              </li>
              <li>
                <strong>Tratas conmigo.</strong> No hay cuenta, ni ejecutivo, ni cadena de correos.
              </li>
              <li>
                <strong>Ves avances durante el proceso.</strong> No desaparezco tres semanas.
              </li>
              <li>
                <strong>Lo que se construye es tuyo.</strong> Dominio y proyecto quedan a tu nombre.
              </li>
              <li>
                <strong>Sin contrato de permanencia.</strong> Los servicios mensuales se cancelan cuando quieras.
              </li>
            </ul>
          </Reveal>
        </Contenedor>
      </Seccion>

      {/* ---- Dudas ---- */}
      <Seccion tono="elevado">
        <Contenedor ancho="estrecho">
          <TituloSeccion titulo="Lo que todos preguntan del precio" />
          <Acordeon items={PREGUNTAS_PRECIOS} />
        </Contenedor>
      </Seccion>

      <CierreCTA
        titulo="¿Cuál te queda?"
        cuerpo="Cuéntame qué hace tu negocio y qué necesitas resolver. Te digo cuál de estos te toca y cuánto costaría el tuyo en concreto."
        servicio="otro"
        etiqueta="Pedir mi cotización"
      />
    </>
  );
}
