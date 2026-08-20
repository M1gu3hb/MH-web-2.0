import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Layout } from './components/layout/Layout';
import { RUTAS } from './config/rutas';
import './styles/index.css';

import Inicio from './paginas/Inicio';
import Servicios from './paginas/Servicios';
import ServicioDetalle from './paginas/ServicioDetalle';
import Precios from './paginas/Precios';
import Proyectos from './paginas/Proyectos';
import ProyectoDetalle from './paginas/ProyectoDetalle';
import Sobre from './paginas/Sobre';
import Contacto from './paginas/Contacto';
import NoEncontrada from './paginas/NoEncontrada';

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
      { path: RUTAS.servicios, element: <Servicios /> },
      { path: RUTAS.paginasWeb, element: <ServicioDetalle /> },
      { path: RUTAS.sistemas, element: <ServicioDetalle /> },
      { path: RUTAS.crmAutomatizacion, element: <ServicioDetalle /> },
      { path: RUTAS.softwareAMedida, element: <ServicioDetalle /> },
      { path: RUTAS.restaurantes, element: <ServicioDetalle /> },
      { path: RUTAS.proyectos, element: <Proyectos /> },
      { path: `${RUTAS.proyectos}/:slug`, element: <ProyectoDetalle /> },
      { path: RUTAS.precios, element: <Precios /> },
      { path: RUTAS.sobre, element: <Sobre /> },
      { path: RUTAS.contacto, element: <Contacto /> },
      { path: '*', element: <NoEncontrada /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
