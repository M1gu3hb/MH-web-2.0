import { useCallback, useId, useRef } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { SectionHeading } from '../primitives/SectionHeading';
import { AutomationScreen, CrmScreen, PosScreen, SoftwareScreen, WebsiteScreen } from '../mockups/ServiceScreens';
import { ScrambleText } from '../reactbits';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useScrollSequence } from '../../hooks/useScrollSequence';
import { CAPABILITIES, SECTIONS } from '../../content';

const SERVICE_SCREENS = {
  website: WebsiteScreen,
  pos: PosScreen,
  crm: CrmScreen,
  automation: AutomationScreen,
  software: SoftwareScreen,
};

export function CapabilitiesSection() {
  const baseId = useId();
  const tabsRef = useRef([]);
  const compact = useMediaQuery('(max-width: 900px)');

  /* En pantallas chicas el modo pegado estorba: ahí solo se navega a mano. */
  const { containerRef, index: activeIndex, select } = useScrollSequence(CAPABILITIES.length, {
    enabled: !compact,
  });

  const active = CAPABILITIES[activeIndex] ?? CAPABILITIES[0];

  const handleKeyDown = useCallback(
    (event) => {
      const last = CAPABILITIES.length - 1;
      let next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = activeIndex === last ? 0 : activeIndex + 1;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = activeIndex === 0 ? last : activeIndex - 1;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = last;
      if (next === null) return;
      event.preventDefault();
      select(next);
      tabsRef.current[next]?.focus();
    },
    [activeIndex, select],
  );

  return (
    <section className="capabilities" id="servicios">
      <div className="capabilities__intro section-pad">
        <SectionHeading
          eyebrow={SECTIONS.capabilities.eyebrow}
          title={SECTIONS.capabilities.title}
          lead={SECTIONS.capabilities.lead}
        />
      </div>

      <div className="capabilities__scroller" ref={containerRef}>
        <div className="capabilities__sticky section-pad">
          <div
            className="capability-deck"
            style={{ '--accent': active.accent, '--panel-ink': active.ink }}
          >
            <div
              className="capability-deck__selector"
              role="tablist"
              aria-label="Explorar capacidades"
              aria-orientation="vertical"
              onKeyDown={handleKeyDown}
            >
              {CAPABILITIES.map((item, i) => {
                const selected = i === activeIndex;
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
                      tabsRef.current[i] = node;
                    }}
                    className={selected ? 'active' : ''}
                    onClick={() => select(i)}
                    style={{ '--tab-accent': item.accent }}
                  >
                    <span>{item.index}</span>
                    <strong>{item.label}</strong>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </button>
                );
              })}

              <div className="capability-deck__progress" aria-hidden="true">
                <i style={{ transform: `scaleY(${(activeIndex + 1) / CAPABILITIES.length})` }} />
              </div>
            </div>

            <div
              className="capability-deck__panel"
              id={`${baseId}-panel`}
              role="tabpanel"
              tabIndex={0}
              aria-labelledby={`${baseId}-tab-${active.id}`}
            >
              <div className="panel-chrome">
                <ScrambleText text="MH / SYSTEM VIEW" />
                <span><i aria-hidden="true" /> {active.index} DE {String(CAPABILITIES.length).padStart(2, '0')}</span>
              </div>

              {/* Las cinco capas viven montadas y solo cambia su opacidad:
                  así el cambio no tiene ni un fotograma en blanco. */}
              <div className="panel-stage">
                {CAPABILITIES.map((item, i) => {
                  const Screen = SERVICE_SCREENS[item.screen];
                  const state = i === activeIndex ? 'is-active' : i < activeIndex ? 'is-past' : 'is-next';
                  return (
                    <div
                      className={`panel-layer ${state}`}
                      key={item.id}
                      aria-hidden={i !== activeIndex}
                      style={{ '--layer-ink': item.ink }}
                    >
                      <div className="panel-copy">
                        <p className="panel-copy__eyebrow">{item.index} / {item.eyebrow}</p>
                        <h3>{item.title}</h3>
                        <p className="panel-copy__desc">{item.description}</p>
                        <div className="panel-tags">
                          {item.tags.map((tag) => (
                            <small key={tag}>
                              <Check size={12} aria-hidden="true" />
                              {tag}
                            </small>
                          ))}
                        </div>
                      </div>

                      <div className="panel-screen-wrap">
                        <span className="panel-screen-wrap__screw panel-screen-wrap__screw--tl" />
                        <span className="panel-screen-wrap__screw panel-screen-wrap__screw--tr" />
                        <span className="panel-screen-wrap__screw panel-screen-wrap__screw--bl" />
                        <span className="panel-screen-wrap__screw panel-screen-wrap__screw--br" />
                        <Screen />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="panel-controls">
                <span><i aria-hidden="true" /> Módulo conectado</span>
                <div className="panel-controls__track" aria-hidden="true">
                  <i style={{ left: `${(activeIndex / (CAPABILITIES.length - 1)) * 100}%` }} />
                </div>
                <span>MH—{active.index}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
