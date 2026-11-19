/**
 * ============================================================
 * LA TERMINAL — un modelo 3D dibujado con caracteres
 * ============================================================
 *
 * La pieza de la portada de MorphiqPOS: una terminal de punto de venta en
 * 3D que NO se enseña como un render, sino como arte ASCII. La escena se
 * pinta primero en una textura y un segundo pase la traduce a glifos: por
 * cada celda mide cuánta luz hay y elige el carácter que le corresponde.
 *
 * Dos cosas rompen el ASCII y dejan ver el objeto de verdad:
 *   · una lente que sigue al cursor
 *   · un barrido en diagonal que pasa solo cada pocos segundos, que es lo
 *     que ve quien entra desde un teléfono, donde no hay cursor
 *
 * POR QUÉ ASÍ
 * El arte ASCII tiene que estar presente sin gritar. Un modelo 3D girando
 * en un hero es lo que hace todo el mundo; el mismo modelo hecho de letras
 * es de esta marca y de ninguna otra. De paso tapa lo único malo de un
 * modelo generado: de cerca sus texturas no aguantan, y hechas glifos sí.
 *
 * COSTE
 * Un solo modelo de 33 mil triángulos (480 KB, geometría meshopt y texturas
 * WebP), dos pases por fotograma y DPR limitado. Fuera de pantalla, con la
 * pestaña oculta o con movimiento reducido el bucle se para.
 *
 * Este archivo se carga con `lazy`: three.js no entra en el trozo de la
 * página, igual que hace el hero de la home con `Beams`.
 */

import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import { crearAtlas } from './CampoAscii';

const MODELO = '/pos/terminal-v1.glb';
/* Una captura de la pantalla de la orden, que va pegada al cristal del
   aparato. Con la lente encima se lee como el sistema encendido; hecha
   glifos, sus zonas claras y oscuras dibujan la interfaz en caracteres. */
const INTERFAZ = '/pos/pantalla-v1.webp';
const GLIFOS = ' .,:;-=+*x%#@';

const VERTICE = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENTO = /* glsl */ `
  precision highp float;
  uniform sampler2D tEscena;
  uniform sampler2D tAtlas;
  uniform vec2 uRes;
  uniform vec2 uCelda;
  uniform float uN;
  uniform float uTime;
  uniform vec2 uLente;
  uniform float uLenteOn;
  uniform float uRevela;
  uniform float uBarrido;
  uniform vec3 uTinta;
  uniform vec3 uAcento;
  varying vec2 vUv;

  float hash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
  float ruido(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  /* ACES aproximado + codificación sRGB. La escena se pintó en lineal a una
     textura; lo que sale de aquí va directo a la pantalla. */
  vec3 revelar(vec3 c) {
    c *= 1.05;
    c = clamp((c * (2.51 * c + 0.03)) / (c * (2.43 * c + 0.59) + 0.14), 0.0, 1.0);
    return pow(c, vec3(1.0 / 2.2));
  }

  void main() {
    vec2 fc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
    vec2 celda = floor(fc / uCelda);
    vec2 dentro = fract(fc / uCelda);
    vec2 centro = (celda + 0.5) * uCelda;
    vec2 uvc = vec2(centro.x / uRes.x, 1.0 - centro.y / uRes.y);

    /* Cinco muestras por celda. Con una sola, al girar el modelo los glifos
       del borde parpadean entre dos caracteres en cada fotograma. */
    vec2 d = uCelda / uRes * 0.27;
    vec4 s = (texture2D(tEscena, uvc)
      + texture2D(tEscena, uvc + vec2(d.x, d.y))
      + texture2D(tEscena, uvc + vec2(-d.x, d.y))
      + texture2D(tEscena, uvc + vec2(d.x, -d.y))
      + texture2D(tEscena, uvc - d)) * 0.2;
    vec3 visto = revelar(s.rgb);
    float lum = dot(visto, vec3(0.299, 0.587, 0.114));
    float cuerpo = smoothstep(0.02, 0.5, s.a);

    /* Fuera del objeto, una marea tenue: el fondo también está hecho de
       letras, pero casi no se ve. */
    vec2 p = centro / uRes.y;
    float n = ruido(p * 3.2 + vec2(uTime * 0.05, -uTime * 0.035));
    float marea = smoothstep(0.52, 0.95, (0.5 + 0.5 * sin((p.x * 2.1 + p.y * 3.3 + n * 3.0) * 3.14159 + uTime * 0.3)) * (0.45 + 0.8 * n));

    /* La raíz abre las sombras: sin ella el cuerpo oscuro del aparato cae
       en los dos glifos más ligeros y desaparece. */
    float nivel = mix(marea * 0.42, 0.24 + pow(lum, 0.62) * 0.76, cuerpo);
    float tic = floor(uTime * 1.4 + hash(celda) * 7.0);
    nivel = clamp(nivel + (hash(celda + tic) - 0.5) * 0.07 * step(0.06, nivel), 0.0, 1.0);
    float idx = floor(nivel * (uN - 1.0) + 0.5);
    float g = texture2D(tAtlas, vec2((idx + dentro.x) / uN, dentro.y)).r;

    vec3 tinta = mix(uTinta, uAcento, cuerpo * (1.0 - smoothstep(0.2, 0.62, lum)));
    tinta = mix(tinta, vec3(0.93, 0.95, 1.0), cuerpo * smoothstep(0.5, 0.9, lum));
    float aAscii = g * mix(0.16 + 0.5 * marea, 0.62 + 0.38 * lum, cuerpo);

    /* La lente del cursor y el barrido automático. */
    float dl = distance(fc, uLente) / uRes.y;
    float lente = uLenteOn * (1.0 - smoothstep(0.15, 0.2, dl));
    float eje = (fc.x / uRes.x) * 0.72 + (fc.y / uRes.y) * 0.28;
    float banda = 1.0 - smoothstep(0.0, 0.16, abs(eje - uBarrido));
    float m = clamp(max(max(lente, banda), uRevela), 0.0, 1.0);

    vec4 r = texture2D(tEscena, vUv);
    vec3 real = revelar(r.rgb);
    /* El filo de la lente y de la banda, en azul: se nota dónde termina el
       dibujo y dónde empieza el objeto. */
    float filo = uLenteOn * (smoothstep(0.14, 0.17, dl) - smoothstep(0.17, 0.2, dl)) * 0.6;

    /* El objeto real solo sustituye a los glifos DONDE hay objeto: fuera de
       él la marea de caracteres sigue ahí, también bajo la lente. */
    float mo = m * smoothstep(0.0, 0.9, r.a);
    vec3 col = tinta * aAscii * (1.0 - mo) + real * mo + uAcento * filo * 0.5;
    float a = aAscii * (1.0 - mo) + mo + filo * 0.35;
    gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
  }
`;

