/**
 * Componentes de interfaz animados inspirados en los patrones de ReactBits
 * (reactbits.dev), reescritos para esta base de código: sin dependencias
 * extra, con la paleta de Astral Morphiq Systems y respetando en todos los casos
 * `prefers-reduced-motion`.
 *
 * Cinco de ellos —BordeElectrico, CampoPuntos, DesenfoqueProgresivo,
 * MarcoExpansivo y TextoProfundo— parten del código publicado de React Bits
 * (MIT + Commons Clause, uso comercial permitido) y están adaptados: color de
 * marca, pausa fuera de pantalla y con la pestaña oculta, y salida limpia sin
 * puntero fino o con movimiento reducido. La cabecera de cada archivo dice
 * qué se conservó y qué se cambió.
 */
export { BlurText } from './BlurText';
export { BordeElectrico } from './BordeElectrico';
export { CampoPuntos } from './CampoPuntos';
export { ClickSpark } from './ClickSpark';
export { CountUp } from './CountUp';
export { CountUpSeguro } from './CountUpSeguro';
export { DecryptedText } from './DecryptedText';
export { DesenfoqueProgresivo } from './DesenfoqueProgresivo';
export { DotGrid } from './DotGrid';
export { GlareHover } from './GlareHover';
export { Magnet } from './Magnet';
export { MarcoExpansivo } from './MarcoExpansivo';
export { Marquee } from './Marquee';
export { MorphStage } from './MorphStage';
export { Reveal } from './Reveal';
export { RippleDistortion } from './RippleDistortion';
export { Scanner } from './Scanner';
export { ScrambleLines, ScrambleText } from './ScrambleText';
export { ScrollReveal } from './ScrollReveal';
export { ShinyText } from './ShinyText';
export { SplitText } from './SplitText';
export { SpotlightCard } from './SpotlightCard';
export { StarBorder } from './StarBorder';
export { TextoProfundo } from './TextoProfundo';
export { TiltedCard } from './TiltedCard';

/* Beams NO se exporta desde aquí a propósito.
   Este barril lo importa medio sitio de forma estática, así que reexportar
   Beams convertía su `lazy()` en papel mojado: three.js, react-three-fiber y
   drei entraban en el trozo principal, que descargan TODAS las páginas y
   TODOS los dispositivos —incluido escritorio, donde Beams ni se monta—. El
   trozo pasaba de 99 KB a 325 KB en gzip.
   El hero lo importa por su ruta directa: '../reactbits/Beams'. */
