/**
 * ============================================================
 * FAMILIAS DE ENTRADA
 * ============================================================
 *
 * El problema que resuelve este archivo es concreto: en la iteración
 * anterior TODO entraba igual —opacidad 0 más 26 px hacia arriba—, así que a
 * partir de la quinta sección el movimiento dejaba de existir. Técnicamente
 * había animación; visualmente no.
 *
 * La solución no es tener treinta animaciones distintas, que es la otra
 * forma de que no se note ninguna. Son SEIS familias, cada una con un
 * trabajo distinto, y la regla de reparto es que dos secciones seguidas
 * nunca usan la misma.
 *
 *   Cortina    el bloque se descubre tras una máscara que sube
 *   Cascada    los hijos entran escalonados, no el contenedor entero
 *   Escala     el bloque llega desde el fondo, con profundidad
 *   Lateral    entra desde un costado; sirve para alternar izquierda/derecha
 *   Secuencia  una lista que se enciende elemento a elemento al bajar
 *   Titular    cada línea de un titular tras su propia máscara
 *
 * TODAS comparten la curva del sitio y ninguna anima nada que no sea
 * `transform`, `opacity` o `clip-path`: son las tres propiedades que el
 * compositor resuelve sin repintar y que no cuentan para CLS.
 *
 * Con `prefers-reduced-motion` las seis devuelven el contenido tal cual,
 * sin envoltorio de movimiento. No se degrada la información: se degrada
 * el movimiento.
 */

import { Children, isValidElement } from 'react';
import { motion as Motion } from 'motion/react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const CURVA = [0.22, 1, 0.36, 1];

/* Un solo sitio donde vive la duración de cada familia. Si algún día el
   sitio entero tiene que ir más rápido, se toca aquí. */
const DUR = {
  cortina: 0.86,
  cascada: 0.62,
  escala: 0.78,
  lateral: 0.74,
  titular: 0.82,
};

/* ------------------------------------------------------------
   Cortina — máscara que sube
   ------------------------------------------------------------
   El contenido no se desliza: se descubre. `clip-path` recorta desde abajo
   y el bloque se queda quieto en su sitio, así que ni el texto ni las
   imágenes se mueven un píxel respecto a su posición final.
   ------------------------------------------------------------ */

export function Cortina({ children, delay = 0, className = '', amount = 0.3, as = 'div' }) {
  const sinMovimiento = useReducedMotion();
  const Tag = Motion[as] ?? Motion.div;

  if (sinMovimiento) {
    const Plano = as;
    return <Plano className={className}>{children}</Plano>;
  }

  /* ------------------------------------------------------------
     POR QUÉ HAY DOS ELEMENTOS Y NO UNO
     ------------------------------------------------------------
     La versión anterior recortaba y observaba el MISMO elemento, y eso es un
     bloqueo circular: `clip-path: inset(100% 0 0 0)` deja el área visible en
     cero, un área cero da razón de intersección cero, y `amount: 0.3` exige
     una razón mayor que cero. O sea, la cortina solo se abría si el
     observador la veía, y el observador no podía verla porque estaba
     cerrada. Resultado: bloques que no aparecían NUNCA, y titulares que
     dentro de ellos se quedaban en glifos porque su propio observador
     tampoco podía dispararse.

     Ahora el envoltorio de fuera es el que se observa —nunca está recortado,
     así que su geometría siempre es real— y el recorte vive en el hijo, que
     se anima por propagación de variantes. Separar quién mira de quién se
     recorta es lo que hace que esto no se pueda volver a bloquear.
     ------------------------------------------------------------ */
  return (
    <Tag
      className={className}
      initial="cerrada"
      whileInView="abierta"
      viewport={{ once: true, amount }}
    >
      <Motion.div
        variants={{
          cerrada: { clipPath: 'inset(100% 0 0 0)', opacity: 0.4 },
          abierta: {
            clipPath: 'inset(0% 0 0 0)',
            opacity: 1,
            transition: { duration: DUR.cortina, delay, ease: CURVA },
          },
        }}
      >
        {children}
      </Motion.div>
    </Tag>
  );
}

/* ------------------------------------------------------------
   Cascada — escalonado sobre los hijos
   ------------------------------------------------------------
   La diferencia con poner un `delay` distinto a cada hijo desde fuera es
   que aquí el escalonado lo lleva el contenedor: los hijos no necesitan
   saber en qué posición están, y el ritmo se controla en un solo sitio.

   El tope de 5 elementos escalonados no es arbitrario. Con 60 ms de paso,
   el sexto entra a 360 ms del primero, y a partir de ahí quien está mirando
   deja de leerlo como un ritmo y empieza a leerlo como que la página va
   lenta. Del sexto en adelante todos comparten el retardo del quinto.
   ------------------------------------------------------------ */

