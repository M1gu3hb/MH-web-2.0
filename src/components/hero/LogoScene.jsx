import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { markLaptopReady, onLaptopPoke, setLaptopRect } from './laptopBus';
import { PIEZAS, RELACION } from './logoContorno';

/* El PNG lleva aire alrededor y el monograma no está centrado en él, así que
   la textura de las caras se recorta a su recinto real —medido sobre el alfa—,
   que es el mismo marco al que están normalizados los contornos. */
const IMG = { w: 512, h: 457, x: 63, y: 18, ancho: 383, alto: 405 };

/* Grosor y chaflán, en unidades del propio logo (alto = 1). El chaflán no es
   adorno: de frente el canto se ve de perfil y no se ve nada, y con el fondo
   negro del tramo la pieza se quedaba en una mancha oscura. El chaflán sí se
   ve de frente, coge luz, y dibuja un filo claro alrededor de cada trazo. */
const FONDO = 0.1;
const CHAFLAN = 0.011;

/* Cuántas pantallas mide el logo cuando el acercamiento está del todo dentro.
   Se disuelve mientras sigue creciendo, así que nunca se queda quieto y
   gigante delante: el original mide 383 píxeles y a ese tamaño son manchas. */
const HONDO = 1.5;

/* Las caras llevan la textura del logo con sus colores exactos, así que sus UV
   salen de la posición en el plano, no de la caja que calcula three.js por su
   cuenta —que va en unidades de mundo y dejaría el dibujo fuera de sitio. */
const UV = {
  generateTopUV(geometry, vertices, a, b, c) {
    return [a, b, c].map((i) => new THREE.Vector2(
      vertices[i * 3] / RELACION + 0.5,
      vertices[i * 3 + 1] + 0.5,
    ));
  },
  /* El canto va de un color liso: no necesita mapa. */
  generateSideWallUV() {
    return [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];
  },
};

function trazar(destino, plano) {
  destino.moveTo(plano[0], plano[1]);
  for (let i = 2; i < plano.length; i += 2) destino.lineTo(plano[i], plano[i + 1]);
  destino.closePath();
  return destino;
}

function formas() {
  return PIEZAS.map(({ o, h }) => {
    const s = trazar(new THREE.Shape(), o);
    s.holes = h.map((hueco) => trazar(new THREE.Path(), hueco));
    return s;
  });
}

