import { useId } from "react";
import "./Campo.css";

export default function Campo({
  etiqueta,
  error,
  ayuda,
  como = "input",
  opciones = [],
  className = "",
  ...props
}){
  const id = useId();
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;
  const describe = [ayuda ? idAyuda : "", error ? idError : ""].filter(Boolean).join(" ") || undefined;
  const comunes = {
    id,
    className: `campo__control ${error ? "campo__control--error" : ""}`,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describe,
    ...props
  };

  return (
    <div className={`campo ${className}`}>
      <label className="campo__etiqueta" htmlFor={id}>{etiqueta}</label>
      {como === "select" && (
        <select {...comunes}>
          {opciones.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>
          ))}
        </select>
      )}
      {como === "textarea" && <textarea rows={3} {...comunes} />}
      {como === "input" && <input {...comunes} />}
      {ayuda && <p className="campo__ayuda" id={idAyuda}>{ayuda}</p>}
      {error && <p className="campo__error" id={idError}>{error}</p>}
    </div>
  );
}
