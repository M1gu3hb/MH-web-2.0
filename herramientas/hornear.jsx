/**
 * El banco de horneado: pinta cada ilustración de caso a su tamaño natural,
 * suelta y sin nada alrededor, para que el fotógrafo headless recorte
 * exactamente el dibujo.
 *
 * Cada pieza va dentro de un `.horno-pieza` con las medidas del lienzo real
 * —760 × 750— porque varias maquetas reparten su contenido con grid y
 * dependen de tener esa altura resuelta. Si se dejaran crecer libres, el
 * reparto saldría distinto del que se diseñó.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/styles/index.css';
import {
  AcademicoVisual,
  BerlinVisual,
  ConfettiVisual,
  FiestaVisual,
  GestechVisual,
  HipicoVisual,
  ImaginationVisual,
  MorphiqUiVisual,
  NfcVisual,
  PhotoBoothVisual,
  QyroVisual,
  VeroVisual,
} from '../src/components/mockups/ProjectVisuals';

/* El nombre es el del archivo que se escribe en public/casos/. */
const PIEZAS = [
  ['confetti', ConfettiVisual],
  ['hipico', HipicoVisual],
  ['fiesta', FiestaVisual],
  ['berlin', BerlinVisual],
  ['gestech', GestechVisual],
  ['photobooth', PhotoBoothVisual],
  ['imagination', ImaginationVisual],
  ['vero', VeroVisual],
  ['nfc', NfcVisual],
  ['academico', AcademicoVisual],
  ['morphiq-ui', MorphiqUiVisual],
  ['qyro', QyroVisual],
];

function Horno() {
  return (
    <div className="horno">
      {PIEZAS.map(([nombre, Pieza]) => (
        <div className="horno-pieza" data-pieza={nombre} key={nombre}>
          <Pieza />
        </div>
      ))}
    </div>
  );
}

createRoot(document.getElementById('horno')).render(
  <StrictMode>
    <Horno />
  </StrictMode>
);
