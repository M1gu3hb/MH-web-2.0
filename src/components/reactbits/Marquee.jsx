/**
 * Marquee — cinta infinita. Patrón ReactBits / LogoLoop.
 * El contenido se duplica para que el bucle no tenga costura.
 */
export function Marquee({ items, speed = 34, reverse = false, className = '', separator = '◆' }) {
  return (
    <div className={`rb-marquee ${className}`} aria-hidden="true">
      <div
        className="rb-marquee__track"
        style={{ '--rb-marquee-speed': `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {[0, 1].map((copy) => (
          <div className="rb-marquee__group" key={copy}>
            {items.map((item, index) => (
              <span className="rb-marquee__item" key={`${copy}-${item}-${index}`}>
                {item}
                <i>{separator}</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
