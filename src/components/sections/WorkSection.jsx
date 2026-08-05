import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '../primitives/SectionHeading';
import { BerlinVisual, ConfettiVisual, FiestaVisual, HipicoVisual } from '../mockups/ProjectVisuals';
import { BlurText, GlareHover, Reveal, SpotlightCard, TiltedCard } from '../reactbits';
import { PROJECTS, SECTIONS } from '../../content';

const PROJECT_VISUALS = {
  confetti: ConfettiVisual,
  hipico: HipicoVisual,
  fiesta: FiestaVisual,
  berlin: BerlinVisual,
};

function ProjectScene({ project, index }) {
  const Visual = PROJECT_VISUALS[project.visual];

  return (
    <Reveal as="article" delay={index * 0.04} amount={0.15}>
      <TiltedCard max={4}>
        <SpotlightCard
          className="project-scene"
          accent={project.accent}
          style={{ '--scene-accent': project.accent, '--scene-surface': project.surface }}
        >
          <div className="project-scene__meta">
            <span>CASO / {project.index}</span>
            <span>NEGOCIO REAL · CDMX</span>
          </div>

          <div className="project-scene__layout">
            <div className="project-scene__copy">
              <p className="project-scene__category">{project.category}</p>
              <h3>{project.client}</h3>
              <p className="project-scene__desc">{project.description}</p>

              <p className="project-scene__outcome">
                <span aria-hidden="true">→</span>
                {project.outcome}
              </p>

              <div className="project-scene__tags">
                {project.tags.map((tag) => (
                  <small key={tag}>{tag}</small>
                ))}
              </div>

              <GlareHover
                as="a"
                className="project-scene__link"
                href={project.url}
                target="_blank"
                rel="noreferrer"
              >
                Ver sitio en vivo
                <ArrowUpRight size={17} aria-hidden="true" />
              </GlareHover>
            </div>

            <div className="project-scene__visual" aria-hidden="true">
              <Visual />
              <span className="project-scene__visual-index">{project.index}</span>
            </div>
          </div>
        </SpotlightCard>
      </TiltedCard>
    </Reveal>
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

      <div className="project-stack">
        {PROJECTS.map((project, index) => (
          <ProjectScene key={project.client} project={project} index={index} />
        ))}
      </div>

      <BlurText text={SECTIONS.work.truth} className="work__truth" stagger={0.03} />
    </section>
  );
}
