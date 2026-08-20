import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Layout } from './components/layout/Layout';
import { RUTAS } from './config/rutas';
import './styles/index.css';

/**
 * Cada ruta viaja en su propio trozo.
 *
 * Con importación estática, todo lo que necesita la home —incluido el
 * símbolo por capas— se descargaba también al abrir /precios o /contacto,
 * que son justo las páginas donde se decide la venta y donde cada
 * milisegundo cuenta. Con `lazy` cada página paga solo lo suyo.
 *
 * La home se importa de forma estática a propósito: es la entrada más
 * frecuente y no tiene sentido cobrarle una petición extra.
 */
import Inicio from './paginas/Inicio';

const Servicios = lazy(() => import('./paginas/Servicios'));
const ServicioDetalle = lazy(() => import('./paginas/ServicioDetalle'));
const Precios = lazy(() => import('./paginas/Precios'));
const Proyectos = lazy(() => import('./paginas/Proyectos'));
const ProyectoDetalle = lazy(() => import('./paginas/ProyectoDetalle'));
const Sobre = lazy(() => import('./paginas/Sobre'));
const Contacto = lazy(() => import('./paginas/Contacto'));
const NoEncontrada = lazy(() => import('./paginas/NoEncontrada'));

/* Un hueco con altura reservada mientras llega el trozo de la ruta: sin
   altura, la página saltaría al montar y eso cuenta como desplazamiento
   de diseño. */
function Cargando() {
  return <div className="cargando-ruta" aria-live="polite" aria-busy="true" />;
}

const conSuspense = (Componente) => (
  <Suspense fallback={<Cargando />}>
    <Componente />
  </Suspense>
);

/**
 * Las cinco páginas de servicio comparten componente: lo único que cambia
 * es qué entrada de PAGINAS_SERVICIO leen, y eso lo saca el propio
 * componente de la ruta activa. Añadir un servicio es añadir una ruta aquí
 * y su contenido en content/servicios.js.
 */
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: RUTAS.inicio, element: <Inicio /> },
      { path: RUTAS.servicios, element: conSuspense(Servicios) },
      { path: RUTAS.paginasWeb, element: conSuspense(ServicioDetalle) },
      { path: RUTAS.sistemas, element: conSuspense(ServicioDetalle) },
      { path: RUTAS.crmAutomatizacion, element: conSuspense(ServicioDetalle) },
      { path: RUTAS.softwareAMedida, element: conSuspense(ServicioDetalle) },
      { path: RUTAS.restaurantes, element: conSuspense(ServicioDetalle) },
      { path: RUTAS.proyectos, element: conSuspense(Proyectos) },
      { path: `${RUTAS.proyectos}/:slug`, element: conSuspense(ProyectoDetalle) },
      { path: RUTAS.precios, element: conSuspense(Precios) },
      { path: RUTAS.sobre, element: conSuspense(Sobre) },
      { path: RUTAS.contacto, element: conSuspense(Contacto) },
      { path: '*', element: conSuspense(NoEncontrada) },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
