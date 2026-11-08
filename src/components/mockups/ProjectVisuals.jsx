import { ArrowUpRight, CalendarDays, Dice5, Facebook, Globe, Instagram, Mail, MapPin, MessageCircle, Music, Phone, Play, Sparkles } from 'lucide-react';

/* Las maquetas que se añadieron después traen su hoja propia. Solo la carga
   quien importa este archivo —el banco de horneado—, así que no viaja en el
   CSS del sitio: al sitio llegan ya horneadas como .webp. */
import './maquetas-caso.css';

/**
 * Ilustraciones de cada caso. Decorativas: el consumidor las marca aria-hidden.
 */

export function ConfettiVisual() {
  return (
    <div className="project-ui project-ui--confetti">
      <div className="project-browser-bar"><i /><i /><i /><span>confetti / panel de dueño</span></div>
      <div className="confetti-sidebar"><strong>C.</strong><i /><i /><i /><i /></div>
      <div className="confetti-dashboard">
        <small>BUEN DÍA, EQUIPO</small>
        <h4>Tres sucursales.<br />Una sola vista.</h4>
        <div className="confetti-metrics">
          <span><small>Pedidos</small><strong>28</strong><i /></span>
          <span><small>En preparación</small><strong>07</strong><i /></span>
          <span><small>Listos</small><strong>21</strong><i /></span>
        </div>
        <div className="confetti-chart">
          {[46, 72, 58, 88, 64, 92, 77].map((height, index) => (
            <i key={`${height}-${index}`} style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HipicoVisual() {
  return (
    <div className="project-ui project-ui--hipico">
      <div className="hipico-title">
        <span>JCH</span>
        <small>COTIZADOR / EVENTOS</small>
      </div>
      <div className="hipico-form">
        <span><small>TIPO DE EVENTO</small><strong>Boda</strong></span>
        <span><small>PERSONAS</small><strong>180</strong></span>
        <span><small>FECHA</small><strong>24 · 10 · 26</strong></span>
      </div>
      <div className="hipico-total">
        <small>PROPUESTA LISTA</small>
        <strong>Contrato + cotización</strong>
        <span className="hipico-total__action">Generar <ArrowUpRight size={14} /></span>
      </div>
    </div>
  );
}

export function FiestaVisual() {
  return (
    <div className="project-ui project-ui--fiesta">
      <div className="fiesta-disc">
        <span>FT</span>
        <i /><i /><i />
      </div>
      <div className="fiesta-copy">
        <small>PAQUETE / 03</small>
        <strong>La pista es tuya.</strong>
        <span>DJ · Audio · Iluminación · Ambientación</span>
        <div><i /><i /><i /><i /><i /></div>
      </div>
      <span className="fiesta-level">LEVEL <b>88</b></span>
    </div>
  );
}

export function BerlinVisual() {
  return (
    <div className="project-ui project-ui--berlin">
      <div className="berlin-receipt">
        <span>EB / 1974</span>
        <small>VENTA #01982</small>
        <i />
        <p>3 × Componentes</p>
        <p>1 × Servicio</p>
        <strong>TOTAL <em>$ 1,840</em></strong>
        <small>OPERACIÓN REGISTRADA ✓</small>
      </div>
      <div className="berlin-terminal">
        <span>+</span>
        <div><i /><i /><i /></div>
        <strong>LISTO<br />PARA COBRAR</strong>
        <span className="berlin-terminal__action">Aceptar</span>
      </div>
    </div>
  );
}


/* Los 21 puntos que devuelve el detector de manos, en palma abierta. */
const HAND_POINTS = [
  [50, 92], // muñeca
  [34, 84], [25, 74], [19, 65], [14, 57], // pulgar
  [41, 60], [37, 44], [35, 34], [33, 25], // índice
  [50, 57], [50, 40], [50, 29], [50, 20], // medio
  [59, 59], [62, 43], [64, 33], [66, 24], // anular
  [68, 64], [73, 52], [76, 44], [79, 37], // meñique
];

const HAND_BONES = [
  [0, 1, 2, 3, 4],
  [0, 5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
  [0, 17, 18, 19, 20],
  [5, 9, 13, 17],
];

export function GestechVisual() {
  return (
    <div className="project-ui project-ui--gestech">
      <div className="gestech-cam">
        <svg viewBox="0 0 100 100" role="presentation" focusable="false">
          {HAND_BONES.map((bone) => (
            <polyline key={bone.join('-')} points={bone.map((i) => HAND_POINTS[i].join(',')).join(' ')} />
          ))}
          {HAND_POINTS.map(([x, y], i) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={i === 8 ? 3.4 : 2} style={{ animationDelay: `${i * 45}ms` }} />
          ))}
        </svg>
        <span className="gestech-cam__rec"><i /> CÁMARA WEB</span>
        <span className="gestech-cam__box">mano detectada · 0.97</span>
        <span className="gestech-cursor" />
      </div>

      <div className="gestech-side">
        <span className="gestech-state">
          <b>IDLE</b>
          <em>→</em>
          <b className="on">ACTIVO</b>
        </span>
        <ul className="gestech-map">
          <li><i>✋</i> Palma abierta 1 s<span>activar</span></li>
          <li><i>☝️</i> Índice<span>mover cursor</span></li>
          <li><i>🤏</i> Pinza<span>clic</span></li>
          <li><i>✌️</i> Dos dedos<span>scroll</span></li>
          <li><i>✊</i> Puño 2 s<span>salir</span></li>
        </ul>
      </div>
    </div>
  );
}

/* Una cabina de fotos se reconoce por lo que escupe: la tira impresa. Antes
   eran tres rectángulos de degradado y no se leía qué producto era esto; ahora
   es una tira vertical con su margen blanco, recién salida y torcida, con
   siluetas de gente dentro y el destello del flash encima. */
export function PhotoBoothVisual() {
  return (
    <div className="project-ui project-ui--photobooth">
      <div className="booth-strip">
        {[0, 1, 2, 3].map((i) => (
          <span className={`booth-pic booth-pic--${i}`} key={i}>
            <b className="booth-person" />
            <b className="booth-person booth-person--two" />
          </span>
        ))}
        <em>MORPHIQ · PHOTO BOOTH</em>
      </div>

      <div className="booth-side">
        <span className="booth-lamp" aria-hidden="true" />
        <div className="booth-status">
          <span><i /> Sin internet — guardado local</span>
          <span><i /> 128 fotos en cola</span>
        </div>
      </div>

      <div className="booth-flash" />
    </div>
  );
}

export function ImaginationVisual() {
  return (
    <div className="project-ui project-ui--imagination">
      <div className="imagination-grid">
        {Array.from({ length: 24 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 6) * 140}ms` }} />)}
      </div>
      <div className="imagination-core">
        <span>?</span>
      </div>
      <p className="imagination-copy">Tú lo describes.<br />Lo construimos.</p>
    </div>
  );
}

/* Vero no vende una plantilla: vende que la asesora misma cambia su sitio sin
   pedirle permiso a nadie. Por eso el dibujo la sorprende a media edición
   —selección azul, cursor del ratón dentro de la frase, marco de «Encabezado»
   y el aviso de «Guardado»— encima de la página ya publicada, en vez de una
   pantalla de administrador aparte. */
export function VeroVisual() {
  return (
    <div className="project-ui project-ui--vero">
      {/* La barra oscura es el administrador; todo lo de abajo es el sitio real. */}
      <div className="vero-admin">
        <span className="vero-admin__tool">
          <svg viewBox="0 0 16 16" role="presentation" focusable="false">
            <path d="M11.3 1.8 14.2 4.7 5.7 13.2 1.9 14.1 2.8 10.3z" />
            <path d="M9.8 3.3 12.7 6.2" />
          </svg>
        </span>
        <b>Editando la página</b>
        <em>vista previa</em>
        <span className="vero-admin__publicar">Publicar</span>
      </div>

      <div className="vero-page">
        <div className="vero-nav">
          <span className="vero-mark">V</span>
          <em>Inicio</em>
          <em>Ramos</em>
          <em>Contacto</em>
        </div>

        <div className="vero-hero">
          <small className="vero-kicker">ASESORÍA EN SEGUROS · CDMX</small>

          {/* La frase del sitio, seleccionada y en edición. */}
          <div className="vero-edit">
            <span className="vero-edit__tab">
              Encabezado
              <i>B</i><i>I</i><i>U</i>
            </span>
            <strong className="vero-titular">
              Diez aseguradoras.<br />
              <span className="vero-sel">Una sola asesora.</span>
            </strong>
            <span className="vero-ibeam" />
            <span className="vero-guardado"><i>✓</i> Guardado</span>
          </div>

          <p className="vero-lead">
            Te explico la letra chica antes de firmar<br />
            y te acompaño el día del siniestro.
          </p>

          <div className="vero-ramos">
            <span className="on">Vida</span>
            <span>Auto</span>
            <span>Gastos médicos</span>
            <span>Hogar</span>
            <b>+4</b>
          </div>

          <span className="vero-cta">Cotizar mi seguro</span>
        </div>
      </div>
    </div>
  );
}

/* Lo que se vende no es la etiqueta pegada al escritorio, es lo que pasa al
   tocarla. El dibujo junta las dos mitades: el gesto físico del teléfono
   contra la pegatina y, debajo, la lista de lo que la computadora abre al
   entrar en el modo y cierra al salir. El matiz de que solo cierra lo que él
   abrió va aparte porque es la promesa que decide la compra. */
export function NfcVisual() {
  return (
    <div className="project-ui project-ui--nfc">
      <div className="nfc-scene">
        <div className="nfc-head">
          <small>NFC MANAGER · ETIQUETAS EN EL ESCRITORIO</small>
          <strong>Un toque.<br /><em>Otro modo.</em></strong>
        </div>

        <p className="nfc-note">La etiqueta solo lleva un número. Los modos viven en la PC.</p>

        <div className="nfc-tap">
          <svg className="nfc-wave" viewBox="0 0 200 200" role="presentation" focusable="false">
            <path d="M31.19 116.02 A34 34 0 0 1 63.68 154.73" />
            <path d="M32.09 90.04 A60 60 0 0 1 89.42 158.35" />
            <path d="M33.07 62.05 A88 88 0 0 1 117.14 162.25" />
            <path d="M34.12 32.07 A118 118 0 0 1 146.85 166.42" />
            <circle className="nfc-wave__ping" cx="30" cy="150" r="12" />
            <circle className="nfc-wave__dot" cx="30" cy="150" r="5.5" />
          </svg>

          <div className="nfc-phone">
            <i />
            <span className="nfc-phone__screen">
              <small>TAG 04 · LEÍDO</small>
              <b>Modo Diseño</b>
            </span>
          </div>

          <div className="nfc-tag">
            <svg className="nfc-tag__glyph" viewBox="0 0 24 24" role="presentation" focusable="false">
              <path d="M7 3.5a13 13 0 0 1 0 17" />
              <path d="M12 6.5a8.5 8.5 0 0 1 0 11" />
              <path d="M17 9.5a4 4 0 0 1 0 5" />
            </svg>
            <span>TAG 04</span>
          </div>
        </div>
      </div>

      <div className="nfc-mode">
        <div className="nfc-mode__head">
          <i />
          <strong>Modo Diseño</strong>
          <em>ACTIVO EN LA PC</em>
        </div>

        <div className="nfc-mode__cols">
          <div className="nfc-col">
            <span className="nfc-col__title"><b>Abre</b><small>al tocar</small></span>
            <ul>
              <li><i>+</i><em>Figma</em></li>
              <li><i>+</i><em>VS Code</em></li>
              <li><i>+</i><em>Carpeta del proyecto</em></li>
              <li><i>+</i><em>Playlist de foco</em></li>
            </ul>
          </div>

          <div className="nfc-col nfc-col--out">
            <span className="nfc-col__title"><b>Cierra</b><small>al desactivar</small></span>
            <ul>
              <li><i>×</i><em>Figma</em></li>
              <li><i>×</i><em>VS Code</em></li>
              <li><i>×</i><em>Carpeta del proyecto</em></li>
              <li><i>×</i><em>Playlist de foco</em></li>
            </ul>
          </div>
        </div>

        <div className="nfc-keep">
          <i />
          <span><b>Cierra solo lo que abrió.</b> Tu correo y tus pestañas de antes siguen ahí.</span>
          <em>SE RESPETA</em>
        </div>
      </div>
    </div>
  );
}

/* El portafolio académico se compra por una sola razón: actualizarlo no es
   pedirle nada a nadie. Así que el dibujo enseña el archivo de datos arriba y
   la página publicada abajo con la misma frase, palabra por palabra, y una
   flecha que las une. El mecanismo se ve entero, sin metáforas. */
export function AcademicoVisual() {
  return (
    <div className="project-ui project-ui--academico">
      <div className="aca-file">
        <div className="aca-file__bar">
          <i />
          <span>datos/publicaciones.js</span>
          <em>Guardar cambios</em>
        </div>

        <div className="aca-code">
          <p><i>1</i><span><b>export const</b> publicaciones <small>= [</small></span></p>
          <p className="aca-i1"><i>2</i><span><small>&#123;</small></span></p>
          <p className="aca-i2 aca-on">
            <i>3</i>
            <span>
              <b>titulo</b><small>:</small> <em>&quot;Ruido y señal en series de laboratorio&quot;</em><small>,</small>
              <em className="aca-caret" />
            </span>
          </p>
          <p className="aca-i2"><i>4</i><span><b>anio</b><small>:</small> <em>&quot;2026&quot;</em><small>,</small></span></p>
          <p className="aca-i2"><i>5</i><span><b>area</b><small>:</small> <em>&quot;métodos numéricos&quot;</em><small>,</small></span></p>
          <p className="aca-i2"><i>6</i><span><b>enlace</b><small>:</small> <em>&quot;/publicaciones/ruido-y-senal&quot;</em></span></p>
          <p className="aca-i1"><i>7</i><span><small>&#125;,</small></span></p>
          <p className="aca-i1"><i>8</i><span><small>&#123;</small> <b>titulo</b><small>:</small> <em>&quot;Notas sobre reproducibilidad&quot;</em><small>, … &#125;,</small></span></p>
          <p><i>9</i><span><small>]</small></span></p>
        </div>
      </div>

      <div className="aca-link">
        <svg viewBox="0 0 24 70" role="presentation" focusable="false">
          <path d="M12 3 V 55" />
          <path d="M4.5 49 L12 60 L19.5 49" />
        </svg>
        <span className="aca-pill">Guardas el archivo. El sitio cambia.</span>
      </div>

      <div className="aca-page">
        <div className="aca-page__bar">
          <i />
          <span>tu-sitio.mx/publicaciones</span>
          <em>publicado ✓</em>
        </div>

        <div className="aca-page__body">
          <small>PUBLICACIONES</small>
          <h4><strong>Ruido y señal en series de laboratorio</strong></h4>
          <span className="aca-meta">2026 · métodos numéricos</span>
          <div className="aca-rest">
            <span><b>2025</b><i>Notas sobre reproducibilidad</i></span>
            <span><b>2024</b><i>Lecturas del semestre</i></span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Una librería de componentes no se explica con un logotipo: se explica con el
   mismo botón repetido cuatro veces, cambiando solo el acabado —clay mate,
   glass translúcido, skeuo con relieve y adaptive plano cruzando la costura de
   claro y oscuro—. El dibujo va quieto a propósito: el material se mira. */
export function MorphiqUiVisual() {
  return (
    <div className="project-ui project-ui--morphiqui">
      <div className="mui-head">
        <i className="mui-head__dot" />
        <b>Morphiq UI</b>
        <em>4 materiales · una sola API</em>
      </div>

      <div className="mui-grid">
        <div className="mui-cell">
          <div className="mui-stage mui-stage--clay">
            <span className="mui-btn mui-btn--clay"><b>Continuar</b></span>
          </div>
          <small className="mui-name"><b>Clay</b><i>mate</i></small>
        </div>

        <div className="mui-cell">
          <div className="mui-stage mui-stage--glass">
            <i className="mui-blob mui-blob--a" />
            <i className="mui-blob mui-blob--b" />
            <i className="mui-blob mui-blob--c" />
            <span className="mui-btn mui-btn--glass"><b>Continuar</b></span>
          </div>
          <small className="mui-name"><b>Glass</b><i>translúcido</i></small>
        </div>

        <div className="mui-cell">
          <div className="mui-stage mui-stage--skeuo">
            <span className="mui-btn mui-btn--skeuo"><b>Continuar</b></span>
          </div>
          <small className="mui-name"><b>Skeuo</b><i>relieve</i></small>
        </div>

        <div className="mui-cell">
          <div className="mui-stage mui-stage--adaptive">
            <i className="mui-face">claro</i>
            <i className="mui-face mui-face--dark">oscuro</i>
            <span className="mui-btn mui-btn--adaptive"><b>Continuar</b></span>
          </div>
          <small className="mui-name"><b>Adaptive</b><i>claro y oscuro</i></small>
        </div>
      </div>

      <div className="mui-foot">
        <b className="mui-tag">&lt;<em>Button</em> /&gt;</b>
        <span>Mismo componente. Cambia el material, no el código.</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   LOS DOS SISTEMAS DEL SALÓN
   ------------------------------------------------------------
   Son sistemas internos con login —el CRM del salón y el portal de su
   cliente— y no tienen ninguna pantalla pública que se pueda enseñar. Así
   que estas ilustraciones no son capturas ni pretenden serlo: son el dibujo
   de lo que resuelven, con datos inventados. Ninguna lleva un nombre, un
   correo, un teléfono ni un identificador que exista de verdad.
   ------------------------------------------------------------ */

export function JchCrmVisual() {
  /* La versión anterior era una agenda con importes: honesta, pero se leía
     como «un panel de algo». Faltaban las dos cosas que hacen falta para
     entenderla sin leer: DE QUÉ negocio es y QUIÉN la usa.

     Ahora lo dice el dibujo: arriba, el salón con su nombre y el rótulo de
     quién está mirando; en medio, eventos con su tipo escrito con todas sus
     letras —boda, XV años— que es lo que hace reconocible un salón; y abajo,
     lo único que un dueño mira primero: cuánto le deben. */
  const eventos = [
    ['Boda', 'Sáb 24 oct', '180', 'Confirmado', 'ok'],
    ['XV años', 'Sáb 7 nov', '120', 'Apartado', 'medio'],
    ['Empresa', 'Vie 20 nov', '60', 'Cotizado', 'frio'],
  ];
  return (
    <div className="project-ui project-ui--jchcrm">
      <div className="jchcrm-marca">
        <span className="jchcrm-logo" aria-hidden="true">JCH</span>
        <span className="jchcrm-quien">
          <b>Salón de eventos</b>
          <small>PANEL DE LA CASA · SOLO PERSONAL</small>
        </span>
      </div>

      <div className="jchcrm-lista">
        {eventos.map(([tipo, fecha, gente, estado, tono]) => (
          <span key={tipo} className={`jchcrm-fila jchcrm-fila--${tono}`}>
            <span className="jchcrm-que">
              <b>{tipo}</b>
              <small>{fecha} · {gente} personas</small>
            </span>
            <i>{estado}</i>
          </span>
        ))}
      </div>

      <div className="jchcrm-cuenta">
        <span><small>CONTRATADO</small><strong>$86,400</strong></span>
        <span><small>COBRADO</small><strong>$52,000</strong></span>
        <span className="jchcrm-saldo"><small>FALTA POR COBRAR</small><strong>$34,400</strong></span>
      </div>
    </div>
  );
}

export function JchPortalVisual() {
  /* Lo mismo por el otro lado. Antes era una cuenta atrás con unos círculos:
     se entendía que faltaban 42 días para algo, pero no de qué ni de quién.

     Ahora el encabezado dice a quién pertenece la pantalla —«Tu evento», y
     el nombre del salón debajo—, y lo que ocupa el centro es la lista de
     decisiones del cliente escritas como lo que son: el cronograma, la
     música, las mesas y la invitación. Cualquiera que haya organizado una
     fiesta reconoce esa lista. */
  const tareas = [
    ['Cronograma', 'Listo', true],
    ['Música', 'Listo', true],
    ['Mesas', '12 de 14', false],
    ['Invitación', 'Por enviar', false],
  ];
  return (
    <div className="project-ui project-ui--jchportal">
      <div className="jchportal-marca">
        <span className="jchportal-quien">
          <small>TU EVENTO</small>
          <b>Boda · 24 de octubre</b>
        </span>
        <span className="jchportal-sede">Jardines Club Hípico</span>
      </div>

      <div className="jchportal-cuenta">
        <strong>42</strong>
        <span>días</span>
      </div>

      <div className="jchportal-tareas">
        {tareas.map(([que, estado, hecho]) => (
          <span key={que} className={hecho ? 'es-hecho' : ''}>
            <b>{que}</b>
            <i>{estado}</i>
          </span>
        ))}
      </div>

      <div className="jchportal-rsvp">
        <span className="jchportal-rsvp__dato">
          <strong>96</strong>
          <small>confirmados de 140</small>
        </span>
        <span className="jchportal-barra" aria-hidden="true"><i /></span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   LOS QUE SE SUMARON EN OCTUBRE
   ------------------------------------------------------------
   Mismas reglas que los demás: no son capturas, son el dibujo de lo que
   cada proyecto resuelve, con su paleta y su tono. Los datos son de
   ejemplo salvo los que el propio cliente publica en su sitio —precios de
   las membresías, nombre de un lanzamiento—. Ninguna lleva fotos de
   personas reales.
   ------------------------------------------------------------ */

/* El campo de caracteres de GLYPHOS se calcula aquí mismo, como lo haría el
   estudio: un planeta con su anillo sombreado por una luz que llega de
   arriba a la izquierda, sobre un polvo de glifos que se espesa cerca del
   planeta. Es determinista —misma semilla, mismo dibujo—, así que cada
   horneado sale idéntico. */
const RAMPA_GLYPHOS = ' .,:;-=+*#%@';

function campoGlyphos() {
  const COLS = 118;
  const FILAS = 60;
  const ASPECTO = 1.9; // alto de una celda entre su ancho
  let semilla = 417;
  const azar = () => {
    semilla = (semilla * 1664525 + 1013904223) % 4294967296;
    return semilla / 4294967296;
  };

  const cx = 72;
  const cy = 18.5 * ASPECTO;
  const R = 23;
  const giro = -0.3;
  const [cosG, sinG] = [Math.cos(giro), Math.sin(giro)];
  const [ejeA, ejeB] = [43, 10.5];
  const largo = Math.hypot(-0.45, -0.5, 0.74);
  const [lx, ly, lz] = [-0.45 / largo, -0.5 / largo, 0.74 / largo];

  /* Cuatro capas, de la más tenue a la más encendida: cada carácter cae en
     la capa que le toca por su brillo, y cada capa tiene su color. Así el
     planeta se sombrea de verdad, igual que en el estudio. */
  const capas = [[], [], [], []];
  for (let f = 0; f < FILAS; f += 1) {
    const lineas = ['', '', '', ''];
    for (let c = 0; c < COLS; c += 1) {
      const x = c - cx;
      const y = f * ASPECTO - cy;
      const d = Math.hypot(x, y) / R;
      const rx = (x * cosG + y * sinG) / ejeA;
      const ry = (-x * sinG + y * cosG) / ejeB;
      const rr = Math.hypot(rx, ry);
      const enAnillo = rr > 0.7 && rr < 1 && !(rr > 0.84 && rr < 0.88);
      const delante = ry > 0;

      let brillo = -1;
      if (d < 1) {
        const nx = x / R;
        const ny = y / R;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        const lambert = Math.max(0, nx * lx + ny * ly + nz * lz);
        /* Luz ambiente generosa y un filo de luz en el contorno: sin eso la
           mitad en sombra se pierde en el fondo y el planeta se lee como
           una media luna. */
        const filo = Math.pow(1 - nz, 3) * 0.35;
        brillo = 0.26 + 0.7 * lambert * (0.84 + 0.16 * Math.sin(ny * 11 + 1.2)) + filo;
        /* La sombra que el anillo proyecta sobre el planeta, justo debajo
           de su paso por delante. */
        if (ry > 1.05 && ry < 1.7 && Math.abs(rx) < 0.5) brillo *= 0.45;
      }
      if (enAnillo && (delante || d >= 1)) {
        const t = (rr - 0.7) / 0.3;
        brillo = (0.36 + 0.4 * Math.sin(t * Math.PI)) * (delante ? 1.12 : 0.78);
      }

      let caracter = ' ';
      let capa = -1;
      if (brillo >= 0) {
        const b = Math.min(1, brillo);
        caracter = RAMPA_GLYPHOS[Math.min(RAMPA_GLYPHOS.length - 1, Math.max(1, Math.round(b * (RAMPA_GLYPHOS.length - 1))))];
        capa = b < 0.22 ? 0 : b < 0.45 ? 1 : b < 0.72 ? 2 : 3;
      } else {
        const halo = d > 1 ? 0.26 * Math.exp(-(d - 1) * 2.4) : 0;
        if (azar() < 0.06 + halo) {
          caracter = RAMPA_GLYPHOS[1 + Math.floor(azar() * 4)];
          capa = 0;
        }
      }
      for (let k = 0; k < 4; k += 1) lineas[k] += k === capa ? caracter : ' ';
    }
    lineas.forEach((linea, k) => capas[k].push(linea));
  }
  return capas.map((filas) => filas.join('\n'));
}

const CAMPO_GLYPHOS = campoGlyphos();

export function GlyphosVisual() {
  return (
    <div className="project-ui project-ui--glyphos">
      {CAMPO_GLYPHOS.map((capa, k) => (
        <pre key={k} className={`glyphos-campo glyphos-campo--${k}`}>{capa}</pre>
      ))}
      <span className="glyphos-velo" />

      <div className="glyphos-barra">
        <span className="glyphos-marca">
          <i className="glyphos-puntos">
            {Array.from({ length: 9 }, (_, i) => (
              <b key={i} />
            ))}
          </i>
          GLYPHOS
        </span>
        <span className="glyphos-dado">
          <Dice5 size={15} strokeWidth={2.2} />
          Tirar el dado
        </span>
      </div>

      <div className="glyphos-receta">
        <small><span>EN EL FONDO</span><span>N.º 1</span></small>
        <b>Saturno</b>
        <span>semilla: faro-lunar-417</span>
      </div>

      <div className="glyphos-texto">
        <small><i />GLYPHOS <em>Teje luz con caracteres</em></small>
        <strong>Haz arte<br />ASCII.</strong>
      </div>

      <div className="glyphos-salidas">
        <b>SALE</b>
        <span>PNG</span><span>SVG</span><span>MP4</span><span>GIF</span><span>ANSI</span><span>REACT</span>
      </div>
    </div>
  );
}

export function BestMomentVisual() {
  const paquetes = ['01', '02', '03', '04', '05', '06'];
  return (
    <div className="project-ui project-ui--bestmoment">
      <div className="tbm-nav">
        <span className="tbm-logo">
          <i className="tbm-visor"><b>✦</b></i>
          <span>
            <small>THE BEST</small>
            <em>Moment</em>
          </span>
        </span>
        <span className="tbm-menu">
          <i>Portafolio</i>
          <i>Paquetes</i>
          <i>Fotolibros</i>
        </span>
      </div>

      <div className="tbm-cuerpo">
        <div className="tbm-texto">
          <small>BODAS · XV AÑOS · RETRATOS</small>
          <strong>
            El mejor
            <br />
            momento,
            <br />
            <em>para siempre.</em>
          </strong>
          <span className="tbm-cta">Consultar fecha <ArrowUpRight size={15} /></span>
        </div>
        <div className="tbm-fotos">
          <span className="tbm-foto tbm-foto--boda"><small>Bodas</small></span>
          <span className="tbm-foto tbm-foto--xv"><small>XV años</small></span>
          <span className="tbm-foto tbm-foto--retrato"><small>Retratos</small></span>
        </div>
      </div>

      <div className="tbm-paquetes">
        <small>PAQUETES</small>
        <span className="tbm-pildoras">
          {paquetes.map((n) => (
            <i key={n} className={n === '03' ? 'es-activo' : ''}>{n}</i>
          ))}
        </span>
        <span className="tbm-whats">
          <MessageCircle size={14} />
          Fecha por WhatsApp
        </span>
      </div>
    </div>
  );
}

export function EnlacesVisual() {
  return (
    <div className="project-ui project-ui--enlaces">
      <div className="enl-cab">
        <small>QR · NFC · BIO DE REDES</small>
        <b>Una dirección por negocio. <em>WhatsApp primero.</em></b>
      </div>

      <div className="enl-telefonos">
        {/* ---- Morphiq ---- */}
        <span className="enl-tel enl-tel--morphiq">
          <span className="enl-pantalla">
            <span className="enl-m-logo">Morphiq</span>
            <small className="enl-m-sub">ASTRAL MORPHIQ SYSTEMS</small>
            <small className="enl-m-hola">ESTUDIO DIGITAL</small>
            <b className="enl-m-nombre">Diseño y sistemas<i>.</i></b>
            <small className="enl-m-rol">Páginas web · Punto de venta · CRM</small>
            <span className="enl-m-boton enl-m-boton--wa"><MessageCircle size={11} />WhatsApp</span>
            <span className="enl-m-boton"><Phone size={11} />Llamada directa</span>
            <span className="enl-m-boton"><Mail size={11} />Correo electrónico</span>
            <span className="enl-m-boton"><Globe size={11} />Sitio web</span>
          </span>
        </span>

        {/* ---- Jardín La Palapa ---- */}
        <span className="enl-tel enl-tel--palapa">
          <span className="enl-pantalla">
            <span className="enl-p-logo">
              <small>Jardín</small>
              <b>La Palapa</b>
            </span>
            <small className="enl-p-sub">BODAS • XV AÑOS • EVENTOS</small>
            <span className="enl-p-cotiza">
              <i><MessageCircle size={13} /></i>
              <span><b>Cotiza tu evento</b><small>Escríbenos por WhatsApp</small></span>
            </span>
            <span className="enl-p-par">
              <span><CalendarDays size={12} />Agenda una visita</span>
              <span><MapPin size={12} />Cómo llegar</span>
            </span>
            <small className="enl-p-rotulo">CONTACTO</small>
            <span className="enl-p-fila"><Phone size={12} />Llamar a la oficina</span>
            <small className="enl-p-rotulo">TAMBIÉN HACEMOS</small>
            <span className="enl-p-par">
              <span><Sparkles size={12} />Rituales</span>
              <span><Music size={12} />Coreografías</span>
            </span>
          </span>
        </span>

        {/* ---- Fiesta Total DJ's ---- */}
        <span className="enl-tel enl-tel--fiesta">
          <span className="enl-pantalla">
            <span className="enl-f-disco" />
            <b className="enl-f-logo">FIESTA<br />TOTAL<small>DJ&apos;S</small></b>
            <b className="enl-f-lema">MÚSICA QUE ENCIENDE<em>TU MEJOR FIESTA</em></b>
            <span className="enl-f-boton enl-f-boton--wa"><i><MessageCircle size={12} /></i>WHATSAPP</span>
            <span className="enl-f-boton"><i><Globe size={12} /></i>PÁGINA WEB</span>
            <span className="enl-f-boton enl-f-boton--ig"><i><Instagram size={12} /></i>INSTAGRAM</span>
            <span className="enl-f-boton enl-f-boton--fb"><i><Facebook size={12} /></i>FACEBOOK</span>
          </span>
        </span>
      </div>
    </div>
  );
}

export function MorphiqPosVisual() {
  const modos = ['Tiendita', 'Cafetería', 'Restaurante', 'Ferretería', 'Estética'];
  const mesas = [
    ['1', 'libre', 'Libre'],
    ['2', 'ocupada', '2 pers.'],
    ['3', 'ocupada', '4 pers.'],
    ['4', 'activa', 'Cuenta'],
    ['5', 'libre', 'Libre'],
    ['6', 'reservada', '19:30'],
    ['7', 'ocupada', '3 pers.'],
    ['8', 'libre', 'Libre'],
  ];
  const ticket = [
    ['1', 'Café americano', '$35'],
    ['2', 'Chilaquiles verdes', '$190'],
    ['1', 'Jugo de naranja', '$45'],
    ['2', 'Agua de horchata', '$70'],
    ['1', 'Pan dulce', '$28'],
  ];
  return (
    <div className="project-ui project-ui--mpos">
      <div className="mpos-cab">
        <span className="mpos-marca"><i>M</i>MorphiqPOS</span>
        <span className="mpos-modos">
          {modos.map((m) => (
            <i key={m} className={m === 'Restaurante' ? 'es-activo' : ''}>{m}</i>
          ))}
        </span>
      </div>

      <div className="mpos-cuerpo">
        <div className="mpos-salon">
          <small>SALÓN · TURNO DE LA TARDE</small>
          <div className="mpos-mesas">
            {mesas.map(([n, estado, nota]) => (
              <span key={n} className={`mpos-mesa mpos-mesa--${estado}`}>
                <b>{n}</b>
                <i>{nota}</i>
              </span>
            ))}
          </div>
        </div>

        <div className="mpos-ticket">
          <span className="mpos-ticket__cab">
            <b>Mesa 4</b>
            <i>Mesero 02</i>
          </span>
          {ticket.map(([cant, que, cuanto]) => (
            <span key={que} className="mpos-linea">
              <em>{cant}×</em>
              <span>{que}</span>
              <i>{cuanto}</i>
            </span>
          ))}
          <span className="mpos-nota">Sin cebolla en los chilaquiles</span>
          <strong><em>TOTAL</em><i>$368</i></strong>
          <span className="mpos-cobrar">Cobrar $368</span>
        </div>
      </div>

      <div className="mpos-pie">
        <span>PIN por empleado</span>
        <span>Corre en local</span>
        <span className="es-acento">Cinco negocios, un sistema</span>
      </div>
    </div>
  );
}

/* El salón en isométrica. Se dibuja en planta —metros sobre el piso— y se
   proyecta aquí, así que mover una mesa es cambiar un número. */
const ISO = { s: 7.6, ox: 304, oy: 82 };
function iso(x, y, z = 0) {
  return [(x - y) * 0.866 * ISO.s + ISO.ox, (x + y) * 0.5 * ISO.s - z * ISO.s + ISO.oy];
}
function puntos(lista) {
  return lista.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');
}

const SALON = { ancho: 56, fondo: 40, alto: 9 };
const MESAS_3D = (() => {
  const lista = [];
  const filas = [7, 15, 31, 38];
  const columnas = [7, 15, 41, 49];
  filas.forEach((y) => columnas.forEach((x) => lista.push({ x, y })));
  lista.push({ x: 28, y: 35 }, { x: 22, y: 36 }, { x: 34, y: 36 });
  return lista.sort((a, b) => a.x + a.y - (b.x + b.y));
})();

export function Jch3dVisual() {
  const piso = [iso(0, 0), iso(SALON.ancho, 0), iso(SALON.ancho, SALON.fondo), iso(0, SALON.fondo)];
  const muroFondo = [iso(0, 0), iso(SALON.ancho, 0), iso(SALON.ancho, 0, SALON.alto), iso(0, 0, SALON.alto)];
  const muroLado = [iso(0, 0), iso(0, SALON.fondo), iso(0, SALON.fondo, SALON.alto), iso(0, 0, SALON.alto)];
  const canto = [iso(SALON.ancho, 0), iso(SALON.ancho, SALON.fondo), iso(SALON.ancho, SALON.fondo, -1.4), iso(SALON.ancho, 0, -1.4)];
  const cantoFrente = [iso(0, SALON.fondo), iso(SALON.ancho, SALON.fondo), iso(SALON.ancho, SALON.fondo, -1.4), iso(0, SALON.fondo, -1.4)];
  const pista = [iso(20, 14), iso(36, 14), iso(36, 27), iso(20, 27)];
  const escenario = [iso(14, 0.3, 1.2), iso(42, 0.3, 1.2), iso(42, 4.5, 1.2), iso(14, 4.5, 1.2)];
  const escenarioFrente = [iso(14, 4.5, 1.2), iso(42, 4.5, 1.2), iso(42, 4.5), iso(14, 4.5)];

  return (
    <div className="project-ui project-ui--jch3d">
      <div className="j3d-barra">
        <span className="j3d-marca"><i>JCH</i><span><b>3D STUDIO</b><small>JARDINES CLUB HÍPICO</small></span></span>
        <span className="j3d-vistas">
          <i className="es-activo">Vista 3D</i>
          <i>Planta</i>
          <i>Desde la entrada</i>
        </span>
        <span className="j3d-compartir">Compartir <ArrowUpRight size={13} /></span>
      </div>

      <div className="j3d-cuerpo">
        <svg className="j3d-salon" viewBox="0 0 712 470" role="presentation" focusable="false">
          <polygon points={puntos(muroFondo)} className="j3d-muro" />
          <polygon points={puntos(muroLado)} className="j3d-muro j3d-muro--lado" />
          {Array.from({ length: 6 }, (_, i) => {
            const x = 6 + i * 9;
            return <polygon key={i} points={puntos([iso(x, 0, 2.2), iso(x + 5, 0, 2.2), iso(x + 5, 0, 7.2), iso(x, 0, 7.2)])} className="j3d-espejo" />;
          })}
          <polygon points={puntos(cantoFrente)} className="j3d-canto" />
          <polygon points={puntos(canto)} className="j3d-canto j3d-canto--lado" />
          <polygon points={puntos(piso)} className="j3d-piso" />
          <polygon points={puntos(pista)} className="j3d-pista" />
          <polygon points={puntos(escenarioFrente)} className="j3d-escenario-frente" />
          <polygon points={puntos(escenario)} className="j3d-escenario" />
          <text x={iso(28, 20.5)[0]} y={iso(28, 20.5)[1] + 4} className="j3d-rotulo">PISTA</text>

          {MESAS_3D.map(({ x, y }, k) => {
            const [tx, ty] = iso(x, y, 1.6);
            const [sx, sy] = iso(x, y);
            const elegida = x === 15 && y === 31;
            const sillas = Array.from({ length: 8 }, (_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return iso(x + Math.cos(a) * 3.3, y + Math.sin(a) * 3.3, 0.9);
            });
            return (
              <g key={k} className={elegida ? 'j3d-mesa es-elegida' : 'j3d-mesa'}>
                <ellipse cx={sx + 3} cy={sy + 2} rx={2.6 * 1.2247 * ISO.s} ry={2.6 * 0.7071 * ISO.s} className="j3d-sombra" />
                {sillas
                  .filter(([, py]) => py < ty)
                  .map(([px, py], i) => (
                    <ellipse key={`a${i}`} cx={px} cy={py} rx={4.4} ry={2.7} className="j3d-silla" />
                  ))}
                <ellipse cx={tx} cy={ty} rx={1.9 * 1.2247 * ISO.s} ry={1.9 * 0.7071 * ISO.s} className="j3d-mantel" />
                {sillas
                  .filter(([, py]) => py >= ty)
                  .map(([px, py], i) => (
                    <ellipse key={`b${i}`} cx={px} cy={py} rx={4.4} ry={2.7} className="j3d-silla" />
                  ))}
              </g>
            );
          })}
        </svg>

      </div>

      <div className="j3d-panel">
        <span className="j3d-titulo">
          <small>DISEÑA TU EVENTO</small>
          <b>Salón de los Espejos</b>
        </span>
        <span className="j3d-dato"><i>Mesas</i><em>19</em></span>
        <span className="j3d-dato"><i>Sillas</i><em>152</em></span>
        <span className="j3d-dato j3d-dato--barra">
          <i>Confirmados</i>
          <em>128 / 152</em>
          <span><b /></span>
        </span>
        <span className="j3d-elegida">
          <small>MESA M7</small>
          Redonda · 8 sillas
        </span>
      </div>

      <div className="j3d-pie">
        <span>19 mesas · 152 sillas</span>
        <span className="es-ok">Sin cruces de huellas</span>
        <span>Visor sin internet</span>
      </div>
    </div>
  );
}

export function JchBaileVisual() {
  const ritmos = ['Salsa', 'Bachata', 'Cumbia', 'Merengue', 'Danzón', 'Cha-cha-chá'];
  const planes = [
    ['Esencial', '4 clases al mes', '$300'],
    ['Constante', '8 clases al mes', '$600'],
    ['Intensivo', '12 clases al mes', '$800'],
  ];
  return (
    <div className="project-ui project-ui--jchbaile">
      <span className="baile-luz" />
      <div className="baile-cab">
        <span className="baile-logo"><i>JCH</i><em>Baile</em></span>
        <span className="baile-cta">Quiero bailar <ArrowUpRight size={14} /></span>
      </div>

      <div className="baile-texto">
        <small className="baile-pildora">PRÓXIMAMENTE · XOCHIMILCO</small>
        <strong>Tu cuerpo<br />ya sabe.</strong>
        <em>Solo hay que escucharlo.</em>
      </div>

      <div className="baile-ritmos">
        {ritmos.map((r) => (
          <i key={r}>{r}</i>
        ))}
      </div>

      <div className="baile-ritmo">
        <span className="baile-ritmo__boton"><Play size={14} fill="currentColor" /></span>
        <span className="baile-ritmo__onda">
          {[30, 62, 44, 88, 52, 70, 36, 96, 58, 74, 40, 82, 50, 66, 34, 90, 56, 72, 42, 86, 48, 64, 38, 78].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </span>
        <small>ACTIVAR RITMO</small>
      </div>

      <div className="baile-planes">
        {planes.map(([nombre, clases, precio]) => (
          <span key={nombre} className={nombre === 'Constante' ? 'es-destacado' : ''}>
            <small>{nombre}</small>
            <b>{precio}<i>/mes</i></b>
            <em>{clases}</em>
          </span>
        ))}
      </div>
    </div>
  );
}

export function XaviVisual() {
  const barras = [38, 72, 54, 90, 62, 100, 70, 46, 84, 58, 96, 66];
  return (
    <div className="project-ui project-ui--xavi">
      <span className="xavi-luz" />
      <div className="xavi-cab">
        <b>XV<sup>MTZ</sup></b>
        <span>LANZAMIENTOS · SPOTIFY · BOOKING</span>
      </div>

      <div className="xavi-intro">
        <b>✦</b>
        <p>DJ &amp; producer building a catalog between house, dance and electronic music.</p>
        <small>INDEPENDENT ARTIST · CDMX</small>
      </div>

      <div className="xavi-disco">
        <span className="xavi-portada"><i /></span>
        <span className="xavi-disco__texto">
          <small>/ 01 · ÚLTIMO LANZAMIENTO</small>
          <b>Childhood</b>
          <em>EP</em>
        </span>
      </div>

      <div className="xavi-texto">
        <small><i>||||</i>HOUSE FROM MEXICO CITY</small>
        <strong>THE XAVI</strong>
        <strong className="xavi-mtz">MTZ</strong>
      </div>

      <div className="xavi-pie">
        <span className="xavi-spotify">LISTEN ON SPOTIFY <ArrowUpRight size={14} /></span>
        <span className="xavi-eq">
          {barras.map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </span>
        <b>MAKE THE ROOM <em>MOVE.</em></b>
      </div>
    </div>
  );
}
