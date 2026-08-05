import { useCallback, useId, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { SectionHeading } from '../primitives/SectionHeading';
import { AutomationScreen, CrmScreen, PosScreen, WebsiteScreen } from '../mockups/ServiceScreens';
import { DecryptedText, Reveal } from '../reactbits';
import { CAPABILITIES, SECTIONS } from '../../content';

const SERVICE_SCREENS = {
  website: WebsiteScreen,
  pos: PosScreen,
  crm: CrmScreen,
  automation: AutomationScreen,
};

export function CapabilitiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();
  const tabsRef = useRef([]);

  const active = CAPABILITIES[activeIndex];
  const Screen = SERVICE_SCREENS[active.screen];

  /** Navegación con teclado según el patrón ARIA de tabs. */
  const handleKeyDown = useCallback((event) => {
    const last = CAPABILITIES.length - 1;
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
    <section className="capabilities section-pad" id="servicios">
      <SectionHeading
        eyebrow={SECTIONS.capabilities.eyebrow}
        title={SECTIONS.capabilities.title}
        lead={SECTIONS.capabilities.lead}
      />

      <Reveal className="capability-deck" amount={0.12}>
        <div className="capability-deck__selector" role="tablist" aria-label="Explorar capacidades" onKeyDown={handleKeyDown}>
          {CAPABILITIES.map((item, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                ref={(node) => {
                  tabsRef.current[index] = node;
                }}
                className={selected ? 'active' : ''}
                onClick={() => setActiveIndex(index)}
                style={{ '--accent': item.accent }}
              >
                <span>{item.index}</span>
                <strong>{item.label}</strong>
                <i>{item.meta}</i>
                <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <div
          className="capability-deck__panel"
          id={`${baseId}-panel`}
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`${baseId}-tab-${active.id}`}
          style={{ '--accent': active.accent, '--panel-ink': active.ink, '--panel-fg': active.foreground }}
        >
          <div className="panel-chrome">
            <DecryptedText text="MH / SYSTEM VIEW" />
            <span><i aria-hidden="true" /> INTERACTIVO</span>
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
                <p className="panel-copy__eyebrow">{active.index} / {active.eyebrow}</p>
                <h3>{active.title}</h3>
                <p className="panel-copy__desc">{active.description}</p>
                <div className="panel-tags">
                  {active.tags.map((tag) => (
                    <small key={tag}>
                      <Check size={12} aria-hidden="true" />
                      {tag}
                    </small>
                  ))}
                </div>
              </Motion.div>
            </AnimatePresence>

            <div className="panel-screen-wrap" aria-hidden="true">
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
            <span><i aria-hidden="true" /> Módulo conectado</span>
            <div className="panel-controls__track" aria-hidden="true">
              <i style={{ left: `${(activeIndex / (CAPABILITIES.length - 1)) * 100}%` }} />
            </div>
            <span>MH—{active.index}</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
