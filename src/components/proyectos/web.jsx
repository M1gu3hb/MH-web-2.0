/**
 * Demostraciones de los sitios: Vero Seguros, The Best Moment, Fiesta Total
 * DJ's, las páginas de enlaces, TheXaviMTZ y el portafolio académico.
 *
 * Los nombres de paquetes, membresías, ramos y lanzamientos son los que cada
 * sitio publica. No aparece ningún precio: cambian, y aquí envejecerían.
 */

import { AnimatePresence, motion as Motion } from 'motion/react';
import { Check, Globe, MapPin, MessageCircle, Pencil, Phone, Play, Save } from 'lucide-react';

import { Barras, Hecho, MUELLE, Marco, Mensaje, REBOTE, SUBE, Telefono, guion, useEscena, useTecleo } from './base';
import './web.css';

/* ============================================================
   VERO SEGUROS — editar sobre el diseño real y publicar
   ============================================================ */

const G_VERO = guion([
  { espera: 900 },
  { a: 'frase', marca: 'sel' },
  { espera: 1900, marca: 'escribe' },
  { espera: 800, marca: 'guardado' },
  { a: 'publicar', marca: 'publicado', ir: 760 },
  { espera: 2700 },
]);

const ET_VERO = [
  [0, 'Su sitio, con administrador propio'],
  ['sel', 'Pulsa la frase sobre el diseño real'],
  ['escribe', 'Escribe encima, sin tocar código'],
  ['publicado', 'Y publica ella misma'],
];

export function Vero() {
  const e = useEscena(G_VERO);
  const escrito = useTecleo('Una que sí responde.', e.ya('escribe'), 58);
  const editando = e.ya('sel') && !e.ya('publicado');

  return (
    <Marco e={e} clase="pe--vero" etapas={ET_VERO}>
      <div className="vr">
        <header className="vr__admin">
          <span>
            <Pencil size="1.1em" aria-hidden="true" />
            Editando la página <em>vista previa</em>
          </span>
          <span data-t="publicar" className={`pe-boton ${e.ya('publicado') ? 'is-hecho' : ''} ${e.pulsando === 'publicar' ? 'is-pulsado' : ''}`}>
            {e.ya('publicado') ? (
              <>
                <Check size="1.05em" aria-hidden="true" /> Publicado
              </>
            ) : (
              'Publicar'
            )}
          </span>
        </header>

        <div className="vr__pagina">
          <div className="vr__nav">
            <b>V</b>
            <span>Inicio</span>
            <span>Ramos</span>
            <span>Contacto</span>
          </div>
          <span className="pe-mini">Asesoría en seguros · CDMX</span>
          <p className="vr__titulo">
            Diez aseguradoras.
            <span data-t="frase" className={`vr__frase ${editando ? 'is-editando' : ''}`}>
              {editando && <i>Encabezado · B I U</i>}
              {e.ya('escribe') ? escrito : 'Una sola asesora.'}
              {e.ya('escribe') && !e.ya('guardado') && <b className="pe-cursor-texto" />}
            </span>
          </p>
          <div className="vr__ramos">
            {['Vida', 'Auto', 'Gastos médicos', 'Hogar'].map((r, i) => (
              <span key={r} className={`pe-ficha ${i === 0 ? 'is-activa' : ''}`}>
                {r}
              </span>
            ))}
            <span className="pe-ficha">+4</span>
            <Hecho visible={e.ya('guardado') && !e.ya('publicado')} clase="vr__guardado">
              Guardado
            </Hecho>
          </div>
        </div>
      </div>
    </Marco>
  );
}

/* ============================================================
   THE BEST MOMENT — portafolio, paquetes y fecha
   ============================================================ */

const PAQUETES_TBM = ['Básico', 'Bronce', 'Plata', 'Oro', 'Elite 1', 'Elite 2'];

const G_TBM = guion([
  { espera: 900 },
  { a: 'bodas', marca: 'bodas' },
  { espera: 1500 },
  { a: 'p3', marca: 'paquete', ir: 720 },
  { a: 'fecha', marca: 'wa', ir: 760 },
  { espera: 3300 },
]);

const ET_TBM = [
  [0, 'Las fotos hablan primero'],
  ['bodas', 'Cada colección se recorre sin trabarse'],
  ['paquete', 'Los seis paquetes, lado a lado'],
  ['wa', 'Y la fecha se consulta en un toque'],
];

