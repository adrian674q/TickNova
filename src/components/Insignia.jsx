import { datosEstadoEvento } from "../utils/estados.js";
import "./Insignia.css";

export default function Insignia({ children, tono = "lavanda" }){
  return <span className={`insignia insignia--${tono}`}>{children}</span>;
}

export function InsigniaEstado({ estado }){
  const { texto, tono } = datosEstadoEvento(estado);
  return <Insignia tono={tono}>{texto}</Insignia>;
}
