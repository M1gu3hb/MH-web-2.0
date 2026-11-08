/**
 * /sobre-morphiq
 *
 * Presenta a Morphiq como lo que es para el cliente: un equipo que diseña y
 * construye, con precio cerrado y un asesor que lo acompaña de principio a
 * fin. Sin cifras de plantilla ni promesas que no se puedan sostener.
 */

import { Mail, MapPin } from 'lucide-react';
import {
  BotonPrincipal,
  BotonSecundario,
  CabeceraPagina,
  CierreCTA,
  Contenedor,
  Seccion,
  TituloSeccion,
} from '../components/ui';
import { Reveal } from '../components/reactbits';
import { Cascada, Cortina, Secuencia } from '../components/motion';
import { Seo, nodoMigas, nodoPagina } from '../lib/seo';
import { RUTAS } from '../config/rutas';
import { CONTACT } from '../content';
import { gmailUrl } from '../lib/correo';

const MIGAS = [
  { nombre: 'Inicio', path: RUTAS.inicio },
  { nombre: 'Sobre Morphiq', path: RUTAS.sobre },
];

const TITLE = 'Sobre Morphiq: el equipo detrás | Morphiq';
const DESC =
  'Somos un equipo de diseño y desarrollo en CDMX. Construimos páginas web, sistemas y automatizaciones para negocios, con precio cerrado y un asesor en cada proyecto.';

const PRINCIPIOS = [
  {
    titulo: 'Precio cerrado antes de empezar',
    cuerpo:
      'Te decimos cuánto cuesta y ese número no se mueve. Si calculamos mal, es problema nuestro. Preferimos perder margen a que descubras un cargo nuevo a mitad del proyecto.',
  },
  {
    titulo: 'Un asesor desde el primer día',
    cuerpo:
      'Tu proyecto tiene un asesor que te contesta, coordina al equipo que diseña y programa, y te mantiene al tanto. Nadie te manda de un área a otra.',
  },
  {
    titulo: 'Ves avances, no reportes',
    cuerpo:
      'Cada semana hay algo funcionando que puedes abrir. No presentaciones bonitas: producto. Y si algo no te late, se cambia cuando todavía es barato cambiarlo.',
  },
  {
    titulo: 'Te decimos cuando no nos necesitas',
    cuerpo:
      'Si con el plan más barato te alcanza, te lo decimos. Si lo que necesitas ya lo resuelve una herramienta que puedes contratar por trescientos pesos al mes, también.',
  },
  {
    titulo: 'Lo que construimos es tuyo',
    cuerpo:
      'El dominio queda a tu nombre y el proyecto es tuyo. Si mañana quieres llevártelo con otra persona, te lo llevas. No secuestramos proyectos.',
  },
  {
    titulo: 'Sin permanencia',
    cuerpo:
      'Los servicios mensuales se cancelan cuando quieras. Si seguimos con tu proyecto es porque te servimos, no porque firmaste algo hace dos años.',
  },
];

const PROCESO = [
  { titulo: 'Entender', cuerpo: 'Nos cuentas cómo funciona tu negocio hoy. Sin tecnicismos, como se lo contarías a alguien de tu familia.' },
  { titulo: 'Definir el alcance', cuerpo: 'Te decimos qué se puede hacer, qué conviene dejar para después y cuánto cuesta. Por escrito.' },
  { titulo: 'Primera dirección', cuerpo: 'Te enseñamos una propuesta visual antes de programar nada. Es el momento más barato para cambiar de idea.' },
  { titulo: 'Avances', cuerpo: 'Vas viendo el proyecto funcionando. Opinas sobre distribución, contenido, estilo, fotos y qué va primero.' },
  { titulo: 'Ajustes', cuerpo: 'Se corrige lo que haga falta dentro del alcance. No son revisiones infinitas, pero tampoco es «tómalo o déjalo».' },
  { titulo: 'Desarrollo y pruebas', cuerpo: 'Se construye lo que falta y se prueba en teléfono, tablet y computadora antes de que lo vea nadie.' },
  { titulo: 'Publicación', cuerpo: 'Sale en línea, te capacitamos si lleva panel y te acompañamos los primeros días.' },
];