export function Cascada({ children, paso = 0.06, delay = 0, className = '', amount = 0.2, y = 22, tope = 5 }) {
  const sinMovimiento = useReducedMotion();

  if (sinMovimiento) return <div className={className}>{children}</div>;

  return (
    <div className={className}>
      {Children.map(children, (hijo, i) => {
        if (!isValidElement(hijo)) return hijo;
        return (
          <Motion.div
            key={hijo.key ?? i}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount }}
            transition={{
              duration: DUR.cascada,
              /* El retardo se satura en `tope`: a partir de ahí todos
                 comparten el del último escalonado. */
              delay: delay + Math.min(i, tope) * paso,
              ease: CURVA,
            }}
          >
            {hijo}
          </Motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------
   Escala — profundidad
   ------------------------------------------------------------
   Para piezas que son objetos: maquetas, tarjetas con imagen, paneles. El
   bloque llega desde ligeramente atrás. La escala de partida es 0.94 y no
   menos: por debajo de 0.9 el texto se ve borroso mientras dura la entrada,
   porque el navegador escala una textura ya rasterizada.
   ------------------------------------------------------------ */

export function Escala({ children, delay = 0, className = '', amount = 0.25, desde = 0.94, style, id }) {
  const sinMovimiento = useReducedMotion();

  /* `style` se reenvía porque la retícula del índice de proyectos reparte el
     ancho de cada hueco con una variable CSS (`--span`) puesta en línea. Sin
     este paso la variable se quedaba en el aire y las once piezas volvían a
     salir todas del mismo tamaño, que es justo lo que se quería evitar. */
  if (sinMovimiento) return <div className={className} style={style} id={id}>{children}</div>;

  return (
    <Motion.div
      className={className}
      style={style}
      id={id}
      initial={{ opacity: 0, scale: desde, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: DUR.escala, delay, ease: CURVA }}
    >
      {children}
    </Motion.div>
  );
}

/* ------------------------------------------------------------
   Lateral — entrada desde un costado
   ------------------------------------------------------------
   Pensada para alternar: en una lista de bloques, los pares desde la
   izquierda y los impares desde la derecha. Da ritmo a una página larga
   sin que ninguna sección tenga que ser distinta de las demás.

   El desplazamiento se mide en porcentaje del propio elemento, no en
   píxeles: así un bloque estrecho no cruza media pantalla.
   ------------------------------------------------------------ */

export function Lateral({ children, desde = 'izquierda', delay = 0, className = '', amount = 0.25, distancia = 6 }) {
  const sinMovimiento = useReducedMotion();

  if (sinMovimiento) return <div className={className}>{children}</div>;

  const x = desde === 'derecha' ? `${distancia}%` : `-${distancia}%`;

  return (
    <Motion.div
      className={className}
      initial={{ opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: DUR.lateral, delay, ease: CURVA }}
    >
      {children}
    </Motion.div>
  );
}

/* ------------------------------------------------------------
   Secuencia — la lista que se enciende al bajar
   ------------------------------------------------------------
   La única familia atada al scroll y no a un disparo único. Cada elemento
   se activa cuando entra en su umbral, y al activarse se queda: volver a
   subir no lo apaga. Es la que convierte una lista de pasos en un relato
   en vez de en una tabla.

   No secuestra la rueda ni fija nada: es `whileInView` por elemento, con
   umbrales distintos. Quien baja rápido ve la lista completa; quien baja
   despacio la ve construirse.
   ------------------------------------------------------------ */

export function Secuencia({ children, className = '', as = 'div', paso = 0.05 }) {
  const sinMovimiento = useReducedMotion();
  const Tag = as;

  if (sinMovimiento) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag className={className}>
      {Children.map(children, (hijo, i) => {
        if (!isValidElement(hijo)) return hijo;

        const animacion = {
          initial: { opacity: 0, y: 30, filter: 'blur(6px)' },
          whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
          viewport: { once: true, amount: 0.55 },
          transition: { duration: 0.66, delay: i * paso, ease: CURVA },
        };

        /* Un `li` se anima EN SU SITIO, convirtiéndolo en `motion.li` en vez
           de meterlo dentro de un div: envolverlo rompería la relación
           ol → li y con ella lo que un lector de pantalla anuncia («elemento
           1 de 7»). Cualquier otra cosa sí se envuelve. */
        if (hijo.type === 'li') {
          return <Motion.li key={hijo.key ?? i} {...hijo.props} {...animacion} />;
        }

        return (
          <Motion.div key={hijo.key ?? i} {...animacion}>
            {hijo}
          </Motion.div>
        );
      })}
    </Tag>
  );
}

/* ------------------------------------------------------------
   Titular — línea a línea, cada una tras su máscara
   ------------------------------------------------------------
   Es la familia reservada para los mensajes grandes. Cada línea vive dentro
   de un contenedor con `overflow: hidden` y sube desde debajo de su propio
   borde, así que el efecto se lee como tipografía imprimiéndose, no como un
   bloque que aparece.
   ------------------------------------------------------------ */

export function Titular({ lineas, className = '', as: Tag = 'h2', delay = 0, paso = 0.075, claseLinea = '' }) {
  const sinMovimiento = useReducedMotion();
  const partes = Array.isArray(lineas) ? lineas : [lineas];

  if (sinMovimiento) {
    return (
      <Tag className={className}>
        {partes.map((linea, i) => (
          <span key={i} className={`titular__linea ${claseLinea}`}>
            {linea}
          </span>
        ))}
      </Tag>
    );
  }

  /* Mismo principio que en `Cortina`: quien se observa es el titular entero
     —que nunca está recortado— y las líneas se animan por propagación de
     variantes. Observar cada línea era observar algo que arranca DEBAJO del
     borde de su propia ventana con `overflow: hidden`, o sea con razón de
     intersección cero, con lo que un `amount` mayor que cero no se alcanzaba
     nunca y el titular no llegaba a entrar. */
  const MotionTag = Motion[Tag] ?? Motion.h2;

  return (
    <MotionTag
      className={className}
      initial="fuera"
      whileInView="dentro"
      viewport={{ once: true, amount: 'some' }}
    >
      {partes.map((linea, i) => (
        <span key={i} className="titular__ventana">
          <Motion.span
            className={`titular__linea ${claseLinea}`}
            variants={{
              fuera: { y: '108%' },
              dentro: {
                y: '0%',
                transition: { duration: DUR.titular, delay: delay + i * paso, ease: CURVA },
              },
            }}
          >
            {linea}
          </Motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
