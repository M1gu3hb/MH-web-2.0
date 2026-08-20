/**
 * ============================================================
 * CAPA COMPARTIDA DE INTERFAZ
 * ============================================================
 *
 * Los ladrillos que usan todas las páginas nuevas. Se apoyan en los tokens
 * que ya existían (`tokens.css`) y en las primitivas de reactbits que ya
 * estaban en el proyecto: aquí no se reinventa nada que ya funcionara.
 *
 * La regla para entrar en este archivo es aparecer en tres páginas o más.
 * Lo que solo usa una página vive con esa página.
 */

import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, ChevronDown, MessageCircle } from 'lucide-react';
import { useId, useState } from 'react';
import { Reveal } from '../reactbits';
import { RUTAS, contactoCon } from '../../config/rutas';
import { precioDe } from '../../config/pricing';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';

/* ------------------------------------------------------------
   Contenedor y secciones
   ------------------------------------------------------------ */

export function Contenedor({ children, ancho = 'normal', className = '' }) {
  return <div className={`contenedor contenedor--${ancho} ${className}`}>{children}</div>;
}

export function Seccion({ children, tono = 'base', className = '', id, ...resto }) {
  return (
    <section id={id} className={`seccion seccion--${tono} ${className}`} {...resto}>
      {children}
    </section>
  );
}

/**
 * Encabezado de sección. `nivel` decide la etiqueta real (h2 por defecto)
 * para que la jerarquía del documento sea correcta y no dependa del tamaño
 * visual que le apetezca al diseño.
 */
export function TituloSeccion({ eyebrow, titulo, entrada, nivel: Nivel = 'h2', centrado = false, className = '' }) {
  return (
    <Reveal>
      <header className={`titulo-seccion ${centrado ? 'titulo-seccion--centro' : ''} ${className}`}>
        {eyebrow && <p className="titulo-seccion__eyebrow">{eyebrow}</p>}
        <Nivel className="titulo-seccion__titulo">{titulo}</Nivel>
        {entrada && <p className="titulo-seccion__entrada">{entrada}</p>}
      </header>
    </Reveal>
  );
}

/* ------------------------------------------------------------
   Migas de pan
   ------------------------------------------------------------ */