export default function Sobre() {
  const grafo = [
    nodoPagina({ path: RUTAS.sobre, title: TITLE, description: DESC }),
    nodoMigas(MIGAS),
  ];

  return (
    <>
      <Seo title={TITLE} description={DESC} path={RUTAS.sobre} grafo={grafo} />

      <CabeceraPagina
        migas={MIGAS}
        eyebrow="Sobre Morphiq"
        titulo="Somos un equipo. Construimos todo esto."
        resalte="Construimos todo esto."
        entrada="Morphiq es un estudio de diseño y desarrollo: un equipo que diseña, programa, publica y te acompaña de principio a fin."
        aparte={
          <div className="tarjeta-firma">
            <span className="firma3d" translate="no" aria-label="Morphiq">MORPHIQ</span>
            <p>Astral Morphiq Systems</p>
            <small>Diseño · Desarrollo · Sistemas</small>
          </div>
        }
        acciones={
          <>
            <BotonPrincipal to={RUTAS.contacto} grande>
              Hablemos
            </BotonPrincipal>
            <BotonSecundario to={RUTAS.proyectos} grande>
              Ver lo que hemos construido
            </BotonSecundario>
          </>
        }
      />

      {/* ---- La historia ---- */}
      <Seccion>
        <Contenedor ancho="medio">
          <div className="bio">
            {/* CORTINA en el párrafo de entrada: es la frase que abre la
                historia y conviene que se descubra, no que se deslice. */}
            <Cortina>
              <p className="bio__parrafo bio__parrafo--destacado">
                Empezamos haciendo páginas para negocios locales y acabamos construyendo los sistemas con los que
                operan por dentro. Hoy hay varios negocios cobrando, cotizando y organizando su día en cosas que
                construimos nosotros.
              </p>
            </Cortina>
            <Reveal>
              <p className="bio__parrafo">
                Nos pasa seguido que alguien llega pidiendo «una página» y a los diez minutos de plática resulta
                que lo que le duele es otra cosa: que se le caen los pedidos, que no sabe qué tiene en bodega, que
                cotiza tres veces lo mismo. Por eso Morphiq no vende solo páginas. Vende que tu negocio funcione
                mejor por dentro, y la página es la parte que se ve.
              </p>
            </Reveal>
            <Reveal>
              <p className="bio__parrafo">
                Trabajamos desde la Ciudad de México. Si tu negocio está en la ciudad y hace falta, vamos a verte:
                entender una operación en persona ahorra semanas de malentendidos. Y si estás fuera, el proceso
                funciona igual por videollamada.
              </p>
            </Reveal>
            <Reveal>
              <p className="bio__parrafo">
                Lo que hacemos está publicado: los proyectos de este sitio que están en línea llevan su enlace
                directo. Es la forma más honesta que se nos ocurre de que no tengas que creernos nada.
              </p>
            </Reveal>

            <Reveal>
              <div className="bio__enlaces">
                <a href={gmailUrl(CONTACT.email)} target="_blank" rel="noreferrer">
                  <Mail size={17} aria-hidden="true" />
                  {CONTACT.email}
                </a>
                <span>
                  <MapPin size={17} aria-hidden="true" />
                  {CONTACT.location}
                </span>
              </div>
            </Reveal>
          </div>
        </Contenedor>
      </Seccion>

      {/* ---- Cómo trabajamos ---- */}
      <Seccion tono="elevado">
        <Contenedor>
          <TituloSeccion
            eyebrow="Cómo trabajamos"
            titulo="Seis cosas que no negociamos."
            entrada="No son valores de folleto. Son las reglas por las que puedes reclamarnos si no las cumplimos."
          />
          <Cascada className="principios" paso={0.05}>
            {PRINCIPIOS.map((p) => (
              <article key={p.titulo} className="principio">
                <h3>{p.titulo}</h3>
                <p>{p.cuerpo}</p>
              </article>
            ))}
          </Cascada>
        </Contenedor>
      </Seccion>

      {/* ---- El proceso ---- */}
      <Seccion>
        <Contenedor>
          <TituloSeccion
            eyebrow="El proceso"
            titulo="Qué pasa desde que nos escribes hasta que sale en línea."
            entrada="Lo importante: no desapareces del proceso. Vas viendo y vas opinando."
          />
          {/* SECUENCIA. Siete pasos que se encienden uno a uno al bajar:
              es un proceso, y verlo construirse es más honesto que verlo
              aparecer entero de golpe. */}
          <Secuencia as="ol" className="proceso-largo" paso={0.04}>
            {PROCESO.map((paso, i) => (
              <li key={paso.titulo}>
                <span className="proceso-largo__numero" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{paso.titulo}</h3>
                  <p>{paso.cuerpo}</p>
                </div>
              </li>
            ))}
          </Secuencia>
          <Reveal>
            <p className="proceso-largo__nota">
              Sobre los cambios, para que no haya sorpresas: los ajustes dentro del alcance acordado van
              incluidos. Los que amplían el alcance se cotizan aparte, y lo hablamos antes de hacerlos, nunca en
              la factura final. No prometemos revisiones infinitas porque nadie que las promete las cumple.
            </p>
          </Reveal>
        </Contenedor>
      </Seccion>

      <CierreCTA
        titulo="¿Nos conocemos?"
        cuerpo="Cuéntanos qué hace tu negocio. Aunque todavía no sepas qué necesitas, con una plática corta salimos de dudas todos."
        servicio="otro"
        etiqueta="Hablar con un asesor"
      />
    </>
  );
}
