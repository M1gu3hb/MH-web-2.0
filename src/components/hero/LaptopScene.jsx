import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, useGLTF } from '@react-three/drei';
import { CSS3DObject, CSS3DRenderer, RoomEnvironment } from 'three-stdlib';
import * as THREE from 'three';
import { createBrandOS } from './brandOS';
import { markLaptopReady, onLaptopPoke } from './laptopBus';

const MODEL = '/laptop.glb';

/* Ancho en píxeles del documento que vive dentro de la pantalla. Es el ancho
   con el que se maqueta la web ahí dentro, así que se elige de escritorio: lo
   que se ve en la laptop es la versión de escritorio del sitio, como sería en
   una laptop de verdad. La escala 3D se calcula para que ese documento mida
   exactamente lo que mide la pantalla del modelo. */
const SCREEN_W = 1280;

/* ---- Capa CSS3D ---------------------------------------------------------
   Un segundo renderizador que coloca DOM real dentro de la escena aplicando
   la misma cámara: es lo que permite que la ventana de la laptop sea la
   página de verdad, viva, y no un dibujo. Va por debajo del canvas WebGL, y
   la pantalla del modelo deja de pintar color para dejarla ver. */

function CssLayer() {
  const { camera, gl, scene, size } = useThree();
  const renderer = useMemo(() => new CSS3DRenderer(), []);

  useLayoutEffect(() => {
    const host = gl.domElement.parentElement;
    if (!host) return undefined;
    const el = renderer.domElement;
    el.style.position = 'absolute';
    el.style.inset = '0';
    el.style.zIndex = '0';
    el.style.pointerEvents = 'none';
    gl.domElement.style.position = 'absolute';
    gl.domElement.style.inset = '0';
    gl.domElement.style.zIndex = '1';
    host.insertBefore(el, gl.domElement);
    return () => el.remove();
  }, [gl, renderer]);

  useEffect(() => {
    renderer.setSize(size.width, size.height);
  }, [renderer, size]);

  useFrame(() => renderer.render(scene, camera));

  return null;
}

/* ---- La laptop ---------------------------------------------------------- */

