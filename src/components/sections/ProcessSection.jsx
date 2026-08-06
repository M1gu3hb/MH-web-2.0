import { useCallback, useEffect, useId, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollCue } from '../primitives/ScrollCue';
import { SectionHeading } from '../primitives/SectionHeading';
import { ScrambleText } from '../reactbits';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollSequence } from '../../hooks/useScrollSequence';
import { PROCESS, SECTIONS } from '../../content';

const SWEEP = 270; // grados que recorre la perilla de extremo a extremo

function angleFor(index, count) {
  return -SWEEP / 2 + (index / (count - 1)) * SWEEP;
}

export function ProcessSection() {
  const baseId = useId();
  const tabsRef = useRef([]);
  const knobRef = useRef(null);
  const dragging = useRef(false);
  const reducedMotion = useReducedMotion();

  const { containerRef, index, select } = useScrollSequence(PROCESS.length, { enabled: !reducedMotion });
  const active = PROCESS[index] ?? PROCESS[0];
  const rotation = angleFor(index, PROCESS.length);

  /* ---- Perilla arrastrable ---------------------------------------------- */
  const angleToIndex = useCallback((clientX, clientY) => {
    const knob = knobRef.current;
    if (!knob) return null;
    const b = knob.getBoundingClientRect();
    const dx = clientX - (b.left + b.width / 2);
    const dy = clientY - (b.top + b.height / 2);
    if (Math.hypot(dx, dy) < 8) return null;
    let deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    deg = Math.max(-SWEEP / 2, Math.min(SWEEP / 2, deg));
    return Math.round(((deg + SWEEP / 2) / SWEEP) * (PROCESS.length - 1));
  }, []);

  const onPointerDown = useCallback(
    (event) => {
      dragging.current = true;
      knobRef.current?.setPointerCapture?.(event.pointerId);
      const next = angleToIndex(event.clientX, event.clientY);
      if (next !== null) select(next);
    },
    [angleToIndex, select],
  );

  const onPointerMove = useCallback(
    (event) => {
      if (!dragging.current) return;
      const next = angleToIndex(event.clientX, event.clientY);
      if (next !== null) select(next);
    },
    [angleToIndex, select],
  );

  const endDrag = useCallback((event) => {
    dragging.current = false;
    knobRef.current?.releasePointerCapture?.(event.pointerId);
  }, []);

  /* Rueda del ratón sobre la perilla: sube y baja de fase. */
  useEffect(() => {
    const knob = knobRef.current;
    if (!knob) return undefined;
    const onWheel = (event) => {
      event.preventDefault();
      const dir = event.deltaY > 0 ? 1 : -1;
      select(Math.max(0, Math.min(PROCESS.length - 1, index + dir)));
    };
    knob.addEventListener('wheel', onWheel, { passive: false });
    return () => knob.removeEventListener('wheel', onWheel);
  }, [index, select]);

  const onKnobKey = useCallback(
    (event) => {
      const map = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };
      if (event.key === 'Home') return select(0);
      if (event.key === 'End') return select(PROCESS.length - 1);
      const d = map[event.key];
      if (!d) return undefined;
      event.preventDefault();
      return select(Math.max(0, Math.min(PROCESS.length - 1, index + d)));
    },
    [index, select],
  );

  const onTabsKey = useCallback(
    (event) => {
      const last = PROCESS.length - 1;
      let next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = index === last ? 0 : index + 1;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = index === 0 ? last : index - 1;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = last;
      if (next === null) return;
      event.preventDefault();
      select(next);
      tabsRef.current[next]?.focus();
    },
    [index, select],
  );

  return (
    <section className="process" id="proceso">
      <div className="process__intro section-pad">
        <SectionHeading
          eyebrow={SECTIONS.process.eyebrow}
          title={SECTIONS.process.title}
          lead={SECTIONS.process.lead}
        />
      </div>

      <div className="process__scroller" ref={containerRef}>
        <ScrollCue label="Desliza para avanzar" />
        <div className="process__sticky section-pad">
          <div className="process-console" style={{ '--phase': index }}>
            {/* ---- Pantalla ---- */}
            <div
              className="process-console__screen"
              id={`${baseId}-panel`}
              role="tabpanel"
              tabIndex={0}
              aria-labelledby={`${baseId}-tab-${active.index}`}
            >
              <div className="process-console__rails" aria-hidden="true">
                {PROCESS.map((s, i) => (
                  <i key={s.index} className={i <= index ? 'on' : ''} />
                ))}
              </div>

              {PROCESS.map((step, i) => (
                <div className={`process-layer ${i === index ? 'is-active' : i < index ? 'is-past' : 'is-next'}`} key={step.index}>
                  <span className="process-console__phase">
                    FASE / {step.index}
                    {step.duration ? <em>{step.duration}</em> : null}
                  </span>
                  <h3><ScrambleText text={step.title} /></h3>
                  <p>{step.text}</p>
                </div>
              ))}

              <span className="process-console__readout" aria-hidden="true">{active.index}</span>
              <span className="process-console__glow" aria-hidden="true" />
            </div>

            {/* ---- Controles ---- */}
            <div className="process-console__controls">
              <div
                className="process-knob"
                ref={knobRef}
                role="slider"
                tabIndex={0}
                aria-label="Fase del proceso"
                aria-valuemin={1}
                aria-valuemax={PROCESS.length}
                aria-valuenow={index + 1}
                aria-valuetext={`Fase ${active.index}: ${active.title}`}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={onKnobKey}
                style={{ '--rotation': `${rotation}deg` }}
              >
                <span className="process-knob__dial">
                  <i className="process-knob__pointer" />
                  <i className="process-knob__grip" />
                </span>
                <span className="process-knob__ticks" aria-hidden="true">
                  {PROCESS.map((s, i) => (
                    <b key={s.index} className={i <= index ? 'on' : ''} style={{ '--tick': `${angleFor(i, PROCESS.length)}deg` }} />
                  ))}
                </span>
                <span className="process-knob__label" aria-hidden="true">{active.index}</span>
              </div>

              <p className="process-knob__hint">Gírala, arrástrala o usa las flechas</p>

              <div className="process-switches" role="tablist" aria-label="Fases del proceso" onKeyDown={onTabsKey}>
                {PROCESS.map((step, i) => (
                  <button
                    key={step.index}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${step.index}`}
                    aria-selected={i === index}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={i === index ? 0 : -1}
                    ref={(node) => {
                      tabsRef.current[i] = node;
                    }}
                    className={i === index ? 'active' : ''}
                    onClick={() => select(i)}
                  >
                    <span>{step.index}</span>
                    <strong>{step.title}</strong>
                    {step.duration ? <em>{step.duration}</em> : null}
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            <div className="process-console__footer">
              <span><i aria-hidden="true" /> AVANCES REALES</span>
              <span>MH / METHOD—0{PROCESS.length}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
