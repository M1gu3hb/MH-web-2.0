/**
 * ============================================================
 * PORTADA — el hero de la home
 * ============================================================
 *
 * Parte del `Hero.jsx` de producción, no de una imitación: misma
 * composición, misma tipografía a tres voces, mismo fondo Scanner, mismo
 * símbolo por capas, misma firma. Lo que cambia es que ahora vive dentro de
 * un sitio multipágina, así que los CTA llevan a rutas reales en vez de a
 * anclas, y aparece el ancla de precio que la arquitectura nueva permite.
 *
 * DECISIONES DE RENDIMIENTO
 *
 * · El Scanner es un shader a pantalla completa. Se carga con `lazy`, así
 *   que no entra en el trozo inicial: la página pinta el texto primero y el
 *   fondo llega después. Eso protege el LCP, que es lo que costó bajar de
 *   3.1 s a 1.9 s.
 * · En teléfono NO se monta el shader. En su lugar va una ola de CSS que se
 *   mueve con `translate3d`: el compositor mueve una textura que ya existe y
 *   no repinta nada. Producción se quedaba en un degradado quieto; aquí el
 *   fondo también vive en el teléfono, que era la petición.
 * · Con `prefers-reduced-motion` no hay ni shader ni ola: quedan los
 *   degradados, que es lo correcto.
 */

import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import { motion as Motion } from 'motion/react';

import { Magnet, ScrambleText } from '../reactbits';
import { Logo3D } from './Logo3D';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { HERO, CONTACT } from '../../content';
import { RUTAS } from '../../config/rutas';
import { PLANES, formatoMXN } from '../../config/pricing';

const Scanner = lazy(() => import('../reactbits/Scanner'));

const [claimA, claimVen, claimB, claimNec] = HERO.claim;

export function PortadaHero() {
  const sinMovimiento = useReducedMotion();
  const finoYAncho = useMediaQuery('(min-width: 861px) and (pointer: fine)');
  const conShader = finoYAncho && !sinMovimiento;

  const entrada = sinMovimiento
    ? false
    : { opacity: 0, y: 26 };

  return (
    <header className="portada" id="inicio">
      {/* ---- Fondo ---- */}
      <div
        className={`portada__fondo ${conShader ? '' : 'portada__fondo--liso'} ${
          sinMovimiento ? 'portada__fondo--quieto' : ''
        }`}
        aria-hidden="true"
      >
        {conShader && (
          <Suspense fallback={null}>
            <Scanner
              color1="#0a66ff"
              color2="#0846c8"
              color3="#FFFFFF"
              speed={0.5}
              sweepSpeed={0.25}
              sweepWidth={1.6}
              sweepFalloff={6}
              scale={1.5}
              frequency={2}
              ripple={0.22}
              bandDensity={11}
              lineSharpness={5.5}
              glow={0.22}
              scanDirection="vertical"
              colorSpread={0.7}
              brightness={1.0}
              contrast={1.15}
              softness={1.4}
              vignette={0.45}
              scanline
              grain
              grainIntensity={0.05}
              opacity={1.0}
              mouseInteraction
              mouseRadius={0.5}
              mouseStrength={0.5}
              maxDpr={1.25}
            />
          </Suspense>
        )}
        <span className="portada__velo" />
      </div>

      <div className="contenedor contenedor--amplio">
        {/* Un solo contenedor con las siete piezas como hijos directos y el
            reparto resuelto con `grid-template-areas`. Es lo que permite que
            escritorio y teléfono sean DOS COMPOSICIONES, no una y su versión
            estrujada: en teléfono el símbolo 3D sube al centro, justo
            después del botón, en vez de caer al final porque ya no cupo.
            El orden visual del teléfono es titular → explicación → acción →
            señal de marca → precio → frentes → credenciales. */}
        <Motion.div
          className="portada__reparto"
          initial={entrada}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* El titular de marca, a tres voces: las dos de fuera gritan en
              la tipografía de display y la de en medio matiza en la de
              texto. Ese contraste es lo que lo hace una frase y no tres
              líneas del mismo tamaño. */}
          <h1 className="hero__title portada__titular">
            {HERO.title.map((linea, i) => (
              <span key={linea.text} className={`hero__title-line hero__title-line--${linea.voice}`}>
                <ScrambleText text={linea.text} />
                {i === HERO.title.length - 1 ? <i className="hero__title-dot" aria-hidden="true" /> : null}
              </span>
            ))}
          </h1>

          <p className="hero__claim portada__claim">
            <ScrambleText text={claimA} />
            <ScrambleText text={claimVen} className="hero__accent hero__accent--azul" />
            <ScrambleText text={claimB} />
            <ScrambleText text={claimNec} className="hero__accent hero__accent--plata" />
          </p>

          <div className="portada__acciones">
            {/* Magnet ya se desactiva solo con reduced-motion y en
                dispositivos sin hover, así que no hace falta condicionarlo. */}
            <Magnet strength={0.3} radius={120}>
              <Link className="tactile-button tactile-button--glow tactile-button--large" to={RUTAS.servicios}>
                Ver soluciones
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </Magnet>
            <Link className="tactile-button tactile-button--paper tactile-button--large" to={RUTAS.proyectos}>
              Ver proyectos
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <Motion.div
            className="portada__marca"
            aria-hidden="true"
            initial={sinMovimiento ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.05, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo3D />
          </Motion.div>

          <p className="portada__ancla">
            Páginas web desde <strong>{formatoMXN(PLANES.webEsencial.desde)}</strong> ·{' '}
            <Link to={RUTAS.precios}>ver todos los precios</Link>
          </p>

          {/* Lo que la home multipágina añade: qué hay detrás de la frase,
              dicho en cinco palabras y con enlace a cada camino. */}
          <p className="portada__frentes">
            <Link to={RUTAS.paginasWeb}>Páginas web</Link>
            <span aria-hidden="true">·</span>
            <Link to={RUTAS.sistemas}>Sistemas</Link>
            <span aria-hidden="true">·</span>
            <Link to={RUTAS.crmAutomatizacion}>CRM</Link>
            <span aria-hidden="true">·</span>
            <Link to={RUTAS.crmAutomatizacion}>Automatización</Link>
            <span aria-hidden="true">·</span>
            <Link to={RUTAS.softwareAMedida}>Software a medida</Link>
          </p>

          <div className="hero__meta portada__meta">
            <dl className="hero__credentials">
              {HERO.credentials.map((item, i) => (
                <div key={item.label}>
                  <dt>
                    <i aria-hidden="true">{String(i + 1).padStart(2, '0')}</i>
                    <ScrambleText text={item.label} />
                  </dt>
                  <dd>{item.note}</dd>
                </div>
              ))}
            </dl>
            <span className="firma3d hero__firma3d" translate="no" aria-label="MH97">
              MH97
            </span>
          </div>

          <p className="rb-visually-hidden">{CONTACT.location}</p>
        </Motion.div>
      </div>

      <div className="portada__pista" aria-hidden="true">
        <span />
      </div>
    </header>
  );
}