export function Migas({ ruta }) {
  return (
    <nav className="migas" aria-label="Ruta de navegación">
      <ol>
        {ruta.map((paso, i) => {
          const ultimo = i === ruta.length - 1;
          return (
            <li key={paso.path}>
              {ultimo ? (
                <span aria-current="page">{paso.nombre}</span>
              ) : (
                <>
                  <Link to={paso.path}>{paso.nombre}</Link>
                  <span className="migas__sep" aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------
   Botones
   ------------------------------------------------------------ */

export function BotonPrincipal({ to, href, children, grande = false, className = '', ...resto }) {
  const clase = `tactile-button tactile-button--glow ${grande ? 'tactile-button--large' : ''} ${className}`;
  if (to) {
    return (
      <Link className={clase} to={to} {...resto}>
        {children}
        <ArrowUpRight size={grande ? 17 : 16} aria-hidden="true" />
      </Link>
    );
  }
  return (
    <a className={clase} href={href} {...resto}>
      {children}
      <ArrowUpRight size={grande ? 17 : 16} aria-hidden="true" />
    </a>
  );
}

export function BotonSecundario({ to, href, children, grande = false, className = '', ...resto }) {
  const clase = `tactile-button tactile-button--paper ${grande ? 'tactile-button--large' : ''} ${className}`;
  if (to) {
    return (
      <Link className={clase} to={to} {...resto}>
        {children}
        <ArrowUpRight size={grande ? 17 : 16} aria-hidden="true" />
      </Link>
    );
  }
  return (
    <a className={clase} href={href} {...resto}>
      {children}
      <ArrowUpRight size={grande ? 17 : 16} aria-hidden="true" />
    </a>
  );
}

export function BotonWhatsApp({ origen = 'contact', children = 'Escríbeme por WhatsApp', grande = false }) {
  return (
    <a
      className={`tactile-button tactile-button--paper ${grande ? 'tactile-button--large' : ''}`}
      href={whatsappUrl(origen)}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackWhatsApp(origen)}
    >
      <MessageCircle size={grande ? 17 : 16} aria-hidden="true" />
      {children}
    </a>
  );
}

/* ------------------------------------------------------------
   Precio
   ------------------------------------------------------------
   Un solo componente pinta el precio en todo el sitio, y siempre con
   «Desde» delante. Que la palabra sea imposible de omitir es deliberado:
   es la diferencia entre un precio honesto y un anzuelo. */

export function Precio({ plan, tamano = 'normal' }) {
  const p = precioDe(plan);
  return (
    <p className={`precio precio--${tamano}`}>
      {p.prefijo && <span className="precio__prefijo">{p.prefijo}</span>}
      <span className="precio__importe">{p.importe}</span>
      {p.periodo && <span className="precio__periodo">{p.periodo}</span>}
      {p.extra && <span className="precio__extra">{p.extra}</span>}
    </p>
  );
}

/* ------------------------------------------------------------
   Tarjeta de plan
   ------------------------------------------------------------ */

/** A qué opción del formulario lleva cada plan cuando nadie lo dice explícitamente. */
const SERVICIO_POR_PLAN = {
  'web-esencial': 'pagina-web',
  'web-profesional': 'pagina-web',
  mantenimiento: 'mantenimiento',
  crm: 'crm',
  'punto-de-venta': 'sistema',
  ecosistema: 'otro',
  restaurantes: 'restaurante',
};

function servicioPorFamilia(plan) {
  return SERVICIO_POR_PLAN[plan.id] ?? 'otro';
}

export function TarjetaPlan({ plan, detallada = false, servicio }) {
  return (
    <article className={`plan ${plan.destacado ? 'plan--destacado' : ''}`}>
      {plan.destacado && <span className="plan__sello">Más pedido</span>}

      <header className="plan__cabeza">
        <h3 className="plan__nombre">{plan.nombre}</h3>
        <Precio plan={plan} />
        <p className="plan__resumen">{plan.resumen}</p>
      </header>

      {plan.paraQuien && (
        <p className="plan__para">
          <strong>Para quién:</strong> {plan.paraQuien}
        </p>
      )}

      {plan.incluye && (
        <div className="plan__grupo">
          <p className="plan__grupo-titulo">Incluye siempre</p>
          <ul className="plan__lista">
            {plan.incluye.map((i) => (
              <li key={i}>
                <Check size={14} aria-hidden="true" />
                {i}
              </li>
            ))}
          </ul>
        </div>
      )}

      {detallada && plan.puedeIncluir && (
        <div className="plan__grupo">
          <p className="plan__grupo-titulo">Puede incluir, según el proyecto</p>
          <ul className="plan__lista plan__lista--opcional">
            {plan.puedeIncluir.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {detallada && plan.noIncluye && (
        <div className="plan__grupo">
          <p className="plan__grupo-titulo">No incluye</p>
          <ul className="plan__lista plan__lista--fuera">
            {plan.noIncluye.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {plan.nota && <p className="plan__nota">{plan.nota}</p>}

      <BotonPrincipal to={contactoCon(servicio ?? servicioPorFamilia(plan))} className="plan__cta">
        {plan.cta}
      </BotonPrincipal>
    </article>
  );
}

/* ------------------------------------------------------------
   Acordeón accesible
   ------------------------------------------------------------
   Botón real, `aria-expanded` y panel enlazado por id. La respuesta se
   queda en el DOM aunque esté plegada: Google la lee y quien busca con
   Ctrl+F la encuentra. */

function ItemAcordeon({ pregunta, respuesta, indice }) {
  const [abierto, setAbierto] = useState(false);
  const id = useId();
  return (
    <div className={`acordeon__item ${abierto ? 'is-abierto' : ''}`}>
      <h3 className="acordeon__titulo">
        <button
          type="button"
          id={`${id}-boton`}
          aria-expanded={abierto}
          aria-controls={`${id}-panel`}
          onClick={() => setAbierto((v) => !v)}
        >
          <span className="acordeon__indice" aria-hidden="true">
            {String(indice + 1).padStart(2, '0')}
          </span>
          <span className="acordeon__pregunta">{pregunta}</span>
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      </h3>
      <div className="acordeon__panel" id={`${id}-panel`} role="region" aria-labelledby={`${id}-boton`} hidden={!abierto}>
        <p>{respuesta}</p>
      </div>
    </div>
  );
}

export function Acordeon({ items }) {
  return (
    <div className="acordeon">
      {items.map((item, i) => (
        <ItemAcordeon key={item.q} pregunta={item.q} respuesta={item.a} indice={i} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------
   Cierre de página
   ------------------------------------------------------------ */

export function CierreCTA({ titulo, cuerpo, servicio, etiqueta = 'Cuéntame tu proyecto' }) {
  return (
    <Seccion tono="acento" className="cierre">
      <Contenedor ancho="estrecho">
        <Reveal>
          <div className="cierre__caja">
            <h2 className="cierre__titulo">{titulo}</h2>
            <p className="cierre__cuerpo">{cuerpo}</p>
            <div className="cierre__acciones">
              <BotonPrincipal to={contactoCon(servicio)} grande>
                {etiqueta}
              </BotonPrincipal>
              <BotonWhatsApp origen="contact" grande />
            </div>
            <p className="cierre__nota">
              Respondo yo, no un formulario automático. Si prefieres verme la cara, también hago videollamada.
            </p>
          </div>
        </Reveal>
      </Contenedor>
    </Seccion>
  );
}

/* ------------------------------------------------------------
   Tarjeta de proyecto
   ------------------------------------------------------------ */

export function TarjetaProyecto({ proyecto, ruta }) {
  return (
    <article className="tarjeta-proyecto" style={{ '--acento': proyecto.acento }}>
      <Link to={ruta} className="tarjeta-proyecto__enlace">
        <div className="tarjeta-proyecto__imagen">
          <img src={proyecto.imagen} alt={`Maqueta del proyecto ${proyecto.nombre}`} loading="lazy" width="760" height="480" />
        </div>
        <div className="tarjeta-proyecto__cuerpo">
          <p className="tarjeta-proyecto__industria">{proyecto.industria}</p>
          <h3 className="tarjeta-proyecto__nombre">{proyecto.nombre}</h3>
          <p className="tarjeta-proyecto__tipo">{proyecto.tipo}</p>
          <p className="tarjeta-proyecto__resumen">{proyecto.resumen}</p>
          <ul className="tarjeta-proyecto__etiquetas">
            {proyecto.etiquetas.slice(0, 4).map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
          <span className="tarjeta-proyecto__ver">
            Ver el caso
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

/* ------------------------------------------------------------
   Tarjeta de servicio (el distribuidor de la home y de /servicios)
   ------------------------------------------------------------ */

export function TarjetaServicio({ servicio, grande = false }) {
  return (
    <article className={`tarjeta-servicio ${grande ? 'tarjeta-servicio--grande' : ''}`} style={{ '--acento': servicio.acento }}>
      <Link to={servicio.ruta} className="tarjeta-servicio__enlace">
        <div className="tarjeta-servicio__imagen">
          <img
            src={servicio.imagenSq ?? servicio.imagen}
            alt=""
            loading="lazy"
            width="480"
            height="480"
            aria-hidden="true"
          />
        </div>
        <div className="tarjeta-servicio__cuerpo">
          <h3 className="tarjeta-servicio__nombre">{servicio.nombre}</h3>
          <p className="tarjeta-servicio__promesa">{servicio.promesa}</p>
          <p className="tarjeta-servicio__para">{servicio.paraTi}</p>
          <ul className="tarjeta-servicio__puntos">
            {servicio.puntos.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <span className="tarjeta-servicio__ver">
            Ver el servicio
            <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}

/* ------------------------------------------------------------
   Cabecera de página interior
   ------------------------------------------------------------ */

export function CabeceraPagina({ migas, eyebrow, titulo, entrada, acciones, acento, imagen }) {
  return (
    <header className="cabecera-pagina" style={acento ? { '--acento': acento } : undefined}>
      <Contenedor>
        {migas && <Migas ruta={migas} />}
        <div className={`cabecera-pagina__reparto ${imagen ? 'cabecera-pagina__reparto--con-imagen' : ''}`}>
          <div className="cabecera-pagina__texto">
            {eyebrow && <p className="cabecera-pagina__eyebrow">{eyebrow}</p>}
            <h1 className="cabecera-pagina__titulo">{titulo}</h1>
            {entrada && <p className="cabecera-pagina__entrada">{entrada}</p>}
            {acciones && <div className="cabecera-pagina__acciones">{acciones}</div>}
          </div>
          {imagen && (
            <div className="cabecera-pagina__imagen">
              <img src={imagen} alt="" aria-hidden="true" width="640" height="640" fetchpriority="high" />
            </div>
          )}
        </div>
      </Contenedor>
    </header>
  );
}

export { RUTAS, contactoCon };
