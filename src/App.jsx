import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  Layers3,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import {
  CASES,
  CONTACT,
  EXTRA_SERVICES,
  PROCESS,
  SERVICE_VIEWS,
  WHATSAPP_MESSAGE,
} from './data';

const waLink = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

function useRevealObserver() {
  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}

function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(6);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let active = true;
    let finishTimer;
    const startedAt = performance.now();
    const interval = window.setInterval(() => {
      setProgress((value) => Math.min(value + Math.max(1, (88 - value) * 0.09), 88));
    }, 90);

    const logo = new Image();
    logo.src = '/mh-logo-960.png';
    const imageReady = logo.decode?.().catch(() => undefined) ?? Promise.resolve();
    const fontReady = document.fonts?.ready ?? Promise.resolve();
    const pageReady =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));

    Promise.all([imageReady, fontReady, pageReady]).then(() => {
      const remaining = Math.max(0, 1150 - (performance.now() - startedAt));
      finishTimer = window.setTimeout(() => {
        if (!active) return;
        window.clearInterval(interval);
        setProgress(100);
        window.setTimeout(() => {
          if (!active) return;
          setLeaving(true);
          window.setTimeout(onComplete, 620);
        }, 220);
      }, remaining);
    });

    return () => {
      active = false;
      window.clearInterval(interval);
      window.clearTimeout(finishTimer);
    };
  }, [onComplete]);

  const phase =
    progress < 32
      ? 'Cargando identidad'
      : progress < 68
        ? 'Preparando interfaces'
        : progress < 98
          ? 'Optimizando experiencia'
          : 'Sistema listo';

  return (
    <div className={`preloader ${leaving ? 'preloader--leaving' : ''}`} aria-live="polite">
      <div className="preloader__glow" aria-hidden="true" />
      <div className="preloader__content">
        <div className="preloader__mark">
          <img src="/mh-logo-640.png" alt="" width="210" height="210" />
          <span className="preloader__ring" />
        </div>
        <div className="preloader__wordmark">
          <span>MH</span> ASTRAL SYSTEMS
        </div>
        <div className="preloader__meta">
          <span>{phase}</span>
          <span>{Math.round(progress).toString().padStart(2, '0')}%</span>
        </div>
        <div
          className="preloader__track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(progress)}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? 'brand--compact' : ''}`} href="#inicio" aria-label="MH Astral Systems — Inicio">
      <span className="brand__mark">
        <img src="/mh-logo-640.png" alt="" width="54" height="54" />
      </span>
      <span className="brand__text">
        <strong>MH ASTRAL</strong>
        <small>SYSTEMS</small>
      </span>
    </a>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const links = [
    ['Servicios', '#servicios'],
    ['Proyectos', '#proyectos'],
    ['Proceso', '#proceso'],
    ['Contacto', '#contacto'],
  ];

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className="site-nav">
        <Brand />
        <nav className="site-nav__links" aria-label="Navegación principal">
          {links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href={waLink} target="_blank" rel="noreferrer">
          <span>Hablemos</span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={20} />
        </button>
      </header>

      <div className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`} aria-hidden={!open}>
        <div className="mobile-menu__top">
          <Brand compact />
          <button type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>
        <nav aria-label="Navegación móvil">
          {links.map(([label, href], index) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>
              {label}
              <ArrowUpRight size={22} />
            </a>
          ))}
        </nav>
        <a className="button button--primary" href={waLink} target="_blank" rel="noreferrer">
          <MessageCircle size={18} />
          Cuéntame tu proyecto
        </a>
      </div>
    </>
  );
}

function HeroVisual() {
  const sceneRef = useRef(null);

  const moveScene = (event) => {
    if (!sceneRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    sceneRef.current.style.setProperty('--rx', `${y * -9}deg`);
    sceneRef.current.style.setProperty('--ry', `${x * 11}deg`);
    sceneRef.current.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    sceneRef.current.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  };

  const resetScene = () => {
    sceneRef.current?.style.setProperty('--rx', '0deg');
    sceneRef.current?.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      className="hero-scene"
      ref={sceneRef}
      onPointerMove={moveScene}
      onPointerLeave={resetScene}
      aria-label="Representación interactiva de los sistemas de MH Astral Systems"
    >
      <div className="hero-scene__spot" aria-hidden="true" />
      <div className="hero-scene__orbit hero-scene__orbit--one" aria-hidden="true" />
      <div className="hero-scene__orbit hero-scene__orbit--two" aria-hidden="true" />
      <div className="hero-scene__core">
        <div className="hero-scene__glass" />
        <img
          className="hero-scene__logo"
          src="/mh-logo-960.png"
          srcSet="/mh-logo-640.png 640w, /mh-logo-960.png 960w, /mh-logo.png 1254w"
          sizes="(max-width: 800px) 72vw, 38vw"
          alt="Monograma de MH Astral Systems"
          width="960"
          height="960"
        />
        <span className="hero-scene__scan" aria-hidden="true" />
      </div>

      <div className="float-card float-card--web">
        <span className="float-card__icon">
          <Code2 size={17} />
        </span>
        <span>
          <small>WEB</small>
          <strong>Experiencia activa</strong>
        </span>
        <i />
      </div>
      <div className="float-card float-card--system">
        <span className="float-card__icon float-card__icon--violet">
          <Layers3 size={17} />
        </span>
        <span>
          <small>SISTEMA</small>
          <strong>Datos conectados</strong>
        </span>
        <Check size={15} />
      </div>
      <div className="float-card float-card--automation">
        <Zap size={15} />
        <span>Flujos automáticos</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__aurora hero__aurora--one" aria-hidden="true" />
      <div className="hero__aurora hero__aurora--two" aria-hidden="true" />
      <div className="hero__content">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">
            <span />
            Diseño web · software · sistemas
          </p>
          <h1>
            Diseño lo que tus clientes <em>ven.</em>
            <br />
            Construyo lo que tu negocio <strong>necesita.</strong>
          </h1>
          <p className="hero__lead">
            Páginas que convencen. Sistemas que ordenan. Una sola visión para convertir la operación de tu negocio en
            una ventaja.
          </p>
          <div className="hero__actions">
            <a className="button button--primary button--large" href={waLink} target="_blank" rel="noreferrer">
              <MessageCircle size={19} />
              Cuéntame tu proyecto
              <ArrowUpRight size={17} />
            </a>
            <a className="button button--ghost button--large" href="#proyectos">
              Ver sistemas reales
              <ArrowDown size={17} />
            </a>
          </div>
          <div className="hero__trust">
            <span className="hero__avatars" aria-hidden="true">
              <i>MH</i>
              <i>
                <ShieldCheck size={16} />
              </i>
            </span>
            <p>
              <strong>Atención directa</strong>
              Hablas con quien diseña y construye.
            </p>
          </div>
        </div>
        <HeroVisual />
      </div>
      <div className="hero__rail" aria-label="Áreas de especialidad">
        <span>DESIGN</span>
        <i />
        <span>WEB</span>
        <i />
        <span>POS</span>
        <i />
        <span>CRM</span>
        <i />
        <span>AUTOMATION</span>
        <i />
        <span>DATA</span>
      </div>
    </section>
  );
}

function SectionIntro({ index, eyebrow, title, copy, align = 'left' }) {
  return (
    <div className={`section-intro section-intro--${align}`} data-reveal>
      <p className="eyebrow">
        <span />
        {index} / {eyebrow}
      </p>
      <h2>{title}</h2>
      {copy && <p className="section-intro__copy">{copy}</p>}
    </div>
  );
}

function ProductMock({ service }) {
  const Icon = service.icon;
  return (
    <div className="product-mock" style={{ '--service-color': service.color }}>
      <div className="product-mock__chrome">
        <span className="chrome-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="chrome-address">app.mhastral.systems / demo</span>
        <span className="chrome-live">
          <i />
          LIVE
        </span>
      </div>
      <div className="product-mock__app">
        <aside className="mock-sidebar">
          <span className="mock-sidebar__brand">MH</span>
          {[0, 1, 2, 3, 4].map((item) => (
            <span key={item} className={item === 0 ? 'active' : ''} />
          ))}
          <span className="mock-sidebar__user" />
        </aside>
        <div className="mock-content">
          <div className="mock-content__head">
            <span>
              <small>{service.kicker}</small>
              <strong>{service.windowTitle}</strong>
            </span>
            <span className="mock-status">
              <i />
              {service.windowStatus}
            </span>
          </div>
          <div className="mock-metric-row">
            <div className="mock-main-metric">
              <span className="mock-main-metric__icon">
                <Icon size={21} />
              </span>
              <strong>{service.metric}</strong>
              <small>{service.metricLabel}</small>
            </div>
            <div className="mock-donut" aria-hidden="true">
              <span>MH</span>
            </div>
          </div>
          <div className="mock-chart" aria-hidden="true">
            <div className="mock-chart__lines" />
            <div className="mock-chart__bars">
              {service.bars.map((height, index) => (
                <i key={`${service.id}-${index}`} style={{ '--height': `${height}%`, '--delay': `${index * 60}ms` }} />
              ))}
            </div>
          </div>
          <div className="mock-list">
            {[82, 68, 91].map((width, index) => (
              <span key={width}>
                <i />
                <b style={{ width: `${width}%` }} />
                <em>{index === 0 ? 'Ahora' : index === 1 ? 'En proceso' : 'Listo'}</em>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="product-mock__reflection" aria-hidden="true" />
    </div>
  );
}

function Services() {
  const [activeId, setActiveId] = useState(SERVICE_VIEWS[0].id);
  const active = useMemo(
    () => SERVICE_VIEWS.find((service) => service.id === activeId) ?? SERVICE_VIEWS[0],
    [activeId],
  );

  return (
    <section className="section services" id="servicios">
      <div className="section-shell">
        <SectionIntro
          index="01"
          eyebrow="Capacidades"
          title={
            <>
              Tu negocio no necesita otra herramienta aislada.
              <br />
              <span>Necesita que todo tenga sentido.</span>
            </>
          }
          copy="Diseño la parte que ve tu cliente y construyo la parte que usa tu equipo. Explora los cuatro frentes principales."
        />

        <div className="services__lab" data-reveal>
          <div className="services__selector" role="tablist" aria-label="Explorar servicios">
            {SERVICE_VIEWS.map((service, index) => {
              const Icon = service.icon;
              const selected = active.id === service.id;
              return (
                <button
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="service-panel"
                  key={service.id}
                  className={selected ? 'active' : ''}
                  onClick={() => setActiveId(service.id)}
                  style={{ '--service-color': service.color }}
                >
                  <span className="services__selector-index">0{index + 1}</span>
                  <span className="services__selector-icon">
                    <Icon size={20} />
                  </span>
                  <span>
                    <small>{service.kicker}</small>
                    <strong>{service.short}</strong>
                  </span>
                  <ChevronRight className="services__selector-arrow" size={18} />
                </button>
              );
            })}
          </div>

          <div className="services__stage" id="service-panel" role="tabpanel" key={active.id}>
            <div className="services__stage-copy">
              <p>{active.kicker}</p>
              <h3>{active.title}</h3>
              <span>{active.description}</span>
              <div className="services__tags">
                {active.tags.map((tag) => (
                  <small key={tag}>
                    <Check size={12} />
                    {tag}
                  </small>
                ))}
              </div>
            </div>
            <ProductMock service={active} />
          </div>
        </div>

        <div className="services__extras" data-reveal>
          <span className="services__extras-label">También construyo</span>
          <div>
            {EXTRA_SERVICES.map((service) => (
              <span key={service.label}>
                {createElement(service.icon, { size: 16 })}
                {service.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseCard({ item, index }) {
  const Icon = item.icon;
  return (
    <article className={`case-card case-card--${item.material}`} data-reveal style={{ '--reveal-delay': `${index * 70}ms` }}>
      <div className="case-card__top">
        <span>{item.folio}</span>
        <span className="case-card__icon">
          <Icon size={22} />
        </span>
      </div>
      <div className="case-card__visual" aria-hidden="true">
        <span className="case-card__window">
          <i />
          <i />
          <i />
          <strong>{item.client.slice(0, 2).toUpperCase()}</strong>
        </span>
        <span className="case-card__line case-card__line--one" />
        <span className="case-card__line case-card__line--two" />
        <span className="case-card__line case-card__line--three" />
        <span className="case-card__pulse" />
      </div>
      <div className="case-card__body">
        <p>{item.type}</p>
        <h3>{item.client}</h3>
        <span>{item.description}</span>
        <div className="case-card__tags">
          {item.tags.map((tag) => (
            <small key={tag}>{tag}</small>
          ))}
        </div>
      </div>
    </article>
  );
}

function Projects() {
  return (
    <section className="section projects" id="proyectos">
      <div className="projects__halo" aria-hidden="true" />
      <div className="section-shell">
        <div className="projects__heading-row">
          <SectionIntro
            index="02"
            eyebrow="Trabajo real"
            title={
              <>
                No vendo pantallas bonitas.
                <br />
                <span>Construyo herramientas que trabajan.</span>
              </>
            }
            copy="Estos son proyectos para negocios reales de CDMX. Cada uno resuelve un problema operativo distinto."
          />
          <div className="projects__stamp" data-reveal aria-label="Sistemas reales, negocios reales en Ciudad de México">
            <span>REAL SYSTEMS · REAL BUSINESS · CDMX ·</span>
            <Sparkles size={28} />
          </div>
        </div>
        <div className="projects__grid">
          {CASES.map((item, index) => (
            <CaseCard key={item.folio} item={item} index={index} />
          ))}
        </div>
        <p className="projects__truth" data-reveal>
          <ShieldCheck size={18} />
          Sin testimonios inventados, sin métricas de humo: proyectos concretos, alcance claro y contacto directo.
        </p>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section process" id="proceso">
      <div className="section-shell">
        <SectionIntro
          index="03"
          eyebrow="Método"
          align="center"
          title={
            <>
              Claridad antes de código.
              <br />
              <span>Avances antes de promesas.</span>
            </>
          }
          copy="Un proceso compacto para pasar de una idea dispersa a una solución que tu negocio realmente puede usar."
        />
        <div className="process__line" aria-hidden="true">
          <span />
        </div>
        <ol className="process__steps">
          {PROCESS.map((step, index) => (
            <li key={step.number} data-reveal style={{ '--reveal-delay': `${index * 80}ms` }}>
              <span className="process__number">{step.number}</span>
              <span className="process__dot">
                <i />
              </span>
              <div className="process__card">
                <small>PASO {step.number}</small>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <ArrowRight size={19} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section contact" id="contacto">
      <div className="section-shell">
        <div className="contact__panel" data-reveal>
          <div className="contact__noise" aria-hidden="true" />
          <div className="contact__copy">
            <p className="eyebrow">
              <span />
              04 / Empecemos
            </p>
            <h2>
              Si tu negocio ya creció,
              <br />
              <strong>tu sistema también debería.</strong>
            </h2>
            <p>
              Cuéntame qué haces, dónde se atora hoy tu operación y qué te gustaría mejorar. Yo te digo con honestidad
              qué conviene construir — y qué no.
            </p>
            <div className="contact__actions">
              <a className="button button--light button--large" href={waLink} target="_blank" rel="noreferrer">
                <MessageCircle size={19} />
                Escribir por WhatsApp
                <ArrowUpRight size={17} />
              </a>
              <a className="contact__phone" href={`tel:+${CONTACT.whatsapp}`}>
                {CONTACT.phone}
              </a>
            </div>
          </div>

          <div className="founder-card">
            <div className="founder-card__header">
              <Brand compact />
              <span>DIRECTO</span>
            </div>
            <div className="founder-card__portrait">
              <img src="/mh-logo-640.png" alt="" width="170" height="170" />
              <span />
            </div>
            <p>Fundador · diseñador · desarrollador</p>
            <h3>{CONTACT.owner}</h3>
            <div className="founder-card__details">
              <a href={`mailto:${CONTACT.email}`}>
                <Mail size={15} />
                {CONTACT.email}
              </a>
              <span>
                <MapPin size={15} />
                {CONTACT.location}
              </span>
            </div>
            <div className="founder-card__signature">MH97</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="section-shell">
        <div className="footer__top">
          <Brand />
          <p>
            Diseño que vende.
            <br />
            Sistemas que ordenan.
          </p>
          <a href="#inicio">
            Volver arriba
            <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} MH Astral Systems</span>
          <span>Hecho por Miguel Huerta Bautista · CDMX</span>
          <span>UX · WEB · SYSTEMS</span>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsApp() {
  return (
    <a className="floating-whatsapp" href={waLink} target="_blank" rel="noreferrer" aria-label="Escribir por WhatsApp">
      <span>Hablemos</span>
      <MessageCircle size={21} />
      <i />
    </a>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const progress = useScrollProgress();
  useRevealObserver();

  useEffect(() => {
    document.body.classList.toggle('is-loading', loading);
    return () => document.body.classList.remove('is-loading');
  }, [loading]);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />
      <Navigation />
      <main id="contenido">
        <Hero />
        <Services />
        <Projects />
        <Process />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <div className="cursor-hint" aria-hidden="true">
        <MousePointer2 size={12} />
      </div>
    </>
  );
}
