/**
 * /servicios — el mapa completo.
 *
 * No repite la home: la home hace elegir rápido, esta deja COMPARAR. Por eso
 * aquí sí hay una tabla de «cuál me toca» y precios de partida uno al lado
 * del otro, que en la home serían ruido.
 */

import {
  BotonPrincipal,
  BotonSecundario,
  CabeceraPagina,
  CierreCTA,
  Contenedor,
  Seccion,
  TarjetaServicio,
  TituloSeccion,
} from '../components/ui';
import { Reveal } from '../components/reactbits';
import { Seo, nodoMigas, nodoPagina, nodoServicio } from '../lib/seo';
import { SERVICIOS, PAGINAS_SERVICIO } from '../content/servicios';
import { PLANES, precioEnLinea } from '../config/pricing';
import { RUTAS } from '../config/rutas';
import { Link } from 'react-router-dom';

const MIGAS = [
  { nombre: 'Inicio', path: RUTAS.inicio },
  { nombre: 'Servicios', path: RUTAS.servicios },
];

const TITLE = 'Servicios: web, sistemas, CRM y software | Morphiq';
const DESC =
  'Todo lo que Morphiq construye para negocios: páginas web, punto de venta, CRM y automatización, software a medida y soluciones para restaurantes. Con precios de partida.';

/** La tabla de decisión. Cada fila es una situación real, no una categoría. */
const SITUACIONES = [
  {
    situacion: 'Necesito que me encuentren y me escriban.',
    servicio: 'Páginas web',
    ruta: RUTAS.paginasWeb,
    desde: precioEnLinea(PLANES.webEsencial),
  },
  {
    situacion: 'Vendo de mostrador y llevo la cuenta a mano.',
    servicio: 'Sistemas para negocios',
    ruta: RUTAS.sistemas,
    desde: precioEnLinea(PLANES.pos),
  },
  {
    situacion: 'Cotizo mucho y se me pierden los clientes.',
    servicio: 'CRM y automatización',
    ruta: RUTAS.crmAutomatizacion,
    desde: precioEnLinea(PLANES.crm),
  },
  {
    situacion: 'Ningún programa hace lo que necesito.',
    servicio: 'Software a medida',
    ruta: RUTAS.softwareAMedida,
    desde: 'Según el proyecto',
  },
  {
    situacion: 'Tengo un restaurante y quiero ordenarlo todo.',
    servicio: 'Restaurantes',
    ruta: RUTAS.restaurantes,
    desde: 'Según la solución',
  },
];

export default function Servicios() {
  const grafo = [
    nodoPagina({ path: RUTAS.servicios, title: TITLE, description: DESC }),
    nodoMigas(MIGAS),
    ...Object.entries(PAGINAS_SERVICIO).map(([ruta, p]) =>
      nodoServicio({
        id: p.id,
        nombre: p.hero.titulo,
        tipo: p.schema.tipo,
        descripcion: p.schema.descripcion,
        path: ruta,
      })
    ),
  ];

  return (
    <>
      <Seo title={TITLE} description={DESC} path={RUTAS.servicios} grafo={grafo} />

      <CabeceraPagina
        migas={MIGAS}
        eyebrow="Servicios"
        titulo="Todo lo que puedo construir para tu negocio."
        entrada="Cinco frentes. Se pueden contratar por separado o funcionar juntos, que es cuando de verdad se nota."
        acciones={
          <>
            <BotonPrincipal to={RUTAS.contacto} grande>
              No sé cuál necesito
            </BotonPrincipal>
            <BotonSecundario to={RUTAS.precios} grande>
              Ver precios
            </BotonSecundario>
          </>
        }
      />

      {/* ---- La tabla de decisión ---- */}
      <Seccion tono="elevado">
        <Contenedor>
          <TituloSeccion
            titulo="Empieza por tu situación, no por la categoría."
            entrada="Nadie se levanta pensando «necesito un CRM». Se levanta pensando «otra vez se me pasó marcarle»."
          />
          <Reveal>
            <div className="tabla-decision" role="table" aria-label="Qué servicio corresponde a cada situación">
              <div className="tabla-decision__cabeza" role="row">
                <span role="columnheader">Si te pasa esto…</span>
                <span role="columnheader">Te toca</span>
                <span role="columnheader">Desde</span>
              </div>
              {SITUACIONES.map((s) => (
                <Link key={s.ruta} to={s.ruta} className="tabla-decision__fila" role="row">
                  <span className="tabla-decision__situacion" role="cell">
                    {s.situacion}
                  </span>
                  <span className="tabla-decision__servicio" role="cell">
                    {s.servicio}
                  </span>
                  <span className="tabla-decision__desde" role="cell">
                    {s.desde}
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </Contenedor>
      </Seccion>

      {/* ---- Las cinco fichas ---- */}
      <Seccion>
        <Contenedor>
          <TituloSeccion titulo="Los cinco frentes, en detalle." />
          <div className="rejilla-servicios">
            {SERVICIOS.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.06}>
                <TarjetaServicio servicio={s} />
              </Reveal>
            ))}
          </div>
        </Contenedor>
      </Seccion>

      {/* ---- Juntos ---- */}
      <Seccion tono="elevado">
        <Contenedor ancho="estrecho">
          <Reveal>
            <div className="explicador">
              <h2 className="explicador__titulo">Y cuando funcionan juntos</h2>
              <p className="explicador__cuerpo">
                Una venta en el punto de venta baja el inventario, aparece en el tablero del dueño y suma al
                historial del cliente en el CRM. Una solicitud de tu página entra sola como prospecto. Eso es
                un ecosistema: no más herramientas, sino las mismas hablándose.
              </p>
              <p className="explicador__remate">
                En proyectos de ecosistema completo la página web va incluida dentro del paquete.
              </p>
              <div className="explicador__acciones">
                <BotonSecundario to={RUTAS.precios}>Ver Ecosistema Empresarial</BotonSecundario>
              </div>
            </div>
          </Reveal>
        </Contenedor>
      </Seccion>

      <CierreCTA
        titulo="¿No sabes cuál te toca?"
        cuerpo="Cuéntame qué hace tu negocio y qué te está costando más trabajo. Con eso te digo por dónde empezar, aunque sea por lo más barato."
        servicio="otro"
      />
    </>
  );
}
