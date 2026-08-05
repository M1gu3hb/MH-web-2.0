import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { trackWhatsApp, whatsappUrl } from '../../lib/whatsapp';

/**
 * Aparece al salir del hero y se esconde sobre la sección de contacto, para
 * no tapar el CTA principal en móvil.
 */
export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const contact = document.getElementById('contacto');

    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.75;
      const overContact = contact
        ? contact.getBoundingClientRect().top < window.innerHeight * 0.85
        : false;
      setVisible(pastHero && !overContact);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <Motion.a
          className="floating-contact"
          href={whatsappUrl('floating')}
          target="_blank"
          rel="noreferrer"
          aria-label="Escribir por WhatsApp"
          onClick={() => trackWhatsApp('floating')}
          initial={{ opacity: 0, y: 22, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 22, scale: 0.92 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>Hablemos</span>
          <MessageCircle size={21} aria-hidden="true" />
          <i aria-hidden="true" />
        </Motion.a>
      )}
    </AnimatePresence>
  );
}