export function BestMoment() {
  const e = useEscena(G_TBM);
  const abierta = e.ya('bodas');

  return (
    <Marco e={e} clase="pe--tbm" etapas={ET_TBM}>
      <div className="tb">
        <header className="tb__nav">
          <b>
            <i /> The Best Moment
          </b>
          <span>Portafolio</span>
          <span>Paquetes</span>
          <span>Fotolibros</span>
        </header>

        <div className="tb__cuerpo">
          <div className="tb__texto">
            <p>
              El mejor momento,
              <em>para siempre.</em>
            </p>
            <span data-t="fecha" className={`tb__fecha ${e.pulsando === 'fecha' ? 'is-pulsado' : ''}`}>
              <MessageCircle size="1.1em" aria-hidden="true" />
              Consultar fecha
            </span>
          </div>

          <div className={`tb__galeria ${abierta ? 'is-abierta' : ''}`}>
            {['Bodas', 'XV años', 'Retratos'].map((c, i) => (
              <Motion.div key={c} layout data-t={i === 0 ? 'bodas' : undefined} className={`tb__foto tb__foto--${i}`} transition={MUELLE}>
                <span>{c}</span>
              </Motion.div>
            ))}
            <AnimatePresence>
              {abierta &&
                [3, 4, 5].map((i) => (
                  <Motion.div
                    key={i}
                    layout
                    className={`tb__foto tb__foto--${i}`}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...MUELLE, delay: (i - 3) * 0.12 }}
                  />
                ))}
            </AnimatePresence>
          </div>
        </div>

        <footer className="tb__paquetes">
          <span className="pe-mini">Paquetes</span>
          {PAQUETES_TBM.map((p, i) => (
            <span key={p} data-t={`p${i}`} className={`tb__punto ${i === 3 && e.ya('paquete') ? 'is-activo' : ''}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
          ))}
          <AnimatePresence>
            {e.ya('paquete') && (
              <Motion.b {...SUBE}>Paquete Oro</Motion.b>
            )}
          </AnimatePresence>
        </footer>

        <Mensaje texto="Hola, quiero consultar fecha para el paquete Oro." visible={e.ya('wa')} clase="tb__wa" />
      </div>
    </Marco>
  );
}

/* ============================================================
   FIESTA TOTAL DJ'S — del paquete al WhatsApp
   ============================================================ */

const PAQUETES_FT = [
  { id: 'basico', n: 'Básico', r: '30 a 50 personas', q: 'Reuniones íntimas' },
  { id: 'medio', n: 'Medio', r: '100 a 150 personas', q: 'Eventos con más energía' },
  { id: 'vip', n: 'VIP', r: '250 a 400 personas', q: 'Bodas y XV años' },
];

const G_FIESTA = guion([
  { espera: 900 },
  { a: 'medio', marca: 'medio' },
  { espera: 1000 },
  { a: 'vip', marca: 'vip', ir: 460 },
  { espera: 1000 },
  { a: 'cotizar', marca: 'wa', ir: 720 },
  { espera: 3300 },
]);

const ET_FIESTA = [
  [0, 'Una página con la energía del servicio'],
  ['medio', 'Comparas los paquetes sin preguntar'],
  ['wa', 'Y WhatsApp llega con el paquete ya escrito'],
];

export function Fiesta() {
  const e = useEscena(G_FIESTA);
  const elegido = e.ya('vip') ? 'vip' : e.ya('medio') ? 'medio' : 'basico';

  return (
    <Marco e={e} clase="pe--fiesta" etapas={ET_FIESTA}>
      <div className="ft">
        <div className="ft__pista">
          <div className="ft__disco">
            <i>FT</i>
          </div>
          <p>
            La pista
            <br />
            es tuya.
          </p>
          <Barras n={16} vivo clase="ft__barras" />
        </div>

        <div className="ft__paquetes">
          <span className="pe-mini">Elige tu paquete</span>
          {PAQUETES_FT.map((p) => (
            <Motion.div key={p.id} layout data-t={p.id} className={`ft__paquete ${elegido === p.id ? 'is-elegido' : ''}`} transition={MUELLE}>
              <b>{p.n}</b>
              <span>{p.r}</span>
              <AnimatePresence initial={false}>
                {elegido === p.id && (
                  <Motion.em layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    {p.q}
                  </Motion.em>
                )}
              </AnimatePresence>
            </Motion.div>
          ))}
          <span data-t="cotizar" className={`pe-boton ${e.pulsando === 'cotizar' ? 'is-pulsado' : ''}`}>
            <MessageCircle size="1.1em" aria-hidden="true" />
            Cotizar por WhatsApp
          </span>
        </div>

        <Mensaje texto="Hola, me interesa el Paquete VIP para mi evento." visible={e.ya('wa')} clase="ft__wa" />
      </div>
    </Marco>
  );
}

/* ============================================================
   PÁGINAS DE ENLACES — un QR, tres marcas, WhatsApp primero
   ============================================================ */

const MARCAS = [
  { id: 'm1', clase: 'morphiq', n: 'Morphiq', corto: 'Morphiq', s: 'Diseño y sistemas' },
  { id: 'm2', clase: 'palapa', n: 'Jardín La Palapa', corto: 'La Palapa', s: 'Bodas · XV años · Eventos' },
  { id: 'm3', clase: 'fiesta', n: 'Fiesta Total', corto: 'Fiesta Total', s: 'Música que enciende tu fiesta' },
];

const BOTONES = [
  { n: 'Llamar', icono: Phone },
  { n: 'Cómo llegar', icono: MapPin },
  { n: 'Sitio web', icono: Globe },
];

const G_ENLACES = guion([
  { espera: 800 },
  { espera: 1300, marca: 'escanea' },
  { espera: 1300, marca: 'abre' },
  { a: 'm2', marca: 'palapa' },
  { espera: 1100 },
  { a: 'm3', marca: 'fiesta', ir: 420 },
  { espera: 1100 },
  { a: 'wa', marca: 'wa', ir: 720 },
  { espera: 2500 },
]);

const ET_ENLACES = [
  [0, 'El QR de la tarjeta, la etiqueta NFC, la bio'],
  ['abre', 'Todo lleva a una página con su marca'],
  ['palapa', 'Cada negocio, su propia identidad'],
  ['wa', 'Y WhatsApp siempre primero'],
];

export function Enlaces() {
  const e = useEscena(G_ENLACES);
  const marca = MARCAS[e.ya('fiesta') ? 2 : e.ya('palapa') ? 1 : 0];

  return (
    <Marco e={e} clase="pe--enlaces" etapas={ET_ENLACES}>
      <div className="en">
        <div className="en__tarjeta">
          <div className={`en__qr ${e.en('escanea') ? 'is-leyendo' : ''}`}>
            <b />
            <b />
            <b />
            <i />
          </div>
          <span className="pe-mini">Escanea o acerca tu teléfono</span>
          <div className="en__marcas">
            {MARCAS.map((m) => (
              <span key={m.id} data-t={m.id} className={`pe-ficha ${marca.id === m.id && e.ya('abre') ? 'is-activa' : ''}`}>
                {m.corto}
              </span>
            ))}
          </div>
        </div>

        <Telefono clase={`en__tel en--${marca.clase}`} animate={{ y: e.ya('abre') ? '0em' : '1.2em', opacity: e.ya('abre') ? 1 : 0.35 }} transition={MUELLE}>
          <AnimatePresence mode="popLayout" initial={false}>
            {e.ya('abre') && (
              <Motion.div
                key={marca.id}
                className="en__pagina"
                initial={{ opacity: 0, scale: 1.06, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(6px)' }}
                transition={{ duration: 0.35 }}
              >
                <b>{marca.n}</b>
                <span>{marca.s}</span>
                <Motion.em data-t="wa" className={`en__wa ${e.ya('wa') ? 'is-hecho' : ''}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...REBOTE, delay: 0.12 }}>
                  <MessageCircle size="1.1em" aria-hidden="true" />
                  {e.ya('wa') ? 'Chat abierto' : 'WhatsApp'}
                </Motion.em>
                {BOTONES.map((b, i) => (
                  <Motion.em key={b.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...REBOTE, delay: 0.2 + i * 0.08 }}>
                    <b.icono size="1.05em" aria-hidden="true" />
                    {b.n}
                  </Motion.em>
                ))}
              </Motion.div>
            )}
          </AnimatePresence>
        </Telefono>
      </div>
    </Marco>
  );
}

