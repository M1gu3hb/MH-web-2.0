import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Github, MessageCircle } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ScrollCue } from '../primitives/ScrollCue';
import { SectionHeading } from '../primitives/SectionHeading';
import { AvisoDesliza } from '../primitives/AvisoDesliza';
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

          {/* En teléfono la maqueta va horneada en una imagen. El dibujo es el
              mismo —se genera desde este mismo CSS—, pero un <img> lo pinta
              cualquier motor sin discutir: compuesto en vivo son decenas de
              nodos con sombras y degradados dentro de un contenedor con
              scroll, y hay teléfonos donde eso se quedaba en blanco. De paso
              cuesta una textura en lugar de un árbol entero. */}
          <div className="project-card__visual" aria-hidden="true">
            {compact ? (
              <img
                className="project-card__horneada"
                src={`/casos/${project.visual}.webp`}
                alt=""
                width="760"
                height="753"
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
              />
            ) : (
              <Visual />
            )}
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
    const visor = zonaPista?.parentElement;
    if (!zonaRiel || !zonaPista || !visor) return undefined;

    if (!enabled) {
      zonaRiel.style.height = '';
      return undefined;
    }

    let frame = 0;
    let sobra = 0;
    let recorrido = 0;
    let escrito = -1;
    let libre = false;

    const medir = () => {
      sobra = Math.max(0, zonaPista.scrollWidth - visor.clientWidth);
      /* Cada tarjeta se lleva dos tercios de pantalla de rueda. */
      const minimo = zonaPista.children.length * window.innerHeight * 0.66;
      recorrido = Math.max(sobra, minimo);
      zonaRiel.style.height = `${visor.clientHeight + recorrido}px`;
    };

    /* El desfile se escribe en el scroll del propio visor, no en un transform.
       La diferencia no es de estilo: transformar la pista entera obliga al
       navegador a rasterizar las siete tarjetas como una sola capa de varios
       miles de píxeles y, con la densidad de un teléfono, eso se pasa del
       tamaño de textura que muchas GPU aceptan. Lo que sobra no se dibuja: es
       lo que dejaba las maquetas en blanco. Moviendo el scroll nativo el
       navegador pinta solo lo que se ve, va más suave, y de regalo el gesto de
       lado funciona desde el primer momento sin que haya que interpretarlo. */
    const pintar = () => {
      const r = zonaRiel.getBoundingClientRect();
      const avance = recorrido > 0 ? Math.min(1, Math.max(0, -r.top / recorrido)) : 0;
      escrito = Math.round(avance * sobra);
      visor.scrollLeft = escrito;
    };

    const onScroll = () => {
      if (libre || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        pintar();
      });
    };

    /* Si el visor se mueve de lado y no fuimos nosotros, es que el visitante
       lo está recorriendo a mano: la animación se aparta. La sección se
       recorta justo por debajo de donde está, así que su posición sigue
       siendo válida y nada salta bajo sus pies. */
    const onVisorScroll = () => {
      if (libre) return;
      if (Math.abs(visor.scrollLeft - escrito) < 6) return;
      libre = true;
      cancelAnimationFrame(frame);
      frame = 0;
      const arriba = zonaRiel.getBoundingClientRect().top + window.scrollY;
      const alto = Math.max(visor.clientHeight, window.scrollY - arriba + visor.clientHeight);
      zonaRiel.style.height = `${alto}px`;
      visor.classList.add('work-rail__visor--libre');
    };

    /* Al salir de la sección por arriba, el riel vuelve a estar como al
       principio: si se regresa, la animación está otra vez ahí. Sin esto, la
       sección quedaba muerta para siempre tras el primer gesto y volver a
       entrar se sentía roto. */
    const recuperar = () => {
      if (!libre) return;
      if (zonaRiel.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      libre = false;
      visor.classList.remove('work-rail__visor--libre');
      visor.scrollLeft = 0;
      escrito = 0;
      medir();
    };

    /* Arrastre con el ratón: en escritorio no hay dedo, y una barra de scroll
       fina no invita. Con el botón pulsado el riel se lleva de la mano. */
    let agarre = null;
    const onDown = (event) => {
      if (!libre || event.pointerType !== 'mouse') return;
      agarre = [event.clientX, visor.scrollLeft];
      visor.classList.add('is-grabbing');
    };
    const onMove = (event) => {
      if (!agarre) return;
      visor.scrollLeft = agarre[1] - (event.clientX - agarre[0]);
    };
    const onUp = () => {
      agarre = null;
      visor.classList.remove('is-grabbing');
    };

    const onPagina = () => {
      recuperar();
      onScroll();
    };

    const ro = new ResizeObserver(() => {
      if (libre) return;
      medir();
      pintar();
    });
    ro.observe(zonaPista);
    medir();
    pintar();

    window.addEventListener('scroll', onPagina, { passive: true });
    window.addEventListener('resize', onPagina);
    visor.addEventListener('scroll', onVisorScroll, { passive: true });
    visor.addEventListener('pointerdown', onDown, { passive: true });
    visor.addEventListener('pointermove', onMove, { passive: true });
    visor.addEventListener('pointerup', onUp, { passive: true });
    visor.addEventListener('pointercancel', onUp, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener('scroll', onPagina);
      window.removeEventListener('resize', onPagina);
      visor.removeEventListener('scroll', onVisorScroll);
      visor.removeEventListener('pointerdown', onDown);
      visor.removeEventListener('pointermove', onMove);
      visor.removeEventListener('pointerup', onUp);
      visor.removeEventListener('pointercancel', onUp);
      visor.classList.remove('work-rail__visor--libre', 'is-grabbing');
      zonaRiel.style.height = '';
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

      <span className="freno-scroll" aria-hidden="true" />
      <div className="work-rail" ref={riel}>
        {/* La pista cuelga del riel y no del bloque pegado: mide el avance con
            el rectángulo de su padre, y el bloque pegado no se mueve. */}
        <ScrollCue label="Desliza para recorrer los casos" />
        <div className="work-rail__visor">
          <AvisoDesliza zona={riel} />
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
