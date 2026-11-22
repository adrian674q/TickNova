import Boton from "./Boton.jsx";
import Icono from "./Icono.jsx";
import "./Estados.css";

export function Cargando({ texto = "Cargando…" }){
  return (
    <div className="estado estado--cargando" role="status" aria-live="polite">
      <span className="estado__spinner" aria-hidden="true" />
      <p>{texto}</p>
    </div>
  );
}

export function MensajeError({ mensaje, onReintentar, titulo = "Algo salió mal", compacto = false }){
  if (compacto){
    return (
      <div className="estado-compacto" role="alert">
        <Icono nombre="alerta" tamano={20} />
        <p><strong>{titulo}.</strong> {mensaje}</p>
      </div>
    );
  }
  return (
    <div className="estado estado--error" role="alert">
      <Icono nombre="alerta" tamano={28} />
      <p className="estado__titulo">{titulo}</p>
      <p className="estado__texto">{mensaje}</p>
      {onReintentar && (
        <Boton variante="secundario" tamano="pequeno" onClick={onReintentar}>
          Reintentar
        </Boton>
      )}
    </div>
  );
}

export function EstadoVacio({ titulo, texto, children }){
  return (
    <div className="estado estado--vacio">
      <p className="estado__titulo">{titulo}</p>
      {texto && <p className="estado__texto">{texto}</p>}
      {children}
    </div>
  );
}
