import { useEffect } from 'react';
import Lenis from 'lenis';
import { motion as Motion, useScroll, useSpring } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { FloatingCTA } from './components/layout/FloatingCTA';
import { ClientStrip } from './components/layout/ClientStrip';
import { Hero } from './components/hero/Hero';
import { WorkSection } from './components/sections/WorkSection';
import { CapabilitiesSection } from './components/sections/CapabilitiesSection';
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
  const { scrollYProgress } = useScroll();
  const meter = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  useSmoothScroll(!reducedMotion);

  return (
    <>
      <Motion.div className="scroll-meter" style={{ scaleX: meter }} aria-hidden="true" />
      <div className="paper-grain" aria-hidden="true" />

      <Navigation />

      <main id="contenido">
        <Hero />
        <ClientStrip />
        <WorkSection />
        <CapabilitiesSection />
        <ProcessSection />
        <PricingSection />
        <AboutSection />
        <FaqSection />
        <ContactSection />
      </main>

      <Footer />
      <FloatingCTA />
      <ClickSpark color="#345dff" />

      <Analytics />
      <SpeedInsights />
    </>
  );
}
