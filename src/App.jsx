import { useCallback, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { motion as Motion, useScroll } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { CapabilityDeck } from './components/CapabilityDeck';
import { ContactSection } from './components/ContactSection';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { PageLoader } from './components/PageLoader';
import { ProcessSection } from './components/ProcessSection';
import { WorkSection } from './components/WorkSection';
import { CONTACT, WHATSAPP_MESSAGE } from './data';

const whatsappUrl = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

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
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const finishLoading = useCallback(() => setLoading(false), []);

  useSmoothScroll(!loading);

  useEffect(() => {
    document.body.classList.toggle('is-loading', loading);
    return () => document.body.classList.remove('is-loading');
  }, [loading]);

  return (
    <>
      {loading && <PageLoader onComplete={finishLoading} />}
      <Motion.div className="scroll-meter" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <Navigation whatsappUrl={whatsappUrl} />
      <main>
        <Hero whatsappUrl={whatsappUrl} />
        <CapabilityDeck />
        <WorkSection />
        <ProcessSection />
        <ContactSection whatsappUrl={whatsappUrl} />
      </main>
      <a className="floating-contact" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Escribir por WhatsApp">
        <span>Hablemos</span>
        <MessageCircle size={21} />
        <i />
      </a>
    </>
  );
}