function Laptop({ choreography, reducedMotion, onScreenReady }) {
  const { scene } = useGLTF(MODEL, false, true);
  const root = useRef(null);

  /* Instancia propia: evita que el caché de drei comparta materiales. */
  const model = useMemo(() => scene.clone(true), [scene]);

  /* Sistema operativo dibujado en la pantalla. */
  const os = useMemo(() => {
    const logo = new Image();
    logo.src = '/mh-logo.png';
    return createBrandOS(logo);
  }, []);

  /* Monograma para la tapa: se pinta en su propio lienzo con fondo
     transparente para poder pegarlo como calca sobre la carcasa. */
  const lidTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const g = c.getContext('2d');
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.flipY = true;

    const logo = new Image();
    logo.onload = () => {
      const w = 210;
      const h = w * (logo.naturalHeight / logo.naturalWidth);
      g.clearRect(0, 0, 256, 256);
      g.drawImage(logo, (256 - w) / 2, (256 - h) / 2, w, h);
      t.needsUpdate = true;
    };
    logo.src = '/mh-logo.png';
    return t;
  }, []);

  const materials = useRef([]);
  const screenRef = useRef(null);

  /* Medidas reales de la pantalla del modelo, en su espacio local y sin
     ninguna transformación del grupo. Con esto la escena calcula sola la
     pose que tapa el viewport, en vez de fiarse de números a ojo. */
  const fit = useRef({ pivot: new THREE.Vector3(), width: 1, height: 1, tilt: 0 });

  /* Vuelta del clic. Va por su propio reloj y se suma a la rotación ya
     amortiguada: dejársela al amortiguador hacía que la vuelta se comiera a
     sí misma y solo se viera media. */
  const spin = useRef(-1);

  useEffect(
    () =>
      onLaptopPoke(() => {
        if (spin.current >= 0) return; // una vuelta a la vez
        spin.current = 0;
        os.toggleMode();
      }),
    [os],
  );

  useLayoutEffect(() => {
    const collected = [];
    const screens = [];
    const added = [];

    /* Se mide con el grupo en identidad: la pose de portada se deriva de la
       geometría, no de dónde esté colocada la laptop en ese instante. */
    const keep = {
      position: model.position.clone(),
      quaternion: model.quaternion.clone(),
      scale: model.scale.clone(),
    };
    model.position.set(0, 0, 0);
    model.quaternion.identity();
    model.scale.set(1, 1, 1);
    model.updateMatrixWorld(true);

    /* gltfpack deja el nombre en el nodo padre y la malla sin nombre, así que
       la pantalla se reconoce por su material o por el nodo que la contiene. */
    const isScreen = (child) =>
      child.name === 'OLED Screen' ||
      child.parent?.name === 'OLED Screen' ||
      child.material?.name === 'Display';

    model.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = false;
      child.receiveShadow = false;

      if (isScreen(child)) {
        /* transparent aquí no es decorativo: sin él la pantalla ignora la
           opacidad global y queda un rectángulo negro flotando al final. */
        child.material = new THREE.MeshBasicMaterial({ color: '#05070c', transparent: true });
        screens.push(child);
      } else {
        const base = child.material?.clone?.() ?? new THREE.MeshStandardMaterial();
        const name = base.name ?? '';
        if (base.color) {
          if (name === 'Glow') {
            base.color.set('#ceff3d');
            base.emissive?.set?.('#ceff3d');
            base.emissiveIntensity = 1.4;
          } else {
            base.color.lerp(new THREE.Color('#171a24'), 0.55);
          }
        }
        base.metalness = Math.min(1, (base.metalness ?? 0.5) * 0.9 + 0.35);
        base.roughness = THREE.MathUtils.clamp((base.roughness ?? 0.5) * 0.8 + 0.12, 0.08, 0.9);
        base.transparent = true;
        child.material = base;
      }
      collected.push(child.material);
    });

    /* Colocación de la pantalla: centro, normal y base completa. La base se
       construye con lookAt porque orientarla solo con la normal deja el giro
       dentro del plano al azar y el contenido sale en espejo. */
    let place = null;
    if (screens.length) {
      const screen = screens[0];
      const geom = screen.geometry;
      geom.computeBoundingBox();
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      geom.boundingBox.getSize(size);
      geom.boundingBox.getCenter(center);

      const normalAttr = geom.getAttribute('normal');
      const outward = new THREE.Vector3();
      if (normalAttr) {
        const n = new THREE.Vector3();
        for (let i = 0; i < normalAttr.count; i += 1) {
          n.fromBufferAttribute(normalAttr, i);
          outward.add(n);
        }
      }
      if (outward.lengthSq() < 1e-6) outward.set(0, 0, 1);
      outward.normalize();

      const axes = [size.x, size.y, size.z];
      const thin = axes.indexOf(Math.min(...axes));
      const [a, b] = [0, 1, 2].filter((i) => i !== thin);

      const worldUp = new THREE.Vector3(0, 1, 0).transformDirection(
        new THREE.Matrix4().copy(screen.matrixWorld).invert(),
      );
      if (Math.abs(worldUp.dot(outward)) > 0.94) worldUp.set(0, 0, 1);

      const quaternion = new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(outward, new THREE.Vector3(), worldUp),
      );

      place = {
        screen,
        center,
        outward,
        quaternion,
        width: axes[a] * 0.955,
        height: axes[b] * 0.955,
        lift: Math.max(axes[thin] * 0.7, 0.002),
        thin: axes[thin],
      };
    }

    /* La pantalla real: un documento HTML colocado en la escena. La malla de
       la pantalla deja de pintar color —solo escribe profundidad— para que se
       vea la capa CSS3D que va por debajo del canvas. */
    let cssObject = null;
    let cssRoot = null;
    if (place) {
      place.screen.material = new THREE.MeshBasicMaterial({ colorWrite: false });
      place.screen.renderOrder = -1;

      const height = Math.round((SCREEN_W * place.height) / place.width);
      cssRoot = document.createElement('div');
      cssRoot.className = 'laptop-screen';
      cssRoot.style.width = `${SCREEN_W}px`;
      cssRoot.style.height = `${height}px`;

      cssObject = new CSS3DObject(cssRoot);
      cssObject.quaternion.copy(place.quaternion);
      cssObject.position.copy(place.center).addScaledVector(place.outward, place.lift);
      cssObject.scale.setScalar(place.width / SCREEN_W);

      place.screen.add(cssObject);
      onScreenReady?.({ root: cssRoot, desktop: os.canvas, width: SCREEN_W, height });
    }

    /* Monograma en la tapa: la marca de la laptop, en la cara opuesta. */
    if (place) {
      const mark = place.width * 0.2;
      const badge = new THREE.Mesh(
        new THREE.PlaneGeometry(mark, mark),
        new THREE.MeshBasicMaterial({
          map: lidTexture,
          toneMapped: false,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      badge.quaternion.copy(place.quaternion);
      badge.rotateY(Math.PI);
      badge.position.copy(place.center).addScaledVector(place.outward, -Math.max(place.thin * 1.6, 0.004));
      place.screen.add(badge);
      added.push(badge);
      collected.push(badge.material);
    }

    /* Las medidas para la pose de portada tienen que salir del espacio del
       modelo, no del de la malla: la geometría de la pantalla viene en
       unidades propias de miles de unidades y con ellas la laptop se
       encogía hasta desaparecer. El grupo está en identidad aquí, así que
       la matriz de mundo del objeto ya es el espacio del modelo. */
    if (place && cssObject) {
      model.updateMatrixWorld(true);
      const height = Math.round((SCREEN_W * place.height) / place.width);
      const corner = (dx, dy) =>
        new THREE.Vector3((SCREEN_W / 2) * dx, (height / 2) * dy, 0).applyMatrix4(cssObject.matrixWorld);
      const origin = corner(-1, -1);

      fit.current = {
        pivot: new THREE.Vector3().setFromMatrixPosition(cssObject.matrixWorld),
        width: origin.distanceTo(corner(1, -1)),
        height: origin.distanceTo(corner(-1, 1)),
        tilt: 0,
      };

      const normal = new THREE.Vector3(0, 0, 1).transformDirection(cssObject.matrixWorld);
      fit.current.tilt = Math.atan2(normal.y, normal.z);
    }

    /* El lienzo del escritorio toma la forma de la pantalla medida. */
    if (os.setAspect(fit.current.width / fit.current.height)) os.draw(0);

    model.position.copy(keep.position);
    model.quaternion.copy(keep.quaternion);
    model.scale.copy(keep.scale);
    model.updateMatrixWorld(true);

    materials.current = collected;
    screenRef.current = cssRoot;

    return () => {
      cssObject?.parent?.remove(cssObject);
      cssRoot?.remove();
      onScreenReady?.(null);
      added.forEach((p) => {
        p.parent?.remove(p);
        p.geometry.dispose();
      });
      collected.forEach((m) => m.dispose?.());
    };
  }, [lidTexture, model, onScreenReady, os]);

  const intro = useRef(0);
  const announced = useRef(false);
  const lastOpacity = useRef(-1);
  const osClock = useRef(0);
  const baseY = useRef(0);
  const offset = useRef(new THREE.Vector3());
  const euler = useRef(new THREE.Euler());
  const camEuler = useRef(new THREE.Euler());

  useFrame((three, delta) => {
    const g = root.current;
    if (!g) return;
    if (!announced.current) {
      announced.current = true;
      markLaptopReady();
    }
    const target = choreography.current;

    /* Fuera de pantalla no hay nada que calcular: ni el sistema operativo ni
       la pose. El bucle sigue vivo solo para no perder el contexto WebGL. */
    if (!target.visible && intro.current >= 1) return;

    /* Tras una pausa hay que colocarse de golpe: amortiguar desde la última
       pose dejaría ver a la laptop «viajando» hasta su sitio. */
    const resumed = delta > 0.2;

    /* --- pantalla --- */
    osClock.current += delta;
    /* El escritorio es fondo: no necesita ir a la velocidad de la pantalla. */
    if (osClock.current > 0.13) {
      os.draw(three.clock.elapsedTime);
      osClock.current = 0;
    }

    /* --- entrada, una sola vez --- */
    intro.current = Math.min(1, intro.current + delta / (reducedMotion ? 0.001 : 1.7));
    const introEase = 1 - (1 - intro.current) ** 4;
    const introSpin = (1 - introEase) * Math.PI * 2.6;
    const introLift = (1 - introEase) * 1.4;

    const damp = (a, b, l) => (resumed ? b : THREE.MathUtils.damp(a, b, l, delta));
    const mix = THREE.MathUtils.lerp;

    /* --- pose que tapa el viewport, recalculada cada fotograma ---------
       La escala sale de comparar la pantalla real del modelo con lo que se
       ve a z = 0, así cubre igual en 16:9 que en un móvil vertical. */
    const f = target.focus;
    const { pivot, width, height, tilt } = fit.current;
    const cover = Math.max(three.viewport.width / width, three.viewport.height / height) * 1.03;

    /* La cámara está un poco por encima del origen y mira hacia él, así que
       apunta algo más de un grado hacia abajo. Dejar la pantalla horizontal
       en el mundo no la deja paralela a la cámara: quedaba esa pizca de
       perspectiva y el texto de arriba salía un uno por ciento más grande que
       el de la página, con el consiguiente salto al hacer el relevo. Sumando
       la inclinación de la cámara el panel cae plano de verdad. */
    camEuler.current.setFromQuaternion(three.camera.quaternion, 'YXZ');

    const scale = mix(target.scale, cover, f);
    const rotY = mix(target.rotY, 0, f);
    const rotX = mix(target.rotX, tilt + camEuler.current.x, f);

    /* El grupo gira sobre su origen, no sobre la pantalla: hay que restar
       dónde acaba el centro del panel para dejarlo justo en el centro. */
    offset.current.copy(pivot).multiplyScalar(scale * f).applyEuler(euler.current.set(rotX, rotY, 0));

    /* Al cubrir la pantalla el seguimiento tiene que ser inmediato: si se
       amortigua, la laptop llega tarde y se ve el fondo por los bordes. */
    const speed = target.phase === 'hero' ? 3.6 : 11;

    /* El ancla llega en fracciones de alto de pantalla; aquí se pasa a
       unidades de mundo, que es donde se conoce la cámara. */
    const looseY = target.y - target.anchor * three.viewport.height;

    g.position.x = damp(g.position.x, mix(target.x, 0, f) - offset.current.x, speed);
    g.position.y = damp(g.position.y, mix(looseY, 0, f) - offset.current.y + introLift, speed);
    g.position.z = damp(g.position.z, mix(target.z, 0, f) - offset.current.z, speed);
    g.scale.setScalar(damp(g.scale.x, scale, speed));

    /* Vuelta completa: 0 -> 2π con easing y de vuelta a 0, que es la misma
       orientación, así no queda desfase al terminar. */
    let turn = 0;
    if (spin.current >= 0) {
      spin.current += delta / 1.15;
      if (spin.current >= 1) spin.current = -1;
      else {
        const t = spin.current;
        turn = (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2) * Math.PI * 2;
      }
    }

    /* La base amortiguada se guarda aparte. Leyéndola de `rotation.y` se
       realimentaba con la vuelta del fotograma anterior y en vez de una
       vuelta daba decenas. */
    baseY.current = damp(baseY.current, rotY + introSpin, speed);
    g.rotation.y = baseY.current + turn;
    g.rotation.x = damp(g.rotation.x, rotX, speed);

    /* --- flotación, solo en reposo --- */
    if (!reducedMotion && target.phase === 'hero') {
      const t = three.clock.elapsedTime;
      g.position.y += Math.sin(t * 0.7) * 0.035;
      g.rotation.z = Math.sin(t * 0.5) * 0.02;
    } else {
      g.rotation.z = damp(g.rotation.z, 0, speed);
    }

    /* --- opacidad global, solo cuando cambia de verdad ---
       La pantalla es DOM, así que se apaga por estilo: no tiene material que
       seguir la opacidad de los demás. */
    const o = target.opacity * introEase;
    if (Math.abs(o - lastOpacity.current) > 0.008) {
      lastOpacity.current = o;
      materials.current.forEach((m) => {
        m.opacity = o;
        m.depthWrite = o > 0.96;
      });
      if (screenRef.current) {
        screenRef.current.style.opacity = String(o);
        /* display, no visibility: oculta de verdad saca la capa 3D del
           compositor. Con visibility seguía costando fotogramas dentro de la
           página, donde la laptop no se ve para nada. */
        screenRef.current.style.display = o > 0.02 ? '' : 'none';
      }
    }
  });

  return <primitive ref={root} object={model} position={[1.85, 1.35, 0]} />;
}

