import { useNavegacion } from "../context/NavegacionContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import Avatar from "./Avatar.jsx";
import Enlace from "./Enlace.jsx";
import Logo from "./Logo.jsx";
import { ROLES } from "../utils/estados.js";
import "./BarraLateral.css";

export default function BarraLateral({ abierta, id }){
  const { usuario, esAdmin } = useSesion();
  const { vista } = useNavegacion();
  const enlaces = [
    { vista: "admin", texto: "Dashboard" },
    { vista: "admin-eventos", texto: "Eventos", incluye: ["admin-evento"] },
    { vista: "admin-inventario", texto: "Inventario" },
    ...(esAdmin ? [{ vista: "admin-usuarios", texto: "Usuarios" }] : []),
    { vista: "admin-reportes", texto: "Reportes" }
  ];

  return (
    <aside className={`barra-lateral ${abierta ? "barra-lateral--abierta" : ""}`} id={id}>
      <div className="barra-lateral__logo"><Logo /></div>
      <nav aria-label="Panel de gestión">
        <ul>
          {enlaces.map((enlace) => {
            const activo = vista.nombre === enlace.vista || enlace.incluye?.includes(vista.nombre);
            return (
              <li key={enlace.vista}>
                <Enlace vista={enlace.vista} activo={activo} className={`barra-lateral__enlace ${activo ? "active" : ""}`}>
                  {enlace.texto}
                </Enlace>
              </li>
            );
          })}
        </ul>
      </nav>
      <Enlace vista="perfil" className="barra-lateral__usuario">
        <Avatar nombre="Admin" />
        <p>Admin<span>{ROLES[usuario.rol]}</span></p>
      </Enlace>
    </aside>
  );
}
