/**
 * /sobre-morphiq
 *
 * Morphiq es una persona con una marca, no una agencia con veinte empleados,
 * y el sitio no finge lo contrario. Para el cliente pequeño eso no es una
 * debilidad: es exactamente la razón por la que contrata aquí y no en una
 * agencia donde nunca habla con quien construye.
 */

import { Github, Mail, MapPin, MessageCircle } from 'lucide-react';
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
import { Seo, nodoMigas, nodoPagina } from '../lib/seo';
import { DOMINIO, RUTAS } from '../config/rutas';
import { CONTACT } from '../content';
import { gmailUrl } from '../lib/correo';

const MIGAS = [
  { nombre: 'Inicio', path: RUTAS.inicio },
  { nombre: 'Sobre Morphiq', path: RUTAS.sobre },
];

const TITLE = 'Sobre Morphiq: quién está detrás | Morphiq';
const DESC =
  'Morphiq es el estudio de Miguel Huerta Bautista en CDMX. Diseño y construyo páginas web, sistemas y automatizaciones para negocios. Tratas conmigo, no con una cuenta.';

const PRINCIPIOS = [
  {
    titulo: 'Precio cerrado antes de empezar',
    cuerpo:
      'Te digo cuánto cuesta y ese número no se mueve. Si calculé mal, es mi problema. Prefiero perder margen a que descubras un cargo nuevo a mitad del proyecto.',
  },
  {
    titulo: 'Tratas conmigo',
    cuerpo:
      'No hay ejecutivo de cuenta que te traduzca. Quien te contesta es quien diseña y quien programa, así que la respuesta llega completa a la primera.',
  },
  {
    titulo: 'Ves avances, no reportes',
    cuerpo:
      'Cada semana hay algo funcionando que puedes abrir. No presentaciones bonitas: producto. Y si algo no te late, se cambia cuando todavía es barato cambiarlo.',
  },
  {
    titulo: 'Te digo cuando no me necesitas',
    cuerpo:
      'Si con el plan más barato te alcanza, te lo digo. Si lo que necesitas ya lo resuelve una herramienta que puedes contratar por trescientos pesos al mes, también.',
  },
  {
    titulo: 'Lo que construyo es tuyo',
    cuerpo:
      'El dominio queda a tu nombre y el proyecto es tuyo. Si mañana quieres llevártelo con otra persona, te lo llevas. No secuestro proyectos.',
  },
  {
    titulo: 'Sin permanencia',
    cuerpo:
      'Los servicios mensuales se cancelan cuando quieras. Si me quedo con tu proyecto es porque te sirvo, no porque firmaste algo hace dos años.',
  },
];

const PROCESO = [
  { titulo: 'Entender', cuerpo: 'Me cuentas cómo funciona tu negocio hoy. Sin tecnicismos, como se lo contarías a alguien de tu familia.' },
  { titulo: 'Definir el alcance', cuerpo: 'Te digo qué se puede hacer, qué conviene dejar para después y cuánto cuesta. Por escrito.' },
  { titulo: 'Primera dirección', cuerpo: 'Te enseño una propuesta visual antes de programar nada. Es el momento más barato para cambiar de idea.' },
  { titulo: 'Avances', cuerpo: 'Vas viendo el proyecto funcionando. Opinas sobre distribución, contenido, estilo, fotos y qué va primero.' },
  { titulo: 'Ajustes', cuerpo: 'Se corrige lo que haga falta dentro del alcance. No son revisiones infinitas, pero tampoco es «tómalo o déjalo».' },
  { titulo: 'Desarrollo y pruebas', cuerpo: 'Se construye lo que falta y se prueba en teléfono, tablet y computadora antes de que lo vea nadie.' },
  { titulo: 'Publicación', cuerpo: 'Sale en línea, te capacito si lleva panel y te acompaño los primeros días.' },
];

