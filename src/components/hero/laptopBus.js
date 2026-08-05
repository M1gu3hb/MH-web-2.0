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
