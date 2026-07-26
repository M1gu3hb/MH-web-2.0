import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../data';

function ConfettiVisual() {
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
        <div className="confetti-chart">{[46, 72, 58, 88, 64, 92, 77].map((height, index) => <i key={`${height}-${index}`} style={{ height: `${height}%` }} />)}</div>
      </div>
    </div>
  );
}

function HipicoVisual() {
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
        <button type="button">Generar <ArrowUpRight size={14} /></button>
      </div>
    </div>
  );
}

function FiestaVisual() {
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

function BerlinVisual() {
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
        <button type="button">Aceptar</button>
      </div>
    </div>
  );
}

const VISUALS = {
  confetti: ConfettiVisual,
  hipico: HipicoVisual,
  fiesta: FiestaVisual,
  berlin: BerlinVisual,
};

function ProjectScene({ project, index }) {
  const Visual = VISUALS[project.visual];
  return (
    <article
      className="project-scene"
      style={{ '--scene-accent': project.accent, '--scene-surface': project.surface, '--stack-index': index }}
    >
      <div className="project-scene__meta">
        <span>CASO / {project.index}</span>
        <span>NEGOCIO REAL · CDMX</span>
      </div>
      <div className="project-scene__layout">
        <div className="project-scene__copy">
          <p>{project.category}</p>
          <h3>{project.client}</h3>
          <span>{project.description}</span>
          <div>
            {project.tags.map((tag) => <small key={tag}>{tag}</small>)}
          </div>
        </div>
        <div className="project-scene__visual">
          <Visual />
          <span className="project-scene__visual-index">{project.index}</span>
        </div>
      </div>
    </article>
  );
}

export function WorkSection() {
  return (
    <section className="work section-pad" id="trabajo">
      <div className="work__heading">
        <p className="section-index">02 / TRABAJO REAL</p>
        <h2>Diseño con pulso.<br /><span>Sistemas con oficio.</span></h2>
        <p>Proyectos concretos para negocios reales. Cada pieza tiene una personalidad distinta porque cada operación también la tiene.</p>
      </div>
      <div className="project-stack">
        {PROJECTS.map((project, index) => <ProjectScene key={project.client} project={project} index={index} />)}
      </div>
      <p className="work__truth">Sin testimonios inventados. Sin métricas de humo. Alcance claro, producto real y contacto directo.</p>
    </section>
  );
}
