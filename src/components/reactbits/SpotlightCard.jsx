import { useCallback, useRef } from 'react';

/**
 * SpotlightCard — un halo del color de acento sigue al cursor dentro de la
 * tarjeta. Patrón ReactBits, implementado con custom properties.
 */
export function SpotlightCard({ children, className = '', accent = '#345dff', as: Tag = 'div', ...rest }) {
  const node = useRef(null);

  const handleMove = useCallback((event) => {
    const element = node.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    element.style.setProperty('--rb-x', `${event.clientX - bounds.left}px`);
    element.style.setProperty('--rb-y', `${event.clientY - bounds.top}px`);
    element.style.setProperty('--rb-spot', '1');
  }, []);

  const handleLeave = useCallback(() => {
    node.current?.style.setProperty('--rb-spot', '0');
  }, []);

  return (
    <Tag
      ref={node}
      className={`rb-spotlight ${className}`}
      style={{ '--rb-accent': accent }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      <span className="rb-spotlight__glow" aria-hidden="true" />
      {children}
    </Tag>
  );
}
