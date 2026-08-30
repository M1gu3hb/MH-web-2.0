import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

import {
  AutomationScreen,
  FacturacionScreen,
  PosScreen,
  RestauranteScreen,
  SoftwareScreen,
  WebsiteScreen,
} from '../mockups/ServiceScreens';

/**
 * ============================================================
 * UN FRENTE, A DOBLE PÁGINA
 * ============================================================
 *
 * Sustituye a `TarjetaServicio` en el bloque «Los cinco frentes, en detalle»
 * de `/servicios`.
 *
 * QUÉ ESTABA MAL
 * Cinco tarjetas idénticas en una rejilla `auto-fit` de 300 px, cada una con
 * su foto cuadrada. Eso es la retícula de una tienda: cinco cosas del mismo
 * tamaño, con su foto y su precio, para que elijas una. Pero un servicio no
 * se elige de un estante comparando miniaturas, y menos cuando las fotos son
 * decorativas y no enseñan el producto —eran ilustraciones de archivo que no
 * tenían nada que ver con lo que hace cada servicio—.
 *
 * Es el mismo problema que tenía el portafolio antes de rehacerlo.
 *
 * QUÉ SE HACE AHORA
 * Cada frente ocupa una franja entera, con la maqueta viva a un lado y el
 * detalle al otro, y el lado se alterna al bajar. Es un expediente, no un
 * catálogo: se lee de arriba abajo, cada pieza tiene sitio para explicarse,
 * y lo que ilustra el servicio es EL SERVICIO —la misma maqueta que preside
 * su página— y no una foto puesta de relleno.
 *
 * POR QUÉ LA MAQUETA NO ES INTERACTIVA AQUÍ
 * Podría serlo: no va dentro de un enlace, que es lo que lo impide en la
 * tarjeta de la home. Pero cinco demos tocables en la misma página no dan
 * cinco veces más ganas de tocar; dan la duda de cuál es la buena. Aquí la
 * escena corre sola —y solo mientras se está viendo— y el botón lleva a la
 * página del servicio, que es donde se puede tocar. Que quede algo por
 * hacer al otro lado del clic es la razón de hacer clic.
 */

const MAQUETA_DE = {
  web: WebsiteScreen,
  sistemas: PosScreen,
  crm: AutomationScreen,
  software: SoftwareScreen,
  restaurantes: RestauranteScreen,
  facturacion: FacturacionScreen,
};

export function FrenteServicio({ servicio, indice = 0 }) {
  const Maqueta = MAQUETA_DE[servicio.id];

  /* El lado se decide aquí y no con `:nth-child(even)` en CSS. `Cascada`
     envuelve cada hijo en su propio `div` para escalonar la entrada, así que
     en el DOM cada franja es hija única de su envoltorio y `nth-child` no
     casa nunca: el alternado no se veía. Atado al índice, sobrevive a
     cualquier envoltorio que se le ponga encima. */
  const espejo = indice % 2 === 1;

  return (
    <article
      className={`frente ${espejo ? 'frente--espejo' : ''}`}
      style={{ '--acento': servicio.acento }}
    >
      {/* La maqueta es decorativa para un lector de pantalla: no hay nada en
          ella que no esté escrito al lado en texto. */}
      {Maqueta && (
        <div className="frente__maqueta" aria-hidden="true">
          <div className="frente__pantalla">
            <Maqueta />
          </div>
        </div>
      )}

      <div className="frente__texto">
        <span className="frente__indice" aria-hidden="true">
          {String(indice + 1).padStart(2, '0')}
        </span>

        <h3 className="frente__nombre">
          {/* El enlace va en el título y no en la franja entera: con la
              franja entera clicable, el cursor sobre la maqueta prometería
              una interacción que aquí no existe. */}
          <Link to={servicio.ruta}>{servicio.nombre}</Link>
        </h3>

        <p className="frente__promesa">{servicio.promesa}</p>
        <p className="frente__para">{servicio.paraTi}</p>

        <ul className="frente__puntos">
          {servicio.puntos.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <Link to={servicio.ruta} className="frente__ver">
          Ver el servicio
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
