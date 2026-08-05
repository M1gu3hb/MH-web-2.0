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

