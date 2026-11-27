import { Link } from "react-router";
import "./Logo.css";

export default function Logo({ to = "/" }){
  return (
    <Link to={to} className="logo logo--claro" aria-label="TickNova, ir al inicio">
      <span className="logo__marca" aria-hidden="true">T</span>
      <span className="logo__texto">TickNova</span>
    </Link>
  );
}
