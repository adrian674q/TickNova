import { nombreZona } from "../utils/boletos.js";
import { formatearPrecio } from "../utils/formatos.js";
import "./TarjetaZona.css";

const TONOS = { VIP: "lavanda", Preferencial: "verde", General: "amarillo" };

// Opción de zona dentro de un grupo de radio: se puede elegir con teclado.
export default function TarjetaZona({ zona, nombreGrupo, seleccionada, onSeleccionar, deshabilitada }){
  const agotada = zona.disponibles === 0;

  return (
    <label className={`tarjeta-zona tarjeta-zona--${TONOS[zona.nombre] || "lavanda"} ${seleccionada ? "tarjeta-zona--activa" : ""} ${agotada || deshabilitada ? "tarjeta-zona--agotada" : ""}`}>
      <input
        type="radio"
        className="solo-lectores"
        name={nombreGrupo}
        value={zona.id}
        checked={seleccionada}
        disabled={agotada || deshabilitada}
        onChange={() => onSeleccionar(zona.id)}
      />
      <span className="tarjeta-zona__info">
        <span className="tarjeta-zona__nombre">{nombreZona(zona.nombre)}</span>
        <span className="tarjeta-zona__descripcion">
          {agotada ? "Agotada" : zona.descripcion}
        </span>
      </span>
      <span className="tarjeta-zona__precio">{formatearPrecio(zona.precio)}</span>
    </label>
  );
}
