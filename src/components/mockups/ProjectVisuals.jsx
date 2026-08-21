import { ArrowUpRight } from 'lucide-react';

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
      <p className="imagination-copy">Tú lo describes.<br />Yo lo construyo.</p>
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

/* A Qyro lo define por dónde NO pasa el archivo. La nube va tachada arriba y
   el único camino dibujado es la línea recta de un aparato al otro, con el
   código de emparejamiento y la misma huella a los dos lados: la prueba de que
   entre ellos no hay nadie. */
export function QyroVisual() {
  return (
    <div className="project-ui project-ui--qyro">
      <div className="qyro-sky">
        <svg className="qyro-sky__arcs" viewBox="0 0 100 40" preserveAspectRatio="none" role="presentation" focusable="false">
          <path d="M4 40 C4 26 18 22 36 22" />
          <path d="M96 40 C96 26 82 22 64 22" />
        </svg>

        <svg className="qyro-cloud" viewBox="0 0 100 56" role="presentation" focusable="false">
          <path
            className="qyro-cloud__shape"
            d="M24 50 C10 50 10 30 24 29 C24 12 48 8 54 22 C62 12 80 16 80 29 C93 29 93 50 80 50 Z"
          />
          <line className="qyro-cloud__slash" x1="8" y1="52" x2="94" y2="6" />
        </svg>

        <span className="qyro-sky__label"><b>SIN NUBE</b> · SIN CUENTA · SIN SERVIDOR</span>
      </div>

      <div className="qyro-link">
        <div className="qyro-dev">
          <span className="qyro-dev__bar"><i /></span>
          <small className="qyro-dev__tag">APARATO QUE ENVÍA</small>

          <div className="qyro-file">
            <i className="qyro-file__page" />
            <b>contrato.pdf</b>
            <em>4.2 MB</em>
          </div>

          <div className="qyro-key">
            <small>CÓDIGO DEL QUE RECIBE</small>
            <b>K7 4M 92<i /></b>
          </div>

          <small className="qyro-fp"><i />huella 4F·A9·D1</small>
        </div>

        <div className="qyro-wire">
          <small>RED LOCAL</small>
          <span className="qyro-wire__line">
            <b className="qyro-packet">PDF</b>
          </span>
          <small>cifrado · verificado</small>
        </div>

        <div className="qyro-dev qyro-dev--to">
          <span className="qyro-dev__bar"><i /></span>
          <small className="qyro-dev__tag">APARATO QUE RECIBE</small>

          <strong className="qyro-code"><b>K7</b><b>4M</b><b>92</b></strong>
          <em className="qyro-hint">Este código se teclea allá</em>

          <small className="qyro-fp"><i />huella 4F·A9·D1</small>
        </div>
      </div>

      <p className="qyro-note">De aquí a allá.<br />Sin pasar por <b>nadie</b>.</p>
    </div>
  );
}
