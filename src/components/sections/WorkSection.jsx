import { useId, useState } from 'react';
import { ArrowUpRight, ChevronDown, Github, MessageCircle } from 'lucide-react';
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
 * Cada caso es una tarjeta pegada al viewport. Al hacer scroll, la siguiente
 * sube y se apila encima de la anterior dejando ver su borde superior, como
 * un mazo de cartas que se va cerrando.
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
        '--stack-index': index,
        /* Cada tarjeta se pega un poco más abajo que la anterior: así se ve
           el canto de las que quedaron debajo. */
        top: `calc(var(--stack-top) + ${index} * var(--stack-step))`,
        zIndex: index + 1,
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

export function WorkSection() {
  /* Se resuelve una vez y baja a las tarjetas: siete suscripciones al mismo
     medio para responder siempre lo mismo no hacen falta. */
  const compact = useMediaQuery('(max-width: 640px)');

  return (
    <section className="work section-pad" id="trabajo">
      <SectionHeading
        eyebrow={SECTIONS.work.eyebrow}
        title={SECTIONS.work.title}
        lead={SECTIONS.work.lead}
        tone="night"
      />

      {/* El escalón del mazo se declara aquí porque el alto útil de cada
          tarjeta depende de cuántas haya: la última se pega N escalones más
          abajo y tiene que seguir cabiendo en pantalla. */}
      <div
        className="project-stack"
        style={{
          '--stack-top': 'clamp(84px, 12vh, 132px)',
          '--stack-step': 'clamp(9px, 1.4vh, 14px)',
          '--stack-deck': `calc(${PROJECTS.length - 1} * var(--stack-step))`,
        }}
      >
        <ScrollCue label="Desliza para ver los casos" />
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

      <BlurText text={SECTIONS.work.truth} className="work__truth" stagger={0.03} />
    </section>
  );
}
