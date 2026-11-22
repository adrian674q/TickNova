import Enlace from "./Enlace.jsx";
import "./Logo.css";

export default function Logo({ vista = "inicio" }){
  return (
    <Enlace vista={vista} className="logo logo--claro" aria-label="TickNova, ir al inicio">
      <span className="logo__marca" aria-hidden="true">T</span>
      <span className="logo__texto">TickNova</span>
    </Enlace>
  );
}
