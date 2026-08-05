import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, useGLTF, useTexture } from '@react-three/drei';
import { RoomEnvironment } from 'three-stdlib';
import * as THREE from 'three';
import { createBrandOS } from './brandOS';

const MODEL = '/laptop.glb';
const ACCENTS = ['#ff684f', '#ceff3d', '#5e63ff', '#36d7d1', '#f5a524'];

/* ---- Monograma flotando detrás ------------------------------------------ */

function BrandMark({ choreography }) {
  const texture = useTexture('/mh-logo.png');
  const group = useRef(null);
  const halo = useRef(null);
  const plate = useRef(null);

  useLayoutEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  }, [texture]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const c = choreography.current;
    /* Acompaña a la laptop solo en el hero: al volver en contacto la laptop
       llega sola, sin arrastrar el monograma sobre el titular. */
    const show = c.phase === 'hero' || c.phase === 'dive' ? c.opacity : 0;

    if (group.current) {
      group.current.position.y = 0.35 + Math.sin(t * 0.45) * 0.06;
      group.current.rotation.z = Math.sin(t * 0.3) * 0.03;
      group.current.visible = show > 0.02;
    }
    if (halo.current) {
      halo.current.material.opacity = (0.24 + Math.sin(t * 0.8) * 0.06) * show;
      halo.current.rotation.z = t * 0.06;
    }
    if (plate.current) plate.current.material.opacity = 0.7 * show;
  });

  return (
    <group ref={group} position={[2.15, 0.35, -2.6]}>
      <mesh ref={halo}>
        <circleGeometry args={[1.95, 72]} />
        <meshBasicMaterial color="#5227ff" transparent opacity={0.24} depthWrite={false} />
      </mesh>
      <mesh ref={plate} position={[0, 0, 0.02]} scale={[1.9, 1.7, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} transparent opacity={0.7} alphaTest={0.02} toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ---- La laptop ---------------------------------------------------------- */

function Laptop({ choreography, reducedMotion }) {
  const { scene } = useGLTF(MODEL, false, true);
  const root = useRef(null);
  const { pointer } = useThree();

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

  /* Materiales: pantalla encendida, chasis en tinta de la marca. */
  const materials = useRef([]);
  useLayoutEffect(() => {
    const collected = [];
    const screens = [];
    const added = [];

    /* Necesario para poder pasar del espacio del mundo al local de la malla. */
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
        /* Las UV originales de la pantalla no cubren la textura completa, así
           que en lugar de pintar sobre ellas se monta un panel propio, del
           tamaño exacto de la malla, con UV bajo nuestro control. */
        child.material = new THREE.MeshBasicMaterial({ color: '#05070c' });
        screens.push(child);
      } else {
        const base = child.material?.clone?.() ?? new THREE.MeshStandardMaterial();
        const name = base.name ?? '';
        if (base.color) {
          if (name === 'Glow') {
            /* La retroiluminación del teclado pasa al verde de la marca. */
            base.color.set('#ceff3d');
            base.emissive?.set?.('#ceff3d');
            base.emissiveIntensity = 1.4;
          } else {
            /* Chasis oscuro con un tinte azulado que pega con el Scanner. */
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

    /* Panel del sistema operativo, alineado con la normal real de la malla.
       Deducir la orientación de la caja envolvente dejaba el panel de espaldas
       y el texto se veía en espejo; la normal promedio no tiene ese problema. */
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

      /* El ancho y el alto son las dos dimensiones que no son la normal. */
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

      /* Orientar solo con la normal deja el giro dentro del plano al azar y el
         sistema salía de cabeza. Se construye la base completa: +Z hacia fuera
         de la pantalla y +Y hacia el arriba real del mundo. */
      const worldUp = new THREE.Vector3(0, 1, 0).transformDirection(
        new THREE.Matrix4().copy(screen.matrixWorld).invert(),
      );
      if (Math.abs(worldUp.dot(outward)) > 0.94) worldUp.set(0, 0, 1);

      const basis = new THREE.Matrix4().lookAt(outward, new THREE.Vector3(), worldUp);
      panel.quaternion.setFromRotationMatrix(basis);
      panel.position.copy(center).addScaledVector(outward, Math.max(axes[thin] * 0.7, 0.002));

      screen.add(panel);
      added.push(panel);
      collected.push(panel.material);
    });

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

  /* Entrada: gira y se asienta. */
  const intro = useRef(0);
  const panels = useRef([]);
  const lastOpacity = useRef(-1);
  const osClock = useRef(0);

  useFrame((stateThree, delta) => {
    const g = root.current;
    if (!g) return;
    const target = choreography.current;

    /* --- pantalla --- */
    osClock.current += delta;
    if (osClock.current > 0.07) {
      os.draw(stateThree.clock.elapsedTime);
      osTexture.needsUpdate = true;
      osClock.current = 0;
    }

    /* --- entrada --- */
    intro.current = Math.min(1, intro.current + delta / (reducedMotion ? 0.001 : 1.9));
    const introEase = 1 - (1 - intro.current) ** 4;
    const introSpin = (1 - introEase) * Math.PI * 2.6;
    const introLift = (1 - introEase) * 1.5;

    /* --- posición --- */
    const damp = (a, b, l) => THREE.MathUtils.damp(a, b, l, delta);
    g.position.x = damp(g.position.x, target.x, 3.6);
    g.position.y = damp(g.position.y, target.y + introLift, 3.6);
    g.position.z = damp(g.position.z, target.z, 3.6);

    const s = damp(g.scale.x, target.scale, 3.6);
    g.scale.setScalar(s);

    /* --- orientación: cursor + coreografía --- */
    const pointerY = reducedMotion ? 0 : pointer.x * 0.5;
    const pointerX = reducedMotion ? 0 : -pointer.y * 0.28;
    const restY = -0.42 + pointerY + target.spin + introSpin;
    const restX = 0.06 + pointerX + target.tilt;

    g.rotation.y = damp(g.rotation.y, restY, 3.2);
    g.rotation.x = damp(g.rotation.x, restX, 3.2);

    /* --- flotación --- */
    if (!reducedMotion) {
      const t = stateThree.clock.elapsedTime;
      g.position.y += Math.sin(t * 0.7) * 0.035;
      g.rotation.z = Math.sin(t * 0.5) * 0.02;
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

  return <primitive ref={root} object={model} position={[2.15, 1.4, 0]} />;
}

/* ---- Entorno generado en local -----------------------------------------
   Da reflejos creíbles al aluminio sin descargar un HDR de ningún CDN. */

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

/* ---- Luces ------------------------------------------------------------- */

function Rig() {
  const key = useRef(null);
  useFrame(({ clock }) => {
    if (!key.current) return;
    key.current.position.x = Math.sin(clock.elapsedTime * 0.3) * 4;
  });

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight ref={key} position={[3.5, 4.5, 5]} intensity={2.6} color="#eef1ff" />
      <directionalLight position={[-5, 1, 2]} intensity={1.5} color="#5227ff" />
      <pointLight position={[0, -1.5, 3]} intensity={1.1} color="#ceff3d" distance={9} />
      {ACCENTS.slice(0, 3).map((c, i) => (
        <pointLight
          key={c}
          color={c}
          intensity={0.5}
          distance={7}
          position={[Math.cos((i / 3) * Math.PI * 2) * 3.4, 1.2, Math.sin((i / 3) * Math.PI * 2) * 2.2]}
        />
      ))}
    </>
  );
}

/* ---- Escena ------------------------------------------------------------ */

export function LaptopScene({ choreography, reducedMotion = false, quality = 'high', onReady }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) onReady?.();
  }, [onReady, ready]);

  return (
    <Canvas
      camera={{ position: [0, 0.15, 8], fov: 38 }}
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.25]}
      gl={{
        alpha: true,
        antialias: quality === 'high',
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      onCreated={() => setReady(true)}
    >
      <LocalEnvironment />
      <Suspense fallback={null}>
        <Rig />
        <BrandMark choreography={choreography} />
        <Laptop choreography={choreography} reducedMotion={reducedMotion} />
      </Suspense>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}

useGLTF.preload(MODEL, false, true);
