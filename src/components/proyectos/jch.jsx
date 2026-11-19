/**
 * Demostraciones del ecosistema del recinto de eventos: el sitio público,
 * el CRM, el portal del cliente, el estudio 3D y el sitio de las clases de
 * baile. Cinco aplicaciones distintas, así que cinco escenas distintas.
 *
 * Los eventos, importes e invitados que se ven son de demostración. El CRM
 * y el portal manejan datos de clientes reales y aquí no aparece ninguno.
 */

import { AnimatePresence, motion as Motion } from 'motion/react';
import { CalendarDays, Check, Play, QrCode, Send, Share2, Users } from 'lucide-react';

import { Cifra } from '../pos/kit';
import { Barras, Hecho, MUELLE, Marco, Mensaje, POP, REBOTE, SUBE, guion, useEscena } from './base';
import './jch.css';

/* ============================================================
   JARDINES CLUB HÍPICO — la solicitud entra por el sitio
   ============================================================ */

const G_HIPICO = guion([
  { espera: 900 },
  { a: 'boda', marca: 'boda' },
  { a: 'fecha', marca: 'fecha', ir: 560 },
  { a: 'enviar', marca: 'enviada', ir: 700 },
  { espera: 900 },
  { espera: 2800, marca: 'panel' },
]);

const ET_HIPICO = [
  [0, 'El recinto se explica solo'],
  ['boda', 'Eliges el tipo de evento y la fecha'],
  ['enviada', 'Mandas la solicitud desde el sitio'],
  ['panel', 'Y cae directo al panel de la casa'],
];

