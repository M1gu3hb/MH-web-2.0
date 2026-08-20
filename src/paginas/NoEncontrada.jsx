import { CabeceraPagina, BotonPrincipal, BotonSecundario, Contenedor, Seccion, TarjetaServicio } from '../components/ui';
import { Seo } from '../lib/seo';
import { SERVICIOS } from '../content/servicios';
import { RUTAS } from '../config/rutas';

/**
 * El 404 no es un callejón: es otro sitio desde donde elegir.
 * Se marca `noindex` porque una página de error no aporta nada al índice,
 * pero `follow` para que los enlaces de aquí sí se sigan.
 */
export default function NoEncontrada() {
  return (
    <>
      <Seo
        title="Página no encontrada | Morphiq"
        description="La página que buscas no existe o cambió de dirección."
        path="/404"
        noindex
      />

      <CabeceraPagina
        eyebrow="Error 404"
        titulo="Esta página no existe."
        entrada="O cambió de sitio. Desde aquí puedes seguir a donde ibas."
        acciones={
          <>
            <BotonPrincipal to={RUTAS.inicio} grande>
              Ir al inicio
            </BotonPrincipal>
            <BotonSecundario to={RUTAS.contacto} grande>
              Contactar
            </BotonSecundario>
          </>
        }
      />

      <Seccion>
        <Contenedor>
          <div className="rejilla-servicios">
            {SERVICIOS.map((s) => (
              <TarjetaServicio key={s.id} servicio={s} />
            ))}
          </div>
        </Contenedor>
      </Seccion>
    </>
  );
}
