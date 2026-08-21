import { useEffect, useState } from 'react';

/**
 * Consulta de medios como estado de React.
 *
 * POR QUÉ SE INICIALIZA DE FORMA SÍNCRONA
 * La versión anterior arrancaba en `false` y sincronizaba dentro de un
 * `useEffect`, que corre DESPUÉS del primer pintado. En un escritorio normal
 * eso es un cambio real `false -> true` un tick después de montar, y los
 * componentes que devuelven ÁRBOLES DISTINTOS según la consulta —el marco
 * expansivo es el caso claro— cambiaban de forma en ese segundo render.
 * Cuando la forma cambia, React destruye y recrea el subárbol entero: sus
 * hijos se re-montan, sus efectos se vuelven a ejecutar y su estado interno
 * se pierde. Ese es el «se re-monta al recomponerse una rejilla» que estaba
 * detrás de varios fallos difíciles de reproducir.
 *
 * Leyendo el valor bueno antes del primer render, no hay segundo render y no
 * hay re-montaje. El `try` es porque `matchMedia` no existe en un render de
 * servidor ni en algunos entornos de prueba.
 */
function leer(query) {
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => leer(query));

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}