/* ---- Entorno generado en local ----------------------------------------- */

function LocalEnvironment() {
  const { gl, scene } = useThree();

  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = env.texture;
    return () => {
      scene.environment = null;
      env.texture.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
}

/* ---- Luces --------------------------------------------------------------
   Tres luces, todas fijas. Cada luz de más se paga en cada fragmento de cada
   fotograma, y el entorno ya aporta casi todo el modelado. */

function Rig() {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3.5, 4.5, 5]} intensity={2.6} color="#eef1ff" />
      <directionalLight position={[-5, 1, 2]} intensity={1.4} color="#5227ff" />
    </>
  );
}

/* ---- Escena ------------------------------------------------------------- */

export function LaptopScene({ choreography, reducedMotion = false, quality = 'high', running = true, onScreenReady }) {
  return (
    <Canvas
      frameloop={running ? 'always' : 'never'}
      camera={{ position: [0, 0.15, 8], fov: 38 }}
      dpr={quality === 'high' ? [1, 1.25] : [0.75, 1]}
      gl={{
        alpha: true,
        antialias: quality === 'high',
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
    >
      <LocalEnvironment />
      <CssLayer />
      <Suspense fallback={null}>
        <Rig />
        <Laptop choreography={choreography} reducedMotion={reducedMotion} onScreenReady={onScreenReady} />
      </Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}

useGLTF.preload(MODEL, false, true);
