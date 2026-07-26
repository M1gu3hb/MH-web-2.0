import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, Float, Line, Preload, RoundedBox, Sparkles, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const ORBIT_NODES = [
  { position: [-2.55, 1.52, 0.4], color: '#ff684f', scale: [0.6, 0.18, 0.18] },
  { position: [2.38, 1.72, 0.1], color: '#ceff3d', scale: [0.46, 0.46, 0.22] },
  { position: [2.72, -1.16, 0.45], color: '#5e63ff', scale: [0.72, 0.2, 0.2] },
  { position: [-2.5, -1.48, 0.15], color: '#36d7d1', scale: [0.34, 0.34, 0.2] },
];

function LogoStack() {
  const texture = useTexture('/mh-logo-v2-1080.png');

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  const depthLayers = useMemo(() => [-0.28, -0.23, -0.18, -0.13, -0.08], []);

  return (
    <group position={[0, -0.05, 0.25]} rotation={[0.03, -0.05, -0.015]}>
      {depthLayers.map((z, index) => (
        <mesh key={z} position={[0, 0, z]} scale={[3.06, 2.72, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={texture}
            color={index < 2 ? '#061127' : '#173c91'}
            transparent
            opacity={0.28 + index * 0.08}
            alphaTest={0.025}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.02]} scale={[3.06, 2.72, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.025} toneMapped={false} />
      </mesh>
    </group>
  );
}

function OrbitNode({ position, color, scale, index }) {
  const node = useRef(null);

  useFrame(({ clock }) => {
    if (!node.current) return;
    node.current.rotation.x = Math.sin(clock.elapsedTime * 0.65 + index) * 0.22;
    node.current.rotation.y = clock.elapsedTime * (index % 2 ? -0.28 : 0.24);
  });

  return (
    <group ref={node} position={position}>
      <RoundedBox args={scale} radius={0.12} smoothness={5}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          metalness={0.58}
          roughness={0.2}
        />
      </RoundedBox>
      <pointLight color={color} intensity={1.1} distance={2.4} />
    </group>
  );
}

function SystemCore({ reducedMotion }) {
  const rig = useRef(null);
  const innerRing = useRef(null);
  const outerRing = useRef(null);
  const { pointer } = useThree();

  useFrame(({ clock }, delta) => {
    if (!rig.current) return;
    const targetX = reducedMotion ? 0.02 : pointer.y * 0.16;
    const targetY = reducedMotion ? -0.04 : pointer.x * 0.22;
    rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, targetX, 4, delta);
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, targetY, 4, delta);
    if (!reducedMotion) {
      innerRing.current.rotation.z = clock.elapsedTime * 0.14;
      outerRing.current.rotation.z = -clock.elapsedTime * 0.08;
    }
  });

  const signalLine = useMemo(
    () => [
      new THREE.Vector3(-2.55, 1.52, 0.35),
      new THREE.Vector3(-1.7, 1.18, -0.08),
      new THREE.Vector3(-0.6, 1.65, -0.28),
      new THREE.Vector3(0.45, 1.34, -0.22),
      new THREE.Vector3(1.48, 1.82, -0.1),
      new THREE.Vector3(2.38, 1.72, 0.08),
    ],
    [],
  );

  return (
    <group ref={rig}>
      <Float speed={reducedMotion ? 0 : 1.4} rotationIntensity={0.08} floatIntensity={0.22}>
        <mesh position={[0, 0, -0.72]} scale={[1.02, 1.02, 1]}>
          <circleGeometry args={[2.5, 96]} />
          <meshPhysicalMaterial
            color="#080a0e"
            roughness={0.16}
            metalness={0.82}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </mesh>

        <group ref={outerRing} rotation={[0.2, -0.18, 0]}>
          <mesh>
            <torusGeometry args={[2.72, 0.035, 12, 180]} />
            <meshStandardMaterial color="#2d5cff" emissive="#234dff" emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
          <mesh rotation={[0, 0, 0.85]}>
            <torusGeometry args={[2.72, 0.085, 14, 72, Math.PI * 0.27]} />
            <meshStandardMaterial color="#ceff3d" emissive="#ceff3d" emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
        </group>

        <group ref={innerRing} rotation={[0.4, 0.65, 0]}>
          <mesh>
            <torusGeometry args={[2.22, 0.018, 10, 150]} />
            <meshStandardMaterial color="#faf8ef" transparent opacity={0.52} />
          </mesh>
          <mesh rotation={[0, 0, 2.6]}>
            <torusGeometry args={[2.22, 0.06, 12, 72, Math.PI * 0.2]} />
            <meshStandardMaterial color="#ff684f" emissive="#ff684f" emissiveIntensity={0.85} toneMapped={false} />
          </mesh>
        </group>

        <LogoStack />
        {ORBIT_NODES.map((node, index) => (
          <OrbitNode key={node.color} {...node} index={index} />
        ))}
        <Line points={signalLine} color="#f6f3e9" lineWidth={0.65} transparent opacity={0.38} />
      </Float>
      <Sparkles count={34} scale={[6, 4.8, 2]} size={1.6} speed={reducedMotion ? 0 : 0.18} color="#9ec4ff" />
    </group>
  );
}

function Scene({ reducedMotion }) {
  return (
    <>
      <ambientLight intensity={1.3} />
      <directionalLight position={[4, 5, 6]} intensity={2.8} color="#ffffff" />
      <directionalLight position={[-5, -2, 3]} intensity={2.4} color="#245dff" />
      <pointLight position={[0, 0, 4]} intensity={1.2} color="#f5f0e5" />
      <SystemCore reducedMotion={reducedMotion} />
      <AdaptiveDpr pixelated />
      <Preload all />
    </>
  );
}

export function HeroScene({ reducedMotion = false }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.25], fov: 44 }}
      dpr={[1, 1.5]}
      frameloop={reducedMotion ? 'demand' : 'always'}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
    >
      <Suspense fallback={null}>
        <Scene reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
