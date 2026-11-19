import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Texture } from 'ogl';

import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * ============================================================
 * CAMPO ASCII — un fondo hecho de caracteres
 * ============================================================
 *
 * Parte de la idea de `GradientASCII` de React Bits (MIT + Commons Clause):
 * un atlas de glifos en una textura y un solo shader a pantalla completa que,
 * por cada celda, mide la luz de un campo y elige el carácter que le toca.
 * Aquí está reescrito para esta base de código y bastante más corto:
 *
 *   · usa `ogl`, que el sitio ya carga para el Scanner: cero dependencias
 *   · el campo es una marea lenta en diagonal, no un amanecer: tiene que
 *     quedarse DETRÁS del contenido, insinuado, y encenderse solo cerca del
 *     cursor. Es presencia, no espectáculo
 *   · se pausa fuera de pantalla y con la pestaña oculta
 *   · con `prefers-reduced-motion` pinta un fotograma y no arranca el bucle
 *
 * POR QUÉ UN SHADER Y NO `fillText`
 * Un campo de 160×45 celdas son siete mil glifos. Pintarlos con canvas 2D en
 * cada fotograma se come el hilo principal de un teléfono; aquí es UNA
 * llamada de dibujo y el trabajo lo hace la GPU.
 */

const VERTICE = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAGMENTO = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uCelda;
uniform sampler2D uAtlas;
uniform float uN;
uniform vec3 uColor;
uniform vec3 uAcento;
uniform vec2 uPuntero;
uniform float uPunteroOn;
uniform float uFuerza;
uniform float uDensidad;
out vec4 frag;

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
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * ruido(p); p = p * 2.03 + 17.0; a *= 0.5; }
  return v;
}

void main() {
  /* Origen arriba a la izquierda, como el lienzo del atlas: así el glifo no
     sale volteado y no hay que acordarse de qué eje va al revés. */
  vec2 fc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 celda = floor(fc / uCelda);
  vec2 dentro = fract(fc / uCelda);
  vec2 centro = (celda + 0.5) * uCelda;
  vec2 p = centro / uRes.y;

  /* La marea: bandas en diagonal deformadas por ruido, que se desplazan
     despacio. El umbral alto deja la mayor parte del campo casi a oscuras. */
  float n = fbm(p * 1.7 + vec2(uTime * 0.045, -uTime * 0.03));
  float ondas = 0.5 + 0.5 * sin((p.x * 1.9 + p.y * 3.1 + n * 3.2) * 3.14159 + uTime * 0.32);
  float v = smoothstep(1.0 - uDensidad, 1.0, ondas * (0.5 + 0.72 * n));

  /* El cursor enciende lo que tiene cerca. */
  float d = distance(centro, uPuntero) / uRes.y;
  float halo = uPunteroOn * exp(-d * d * 34.0);
  float lum = clamp(v + halo * 0.85, 0.0, 1.0);

  /* Cada celda parpadea de carácter de vez en cuando, cada una a su ritmo:
     sin esto el campo se lee como una textura y no como letras. */
  float tic = floor(uTime * 1.6 + hash(celda) * 9.0);
  float temblor = (hash(celda + tic) - 0.5) * 0.16;
  float idx = floor(clamp(lum + temblor * step(0.08, lum), 0.0, 1.0) * (uN - 1.0) + 0.5);

  float a = texture(uAtlas, vec2((idx + dentro.x) / uN, dentro.y)).r;
  vec3 col = mix(uColor, uAcento, clamp(smoothstep(0.5, 1.0, lum) * 0.85 + halo, 0.0, 1.0));
  float alfa = a * (0.22 + 0.78 * lum) * uFuerza;
  frag = vec4(col * alfa, alfa);
}
`;

function hexARgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
}

/** Dibuja los glifos en fila en un lienzo. Se supersamplea ×2 para que el
 *  carácter aguante el filtrado lineal sin emborronarse. */
export function crearAtlas(caracteres, anchoCelda, altoCelda) {
  const escala = 2;
  const lienzo = document.createElement('canvas');
  lienzo.width = Math.ceil(anchoCelda * escala) * caracteres.length;
  lienzo.height = Math.ceil(altoCelda * escala);
  const ctx = lienzo.getContext('2d');
  const cw = lienzo.width / caracteres.length;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, lienzo.width, lienzo.height);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${lienzo.height * 0.86}px "Geist Mono Variable", ui-monospace, Menlo, Consolas, monospace`;
  for (let i = 0; i < caracteres.length; i += 1) {
    ctx.fillText(caracteres[i], cw * (i + 0.5), lienzo.height * 0.54);
  }
  return lienzo;
}