function Monograma({ choreography, reducedMotion }) {
  const grupo = useRef(null);
  const textura = useTexture('/mh-logo.png');

  /* Estado propio de la animación: el giro y el salto llevan su reloj, y la
     pose amortiguada se guarda aparte para no realimentarse. */
  const giro = useRef(0);
  const salto = useRef(-1);
  const entrada = useRef(0);
  const avisado = useRef(false);
  const escalaSuave = useRef(0.001);

  useEffect(() => {
    textura.colorSpace = THREE.SRGBColorSpace;
    textura.anisotropy = 4;
    /* Recorte al recinto del monograma. El origen de la textura está abajo,
       de ahí que la Y se cuente desde el otro extremo. */
    textura.repeat.set(IMG.ancho / IMG.w, IMG.alto / IMG.h);
    textura.offset.set(IMG.x / IMG.w, (IMG.h - IMG.y - IMG.alto) / IMG.h);
    textura.needsUpdate = true;
  }, [textura]);

  /* Un salto corto al tocarlo, y solo uno: es un acuse de recibo, no una
     animación que haya que esperar a que termine. */
  useEffect(() => onLaptopPoke(() => {
    if (salto.current >= 0) return;
    salto.current = 0;
  }), []);

  /* El cuerpo: el trazo del logo extruido de verdad. Seis piezas, unos cientos
     de triángulos —frente a los miles del modelo de la laptop, que es lo que un
     teléfono no podía mover— y cada letra con su propio canto. */
  const cuerpo = useMemo(() => new THREE.ExtrudeGeometry(formas(), {
    depth: FONDO,
    bevelEnabled: true,
    bevelThickness: CHAFLAN,
    bevelSize: CHAFLAN,
    bevelSegments: 2,
    curveSegments: 1,
    UVGenerator: UV,
  }).translate(0, 0, -FONDO / 2), []);

  const caraMat = useMemo(
    () => new THREE.MeshBasicMaterial({
      map: textura,
      /* Sin luz: el logo tiene sus colores y no son negociables. El volumen lo
         pone el canto, que sí está iluminado. */
      toneMapped: false,
      transparent: true,
    }),
    [textura],
  );

  const cantoMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#2f7fe0',
      emissive: '#0e2c66',
      emissiveIntensity: 0.7,
      roughness: 0.34,
      metalness: 0.22,
      transparent: true,
    }),
    [],
  );

  const materiales = useMemo(() => [caraMat, cantoMat], [caraMat, cantoMat]);

  useEffect(() => () => {
    cuerpo.dispose();
    caraMat.dispose();
    cantoMat.dispose();
  }, [cuerpo, caraMat, cantoMat]);

  useFrame((three, delta) => {
    const g = grupo.current;
    if (!g) return;
    if (!avisado.current) {
      avisado.current = true;
      markLaptopReady();
    }

    const t = choreography.current;
    if (!t.visible && entrada.current >= 1) return;

    const paso = Math.min(0.06, Math.max(0, delta));
    const damp = (a, b, l) => THREE.MathUtils.damp(a, b, l, paso);

    /* Entrada: aparece creciendo, una sola vez. */
    entrada.current = Math.min(1, entrada.current + paso / (reducedMotion ? 0.001 : 1.1));
    const ease = 1 - (1 - entrada.current) ** 3;

    const f = t.focus ?? 0;
    const v = three.viewport;
    const reposo = Math.min(v.width / RELACION, v.height) * 0.62;
    const lleno = Math.max(v.width / RELACION, v.height) * HONDO;
    /* Al cuadrado: el acercamiento arranca despacio y se dispara al final,
       que es como se lee un zoom de verdad y no un cambio de tamaño. */
    const escala = (reposo + (lleno - reposo) * f * f) * ease;

    escalaSuave.current = damp(escalaSuave.current, escala, 14);
    g.scale.setScalar(escalaSuave.current);

    /* Sitio: en reposo, donde el hero le reserva el hueco; al entrar, centro.
       Al salir se va hacia un lado, que es como se despide. */
    const anclaY = -(t.anchor ?? 0) * v.height;
    const fuga = t.away ?? 0;
    g.position.x = damp(g.position.x, fuga * v.width * 1.1, 8);
    g.position.y = damp(g.position.y, anclaY * (1 - f), 10);

    /* Dos vueltas completas en el tramo de transición, más el vaivén de
       reposo y el arranque. */
    const vueltas = (t.turns ?? 0) * Math.PI * 4;
    const quieto = t.phase === 'hero' && !reducedMotion;
    const flotando = quieto ? Math.sin(three.clock.elapsedTime * 0.5) * 0.34 : 0;
    giro.current = damp(giro.current, vueltas + flotando - (1 - ease) * Math.PI * 1.6, 8);

    /* El salto del toque: sube y baja una vez, sin encadenarse. */
    let brinco = 0;
    if (salto.current >= 0) {
      salto.current += paso / 0.5;
      if (salto.current >= 1) salto.current = -1;
      else brinco = Math.sin(salto.current * Math.PI) * 0.17;
    }

    g.rotation.y = giro.current;
    g.rotation.x = quieto
      ? Math.sin(three.clock.elapsedTime * 0.37) * 0.09
      : damp(g.rotation.x, 0, 10);
    g.position.y += brinco * (1 - f) * v.height * 0.105;

    const o = t.opacity ?? 1;
    caraMat.opacity = o;
    cantoMat.opacity = o;

    /* Dónde ha quedado en píxeles, para que el hero ponga su zona sensible
       encima. El monograma no tiene nodo DOM al que preguntarle, pero su sitio
       sale de la propia cámara: `factor` son los píxeles que mide una unidad
       de mundo en el plano z = 0, que es donde vive. Solo en reposo: durante el
       viaje ocupa la pantalla entera y no hay nada que tocar. */
    if (t.phase === 'hero' && t.visible) {
      const px = v.factor;
      const alto = escalaSuave.current * px;
      const ancho = alto * RELACION;
      const cx = three.size.width / 2 + g.position.x * px;
      const cy = three.size.height / 2 - g.position.y * px;
      setLaptopRect({
        left: cx - ancho / 2,
        top: cy - alto / 2,
        right: cx + ancho / 2,
        bottom: cy + alto / 2,
        width: ancho,
        height: alto,
      });
    } else {
      setLaptopRect(null);
    }
  });

  return (
    <group ref={grupo}>
      <mesh geometry={cuerpo} material={materiales} />
    </group>
  );
}

/**
 * El logo en tres dimensiones, para teléfono.
 *
 * La laptop no cabía aquí: son miles de vértices y una pantalla con DOM vivo
 * dentro vía CSS3D, y en un teléfono eso se arrastra desde el primer scroll.
 * El monograma hace el mismo papel —dar paso a la página y despedirla— con
 * unos cientos de triángulos y sin segunda maqueta que reflejar.
 *
 * Y es el logo, no una foto del logo: el volumen sale de extruir su propio
 * trazo, así que cada letra tiene canto y al girar se ve por dónde. Las caras
 * llevan la textura con los colores exactos de la marca y el canto va
 * iluminado, que es lo que separa la pieza del fondo negro del tramo.
 *
 * Las luces son tres y fijas: una general para que nada quede a oscuras, una
 * dura desde arriba que revela el chaflán al girar, y un contraluz azul.
 */
export function LogoScene({ choreography, reducedMotion = false, running = true }) {
  return (
    <Canvas
      className="logo-canvas"
      dpr={[0.85, 1.5]}
      frameloop={running ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[2.4, 3.6, 4]} intensity={2.4} />
      <directionalLight position={[-3, -1.4, -2.5]} intensity={1.6} color="#2a76d6" />
      <Monograma choreography={choreography} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
