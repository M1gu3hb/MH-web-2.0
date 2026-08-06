import { useCallback, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion as Motion, useScroll, useSpring } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { FloatingCTA } from './components/layout/FloatingCTA';
import { ProjectCarousel } from './components/layout/ProjectCarousel';
import { BootLoader } from './components/layout/BootLoader';
import { Hero } from './components/hero/Hero';
import { LaptopStage } from './components/hero/LaptopStage';
import { ScrollCue } from './components/primitives/ScrollCue';
import { CapabilitiesSection } from './components/sections/CapabilitiesSection';
import { WorkSection } from './components/sections/WorkSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { PricingSection } from './components/sections/PricingSection';
import { AboutSection } from './components/sections/AboutSection';
import { FaqSection } from './components/sections/FaqSection';
import { ContactSection } from './components/sections/ContactSection';
import { ClickSpark } from './components/reactbits';
import { useReducedMotion } from './hooks/useReducedMotion';

function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    });

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [enabled]);
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [booting, setBooting] = useState(true);
  const { scrollYProgress } = useScroll();
  const meter = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  const finishBoot = useCallback(() => setBooting(false), []);

  useSmoothScroll(!reducedMotion && !booting);

  useEffect(() => {
    document.body.classList.toggle('is-booting', booting);
    return () => document.body.classList.remove('is-booting');
  }, [booting]);

  /* Llegar con un ancla en la dirección. Mientras arranca, el scroll está
     bloqueado y el salto que hace el navegador se pierde: compartir un enlace
     a #contacto aterrizaba arriba del todo, como si el ancla no existiera. Se
     repite el salto al terminar, y con dos fotogramas de espera porque la
     maquetación todavía se está asentando. */
  useEffect(() => {
    if (booting) return undefined;
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return undefined;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' });
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [booting]);

  return (
    <>
      <AnimatePresence>{booting && <BootLoader onDone={finishBoot} />}</AnimatePresence>

      {/* Mientras arranca, la página de detrás queda fuera de alcance. El
          scroll ya estaba bloqueado, pero el tabulador seguía entrando en
          una web que aún no se ve, y el foco se perdía detrás del velo.
          El envoltorio no crea caja, así que no cambia la maquetación. */}
      <div className="app-shell" inert={booting ? '' : undefined}>
      <Motion.div className="scroll-meter" style={{ scaleX: meter }} aria-hidden="true" />
      <div className="paper-grain" aria-hidden="true" />

      <Navigation />
      {/* Se monta desde el arranque: la pantalla de carga espera a que
          la laptop esté lista, que para eso está. */}
      <LaptopStage enabled />

      <main id="contenido">
        <Hero />

        {/* Tramo negro donde la laptop crece hasta cubrir la pantalla: a
            partir de aquí la página ocurre «dentro» de ella. */}
        <div className="stage-gap stage-gap--in" id="zoom-in">
          <ScrollCue label="Desliza para entrar" />
        </div>

        <ProjectCarousel />
        <CapabilitiesSection />
        <WorkSection />
        <ProcessSection />
        <PricingSection />
        <AboutSection />
        {/* La salida no se hace sobre negro: las preguntas se quedan pegadas
            por su final mientras el tramo corre por debajo, así que la ventana
            se cierra encima de lo último que se estaba leyendo. */}
        <div className="stage-exit">
          <FaqSection />
          <div className="stage-gap stage-gap--out" id="zoom-out">
            <ScrollCue label="Desliza para salir" />
          </div>
        </div>

        <ContactSection />
      </main>

      <Footer />
        <FloatingCTA />
      </div>

      <ClickSpark color="#5227ff" />

      <Analytics />
      <SpeedInsights />
    </>
  );
}
