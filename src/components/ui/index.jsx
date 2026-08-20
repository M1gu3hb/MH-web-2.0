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
import { BordeElectrico, CampoPuntos, GlareHover, Reveal, ScrambleText, SpotlightCard, StarBorder } from '../reactbits';
import { Cortina, Titular } from '../motion';
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
export function TituloSeccion({
  eyebrow,
  titulo,
  entrada,
  nivel: Nivel = 'h2',
  centrado = false,
  className = '',
  /* `editorial` reparte el encabezado en dos columnas: el titular grande a
     la izquierda y la entrada abajo a la derecha. Es lo que evita el
     problema de la iteración anterior —un título pequeño arriba a la
     izquierda y el 65 % del monitor sin hacer nada—, porque el encabezado
     pasa a ocupar el ancho de la sección en vez de una columna de 46ch.
     Por debajo de 1000 px vuelve a una sola columna, que es lo correcto:
     dos columnas en una tableta no son composición, son estrechez. */
  variante = 'editorial',
  /* Contenido opcional para la columna derecha cuando la entrada no basta:
     un dato, un enlace, una cifra. */
  aparte,
}) {
  const modo = centrado ? 'centro' : variante;

  return (
    <header className={`titulo-seccion titulo-seccion--${modo} ${className}`}>
      <div className="titulo-seccion__principal">
        {eyebrow && (
          <Reveal>
            <p className="titulo-seccion__eyebrow">
              <ScrambleText text={eyebrow} trigger="view" />
            </p>
          </Reveal>
        )}
        {/* El texto se desfragmenta al entrar en pantalla y al pasar el
            cursor. Es la firma del sitio de producción y lo que hace que un
            título se lea como una señal y no como una etiqueta. El texto
            real permanece en el DOM: el efecto pinta encima. */}
        <Cortina>
          <Nivel className="titulo-seccion__titulo">
            <ScrambleText text={titulo} trigger="both" />
          </Nivel>
        </Cortina>
      </div>

      {(entrada || aparte) && (
        <Reveal delay={0.12} className="titulo-seccion__aparte">
          {entrada && <p className="titulo-seccion__entrada">{entrada}</p>}
          {aparte}
        </Reveal>
      )}
    </header>
  );
}

/* ------------------------------------------------------------
   Statement — el nivel A de la escala
   ------------------------------------------------------------
   Reservado para los mensajes que pueden dominar una pantalla: el cierre de
   la home, la cabecera de contacto, la frase que abre el proceso. No es un
   `TituloSeccion` más grande: es otra cosa. Ocupa el ancho amplio, se
   alinea a la izquierda, va sin caja y sus líneas entran una a una tras su
   propia máscara.

   El azul entra por `resalte`: una palabra del titular, no el titular
   entero. Es el gesto del cierre de producción —el mensaje en plata y una
   parte en azul eléctrico— y la razón de que ese bloque se lea como un
   final y no como otra sección más.
   ------------------------------------------------------------ */

export function Statement({
  lineas,
  eyebrow,
  kicker,
  /* Un fragmento del titular que se pinta en azul. Es el único uso del
     acento a este tamaño: una palabra, no un párrafo. Si el fragmento no
     aparece literalmente en el texto, la línea se pinta entera en plata y
     no pasa nada —nunca se recorta ni se inventa texto. */
  resalte,
  nivel = 'h2',
  className = '',
  children,
  regla = true,
}) {
  const partes = Array.isArray(lineas) ? lineas : [lineas];

  return (
    <div className={`statement ${className}`}>
      {(eyebrow || kicker) && (
        <div className={`statement__cinta ${regla ? 'statement__cinta--regla' : ''}`}>
          {eyebrow && (
            <span className="statement__eyebrow">
              <ScrambleText text={eyebrow} trigger="view" />
            </span>
          )}
          {kicker && <span className="statement__kicker">{kicker}</span>}
        </div>
      )}

      <Titular
        as={nivel}
        className="statement__titulo"
        lineas={partes.map((linea, i) => (
          <span key={i} className="statement__voz">
            {conResalte(linea, resalte)}
          </span>
        ))}
      />

      {children && <div className="statement__pie">{children}</div>}
    </div>
  );
}

