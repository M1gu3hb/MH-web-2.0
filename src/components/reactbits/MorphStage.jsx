import { useEffect, useRef } from 'react';
import { Renderer, Triangle, Program, Mesh, Texture } from 'ogl';

const MODOS = { melt: 0, ripple: 1, shear: 2, swirl: 3 };

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D tCurrent;
uniform sampler2D tNext;
uniform vec2 uResolution;
uniform vec2 uCurrentSize;
uniform vec2 uNextSize;
uniform float uProgress;
uniform float uDir;
uniform int uMode;
uniform float uIntensity;
uniform float uScale;
uniform float uAberration;
uniform float uDrift;
uniform float uTime;
uniform float uReduce;
uniform vec2 uPointer;
uniform vec3 uOverlay;
uniform float uPan;

varying vec2 vUv;

const float PI = 3.14159265359;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

vec2 coverUV(vec2 uv, vec2 res, vec2 img) {
  float rA = res.x / max(res.y, 1.0);
  float iA = img.x / max(img.y, 1.0);
  vec2 s = vec2(1.0);
  float ratio = rA / max(iA, 0.0001);
  if (ratio > 1.0) {
    s.y = 1.0 / ratio;
  } else {
    s.x = ratio;
  }
  return (uv - 0.5) * s + 0.5;
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);
  float env = sin(p * PI);

  vec2 uv = vUv;

  /* El acercamiento que trae el scroll: la escena entra grande y se asienta.
     Va aqui y no en una transformacion del lienzo por fuera, porque el lienzo
     se dibuja al tamano del hueco: escalarlo fuera seria agrandar pixeles. */
  uv = (uv - 0.5) / (1.0 + 0.11 * (1.0 - uPan)) + 0.5;
  uv.y += (0.5 - uPan) * 0.022;

  uv += vec2(sin(uTime * 0.25 + uv.y * 4.0), cos(uTime * 0.22 + uv.x * 4.0)) * uDrift * 0.008;
  uv = (uv - 0.5) * (1.0 - uDrift * 0.02 * sin(uTime * 0.4)) + 0.5;

  /* Sin cruce en marcha no hay nada que mezclar: se saca la textura y se sale.
     El camino largo calcula ruido de cinco octavas dos veces por pixel y hace
     seis lecturas de textura, y estaba corriendo siempre, tambien mientras la
     escena esta quieta, que es casi todo el rato. Con p == 0 la mezcla vale
     exactamente la textura actual, asi que atajar aqui no cambia un pixel. */
  if (p <= 0.001) {
    vec3 quieta = texture2D(tCurrent, coverUV(uv, uResolution, uCurrentSize)).rgb;
    float v0 = smoothstep(1.25, 0.25, length(uv - 0.5));
    gl_FragColor = vec4(mix(quieta, uOverlay, (1.0 - v0) * 0.28), 1.0);
    return;
  }

  vec2 uvC = uv;
  vec2 uvN = uv;
  float m = smoothstep(0.0, 1.0, p);

  if (uReduce < 0.5) {
    if (uMode == 3) {
      vec2 c = uv - 0.5;
      float r = length(c);
      float ang = env * uIntensity * 3.5 * (1.0 - r);
      uvC = rot(ang) * c + 0.5;
      uvN = rot(-ang) * c + 0.5;
      m = smoothstep(0.0, 1.0, p);
    } else if (uMode == 1) {
      float d = distance(uv, uPointer);
      float ring = p * 1.6;
      float wave = sin((d - ring) * 30.0) * env;
      vec2 dir = normalize(uv - uPointer + 1e-4);
      vec2 disp = dir * wave * uIntensity * 0.25;
      uvC = uv + disp;
      uvN = uv + disp * 0.6;
      m = 1.0 - smoothstep(ring - 0.03, ring + 0.03, d);
    } else if (uMode == 2) {
      float slices = 14.0;
      float row = floor(uv.y * slices);
      float rnd = hash11(row);
      vec2 disp = vec2((rnd - 0.5) * env * uIntensity * 0.6, 0.0);
      uvC = uv + disp;
      uvN = uv + disp;
      float localX = uDir > 0.0 ? uv.x : 1.0 - uv.x;
      float th = p * 1.5 - 0.25 + (rnd - 0.5) * 0.25;
      m = 1.0 - smoothstep(th - 0.06, th + 0.06, localX);
    } else {
      float nn = fbm(uv * uScale + uTime * 0.03);
      float warp = fbm(uv * uScale * 1.7 - uTime * 0.02);
      vec2 g = vec2(nn, warp) - 0.5;
      uvC = uv + g * uIntensity * 0.5 * p;
      uvN = uv - g * uIntensity * 0.5 * (1.0 - p);
      m = smoothstep(nn - 0.15, nn + 0.15, p);
    }
  }

  vec2 sC = coverUV(uvC, uResolution, uCurrentSize);
  vec2 sN = coverUV(uvN, uResolution, uNextSize);

  float ca = uReduce < 0.5 ? uAberration * env * 0.03 : 0.0;

  vec3 colC = vec3(
    texture2D(tCurrent, sC + vec2(ca, 0.0)).r,
    texture2D(tCurrent, sC).g,
    texture2D(tCurrent, sC - vec2(ca, 0.0)).b
  );
  vec3 colN = vec3(
    texture2D(tNext, sN + vec2(ca, 0.0)).r,
    texture2D(tNext, sN).g,
    texture2D(tNext, sN - vec2(ca, 0.0)).b
  );

  vec3 col = mix(colC, colN, m);

  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  col = mix(col, uOverlay, (1.0 - vig) * 0.28);

  gl_FragColor = vec4(col, 1.0);
}
`;

function texturaVacia(gl) {
  const size = 4;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i += 1) {
    data[i * 4] = 7;
    data[i * 4 + 1] = 6;
    data[i * 4 + 2] = 15;
    data[i * 4 + 3] = 255;
  }
  return new Texture(gl, { image: data, width: size, height: size, generateMipmaps: false });
}

const hexToRgb = (hex) => {
  let h = (hex || '#000000').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * MorphStage — el morph de MorphSlider (React Bits), pero mandado por el
 * scroll en vez de por flechas o autoplay.
 *
 * De la pieza original se conserva lo que importa: el desplazamiento en GPU
 * que funde una imagen en la siguiente —fundido por ruido, anillo, tiras o
 * remolino—, la separación de canales que sube a la mitad del cruce y vuelve
 * a cero, y el balanceo que impide que la imagen quede nunca del todo quieta.
 *
 * Lo que se cambia, y por qué:
 *
 *  - Sin gsap. El progreso del cruce se lleva en el mismo bucle que ya hay,
 *    con su propia curva. Traer una librería de animación entera para
 *    interpolar un número de 0 a 1 no se sostiene.
 *  - Sin flechas, sin puntos, sin pies de foto y sin arrastre: aquí quien
 *    manda es el índice que ya calcula el recorrido de la sección.
 *  - Se añade el acercamiento del scroll dentro del propio sombreador. Hacerlo
 *    por fuera con un `transform` sería agrandar los píxeles del lienzo, que
 *    se dibuja justo al tamaño del hueco.
 *  - El bucle solo corre con la sección cerca de pantalla.
 */
export function MorphStage({
  scenes = [],
  index = 0,
  flow,
  transition = 'melt',
  duration = 0.85,
  intensity = 0.55,
  scale = 2.4,
  aberration = 0.35,
  drift = 0.4,
  overlayColor = '#05040c',
  className = '',
}) {
  const host = useRef(null);
  const opciones = useRef({});
  opciones.current = { transition, duration, intensity, scale, aberration, drift, overlayColor };

  const objetivo = useRef(index);
  objetivo.current = index;

  useEffect(() => {
    const mount = host.current;
    if (!mount || !scenes.length) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const renderer = new Renderer({
      alpha: false,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0.027, 0.024, 0.06, 1);
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    mount.appendChild(canvas);

    const texturas = scenes.map(() => texturaVacia(gl));
    const tamanos = scenes.map(() => [1, 1]);

    const o = opciones.current;
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tCurrent: { value: texturas[0] },
        tNext: { value: texturas[0] },
        uResolution: { value: [1, 1] },
        uCurrentSize: { value: tamanos[0] },
        uNextSize: { value: tamanos[0] },
        uProgress: { value: 0 },
        uDir: { value: 1 },
        uMode: { value: MODOS[o.transition] ?? 0 },
        uIntensity: { value: o.intensity },
        uScale: { value: o.scale },
        uAberration: { value: o.aberration },
        uDrift: { value: o.drift },
        uTime: { value: 0 },
        uReduce: { value: reduce ? 1 : 0 },
        uPointer: { value: [0.5, 0.5] },
        uOverlay: { value: hexToRgb(o.overlayColor) },
        uPan: { value: 1 },
      },
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let vivo = true;
    scenes.forEach((s, i) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.onload = () => {
        if (!vivo) return;
        const tex = new Texture(gl, { generateMipmaps: false });
        tex.image = img;
        texturas[i] = tex;
        tamanos[i] = [img.naturalWidth || 1, img.naturalHeight || 1];
        if (i === puesta) {
          program.uniforms.tCurrent.value = tex;
          program.uniforms.uCurrentSize.value = tamanos[i];
        }
      };
      img.src = s;
    });

    const resize = () => {
      const w = Math.max(1, mount.clientWidth);
      const h = Math.max(1, mount.clientHeight);
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    let puesta = objetivo.current;
    let cruzando = false;
    let t0 = 0;
    let destino = puesta;

    let raf = 0;
    let cerca = false;

    const loop = (now) => {
      raf = cerca ? requestAnimationFrame(loop) : 0;
      program.uniforms.uTime.value = now * 0.001;

      /* El acercamiento sigue al dedo dentro del tramo de esa tarjeta. */
      if (flow?.current) program.uniforms.uPan.value = flow.current.paso ?? 1;

      if (!cruzando && objetivo.current !== puesta) {
        destino = objetivo.current;
        program.uniforms.tCurrent.value = texturas[puesta];
        program.uniforms.uCurrentSize.value = tamanos[puesta];
        program.uniforms.tNext.value = texturas[destino];
        program.uniforms.uNextSize.value = tamanos[destino];
        program.uniforms.uDir.value = destino > puesta ? 1 : -1;
        program.uniforms.uMode.value = MODOS[opciones.current.transition] ?? 0;
        cruzando = true;
        t0 = now;
      }

      if (cruzando) {
        const dur = (reduce ? 0.3 : opciones.current.duration) * 1000;
        const t = Math.min(1, (now - t0) / dur);
        program.uniforms.uProgress.value = suave(t);
        if (t >= 1) {
          puesta = destino;
          program.uniforms.tCurrent.value = texturas[puesta];
          program.uniforms.uCurrentSize.value = tamanos[puesta];
          program.uniforms.uProgress.value = 0;
          cruzando = false;
        }
      }

      renderer.render({ scene: mesh });
    };

    const ojo = new IntersectionObserver(
      ([e]) => {
        cerca = e.isIntersecting;
        if (cerca && !raf) raf = requestAnimationFrame(loop);
      },
      { rootMargin: '25% 0px' },
    );
    ojo.observe(mount);

    return () => {
      vivo = false;
      cerca = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      ojo.disconnect();
      texturas.forEach((t) => t?.texture && gl.deleteTexture(t.texture));
      if (canvas.parentNode === mount) mount.removeChild(canvas);
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes.join('|')]);

  return <div ref={host} className={`morph-stage ${className}`.trim()} aria-hidden="true" />;
}

export default MorphStage;
