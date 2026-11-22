import { useEffect } from "react";
import { useNavegacion } from "./context/NavegacionContext.jsx";
import { useSesion } from "./context/SesionContext.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import AppLayout from "./layout/AppLayout.jsx";
import AuthLayout from "./layout/AuthLayout.jsx";
import CompraLayout from "./layout/CompraLayout.jsx";
import CarritoPage from "./pages/CarritoPage.jsx";
import ConfirmacionPage from "./pages/ConfirmacionPage.jsx";
import EventoDetallePage from "./pages/EventoDetallePage.jsx";
import IngresarPage from "./pages/IngresarPage.jsx";
import InicioPage from "./pages/InicioPage.jsx";
import MisBoletosPage from "./pages/MisBoletosPage.jsx";
import PagoPage from "./pages/PagoPage.jsx";
import PerfilPage from "./pages/PerfilPage.jsx";
import RecuperarPage from "./pages/RecuperarPage.jsx";
import SeleccionPage from "./pages/SeleccionPage.jsx";
import AdminEventosPage from "./pages/admin/AdminEventosPage.jsx";
import DashboardPage from "./pages/admin/DashboardPage.jsx";
import EventoFormPage from "./pages/admin/EventoFormPage.jsx";
import InventarioPage from "./pages/admin/InventarioPage.jsx";
import ReportesPage from "./pages/admin/ReportesPage.jsx";
import UsuariosPage from "./pages/admin/UsuariosPage.jsx";

const GESTION = ["administrador", "organizador"];

// Cada vista indica su página, su estructura y si requiere sesión o un rol.
const VISTAS = {
  inicio: { Pagina: InicioPage, estructura: "app" },
  detalle: { Pagina: EventoDetallePage, estructura: "app", volver: { vista: "inicio", titulo: "Detalles" } },
  "mis-boletos": { Pagina: MisBoletosPage, estructura: "app", sesion: true },
  perfil: { Pagina: PerfilPage, estructura: "app", sesion: true },
  seleccion: { Pagina: SeleccionPage, estructura: "compra", paso: 1, titulo: "Asientos", volver: "detalle" },
  carrito: { Pagina: CarritoPage, estructura: "compra", paso: 2, titulo: "Tu carrito", volver: "inicio" },
  pago: { Pagina: PagoPage, estructura: "compra", paso: 3, titulo: "Pago", volver: "carrito", sesion: true },
  confirmacion: { Pagina: ConfirmacionPage, estructura: "compra", paso: 4, titulo: "Confirmación", volver: "inicio", sesion: true },
  ingresar: { Pagina: IngresarPage, estructura: "auth" },
  recuperar: { Pagina: RecuperarPage, estructura: "auth" },
  admin: { Pagina: DashboardPage, estructura: "admin", roles: GESTION },
  "admin-eventos": { Pagina: AdminEventosPage, estructura: "admin", roles: GESTION },
  "admin-evento": { Pagina: EventoFormPage, estructura: "admin", roles: GESTION },
  "admin-inventario": { Pagina: InventarioPage, estructura: "admin", roles: GESTION },
  "admin-usuarios": { Pagina: UsuariosPage, estructura: "admin", roles: ["administrador"] },
  "admin-reportes": { Pagina: ReportesPage, estructura: "admin", roles: GESTION }
};

export default function App(){
  const { vista, ir } = useNavegacion();
  const { usuario } = useSesion();
  const definicion = VISTAS[vista.nombre] || VISTAS.inicio;
  const pideSesion = definicion.sesion || definicion.roles;
  const rolValido = !definicion.roles || definicion.roles.includes(usuario?.rol);

  // Con sesión iniciada, "Ingresar" lleva a la vista de cada rol; sin el rol necesario se vuelve al inicio.
  useEffect(() => {
    if (!usuario) return;
    if (vista.nombre === "ingresar") ir(usuario.rol === "cliente" ? "inicio" : "admin");
    else if (!rolValido) ir("inicio");
  }, [usuario, vista.nombre, rolValido, ir]);

  // Sin sesión, una vista protegida muestra "Ingresar" y al iniciar sesión se abre la vista pedida.
  if (pideSesion && !usuario){
    return <AuthLayout><IngresarPage /></AuthLayout>;
  }
  if (!rolValido) return null;

  const { Pagina } = definicion;
  const pagina = <Pagina key={`${vista.nombre}-${vista.params.id ?? ""}`} />;

  if (definicion.estructura === "admin") return <AdminLayout>{pagina}</AdminLayout>;
  if (definicion.estructura === "auth") return <AuthLayout>{pagina}</AuthLayout>;
  if (definicion.estructura === "compra"){
    const volver = definicion.volver === "detalle"
      ? { vista: "detalle", params: { id: vista.params.id } }
      : { vista: definicion.volver };
    return <CompraLayout paso={definicion.paso} titulo={definicion.titulo} volver={volver}>{pagina}</CompraLayout>;
  }
  return <AppLayout volver={definicion.volver}>{pagina}</AppLayout>;
}
