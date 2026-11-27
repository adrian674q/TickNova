import { Link, NavLink } from "react-router";
import { useSesion } from "../context/SesionContext.jsx";
import Avatar from "./Avatar.jsx";
import Logo from "./Logo.jsx";
import { ROLES } from "../utils/estados.js";
import "./BarraLateral.css";

export default function BarraLateral({ abierta, id, alNavegar }){
  const { usuario, esAdmin } = useSesion();
  // Usuarios y Reportes solo los ve el administrador.
  const enlaces = [
    { to: "/admin", texto: "Dashboard", fin: true },
    { to: "/admin/eventos", texto: "Eventos" },
    { to: "/admin/inventario", texto: "Inventario" },
    ...(esAdmin ? [{ to: "/admin/usuarios", texto: "Usuarios" }, { to: "/admin/reportes", texto: "Reportes" }] : [])
  ];

  return (
    <aside className={`barra-lateral ${abierta ? "barra-lateral--abierta" : ""}`} id={id}>
      <div className="barra-lateral__logo"><Logo /></div>
      <nav aria-label="Panel de gestión">
        <ul>
          {enlaces.map((enlace) => (
            <li key={enlace.to}>
              <NavLink to={enlace.to} end={enlace.fin} className="barra-lateral__enlace" onClick={alNavegar}>
                {enlace.texto}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Link to="/perfil" className="barra-lateral__usuario" onClick={alNavegar}>
        <Avatar nombre="Admin" />
        <p>Admin<span>{ROLES[usuario.rol]}</span></p>
      </Link>
    </aside>
  );
}
