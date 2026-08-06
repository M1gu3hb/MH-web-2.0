import { useEffect, useId, useRef, useSyncExternalStore } from 'react';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { SectionHeading } from '../primitives/SectionHeading';
import { Reveal } from '../reactbits';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { FAQ } from '../../content';
import { getFaqOpen, setFaqOpen, subscribeFaqOpen } from './faqOpenStore';

function FaqItem({ item, index, open, onToggle, base }) {
  const reduced = useReducedMotion();
  /* El identificador lleva el prefijo de su instancia: las preguntas se montan
     dos veces —la sección y su copia dentro de la laptop— y con un número fijo
     las dos parejas de botón y respuesta compartían identificador. Un lector
     de pantalla seguía el vínculo a la copia equivocada. */
  const panelId = `${base}-panel-${index}`;
  const buttonId = `${base}-button-${index}`;

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
  /* Compartido con la copia que vive dentro de la laptop: si cada una abriera
     la suya, los dos árboles dejarían de tener los mismos nodos y el reflejo
     —que empareja nodo a nodo— se rendiría. */
  const openIndex = useSyncExternalStore(subscribeFaqOpen, getFaqOpen, getFaqOpen);
  const base = useId();

  /* La salida deja las preguntas quietas mientras la ventana se cierra, y
     para pegarlas por su final hace falta saber cuánto miden: Chrome ignora
     `bottom` en un elemento más alto que el viewport, así que el pegado se
     hace con un `top` negativo que solo se puede calcular con la medida real.
     Cambia al abrir y cerrar respuestas, de ahí el observador. */
  const box = useRef(null);
  useEffect(() => {
    const el = box.current;
    if (embedded || !el) return undefined;
    let retry = 0;
    const write = () => {
      /* Durante el viaje no se remide: si el alto cambiara ahí, el pegado
         daría un salto en medio de la animación. Va tapado por el velo, pero
         el reflejo lo seguiría y la ventana se movería sin motivo.

         Y no se descarta: se reintenta. El observador solo avisa cuando el
         tamaño cambia, así que una medida perdida aquí no volvía sola nunca
         y el pegado se quedaba con un alto viejo hasta el siguiente cambio. */
      if (document.body.classList.contains('in-transit')) {
        cancelAnimationFrame(retry);
        retry = requestAnimationFrame(write);
        return;
      }
      document.documentElement.style.setProperty('--faq-h', `${Math.round(el.offsetHeight)}px`);
    };
    write();
    /* Por caja de borde: el respiro de abajo cambia al montarse la escena, y
       observando la caja de contenido ese cambio no llega a notificarse. La
       medida se quedaba con el alto de antes y el pegado caía un centenar de
       píxeles más abajo de la cuenta. */
    const ro = new ResizeObserver(write);
    ro.observe(el, { box: 'border-box' });
    return () => {
      cancelAnimationFrame(retry);
      ro.disconnect();
    };
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
            base={base}
            open={openIndex === index}
            onToggle={() => setFaqOpen(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </section>
  );
}
