import { ArrowUpRight, Github, MessageCircle } from 'lucide-react';
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
 */
function ProjectCard({ project, index, total }) {
  const Visual = PROJECT_VISUALS[project.visual];
  const isRepo = project.url?.includes('github.com');

  return (
    <article
      className="project-card"
      style={{
        '--scene-accent': project.accent,
        '--scene-surface': project.surface,
        '--stack-index': index,
        /* Cada tarjeta se pega un poco más abajo que la anterior: así se ve
           el canto de las que quedaron debajo. */
        top: `calc(var(--stack-top) + ${index * 16}px)`,
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
            <p className="project-card__desc">{project.description}</p>

            <p className="project-card__outcome">
              <span aria-hidden="true">→</span>
              {project.outcome}
            </p>

            <div className="project-card__tags">
              {project.tags.map((tag) => (
                <small key={tag}>{tag}</small>
              ))}
            </div>

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
  return (
    <section className="work section-pad" id="trabajo">
      <SectionHeading
        eyebrow={SECTIONS.work.eyebrow}
        title={SECTIONS.work.title}
        lead={SECTIONS.work.lead}
        tone="night"
      />

      <div className="project-stack" style={{ '--stack-top': 'clamp(84px, 12vh, 132px)' }}>
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.client} project={project} index={index} total={PROJECTS.length} />
        ))}
      </div>

      <BlurText text={SECTIONS.work.truth} className="work__truth" stagger={0.03} />
    </section>
  );
}
