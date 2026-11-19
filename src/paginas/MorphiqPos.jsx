/**
 * ============================================================
 * MORPHIQPOS — la página del producto
 * ============================================================
 *
 * Las páginas de servicio venden un trabajo; esta vende un producto con
 * nombre propio. Por eso no usa la plantilla de `ServicioDetalle`: tiene su
 * marca, su portada y su propio recorrido.
 *
 * EL RECORRIDO, EN EL ORDEN EN QUE ALGUIEN SE LO PREGUNTA
 *   qué es → ¿qué hace en un día normal? → ¿sirve para MI negocio? →
 *   ¿qué controla? → ¿se conecta con mi página? → ¿de verdad es a mi
 *   medida? → ¿en qué aparatos? → ¿cómo se contrata y cuánto cuesta? →
 *   dudas → quiero verlo.
 *
 * EL ARTE ASCII
 * Está en toda la página y en ningún sitio grita: la terminal de la portada
 * hecha de caracteres, las reglas entre secciones, el ticket, la bitácora de
 * la demostración, los dibujos de cada giro y el núcleo del diagrama. Es la
 * textura de la marca del producto, igual que el cromo lo es de Morphiq.
 */

import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, Cloud, MonitorSmartphone, Server } from 'lucide-react';
import { motion as Motion } from 'motion/react';

import { Acordeon, BotonPrincipal, BotonSecundario, Contenedor, Migas, Seccion, Statement, TarjetaPlan, TituloSeccion } from '../components/ui';
import { Cascada, Escala, Secuencia, Titular } from '../components/motion';
import { Magnet, Marquee, Reveal } from '../components/reactbits';
import { MarcaPos, ReglaAscii } from '../components/pos/MarcaPos';
import { DiaEnPantalla } from '../components/pos/DiaEnPantalla';
import { Giros } from '../components/pos/Giros';
import { Modulos } from '../components/pos/Modulos';
import { Conexion } from '../components/pos/Conexion';
import { Personaliza } from '../components/pos/Personaliza';
import { Seo, nodoMigas, nodoPagina, nodoPreguntas } from '../lib/seo';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { PLANES } from '../config/pricing';
import { DOMINIO, RUTAS, contactoCon } from '../config/rutas';
import {
  POS_APARATOS,
  POS_CIERRE,
  POS_CINTA,
  POS_CONEXION,
  POS_HERO,
  POS_MIGAS,
  POS_PERSONALIZA,
  POS_PREGUNTAS,
  POS_PROCESO,
  POS_ROTULO,
  POS_SEO,
} from '../content/morphiqpos';
import '../styles/pos.css';

/* three.js viaja en su propio trozo: la portada pinta el texto primero y la
   terminal llega después. */
const TerminalAscii = lazy(() => import('../components/pos/TerminalAscii'));

function conResalte(linea, resalte) {
  const i = linea.indexOf(resalte);
  if (i === -1) return linea;
  return (
    <>
      {linea.slice(0, i)}
      <em className="pos-portada__acento">{resalte}</em>
      {linea.slice(i + resalte.length)}
    </>
  );
}

/* El producto, descrito para un buscador. `SoftwareApplication` es el tipo
   que le corresponde; el precio va como «desde», igual que en /precios. */
function nodoProducto() {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${DOMINIO}${RUTAS.morphiqpos}#producto`,
    name: 'MorphiqPOS',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Punto de venta',
    operatingSystem: 'Web, Windows, Android',
    description: POS_SEO.description,
    url: `${DOMINIO}${RUTAS.morphiqpos}`,
    inLanguage: 'es-MX',
    publisher: { '@id': `${DOMINIO}/#organizacion` },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'MXN',
      availability: 'https://schema.org/InStock',
      priceSpecification: { '@type': 'PriceSpecification', minPrice: PLANES.pos.desde, priceCurrency: 'MXN' },
    },
  };
}

