import { useCallback, useId, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../primitives/SectionHeading';
import { Reveal } from '../reactbits';
import { PROCESS, SECTIONS } from '../../content';

export function ProcessSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();
  const tabsRef = useRef([]);
  const active = PROCESS[activeIndex];

  const handleKeyDown = useCallback((event) => {
    const last = PROCESS.length - 1;
    let next = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (i) => (i === last ? 0 : i + 1);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (i) => (i === 0 ? last : i - 1);
    else if (event.key === 'Home') next = () => 0;
    else if (event.key === 'End') next = () => last;
    if (!next) return;

    event.preventDefault();
    setActiveIndex((current) => {
      const target = next(current);
      tabsRef.current[target]?.focus();
      return target;
    });
  }, []);

  return (
    <section className="process section-pad" id="proceso">
      <SectionHeading
        eyebrow={SECTIONS.process.eyebrow}
        title={SECTIONS.process.title}
        lead={SECTIONS.process.lead}
      />

      <Reveal className="process-console" amount={0.15}>
        <div
          className="process-console__screen"
          id={`${baseId}-panel`}
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`${baseId}-tab-${active.index}`}
        >
          <AnimatePresence mode="wait">
            <Motion.div
              key={active.index}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="process-console__phase">
                FASE / {active.index}
                <em>{active.duration}</em>
              </span>
              <h3>{active.title}</h3>
              <p>{active.text}</p>
            </Motion.div>
          </AnimatePresence>
          <span className="process-console__readout" aria-hidden="true">{active.index}</span>
        </div>

        <div className="process-console__controls">
          <div className="process-knob" style={{ '--rotation': `${activeIndex * 78 - 110}deg` }} aria-hidden="true">
            <span />
          </div>
          <div className="process-switches" role="tablist" aria-label="Fases del proceso" onKeyDown={handleKeyDown}>
            {PROCESS.map((step, index) => (
              <button
                key={step.index}
                type="button"
                role="tab"
                id={`${baseId}-tab-${step.index}`}
                aria-selected={index === activeIndex}
                aria-controls={`${baseId}-panel`}
                tabIndex={index === activeIndex ? 0 : -1}
                ref={(node) => {
                  tabsRef.current[index] = node;
                }}
                className={index === activeIndex ? 'active' : ''}
                onClick={() => setActiveIndex(index)}
              >
                <span>{step.index}</span>
                <strong>{step.title}</strong>
                <em>{step.duration}</em>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className="process-console__footer">
          <span><i aria-hidden="true" /> AVANCES REALES</span>
          <span>MH / METHOD—04</span>
        </div>
      </Reveal>
    </section>
  );
}
