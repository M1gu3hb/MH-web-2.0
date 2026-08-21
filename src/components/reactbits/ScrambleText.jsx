import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * ============================================================
 * SCRAMBLETEXT — desfragmentación de letras
 * ============================================================
 *
 *   trigger="hover"  se desordena mientras el cursor está encima
 *   trigger="view"   llega desfragmentado y se recompone al entrar en pantalla
 *   trigger="both"   las dos cosas
 *
 * ------------------------------------------------------------
 * LA REGLA DE ESTE ARCHIVO
 * ------------------------------------------------------------
 * Este componente tuvo un fallo grave y repetido: titulares que se quedaban
 * en glifos aleatorios hasta que la persona recargaba la página. Se intentó
 * arreglar dos veces poniendo redes de seguridad en JavaScript, y las dos
 * veces volvió a pasar. La razón de fondo es que TODAS esas redes vivían en
 * el mismo sitio que el fallo: si el JavaScript se queda a medias, la red
 * también.
 *
 * Así que la regla ahora es otra, y es estructural:
 *
 *   EL OCULTAMIENTO DEL TEXTO TIENE FECHA DE CADUCIDAD ESCRITA EN CSS.
 *
 * Ocultar el texto real no lo hace JavaScript «hasta que yo diga»: lo hace
 * una animación de CSS que TERMINA SOLA. El motor de render la lleva, no
 * nosotros. Si el JavaScript se cuelga, se cancela, se desmonta a mitad o
 * nunca llega a ejecutarse, el navegador devuelve el texto igual. Es la
 * diferencia entre prometer que el texto va a volver y que no exista ningún
 * estado alcanzable en el que no vuelva.
 *
 * Lo demás son consecuencias de esa regla:
 *
 * · El texto real NUNCA sale del flujo ni del árbol de accesibilidad. Se
 *   vuelve transparente, no invisible. Un lector de pantalla y el rastreador
 *   de Google leen siempre la frase de verdad, esté como esté la animación.
 * · La capa de glifos también caduca. Al terminar la animación de rescate,
 *   el texto real recupera su color y los glifos se apagan, los dos a la vez
 *   y los dos por CSS.
 * · JavaScript se limita a poner y quitar un atributo. Si acaba antes —que
 *   es lo normal—, quita el atributo y la animación se descarta.
 *
 * ------------------------------------------------------------
 * LOS FALLOS CONCRETOS QUE SE ARREGLARON
 * ------------------------------------------------------------
 * Salieron de una auditoría con tres lentes independientes, seis de ellos
 * reproducidos en un navegador de verdad:
 *
 * 1. El callback del observador leía `([entry])`, o sea SOLO LA PRIMERA
 *    entrada. IntersectionObserver AGRUPA: cuando el estado cambia dos veces
 *    antes de que corra el callback, llega una invocación con dos entradas
 *    ordenadas de más vieja a más nueva. La vieja dice `isIntersecting:
 *    false`, el componente hacía `return`, y a partir de ahí el observador
 *    seguía conectado pero mudo, porque para el navegador el elemento ya
 *    estaba en estado «intersectando» y no había nada nuevo que notificar.
 *    Ahora se miran TODAS las entradas.
 *
 * 2. `threshold: 0.01` es estrictamente PEOR que `threshold: 0`. Se puso
 *    para sobrevivir a los titulares metidos dentro de una máscara, y hace
 *    justo lo contrario: un elemento recortado a cero tiene razón de
 *    intersección exactamente 0, y 0.01 > 0. Solo el umbral 0 marca
 *    `isIntersecting: true` con área cero. Ahora es 0.
 *
 * 3. El observador podía no recibir NINGÚN callback. Calcula la geometría
 *    una vez por fotograma y solo avisa cuando el estado NOTIFICADO cambia:
 *    si el elemento cruza la ventana entera entre dos muestreos, para él
 *    nunca estuvo dentro. Ahora hay una red de scroll compartida que lo
 *    cubre, y el margen de raíz se abre a 240 px por arriba y por abajo.
 *
 * 4. Un elemento que ya pasó de largo por arriba se resuelve al instante,
 *    sin animar: animar algo que quedó por encima del pliegue es gastar
 *    tiempo en algo que nadie va a ver.
 *
 * 5. Cuando la caducidad de CSS hacía su trabajo, el texto volvía a verse
 *    pero el DOM se quedaba a medias: el `color: transparent` en línea
 *    seguía escrito —la animación lo pisa, no lo borra— y los glifos
 *    seguían en su capa, solo que apagados. Ahora el final de la animación
 *    se escucha y el estado se limpia, así que lo que se ve y lo que dice
 *    el DOM son lo mismo. Que era, además, lo que hacía imposible medir si
 *    el fallo seguía vivo.
 */

