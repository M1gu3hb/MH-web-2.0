import { ArrowUpRight, FileText } from 'lucide-react';

/* Logos de las apps del flujo, incrustados: son tres trazos pequeños y así
   la maqueta no depende de ninguna librería de marcas. */
function GmailLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.908 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
      />
    </svg>
  );
}

function WhatsAppLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#25D366"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
      />
    </svg>
  );
}

function SheetsLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="1.5" width="18" height="21" rx="2.4" fill="#0F9D58" />
      <path
        fill="#fff"
        d="M7 8.5h10v9H7zm1.6 1.6v1.6h2.6v-1.6zm4.2 0v1.6h2.6v-1.6zm-4.2 3.2v1.6h2.6v-1.6zm4.2 0v1.6h2.6v-1.6z"
      />
    </svg>
  );
}

/**
 * Maquetas ilustrativas de cada capacidad. Son dibujos, no información:
 * el contenedor de cada una se marca aria-hidden en el consumidor.
 */

export function WebsiteScreen() {
  return (
    <div className="demo demo--website">
      <div className="demo-browser">
        <span><i /><i /><i /></span>
        <em>tu-negocio.mx</em>
        <b>PUBLICADO</b>
      </div>
      <div className="website-canvas">
        <small>UNA MARCA CON PUNTO DE VISTA</small>
        <strong>Lo primero que ven.<br />Lo último que olvidan.</strong>
        <span>Explorar <ArrowUpRight size={13} /></span>
        <div className="website-orb" />
      </div>
    </div>
  );
}

export function PosScreen() {
  return (
    <div className="demo demo--pos">
      <div className="pos-head">
        <span><i /> CAJA ABIERTA</span>
        <strong>$ 1,248.00</strong>
      </div>
      <div className="pos-body">
        <div className="pos-ticket">
          <small>ORDEN #0284</small>
          <span><b>2</b> Producto especial <em>$420</em></span>
          <span><b>1</b> Servicio adicional <em>$280</em></span>
          <span><b>3</b> Complemento <em>$548</em></span>
          <strong>TOTAL <em>$1,248</em></strong>
        </div>
        <div className="pos-pad">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((number) => <i key={number}>{number}</i>)}
          <span className="pos-pad__action">Cobrar</span>
        </div>
      </div>
    </div>
  );
}

export function CrmScreen() {
  /* Una ficha de cliente, que es como se usa un CRM de verdad: quién es, en
     qué va, qué se hizo y qué toca hacer. El tablero de columnas anterior
     era abstracto: sin conocer la herramienta no se entendía qué miraba. */
  const historial = [
    ['Cotización enviada', '12 jul'],
    ['Llamada de seguimiento', '15 jul'],
    ['Anticipo recibido', '18 jul'],
  ];

  return (
    <div className="demo demo--crm">
      <div className="crm-barra">
        <span>CLIENTES</span>
        <em>3 de 48</em>
      </div>

      <div className="crm-ficha">
        <div className="crm-ficha__quien">
          <i>PC</i>
          <div>
            <b>Pastelería Confetti</b>
            <small>Alta el 4 de julio &middot; Tres sucursales</small>
          </div>
          <span className="crm-chip">Cliente activo</span>
        </div>

        <div className="crm-datos">
          <span><small>Contacto</small><b>55 •• •• 41</b></span>
          <span><small>Último pedido</small><b>$ 8,400</b></span>
          <span><small>Total del año</small><b>$ 96,200</b></span>
        </div>

        <div className="crm-historial">
          <small>Historial</small>
          {historial.map(([que, cuando], i) => (
            <span key={que} className={i === historial.length - 1 ? 'es-ultimo' : ''}>
              <i />
              <b>{que}</b>
              <em>{cuando}</em>
            </span>
          ))}
        </div>

        <div className="crm-tarea">
          <i />
          <b>Siguiente: confirmar entrega del viernes</b>
          <em>Hoy</em>
        </div>
      </div>
    </div>
  );
}

export function AutomationScreen() {
  /* Un lienzo de flujo al estilo n8n: dos disparadores a la izquierda
     (correo y pedido web), el nodo Morphiq decidiendo en el centro y dos
     salidas a la derecha (WhatsApp y hoja de cálculo). Las posiciones van en
     porcentaje y los cables comparten el mismo sistema de coordenadas, así
     el dibujo se adapta al hueco que le den, en PC o en teléfono. */
  return (
    <div className="demo demo--n8n">
      <div className="n8n-fondo" aria-hidden="true" />
      <svg className="n8n-cables" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 26 26 C 38 26 37 46 46 48" />
        <path d="M 26 76 C 38 76 37 56 46 53" />
        <path d="M 60 48 C 72 46 70 26 80 24" />
        <path d="M 60 53 C 72 55 70 74 80 76" />
      </svg>

      <span className="n8n-nodo" style={{ left: '17%', top: '26%' }}>
        <span className="n8n-icono"><GmailLogo /></span>
        <span className="n8n-texto"><b>Correo nuevo</b><small>Gmail · disparador</small></span>
      </span>
      <span className="n8n-nodo" style={{ left: '17%', top: '76%' }}>
        <span className="n8n-icono n8n-icono--form"><FileText size={13} aria-hidden="true" /></span>
        <span className="n8n-texto"><b>Pedido en la web</b><small>Formulario</small></span>
      </span>
      <span className="n8n-nodo n8n-nodo--centro" style={{ left: '50%', top: '50%' }}>
        <span className="n8n-icono n8n-icono--mh">
          <img src="/marca/simbolo-v2-sm.webp" alt="" width="160" height="162" />
        </span>
        <span className="n8n-texto"><b>Clasificar cliente</b><small>Morphiq · flujo</small></span>
      </span>
      <span className="n8n-nodo" style={{ left: '83%', top: '24%' }}>
        <span className="n8n-icono"><WhatsAppLogo /></span>
        <span className="n8n-texto"><b>Responder</b><small>WhatsApp</small></span>
      </span>
      <span className="n8n-nodo" style={{ left: '83%', top: '76%' }}>
        <span className="n8n-icono"><SheetsLogo /></span>
        <span className="n8n-texto"><b>Registrar venta</b><small>Hoja de cálculo</small></span>
      </span>

      <span className="n8n-estado"><i /> Flujo operando</span>
    </div>
  );
}


export function SoftwareScreen() {
  const files = ['main.py', 'camara.py', 'gestos.py', 'ui/overlay.tsx'];
  return (
    <div className="demo demo--software">
      <div className="software-bar">
        <span><i /><i /><i /></span>
        <em>app de escritorio · build</em>
        <b>v2.4.0</b>
      </div>
      <div className="software-body">
        <div className="software-files">
          {files.map((f, i) => (
            <span key={f} className={i === 2 ? 'active' : ''}>{f}</span>
          ))}
        </div>
        <div className="software-code">
          <p><i>01</i><b>class</b> Gesto<b>:</b></p>
          <p><i>02</i>  <b>def</b> leer(self, mano)<b>:</b></p>
          <p><i>03</i>    puntos = mano.landmarks()</p>
          <p><i>04</i>    <b>return</b> self.clasificar(puntos)</p>
          <p><i>05</i></p>
          <span className="software-run">▶ compilado en 1.2 s</span>
        </div>
      </div>
      <div className="software-foot">
        <span><i /> Escritorio</span>
        <span><i /> Web</span>
        <span><i /> Sin internet</span>
      </div>
    </div>
  );
}
