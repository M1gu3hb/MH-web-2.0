/**
 * Enlaces de correo que abren el redactor de Gmail en una pestaña, en lugar
 * de depender de que el visitante tenga un cliente de correo configurado:
 * en la práctica casi nadie lo tiene y el mailto moría en silencio.
 */
export function gmailUrl(to, subject = '', body = '') {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to });
  if (subject) params.set('su', subject);
  if (body) params.set('body', body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}