export function Hipico() {
  const e = useEscena(G_HIPICO);
  const enviada = e.ya('enviada');

  return (
    <Marco e={e} clase="pe--hipico" etapas={ET_HIPICO}>
      <div className="hp">
        <div className="hp__sitio">
          <header>
            <b className="hp__logo">JCH</b>
            <span>Salones</span>
            <span>Servicios</span>
            <span>Galería</span>
          </header>
          <strong>
            Tu evento,
            <br />
            en un jardín.
          </strong>
          <div className="hp__tipos">
            {['Boda', 'XV años', 'Empresa'].map((t, i) => (
              <span key={t} data-t={i === 0 ? 'boda' : undefined} className={`pe-ficha ${i === 0 && e.ya('boda') ? 'is-activa' : ''}`}>
                {t}
              </span>
            ))}
          </div>
          <div className="hp__campos">
            <span data-t="fecha" className={e.ya('fecha') ? 'is-lleno' : ''}>
              <CalendarDays size="1.1em" aria-hidden="true" />
              {e.ya('fecha') ? 'Sáb 24 oct' : 'Fecha'}
            </span>
            <span className="is-lleno">
              <Users size="1.1em" aria-hidden="true" />
              180 personas
            </span>
          </div>
          <span data-t="enviar" className={`pe-boton ${enviada ? 'is-hecho' : ''} ${e.pulsando === 'enviar' ? 'is-pulsado' : ''}`}>
            {enviada ? <Check size="1.05em" aria-hidden="true" /> : <Send size="1.05em" aria-hidden="true" />}
            {enviada ? 'Solicitud enviada' : 'Enviar solicitud'}
          </span>
        </div>

        <div className="hp__panel">
          <span className="pe-mini">Panel de la casa</span>
          <b>
            Solicitudes <em className={e.ya('panel') ? 'is-nueva' : ''}>{e.ya('panel') ? 1 : 0}</em>
          </b>
          <AnimatePresence>
            {e.ya('panel') ? (
              <Motion.div key="s" className="hp__solicitud" initial={{ opacity: 0, x: -40, scale: 0.8 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={REBOTE}>
                <span className="pe-mini">Nueva · ahora</span>
                <b>Boda · 180 personas</b>
                <span>Sáb 24 oct · Salón de los Espejos</span>
                <em>Sin contestar</em>
              </Motion.div>
            ) : (
              <Motion.div key="v" className="hp__vacio" exit={{ opacity: 0 }}>
                Aquí llega cada solicitud
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Marco>
  );
}

/* ============================================================
   CRM DEL SALÓN — agenda, estado de cuenta y puerta
   ============================================================ */

const EVENTOS = [
  { id: 'boda', n: 'Boda', d: 'Sáb 24 oct · 180 personas', estado: 'Confirmado', tono: 'ok', contratado: 86400, cobrado: 52000 },
  { id: 'xv', n: 'XV años', d: 'Sáb 7 nov · 120 personas', estado: 'Apartado', tono: 'aviso', contratado: 64000, cobrado: 20000 },
  { id: 'empresa', n: 'Empresa', d: 'Vie 20 nov · 60 personas', estado: 'Cotizado', tono: 'frio', contratado: 38000, cobrado: 0 },
];

const G_CRM = guion([
  { espera: 900 },
  { a: 'xv', marca: 'xv' },
  { a: 'pago', marca: 'pago', ir: 720 },
  { espera: 1500 },
  { a: 'puerta', marca: 'puerta', ir: 720 },
  { espera: 2800 },
]);

const ET_CRM = [
  [0, 'La agenda de eventos de la casa'],
  ['xv', 'Cada evento trae su estado de cuenta'],
  ['pago', 'Registras un pago y el saldo se calcula solo'],
  ['puerta', 'El día del evento, la puerta lee códigos QR'],
];

export function Crm() {
  const e = useEscena(G_CRM);
  const evento = EVENTOS[e.ya('xv') ? 1 : 0];
  const cobrado = evento.cobrado + (e.ya('pago') ? 12000 : 0);

  return (
    <Marco e={e} clase="pe--crm" etapas={ET_CRM}>
      <div className="cr">
        <div className="cr__agenda">
          <header>
            <b className="cr__logo">JCH</b>
            <span className="pe-mini">Panel de la casa</span>
          </header>
          {EVENTOS.map((ev) => (
            <div key={ev.id} data-t={ev.id} className={`cr__evento cr__evento--${ev.tono} ${evento.id === ev.id ? 'is-activo' : ''}`}>
              <div>
                <b>{ev.n}</b>
                <span>{ev.d}</span>
              </div>
              <em>{ev.estado}</em>
            </div>
          ))}
        </div>

        <div className="cr__cuenta">
          <span className="pe-mini">Estado de cuenta · {evento.n}</span>
          <dl>
            <div>
              <dt>Contratado</dt>
              <dd>
                <Cifra valor={evento.contratado} />
              </dd>
            </div>
            <div>
              <dt>Cobrado</dt>
              <dd>
                <Cifra valor={cobrado} />
              </dd>
            </div>
            <div className="es-falta">
              <dt>Falta</dt>
              <dd>
                <Cifra valor={evento.contratado - cobrado} />
              </dd>
            </div>
          </dl>
          <AnimatePresence>
            {e.ya('pago') && (
              <Motion.p className="cr__pago" {...SUBE}>
                <span>Transferencia · hoy</span>
                <b>+$12,000</b>
              </Motion.p>
            )}
          </AnimatePresence>
          <div className="cr__acciones">
            <span data-t="pago" className={`pe-boton ${e.ya('pago') ? 'is-hecho' : ''} ${e.pulsando === 'pago' ? 'is-pulsado' : ''}`}>
              {e.ya('pago') ? 'Pago registrado' : 'Registrar pago'}
            </span>
            <span data-t="puerta" className={`pe-boton cr__puerta ${e.pulsando === 'puerta' ? 'is-pulsado' : ''}`}>
              <QrCode size="1.1em" aria-hidden="true" />
              Puerta
            </span>
          </div>

          <AnimatePresence>
            {e.ya('puerta') && (
              <Motion.div className="cr__qr" {...POP}>
                <i />
                <div>
                  <span className="pe-mini">Acceso · invitación 0412</span>
                  <b>Mesa 7 · pase válido</b>
                  <span>4 de 6 ya entraron</span>
                </div>
                <Check size="1.4em" aria-hidden="true" />
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Marco>
  );
}

/* ============================================================
   PORTAL DEL CLIENTE — el evento, en manos de quien lo celebra
   ============================================================ */

const G_PORTAL = guion([
  { espera: 1000 },
  { a: 'mesas', marca: 'mesas' },
  { a: 'invitacion', marca: 'enviada', ir: 620 },
  { espera: 900 },
  { espera: 3000, marca: 'confirman' },
]);

const ET_PORTAL = [
  [0, 'El cliente entra a su propio evento'],
  ['mesas', 'Decide lo suyo: mesas, música, cronograma'],
  ['enviada', 'Arma y reparte su invitación digital'],
  ['confirman', 'Las confirmaciones se cuentan solas'],
];

export function Portal() {
  const e = useEscena(G_PORTAL);
  const confirman = e.ya('confirman');
  const filas = [
    { id: 'cronograma', n: 'Cronograma', v: 'Listo', ok: true },
    { id: 'musica', n: 'Música', v: 'Listo', ok: true },
    { id: 'mesas', n: 'Mesas', v: e.ya('mesas') ? '14 de 14' : '12 de 14', ok: e.ya('mesas') },
    { id: 'invitacion', n: 'Invitación', v: e.ya('enviada') ? 'Enviada' : 'Por enviar', ok: e.ya('enviada') },
  ];

  return (
    <Marco e={e} clase="pe--portal" etapas={ET_PORTAL}>
      <div className="pt">
        <div className="pt__evento">
          <span className="pe-mini">Tu evento</span>
          <b>Boda · 24 de octubre</b>
          <p className="pt__dias">
            42 <span>días</span>
          </p>
          <div className="pt__confirmados">
            <p>
              <Cifra valor={confirman ? 109 : 96} prefijo="" />
              <span>confirmados de 140</span>
            </p>
            <span className="pt__barra">
              <i style={{ width: confirman ? '78%' : '68%' }} />
            </span>
          </div>
        </div>

        <div className="pt__lista">
          {filas.map((f) => (
            <div key={f.id} data-t={f.id} className={`pt__fila ${f.ok ? 'is-lista' : ''} ${e.pulsando === f.id ? 'is-pulsado' : ''}`}>
              <b>{f.n}</b>
              <span>{f.v}</span>
            </div>
          ))}
        </div>

        <div className="pt__avisos">
          <AnimatePresence>
            {confirman &&
              ['Ana +2', 'Fam. Ríos +4', 'Luis +1', 'Mariana +3'].map((n, i) => (
                <Motion.span key={n} initial={{ opacity: 0, y: 14, scale: 0.7 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...REBOTE, delay: 0.15 + i * 0.3 }}>
                  <Check size="1em" aria-hidden="true" />
                  {n}
                </Motion.span>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </Marco>
  );
}

/* ============================================================
   ESTUDIO 3D — el salón de verdad, para acomodarlo y mandarlo
   ============================================================ */

const MESAS_3D = [
  [14, 20],
  [36, 13],
  [64, 13],
  [86, 20],
  [11, 52],
  [89, 52],
  [34, 86],
  [58, 88],
];

const G_3D = guion([
  { espera: 900 },
  { a: 'm7', marca: 'toma', pulsar: 420 },
  { a: 'hueco', marca: 'suelta', ir: 900, pulsar: 380 },
  { a: 'planta', marca: 'planta', ir: 700 },
  { espera: 1400 },
  { a: 'compartir', marca: 'compartido', ir: 720 },
  { espera: 2700 },
]);

const ET_3D = [
  [0, 'El salón de verdad, modelado en 3D'],
  ['toma', 'Acomodas las mesas arrastrándolas'],
  ['planta', 'Lo ves en planta o lo recorres'],
  ['compartido', 'Y se lo mandas al cliente en un enlace'],
];

export function Estudio3d() {
  const e = useEscena(G_3D);
  /* La mesa viaja mientras el cursor viaja, que es lo que hace que se lea
     como un arrastre: empieza a moverse en el paso de «ir», no en el clic. */
  const arrastrada = e.paso >= G_3D.marcas.suelta - 1;
  const planta = e.ya('planta');

  return (
    <Marco e={e} clase="pe--tresd" etapas={ET_3D}>
      <div className="td">
        <header className="td__barra">
          <b>
            <i>JCH</i> 3D Studio
          </b>
          <span className="td__vistas">
            <em className={planta ? '' : 'is-activa'}>Vista 3D</em>
            <em data-t="planta" className={planta ? 'is-activa' : ''}>
              Planta
            </em>
            <em>Recorrido</em>
          </span>
          <span data-t="compartir" className={`pe-boton ${e.ya('compartido') ? 'is-hecho' : ''} ${e.pulsando === 'compartir' ? 'is-pulsado' : ''}`}>
            {e.ya('compartido') ? <Check size="1.05em" aria-hidden="true" /> : <Share2 size="1.05em" aria-hidden="true" />}
            {e.ya('compartido') ? 'Enlace listo' : 'Compartir'}
          </span>
        </header>

        <div className="td__escena">
          <Motion.div
            className="td__piso"
            initial={false}
            animate={planta ? { rotateX: 0, rotateZ: 0, scale: 1 } : { rotateX: 56, rotateZ: -34, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 70, damping: 15 }}
          >
            <span className="td__pista">Pista</span>
            {MESAS_3D.map(([x, y], i) => (
              <i key={i} className="td__mesa" style={{ left: `${x}%`, top: `${y}%` }} />
            ))}
            <i data-t="hueco" className="td__hueco" style={{ left: '82%', top: '84%' }} />
            <Motion.i
              data-t="m7"
              className={`td__mesa td__mesa--viva ${e.ya('toma') && !e.ya('suelta') ? 'is-tomada' : ''}`}
              initial={false}
              animate={{ left: arrastrada ? '82%' : '13%', top: '84%' }}
              transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            />
          </Motion.div>
        </div>

        <footer className="td__pie">
          <span>
            <b>9</b> mesas
          </span>
          <span>
            <b>72</b> sillas
          </span>
          <span className={e.ya('suelta') ? 'is-ok' : ''}>{e.ya('suelta') ? 'Sin cruces' : 'Acomodando…'}</span>
          <Hecho visible={e.ya('compartido')}>Se abre sin internet</Hecho>
        </footer>
      </div>
    </Marco>
  );
}

/* ============================================================
   JCH BAILE — ritmo, membresía y a WhatsApp
   ============================================================ */

const PLANES = [
  { id: 'esencial', n: 'Esencial', p: 300, c: '4 clases al mes' },
  { id: 'constante', n: 'Constante', p: 600, c: '8 clases al mes' },
  { id: 'intensiva', n: 'Intensiva', p: 800, c: '12 clases al mes' },
];

const G_BAILE = guion([
  { espera: 900 },
  { a: 'ritmo', marca: 'ritmo' },
  { espera: 1400 },
  { a: 'constante', marca: 'plan', ir: 700 },
  { a: 'quiero', marca: 'wa', ir: 760 },
  { espera: 3300 },
]);

const ET_BAILE = [
  [0, 'Qué se enseña, cuánto cuesta y para quién'],
  ['ritmo', 'El ritmo suena solo si tú lo activas'],
  ['plan', 'Eliges tu membresía'],
  ['wa', 'Y apartas tu lugar por WhatsApp'],
];

export function Baile() {
  const e = useEscena(G_BAILE);
  const suena = e.ya('ritmo');

  return (
    <Marco e={e} clase="pe--baile" etapas={ET_BAILE}>
      <div className="bl">
        <header className="bl__barra">
          <b>
            <i>JCH</i> Baile
          </b>
          <span data-t="quiero" className={`pe-boton ${e.pulsando === 'quiero' ? 'is-pulsado' : ''}`}>
            Quiero bailar
          </span>
        </header>

        <p className="bl__titulo">
          Tu cuerpo ya sabe.
          <em>Solo hay que escucharlo.</em>
        </p>

        <div className={`bl__ritmo ${suena ? 'is-vivo' : ''}`}>
          <span data-t="ritmo" className={`bl__play ${e.pulsando === 'ritmo' ? 'is-pulsado' : ''}`}>
            <Play size="1em" aria-hidden="true" />
          </span>
          <Barras n={22} vivo={suena} />
          <span className="pe-mini">{suena ? 'Salsa · sonando' : 'Activar ritmo'}</span>
        </div>

        <div className="bl__planes">
          {PLANES.map((p) => (
            <Motion.div
              key={p.id}
              data-t={p.id}
              className={`bl__plan ${p.id === 'constante' && e.ya('plan') ? 'is-elegido' : ''}`}
              animate={{ y: p.id === 'constante' && e.ya('plan') ? '-0.35em' : '0em' }}
              transition={MUELLE}
            >
              <span className="pe-mini">{p.n}</span>
              <b>
                ${p.p}
                <small>/mes</small>
              </b>
              <span>{p.c}</span>
            </Motion.div>
          ))}
        </div>

        <Mensaje texto="Hola, quiero la membresía Constante." visible={e.ya('wa')} clase="bl__wa" />
      </div>
    </Marco>
  );
}