export default function MorphiqPos() {
  const sinMovimiento = useReducedMotion();
  const compacto = useMediaQuery('(max-width: 860px)');

  const grafo = [
    nodoPagina({ path: RUTAS.morphiqpos, title: POS_SEO.title, description: POS_SEO.description }),
    nodoMigas(POS_MIGAS),
    nodoProducto(),
    nodoPreguntas({ path: RUTAS.morphiqpos, preguntas: POS_PREGUNTAS }),
  ];

  return (
    <>
      <Seo title={POS_SEO.title} description={POS_SEO.description} path={RUTAS.morphiqpos} grafo={grafo} />

      {/* ============ PORTADA ============ */}
      <header className="pos-portada">
        <div className="pos-portada__escena">
          <Suspense fallback={null}>
            <TerminalAscii sinMovimiento={sinMovimiento} compacto={compacto} />
          </Suspense>
        </div>
        <span className="pos-portada__velo" aria-hidden="true" />

        <div className="contenedor contenedor--amplio pos-portada__reparto">
          <Migas ruta={POS_MIGAS} />

          <Motion.div
            className="pos-portada__texto"
            initial={sinMovimiento ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <MarcaPos etiqueta="p" className="marca-pos--grande" />
            <p className="pos-portada__eyebrow">
              <span>[</span> {POS_HERO.eyebrow} <span>]</span>
            </p>
            <Titular
              as="h1"
              className="pos-portada__titular"
              delay={0.15}
              lineas={POS_HERO.lineas.map((l) => conResalte(l, POS_HERO.resalte))}
            />
            <p className="pos-portada__entrada">{POS_HERO.entrada}</p>

            <div className="pos-portada__acciones">
              <Magnet strength={0.3} radius={120}>
                <Link className="tactile-button tactile-button--glow tactile-button--large" to={contactoCon('sistema')}>
                  Pedir una demostración
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </Magnet>
              <a className="tactile-button tactile-button--paper tactile-button--large" href="#un-dia">
                Ver cómo funciona
                <ArrowDown size={17} aria-hidden="true" />
              </a>
            </div>

            <dl className="pos-portada__datos">
              {POS_HERO.datos.map((d) => (
                <div key={d.etiqueta}>
                  <dt>
                    <b>{d.valor}</b> {d.etiqueta}
                  </dt>
                  <dd>{d.nota}</dd>
                </div>
              ))}
            </dl>
          </Motion.div>
        </div>

        <p className="pos-portada__pista" aria-hidden="true">
          pasa el cursor sobre la terminal
        </p>
      </header>

      {/* Para quién: los giros, en cinta. Es decoración —los giros de verdad
          están más abajo, en texto— así que va fuera del árbol accesible. */}
      <div className="pos-cinta">
        <Marquee items={POS_CINTA} speed={46} separator="+" />
      </div>

      {/* ============ UN DÍA ============ */}
      <Seccion id="un-dia" className="pos-seccion pos-seccion--dia">
        <div className="contenedor contenedor--amplio">
          <ReglaAscii etiqueta="01 · un dia de operacion" />
          <TituloSeccion
            eyebrow="Así se usa"
            titulo="Un día completo, sin soltar el sistema."
            resalte="sin soltar el sistema"
            entrada="Baja y míralo trabajar: de la primera mesa al cierre, con las pantallas que usa cada persona de tu equipo."
          />
          <DiaEnPantalla negocio="Tepalcate" />
        </div>
      </Seccion>

      {/* ============ GIROS ============ */}
      <Seccion tono="elevado" id="giros" className="pos-seccion">
        <div className="contenedor contenedor--amplio">
          <ReglaAscii etiqueta="02 · tipos de negocio" />
          <TituloSeccion
            eyebrow="Para tu giro"
            titulo="Un sistema. La cara de tu negocio."
            resalte="tu negocio"
            entrada="La caja, el inventario y los clientes son los mismos en todos lados. Lo que cambia es cómo se vende, y eso es lo que se arma para cada giro."
          />
          <Giros />
          <Reveal>
            <p className="pos-seccion__nota">
              ¿Tu giro no está aquí? <Link to={contactoCon('sistema')}>Cuéntanos cómo vendes</Link> y te decimos con qué piezas se
              arma.
            </p>
          </Reveal>
        </div>
      </Seccion>

      {/* ============ MÓDULOS ============ */}
      <Seccion id="control" className="pos-seccion">
        <div className="contenedor contenedor--amplio">
          <ReglaAscii etiqueta="03 · control" />
          <TituloSeccion
            eyebrow="Lo que controla"
            titulo="Que nada dependa de tu memoria."
            resalte="tu memoria"
            entrada="Cada módulo se enciende si tu negocio lo necesita. Empiezas con lo que te urge y sumas el resto sin rehacer nada."
          />
          <Modulos />
        </div>
      </Seccion>

      {/* ============ CONEXIÓN ============ */}
      <Seccion tono="elevado" id="conectado" className="pos-seccion">
        <div className="contenedor contenedor--amplio">
          <ReglaAscii etiqueta="04 · conectado" />
          <TituloSeccion
            eyebrow={POS_CONEXION.eyebrow}
            titulo={POS_CONEXION.titulo}
            resalte={POS_CONEXION.resalte}
            entrada={POS_CONEXION.entrada}
          />
          <Escala desde={0.96}>
            <Conexion />
          </Escala>
          <Reveal>
            <p className="pos-seccion__nota">
              {POS_CONEXION.nota} <Link to={RUTAS.paginasWeb}>Ver páginas web</Link>
            </p>
          </Reveal>
        </div>
      </Seccion>

      {/* ============ A TU MARCA ============ */}
      <Seccion id="a-tu-marca" className="pos-seccion">
        <div className="contenedor contenedor--amplio">
          <ReglaAscii etiqueta="05 · a tu marca" />
          <TituloSeccion
            eyebrow={POS_PERSONALIZA.eyebrow}
            titulo={POS_PERSONALIZA.titulo}
            resalte={POS_PERSONALIZA.resalte}
            entrada={POS_PERSONALIZA.entrada}
          />
          <Personaliza />
          <Cascada className="pos-capas" paso={0.07}>
            {POS_PERSONALIZA.capas.map((capa, i) => (
              <div key={capa.titulo} className="pos-capa">
                <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{capa.titulo}</h3>
                <p>{capa.cuerpo}</p>
              </div>
            ))}
          </Cascada>
        </div>
      </Seccion>

      {/* ============ APARATOS ============ */}
      <Seccion tono="elevado" id="aparatos" className="pos-seccion">
        <div className="contenedor contenedor--amplio">
          <ReglaAscii etiqueta="06 · donde corre" />
          <TituloSeccion
            eyebrow={POS_APARATOS.eyebrow}
            titulo={POS_APARATOS.titulo}
            resalte={POS_APARATOS.resalte}
            entrada={POS_APARATOS.entrada}
          />
          <div className="pos-aparatos">
            <Cascada className="pos-aparatos__lista" paso={0.06}>
              {POS_APARATOS.lista.map((a) => (
                <div key={a.nombre} className="pos-aparato">
                  <MonitorSmartphone size={20} aria-hidden="true" />
                  <h3>{a.nombre}</h3>
                  <p>{a.nota}</p>
                </div>
              ))}
            </Cascada>
            <div className="pos-hospedaje">
              {POS_APARATOS.hospedaje.map((h, i) => (
                <Escala key={h.titulo} delay={i * 0.08} desde={0.96}>
                  <div className="pos-hospedaje__opcion">
                    {i === 0 ? <Cloud size={22} aria-hidden="true" /> : <Server size={22} aria-hidden="true" />}
                    <h3>{h.titulo}</h3>
                    <p>{h.cuerpo}</p>
                  </div>
                </Escala>
              ))}
            </div>
          </div>
        </div>
      </Seccion>

      {/* ============ CÓMO SE CONTRATA ============ */}
      <Seccion id="como" className="pos-seccion">
        <div className="contenedor contenedor--amplio">
          <ReglaAscii etiqueta="07 · como se contrata" />
          <Statement
            lineas={['Primero lo ves.', 'Luego decides.']}
            eyebrow="Cómo se contrata"
            kicker="Cuatro pasos"
            resalte="Luego decides"
            className="proceso-statement"
          >
            <p className="proceso-statement__entrada">
              Nadie compra un sistema por una descripción. Te lo enseñamos funcionando y, si te sirve, se arma para tu negocio.
            </p>
          </Statement>
          <Secuencia as="ol" className="proceso-corto" paso={0.06}>
            {POS_PROCESO.map((paso, i) => (
              <li key={paso.titulo}>
                <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{paso.titulo}</h3>
                <p>{paso.cuerpo}</p>
              </li>
            ))}
          </Secuencia>
        </div>
      </Seccion>

      {/* ============ PRECIO ============ */}
      <Seccion tono="elevado" id="precio" className="pos-seccion">
        <Contenedor>
          <TituloSeccion
            eyebrow="Cuánto cuesta"
            titulo="Con el precio por delante."
            resalte="por delante"
            entrada="Es un servicio mensual porque incluye que el sistema siga funcionando, actualizado y con soporte. La implementación inicial se cotiza aparte, una sola vez."
          />
          <div className="planes planes--2">
            {[PLANES.pos, PLANES.ecosistema].map((plan, i) => (
              <Escala key={plan.id} delay={i * 0.07} desde={0.96}>
                <TarjetaPlan plan={plan} detallada servicio="sistema" />
              </Escala>
            ))}
          </div>
          <Reveal>
            <p className="planes__pie">
              Todos los precios son un punto de partida y se cierran antes de empezar. <Link to={RUTAS.precios}>Ver todos los precios</Link>
            </p>
          </Reveal>
        </Contenedor>
      </Seccion>

      {/* ============ PREGUNTAS ============ */}
      <Seccion id="preguntas" className="pos-seccion">
        <Contenedor ancho="medio">
          <TituloSeccion titulo="Lo que nos preguntan antes de contratar." resalte="antes de contratar" variante="simple" />
          <Acordeon items={POS_PREGUNTAS} />
        </Contenedor>
      </Seccion>

      {/* ============ CIERRE ============ */}
      <Seccion tono="elevado" className="cierre pos-cierre">
        <pre className="pos-cierre__arte" aria-hidden="true">
          {POS_ROTULO.join('\n')}
        </pre>
        <div className="contenedor contenedor--amplio">
          <Statement lineas={POS_CIERRE.lineas} eyebrow="Demostración" kicker="Sin compromiso" resalte={POS_CIERRE.resalte} className="cierre__statement">
            <Reveal className="cierre__reparto" delay={0.42}>
              <p className="cierre__cuerpo">{POS_CIERRE.cuerpo}</p>
              <div className="cierre__acciones">
                <BotonPrincipal to={contactoCon('sistema')} grande>
                  Pedir una demostración
                </BotonPrincipal>
                <BotonSecundario to={RUTAS.precios} grande>
                  Ver precios primero
                </BotonSecundario>
              </div>
            </Reveal>
          </Statement>
        </div>
      </Seccion>
    </>
  );
}
