/**
 * ============================================================
 * PORTADA TIPOGRÁFICA DE PROYECTO
 * ============================================================
 *
 * Los seis proyectos de cliente tienen maqueta horneada: son sitios, y de un
 * sitio se puede enseñar una pantalla. Los productos propios —una app de
 * escritorio, un motor en Rust, una librería de interfaz— no tienen ninguna
 * pantalla que valga como retrato: enseñar una ventana de terminal o un panel
 * de ajustes no dice nada de lo que el proyecto es.
 *
 * Así que en vez de fingir una captura, llevan una portada tipográfica: la
 * inicial del proyecto enorme, su color de identidad, y la pila técnica
 * escrita en monoespaciada. Es honesto —no simula una interfaz que no se ve
 * así— y además distingue de un vistazo las dos naturalezas del portafolio:
 * lo que se construyó para alguien y lo que es de la casa.
 *
 * Todo es CSS y texto: ni una imagen que descargar, ni una petición más.
 */

export function PortadaProyecto({ proyecto }) {
  const inicial = (proyecto.nombre || '?').trim().charAt(0).toUpperCase();
  const pila = (proyecto.tecnologias || []).slice(0, 5);

  return (
    <span className="portada-proyecto" aria-hidden="true">
      <span className="portada-proyecto__reticula" />
      <span className="portada-proyecto__inicial">{inicial}</span>
      <span className="portada-proyecto__pila">
        {pila.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </span>
      <span className="portada-proyecto__pie">{proyecto.tipo}</span>
    </span>
  );
}
