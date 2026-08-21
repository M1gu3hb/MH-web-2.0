/**
 * ============================================================
 * PRESENTACIÓN — quién lo hace
 * ============================================================
 *
 * Esta es la sección de producción (`AboutSection`) traída tal cual: la
 * placa con el efecto de agua, la firma MH97, el titular a dos voces, el
 * enlace a GitHub, el nombre, el rol y el correo personal.
 *
 * En la iteración anterior este bloque se había quedado en un párrafo
 * centrado dentro de una columna estrecha. Es decir: puro texto. Y era
 * precisamente la sección donde el sitio dice quién está detrás, o sea la
 * que más tiene que demostrar oficio.
 *
 * QUÉ SE CONSERVA DE PRODUCCIÓN, IDÉNTICO
 * · La placa `placa-lockup.webp` dentro de `RippleDistortion`, con los
 *   mismos parámetros: al pasar el cursor el logo se deforma como agua y al
 *   hacer clic da un golpe. Es el componente que le da vida a este bloque.
 * · La firma MH97 en relieve y su leyenda.
 * · «Revisa mis proyectos en GitHub», el nombre, el rol y el correo.
 * · El titular a dos líneas con la segunda en la voz suave.
 *
 * QUÉ SE ADAPTA
 * · Los cuatro párrafos de producción se quedan en dos: en la home esto es
 *   un resumen con salida a `/sobre-morphiq`, no la biografía completa. El
 *   texto es el mismo, no reescrito.
 * · Los párrafos no llevan desfragmentación. En producción sí, y a la
 *   escala nueva un párrafo entero desfragmentándose se lee como que la
 *   página está rota. El efecto se queda en el titular, que es su sitio.
 */

import { ArrowUpRight, Github, Mail } from 'lucide-react';
import { RippleDistortion, ScrambleText } from '../reactbits';
import { Cortina, Escala } from '../motion';
import { ABOUT, CONTACT } from '../../content';
import { gmailUrl } from '../../lib/correo';

/* La placa que distorsiona el agua: el mismo fondo y el mismo monograma que
   pintaba el recuadro, pero horneados en una imagen, porque el efecto
   deforma una textura y no un árbol de nodos. */
export const PLACA = '/placa-lockup.webp';

export function Presentacion({ resumen = true, children }) {
  const parrafos = resumen ? ABOUT.paragraphs.slice(0, 2) : ABOUT.paragraphs;

  return (
    <div className="presentacion">
      <Escala className="presentacion__marca" desde={0.95}>
        <div className="about__plate presentacion__placa">
          {/* La placa de verdad, debajo del lienzo. `RippleDistortion` monta
              un canvas WebGL y no deja nada si el navegador no lo soporta o
              si hay movimiento reducido: sin esta imagen, en esos dos casos
              quedaba un cuadro negro donde tenía que estar el logo. */}
          <img className="presentacion__placa-img" src={PLACA} alt="" aria-hidden="true" width="600" height="600" loading="lazy" />
          <RippleDistortion
            src={PLACA}
            brushSize={170}
            strength={0.16}
            swirl={1.2}
            rings={4}
            spread={5}
            fade={2.6}
            spacing={12}
            dispersion={0.3}
            glint={0.35}
            tint="#2a76d6"
            tintAmount={0.22}
            grayscale={false}
            trigger="both"
            clickStrength={2.4}
            quality="low"
          />
          <span className="about__plate-scan" aria-hidden="true" />
        </div>
        <div className="about__stamp presentacion__firma">
          <span className="firma3d" translate="no" aria-label="MH97">
            MH97
          </span>
          <small>{ABOUT.signature}</small>
        </div>
      </Escala>

      <div className="presentacion__cuerpo">
        <p className="presentacion__eyebrow">
          <ScrambleText text="Quién lo hace" trigger="view" />
        </p>

        <Cortina>
          <h2 className="presentacion__titulo">
            {ABOUT.title.map((linea, i) => (
              <span key={linea} className={`presentacion__linea ${i ? 'presentacion__linea--suave' : ''}`}>
                <ScrambleText text={linea} trigger="both" speed={30} duration={2000} />
              </span>
            ))}
          </h2>
        </Cortina>

        {/* La declaración con sus dos palabras en color: es el gesto de
            producción y lo que impide que el bloque sea una mancha de gris. */}
        <p className="presentacion__declaracion">
          Hago páginas que <em>venden</em> y sistemas que <strong>ordenan.</strong>
        </p>

        {parrafos.map((p) => (
          <p className="presentacion__parrafo" key={p}>
            {p}
          </p>
        ))}

        <a className="presentacion__github" href={ABOUT.github} target="_blank" rel="noreferrer">
          <Github size={16} aria-hidden="true" />
          Revisa mis proyectos en GitHub
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>

        <div className="presentacion__rubrica">
          <strong>{CONTACT.owner}</strong>
          <span>{CONTACT.role}</span>
          <a className="presentacion__correo" href={gmailUrl(CONTACT.emailPersonal)} target="_blank" rel="noreferrer">
            <Mail size={14} aria-hidden="true" />
            {CONTACT.emailPersonal}
          </a>
        </div>

        {children}
      </div>
    </div>
  );
}
