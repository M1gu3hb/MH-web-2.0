/**
 * ============================================================
 * PERSONALIZA — el sistema con tu piel, aquí mismo
 * ============================================================
 *
 * La frase «100 % personalizado» la dice cualquiera. Esto la demuestra: el
 * visitante escribe el nombre de su negocio, elige un color, un estilo y un
 * modo, y la pantalla del sistema cambia en el acto.
 *
 * Y la pantalla se usa (`CajaViva`): se tocan los productos, se cobra y sale
 * un ticket con ese nombre y ese color. Ver tu marca en una caja está bien;
 * venderle algo a alguien con ella es otra cosa.
 *
 * Los ocho estilos son los que el sistema trae de verdad, con sus nombres.
 * Aquí cada uno se resuelve a un puñado de variables —radio, tipografía,
 * tratamiento de las superficies— porque es lo que se alcanza a enseñar en
 * una pantalla de demostración; en el producto cada estilo es bastante más.
 *
 * ACCESIBILIDAD
 * Son controles nativos: un campo de texto, tres grupos de `radio` y un
 * selector de color. Se recorren con teclado sin una línea de código extra,
 * y el nombre que se escribe nunca sale de esta página. La caja es un grupo
 * con nombre y todo lo que hay dentro son botones.
 */

import { useId, useMemo, useState } from 'react';

import { CajaViva } from './CajaViva';
import { POS_COLORES, POS_ESTILOS } from '../../content/morphiqpos';

/* Luminancia relativa, para decidir si sobre el acento va texto claro u
   oscuro. Un amarillo con letra blanca no se lee. */
