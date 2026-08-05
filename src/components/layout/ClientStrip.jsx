import { Marquee } from '../reactbits';
import { CLIENT_MARQUEE } from '../../content';

/** Prueba social inmediata, justo debajo del pliegue. */
export function ClientStrip() {
  return (
    <div className="client-strip">
      <p className="client-strip__label">Negocios que ya operan con esto</p>
      <Marquee items={CLIENT_MARQUEE} speed={38} />
    </div>
  );
}
