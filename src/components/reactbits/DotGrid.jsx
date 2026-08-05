import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * DotGrid — retícula de puntos que reacciona al cursor con un halo de
 * proximidad. Patrón ReactBits, sobre canvas para no crear miles de nodos.
 */
export function DotGrid({ gap = 30, dot = 1.6, proximity = 132, color = '21, 22, 20', accent = '52, 93, 255' }) {
  const canvas = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const element = canvas.current;
    if (!element) return undefined;
    const context = element.getContext('2d');
    const pointer = { x: -9999, y: -9999 };
    let frame;
    let width = 0;
    let height = 0;

    const resize = () => {
      const bounds = element.parentElement.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      element.width = width * ratio;
      element.height = height * ratio;
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const columns = Math.ceil(width / gap);
      const rows = Math.ceil(height / gap);

      for (let column = 0; column <= columns; column += 1) {
        for (let row = 0; row <= rows; row += 1) {
          const x = column * gap;
          const y = row * gap;
          const distance = reduced ? proximity : Math.hypot(pointer.x - x, pointer.y - y);
          const influence = Math.max(0, 1 - distance / proximity);
          const radius = dot * (1 + influence * 2.1);
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fillStyle =
            influence > 0.04
              ? `rgba(${accent}, ${0.14 + influence * 0.66})`
              : `rgba(${color}, 0.14)`;
          context.fill();
        }
      }
    };

    const handleMove = (event) => {
      const bounds = element.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };

    const handleLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element.parentElement);
    if (!reduced) {
      window.addEventListener('pointermove', handleMove, { passive: true });
      window.addEventListener('pointerleave', handleLeave);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerleave', handleLeave);
      cancelAnimationFrame(frame);
    };
  }, [accent, color, dot, gap, proximity, reduced]);

  return <canvas ref={canvas} className="rb-dot-grid" aria-hidden="true" />;
}
