/**
 * StarBorder — borde con un destello que recorre el perímetro.
 * Patrón ReactBits, adaptado a los acentos de la marca.
 */
export function StarBorder({ children, color = '#345dff', speed = 5, className = '', as: Tag = 'div' }) {
  return (
    <Tag className={`rb-star-border ${className}`} style={{ '--rb-star': color, '--rb-star-speed': `${speed}s` }}>
      <span className="rb-star-border__ray rb-star-border__ray--top" aria-hidden="true" />
      <span className="rb-star-border__ray rb-star-border__ray--bottom" aria-hidden="true" />
      <span className="rb-star-border__inner">{children}</span>
    </Tag>
  );
}
