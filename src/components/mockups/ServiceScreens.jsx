import { ArrowUpRight } from 'lucide-react';

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
  const columns = [
    ['NUEVO', 'Confetti', 'Berlín'],
    ['PROPUESTA', 'Club Hípico'],
    ['LISTO', "Fiesta DJ's"],
  ];

  return (
    <div className="demo demo--crm">
      <div className="crm-head">
        <span>PIPELINE / JULIO</span>
        <strong>Todo visible</strong>
        <i />
      </div>
      <div className="crm-board">
        {columns.map(([title, ...items], index) => (
          <div key={title}>
            <small>{title}<em>0{items.length}</em></small>
            {items.map((item) => (
              <span key={item}>
                <i>{item.slice(0, 2).toUpperCase()}</i>
                <b>{item}</b>
                <em>{index === 2 ? '100%' : index === 1 ? '68%' : '24%'}</em>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AutomationScreen() {
  return (
    <div className="demo demo--automation">
      <div className="automation-grid" />
      <div className="automation-flow">
        <span className="flow-node flow-node--start"><i /> Nueva solicitud</span>
        <span className="flow-line flow-line--one" />
        <span className="flow-node flow-node--decision">Validar datos <b>✓</b></span>
        <span className="flow-line flow-line--two" />
        <span className="flow-node flow-node--doc">Generar documento <i>PDF</i></span>
        <span className="flow-line flow-line--three" />
        <span className="flow-node flow-node--end"><i /> WhatsApp enviado</span>
      </div>
      <span className="automation-status"><i /> Flujo operando</span>
    </div>
  );
}