const GLIFOS = '#$%&*+-<>=?@[]{}/\\|~^01';
const glifoAlAzar = () => GLIFOS[(Math.random() * GLIFOS.length) | 0];

/* ------------------------------------------------------------
   RED DE SCROLL COMPARTIDA
   ------------------------------------------------------------
   Un solo oyente de scroll para toda la página, estrangulado a un fotograma,
   y que solo existe mientras haya algún texto esperando. Cubre el caso en el
   que el observador no llega a disparar nunca porque el elemento cruzó la
   ventana entre dos muestreos —el salto de la restauración del scroll al
   volver atrás, por ejemplo, que mueve los titulares miles de píxeles en un
   fotograma.

   Es deliberadamente un módulo y no un hook: con veinte titulares en una
   página, veinte oyentes de scroll serían veinte lecturas de geometría por
   evento. Así es una.
   ------------------------------------------------------------ */
const pendientes = new Set();
let vigilandoScroll = false;
let tickPedido = 0;

function revisarPendientes() {
  tickPedido = 0;
  const alto = window.innerHeight || 0;
  for (const entrada of Array.from(pendientes)) {
    const { nodo, resolver } = entrada;
    if (!nodo.isConnected) {
      pendientes.delete(entrada);
      continue;
    }
    const r = nodo.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    /* Ya está a la vista, o ya pasó de largo por arriba. En los dos casos
       toca resolver: en el segundo, sin animación. */
    if (r.top < alto + 240 && r.bottom > -240) resolver(false);
    else if (r.bottom <= 0) resolver(true);
  }
  if (pendientes.size === 0) apagarVigilancia();
}

function pedirRevision() {
  if (tickPedido) return;
  tickPedido = requestAnimationFrame(revisarPendientes);
}

function encenderVigilancia() {
  if (vigilandoScroll) return;
  vigilandoScroll = true;
  window.addEventListener('scroll', pedirRevision, { passive: true });
  window.addEventListener('resize', pedirRevision, { passive: true });
}

function apagarVigilancia() {
  if (!vigilandoScroll) return;
  vigilandoScroll = false;
  window.removeEventListener('scroll', pedirRevision);
  window.removeEventListener('resize', pedirRevision);
  if (tickPedido) cancelAnimationFrame(tickPedido);
  tickPedido = 0;
}

function esperarScroll(entrada) {
  pendientes.add(entrada);
  encenderVigilancia();
  /* Una revisión inmediata: puede que ya esté a la vista al montarse. */
  pedirRevision();
}

function dejarDeEsperar(entrada) {
  pendientes.delete(entrada);
  if (pendientes.size === 0) apagarVigilancia();
}

