import { Suspense, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Float, Preload, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { coreFragmentShader, coreVertexShader } from './coreShader';

const ACCENTS = ['#ff684f', '#ceff3d', '#5e63ff', '#36d7d1'];

const ORBIT_NODES = [
  { position: [-2.62, 1.55, 0.42], color: ACCENTS[0], scale: [0.58, 0.17, 0.17], speed: 0.24 },
  { position: [2.44, 1.74, 0.12], color: ACCENTS[1], scale: [0.42, 0.42, 0.2], speed: -0.3 },
  { position: [2.78, -1.18, 0.46], color: ACCENTS[2], scale: [0.7, 0.19, 0.19], speed: 0.21 },
  { position: [-2.56, -1.5, 0.16], color: ACCENTS[3], scale: [0.32, 0.32, 0.2], speed: -0.27 },
];

/* ---- Núcleo con shader propio ------------------------------------------ */

function AstralCore({ detail, reducedMotion }) {
  const material = useRef(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: 1 },
      uInk: { value: new THREE.Color('#0a0d14') },
      uAccentA: { value: new THREE.Color('#345dff') },
      uAccentB: { value: new THREE.Color('#ff684f') },
      uAccentC: { value: new THREE.Color('#ceff3d') },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value += reducedMotion ? 0 : delta;
    const target = reducedMotion ? 0.55 : 1;
    material.current.uniforms.uAmplitude.value = THREE.MathUtils.damp(
      material.current.uniforms.uAmplitude.value,
      target,
      3,
      delta,
    );
  });

  return (
    <mesh>
      <icosahedronGeometry args={[1.42, detail]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={coreVertexShader}
        fragmentShader={coreFragmentShader}
      />
    </mesh>
  );
}

/* ---- Malla exterior ---------------------------------------------------- */

function CoreShell({ reducedMotion }) {
  const shell = useRef(null);

  useFrame((state, delta) => {
    if (!shell.current || reducedMotion) return;
    shell.current.rotation.y += delta * 0.09;
    shell.current.rotation.x += delta * 0.035;
  });

  return (
    <mesh ref={shell}>
      <icosahedronGeometry args={[2.02, 1]} />
      <meshBasicMaterial color="#1b2033" wireframe transparent opacity={0.28} />
    </mesh>
  );
}

/* ---- Anillo de partículas instanciadas --------------------------------- */

function ParticleRing({ count, reducedMotion }) {
  const mesh = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        angle: (index / count) * Math.PI * 2 + Math.random() * 0.35,
        radius: 2.35 + Math.random() * 1.5,
        height: (Math.random() - 0.5) * 1.15,
        size: 0.018 + Math.random() * 0.042,
        drift: 0.18 + Math.random() * 0.5,
      })),
    [count],
  );

  useLayoutEffect(() => {
    if (!mesh.current) return;
    const color = new THREE.Color();
    seeds.forEach((seed, index) => {
      color.set(ACCENTS[index % ACCENTS.length]);
      mesh.current.setColorAt(index, index % 3 === 0 ? color : color.set('#2a3350'));
    });
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [seeds]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const time = reducedMotion ? 0 : clock.elapsedTime;
    seeds.forEach((seed, index) => {
      const angle = seed.angle + time * seed.drift * 0.16;
      dummy.position.set(
        Math.cos(angle) * seed.radius,
        seed.height + Math.sin(time * 0.5 + index) * 0.09,
        Math.sin(angle) * seed.radius * 0.42,
      );
      dummy.scale.setScalar(seed.size);
      dummy.rotation.set(angle, angle * 0.6, 0);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(index, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

/* ---- Placa holográfica del monograma ----------------------------------- */

function LogoPlate() {
  const texture = useTexture('/mh-logo-v2-1080.png');
  const plate = useRef(null);

  useLayoutEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame(({ clock }) => {
    if (!plate.current) return;
    plate.current.position.z = 2.55 + Math.sin(clock.elapsedTime * 0.5) * 0.06;
  });

  return (
    <group ref={plate} position={[0, -0.04, 2.55]}>
      {[-0.16, -0.09].map((z, index) => (
        <mesh key={z} position={[0, 0, z]} scale={[2.52, 2.24, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={texture}
            color={index === 0 ? '#0b1226' : '#1c3f96'}
            transparent
            opacity={0.34 + index * 0.16}
            alphaTest={0.02}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh scale={[2.52, 2.24, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.02} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---- Nodos de acento --------------------------------------------------- */

function OrbitNode({ position, color, scale, speed, reducedMotion }) {
  const node = useRef(null);

  useFrame(({ clock }) => {
    if (!node.current || reducedMotion) return;
    node.current.rotation.y = clock.elapsedTime * speed;
    node.current.rotation.x = Math.sin(clock.elapsedTime * 0.6) * 0.2;
  });

  return (
    <group ref={node} position={position}>
      <mesh scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.42}
          metalness={0.55}
          roughness={0.22}
        />
      </mesh>
      <pointLight color={color} intensity={0.9} distance={2.6} />
    </group>
  );
}

/* ---- Plataforma -------------------------------------------------------- */

function Platform() {
  return (
    <mesh position={[0, 0, -1.35]}>
      <circleGeometry args={[2.75, 72]} />
      <meshPhysicalMaterial
        color="#070910"
        roughness={0.2}
        metalness={0.8}
        clearcoat={1}
        clearcoatRoughness={0.16}
      />
    </mesh>
  );
}

/* ---- Rig que sigue al cursor ------------------------------------------- */

function Rig({ children, reducedMotion }) {
  const group = useRef(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;
    const targetX = reducedMotion ? 0.03 : pointer.y * 0.2;
    const targetY = reducedMotion ? -0.06 : pointer.x * 0.28;
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3.4, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 3.4, delta);
  });

  return <group ref={group}>{children}</group>;
}

/* ---- Escena ------------------------------------------------------------ */

function Scene({ quality, reducedMotion }) {
  const detail = quality === 'high' ? 42 : 22;
  const particles = quality === 'high' ? 220 : 90;

  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 5, 6]} intensity={2.4} />
      <directionalLight position={[-5, -2, 3]} intensity={1.8} color="#2f5dff" />

      <Rig reducedMotion={reducedMotion}>
        <Float speed={reducedMotion ? 0 : 1.25} rotationIntensity={0.08} floatIntensity={0.24}>
          <Platform />
          <CoreShell reducedMotion={reducedMotion} />
          <AstralCore detail={detail} reducedMotion={reducedMotion} />
          <ParticleRing count={particles} reducedMotion={reducedMotion} />
          <LogoPlate />
          {ORBIT_NODES.map((node) => (
            <OrbitNode key={node.color} {...node} reducedMotion={reducedMotion} />
          ))}
        </Float>
      </Rig>

      <AdaptiveDpr pixelated />
      <Preload all />
    </>
  );
}

export function HeroScene({ reducedMotion = false, quality = 'high' }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.4], fov: 42 }}
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.3]}
      frameloop={reducedMotion ? 'demand' : 'always'}
      gl={{
        alpha: true,
        antialias: quality === 'high',
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
    >
      <Suspense fallback={null}>
        <Scene quality={quality} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
