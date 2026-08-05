import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, useGLTF } from '@react-three/drei';
import { RoomEnvironment } from 'three-stdlib';
import * as THREE from 'three';
import { createBrandOS } from './brandOS';
import { onLaptopPoke } from './laptopBus';

const MODEL = '/laptop.glb';

/* ---- La laptop ---------------------------------------------------------- */

function Laptop({ choreography, reducedMotion }) {
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

  const osTexture = useMemo(() => {
    const t = new THREE.CanvasTexture(os.canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.flipY = true;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  }, [os]);

  const materials = useRef([]);
  const panels = useRef([]);

  /* Medidas reales de la pantalla del modelo, en su espacio local y sin
     ninguna transformación del grupo. Con esto la escena calcula sola la
     pose que tapa el viewport, en vez de fiarse de números a ojo. */
  const fit = useRef({ pivot: new THREE.Vector3(), width: 1, height: 1, tilt: 0 });

  /* Vuelta extra que se acumula al tocar la laptop. */
  const poke = useRef(0);

  useEffect(
    () =>
      onLaptopPoke(() => {
        poke.current += Math.PI * 2;
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

    /* Panel del sistema operativo, alineado con la normal real de la malla y
       con la base completa construida por lookAt: orientarlo solo con la
       normal dejaba el giro dentro del plano al azar y salía en espejo. */
    screens.forEach((screen) => {
      const geom = screen.geometry;
      geom.computeBoundingBox();
      const box = geom.boundingBox;
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

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

      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(axes[a] * 0.955, axes[b] * 0.955),
        new THREE.MeshBasicMaterial({
          map: osTexture,
          toneMapped: false,
          transparent: true,
          side: THREE.DoubleSide,
        }),
      );

      const worldUp = new THREE.Vector3(0, 1, 0).transformDirection(
        new THREE.Matrix4().copy(screen.matrixWorld).invert(),
      );
      if (Math.abs(worldUp.dot(outward)) > 0.94) worldUp.set(0, 0, 1);

      panel.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(outward, new THREE.Vector3(), worldUp));
      panel.position.copy(center).addScaledVector(outward, Math.max(axes[thin] * 0.7, 0.002));

      screen.add(panel);
      added.push(panel);
      collected.push(panel.material);
    });

    /* Del panel ya colocado salen las tres cosas que necesita la portada:
       dónde está el centro de la pantalla, cuánto mide de verdad y cuánto
       hay que girar en X para que mire de frente a la cámara. */
    if (added.length) {
      const panel = added[0];
      model.updateMatrixWorld(true);
      const p = panel.geometry.parameters;
      const corner = (dx, dy) =>
        new THREE.Vector3((p.width / 2) * dx, (p.height / 2) * dy, 0).applyMatrix4(panel.matrixWorld);
      const a = corner(-1, -1);
      const normal = new THREE.Vector3(0, 0, 1).transformDirection(panel.matrixWorld);
      fit.current = {
        pivot: new THREE.Vector3().setFromMatrixPosition(panel.matrixWorld),
        width: a.distanceTo(corner(1, -1)),
        height: a.distanceTo(corner(-1, 1)),
        tilt: Math.atan2(normal.y, normal.z),
      };
    }

    model.position.copy(keep.position);
    model.quaternion.copy(keep.quaternion);
    model.scale.copy(keep.scale);
    model.updateMatrixWorld(true);

    panels.current = added;
    materials.current = collected;

    return () => {
      added.forEach((p) => {
        p.parent?.remove(p);
        p.geometry.dispose();
      });
      collected.forEach((m) => m.dispose?.());
    };
  }, [model, osTexture]);

  const intro = useRef(0);
  const lastOpacity = useRef(-1);
  const osClock = useRef(0);
  const offset = useRef(new THREE.Vector3());
  const euler = useRef(new THREE.Euler());

  useFrame((three, delta) => {
    const g = root.current;
    if (!g) return;
    const target = choreography.current;

    /* Fuera de pantalla no hay nada que calcular: ni el sistema operativo ni
       la pose. El bucle sigue vivo solo para no perder el contexto WebGL. */
    if (!target.visible && intro.current >= 1) return;

    /* Tras una pausa hay que colocarse de golpe: amortiguar desde la última
       pose dejaría ver a la laptop «viajando» hasta su sitio. */
    const resumed = delta > 0.2;

    /* --- pantalla --- */
    osClock.current += delta;
    if (osClock.current > 0.13) {
      os.draw(three.clock.elapsedTime);
      osTexture.needsUpdate = true;
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

    const scale = mix(target.scale, cover, f);
    const rotY = mix(target.rotY, 0, f);
    const rotX = mix(target.rotX, tilt, f);

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

    /* La vuelta del clic se consume poco a poco, no de golpe. */
    if (poke.current > 0.001) {
      const eaten = Math.min(poke.current, delta * 7.5);
      poke.current -= eaten;
    } else {
      poke.current = 0;
    }

    g.rotation.y = damp(g.rotation.y, rotY + introSpin + poke.current, speed);
    g.rotation.x = damp(g.rotation.x, rotX, speed);

    /* --- flotación, solo en reposo --- */
    if (!reducedMotion && target.phase === 'hero') {
      const t = three.clock.elapsedTime;
      g.position.y += Math.sin(t * 0.7) * 0.035;
      g.rotation.z = Math.sin(t * 0.5) * 0.02;
    } else {
      g.rotation.z = damp(g.rotation.z, 0, speed);
    }

    /* --- opacidad global, solo cuando cambia de verdad --- */
    const o = target.opacity * introEase;
    if (Math.abs(o - lastOpacity.current) > 0.008) {
      lastOpacity.current = o;
      materials.current.forEach((m) => {
        m.opacity = o;
        m.depthWrite = o > 0.96;
      });
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

export function LaptopScene({ choreography, reducedMotion = false, quality = 'high', running = true }) {
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
      <Suspense fallback={null}>
        <Rig />
        <Laptop choreography={choreography} reducedMotion={reducedMotion} />
      </Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}

useGLTF.preload(MODEL, false, true);
