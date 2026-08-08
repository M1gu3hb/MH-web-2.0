import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Github, MessageCircle } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ScrollCue } from '../primitives/ScrollCue';
import { SectionHeading } from '../primitives/SectionHeading';
import {
  BerlinVisual,
  ConfettiVisual,
  FiestaVisual,
  GestechVisual,
  HipicoVisual,
  ImaginationVisual,
  PhotoBoothVisual,
} from '../mockups/ProjectVisuals';
import { BlurText, GlareHover, SpotlightCard } from '../reactbits';
import { PROJECTS, SECTIONS } from '../../content';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';

const PROJECT_VISUALS = {
  confetti: ConfettiVisual,
  hipico: HipicoVisual,
  fiesta: FiestaVisual,
  berlin: BerlinVisual,
  gestech: GestechVisual,
  photobooth: PhotoBoothVisual,
  imagination: ImaginationVisual,
};

/**
 * Cada caso es una tarjeta del riel. El scroll sigue siendo vertical —es el
 * que todo el mundo tiene— pero lo que mueve es el riel de lado: las tarjetas
 * desfilan de derecha a izquierda y se paran en la última.
 *
 * En teléfono la tarjeta llega resumida. El hueco de una tarjeta pegada es
 * fijo —tiene que caber entera o la siguiente empieza a taparla mientras aún
 * la estás leyendo—, y ahí dentro no caben a la vez el texto largo, el
 * resultado, las etiquetas, el enlace y la maqueta: quedaba todo apretado y
 * la imagen de referencia, que es lo que de verdad enseña el trabajo, se
 * reducía a una franja. Resumida enseña de quién es, de qué es y la imagen;
 * el resto está a un toque. Como el alto es fijo, lo que se despliega sale
 * del sitio que deja la maqueta: la tarjeta no crece ni se desborda.
 */
function ProjectCard({ project, index, total, compact }) {
  const Visual = PROJECT_VISUALS[project.visual];
  const isRepo = project.url?.includes('github.com');
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const brief = compact && !open;

  return (
    <article
      className={`project-card ${brief ? 'project-card--brief' : ''}`}
      style={{
        '--scene-accent': project.accent,
        '--scene-surface': project.surface,
      }}
    >
      <SpotlightCard className="project-card__inner" accent={project.accent}>
        <div className="project-card__meta">
          <span>CASO / {project.index}</span>
          <span>{String(index + 1).padStart(2, '0')} — {String(total).padStart(2, '0')}</span>
        </div>

        <div className="project-card__layout">
          <div className="project-card__copy">
            <p className="project-card__category">{project.category}</p>
            <h3>{project.client}</h3>

            <div className="project-card__detail" id={`${baseId}-detalle`}>
              <p className="project-card__desc">{project.description}</p>

              <p className="project-card__outcome">
                <span aria-hidden="true">→</span>
                {project.outcome}
              </p>
            </div>

            <div className="project-card__tags">
              {project.tags.map((tag) => (
                <small key={tag}>{tag}</small>
              ))}
            </div>

            {/* Solo en teléfono: en apaisado cabe todo y un botón para
                desplegar lo que ya se está viendo sobra. */}
            {compact ? (
              <button
                type="button"
                className="project-card__more"
                aria-expanded={open}
                aria-controls={`${baseId}-detalle`}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? 'Ver menos' : 'Ver más detalles'}
                <ChevronDown size={16} aria-hidden="true" />
              </button>
            ) : null}

            {project.invitation ? (
              <a
                className="project-card__link"
                href={whatsappUrl('work')}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackWhatsApp('work')}
              >
                <MessageCircle size={16} aria-hidden="true" />
                Cuéntame qué imaginas
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ) : (
              <GlareHover as="a" className="project-card__link" href={project.url} target="_blank" rel="noreferrer">
                {isRepo ? <Github size={16} aria-hidden="true" /> : null}
                {project.linkLabel ?? 'Ver sitio en vivo'}
                <ArrowUpRight size={17} aria-hidden="true" />
              </GlareHover>
            )}
          </div>

          <div className="project-card__visual" aria-hidden="true">
            <Visual />
            <span className="project-card__index">{project.index}</span>
          </div>
        </div>
      </SpotlightCard>
    </article>
  );
}