function Escena({ celda, quieto, progreso }) {
  const { gl, size, camera, scene } = useThree();
  const { scene: modelo } = useGLTF(MODELO, false, true);
  const interfaz = useTexture(INTERFAZ);
  interfaz.colorSpace = THREE.SRGBColorSpace;
  interfaz.anisotropy = 8;
  const grupo = useRef(null);
  const lente = useRef({ x: -9999, y: -9999, on: 0, objetivo: 0, px: 0, py: 0 });

  /* Entorno de estudio generado en código: sin él el metal del modelo no
     refleja nada y se ve de plástico. No se descarga ningún HDR. */
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = entorno;
    /* A media intensidad: entero, la pantalla de cristal refleja el estudio
       y se pone blanca, que es justo lo contrario de una pantalla apagada. */
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      entorno.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  const dpr = gl.getPixelRatio();
  /* Media precisión si el aparato sabe pintar en ella; si no, ocho bits. En
     ocho bits las sombras del metal hacen bandas, pero se ve, que es mejor
     que un lienzo negro en un teléfono viejo. */
  const destino = useMemo(() => {
    const flotante = gl.extensions.has('EXT_color_buffer_float') || gl.extensions.has('EXT_color_buffer_half_float');
    return new THREE.WebGLRenderTarget(4, 4, {
      samples: 4,
      type: flotante ? THREE.HalfFloatType : THREE.UnsignedByteType,
      depthBuffer: true,
    });
  }, [gl]);
  const post = useMemo(() => {
    const escena = new THREE.Scene();
    const camara = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTICE,
      fragmentShader: FRAGMENTO,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      uniforms: {
        tEscena: { value: destino.texture },
        tAtlas: { value: null },
        uRes: { value: new THREE.Vector2(1, 1) },
        uCelda: { value: new THREE.Vector2(8, 13) },
        uN: { value: GLIFOS.length },
        uTime: { value: 0 },
        uLente: { value: new THREE.Vector2(-9999, -9999) },
        uLenteOn: { value: 0 },
        uRevela: { value: 0 },
        uBarrido: { value: -1 },
        uTinta: { value: new THREE.Color('#8f97a6') },
        uAcento: { value: new THREE.Color('#2f7dff') },
      },
    });
    const plano = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    plano.frustumCulled = false;
    escena.add(plano);
    return { escena, camara, material };
  }, [destino]);

  /* El atlas de glifos, y otra vez cuando llega la tipografía. */
  useEffect(() => {
    const alto = Math.round(celda * dpr);
    const ancho = Math.round(celda * 0.6 * dpr);
    const hacer = () => {
      const t = new THREE.CanvasTexture(crearAtlas(GLIFOS, ancho, alto));
      t.flipY = false;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      post.material.uniforms.tAtlas.value?.dispose?.();
      post.material.uniforms.tAtlas.value = t;
      post.material.uniforms.uCelda.value.set(ancho, alto);
    };
    hacer();
    let vivo = true;
    document.fonts?.load?.('600 16px "Geist Mono Variable"').then(() => vivo && hacer());
    return () => {
      vivo = false;
    };
  }, [celda, dpr, post]);

  useEffect(() => {
    const w = Math.max(2, Math.round(size.width * dpr));
    const h = Math.max(2, Math.round(size.height * dpr));
    destino.setSize(w, h);
    post.material.uniforms.uRes.value.set(w, h);
  }, [size, dpr, destino, post]);

  useEffect(() => () => destino.dispose(), [destino]);

  /* El cursor se escucha en la ventana: el lienzo va detrás del texto. */
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const lienzo = gl.domElement;
    const mover = (e) => {
      const b = lienzo.getBoundingClientRect();
      const l = lente.current;
      l.x = (e.clientX - b.left) * dpr;
      l.y = (e.clientY - b.top) * dpr;
      l.objetivo = e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom ? 1 : 0;
      l.px = ((e.clientX - b.left) / b.width) * 2 - 1;
      l.py = ((e.clientY - b.top) / b.height) * 2 - 1;
    };
    window.addEventListener('pointermove', mover, { passive: true });
    return () => window.removeEventListener('pointermove', mover);
  }, [gl, dpr]);

  useFrame((estado, delta) => {
    const t = quieto ? 2.4 : estado.clock.elapsedTime;
    const u = post.material.uniforms;
    const l = lente.current;
    l.on += (l.objetivo - l.on) * Math.min(1, delta * 7);

    if (grupo.current) {
      const giro = Math.sin(t * 0.33) * 0.36 + 0.3;
      grupo.current.rotation.y += (giro + l.px * l.on * 0.3 - grupo.current.rotation.y) * Math.min(1, delta * 3);
      grupo.current.rotation.x += (0.06 + l.py * l.on * 0.1 - grupo.current.rotation.x) * Math.min(1, delta * 3);
      grupo.current.position.y = Math.sin(t * 0.8) * 0.035 - 0.12;
    }

    u.uTime.value = t;
    u.uLente.value.set(l.x, l.y);
    u.uLenteOn.value = l.on;
    u.uRevela.value = progreso.current;
    /* El barrido cruza en 2.6 s y descansa hasta completar un ciclo de 7. */
    const ciclo = (t % 7) / 2.6;
    u.uBarrido.value = quieto ? 0.56 : ciclo < 1 ? -0.2 + ciclo * 1.4 : -1;

    gl.setRenderTarget(destino);
    gl.setClearColor(0x000000, 0);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.clear();
    gl.render(post.escena, post.camara);
  }, 1);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={3.2} />
      <directionalLight position={[-4, 1.5, -2]} intensity={2.2} color="#2f7dff" />
      <pointLight position={[0, -1.2, 2.4]} intensity={8} color="#0a66ff" distance={7} />
      <group ref={grupo} scale={1.08} position={[0.42, 0, 0]}>
        <primitive object={modelo} />
        {/* El plano de la interfaz. Su sitio, su tamaño y su inclinación
            salen de medir la cara de la pantalla en la geometría del modelo:
            centro, ancho × alto y los 43.6° que está echada hacia atrás. */}
        <mesh position={[-0.2879, 0.3125, 0.2236]} rotation={[-0.7616, 0, 0]}>
          <planeGeometry args={[1.2, 0.75]} />
          <meshStandardMaterial color="#000000" emissive="#ffffff" emissiveMap={interfaz} emissiveIntensity={1.25} roughness={0.22} metalness={0} />
        </mesh>
      </group>
    </>
  );
}

