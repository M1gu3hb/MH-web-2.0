/**
 * Qué pregunta está abierta, compartido.
 *
 * Las preguntas se montan dos veces: la sección de la página y su copia dentro
 * de la pantalla de la laptop. Con un estado por instancia cada una abría la
 * suya, y entonces los dos árboles dejaban de tener los mismos nodos: el
 * reflejo, que empareja nodo a nodo, se rendía y la ventana enseñaba una
 * pregunta abierta distinta de la que el visitante acababa de abrir.
 *
 * Con el estado aquí fuera las dos instancias son la misma interfaz, que es lo
 * único coherente con la ilusión: lo que se ve en la laptop es la página.
 */

let open = 0;
const listeners = new Set();

export function getFaqOpen() {
  return open;
}

export function setFaqOpen(next) {
  if (open === next) return;
  open = next;
  listeners.forEach((fn) => fn());
}

export function subscribeFaqOpen(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
