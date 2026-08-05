/**
 * ShinyText — barrido de brillo continuo sobre un texto corto.
 * Patrón ReactBits. Se detiene con prefers-reduced-motion (ver reactbits.css).
 */
export function ShinyText({ children, speed = 4.5, className = '' }) {
  return (
    <span className={`rb-shiny ${className}`} style={{ '--rb-shiny-speed': `${speed}s` }}>
      {children}
    </span>
  );
}
