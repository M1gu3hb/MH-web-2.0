import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { PROCESS } from '../data';

export function ProcessSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = PROCESS[activeIndex];

  return (
    <section className="process section-pad" id="proceso">
      <div className="process__heading">
        <p className="section-index">03 / PROCESO</p>
        <h2>Menos teatro.<br /><span>Más producto.</span></h2>
        <p>Un método compacto para convertir una idea dispersa en algo que tu equipo realmente puede usar.</p>
      </div>

      <div className="process-console">
        <div className="process-console__screen">
          <AnimatePresence mode="wait">
            <Motion.div
              key={active.index}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>FASE / {active.index}</span>
              <h3>{active.title}</h3>
              <p>{active.text}</p>
            </Motion.div>
          </AnimatePresence>
          <span className="process-console__readout">{active.index}</span>
        </div>
        <div className="process-console__controls">
          <div className="process-knob" style={{ '--rotation': `${activeIndex * 78 - 110}deg` }}>
            <span />
          </div>
          <div className="process-switches" role="tablist" aria-label="Fases del proceso">
            {PROCESS.map((step, index) => (
              <button
                key={step.index}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? 'active' : ''}
                onClick={() => setActiveIndex(index)}
              >
                <span>{step.index}</span>
                <strong>{step.title}</strong>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        </div>
        <div className="process-console__footer">
          <span><i /> AVANCES REALES</span>
          <span>MH / METHOD—04</span>
        </div>
      </div>
    </section>
  );
}