/**
 * El riel: convierte el scroll vertical en desplazamiento lateral.
 *
 * El alto del recorrido no se puede escribir en CSS porque depende de cuánto
 * mide el riel, y eso depende del ancho de la pantalla y del número de casos.
 * Se mide y se escribe: recorrido = una pantalla (para que el riel se quede
 * quieto mientras entra) más exactamente lo que sobra de riel por la derecha.
 * Así la última tarjeta termina alineada con el borde y ni antes ni después.
 */
function useRielHorizontal(enabled) {
  const riel = useRef(null);
  const pista = useRef(null);

  useEffect(() => {
    const zonaRiel = riel.current;
    const zonaPista = pista.current;
    if (!zonaRiel || !zonaPista) return undefined;

    if (!enabled) {
      zonaRiel.style.height = '';
      zonaPista.style.transform = '';
      return undefined;
    }

    let frame = 0;
    let sobra = 0;
    let recorrido = 0;

    const medir = () => {
      const visor = zonaPista.parentElement;
      if (!visor) return;
      sobra = Math.max(0, zonaPista.scrollWidth - visor.clientWidth);
      /* El recorrido no es lo que sobra de riel, es lo que sobra o lo que
         hace falta para poder leer, lo que sea mayor. Atado uno a uno, en
         teléfono cada tarjeta mide poco más de un tercio de pantalla y pasan
         todas de un manotazo; así cada una se lleva al menos cuatro quintos
         de pantalla de rueda, mida lo que mida el riel. */
      const minimo = zonaPista.children.length * window.innerHeight * 0.8;
      recorrido = Math.max(sobra, minimo);
      zonaRiel.style.height = `${visor.clientHeight + recorrido}px`;
    };

    const pintar = () => {
      const r = zonaRiel.getBoundingClientRect();
      const avance = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 0;
      zonaPista.style.transform = `translate3d(${-(avance * sobra).toFixed(2)}px, 0, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        pintar();
      });
    };

    const ro = new ResizeObserver(() => {
      medir();
      pintar();
    });
    ro.observe(zonaPista);
    medir();
    pintar();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      zonaRiel.style.height = '';
      zonaPista.style.transform = '';
    };
  }, [enabled]);

  return { riel, pista };
}

export function WorkSection() {
  /* Se resuelve una vez y baja a las tarjetas: siete suscripciones al mismo
     medio para responder siempre lo mismo no hacen falta. */
  const compact = useMediaQuery('(max-width: 640px)');
  const reducedMotion = useReducedMotion();
  const { riel, pista } = useRielHorizontal(!reducedMotion);

  return (
    <section className="work section-pad" id="trabajo">
      <SectionHeading
        eyebrow={SECTIONS.work.eyebrow}
        title={SECTIONS.work.title}
        lead={SECTIONS.work.lead}
        tone="night"
      />

      <div className="work-rail" ref={riel}>
        {/* La pista cuelga del riel y no del bloque pegado: mide el avance con
            el rectángulo de su padre, y el bloque pegado no se mueve. */}
        <ScrollCue label="Desliza para recorrer los casos" />
        <div className="work-rail__visor">
          <div className="work-rail__pista" ref={pista}>
            {PROJECTS.map((project, index) => (
              <ProjectCard
                key={project.client}
                project={project}
                index={index}
                total={PROJECTS.length}
                compact={compact}
              />
            ))}
          </div>
        </div>
      </div>

      <BlurText text={SECTIONS.work.truth} className="work__truth" stagger={0.03} />
    </section>
  );
}