export default function Sobre() {
  const grafo = [
    nodoPagina({ path: RUTAS.sobre, title: TITLE, description: DESC }),
    nodoMigas(MIGAS),
    { '@id': `${DOMINIO}/#miguel` },
  ];

  return (
    <>
      <Seo title={TITLE} description={DESC} path={RUTAS.sobre} grafo={grafo} />

      <CabeceraPagina
        migas={MIGAS}
        eyebrow="Sobre Morphiq"
        titulo="Hola, soy Miguel. Yo construyo todo esto."
        entrada="Morphiq no es una agencia con veinte personas. Es un estudio, y el estudio soy yo: diseño, programo, publico y contesto el WhatsApp."
        aparte={
          <div className="tarjeta-firma">
            <span className="firma3d" translate="no" aria-label="MH97">MH97</span>
            <p>Miguel Huerta Bautista</p>
            <small>Director · Diseñador · Desarrollador</small>
          </div>
        }
        acciones={
          <>
            <BotonPrincipal to={RUTAS.contacto} grande>
              Hablemos
            </BotonPrincipal>
            <BotonSecundario to={RUTAS.proyectos} grande>
              Ver lo que he construido
            </BotonSecundario>
          </>
        }
      />

      {/* ---- La historia ---- */}
      <Seccion>
        <Contenedor ancho="estrecho">
          <div className="bio">
            <Reveal>
              <p className="bio__parrafo bio__parrafo--destacado">
                Empecé haciendo páginas para negocios de mi zona y acabé construyendo los sistemas con los que
                operan por dentro. Hoy hay varios negocios cobrando, cotizando y organizando su día en cosas que
                escribí yo.
              </p>
            </Reveal>
            <Reveal>
              <p className="bio__parrafo">
                Me pasa seguido que alguien llega pidiendo «una página» y a los diez minutos de plática resulta
                que lo que le duele es otra cosa: que se le caen los pedidos, que no sabe qué tiene en bodega, que
                cotiza tres veces lo mismo. Por eso Morphiq no vende solo páginas. Vende que tu negocio funcione
                mejor por dentro, y la página es la parte que se ve.
              </p>
            </Reveal>
            <Reveal>
              <p className="bio__parrafo">
                Trabajo desde Xochimilco, en la Ciudad de México. Si tu negocio está en la ciudad y hace falta,
                voy a verte: entender una operación en persona ahorra semanas de malentendidos. Y si estás fuera,
                el proceso funciona igual por videollamada.
              </p>
            </Reveal>
            <Reveal>
              <p className="bio__parrafo">
                Lo que hago está publicado. Los proyectos de este sitio tienen enlace directo y buena parte del
                código está abierto en GitHub. Es la forma más honesta que se me ocurre de que no tengas que
                creerme nada.
              </p>
            </Reveal>

            <Reveal>
              <div className="bio__enlaces">
                <a href="https://github.com/M1gu3hb" target="_blank" rel="noreferrer">
                  <Github size={17} aria-hidden="true" />
                  github.com/M1gu3hb
                </a>
                <a href={gmailUrl(CONTACT.emailPersonal)} target="_blank" rel="noreferrer">
                  <Mail size={17} aria-hidden="true" />
                  {CONTACT.emailPersonal}
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

      {/* ---- Cómo trabajo ---- */}
      <Seccion tono="elevado">
        <Contenedor>
          <TituloSeccion
            eyebrow="Cómo trabajo"
            titulo="Seis cosas que no negocio."
            entrada="No son valores de folleto. Son las reglas por las que puedes reclamarme si no las cumplo."
          />
          <div className="principios">
            {PRINCIPIOS.map((p, i) => (
              <Reveal key={p.titulo} delay={i * 0.05}>
                <article className="principio">
                  <h3>{p.titulo}</h3>
                  <p>{p.cuerpo}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Contenedor>
      </Seccion>

      {/* ---- El proceso ---- */}
      <Seccion>
        <Contenedor>
          <TituloSeccion
            eyebrow="El proceso"
            titulo="Qué pasa desde que me escribes hasta que sale en línea."
            entrada="Lo importante: no desapareces del proceso. Vas viendo y vas opinando."
          />
          <ol className="proceso-largo">
            {PROCESO.map((paso, i) => (
              <Reveal key={paso.titulo} delay={i * 0.04}>
                <li>
                  <span className="proceso-largo__numero" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>{paso.titulo}</h3>
                    <p>{paso.cuerpo}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal>
            <p className="proceso-largo__nota">
              Sobre los cambios, para que no haya sorpresas: los ajustes dentro del alcance acordado van
              incluidos. Los que amplían el alcance se cotizan aparte, y lo hablamos antes de hacerlos, nunca en
              la factura final. No prometo revisiones infinitas porque nadie que las promete las cumple.
            </p>
          </Reveal>
        </Contenedor>
      </Seccion>

      <CierreCTA
        titulo="¿Nos conocemos?"
        cuerpo="Cuéntame qué hace tu negocio. Aunque todavía no sepas qué necesitas, con una plática corta salimos de dudas los dos."
        servicio="otro"
        etiqueta="Escribirle a Miguel"
      />
    </>
  );
}
