/**
 * /precios — con revelación progresiva.
 *
 * El error clásico de una página de precios es enseñar noventa palomitas de
 * golpe. Aquí primero eliges qué buscas (web o sistema), y solo entonces
 * aparecen las opciones de esa familia con su detalle. Todo el contenido
 * sigue en el DOM: lo que cambia es qué se muestra, no qué existe, para que
 * Google lo lea completo y quien use Ctrl+F lo encuentre.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'motion/react';
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
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Seo, nodoMigas, nodoOferta, nodoPagina, nodoPreguntas } from '../lib/seo';
import { AVISO_IVA, PLANES, PLANES_SISTEMAS, PLANES_WEB, rutaDelPlan } from '../config/pricing';
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


/* ------------------------------------------------------------
   La marca de la elección, otra vez viajando
   ------------------------------------------------------------
   Tercera y última vez que aparece este gesto en el sitio —barra, filtros
   de /proyectos y aquí—, y es a propósito: que la marca de selección viaje
   de una opción a otra es del sitio, no un truco de una página.

   `layoutId` propio: solo tiene que hacer el viaje entre las dos opciones
   de este selector. Compartirlo con la barra, que está montada al mismo
   tiempo, haría que Motion moviera una sola pastilla entre las dos zonas.

   Lo que este añadido NO arregla, y conviene tenerlo escrito: el efecto de
   elegir familia ocurre 800 px más abajo, fuera de la vista. Eso es
   maquetación, no movimiento. Con la pastilla, al menos el clic tiene
   consecuencia visible donde está el dedo.

   El `is-activa` que ya pinta el botón se queda; esto se suma debajo. */
function IndicadorFamilia() {
  const reducido = useReducedMotion();

  /* Con reduced motion, la misma pastilla sin `layoutId`: aparece de golpe
     en su sitio. Se degrada el viaje, nunca el dato de qué elegiste —que
     además lo lleva `aria-pressed`. */
  if (reducido) return <span className="selector-familia__pastilla" aria-hidden="true" />;

  return (
    <Motion.span
      className="selector-familia__pastilla"
      aria-hidden="true"
      layoutId="familia-activa"
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
    />
  );
}

/* Qué familia contiene el plan que pide el ancla. Sin ancla, o con una que no
   corresponde a ningún plan, se abre la de páginas web como siempre. */
function familiaDelAncla() {
  try {
    const id = decodeURIComponent(window.location.hash.replace('#', ''));
    if (!id) return 'web';
    const dueña = FAMILIAS.find((f) => f.planes.some((p) => p.id === id));
    return dueña?.id ?? 'web';
  } catch {
    return 'web';
  }
}

export default function Precios() {
  /* ------------------------------------------------------------
     EL ANCLA DE LA URL MANDA SOBRE LA FAMILIA QUE SE ABRE
     ------------------------------------------------------------
     El OfferCatalog de esta página declara siete ofertas, cada una con su
     URL: /precios#crm, /precios#punto-de-venta, etc. Esas direcciones no
     llevaban a ninguna parte: solo se montan las tarjetas de la familia
     activa, así que las siete aterrizaban al principio de la página. Ahora
     el ancla elige la familia, la tarjeta existe y el navegador puede ir a
     ella. Prometer una dirección en los datos estructurados y no entregarla
     es peor que no prometerla.
     ------------------------------------------------------------ */
  const [familia, setFamilia] = useState(familiaDelAncla);
  const activa = FAMILIAS.find((f) => f.id === familia);

  /* El navegador intenta ir al ancla al cargar, cuando la tarjeta todavía no
     existe: React aún no ha montado nada. Así que se repite el salto una vez
     montada. `block: 'center'` y no `'start'` porque la barra de arriba es
     fija y con `'start'` el titular de la tarjeta queda debajo de ella. */
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace('#', ''));
    if (!id) return;
    const destino = document.getElementById(id);
    if (!destino) return;
    destino.scrollIntoView({ block: 'center', behavior: 'auto' });
  }, []);

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
          ruta: rutaDelPlan(p),
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
                {familia === f.id && <IndicadorFamilia />}
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
              <Escala key={plan.id} id={plan.id} delay={i * 0.07} desde={0.96}>
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
          {/* El `Reveal` sigue trayendo el bloque entero y no se toca. El
              `--i` es para que, DENTRO, el filete de acento de cada punto se
              dibuje uno detrás de otro por CSS. Son dos animaciones sobre
              propiedades distintas del mismo bloque: no se pisan, se suman.
              Cambiar el `Reveal` por `Secuencia` habría sido sustituir, y
              meter `Secuencia` dentro deja un doble fundido feo. */}
          <Reveal>
            <ul className="incluido-siempre">
              <li style={{ '--i': 0 }}>
                <strong>Precio cerrado antes de empezar.</strong> Si me equivoqué al calcular, es mi problema.
              </li>
              <li style={{ '--i': 1 }}>
                <strong>Tratas conmigo.</strong> No hay cuenta, ni ejecutivo, ni cadena de correos.
              </li>
              <li style={{ '--i': 2 }}>
                <strong>Ves avances durante el proceso.</strong> No desaparezco tres semanas.
              </li>
              <li style={{ '--i': 3 }}>
                <strong>Lo que se construye es tuyo.</strong> Dominio y proyecto quedan a tu nombre.
              </li>
              <li style={{ '--i': 4 }}>
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
