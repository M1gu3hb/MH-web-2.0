/**
 * MH ASTRAL OS — sistema operativo inventado que corre dentro de la pantalla
 * de la laptop. Se dibuja en un canvas 2D y se mapea como textura.
 *
 * No es una captura: se anima (reloj, terminal escribiendo, gráfica viva,
 * indicadores), así que la pantalla se ve encendida de verdad.
 */

const W = 1024;
const H = 640;

const ACCENTS = ['#ff684f', '#ceff3d', '#5e63ff', '#36d7d1', '#f5a524'];

const BOOT_LINES = [
  '> mh init --studio',
  '  cargando módulos ..... ok',
  '  web · pos · crm · flujos · software',
  '> mh deploy pasteleria-confetti',
  '  build 1.9s · publicado ✓',
  '> mh status --todos',
  '  13 proyectos en línea',
  '> _',
];

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function createBrandOS(logoImage) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const draw = (time) => {
    /* ---- Escritorio ---- */
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0d1220');
    bg.addColorStop(0.55, '#111a2e');
    bg.addColorStop(1, '#0a0d16');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(120,150,255,0.055)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    /* ---- Marca de agua ---- */
    if (logoImage && logoImage.complete && logoImage.naturalWidth) {
      ctx.save();
      ctx.globalAlpha = 0.07;
      const lw = 400;
      const lh = lw * (logoImage.naturalHeight / logoImage.naturalWidth);
      ctx.drawImage(logoImage, W - lw - 40, H - lh - 70, lw, lh);
      ctx.restore();
    }

    /* ---- Barra superior ---- */
    ctx.fillStyle = 'rgba(8,11,20,0.92)';
    ctx.fillRect(0, 0, W, 42);
    ctx.fillStyle = 'rgba(180,200,255,0.16)';
    ctx.fillRect(0, 41, W, 1);

    ACCENTS.slice(0, 3).forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(26 + i * 20, 21, 5.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#eef1ff';
    ctx.font = '700 17px ui-sans-serif, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('MH ASTRAL OS', 100, 22);

    ctx.fillStyle = 'rgba(206,255,61,0.95)';
    ctx.font = '700 13px ui-monospace, monospace';
    const blink = Math.sin(time * 3) > 0 ? '●' : '○';
    ctx.fillText(`${blink} EN LÍNEA`, W - 250, 22);
    ctx.fillStyle = 'rgba(238,241,255,0.72)';
    const mins = String(Math.floor(time * 6) % 60).padStart(2, '0');
    ctx.fillText(`09:${mins}`, W - 90, 22);

    /* ---- Terminal ---- */
    const tx = 46; const ty = 84; const tw = 560; const th = 330;
    ctx.fillStyle = 'rgba(6,9,17,0.9)';
    roundRect(ctx, tx, ty, tw, th, 12); ctx.fill();
    ctx.strokeStyle = 'rgba(140,170,255,0.22)'; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.fillStyle = 'rgba(140,170,255,0.1)';
    roundRect(ctx, tx, ty, tw, 32, 12); ctx.fill();
    ctx.fillStyle = 'rgba(210,220,255,0.6)';
    ctx.font = '700 12px ui-monospace, monospace';
    ctx.fillText('terminal — mh', tx + 16, ty + 16);

    const visible = Math.floor(time * 2.1) % (BOOT_LINES.length + 3);
    ctx.font = '400 14px ui-monospace, monospace';
    BOOT_LINES.slice(0, Math.min(visible, BOOT_LINES.length)).forEach((line, i) => {
      ctx.fillStyle = line.startsWith('>') ? '#ceff3d' : 'rgba(200,214,255,0.75)';
      ctx.fillText(line, tx + 18, ty + 58 + i * 26);
    });
    if (visible >= BOOT_LINES.length && Math.sin(time * 5) > 0) {
      ctx.fillStyle = '#ceff3d';
      ctx.fillRect(tx + 34, ty + 58 + (BOOT_LINES.length - 1) * 26 - 8, 9, 16);
    }

    /* ---- Panel de operación ---- */
    const px = 636; const py = 84; const pw = 342;
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    roundRect(ctx, px, py, pw, 156, 12); ctx.fill();
    ctx.strokeStyle = 'rgba(140,170,255,0.2)'; ctx.stroke();

    ctx.fillStyle = 'rgba(200,214,255,0.55)';
    ctx.font = '800 11px ui-sans-serif, system-ui, sans-serif';
    ctx.fillText('CAJA · HOY', px + 18, py + 26);
    ctx.fillStyle = '#eef1ff';
    ctx.font = '700 40px ui-sans-serif, system-ui, sans-serif';
    const amount = 12480 + Math.floor(Math.sin(time * 0.7) * 640 + 640);
    ctx.fillText(`$ ${amount.toLocaleString('es-MX')}`, px + 18, py + 64);

    const bars = 9;
    for (let i = 0; i < bars; i += 1) {
      const h = 18 + (Math.sin(time * 1.6 + i * 0.7) * 0.5 + 0.5) * 44;
      ctx.fillStyle = i === bars - 1 ? '#ceff3d' : 'rgba(140,170,255,0.4)';
      roundRect(ctx, px + 18 + i * 34, py + 138 - h, 20, h, 4);
      ctx.fill();
    }

    /* ---- Módulos ---- */
    const modules = ['WEB', 'POS', 'CRM', 'FLUJOS', 'SOFTWARE'];
    modules.forEach((m, i) => {
      const mx = px + 18;
      const my = py + 178 + i * 44;
      ctx.fillStyle = 'rgba(255,255,255,0.045)';
      roundRect(ctx, mx, my, pw - 36, 34, 8); ctx.fill();
      ctx.fillStyle = ACCENTS[i];
      ctx.beginPath(); ctx.arc(mx + 18, my + 17, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(230,236,255,0.85)';
      ctx.font = '700 12px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText(m, mx + 34, my + 18);
      const on = Math.sin(time * 1.3 + i) > -0.4;
      ctx.fillStyle = on ? 'rgba(206,255,61,0.9)' : 'rgba(200,214,255,0.3)';
      ctx.font = '700 10px ui-monospace, monospace';
      ctx.fillText(on ? 'OK' : '··', mx + pw - 70, my + 18);
    });

    /* ---- Dock ---- */
    const dockW = 300;
    ctx.fillStyle = 'rgba(8,11,20,0.75)';
    roundRect(ctx, (W - dockW) / 2, H - 68, dockW, 52, 14); ctx.fill();
    ctx.strokeStyle = 'rgba(140,170,255,0.2)'; ctx.stroke();
    ACCENTS.forEach((c, i) => {
      const bx = (W - dockW) / 2 + 22 + i * 54;
      const lift = Math.max(0, Math.sin(time * 2 - i * 0.6)) * 5;
      ctx.fillStyle = c;
      roundRect(ctx, bx, H - 56 - lift, 34, 30, 8);
      ctx.fill();
    });

    /* ---- Reflejo del panel ---- */
    const sheen = ctx.createLinearGradient(0, 0, W, H);
    sheen.addColorStop(0, 'rgba(255,255,255,0.055)');
    sheen.addColorStop(0.4, 'rgba(255,255,255,0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, W, H);
  };

  draw(0);
  return { canvas, draw };
}