/* ============================================================
   THEXAVIMTZ — el lanzamiento al frente y el catálogo a la mano
   ============================================================ */

const LANZAMIENTOS = [
  { id: 'r1', n: 'CHILDHOOD', tono: 268 },
  { id: 'r2', n: 'LA PLAYA Y EL SOL', tono: 22 },
  { id: 'r3', n: 'UNVRS', tono: 190 },
  { id: 'r4', n: 'WORK VOL 1', tono: 330 },
];

const G_XAVI = guion([
  { espera: 900 },
  { a: 'play', marca: 'play' },
  { espera: 1800 },
  { a: 'r2', marca: 'r2', ir: 720 },
  { espera: 1300 },
  { a: 'r3', marca: 'r3', ir: 420 },
  { espera: 2500 },
]);

const ET_XAVI = [
  [0, 'El último lanzamiento, al frente'],
  ['play', 'Se escucha sin salir del sitio'],
  ['r2', 'Y todo el catálogo sigue a la mano'],
];

export function Xavi() {
  const e = useEscena(G_XAVI);
  const i = e.ya('r3') ? 2 : e.ya('r2') ? 1 : 0;
  const actual = LANZAMIENTOS[i];
  const suena = e.ya('play');

  return (
    <Marco e={e} clase="pe--xavi" etapas={ET_XAVI}>
      <div className="xv">
        <div className="xv__marca">
          <span className="pe-mini">House from Mexico City</span>
          <p>
            THE XAVI
            <em>MTZ</em>
          </p>
          <div className="xv__acciones">
            <span data-t="play" className={`pe-boton ${e.pulsando === 'play' ? 'is-pulsado' : ''}`}>
              <Play size="1em" aria-hidden="true" />
              {suena ? 'Sonando' : 'Escuchar'}
            </span>
            <Barras n={12} vivo={suena} />
          </div>
        </div>

        <div className="xv__lado">
          <div className="xv__portada" style={{ '--tono': actual.tono }}>
            <i className={suena ? 'is-girando' : ''} />
            <AnimatePresence mode="popLayout" initial={false}>
              <Motion.div key={actual.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <span className="pe-mini">{i === 0 ? 'Último lanzamiento' : 'Del catálogo'}</span>
                <b>{actual.n}</b>
              </Motion.div>
            </AnimatePresence>
            <span className="xv__progreso">
              <u className={suena ? 'is-corre' : ''} key={actual.id} />
            </span>
          </div>
          <div className="xv__catalogo">
            {LANZAMIENTOS.map((l) => (
              <span key={l.id} data-t={l.id} className={actual.id === l.id ? 'is-actual' : ''} style={{ '--tono': l.tono }}>
                <i />
                {l.n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Marco>
  );
}

/* ============================================================
   PORTAFOLIO ACADÉMICO — un dato en un archivo, un artículo en el sitio
   ============================================================ */

const G_ACADEMICO = guion([
  { espera: 700 },
  { espera: 2400, marca: 'escribe' },
  { a: 'guardar', marca: 'guardado' },
  { espera: 1000 },
  { espera: 2800, marca: 'publicado' },
]);

const ET_ACADEMICO = [
  [0, 'El contenido vive en un archivo, no en el diseño'],
  ['escribe', 'Un artículo se escribe como un dato'],
  ['guardado', 'Al guardar, los tipos revisan que esté bien'],
  ['publicado', 'Y el sitio lo publica solo'],
];

const TITULO_NUEVO = 'Ruido y señal en series de laboratorio';

export function Academico() {
  const e = useEscena(G_ACADEMICO);
  const escrito = useTecleo(TITULO_NUEVO, e.ya('escribe'), 48);

  return (
    <Marco e={e} clase="pe--academico" etapas={ET_ACADEMICO}>
      <div className="ac">
        <div className="ac__editor">
          <header>
            <span>
              <i /> datos/publicaciones.ts
            </span>
            <em data-t="guardar" className={`${e.ya('guardado') ? 'is-hecho' : ''} ${e.pulsando === 'guardar' ? 'is-pulsado' : ''}`}>
              {e.ya('publicado') ? <Check size="1.1em" aria-hidden="true" /> : <Save size="1.1em" aria-hidden="true" />}
              {e.ya('publicado') ? 'Sin errores' : e.ya('guardado') ? 'Validando…' : 'Guardar cambios'}
            </em>
          </header>
          <pre>
            <span>export const</span> publicaciones = [{'\n'}
            {'  { '}
            <u>titulo</u>: <b>&quot;{escrito}</b>
            {e.ya('escribe') && !e.ya('guardado') && <b className="pe-cursor-texto" />}
            <b>&quot;</b>, <u>anio</u>: 2026 {'},\n'}
            {'  { '}
            <u>titulo</u>: <b>&quot;Notas sobre reproducibilidad&quot;</b>, … {'},\n'}]
          </pre>
        </div>

        <div className="ac__sitio">
          <span className="pe-mini">tu-sitio.mx / publicaciones</span>
          <ul>
            <AnimatePresence initial={false}>
              {e.ya('publicado') && (
                <Motion.li key="nuevo" layout className="es-nuevo" initial={{ opacity: 0, y: -16, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={REBOTE}>
                  <span>2026</span>
                  <b>{TITULO_NUEVO}</b>
                  <em>
                    <Check size="1em" aria-hidden="true" /> Publicado
                  </em>
                </Motion.li>
              )}
              <Motion.li key="a" layout transition={MUELLE}>
                <span>2025</span>
                <b>Notas sobre reproducibilidad</b>
              </Motion.li>
              <Motion.li key="b" layout transition={MUELLE}>
                <span>2024</span>
                <b>Lecturas del semestre</b>
              </Motion.li>
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </Marco>
  );
}
