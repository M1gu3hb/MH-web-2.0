import { useCallback, useEffect, useId, useRef } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { SectionHeading } from '../primitives/SectionHeading';
import { AutomationScreen, CrmScreen, PosScreen, SoftwareScreen, WebsiteScreen } from '../mockups/ServiceScreens';
import { ScrambleText } from '../reactbits';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ScrollCue } from '../primitives/ScrollCue';
import { useScrollSequence } from '../../hooks/useScrollSequence';
import { CAPABILITIES, SECTIONS } from '../../content';

const SERVICE_SCREENS = {
  website: WebsiteScreen,
  pos: PosScreen,
  crm: CrmScreen,
  automation: AutomationScreen,
  software: SoftwareScreen,
};

export function CapabilitiesSection({ embedded = false }) {
  const baseId = useId();
  const tabsRef = useRef([]);
  const reducedMotion = useReducedMotion();

  /* El scroll pegado también en teléfono: es la animación de la sección. */
  const { containerRef, index: activeIndex, select, flow } = useScrollSequence(CAPABILITIES.length, {
    /* Incrustada no hay scroll que seguir: se queda en la primera. */
    enabled: !reducedMotion && !embedded,
  });

  const active = CAPABILITIES[activeIndex] ?? CAPABILITIES[0];

  /* ---- El fondo se mueve con el dedo -----------------------------------
     Cada tarjeta lleva detrás una escena, y esa escena recorre su tramo de
     scroll acercándose despacio mientras la maqueta que va encima se mueve al
     revés. Es lo que da profundidad: dos planos a distinta velocidad.

     Se escribe directamente en el nodo, no por estado ni por variables CSS:
     son sesenta cambios por segundo y cualquiera de los otros dos caminos
     obligaría a recalcular estilo de toda la baraja en cada uno. Y solo sobre
     la capa que está puesta: las otras están a opacidad cero, así que moverlas
     sería pintar para nadie.

     El bucle solo corre cuando la sección está cerca de pantalla; fuera de
     ahí no hay nada que animar y sí una batería que gastar. */
  const escenas = useRef([]);
  const maquetas = useRef([]);
  const puesta = useRef(0);
  puesta.current = activeIndex;

  useEffect(() => {
    if (reducedMotion || embedded) return undefined;
    const zona = containerRef.current;
    if (!zona) return undefined;

    let frame = 0;
    let cerca = false;
    let suave = 0;

    const tick = () => {
      frame = cerca ? requestAnimationFrame(tick) : 0;
      const t = flow.current.paso ?? 0;
      /* Amortiguado: el scroll llega a saltos y el movimiento tiene que salir
         continuo aunque los saltos sean grandes. */
      suave += (t - suave) * 0.14;

      const i = puesta.current;
      const escena = escenas.current[i];
      const maqueta = maquetas.current[i];
      if (escena) {
        /* El fondo entra grande y se va asentando: es la cámara acercándose. */
        escena.style.transform = `translate3d(0, ${(0.5 - suave) * 3.4}%, 0) scale(${1.12 - suave * 0.12})`;
      }
      if (maqueta) {
        /* Y la maqueta al revés, y enderezándose. Dos planos a distinta
           velocidad y en sentidos opuestos: eso es lo que se lee como fondo. */
        maqueta.style.transform = `translate3d(0, ${(suave - 0.5) * 2.6}%, 0) `
          + `rotateY(${-9 + suave * 6}deg) scale(${0.975 + suave * 0.025})`;
      }
    };

    const ojo = new IntersectionObserver(
      ([e]) => {
        cerca = e.isIntersecting;
        if (cerca && !frame) frame = requestAnimationFrame(tick);
      },
      { rootMargin: '25% 0px' },
    );
    ojo.observe(zona);

    return () => {
      cerca = false;
      cancelAnimationFrame(frame);
      ojo.disconnect();
    };
  }, [containerRef, flow, reducedMotion, embedded]);

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
    <section
      className={`capabilities ${embedded ? 'capabilities--embedded' : ''}`}
      id={embedded ? undefined : 'servicios'}
      aria-hidden={embedded || undefined}
      inert={embedded ? '' : undefined}
    >
      <div className="capabilities__intro section-pad">
        <SectionHeading
          eyebrow={SECTIONS.capabilities.eyebrow}
          title={SECTIONS.capabilities.title}
          lead={SECTIONS.capabilities.lead}
        />
      </div>

      <div className="capabilities__scroller" ref={containerRef}>
        <ScrollCue label="Desliza para recorrer" />
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
                    /* La tinta legible sobre ese acento va junto al acento:
                       en teléfono el botón activo se pinta del color de su
                       tarjeta, y cada acento pide la suya. */
                    style={{ '--tab-accent': item.accent, '--tab-ink': item.ink }}
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
                <ScrambleText text="MORPHIQ / SYSTEM VIEW" />
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
                      /* Fijos por capa, no heredados del acento de la baraja.
                         El acento se interpola durante casi un segundo en cada
                         cambio, y todo lo que dependa de él se repinta en cada
                         fotograma de ese cruce. Además arregla un fallo: a
                         mitad de cruce el texto de la tarjeta que entra se
                         pintaba con la mezcla de las dos tintas. */
                      style={{ '--layer-ink': item.ink, '--layer-accent': item.accent }}
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
                        {/* La escena de esa capacidad. El recuadro es casi
                            cuadrado y la imagen apaisada, así que el recorte lo
                            decide el punto de luz medido sobre cada render. */}
                        {item.scene ? (
                          /* Tres tallas, y la del teléfono además cuadrada. El
                             hueco de ahí mide unos 350×326, así que servirle el
                             apaisado de escritorio significaba decodificar el
                             triple de píxeles de los que se llegan a ver: cinco
                             de 1920×1080 son 40 MB de mapa de bits en memoria,
                             en un aparato que no los tiene. Con el cuadrado son
                             11 MB. El recorte va centrado en el motivo, por eso
                             ahí el foco vuelve al medio. */
                          <picture>
                            <source media="(max-width: 640px)" srcSet={`${item.scene.replace('.webp', '-sq.webp')}`} />
                            <source media="(max-width: 1100px)" srcSet={`${item.scene.replace('.webp', '-1152.webp')}`} />
                            <img
                              className="panel-scene"
                              ref={(node) => {
                                escenas.current[i] = node;
                              }}
                              src={item.scene}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              style={{ '--foco': item.focus }}
                            />
                          </picture>
                        ) : null}
                        <span className="panel-screen-wrap__screw panel-screen-wrap__screw--tl" />
                        <span className="panel-screen-wrap__screw panel-screen-wrap__screw--tr" />
                        <span className="panel-screen-wrap__screw panel-screen-wrap__screw--bl" />
                        <span className="panel-screen-wrap__screw panel-screen-wrap__screw--br" />
                        <div
                          className="panel-screen"
                          ref={(node) => {
                            maquetas.current[i] = node;
                          }}
                        >
                          <Screen />
                        </div>
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
                <span>MORPHIQ—{active.index}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