function sobre(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return '#ffffff';
  const [r, g, b] = [1, 2, 3].map((i) => {
    const c = parseInt(m[i], 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.36 ? '#0b0d12' : '#ffffff';
}

const FUENTES = {
  cuerpo: ['var(--font-body)', 'var(--font-display)'],
  display: ['var(--font-body)', 'var(--font-brand)'],
  mono: ['var(--font-mono)', 'var(--font-mono)'],
};

/* La piel: de (estilo, color, modo) a las variables del kit. */
function piel(estilo, color, claro) {
  const [fuente, titulo] = FUENTES[estilo.fuente];
  const base = claro
    ? { fondo: '#eef0f4', sup: '#ffffff', sup2: '#ffffff', linea: 'rgba(12, 16, 24, 0.13)', texto: '#12151b', sutil: '#5d6471' }
    : { fondo: '#0c0f15', sup: '#141921', sup2: '#1c222d', linea: 'rgba(233, 236, 241, 0.1)', texto: '#e9ecf1', sutil: '#8b919d' };

  const porSuperficie = {
    vidrio: claro
      ? { fondo: `color-mix(in srgb, ${color} 14%, #eef0f4)`, sup: 'rgba(255, 255, 255, 0.62)', sup2: 'rgba(255, 255, 255, 0.9)' }
      : { fondo: `color-mix(in srgb, ${color} 20%, #090b10)`, sup: 'rgba(255, 255, 255, 0.07)', sup2: 'rgba(40, 46, 60, 0.92)', linea: 'rgba(255, 255, 255, 0.17)' },
    relieve: claro ? { fondo: '#e4e7ec', sup: '#eef0f4' } : { fondo: '#161a21', sup: '#1c2129', sup2: '#232934' },
    bloque: { linea: claro ? '#12151b' : '#e9ecf1' },
    linea: claro
      ? { fondo: '#f7f8f3', sup: 'transparent', linea: `color-mix(in srgb, ${color} 55%, #12151b)` }
      : { fondo: '#04060a', sup: 'transparent', sup2: '#0a0d13', linea: `color-mix(in srgb, ${color} 55%, transparent)`, texto: `color-mix(in srgb, ${color} 30%, #f1f4f8)` },
    papel: claro
      ? { fondo: '#f1ece1', sup: '#fbf8f1', sup2: '#fffdf8', texto: '#221f1a', sutil: '#746c5f', linea: 'rgba(34, 31, 26, 0.16)' }
      : { fondo: '#16130f', sup: '#1e1a15', sup2: '#27221b', texto: '#efe8da', sutil: '#9a917f', linea: 'rgba(239, 232, 218, 0.12)' },
    noche: claro ? {} : { fondo: '#000000', sup: '#0a0a0c', sup2: '#121216', linea: 'rgba(255, 255, 255, 0.08)' },
    solida: {},
  }[estilo.superficie];

  const c = { ...base, ...porSuperficie };
  return {
    '--pv-fondo': c.fondo,
    '--pv-sup': c.sup,
    '--pv-sup2': c.sup2,
    '--pv-linea': c.linea,
    '--pv-texto': c.texto,
    '--pv-sutil': c.sutil,
    '--pv-acento': color,
    '--pv-sobre-acento': sobre(color),
    '--pv-radio': `${estilo.radio / 16}em`,
    '--pv-fuente': fuente,
    '--pv-titulo': titulo,
  };
}

export function Personaliza() {
  const id = useId();
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState(POS_COLORES[1].valor);
  const [estiloId, setEstiloId] = useState('morphiq');
  const [claro, setClaro] = useState(false);

  const estilo = POS_ESTILOS.find((e) => e.id === estiloId);
  const variables = useMemo(() => piel(estilo, color, claro), [estilo, color, claro]);
  const visible = nombre.trim() || 'Tu negocio';

  return (
    <div className="personaliza">
      <form className="personaliza__controles" onSubmit={(e) => e.preventDefault()}>
        <div className="personaliza__campo">
          <label htmlFor={`${id}-nombre`}>
            <span className="personaliza__paso">01</span> ¿Cómo se llama tu negocio?
          </label>
          <input
            id={`${id}-nombre`}
            type="text"
            value={nombre}
            maxLength={18}
            placeholder="Tu negocio"
            autoComplete="off"
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <fieldset className="personaliza__campo">
          <legend>
            <span className="personaliza__paso">02</span> Su color
          </legend>
          <div className="personaliza__colores">
            {POS_COLORES.map((c) => (
              <label key={c.id} className="personaliza__color" style={{ '--c': c.valor }}>
                <input type="radio" name={`${id}-color`} checked={color === c.valor} onChange={() => setColor(c.valor)} />
                <span className="rb-visually-hidden">{c.nombre}</span>
              </label>
            ))}
            <label className="personaliza__color personaliza__color--libre" style={{ '--c': color }}>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
              <span className="rb-visually-hidden">Otro color</span>
            </label>
          </div>
        </fieldset>

        <fieldset className="personaliza__campo">
          <legend>
            <span className="personaliza__paso">03</span> Un estilo
          </legend>
          <div className="personaliza__estilos">
            {POS_ESTILOS.map((e) => (
              <label key={e.id} className="personaliza__estilo">
                <input type="radio" name={`${id}-estilo`} checked={estiloId === e.id} onChange={() => setEstiloId(e.id)} />
                <span>{e.nombre}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="personaliza__campo">
          <legend>
            <span className="personaliza__paso">04</span> De día o de noche
          </legend>
          <div className="personaliza__estilos personaliza__estilos--dos">
            <label className="personaliza__estilo">
              <input type="radio" name={`${id}-modo`} checked={!claro} onChange={() => setClaro(false)} />
              <span>Oscuro</span>
            </label>
            <label className="personaliza__estilo">
              <input type="radio" name={`${id}-modo`} checked={claro} onChange={() => setClaro(true)} />
              <span>Claro</span>
            </label>
          </div>
        </fieldset>

        <p className="personaliza__vende">
          <span className="personaliza__paso">05</span> Ahora véndele algo: toca los productos, cobra y mira salir el ticket con tu marca.
        </p>
      </form>

      <div
        className={`personaliza__vista personaliza__vista--${estilo.superficie}`}
        role="group"
        aria-label={`La caja de ${visible}, en estilo ${estilo.nombre} y modo ${claro ? 'claro' : 'oscuro'}. Agrega productos y cobra.`}
      >
        <CajaViva negocio={visible} estilo={variables} />
        <p className="personaliza__pie" aria-hidden="true">
          estilo: {estilo.id} · color: {color} · modo: {claro ? 'claro' : 'oscuro'}
        </p>
      </div>
    </div>
  );
}
