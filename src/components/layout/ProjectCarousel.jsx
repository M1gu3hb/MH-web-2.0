import { ArrowUpRight, Github } from 'lucide-react';
import { track } from '@vercel/analytics';
import { ScrambleText } from '../reactbits';
import { CAROUSEL } from '../../content';

/**
 * Carrusel de proyectos. A diferencia del marquee anterior es navegable:
 * cada pieza es un enlace real al repositorio (o al sitio en vivo cuando el
 * repo no es público). Se detiene al pasar el cursor para poder hacer clic.
 */
export function ProjectCarousel({ embedded = false }) {
  const isRepo = (href) => href.includes('github.com');

  return (
    <section className="carousel" aria-label="Proyectos" aria-hidden={embedded || undefined} inert={embedded ? '' : undefined}>
      <div className="carousel__head">
        <p className="section-index">
          <ScrambleText text="PROYECTOS · GITHUB" />
        </p>
        <p className="carousel__hint">Cada uno abre su repositorio o su sitio en vivo</p>
      </div>

      <div className="carousel__viewport">
        <div className="carousel__track">
          {[0, 1].map((copy) => (
            <ul className="carousel__group" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
              {CAROUSEL.map((item) => (
                <li key={`${copy}-${item.name}`}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={copy === 1 ? -1 : undefined}
                    onClick={() => {
                      try {
                        track('project_click', { project: item.name });
                      } catch {
                        /* la analítica nunca bloquea la navegación */
                      }
                    }}
                  >
                    <span className="carousel__icon">
                      {isRepo(item.href) ? <Github size={15} aria-hidden="true" /> : <ArrowUpRight size={15} aria-hidden="true" />}
                    </span>
                    <span className="carousel__name">{item.name}</span>
                    <span className="carousel__kind">{item.kind}</span>
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
