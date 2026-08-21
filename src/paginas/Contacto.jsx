/**
 * /contacto — formulario guiado sin backend.
 *
 * Decisión importante: no se añade un servicio de formularios ni un backend
 * solo para esto. El formulario COMPONE el mensaje y el visitante lo manda
 * por el canal que ya usa —WhatsApp o correo—, que además es donde Miguel
 * de verdad contesta. Un formulario que cae en una bandeja que nadie mira
 * es peor que no tener formulario.
 *
 * El campo `servicio` se puede preseleccionar desde cualquier página con
 * ?servicio=, y solo acepta valores de la lista blanca de rutas.js: así un
 * enlace manipulado no puede inyectar texto en el mensaje.
 *
 * Solo el nombre y el mensaje son obligatorios. Cada campo extra que se
 * exige cuesta conversión, y el resto lo puedo preguntar yo contestando.
 */

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion as Motion } from 'motion/react';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { CabeceraPagina, Seccion, TituloSeccion } from '../components/ui';
import { Reveal } from '../components/reactbits';
import { Cortina, Lateral } from '../components/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { whatsappUrl } from '../lib/whatsapp';
import { Seo, nodoMigas, nodoPagina } from '../lib/seo';
import { RUTAS, SERVICIOS_CONTACTO, servicioValido } from '../config/rutas';
import { CONTACT } from '../content';
import { gmailUrl } from '../lib/correo';
import { trackWhatsApp } from '../lib/whatsapp';
import { track } from '@vercel/analytics';

const MIGAS = [
  { nombre: 'Inicio', path: RUTAS.inicio },
  { nombre: 'Contacto', path: RUTAS.contacto },
];

const TITLE = 'Contacto: cuéntame tu proyecto | Morphiq';
const DESC =
  'Cuéntame qué necesita tu negocio y te respondo con una propuesta y un precio cerrado. Por WhatsApp o por correo, como prefieras.';

const PRESUPUESTOS = [
  { valor: '', etiqueta: 'Prefiero no decirlo todavía' },
  { valor: 'menos-5', etiqueta: 'Menos de $5,000 MXN' },
  { valor: '5-15', etiqueta: 'Entre $5,000 y $15,000 MXN' },
  { valor: '15-40', etiqueta: 'Entre $15,000 y $40,000 MXN' },
  { valor: 'mas-40', etiqueta: 'Más de $40,000 MXN' },
  { valor: 'mensual', etiqueta: 'Busco un servicio mensual' },
];

const VACIO = { nombre: '', negocio: '', telefono: '', correo: '', servicio: '', presupuesto: '', mensaje: '' };

/* ------------------------------------------------------------
   El acuse de envío
   ------------------------------------------------------------
   Esto no es decoración. Resuelve un fallo que la gente sufre de verdad:
   `window.open` es una ventana emergente, y en teléfono el navegador la
   bloquea a menudo. Cuando eso pasa, la persona pulsa «Enviar por
   WhatsApp» y para ella NO OCURRE ABSOLUTAMENTE NADA: ni error, ni aviso,
   ni pista de que el mensaje ya estaba compuesto. El acuse dice que hubo
   traspaso y, sobre todo, deja el enlace a mano —es el plan B, no un
   adorno.

   `role="status"` y no un `<p>` cualquiera: si la ventana no se abrió,
   quien usa lector de pantalla tampoco se entera de nada.

   La entrada es de Motion y no de CSS porque el nodo NACE de un cambio de
   estado, así que no existe el escenario de «se quedó a medias y el texto
   no volvió»: si el JavaScript no corre, el acuse no llega a montarse y la
   página queda exactamente como está hoy. Y no hay observador de por
   medio: `animate` arranca al montar. */
