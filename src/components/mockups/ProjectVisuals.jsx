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

export function PhotoBoothVisual() {
  return (
    <div className="project-ui project-ui--photobooth">
      <div className="booth-frame">
        <span className="booth-shot" />
        <span className="booth-shot" />
        <span className="booth-shot" />
        <em>FOLIO · MH-2481</em>
      </div>
      <div className="booth-status">
        <span><i /> Sin internet — guardado local</span>
        <span><i /> 128 fotos en cola</span>
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