export function CampoAscii({
  className = '',
  caracteres = ' .:-=+*#%@',
  celda = 15,
  color = '#8b919d',
  acento = '#0a66ff',
  fuerza = 0.5,
  densidad = 0.55,
  velocidad = 1,
  maxDpr = 1.5,
}) {
  const caja = useRef(null);
  const sinMovimiento = useReducedMotion();

  useEffect(() => {
    const nodo = caja.current;
    if (!nodo) return undefined;

    let renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, maxDpr),
      });
    } catch {
      /* Sin WebGL no hay campo, y no pasa nada: es un fondo. */
      return undefined;
    }
    const { gl } = renderer;
    if (!gl || !(gl instanceof WebGL2RenderingContext)) return undefined;

    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.cssText = 'display:block;width:100%;height:100%';
    nodo.appendChild(gl.canvas);

    const dpr = renderer.dpr;
    const altoCelda = Math.round(celda * dpr);
    const anchoCelda = Math.round(celda * 0.6 * dpr);

    const textura = new Texture(gl, {
      image: crearAtlas(caracteres, anchoCelda, altoCelda),
      generateMipmaps: false,
      flipY: false,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });

    const programa = new Program(gl, {
      vertex: VERTICE,
      fragment: FRAGMENTO,
      transparent: true,
      uniforms: {
        uRes: { value: [1, 1] },
        uTime: { value: 0 },
        uCelda: { value: [anchoCelda, altoCelda] },
        uAtlas: { value: textura },
        uN: { value: caracteres.length },
        uColor: { value: hexARgb(color) },
        uAcento: { value: hexARgb(acento) },
        uPuntero: { value: [-9999, -9999] },
        uPunteroOn: { value: 0 },
        uFuerza: { value: fuerza },
        uDensidad: { value: densidad },
      },
    });
    const malla = new Mesh(gl, { geometry: new Triangle(gl), program: programa });

    /* La tipografía puede llegar después del primer pintado. Cuando llega se
       rehace el atlas: si no, el campo se quedaría con la del sistema. */
    let vivo = true;
    document.fonts?.load?.('600 16px "Geist Mono Variable"').then(() => {
      if (!vivo) return;
      textura.image = crearAtlas(caracteres, anchoCelda, altoCelda);
      textura.needsUpdate = true;
      pintar();
    });

    const medir = () => {
      const { width, height } = nodo.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      programa.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
      pintar();
    };

    let t0 = performance.now();
    let acumulado = 0;
    function pintar() {
      programa.uniforms.uTime.value = acumulado;
      renderer.render({ scene: malla });
    }

    let raf = 0;
    let aLaVista = false;
    let pestana = !document.hidden;
    const bucle = (ahora) => {
      acumulado += ((ahora - t0) / 1000) * velocidad;
      t0 = ahora;
      pintar();
      raf = requestAnimationFrame(bucle);
    };
    const revisar = () => {
      const debe = aLaVista && pestana && !sinMovimiento;
      if (debe && !raf) {
        t0 = performance.now();
        raf = requestAnimationFrame(bucle);
      } else if (!debe && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const ro = new ResizeObserver(medir);
    ro.observe(nodo);
    const io = new IntersectionObserver(([e]) => {
      aLaVista = e.isIntersecting;
      revisar();
    });
    io.observe(nodo);
    const alCambiar = () => {
      pestana = !document.hidden;
      revisar();
    };
    document.addEventListener('visibilitychange', alCambiar);

    /* El puntero se escucha en la ventana y no en el lienzo: el campo va
       detrás del contenido y con `pointer-events: none`, así que nunca
       recibiría el evento. */
    const alMover = (e) => {
      const b = nodo.getBoundingClientRect();
      const dentro = e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom;
      programa.uniforms.uPunteroOn.value = dentro ? 1 : 0;
      programa.uniforms.uPuntero.value = [(e.clientX - b.left) * dpr, (e.clientY - b.top) * dpr];
      if (!raf) pintar();
    };
    const fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fino) window.addEventListener('pointermove', alMover, { passive: true });

    medir();

    return () => {
      vivo = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', alCambiar);
      window.removeEventListener('pointermove', alMover);
      gl.canvas.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [caracteres, celda, color, acento, fuerza, densidad, velocidad, maxDpr, sinMovimiento]);

  return <div ref={caja} className={`campo-ascii ${className}`} aria-hidden="true" />;
}
