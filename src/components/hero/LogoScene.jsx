import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { markLaptopReady, onLaptopPoke, setLaptopRect } from './laptopBus';

/* El PNG lleva aire alrededor y el monograma no está centrado en él, así que
   pintarlo tal cual dejaba el logo descolocado sobre la placa. Estas cifras
   son su recinto real dentro de la imagen —medido sobre el alfa— y se aplican
   como recorte de la textura, que sale gratis frente a rehacer el archivo. */
const IMG = { w: 512, h: 457, x: 63, y: 18, ancho: 383, alto: 405 };
const RELACION = IMG.ancho / IMG.alto;

/* La pieza es la insignia de la marca hecha objeto: la placa redondeada que
   ya lleva el logo en la barra de navegación, pero con canto. Sin placa no
   había pieza que mirar —seis de cada diez píxeles del monograma son casi
   negros y sobre el fondo negro del tramo simplemente no estaban—. */
const RADIO = 0.2;
const FONDO = 0.15;
const BISEL = 0.018;

/* Cuánto de la placa ocupa el monograma. También decide el zoom: al final de
   la entrada la pieza crece hasta que este cuadro desborda la pantalla, y lo
   que queda cubriéndola es el centro del monograma, que es casi negro. Ese
   es el relevo con la página: negro contra negro, sin fogonazo. */
const MARCA = 0.66;

/* Cuántas pantallas mide el monograma cuando el zoom está del todo dentro.
   Más allá de esto no se gana viaje: el original mide 383 píxeles de ancho y
   ampliarlo tanto lo deshace en manchas. Por eso la pieza se disuelve mientras
   sigue creciendo, en vez de quedarse quieta y borrosa delante. */
const HONDO = 1.6;

const suave = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function placaShape() {
  const s = new THREE.Shape();
  const h = 0.5;
  const r = RADIO;
  s.moveTo(-h + r, -h);
  s.lineTo(h - r, -h);
  s.quadraticCurveTo(h, -h, h, -h + r);
  s.lineTo(h, h - r);
  s.quadraticCurveTo(h, h, h - r, h);
  s.lineTo(-h + r, h);
  s.quadraticCurveTo(-h, h, -h, h - r);
  s.lineTo(-h, -h + r);
  s.quadraticCurveTo(-h, -h, -h + r, -h);
  return s;
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

  /* Cuerpo de la placa. Extruido con bisel: son unos cientos de triángulos
     —frente a los miles del modelo de la laptop, que es justo lo que un
     teléfono no podía mover— y el bisel es lo que hace que al girar se le
     vea el canto y se lea como una pieza y no como una calcomanía. */
  const cuerpo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(placaShape(), {
      depth: FONDO,
      bevelEnabled: true,
      bevelThickness: BISEL,
      bevelSize: BISEL,
      bevelSegments: 2,
      curveSegments: 10,
    });
    g.translate(0, 0, -FONDO / 2);
    return g;
  }, []);

  const caraGeo = useMemo(() => new THREE.PlaneGeometry(MARCA * RELACION, MARCA), []);
  const caraMat = useMemo(
    () => new THREE.MeshBasicMaterial({
      map: textura,
      transparent: true,
      /* El monograma va con sus colores exactos, sin que la luz de la escena
         se los tiña: es una impresión sobre la placa, no un volumen. */
      toneMapped: false,
      depthWrite: false,
    }),
    [textura],
  );

  const placaMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#eef3ff',
      roughness: 0.34,
      metalness: 0.12,
      transparent: true,
    }),
    [],
  );

  useEffect(() => () => {
    cuerpo.dispose();
    caraGeo.dispose();
    caraMat.dispose();
    placaMat.dispose();
  }, [cuerpo, caraGeo, caraMat, placaMat]);

  /* La cara de atrás lleva el monograma espejado, que es lo que se ve durante
     las vueltas. Se coloca una vez. */
  const trasera = useRef(null);
  useLayoutEffect(() => {
    if (trasera.current) trasera.current.rotation.y = Math.PI;
  }, []);

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

    /* Cuánto mide el lado de la placa. En reposo, la insignia flotando; al
       final del viaje, tanto que lo que cubre la pantalla es el centro del
       propio monograma. */
    const f = t.focus ?? 0;
    const v = three.viewport;
    const reposo = Math.min(v.width, v.height) * 0.46;
    const lleno = (Math.max(v.width, v.height) / MARCA) * HONDO;
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
    /* La placa se retira nada más arrancar el acercamiento, y en un tramo
       corto. Dos razones: si aguanta hasta el final, lo último que se ve antes
       de la página es un rectángulo blanco a pantalla completa y el sitio es
       oscuro —el relevo daba un fogonazo—; y si se va despacio, se queda un
       buen rato como una losa gris translúcida del tamaño de media pantalla,
       que no se lee como nada. Yéndose pronto, lo que cubre al final es el
       monograma sobre negro, que enlaza con lo que hay detrás sin corte. */
    placaMat.opacity = o * (1 - suave(0.06, 0.24, f));
    placaMat.visible = placaMat.opacity > 0.004;

    /* Dónde ha quedado en píxeles, para que el hero ponga su zona sensible
       encima. El monograma no tiene nodo DOM al que preguntarle, pero su sitio
       sale de la propia cámara: `factor` son los píxeles que mide una unidad
       de mundo en el plano z = 0, que es donde vive. Solo en reposo: durante el
       viaje ocupa la pantalla entera y no hay nada que tocar. */
    if (t.phase === 'hero' && t.visible) {
      const px = v.factor;
      const lado = escalaSuave.current * px;
      const cx = three.size.width / 2 + g.position.x * px;
      const cy = three.size.height / 2 - g.position.y * px;
      setLaptopRect({
        left: cx - lado / 2,
        top: cy - lado / 2,
        right: cx + lado / 2,
        bottom: cy + lado / 2,
        width: lado,
        height: lado,
      });
    } else {
      setLaptopRect(null);
    }
  });

  return (
    <group ref={grupo}>
      <mesh geometry={cuerpo} material={placaMat} />
      <mesh
        geometry={caraGeo}
        material={caraMat}
        position={[0, 0, FONDO / 2 + BISEL + 0.002]}
      />
      <mesh
        ref={trasera}
        geometry={caraGeo}
        material={caraMat}
        position={[0, 0, -(FONDO / 2 + BISEL + 0.002)]}
      />
    </group>
  );
}

/**
 * El logo en tres dimensiones, para teléfono.
 *
 * La laptop no cabía aquí: son miles de vértices y una pantalla con DOM vivo
 * dentro vía CSS3D, y en un teléfono eso se arrastra desde el primer scroll.
 * La insignia hace el mismo papel —dar paso a la página y despedirla— con unos
 * cientos de triángulos y sin segunda maqueta que reflejar.
 *
 * Las luces son tres y fijas: una general para que nada quede a oscuras, una
 * dura desde arriba que revela el bisel al girar, y un contraluz azul de la
 * marca que separa la pieza del fondo negro del tramo.
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
      <ambientLight intensity={1.15} />
      <directionalLight position={[2.4, 3.6, 4]} intensity={2.1} />
      <directionalLight position={[-3, -1.4, -2.5]} intensity={1.5} color="#2a76d6" />
      <Monograma choreography={choreography} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
