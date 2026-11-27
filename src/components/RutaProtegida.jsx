import { Navigate, useLocation } from "react-router";
import { useSesion } from "../context/SesionContext.jsx";

// Sin sesión lleva a "Ingresar" y recuerda la ruta de origen; sin el rol necesario vuelve al inicio.
export default function RutaProtegida({ roles, children }){
  const { usuario } = useSesion();
  const ubicacion = useLocation();

  if (!usuario){
    return <Navigate to="/ingresar" replace state={{ desde: ubicacion.pathname + ubicacion.search }} />;
  }
  if (roles && !roles.includes(usuario.rol)){
    return <Navigate to="/" replace />;
  }
  return children;
}
