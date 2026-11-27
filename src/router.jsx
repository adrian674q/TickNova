import { createBrowserRouter } from "react-router";
import RutaProtegida from "./components/RutaProtegida.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import AppLayout from "./layout/AppLayout.jsx";
import AuthLayout from "./layout/AuthLayout.jsx";
import CompraLayout from "./layout/CompraLayout.jsx";
import CarritoPage from "./pages/CarritoPage.jsx";
import ConfirmacionPage from "./pages/ConfirmacionPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import EventoDetallePage from "./pages/EventoDetallePage.jsx";
import EventosPage from "./pages/EventosPage.jsx";
import IngresarPage from "./pages/IngresarPage.jsx";
import InicioPage from "./pages/InicioPage.jsx";
import MisBoletosPage from "./pages/MisBoletosPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PagoPage from "./pages/PagoPage.jsx";
import PerfilPage from "./pages/PerfilPage.jsx";
import RecuperarPage from "./pages/RecuperarPage.jsx";
import SeleccionPage from "./pages/SeleccionPage.jsx";

const GESTION = ["administrador", "organizador"];
const SOLO_ADMIN = ["administrador"];

function protegida(elemento, roles){
  return <RutaProtegida roles={roles}>{elemento}</RutaProtegida>;
}

// Las páginas del panel se cargan de forma diferida: solo se descargan al entrar al panel.
function diferida(importar, roles){
  return async () => {
    const { default: Pagina } = await importar();
    return { element: roles ? protegida(<Pagina />, roles) : <Pagina /> };
  };
}

// basename: la app se publica en /TickNova/ en GitHub Pages y en / en desarrollo.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <InicioPage /> },
        { path: "eventos", element: <EventosPage /> },
        { path: "eventos/:id", element: <EventoDetallePage />, handle: { volver: "/", titulo: "Detalles" } },
        { path: "boletos", element: protegida(<MisBoletosPage />) },
        { path: "perfil", element: protegida(<PerfilPage />) },
        { path: "*", element: <NotFoundPage /> }
      ]
    },
    {
      element: <CompraLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "eventos/:id/boletos",
          element: <SeleccionPage />,
          handle: { paso: 1, titulo: "Asientos", volver: (params) => `/eventos/${params.id}` }
        },
        { path: "carrito", element: <CarritoPage />, handle: { paso: 2, titulo: "Tu carrito", volver: "/eventos" } },
        { path: "checkout", element: <PagoPage />, handle: { paso: 3, titulo: "Pago", volver: "/carrito" } },
        { path: "confirmacion", element: protegida(<ConfirmacionPage />), handle: { paso: 4, titulo: "Confirmación", volver: "/" } }
      ]
    },
    {
      element: <AuthLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "ingresar", element: <IngresarPage /> },
        { path: "recuperar", element: <RecuperarPage /> }
      ]
    },
    {
      path: "admin",
      element: protegida(<AdminLayout />, GESTION),
      errorElement: <ErrorPage />,
      children: [
        { index: true, lazy: diferida(() => import("./pages/admin/DashboardPage.jsx")) },
        { path: "eventos", lazy: diferida(() => import("./pages/admin/AdminEventosPage.jsx")) },
        { path: "eventos/nuevo", lazy: diferida(() => import("./pages/admin/EventoFormPage.jsx")) },
        { path: "eventos/:id/editar", lazy: diferida(() => import("./pages/admin/EventoFormPage.jsx")) },
        { path: "inventario", lazy: diferida(() => import("./pages/admin/InventarioPage.jsx")) },
        { path: "usuarios", lazy: diferida(() => import("./pages/admin/UsuariosPage.jsx"), SOLO_ADMIN) },
        { path: "reportes", lazy: diferida(() => import("./pages/admin/ReportesPage.jsx"), SOLO_ADMIN) },
        { path: "*", element: <NotFoundPage /> }
      ]
    }
  ],
  { basename }
);