function AcuseEnvio({ acuse }) {
  const sinMovimiento = useReducedMotion();

  const texto = acuse && (
    <>
      Abriendo {acuse.canal === 'whatsapp' ? 'WhatsApp' : 'tu correo'} con el mensaje ya escrito.{' '}
      <a href={acuse.url} target="_blank" rel="noreferrer">
        Si no se abrió solo, ábrelo desde aquí.
      </a>
    </>
  );

  /* Con reduced motion se renderiza directo, sin `AnimatePresence`. La
     información no depende nunca del movimiento. */
  if (sinMovimiento) {
    return acuse ? (
      <p className="formulario__acuse" role="status">
        {texto}
      </p>
    ) : null;
  }

  return (
    <AnimatePresence>
      {acuse && (
        /* La clave es el canal: si alguien prueba WhatsApp y luego correo,
           el acuse se releva en vez de cambiar de texto a media frase. */
        <Motion.p
          key={acuse.canal}
          className="formulario__acuse"
          role="status"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {texto}
        </Motion.p>
      )}
    </AnimatePresence>
  );
}

export default function Contacto() {
  const [params] = useSearchParams();
  const [datos, setDatos] = useState(VACIO);
  const [tocado, setTocado] = useState(false);
  const [enviado, setEnviado] = useState(null);

  /* Preselección desde ?servicio=, validada contra la lista blanca. */
  useEffect(() => {
    const s = params.get('servicio');
    if (s && servicioValido(s)) setDatos((d) => ({ ...d, servicio: s }));
  }, [params]);

  const cambiar = (campo) => (e) => setDatos((d) => ({ ...d, [campo]: e.target.value }));

  const completo = datos.nombre.trim().length > 1 && datos.mensaje.trim().length > 4;

  /** El mensaje que se manda, en el mismo orden por el que yo lo leería. */
  const mensaje = useMemo(() => {
    const etiquetaServicio = SERVICIOS_CONTACTO.find((s) => s.valor === datos.servicio)?.etiqueta;
    const etiquetaPresupuesto = PRESUPUESTOS.find((p) => p.valor === datos.presupuesto && p.valor)?.etiqueta;
    return [
      `Hola Miguel, soy ${datos.nombre.trim()}.`,
      datos.negocio.trim() && `Mi negocio: ${datos.negocio.trim()}`,
      etiquetaServicio && `Lo que busco: ${etiquetaServicio}`,
      '',
      datos.mensaje.trim(),
      '',
      etiquetaPresupuesto && `Presupuesto aproximado: ${etiquetaPresupuesto}`,
      datos.telefono.trim() && `Mi teléfono: ${datos.telefono.trim()}`,
      datos.correo.trim() && `Mi correo: ${datos.correo.trim()}`,
    ]
      .filter((l) => l !== undefined && l !== false && l !== null)
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');
  }, [datos]);

  const enviar = (canal) => {
    if (!completo) {
      setTocado(true);
      return;
    }
    try {
      track('contacto_enviado', { canal, servicio: datos.servicio || 'sin-elegir' });
    } catch {
      /* La analítica nunca bloquea una conversión. */
    }
    /* La URL se calcula una vez y se usa dos: para abrir la ventana y para
       el enlace del acuse. Esa segunda copia es lo único que le queda a la
       persona si el navegador bloquea la emergente. */
    const url =
      canal === 'whatsapp'
        ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(mensaje)}`
        : gmailUrl(CONTACT.email, `Proyecto: ${datos.negocio.trim() || datos.nombre.trim()}`, mensaje);
    if (canal === 'whatsapp') trackWhatsApp('formulario');
    window.open(url, '_blank', 'noopener');
    setEnviado({ canal, url });
  };

  const grafo = [
    nodoPagina({ path: RUTAS.contacto, title: TITLE, description: DESC }),
    nodoMigas(MIGAS),
  ];

  return (
    <>
      <Seo title={TITLE} description={DESC} path={RUTAS.contacto} grafo={grafo} />

      {/* La cabecera deja de ser un titular con media pantalla vacía al
          lado. En ese hueco va lo que alguien que llega a /contacto está
          buscando de verdad: el número, en grande y pulsable. Es la pieza
          que la sección de contacto de producción tenía y que aquí se había
          quedado enterrada en una lista de enlaces pequeños. */}
      <CabeceraPagina
        migas={MIGAS}
        eyebrow="Contacto"
        titulo="Cuéntame qué necesita tu negocio."
        resalte="tu negocio"
        entrada="Contesto yo. Con lo que me escribas aquí ya puedo decirte por dónde empezar y qué costaría."
        aparte={
          <div className="contacto-linea">
            <span className="contacto-linea__etiqueta">O escríbeme ahora mismo</span>
            <a
              className="contacto-linea__wa"
              href={whatsappUrl('contacto')}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsApp('contacto')}
            >
              <MessageCircle size={22} aria-hidden="true" />
              <strong>{CONTACT.phone}</strong>
              <span>WhatsApp directo</span>
            </a>
            <p className="contacto-linea__nota">
              Contesto yo, no un bot. Normalmente el mismo día.
            </p>
          </div>
        }
      />

      <Seccion className="seccion--formulario">
        {/* El mismo símbolo translúcido que cierra la home, detrás del
            formulario: es el bloque donde alguien se para más rato y donde
            más falta hace que la marca esté presente sin estorbar. */}
        <img className="formulario__marca" src="/marca/simbolo-v2-lg.webp" alt="" aria-hidden="true" loading="lazy" />
        <div className="contenedor contenedor--amplio">
          <div className="contacto-reparto">
            {/* ---- Formulario ---- */}
            <form
              className="formulario"
              onSubmit={(e) => {
                e.preventDefault();
                enviar('whatsapp');
              }}
              noValidate
            >
              <p className="formulario__ayuda">
                Solo el nombre y el mensaje son obligatorios. Lo demás me ayuda a contestarte mejor, pero si
                prefieres no ponerlo, adelante.
              </p>

              <div className="campo">
                <label htmlFor="nombre">
                  Tu nombre <span aria-hidden="true">*</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  required
                  value={datos.nombre}
                  onChange={cambiar('nombre')}
                  aria-invalid={tocado && datos.nombre.trim().length < 2}
                  aria-describedby={tocado && datos.nombre.trim().length < 2 ? 'error-nombre' : undefined}
                />
                {/* `aria-live` porque hasta ahora el error existía para el
                    ojo y no para quien usa lector de pantalla: el
                    `aria-invalid` solo se oye si vuelves a enfocar el
                    campo. `polite` y no `assertive`: corriges cuando
                    termines la frase, no a media palabra. */}
                {tocado && datos.nombre.trim().length < 2 && (
                  <p className="campo__error" id="error-nombre" aria-live="polite">
                    Escribe tu nombre para saber cómo dirigirme a ti.
                  </p>
                )}
              </div>

              <div className="campo">
                <label htmlFor="negocio">Tu negocio</label>
                <input
                  id="negocio"
                  name="negocio"
                  type="text"
                  autoComplete="organization"
                  placeholder="Pastelería, taller, consultorio…"
                  value={datos.negocio}
                  onChange={cambiar('negocio')}
                />
              </div>

              <div className="campo campo--doble">
                <div>
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={datos.telefono}
                    onChange={cambiar('telefono')}
                  />
                </div>
                <div>
                  <label htmlFor="correo">Correo</label>
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={datos.correo}
                    onChange={cambiar('correo')}
                  />
                </div>
              </div>

              <div className="campo">
                <label htmlFor="servicio">¿Qué necesitas?</label>
                <select id="servicio" name="servicio" value={datos.servicio} onChange={cambiar('servicio')}>
                  <option value="">Elige una opción</option>
                  {SERVICIOS_CONTACTO.map((s) => (
                    <option key={s.valor} value={s.valor}>
                      {s.etiqueta}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label htmlFor="mensaje">
                  Cuéntame un poco más <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  required
                  placeholder="Qué hace tu negocio, qué te está costando trabajo hoy y qué te gustaría lograr."
                  value={datos.mensaje}
                  onChange={cambiar('mensaje')}
                  aria-invalid={tocado && datos.mensaje.trim().length < 5}
                  aria-describedby={tocado && datos.mensaje.trim().length < 5 ? 'error-mensaje' : undefined}
                />
                {tocado && datos.mensaje.trim().length < 5 && (
                  <p className="campo__error" id="error-mensaje" aria-live="polite">
                    Con dos líneas me basta para saber por dónde empezar.
                  </p>
                )}
              </div>

              <div className="campo">
                <label htmlFor="presupuesto">Presupuesto aproximado</label>
                <select id="presupuesto" name="presupuesto" value={datos.presupuesto} onChange={cambiar('presupuesto')}>
                  {PRESUPUESTOS.map((p) => (
                    <option key={p.etiqueta} value={p.valor}>
                      {p.etiqueta}
                    </option>
                  ))}
                </select>
                <p className="campo__pista">
                  No es para cobrarte más. Es para proponerte algo que de verdad te alcance.
                </p>
              </div>

              <div className="formulario__acciones">
                <button type="submit" className="tactile-button tactile-button--glow tactile-button--large">
                  <MessageCircle size={17} aria-hidden="true" />
                  Enviar por WhatsApp
                </button>
                <button
                  type="button"
                  className="tactile-button tactile-button--paper tactile-button--large"
                  onClick={() => enviar('correo')}
                >
                  <Mail size={17} aria-hidden="true" />
                  Enviar por correo
                </button>
              </div>

              {/* Debajo de los botones, no dentro: los `.tactile-button`
                  conservan su hover y su hundimiento tal cual estaban. */}
              <AcuseEnvio acuse={enviado} />

              <p className="formulario__nota">
                Se abre tu WhatsApp o tu correo con el mensaje ya escrito. Tú lo revisas antes de mandarlo, así que
                nada sale sin que lo veas.
              </p>
            </form>

            {/* ---- Otras vías ---- */}
            <aside className="contacto-lateral">
              <Reveal>
                <div className="contacto-directo">
                  <h2>O escríbeme directo</h2>
                  <ul>
                    <li>
                      <MessageCircle size={17} aria-hidden="true" />
                      <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer" onClick={() => trackWhatsApp('contacto-directo')}>
                        WhatsApp · {CONTACT.phone}
                      </a>
                    </li>
                    <li>
                      <Phone size={17} aria-hidden="true" />
                      <a href={`tel:+${CONTACT.whatsapp}`}>Llamar · {CONTACT.phone}</a>
                    </li>
                    <li>
                      <Mail size={17} aria-hidden="true" />
                      <a href={gmailUrl(CONTACT.email)} target="_blank" rel="noreferrer">
                        {CONTACT.email}
                      </a>
                    </li>
                  </ul>
                  <p className="contacto-directo__pie">{CONTACT.location}</p>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="contacto-esperar">
                  <h2>Qué pasa después</h2>
                  {/* El `Reveal` de arriba sigue trayendo el bloque entero y
                      no se toca. El `--i` es para que, dentro, el filete de
                      cada escalón se dibuje uno detrás de otro por CSS:
                      otra propiedad, otra animación, no se pisan. */}
                  <ol>
                    <li style={{ '--i': 0 }}>Te contesto yo, no un correo automático.</li>
                    <li style={{ '--i': 1 }}>Si hace falta, hacemos una llamada corta para entender el proyecto.</li>
                    <li style={{ '--i': 2 }}>Te mando una propuesta con alcance y precio cerrado.</li>
                    <li style={{ '--i': 3 }}>Si te sirve, arrancamos. Si no, no pasa nada.</li>
                  </ol>
                  <p>No hay insistencia ni seguimiento incómodo. Si no contestas, lo entiendo.</p>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </Seccion>
    </>
  );
}
