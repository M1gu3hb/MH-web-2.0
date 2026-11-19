/**
 * La marca del producto.
 *
 * «Morphiq» en la plata de la casa y «POS» dentro de una tecla azul: se lee
 * como una marca propia sin dejar de ser de la familia. Va en texto y no en
 * imagen para que escale, se pueda seleccionar y un lector diga el nombre.
 */
export function MarcaPos({ className = '', conSimbolo = true, etiqueta = 'h2', firma = true }) {
  const Tag = etiqueta;
  return (
    <Tag className={`marca-pos ${className}`} translate="no">
      {/* El nombre, en texto de verdad para quien no ve el dibujo. Un
          `aria-label` sobre un párrafo no lo anuncian todos los lectores;
          un texto oculto a la vista sí. */}
      <span className="rb-visually-hidden">MorphiqPOS{firma ? ', por Astral Morphiq Systems' : ''}</span>
      {conSimbolo && (
        <img className="marca-pos__simbolo" src="/marca/simbolo-v2-sm.webp" alt="" width="64" height="64" loading="lazy" />
      )}
      <span className="marca-pos__nombre" aria-hidden="true">
        Morphiq<b>POS</b>
      </span>
      {firma && (
        <span className="marca-pos__firma" aria-hidden="true">
          por Astral Morphiq Systems
        </span>
      )}
    </Tag>
  );
}

/**
 * Regla ASCII: un separador hecho de caracteres, con una etiqueta en medio.
 * Es decoración, y va escondida a los lectores de pantalla.
 */
export function ReglaAscii({ etiqueta, className = '' }) {
  return (
    <div className={`regla-ascii ${className}`} aria-hidden="true">
      <span>+{'-'.repeat(6)}[</span>
      <b>{etiqueta}</b>
      <span className="regla-ascii__cola">]{'-'.repeat(220)}</span>
    </div>
  );
}
