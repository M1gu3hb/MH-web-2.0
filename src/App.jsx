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

  return (
    <>
      <AnimatePresence>{booting && <BootLoader onDone={finishBoot} />}</AnimatePresence>

      <Motion.div className="scroll-meter" style={{ scaleX: meter }} aria-hidden="true" />
      <div className="paper-grain" aria-hidden="true" />

      <Navigation />
      <LaptopStage enabled={!booting} />

      <main id="contenido">
        <Hero />
        <ProjectCarousel />
        <CapabilitiesSection />
        <WorkSection />
        <ProcessSection />
        <PricingSection />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>

      <Footer />
      <FloatingCTA />
      <ClickSpark color="#5227ff" />

      <Analytics />
      <SpeedInsights />
    </>
  );
}
