/**
 * ============================================================
 * LAS MAQUETAS DE CADA SERVICIO
 * ============================================================
 *
 * Este archivo ya no dibuja nada: solo reparte. Cada maqueta vive en su
 * propio archivo dentro de `maquetas/`, porque ahora cada una tiene estado,
 * un guion y dos modos de comportarse, y meterlas todas aquí volvía a dejar
 * un archivo que nadie quiere abrir.
 *
 * Los nombres de exportación son los de siempre —`WebsiteScreen`,
 * `PosScreen`…— a propósito: los importan tres sitios y renombrarlos habría
 * mezclado el rediseño con un cambio mecánico en archivos que no tienen
 * nada que ver.
 *
 * LOS DOS MODOS
 * Todas aceptan `interactivo`. Sin él son un dibujo que cuenta su historia
 * en bucle, sin nada tocable ni enfocable: así van dentro de la tarjeta de
 * la home, que es un enlace entero y va marcada `aria-hidden`. Con él son
 * una demo de verdad, y ahí es donde el visitante puede tocar el servicio
 * en vez de leerlo.
 *
 * Por qué se rehicieron y con qué reglas está escrito en la cabecera de
 * `src/styles/maquetas.css`, junto al diagnóstico que las condenó: dibujadas
 * a tamaño de escritorio y encogidas a la mitad, sus textos medían tres
 * píxeles y lo único que comunicaban era su forma más grande.
 */

import { Factura } from './maquetas/Factura';
import { Medida } from './maquetas/Medida';
import { Punto } from './maquetas/Punto';
import { Restaurante } from './maquetas/Restaurante';
import { Seguimiento } from './maquetas/Seguimiento';
import { Sitio } from './maquetas/Sitio';

export function WebsiteScreen({ interactivo = false }) {
  return <Sitio interactivo={interactivo} />;
}

export function PosScreen({ interactivo = false }) {
  return <Punto interactivo={interactivo} />;
}

/* `CrmScreen` y `AutomationScreen` eran dos dibujos distintos —una ficha de
   cliente y un lienzo de nodos— y el sitio los repartía sin criterio: la
   tarjeta de la home pintaba el de nodos y la página del servicio el de la
   ficha, así que quien hacía clic llegaba a otra cosa. Ahora es una sola
   maqueta que cuenta las dos mitades del servicio a la vez, y los dos
   nombres apuntan a ella. */
export function CrmScreen({ interactivo = false }) {
  return <Seguimiento interactivo={interactivo} />;
}

export function AutomationScreen({ interactivo = false }) {
  return <Seguimiento interactivo={interactivo} />;
}

export function SoftwareScreen({ interactivo = false }) {
  return <Medida interactivo={interactivo} />;
}

export function RestauranteScreen({ interactivo = false }) {
  return <Restaurante interactivo={interactivo} />;
}

export function FacturacionScreen({ interactivo = false }) {
  return <Factura interactivo={interactivo} />;
}
