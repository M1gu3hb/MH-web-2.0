/**
 * Aviso previo a abrir WhatsApp, el correo o una llamada.
 *
 * Todo enlace que saca a la persona hacia uno de esos tres canales pasa por
 * una ventana de confirmación que le dice qué va a pasar: un asesor del
 * equipo se pondrá en contacto para ayudarle. La ventana vive en
 * `components/layout/AvisoContacto.jsx`; este módulo solo decide QUÉ enlaces
 * cuentan como canal de contacto y cómo se le pide el aviso desde código
 * (el formulario de /contacto abre su enlace sin pasar por un `<a>`).
 */

export const EVENTO_AVISO = 'morphiq:aviso-contacto';

const CANALES = [
  { canal: 'whatsapp', prueba: /^https:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i },
  { canal: 'correo', prueba: /^(mailto:|https:\/\/mail\.google\.com\/mail\/)/i },
  { canal: 'llamada', prueba: /^tel:/i },
];

/** 'whatsapp' | 'correo' | 'llamada' | null según a dónde lleva el enlace. */
export function canalDeEnlace(href) {
  if (typeof href !== 'string') return null;
  const limpio = href.trim();
  return CANALES.find((c) => c.prueba.test(limpio))?.canal ?? null;
}

/**
 * Pide la ventana de confirmación para un enlace. Devuelve `false` si el
 * enlace no es de contacto, para que quien llama lo abra como siempre.
 * `alContinuar` se ejecuta cuando la persona confirma.
 */
export function pedirAvisoContacto({ href, alContinuar } = {}) {
  const canal = canalDeEnlace(href);
  if (!canal || typeof window === 'undefined') return false;
  window.dispatchEvent(new CustomEvent(EVENTO_AVISO, { detail: { href, canal, alContinuar } }));
  return true;
}
