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
  BestMomentVisual,
  ConfettiVisual,
  EnlacesVisual,
  FiestaVisual,
  GestechVisual,
  GlyphosVisual,
  HipicoVisual,
  ImaginationVisual,
  Jch3dVisual,
  JchBaileVisual,
  JchCrmVisual,
  JchPortalVisual,
  MorphiqPosVisual,
  MorphiqUiVisual,
  NfcVisual,
  PhotoBoothVisual,
  VeroVisual,
  XaviVisual,
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
  ['jch-crm', JchCrmVisual],
  ['jch-portal', JchPortalVisual],
  ['glyphos', GlyphosVisual],
  ['the-best-moment', BestMomentVisual],
  ['enlaces', EnlacesVisual],
  ['morphiqpos', MorphiqPosVisual],
  ['jch-3d', Jch3dVisual],
  ['jch-baile', JchBaileVisual],
  ['thexavimtz', XaviVisual],
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