export function ScrambleText({
  text,
  as: Tag = 'span',
  trigger = 'hover',
  speed = 34,
  duration = 1700,
  /* Al soltar el cursor la palabra tiene que volver casi de inmediato: la
     duración de entrada, pensada para que se lea la recomposición, se sentía
     como un retraso cuando ya habías apartado el ratón. */
  exitDuration = 380,
  className = '',
  children,
}) {
  const sinMovimiento = useReducedMotion();
  const fuente = text ?? (typeof children === 'string' ? children : '');
  const anfitrion = useRef(null);
  const palabras = useRef([]);
  const reloj = useRef(0);
  const fase = useRef('reposo');

  const parar = useCallback(() => {
    cancelAnimationFrame(reloj.current);
    reloj.current = 0;
  }, []);

  /** Recoge las parejas palabra real / capa de glifos. */
  const recoger = useCallback(() => {
    const nodo = anfitrion.current;
    palabras.current = nodo
      ? Array.from(nodo.querySelectorAll('[data-word]')).map((n) => ({
          caja: n,
          real: n.querySelector('[data-real]'),
          fx: n.querySelector('[data-fx]'),
          palabra: n.dataset.word,
        }))
      : [];
  }, []);

  /**
   * Enseña el texto de verdad y apaga la capa de glifos.
   *
   * Es el ÚNICO dueño del final del ciclo: apaga el bucle de animación antes
   * de tocar el DOM. La versión anterior no cancelaba el `requestAnimationFrame`
   * y por eso un bucle vivo podía volver a escribir glifos justo después de
   * que otra red de seguridad los hubiera limpiado.
   */
  const mostrar = useCallback(() => {
    cancelAnimationFrame(reloj.current);
    reloj.current = 0;
    fase.current = 'hecho';
    palabras.current.forEach(({ caja, real, fx }) => {
      /* Quitar el atributo descarta la animación de rescate de CSS. */
      if (caja) caja.removeAttribute('data-cifrado');
      if (real) real.style.color = '';
      if (fx) fx.textContent = '';
    });
  }, []);

  /** Escribe el estado actual: `resueltas` letras reales, el resto en glifos. */
  const pintar = useCallback((resueltas) => {
    let indice = 0;
    palabras.current.forEach(({ caja, real, fx, palabra }) => {
      let salida = '';
      let intactas = 0;
      for (let i = 0; i < palabra.length; i += 1, indice += 1) {
        if (indice < resueltas) {
          salida += palabra[i];
          intactas += 1;
        } else {
          salida += glifoAlAzar();
        }
      }
      indice += 1; // el espacio entre palabras también cuenta
      if (intactas === palabra.length) {
        /* Palabra ya resuelta: se enseña la de verdad, que es la que mide
           bien y la que leen los buscadores. */
        if (caja) caja.removeAttribute('data-cifrado');
        if (real) real.style.color = '';
        if (fx) fx.textContent = '';
      } else {
        /* El texto real NO se oculta: se vuelve transparente. Sigue en el
           flujo, sigue midiendo y sigue leyéndose. Y el atributo arranca la
           animación de CSS que, pase lo que pase con este JavaScript, le
           devuelve el color al terminar. */
        if (caja) caja.setAttribute('data-cifrado', '');
        if (real) real.style.color = 'transparent';
        if (fx) fx.textContent = salida;
      }
    });
  }, []);

  const total = fuente.length;

  /* El avance se mide con el reloj, no contando fotogramas: si el navegador
     se retrasa, la animación sigue acabando en `duration`. */
  const resolver = useCallback(
    (ms = duration) => {
      parar();
      /* Con la pestaña en segundo plano `requestAnimationFrame` no corre. Si
         la animación arrancara aquí, se quedaría congelada hasta que alguien
         volviera a la pestaña. Así que ni se intenta. */
      if (document.hidden) {
        mostrar();
        return;
      }
      fase.current = 'corriendo';
      const arranque = performance.now();
      const paso = (ahora) => {
        const t = (ahora - arranque) / ms;
        if (t >= 1) {
          mostrar();
          return;
        }
        pintar(Math.floor(t * total));
        reloj.current = requestAnimationFrame(paso);
      };
      reloj.current = requestAnimationFrame(paso);
    },
    [duration, mostrar, pintar, parar, total]
  );

  const revolver = useCallback(() => {
    parar();
    fase.current = 'corriendo';
    pintar(0);
    let ultimo = 0;
    const arranque = performance.now();
    const paso = (ahora) => {
      /* El tope de tiempo vive DENTRO del bucle, no en un temporizador de
         fuera. Un temporizador externo lo puede limpiar cualquiera; esto no.
         Si el cursor se queda encima —o se va sin que el navegador emita el
         evento de salida, que pasa con el scroll por JavaScript— el texto
         vuelve solo. */
      if (ahora - arranque > 5000) {
        resolver(exitDuration);
        return;
      }
      if (ahora - ultimo >= speed + 14) {
        ultimo = ahora;
        pintar(0);
      }
      reloj.current = requestAnimationFrame(paso);
    };
    reloj.current = requestAnimationFrame(paso);
  }, [exitDuration, pintar, resolver, speed, parar]);

  useLayoutEffect(() => {
    if (sinMovimiento) return undefined;
    const nodo = anfitrion.current;
    if (!nodo) return undefined;

    recoger();

    const conVista = trigger === 'view' || trigger === 'both';
    if (!conVista) {
      mostrar();
      return undefined;
    }

    fase.current = 'reposo';
    pintar(0);

    let vivo = true;
    const rematar = (sinAnimar) => {
      if (!vivo) return;
      vivo = false;
      observador.disconnect();
      dejarDeEsperar(espera);
      if (sinAnimar) mostrar();
      else resolver();
    };

    /* Umbral 0 y margen amplio. El 0 es el único que marca intersección
       cuando el área es cero —un titular dentro de una máscara cerrada—, y
       el margen de 240 px ensancha la ventana de oportunidad para que un
       salto de scroll tenga que ser enorme para saltársela. */
    const observador = new IntersectionObserver(
      (entradas) => {
        /* TODAS las entradas, no la primera: llegan agrupadas y la primera
           puede estar caducada. */
        if (entradas.some((e) => e.isIntersecting)) {
          rematar(false);
          return;
        }
        /* Aunque no intersecte, si ya pasó de largo por arriba hay que
           resolver sin animar: la persona ya está más abajo. */
        const ultima = entradas[entradas.length - 1];
        const caja = ultima?.boundingClientRect;
        const raiz = ultima?.rootBounds;
        if (caja && raiz && caja.bottom <= raiz.top) rematar(true);
      },
      { threshold: 0, rootMargin: '240px 0px 240px 0px' }
    );

    const espera = { nodo, resolver: rematar };
    observador.observe(nodo);
    esperarScroll(espera);

    return () => {
      vivo = false;
      observador.disconnect();
      dejarDeEsperar(espera);
      parar();
    };
  }, [mostrar, pintar, recoger, sinMovimiento, resolver, fuente, trigger, parar]);

  /* Al volver de una pestaña oculta, o al restaurar la página desde la caché
     de atrás/adelante: si el ciclo quedó a medias, se resuelve. */
  useEffect(() => {
    if (sinMovimiento) return undefined;
    const alVolver = () => {
      if (document.hidden || fase.current !== 'corriendo') return;
      mostrar();
    };
    document.addEventListener('visibilitychange', alVolver);
    window.addEventListener('pageshow', alVolver);
    return () => {
      document.removeEventListener('visibilitychange', alVolver);
      window.removeEventListener('pageshow', alVolver);
    };
  }, [mostrar, sinMovimiento]);

  useLayoutEffect(() => parar, [parar]);

  /* ------------------------------------------------------------
     EL CIERRE DEL CÍRCULO: CSS AVISA, JAVASCRIPT RECOGE
     ------------------------------------------------------------
     La animación de rescate ya devuelve el color por su cuenta, así que el
     texto se ve aunque este archivo esté muerto. Pero si nadie escucha, el
     nodo se queda a medias para siempre: `color: transparent` en línea (que
     la animación pisa, pero no borra) y la capa de glifos apagada con los
     glifos todavía dentro.

     Escuchando el final de la animación, el estado del DOM converge con lo
     que se ve: se quita el atributo, se borra el color en línea y se vacía
     la capa de glifos. Y como `mostrar` cancela el bucle antes de tocar
     nada, no hay forma de que la siguiente pasada vuelva a poner el
     atributo y reinicie la caducidad en bucle.

     Los eventos de animación burbujean, así que un solo oyente en la raíz
     cubre todas las palabras. Se filtra por nombre para no reaccionar a
     ninguna otra animación que pase por aquí. */
  const alCaducar = useCallback(
    (e) => {
      if (e.animationName !== 'rb-scramble-rescate') return;
      mostrar();
    },
    [mostrar]
  );

  if (sinMovimiento) return <Tag className={className}>{fuente}</Tag>;

  const trozos = fuente.split(' ');
  /* Los manejadores se envuelven a propósito: pasar `resolver` directo le
     entregaría el evento como duración. */
  const asentar = () => resolver(exitDuration);
  const propsCursor =
    trigger === 'hover' || trigger === 'both'
      ? {
          onPointerEnter: revolver,
          onPointerLeave: asentar,
          onFocus: revolver,
          onBlur: asentar,
        }
      : {};

  return (
    <Tag ref={anfitrion} className={`rb-scramble ${className}`} onAnimationEnd={alCaducar} {...propsCursor}>
      {trozos.map((palabra, i) => (
        <span key={`${palabra}-${i}`}>
          <span className="rb-scramble__word" data-word={palabra}>
            <span data-real>{palabra}</span>
            <span className="rb-scramble__fx" data-fx aria-hidden="true" />
          </span>
          {i < trozos.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}

/** Titular de varias líneas conservando el salto del diseño. */
export function ScrambleLines({ lines, trigger = 'hover', className = '', lineClassName = '' }) {
  return (
    <>
      {lines.map((line, index) => (
        <span className={`${className} scramble-line`} key={line}>
          <ScrambleText text={line} trigger={trigger} className={index ? lineClassName : ''} speed={30 + index * 4} />
        </span>
      ))}
    </>
  );
}
