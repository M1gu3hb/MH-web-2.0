/**
 * La ventana de confirmación que se interpone entre un clic en WhatsApp,
 * correo o llamada y la app de destino.
 *
 * QUÉ HACE
 * Escucha los clics de TODO el documento en fase de captura. Si el enlace
 * pulsado lleva a un canal de contacto (ver `canalDeEnlace`), cancela la
 * navegación y abre un `<dialog>` que avisa de que un asesor del equipo se
 * pondrá en contacto. Solo si la persona pulsa «Continuar» se abre el canal.
 *
 * POR QUÉ ASÍ Y NO ENLACE POR ENLACE
 * Hay más de veinte enlaces de contacto repartidos por el sitio (menú, pie,
 * cierres de página, botón flotante, contacto…). Cablear cada uno es la
 * manera de que el siguiente que se añada se olvide de la ventana. Con un
 * solo oyente, cualquier enlace nuevo a wa.me, Gmail o tel: ya la lleva.
 *
 * DETALLES QUE IMPORTAN
 * · «Continuar» es un `<a>` de verdad, no un `window.open`: es un clic de
 *   la persona sobre un enlace, así que ningún navegador lo trata como
 *   ventana emergente y en el teléfono abre la app directamente.
 * · Solo se cancela la navegación (`preventDefault`), no se detiene la
 *   propagación: los `onClick` que ya medían el clic siguen funcionando.
 * · Los clics con Ctrl, Cmd o Mayús, o con otro botón, se dejan pasar: es
 *   quien decide abrirlo en otra pestaña por su cuenta.
 * · Un enlace puede excluirse con `data-sin-aviso` (lo usa el propio botón
 *   «Continuar» y el enlace de rescate del formulario).
 * · Es un `<dialog>` nativo: el foco queda atrapado, Escape cierra y el
 *   resto del documento queda inerte sin una línea de código.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { EVENTO_AVISO, canalDeEnlace } from '../../lib/avisoContacto';

const CANALES = {
  whatsapp: {
    Icono: MessageCircle,
    texto: 'Al continuar se abre WhatsApp y un asesor de nuestro equipo se pondrá en contacto contigo para ayudarte.',
  },
  correo: {
    Icono: Mail,
    texto: 'Al continuar se abre tu correo y un asesor de nuestro equipo se pondrá en contacto contigo para ayudarte.',
  },
  llamada: {
    Icono: Phone,
    texto: 'Al continuar se inicia la llamada y un asesor de nuestro equipo te atenderá para ayudarte.',
  },
};

function medir(accion, canal) {
  try {
    track('aviso_contacto', { accion, canal });
  } catch {
    /* La analítica nunca debe romper una conversión. */
  }
}

export function AvisoContacto() {
  const [pendiente, setPendiente] = useState(null);
  const dialogo = useRef(null);
  const continuar = useRef(null);

  /* Clic en cualquier enlace de contacto del documento. */
  useEffect(() => {
    const alHacerClic = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const origen = e.target instanceof Element ? e.target : null;
      const enlace = origen?.closest('a[href]');
      if (!enlace || enlace.hasAttribute('data-sin-aviso') || enlace.closest('dialog')) return;
      const href = enlace.getAttribute('href');
      const canal = canalDeEnlace(href);
      if (!canal) return;
      e.preventDefault();
      setPendiente({ href, canal, blank: enlace.target === '_blank' });
    };
    document.addEventListener('click', alHacerClic, true);
    return () => document.removeEventListener('click', alHacerClic, true);
  }, []);

  /* Petición desde código (el formulario de contacto). */
  useEffect(() => {
    const alPedir = (e) => {
      const { href, canal, alContinuar } = e.detail ?? {};
      if (!href || !canal) return;
      setPendiente({ href, canal, blank: canal !== 'llamada', alContinuar });
    };
    window.addEventListener(EVENTO_AVISO, alPedir);
    return () => window.removeEventListener(EVENTO_AVISO, alPedir);
  }, []);

  /* El estado manda sobre el `<dialog>`: abre y cierra el nativo. */
  useEffect(() => {
    const nodo = dialogo.current;
    if (!nodo) return;
    if (pendiente && !nodo.open) {
      nodo.showModal();
      continuar.current?.focus();
      medir('visto', pendiente.canal);
    } else if (!pendiente && nodo.open) {
      nodo.close();
    }
  }, [pendiente]);

  const cerrar = useCallback(() => setPendiente(null), []);

  const cancelar = useCallback(() => {
    if (pendiente) medir('cancelado', pendiente.canal);
    setPendiente(null);
  }, [pendiente]);

  const aceptar = () => {
    if (!pendiente) return;
    medir('continuado', pendiente.canal);
    try {
      pendiente.alContinuar?.();
    } finally {
      setPendiente(null);
    }
  };

  const canal = pendiente ? CANALES[pendiente.canal] : null;
  const Icono = canal?.Icono;

  return (
    <dialog
      ref={dialogo}
      className="aviso-contacto"
      aria-labelledby="aviso-contacto-titulo"
      aria-describedby="aviso-contacto-texto"
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault();
        cancelar();
      }}
      onClose={cerrar}
      onClick={(e) => {
        /* Un clic sobre el telón (el propio `<dialog>`, fuera de la caja)
           equivale a cancelar. */
        if (e.target === dialogo.current) cancelar();
      }}
    >
      {pendiente && (
        <div className="aviso-contacto__caja">
          <span className="aviso-contacto__icono" aria-hidden="true">
            <Icono size={22} />
          </span>
          <h2 id="aviso-contacto-titulo" className="aviso-contacto__titulo">
            Un asesor te atenderá
          </h2>
          <p id="aviso-contacto-texto" className="aviso-contacto__texto">
            {canal.texto}
          </p>
          <div className="aviso-contacto__acciones">
            <button type="button" className="tactile-button tactile-button--paper" onClick={cancelar}>
              Cancelar
            </button>
            <a
              ref={continuar}
              className="tactile-button tactile-button--glow"
              href={pendiente.href}
              {...(pendiente.blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              data-sin-aviso=""
              onClick={aceptar}
            >
              Continuar
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}
