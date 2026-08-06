/**
 * MH ASTRAL OS — el sistema operativo que corre dentro de la pantalla de la
 * laptop. Se dibuja en un canvas 2D y se mapea como textura.
 *
 * Tres cosas viven aquí:
 *
 *   escritorio  fondo con el monograma y su reflejo, barra de tareas con las
 *               herramientas del stack, y un par de paneles vivos
 *   ventana     el navegador que se abre desde la barra hasta llenar la
 *               pantalla: es la transición de entrada a la web, y al revés
 *               la de salida
 *   terminal    lo que abre el clic en la laptop; lluvia de caracteres y el
 *               arranque de la web, para que sea una aplicación del mismo
 *               sistema y no otra pantalla distinta
 */

const W = 1024;
/* El alto se ajusta a la proporción real de la pantalla del modelo en cuanto
   la escena la mide: si el lienzo no tiene su misma forma, el dibujo sale
   estirado y con los bordes fuera de cuadro. Hay una sola laptop, así que
   vive en el módulo y todas las funciones de dibujo lo leen al ejecutarse. */
let H = 640;

const BAR = 54; // alto de la barra de tareas
const ACCENTS = ['#ff684f', '#ceff3d', '#5e63ff', '#36d7d1', '#f5a524'];

/* El stack, tal cual se usa. El dibujo es una pastilla con el color de cada
   herramienta: a este tamaño un logo fiel no se distinguiría igual. */
const DOCK = [
  { id: 'py', label: 'Py', bg: '#2b5b84', fg: '#ffd43b' },
  { id: 'ts', label: 'TS', bg: '#3178c6', fg: '#ffffff' },
  { id: 'react', label: '', bg: '#0d2b36', fg: '#61dafb' },
  { id: 'node', label: 'N', bg: '#3c873a', fg: '#e8ffe8' },
  { id: 'java', label: 'J', bg: '#c9541b', fg: '#ffffff' },
  { id: 'c', label: 'C', bg: '#5a7fa8', fg: '#ffffff' },
  { id: 'pg', label: 'PG', bg: '#31648c', fg: '#dcecff' },
  { id: 'git', label: 'git', bg: '#c0392b', fg: '#ffffff' },
];

const RAIN_CHARS = 'MHASTRAL01アイウエオカキクケコサシスセソタチツテト<>{}[]/\\$#@%&*+=';

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/* ---- Piezas del escritorio --------------------------------------------- */

