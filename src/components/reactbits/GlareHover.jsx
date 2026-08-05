/**
 * GlareHover — un reflejo diagonal barre la superficie al pasar el cursor.
 * Patrón ReactBits.
 */
export function GlareHover({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`rb-glare ${className}`} {...rest}>
      {children}
      <span className="rb-glare__sheen" aria-hidden="true" />
    </Tag>
  );
}
