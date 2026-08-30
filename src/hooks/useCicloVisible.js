import { useEffect, useRef, useState } from 'react';

import { useReducedMotion } from './useReducedMotion';

/**
 * ============================================================
 * EL CICLO QUE SOLO CORRE CUANDO SE ESTÁ VIENDO
 * ============================================================
 *
 * Las maquetas de servicio cuentan una historia corta —una venta, un
 * mensaje que sale solo, un ticket que se vuelve factura— y esa historia
 * necesita avanzar sola cuando nadie la está tocando.
 *
 * Un `setInterval` a secas no vale aquí, por tres razones concretas:
 *
 * · En la home hay CINCO maquetas montadas a la vez. Cinco temporizadores
 *   corriendo todo el rato, cuatro de ellos fuera de pantalla, es trabajo
 *   que nadie ve y batería que alguien paga.
 * · Con `prefers-reduced-motion` no puede haber ciclo ninguno. Y no basta
 *   con parar el reloj: hay que quedarse en un fotograma que se explique
 *   solo, porque ese fotograma es todo lo que esa persona va a ver. Por eso
 *   se devuelve `quieto`, y cada maqueta elige su paso más elocuente.
 * · Cuando la maqueta es interactiva, el ciclo estorba: si el visitante
 *   acaba de tocar un producto y dos segundos después la escena avanza
 *   sola, lo que aprende es que sus toques no importan.
 *
 * Devuelve `[paso, quieto]`. `quieto` es true cuando no hay animación
 * —movimiento reducido o ciclo apagado— para que quien lo use pinte el
 * estado completo en vez de uno intermedio.
 *
 * El observador vive en el mismo elemento que se anima, así que quien use
 * el hook tiene que colgar `ref` de la caja exterior de su maqueta.
 */
export function useCicloVisible(pasos, { ms = 2200, activo = true, ref, pasoQuieto = 0 } = {}) {
  const sinMovimiento = useReducedMotion();
  const [paso, setPaso] = useState(0);
  const [aLaVista, setALaVista] = useState(false);
  const reloj = useRef(null);

  /* A la vista o no. Umbral bajo a propósito: la maqueta es ancha y baja, y
     pedirle que esté medio dentro para arrancar significa que en un teléfono
     la historia empieza cuando ya te la pasaste. */
  useEffect(() => {
    const nodo = ref?.current;
    if (!nodo || typeof IntersectionObserver === 'undefined') {
      setALaVista(true);
      return undefined;
    }
    const observador = new IntersectionObserver(
      ([entrada]) => setALaVista(entrada.isIntersecting),
      { threshold: 0.15 }
    );
    observador.observe(nodo);
    return () => observador.disconnect();
  }, [ref]);

  const corriendo = activo && !sinMovimiento && aLaVista && pasos > 1;

  useEffect(() => {
    if (!corriendo) return undefined;
    reloj.current = setInterval(() => setPaso((p) => (p + 1) % pasos), ms);
    return () => clearInterval(reloj.current);
  }, [corriendo, pasos, ms]);

  return [corriendo ? paso : pasoQuieto, !corriendo];
}
