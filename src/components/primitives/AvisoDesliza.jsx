import { useEffect, useState } from 'react';

/**
 * El aviso de que el scroll continúa. Vive dentro de las secciones fijadas
 * (servicios, trabajo, proceso): si el visitante se detiene un momento a
 * media coreografía, a los ~1.6s aparece «Desliza para continuar» abajo,
 * y se esconde en cuanto vuelve a moverse. Mucha gente se queda parada a
 * la mitad sin saber que scrolleando se sigue.
 *
 * `zona` es la ref del contenedor alto (el que fija la pantalla): el aviso
 * solo sale cuando ese contenedor está de verdad a media coreografía, con
 * recorrido por delante y por detrás.
 */
export function AvisoDesliza({ zona }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer = 0;

    const comprobar = () => {
      const el = zona.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dentro = r.top < -80 && r.bottom > window.innerHeight + 80;
      if (dentro) setVisible(true);
    };

    const onScroll = () => {
      setVisible(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(comprobar, 1600);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    timer = window.setTimeout(comprobar, 1800);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [zona]);

  return (
    <div className={`aviso-desliza ${visible ? 'is-visible' : ''}`} aria-hidden="true">
      <span className="aviso-desliza__rueda"><i /></span>
      Desliza para continuar
    </div>
  );
}
