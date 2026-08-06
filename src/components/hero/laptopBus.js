/**
 * Canal mínimo entre el hero y la escena 3D.
 *
 * La laptop vive en una capa fija propia (LaptopStage), hermana del hero, y
 * esa capa es inerte a propósito: si recibiera clics taparía toda la página.
 * Así que el botón que la enciende está en el hero y avisa por aquí, sin
 * levantar estado compartido ni contexto para un solo gesto.
 */

const listeners = new Set();

/** Avisa a la escena de que alguien tocó la laptop. */
export function pokeLaptop() {
  listeners.forEach((fn) => fn());
}

/** Devuelve la función para darse de baja. */
export function onLaptopPoke(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ---- Aviso de «la laptop ya está en pantalla» --------------------------
   La pantalla de carga existe para que todo entre de una vez. Sin esta
   señal el loader se iba antes de que la escena 3D estuviera montada y la
   laptop aparecía sola unos segundos después, trabando la página al llegar. */

let resolveReady;
let settled = false;

export const laptopReady = new Promise((resolve) => {
  resolveReady = resolve;
});

/** La llama la escena cuando ya ha pintado su primer fotograma con modelo. */
export function markLaptopReady() {
  if (settled) return;
  settled = true;
  resolveReady(true);
}

/** Si no hay escena que esperar (móvil flojo, sin WebGL), no se bloquea. */
export function skipLaptopReady() {
  if (settled) return;
  settled = true;
  resolveReady(false);
}
