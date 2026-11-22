import { iniciales } from "../utils/formatos.js";
import "./Avatar.css";

export default function Avatar({ nombre, tamano = 36 }){
  return (
    <span className="avatar" style={{ width: tamano, height: tamano }} aria-hidden="true">
      {nombre ? iniciales(nombre) : "?"}
    </span>
  );
}
