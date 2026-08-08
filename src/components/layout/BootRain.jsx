import { useEffect, useRef } from 'react';

/* Los azules del propio monograma, del más apagado al del filo. */
const AZULES = ['#123a7a', '#1b56a8', '#2a76d6', '#4a9bf0'];
const GLIFOS = 'MORPHIQ01<>{}[]/\\=+*-:.';

/**
 * Lluvia de caracteres detrás del arranque. Tenue a propósito: es fondo, no
 * espectáculo, y compite por el hilo principal justo cuando se está cargando
 * todo lo demás. De ahí que vaya a media resolución, con pocas columnas y a
 * un tercio de los fotogramas.
 */
export function BootRain() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let w = 0;
    let h = 0;
    let cols = 0;
    let gotas = [];
    const paso = 16;

    const medir = () => {
      /* A media resolución: se ve igual de bien difuminado y cuesta la cuarta
         parte de píxeles. */
      w = Math.ceil(window.innerWidth / 2);
      h = Math.ceil(window.innerHeight / 2);
      canvas.width = w;
      canvas.height = h;
      cols = Math.ceil(w / paso);
      gotas = Array.from({ length: cols }, () => ({
        y: Math.random() * -h,
        v: 0.55 + Math.random() * 1.1,
        tono: AZULES[Math.floor(Math.random() * AZULES.length)],
      }));
      ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textBaseline = 'top';
    };

    medir();
    window.addEventListener('resize', medir);

    let frame = 0;
    let salto = 0;

    const dibuja = () => {
      frame = requestAnimationFrame(dibuja);
      salto += 1;
      if (salto % 3) return;

      /* El rastro se borra con un velo, no con un limpiado: así cada gota deja
         estela sin tener que guardar su historia. */
      ctx.fillStyle = 'rgba(8, 6, 21, 0.20)';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < gotas.length; i += 1) {
        const g = gotas[i];
        ctx.fillStyle = g.tono;
        ctx.fillText(GLIFOS[(Math.random() * GLIFOS.length) | 0], i * paso, g.y);
        g.y += g.v * paso * 0.42;
        if (g.y > h + 40) {
          g.y = -20 - Math.random() * 120;
          g.v = 0.55 + Math.random() * 1.1;
        }
      }
    };

    frame = requestAnimationFrame(dibuja);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', medir);
    };
  }, []);

  return <canvas className="boot__rain" ref={ref} aria-hidden="true" />;
}
