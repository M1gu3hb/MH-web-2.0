import { track } from '@vercel/analytics';
import { CONTACT, WHATSAPP_MESSAGES } from '../content';

/**
 * Construye el enlace de WhatsApp con un mensaje distinto por origen,
 * para poder saber qué CTA convierte.
 */
export function whatsappUrl(source = 'hero') {
  const message = WHATSAPP_MESSAGES[source] ?? WHATSAPP_MESSAGES.hero;
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Registra el clic antes de que el navegador salga hacia WhatsApp. */
export function trackWhatsApp(source) {
  try {
    track('whatsapp_click', { source });
  } catch {
    // La analítica nunca debe romper una conversión.
  }
}