function conResalte(linea, resalte) {
  if (!resalte || typeof linea !== 'string') return linea;
  const i = linea.indexOf(resalte);
  if (i === -1) return linea;
  return (
    <>
      {linea.slice(0, i)}
      <em className="statement__acento">{resalte}</em>
      {linea.slice(i + resalte.length)}
    </>
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
  /* SpotlightCard y StarBorder son los mismos que usaba la sección de
     paquetes en producción: el foco que sigue al cursor y el filo de luz
     que recorre la tarjeta destacada. Sin ellos las tarjetas de precio
     eran rectángulos, y un precio en un rectángulo se siente barato. */
  const cuerpo = (
    <SpotlightCard
      className={`plan ${plan.destacado ? 'plan--destacado' : ''}`}
      accent={plan.destacado ? '#0a66ff' : '#4f95ff'}
      as="article"
    >
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

      {/* Qué mueve el precio, al mismo nivel que lo que incluye y no
          escondido en una nota. Un «desde» sin esto es un anzuelo: el
          visitante se entera de lo que encarece su proyecto en la llamada,
          que es justo cuando peor sienta. */}
      {detallada && plan.subeSi && (
        <div className="plan__grupo plan__grupo--sube">
          <p className="plan__grupo-titulo">Sube de precio si</p>
          <ul className="plan__lista plan__lista--sube">
            {plan.subeSi.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {plan.nota && <p className="plan__nota">{plan.nota}</p>}

      {detallada && plan.salida && <p className="plan__salida">{plan.salida}</p>}

      <BotonPrincipal to={contactoCon(servicio ?? servicioPorFamilia(plan))} className="plan__cta">
        {plan.cta}
      </BotonPrincipal>
    </SpotlightCard>
  );

  if (!plan.destacado) return cuerpo;
  return (
    <StarBorder color="#0a66ff" speed={7} className="plan__marco">
      {cuerpo}
    </StarBorder>
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

export function CierreCTA({
  titulo,
  cuerpo,
  servicio,
  etiqueta = 'Cuéntame tu proyecto',
  /* El cierre acepta el titular como dos líneas para poder pintar la segunda
     en azul, que es el gesto del cierre de producción. Si llega una cadena
     suelta se parte por el último signo de puntuación, y si no hay por
     dónde partir se queda en una línea: nunca se corta una frase a mitad. */
  lineas,
  kicker = '¿Tienes una idea?',
  eyebrow = 'Contacto directo',
}) {
  const partes = lineas ?? partirCierre(titulo);

  return (
    <Seccion tono="acento" className="cierre">
      {/* La retícula de puntos vive solo en escritorio con puntero fino y se
          para al salir de pantalla. En cualquier otro caso el bloque se
          queda con su degradado, que ya funciona solo. */}
      <CampoPuntos className="cierre__campo" />

      <div className="contenedor contenedor--amplio">
        <Statement
          lineas={partes}
          eyebrow={eyebrow}
          kicker={kicker}
          className="cierre__statement"
        >
          <div className="cierre__reparto">
            <p className="cierre__cuerpo">{cuerpo}</p>
            <div className="cierre__acciones">
              <BordeElectrico radio={999} className="cierre__chispa">
                <BotonPrincipal to={contactoCon(servicio)} grande>
                  {etiqueta}
                </BotonPrincipal>
              </BordeElectrico>
              <BotonWhatsApp origen="contact" grande />
            </div>
          </div>
          <p className="cierre__nota">
            Respondo yo, no un formulario automático. Si prefieres verme la cara, también hago videollamada.
          </p>
        </Statement>
      </div>
    </Seccion>
  );
}

/* Parte «¿Empezamos? Hablemos.» en sus dos frases para que la segunda pueda
   ir en azul. Sin puntuación intermedia devuelve la frase entera: partir por
   número de palabras produciría cortes absurdos. */
function partirCierre(texto) {
  const corte = texto.search(/(?<=[.?!¿¡])\s+(?=\S)/);
  if (corte === -1) return [texto];
  return [texto.slice(0, corte + 1).trim(), texto.slice(corte + 1).trim()];
}

/* ------------------------------------------------------------
   Tarjeta de proyecto
   ------------------------------------------------------------ */

export function TarjetaProyecto({ proyecto, ruta }) {
  return (
    <article className="tarjeta-proyecto" style={{ '--acento': proyecto.acento }}>
      <Link to={ruta} className="tarjeta-proyecto__enlace">
        {/* GlareHover pasa una lámina de luz por encima al acercarse: es el
            mismo gesto de metal reflejado del resto de la marca, y aquí
            además hace que la maqueta parezca una pantalla y no una foto. */}
        <GlareHover className="tarjeta-proyecto__imagen">
          <span className="tarjeta-proyecto__marco" aria-hidden="true" />
          <img src={proyecto.imagen} alt={`Maqueta del proyecto ${proyecto.nombre}`} loading="lazy" width="760" height="480" />
        </GlareHover>
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

export function CabeceraPagina({ migas, eyebrow, titulo, entrada, acciones, acento, imagen, maqueta, aparte }) {
  return (
    <header className="cabecera-pagina" style={acento ? { '--acento': acento } : undefined}>
      {/* La cabecera de producción no era un degradado plano: tenía señal.
          Esto es la versión barata de eso —una retícula técnica y un barrido
          de luz, todo en CSS y todo animado con transform— para que las
          páginas interiores no se sientan de otro sitio. */}
      <span className="cabecera-pagina__senal" aria-hidden="true">
        <span className="cabecera-pagina__retic" />
        <span className="cabecera-pagina__barrido" />
      </span>
      <Contenedor>
        {migas && <Migas ruta={migas} />}
        <div className={`cabecera-pagina__reparto ${imagen || maqueta || aparte ? 'cabecera-pagina__reparto--con-imagen' : ''}`}>
          <div className="cabecera-pagina__texto">
            {eyebrow && (
              <p className="cabecera-pagina__eyebrow">
                <ScrambleText text={eyebrow} trigger="view" />
              </p>
            )}
            <h1 className="cabecera-pagina__titulo">
              <ScrambleText text={titulo} trigger="both" />
            </h1>
            {entrada && <p className="cabecera-pagina__entrada">{entrada}</p>}
            {acciones && <div className="cabecera-pagina__acciones">{acciones}</div>}
          </div>
          {/* En las páginas de servicio, en vez de una foto va la maqueta
              real de ese servicio: la página demuestra de qué habla desde el
              primer pantallazo. */}
          {maqueta && (
            <div className="cabecera-pagina__maqueta" aria-hidden="true">
              <div className="cabecera-pagina__pantalla">{maqueta}</div>
            </div>
          )}
          {/* Para las páginas sin maqueta: en vez de dejar media cabecera
              vacía, se pone algo que el visitante quiere ver ahí mismo. */}
          {aparte && <div className="cabecera-pagina__aparte">{aparte}</div>}
          {!maqueta && !aparte && imagen && (
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
