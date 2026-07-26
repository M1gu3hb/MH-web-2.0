import { useState } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { CAPABILITIES } from '../data';

function WebsiteScreen() {
  return (
    <div className="demo demo--website">
      <div className="demo-browser">
        <span><i /><i /><i /></span>
        <em>tu-negocio.mx</em>
        <b>PUBLICADO</b>
      </div>
      <div className="website-canvas">
        <small>UNA MARCA CON PUNTO DE VISTA</small>
        <strong>Lo primero que ven.<br />Lo último que olvidan.</strong>
        <span>Explorar <ArrowUpRight size={13} /></span>
        <div className="website-orb" />
      </div>
    </div>
  );
}

function PosScreen() {
  return (
    <div className="demo demo--pos">
      <div className="pos-head">
        <span><i /> CAJA ABIERTA</span>
        <strong>$ 1,248.00</strong>
      </div>
      <div className="pos-body">
        <div className="pos-ticket">
          <small>ORDEN #0284</small>
          <span><b>2</b> Producto especial <em>$420</em></span>
          <span><b>1</b> Servicio adicional <em>$280</em></span>
          <span><b>3</b> Complemento <em>$548</em></span>
          <strong>TOTAL <em>$1,248</em></strong>
        </div>
        <div className="pos-pad">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((number) => <i key={number}>{number}</i>)}
          <button type="button">Cobrar</button>
        </div>
      </div>
    </div>
  );
}

function CrmScreen() {
  const columns = [
    ['NUEVO', 'Confetti', 'Berlín'],
    ['PROPUESTA', 'Club Hípico'],
    ['LISTO', "Fiesta DJ's"],
  ];

  return (
    <div className="demo demo--crm">
      <div className="crm-head">
        <span>PIPELINE / JULIO</span>
        <strong>Todo visible</strong>
        <i />
      </div>
      <div className="crm-board">
        {columns.map(([title, ...items], index) => (
          <div key={title}>
            <small>{title}<em>0{items.length}</em></small>
            {items.map((item) => (
              <span key={item}>
                <i>{item.slice(0, 2).toUpperCase()}</i>
                <b>{item}</b>
                <em>{index === 2 ? '100%' : index === 1 ? '68%' : '24%'}</em>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function AutomationScreen() {
  return (
    <div className="demo demo--automation">
      <div className="automation-grid" aria-hidden="true" />
      <div className="automation-flow">
        <span className="flow-node flow-node--start"><i /> Nueva solicitud</span>
        <span className="flow-line flow-line--one" />
        <span className="flow-node flow-node--decision">Validar datos <b>✓</b></span>
        <span className="flow-line flow-line--two" />
        <span className="flow-node flow-node--doc">Generar documento <i>PDF</i></span>
        <span className="flow-line flow-line--three" />
        <span className="flow-node flow-node--end"><i /> WhatsApp enviado</span>
      </div>
      <span className="automation-status"><i /> Flujo operando</span>
    </div>
  );
}

const SCREENS = {
  website: WebsiteScreen,
  pos: PosScreen,
  crm: CrmScreen,
  automation: AutomationScreen,
};

export function CapabilityDeck() {
  const [activeId, setActiveId] = useState(CAPABILITIES[0].id);
  const active = CAPABILITIES.find((item) => item.id === activeId) ?? CAPABILITIES[0];
  const Screen = SCREENS[active.screen];

  return (
    <>
      <section className="manifesto">
        <div className="manifesto__label">
          <span>01</span>
          <p>Dos disciplinas.<br />Una sola visión.</p>
        </div>
        <p className="manifesto__statement">
          Diseño la <strong>cara visible</strong> y construyo la <em>máquina detrás.</em>
        </p>
        <div className="manifesto__stamp">
          <span>MH97</span>
          <small>DESIGN × SYSTEMS<br />CDMX</small>
        </div>
      </section>

      <section className="capabilities section-pad" id="servicios">
        <div className="section-heading">
          <p className="section-index">01 / CAPACIDADES</p>
          <h2>Un estudio.<br /><span>Cuatro frentes.</span></h2>
          <p>No vendo una colección de herramientas sueltas. Diseño cómo se conectan para que tu negocio se vea mejor y funcione mejor.</p>
        </div>

        <div className="capability-deck">
          <div className="capability-deck__selector" role="tablist" aria-label="Explorar capacidades">
            {CAPABILITIES.map((item) => {
              const selected = item.id === active.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="capability-panel"
                  className={selected ? 'active' : ''}
                  onClick={() => setActiveId(item.id)}
                  style={{ '--accent': item.accent }}
                >
                  <span>{item.index}</span>
                  <strong>{item.label}</strong>
                  <i>{selected ? 'ACTIVO' : 'ABRIR'}</i>
                  <ArrowUpRight size={18} />
                </button>
              );
            })}
          </div>

          <div
            className="capability-deck__panel"
            id="capability-panel"
            role="tabpanel"
            style={{ '--accent': active.accent, '--panel-ink': active.ink, '--panel-fg': active.foreground }}
          >
            <div className="panel-chrome">
              <span>MH / SYSTEM VIEW</span>
              <span><i /> INTERACTIVO</span>
            </div>
            <div className="panel-content">
              <AnimatePresence mode="wait">
                <Motion.div
                  className="panel-copy"
                  key={`copy-${active.id}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p>{active.index} / {active.eyebrow}</p>
                  <h3>{active.title}</h3>
                  <span>{active.description}</span>
                  <div className="panel-tags">
                    {active.tags.map((tag) => <small key={tag}><Check size={12} />{tag}</small>)}
                  </div>
                </Motion.div>
              </AnimatePresence>

              <div className="panel-screen-wrap">
                <span className="panel-screen-wrap__screw panel-screen-wrap__screw--tl" />
                <span className="panel-screen-wrap__screw panel-screen-wrap__screw--tr" />
                <span className="panel-screen-wrap__screw panel-screen-wrap__screw--bl" />
                <span className="panel-screen-wrap__screw panel-screen-wrap__screw--br" />
                <AnimatePresence mode="wait">
                  <Motion.div
                    key={`screen-${active.id}`}
                    className="panel-screen-motion"
                    initial={{ opacity: 0, scale: 0.97, rotateX: 3 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Screen />
                  </Motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="panel-controls">
              <span><i /> Módulo conectado</span>
              <div className="panel-controls__track"><i style={{ left: `${(CAPABILITIES.findIndex((item) => item.id === active.id) / 3) * 100}%` }} /></div>
              <span>MH—{active.index}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