function drawWallpaper(ctx, logo, time) {
  const bg = ctx.createLinearGradient(0, 0, W * 0.6, H);
  bg.addColorStop(0, '#050d2a');
  bg.addColorStop(0.5, '#0b1c52');
  bg.addColorStop(1, '#040918');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  /* Halo detrás del monograma, como el brillo del fondo de Windows. */
  const halo = ctx.createRadialGradient(W / 2, H * 0.42, 20, W / 2, H * 0.42, 380);
  halo.addColorStop(0, 'rgba(90, 150, 255, 0.30)');
  halo.addColorStop(1, 'rgba(90, 150, 255, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  if (logo?.complete && logo.naturalWidth) {
    const lw = 300;
    const lh = lw * (logo.naturalHeight / logo.naturalWidth);
    const lx = (W - lw) / 2;
    const ly = H * 0.42 - lh * 0.62;

    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.drawImage(logo, lx, ly, lw, lh);

    /* Reflejo: la misma imagen volteada y desvanecida hacia abajo. */
    ctx.globalAlpha = 0.16;
    ctx.translate(0, (ly + lh) * 2 + 12);
    ctx.scale(1, -1);
    ctx.drawImage(logo, lx, ly, lw, lh);
    ctx.restore();

    const fade = ctx.createLinearGradient(0, ly + lh, 0, ly + lh * 2 + 12);
    fade.addColorStop(0, 'rgba(5, 13, 42, 0)');
    fade.addColorStop(1, 'rgba(5, 13, 42, 1)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, ly + lh, W, lh + 14);
  }

  /* Trama muy fina, para que el fondo no quede plano. */
  ctx.strokeStyle = 'rgba(150, 190, 255, 0.045)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 48) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 48) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  ctx.fillStyle = 'rgba(220, 232, 255, 0.5)';
  ctx.font = '700 13px ui-sans-serif, system-ui, sans-serif';
  ctx.textBaseline = 'top';
  ctx.fillText('MH ASTRAL OS', 22, 20);
  ctx.fillStyle = 'rgba(206, 255, 61, 0.85)';
  ctx.font = '700 11px ui-monospace, monospace';
  ctx.fillText(`${Math.sin(time * 3) > 0 ? '●' : '○'} EN LÍNEA`, 22, 40);
}

function drawReactMark(ctx, cx, cy, r, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 3; i += 1) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 3);
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.38, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.17, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTaskbar(ctx, time, highlight) {
  const y = H - BAR;
  ctx.fillStyle = 'rgba(6, 12, 32, 0.72)';
  ctx.fillRect(0, y, W, BAR);
  ctx.fillStyle = 'rgba(150, 190, 255, 0.18)';
  ctx.fillRect(0, y, W, 1);

  const size = 34;
  const gap = 12;
  const total = DOCK.length * size + (DOCK.length - 1) * gap;
  const startX = (W - total) / 2;

  DOCK.forEach((app, i) => {
    const x = startX + i * (size + gap);
    /* El primero es el navegador: rebota justo antes de abrirse. */
    const bounce = i === 0 ? Math.max(0, Math.sin(time * 6)) * highlight * 6 : 0;
    const iy = y + (BAR - size) / 2 - bounce;

    ctx.fillStyle = app.bg;
    roundRect(ctx, x, iy, size, size, 9);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (app.id === 'react') {
      drawReactMark(ctx, x + size / 2, iy + size / 2, size * 0.34, app.fg);
    } else {
      ctx.fillStyle = app.fg;
      ctx.font = `800 ${app.label.length > 2 ? 12 : 15}px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(app.label, x + size / 2, iy + size / 2 + 1);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
    }

    if (i < 3) {
      ctx.fillStyle = 'rgba(206, 255, 61, 0.9)';
      ctx.beginPath();
      ctx.arc(x + size / 2, y + BAR - 6, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.fillStyle = 'rgba(220, 232, 255, 0.62)';
  ctx.font = '700 12px ui-monospace, monospace';
  ctx.textBaseline = 'middle';
  const mins = String(Math.floor(time * 6) % 60).padStart(2, '0');
  ctx.fillText(`09:${mins}`, W - 62, y + BAR / 2);
  ctx.textBaseline = 'top';
}

/* Paneles del escritorio: dan señal de vida sin pedir protagonismo. */
function drawDesktopPanels(ctx, time) {
  const px = W - 286;
  const py = 74;
  const pw = 264;

  ctx.fillStyle = 'rgba(10, 22, 60, 0.66)';
  roundRect(ctx, px, py, pw, 132, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(150, 190, 255, 0.22)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = 'rgba(200, 218, 255, 0.55)';
  ctx.font = '800 10px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('PROYECTOS EN LÍNEA', px + 16, py + 16);

  ctx.fillStyle = '#eef3ff';
  ctx.font = '700 34px ui-sans-serif, system-ui, sans-serif';
  ctx.fillText('13', px + 16, py + 36);

  for (let i = 0; i < 9; i += 1) {
    const h = 12 + (Math.sin(time * 1.4 + i * 0.8) * 0.5 + 0.5) * 34;
    ctx.fillStyle = i === 8 ? '#ceff3d' : 'rgba(140, 175, 255, 0.42)';
    roundRect(ctx, px + 16 + i * 27, py + 118 - h, 16, h, 3);
    ctx.fill();
  }

  const mods = ['WEB', 'POS', 'CRM', 'FLUJOS', 'SOFTWARE'];
  mods.forEach((m, i) => {
    const my = py + 152 + i * 34;
    ctx.fillStyle = 'rgba(10, 22, 60, 0.6)';
    roundRect(ctx, px, my, pw, 26, 7);
    ctx.fill();
    ctx.fillStyle = ACCENTS[i];
    ctx.beginPath();
    ctx.arc(px + 15, my + 13, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(228, 236, 255, 0.85)';
    ctx.font = '700 11px ui-sans-serif, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(m, px + 28, my + 14);
    ctx.fillStyle = Math.sin(time * 1.3 + i) > -0.4 ? 'rgba(206,255,61,0.9)' : 'rgba(200,214,255,0.3)';
    ctx.font = '700 9px ui-monospace, monospace';
    ctx.fillText(Math.sin(time * 1.3 + i) > -0.4 ? 'OK' : '··', px + pw - 34, my + 14);
    ctx.textBaseline = 'top';
  });
}

/* ---- La ventana del navegador ------------------------------------------ */

/** Miniatura del inicio del sitio, dibujada dentro de la ventana. */
function drawSitePreview(ctx, x, y, w, h, logo, time) {
  ctx.save();
  roundRect(ctx, x, y, w, h, 0);
  ctx.clip();

  const bg = ctx.createLinearGradient(x, y, x + w, y + h);
  bg.addColorStop(0, '#0a0818');
  bg.addColorStop(1, '#120b2e');
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);

  /* Las bandas del fondo del hero. */
  ctx.save();
  ctx.globalAlpha = 0.75;
  for (let i = 0; i < 5; i += 1) {
    const grad = ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, 'rgba(26, 20, 211, 0)');
    grad.addColorStop(0.5, i % 2 ? 'rgba(90, 220, 255, 0.5)' : 'rgba(120, 90, 255, 0.55)');
    grad.addColorStop(1, 'rgba(26, 20, 211, 0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = Math.max(1, h * 0.012);
    ctx.beginPath();
    for (let px = 0; px <= w; px += 8) {
      const py = y + h * (0.42 + i * 0.09) + Math.sin(px / (w * 0.16) + time * 0.6 + i) * h * 0.05;
      if (px === 0) ctx.moveTo(x + px, py);
      else ctx.lineTo(x + px, py);
    }
    ctx.stroke();
  }
  ctx.restore();

  const u = h / 100; // unidad relativa: la miniatura escala con la ventana
  /* Margen de seguridad ancho: la pantalla del modelo es más apaisada que el
     viewport, así que al cubrirlo se pierde una franja a cada lado. Todo lo
     que haya que leer vive dentro de este margen. */
  const m = x + w * 0.15;

  /* Barra de navegación del sitio. */
  if (logo?.complete && logo.naturalWidth) {
    const s = u * 7;
    ctx.drawImage(logo, m, y + u * 4, s, s * (logo.naturalHeight / logo.naturalWidth));
  }
  ctx.fillStyle = 'rgba(240, 242, 255, 0.85)';
  ctx.font = `800 ${u * 3.4}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillText('MH ASTRAL', m + u * 9, y + u * 5);

  /* Los enlaces se reparten midiéndolos: a ojo se solapaban entre sí. */
  const links = ['Servicios', 'Trabajo', 'Proceso', 'Contacto'];
  ctx.font = `600 ${u * 3.2}px ui-sans-serif, system-ui, sans-serif`;
  const widths = links.map((t) => ctx.measureText(t).width);
  const spacing = u * 5;
  let lx = x + w * 0.52 - (widths.reduce((a, v) => a + v, 0) + spacing * (links.length - 1)) / 2;
  links.forEach((t, i) => {
    ctx.fillStyle = 'rgba(220, 226, 255, 0.62)';
    ctx.fillText(t, lx, y + u * 5.6);
    lx += widths[i] + spacing;
  });

  ctx.fillStyle = '#ceff3d';
  roundRect(ctx, x + w - w * 0.15 - u * 20, y + u * 3.4, u * 20, u * 8, u * 4);
  ctx.fill();

  /* Titular. */
  ctx.font = `800 ${u * 10}px ui-sans-serif, system-ui, sans-serif`;
  ctx.fillStyle = '#f4f3fb';
  ctx.fillText('Diseño lo que', m, y + u * 26);
  ctx.fillText('tus clientes', m, y + u * 37);
  ctx.fillStyle = '#ff684f';
  ctx.fillText('ven.', m, y + u * 48);
  ctx.fillStyle = '#f4f3fb';
  ctx.fillText('Construyo lo que', m, y + u * 59);
  ctx.fillStyle = '#ceff3d';
  ctx.fillText('necesita.', m, y + u * 70);

  /* La pastilla se mide contra su texto: a ojo se le salía. */
  const cta = 'Cuéntame tu proyecto';
  ctx.font = `700 ${u * 3.4}px ui-sans-serif, system-ui, sans-serif`;
  const ctaW = ctx.measureText(cta).width + u * 8;
  ctx.fillStyle = '#5227ff';
  roundRect(ctx, m, y + u * 83, ctaW, u * 9, u * 4.5);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.fillText(cta, m + u * 4, y + u * 87.5);
  ctx.textBaseline = 'top';

  ctx.restore();
}

/**
 * Ventana que crece desde la barra de tareas hasta llenar la pantalla.
 * `open` va de 0 (cerrada, en la barra) a 1 (ocupando todo).
 */
function drawWindow(ctx, open, logo, time) {
  if (open <= 0.001) return;

  const size = 34;
  const gap = 12;
  const startX = (W - (DOCK.length * size + (DOCK.length - 1) * gap)) / 2;
  const from = { x: startX, y: H - BAR + 10, w: size, h: size };
  const to = { x: 0, y: 0, w: W, h: H };

  const x = from.x + (to.x - from.x) * open;
  const y = from.y + (to.y - from.y) * open;
  const w = from.w + (to.w - from.w) * open;
  const h = from.h + (to.h - from.h) * open;
  const radius = 12 * (1 - open) + 2;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = 40 * open;
  ctx.shadowOffsetY = 10 * open;
  ctx.fillStyle = '#0a0818';
  roundRect(ctx, x, y, w, h, radius);
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRect(ctx, x, y, w, h, radius);
  ctx.clip();

  const chrome = Math.min(36, h * 0.09);
  drawSitePreview(ctx, x, y + chrome, w, Math.max(1, h - chrome), logo, time);

  /* Cromo de la ventana. */
  ctx.fillStyle = '#161a24';
  ctx.fillRect(x, y, w, chrome);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(x, y + chrome - 1, w, 1);

  if (chrome > 14) {
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x + 16 + i * 15, y + chrome / 2, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    const bw = Math.min(340, w * 0.42);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    roundRect(ctx, x + (w - bw) / 2, y + chrome * 0.22, bw, chrome * 0.56, chrome * 0.28);
    ctx.fill();

    if (logo?.complete && logo.naturalWidth) {
      const s = chrome * 0.42;
      ctx.drawImage(logo, x + (w - bw) / 2 + 8, y + chrome / 2 - s / 2, s, s * (logo.naturalHeight / logo.naturalWidth));
    }
    ctx.fillStyle = 'rgba(226, 232, 255, 0.8)';
    ctx.font = `600 ${Math.max(9, chrome * 0.34)}px ui-monospace, monospace`;
    ctx.textBaseline = 'middle';
    ctx.fillText('mh-astral-systems.com', x + (w - bw) / 2 + 8 + chrome * 0.5, y + chrome / 2);
    ctx.textBaseline = 'top';
  }

  ctx.restore();

  ctx.strokeStyle = 'rgba(150, 190, 255, 0.24)';
  ctx.lineWidth = 1;
  roundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, radius);
  ctx.stroke();
}

/* ---- La terminal -------------------------------------------------------- */

const COLUMN = 18;

function createRain(cols) {
  return Array.from({ length: cols }, (_, i) => ({
    y: ((i * 91) % 420) - 60,
    speed: 140 + ((i * 53) % 190),
    length: 6 + ((i * 7) % 11),
  }));
}

function drawTerminal(ctx, open, rain, time, delta) {
  if (open <= 0.001) return;

  const fullW = W * 0.68;
  const fullH = H * 0.6;
  const cx = W / 2;
  const cy = H * 0.46;
  const w = fullW * open;
  const h = fullH * open;
  const x = cx - w / 2;
  const y = cy - h / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 40 * open;
  ctx.fillStyle = '#02060a';
  roundRect(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRect(ctx, x, y, w, h, 10);
  ctx.clip();

  const chrome = Math.min(28, h * 0.09);
  const bodyY = y + chrome;
  const bodyH = h - chrome;

  /* Lluvia dentro de la terminal. */
  const cols = Math.ceil(w / COLUMN);
  ctx.font = '700 14px ui-monospace, monospace';
  ctx.textBaseline = 'top';
  for (let i = 0; i < cols; i += 1) {
    const col = rain[i % rain.length];
    for (let k = 0; k < col.length; k += 1) {
      const ry = bodyY + ((col.y - k * COLUMN) % (bodyH + 200));
      if (ry < bodyY - COLUMN || ry > bodyY + bodyH) continue;
      const seed = (i * 31 + k * 7 + Math.floor(time * 9 + i)) % RAIN_CHARS.length;
      ctx.fillStyle = k === 0
        ? 'rgba(232, 255, 232, 0.95)'
        : `rgba(120, 255, 140, ${Math.max(0.05, 0.6 - k / col.length)})`;
      ctx.fillText(RAIN_CHARS[seed], x + i * COLUMN + 4, ry);
    }
  }
  rain.forEach((col) => {
    col.y += col.speed * delta;
    if (col.y > bodyH + 200) col.y = -60;
  });

  /* El arranque de la web, por encima de la lluvia. */
  ctx.fillStyle = 'rgba(2, 6, 10, 0.72)';
  ctx.fillRect(x, bodyY, w, bodyH);

  const lines = [
    '> mh boot --web',
    '  montando módulos ..... ok',
    '  iniciando web ........',
  ];
  ctx.font = `600 ${Math.max(9, h * 0.036)}px ui-monospace, monospace`;
  lines.forEach((line, i) => {
    ctx.fillStyle = line.startsWith('>') ? '#ceff3d' : 'rgba(170, 255, 190, 0.85)';
    ctx.fillText(line, x + 18, bodyY + 20 + i * h * 0.062);
  });
  if (Math.sin(time * 5) > 0) {
    ctx.fillStyle = '#ceff3d';
    ctx.fillRect(x + 18, bodyY + 20 + 3 * h * 0.062, h * 0.02, h * 0.036);
  }

  /* Cromo. */
  ctx.fillStyle = '#101820';
  ctx.fillRect(x, y, w, chrome);
  if (chrome > 12) {
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x + 14 + i * 13, y + chrome / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = 'rgba(200, 255, 210, 0.7)';
    ctx.font = `700 ${Math.max(8, chrome * 0.4)}px ui-monospace, monospace`;
    ctx.textBaseline = 'middle';
    ctx.fillText('terminal — mh', x + 62, y + chrome / 2);
    ctx.textBaseline = 'top';
  }

  ctx.restore();

  ctx.strokeStyle = 'rgba(120, 255, 150, 0.3)';
  ctx.lineWidth = 1;
  roundRect(ctx, x + 0.5, y + 0.5, w - 1, h - 1, 10);
  ctx.stroke();
}

/* ---- Montaje ------------------------------------------------------------ */

export function createBrandOS(logoImage) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const rain = createRain(Math.ceil((W * 0.68) / COLUMN) + 2);
  let terminalTarget = 0;
  let terminal = 0;
  let last = 0;

  /**
   * @param {number} time   segundos desde que arrancó la escena
   * @param {number} window 0..1 — cuánto está abierta la ventana del navegador
   */
  const draw = (time, windowOpen = 0) => {
    const delta = Math.min(0.06, Math.max(0, time - last));
    last = time;

    /* La terminal abre y cierra sola, con su propia inercia. */
    terminal += (terminalTarget - terminal) * Math.min(1, delta * 7);
    if (Math.abs(terminalTarget - terminal) < 0.002) terminal = terminalTarget;

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    drawWallpaper(ctx, logoImage, time);
    drawDesktopPanels(ctx, time);
    drawTerminal(ctx, terminal, rain, time, delta);
    /* La barra se dibuja antes que la ventana: la ventana sale de ella. */
    drawTaskbar(ctx, time, windowOpen > 0 && windowOpen < 0.12 ? 1 : 0);
    drawWindow(ctx, windowOpen, logoImage, time);
  };

  /** Ajusta la forma del lienzo a la de la pantalla del modelo. */
  const setAspect = (aspect) => {
    if (!aspect || !Number.isFinite(aspect)) return false;
    const next = Math.max(360, Math.min(900, Math.round(W / aspect)));
    if (Math.abs(next - H) < 4) return false;
    H = next;
    canvas.height = H;
    return true;
  };

  /** Abre o cierra la terminal. */
  const toggleMode = () => {
    terminalTarget = terminalTarget > 0.5 ? 0 : 1;
    return terminalTarget > 0.5 ? 'terminal' : 'os';
  };

  draw(0, 0);
  return { canvas, draw, toggleMode, setAspect };
}