/* Si WebGL falla —controlador viejo, contexto perdido— la portada se queda
   sin terminal y con su texto intacto. Nada de pantalla en blanco. */
class Barrera extends Component {
  constructor(props) {
    super(props);
    this.state = { roto: false };
  }
  static getDerivedStateFromError() {
    return { roto: true };
  }
  render() {
    return this.state.roto ? null : this.props.children;
  }
}

export default function TerminalAscii({ sinMovimiento = false, compacto = false }) {
  const caja = useRef(null);
  const progreso = useRef(0);
  const [aLaVista, setALaVista] = useState(true);
  const [pestana, setPestana] = useState(true);

  useEffect(() => {
    const nodo = caja.current;
    if (!nodo) return undefined;
    const io = new IntersectionObserver(([e]) => setALaVista(e.isIntersecting), { threshold: 0.02 });
    io.observe(nodo);
    const visible = () => setPestana(!document.hidden);
    document.addEventListener('visibilitychange', visible);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', visible);
    };
  }, []);

  const corre = aLaVista && pestana && !sinMovimiento;

  return (
    <div ref={caja} className="terminal-ascii" aria-hidden="true">
      <Barrera>
        <Canvas
          dpr={compacto ? [1, 1.25] : [1, 1.5]}
          frameloop={corre ? 'always' : 'demand'}
          gl={{ antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' }}
          camera={{ fov: 27, position: [0, 0.5, 6.4], near: 0.5, far: 30 }}
          onCreated={({ camera }) => camera.lookAt(0, -0.05, 0)}
        >
          <Suspense fallback={null}>
            <Escena celda={compacto ? 10 : 12} quieto={sinMovimiento} progreso={progreso} />
          </Suspense>
        </Canvas>
      </Barrera>
    </div>
  );
}

useGLTF.preload(MODELO, false, true);
useTexture.preload(INTERFAZ);
