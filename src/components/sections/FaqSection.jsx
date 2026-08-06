import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { SectionHeading } from '../primitives/SectionHeading';
import { Reveal } from '../reactbits';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { FAQ } from '../../content';

function FaqItem({ item, index, open, onToggle }) {
  const reduced = useReducedMotion();
  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  return (
    <Reveal as="div" className={`faq-item ${open ? 'faq-item--open' : ''}`} delay={index * 0.03} amount={0.2}>
      <h3>
        <button type="button" id={buttonId} aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
          <span className="faq-item__index">{String(index + 1).padStart(2, '0')}</span>
          <span className="faq-item__question">{item.q}</span>
          <Plus size={20} aria-hidden="true" className="faq-item__icon" />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <Motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p className="faq-item__answer">{item.a}</p>
          </Motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  );
}

export function FaqSection({ embedded = false }) {
  const [openIndex, setOpenIndex] = useState(0);

  /* La salida deja las preguntas quietas mientras la ventana se cierra, y
     para pegarlas por su final hace falta saber cuánto miden: Chrome ignora
     `bottom` en un elemento más alto que el viewport, así que el pegado se
     hace con un `top` negativo que solo se puede calcular con la medida real.
     Cambia al abrir y cerrar respuestas, de ahí el observador. */
  const box = useRef(null);
  useEffect(() => {
    const el = box.current;
    if (embedded || !el) return undefined;
    const write = () => {
      document.documentElement.style.setProperty('--faq-h', `${Math.round(el.offsetHeight)}px`);
    };
    write();
    /* Por caja de borde: el respiro de abajo cambia al montarse la escena, y
       observando la caja de contenido ese cambio no llega a notificarse. La
       medida se quedaba con el alto de antes y el pegado caía un centenar de
       píxeles más abajo de la cuenta. */
    const ro = new ResizeObserver(write);
    ro.observe(el, { box: 'border-box' });
    return () => ro.disconnect();
  }, [embedded]);

  return (
    <section
      ref={embedded ? undefined : box}
      className="faq section-pad"
      id={embedded ? undefined : 'preguntas'}
      aria-hidden={embedded || undefined}
      inert={embedded ? '' : undefined}
    >
      <SectionHeading eyebrow={FAQ.eyebrow} title={FAQ.title} />

      <div className="faq__list">
        {FAQ.items.map((item, index) => (
          <FaqItem
            key={item.q}
            item={item}
            index={index}
            open={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </section>
  );
}
