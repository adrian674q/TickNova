import Enlace from "./Enlace.jsx";
import "./Boton.css";

export default function Boton({
  children,
  variante = "primario",
  tamano = "normal",
  ancho = false,
  vista,
  params,
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

  if (vista){
    return <Enlace vista={vista} params={params} className={clases} {...props}>{children}</Enlace>;
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
