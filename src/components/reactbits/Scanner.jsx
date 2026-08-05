import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Scanner — fondo de bandas con barrido, ondas y reacción al cursor.
 * Patrón ReactBits, reescrito sobre WebGL2 nativo para no añadir OGL ni una
 * segunda copia de three al bundle. Cada prop del componente original tiene
 * su uniform y su efecto real en el shader.
 */

const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2  uResolution;
uniform float uTime;
uniform vec2  uMouse;          // en UV, -1 si no hay cursor
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform float uSpeed;
uniform float uSweepSpeed;
uniform float uSweepWidth;
uniform float uSweepFalloff;
uniform float uScale;
uniform float uFrequency;
uniform float uRipple;
uniform float uBandDensity;
uniform float uLineSharpness;
uniform float uGlow;
uniform float uVertical;        // 1 = vertical, 0 = horizontal
uniform float uColorSpread;
uniform float uBrightness;
uniform float uContrast;
uniform float uSoftness;
uniform float uVignette;
uniform float uScanline;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uOpacity;
uniform float uMouseRadius;
uniform float uMouseStrength;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * uScale;

  /* ---- Empuje del cursor -------------------------------------------- */
  float mouseField = 0.0;
  if (uMouse.x > -0.5) {
    vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0) * uScale;
    float d = length(p - m);
    mouseField = exp(-pow(d / max(uMouseRadius * uScale, 0.001), 2.0));
    p += normalize(p - m + 1e-5) * mouseField * uMouseStrength * 0.35;
  }

  /* ---- Ondas concéntricas ------------------------------------------- */
  float r = length(p);
  float ripple = sin(r * uFrequency * 6.2831 - uTime * uSpeed * 2.0) * uRipple;

  /* ---- Bandas ------------------------------------------------------- */
  float axis = mix(p.x, p.y, uVertical);
  float bands = axis * uBandDensity + ripple * 6.0 + uTime * uSpeed * 0.6;
  float wave = sin(bands);
  /* lineSharpness endurece la onda hasta volverla casi un pulso */
  float line = pow(abs(wave), max(0.05, 1.0 / max(uLineSharpness, 0.001)));
  line = 1.0 - line;
  line = smoothstep(0.0, max(uSoftness * 0.5, 0.001), line);

  /* ---- Barrido ------------------------------------------------------ */
  float axis01 = mix(uv.x, uv.y, uVertical);
  float sweepPos = fract(uTime * uSweepSpeed * 0.35);
  float sweepDist = abs(axis01 - sweepPos);
  sweepDist = min(sweepDist, 1.0 - sweepDist);
  float sweep = exp(-pow(sweepDist / max(uSweepWidth * 0.25, 0.001), uSweepFalloff));

  /* ---- Color -------------------------------------------------------- */
  float t = clamp(line * (1.0 - uColorSpread * 0.5) + axis01 * uColorSpread * 0.6 + ripple, 0.0, 1.0);
  vec3 col = mix(uColor2, uColor1, smoothstep(0.0, 1.0, t));
  col = mix(col, uColor3, clamp(sweep * (0.55 + uGlow), 0.0, 1.0));
  col += uColor3 * line * uGlow * 0.5;
  col += uColor1 * mouseField * uMouseStrength * 0.4;

  /* ---- Revelado ----------------------------------------------------- */
  col *= 0.35 + line * 0.85;
  col *= uBrightness;
  col = (col - 0.5) * uContrast + 0.5;

  /* ---- Scanline ----------------------------------------------------- */
  if (uScanline > 0.5) {
    float sl = 0.94 + 0.06 * sin(uv.y * uResolution.y * 1.6);
    col *= sl;
  }

  /* ---- Grano -------------------------------------------------------- */
  if (uGrain > 0.5) {
    float g = hash(uv * uResolution + fract(uTime) * 97.13);
    col += (g - 0.5) * uGrainIntensity;
  }

  /* ---- Viñeta ------------------------------------------------------- */
  float vig = 1.0 - uVignette * pow(length((uv - 0.5) * vec2(aspect, 1.0)) * 1.25, 2.0);
  col *= clamp(vig, 0.0, 1.0);

  fragColor = vec4(max(col, 0.0), uOpacity);
}`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function Scanner({
  color1 = '#5227FF',
  color2 = '#1e10cc',
  color3 = '#f3f2f9',
  speed = 0.5,
  sweepSpeed = 0.25,
  sweepWidth = 1.6,
  sweepFalloff = 6,
  scale = 1.5,
  frequency = 2,
  ripple = 0.22,
  bandDensity = 11,
  lineSharpness = 5.5,
  glow = 0.22,
  scanDirection = 'vertical',
  colorSpread = 0.7,
  brightness = 1.0,
  contrast = 1.15,
  softness = 1.4,
  vignette = 0.45,
  scanline = true,
  grain = true,
  grainIntensity = 0.05,
  opacity = 1.0,
  mouseInteraction = true,
  mouseRadius = 0.5,
  mouseStrength = 0.5,
  className = '',
}) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  /* Los props se leen desde un ref para no recrear el contexto WebGL en
     cada render: el bucle toma siempre el valor más reciente. */
  const props = useRef({});
  props.current = {
    color1, color2, color3, speed, sweepSpeed, sweepWidth, sweepFalloff, scale,
    frequency, ripple, bandDensity, lineSharpness, glow, scanDirection,
    colorSpread, brightness, contrast, softness, vignette, scanline, grain,
    grainIntensity, opacity, mouseInteraction, mouseRadius, mouseStrength,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'high-performance' });
    if (!gl) return undefined;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return undefined;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      if (import.meta.env.DEV) console.warn(gl.getProgramInfoLog(program));
      return undefined;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = {};
    for (const name of [
      'uResolution', 'uTime', 'uMouse', 'uColor1', 'uColor2', 'uColor3', 'uSpeed',
      'uSweepSpeed', 'uSweepWidth', 'uSweepFalloff', 'uScale', 'uFrequency', 'uRipple',
      'uBandDensity', 'uLineSharpness', 'uGlow', 'uVertical', 'uColorSpread',
      'uBrightness', 'uContrast', 'uSoftness', 'uVignette', 'uScanline', 'uGrain',
      'uGrainIntensity', 'uOpacity', 'uMouseRadius', 'uMouseStrength',
    ]) {
      U[name] = gl.getUniformLocation(program, name);
    }

    const rgb = (hex) => {
      const v = parseInt(hex.replace('#', ''), 16);
      return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
    };

    const mouse = { x: -1, y: -1 };
    const onMove = (event) => {
      if (!props.current.mouseInteraction) return;
      const b = canvas.getBoundingClientRect();
      mouse.x = (event.clientX - b.left) / b.width;
      mouse.y = 1 - (event.clientY - b.top) / b.height;
    };
    const onLeave = () => { mouse.x = -1; mouse.y = -1; };

    let width = 0;
    let height = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      const b = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(b.width * ratio));
      height = Math.max(1, Math.round(b.height * ratio));
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let frame;
    let start = performance.now();

    const render = (now) => {
      const p = props.current;
      const elapsed = reduced ? 6.5 : (now - start) / 1000;

      gl.uniform2f(U.uResolution, width, height);
      gl.uniform1f(U.uTime, elapsed);
      gl.uniform2f(U.uMouse, reduced ? -1 : mouse.x, mouse.y);
      gl.uniform3fv(U.uColor1, rgb(p.color1));
      gl.uniform3fv(U.uColor2, rgb(p.color2));
      gl.uniform3fv(U.uColor3, rgb(p.color3));
      gl.uniform1f(U.uSpeed, p.speed);
      gl.uniform1f(U.uSweepSpeed, p.sweepSpeed);
      gl.uniform1f(U.uSweepWidth, p.sweepWidth);
      gl.uniform1f(U.uSweepFalloff, p.sweepFalloff);
      gl.uniform1f(U.uScale, p.scale);
      gl.uniform1f(U.uFrequency, p.frequency);
      gl.uniform1f(U.uRipple, p.ripple);
      gl.uniform1f(U.uBandDensity, p.bandDensity);
      gl.uniform1f(U.uLineSharpness, p.lineSharpness);
      gl.uniform1f(U.uGlow, p.glow);
      gl.uniform1f(U.uVertical, p.scanDirection === 'vertical' ? 1 : 0);
      gl.uniform1f(U.uColorSpread, p.colorSpread);
      gl.uniform1f(U.uBrightness, p.brightness);
      gl.uniform1f(U.uContrast, p.contrast);
      gl.uniform1f(U.uSoftness, p.softness);
      gl.uniform1f(U.uVignette, p.vignette);
      gl.uniform1f(U.uScanline, p.scanline ? 1 : 0);
      gl.uniform1f(U.uGrain, p.grain ? 1 : 0);
      gl.uniform1f(U.uGrainIntensity, p.grainIntensity);
      gl.uniform1f(U.uOpacity, p.opacity);
      gl.uniform1f(U.uMouseRadius, p.mouseRadius);
      gl.uniform1f(U.uMouseStrength, p.mouseStrength);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      /* Con reduced motion se pinta un solo fotograma y se detiene. */
      if (!reduced) frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      start = 0;
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className={`rb-scanner ${className}`} aria-hidden="true" />;
}
