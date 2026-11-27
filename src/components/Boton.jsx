import { Link } from "react-router";
import "./Boton.css";

export default function Boton({
  children,
  variante = "primario",
  tamano = "normal",
  ancho = false,
  to,
  cargando = false,
  disabled = false,
  className = "",
  ...props
}){
  const clases = [
    "boton",
    `boton--${variante}`,
    tamano !== "normal" ? `boton--${tamano}` : "",
    ancho ? "boton--ancho" : "",
    className
  ].filter(Boolean).join(" ");

  if (to){
    return <Link to={to} className={clases} {...props}>{children}</Link>;
  }

  return (
    <button
      type="button"
      className={clases}
      disabled={cargando || disabled}
      aria-busy={cargando || undefined}
      {...props}
    >
      {cargando && <span className="boton__spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}
