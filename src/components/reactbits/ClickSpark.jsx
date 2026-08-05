import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * ClickSpark — chispas que salen del punto donde el usuario hace clic.
 * Patrón ReactBits, sobre un canvas único a pantalla completa.
 */
export function ClickSpark({ color = '#345dff', count = 9, size = 13, duration = 420 }) {
  const canvas = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const element = canvas.current;
    if (!element) return undefined;
    const context = element.getContext('2d');
    let sparks = [];
    let frame;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = window.innerWidth * ratio;
      element.height = window.innerHeight * ratio;
      element.style.width = `${window.innerWidth}px`;
      element.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const spawn = (event) => {
      const born = performance.now();
      for (let i = 0; i < count; i += 1) {
        sparks.push({ x: event.clientX, y: event.clientY, angle: (Math.PI * 2 * i) / count, born });
      }
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const draw = (now) => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparks = sparks.filter((spark) => now - spark.born < duration);

      sparks.forEach((spark) => {
        const progress = (now - spark.born) / duration;
        const eased = 1 - (1 - progress) ** 3;
        const distance = eased * size * 2.6;
        const length = size * (1 - eased) * 0.8;
        context.strokeStyle = color;
        context.globalAlpha = 1 - progress;
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.beginPath();
        context.moveTo(spark.x + Math.cos(spark.angle) * distance, spark.y + Math.sin(spark.angle) * distance);
        context.lineTo(
          spark.x + Math.cos(spark.angle) * (distance + length),
          spark.y + Math.sin(spark.angle) * (distance + length),
        );
        context.stroke();
      });

      context.globalAlpha = 1;
      if (sparks.length) {
        frame = requestAnimationFrame(draw);
      } else {
        frame = 0;
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointerdown', spawn);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', spawn);
      cancelAnimationFrame(frame);
    };
  }, [color, count, duration, reduced, size]);

  if (reduced) return null;
  return <canvas ref={canvas} className="rb-click-spark" aria-hidden="true" />;
}
