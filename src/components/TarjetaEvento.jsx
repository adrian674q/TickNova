import { formatearFechaEvento } from "../utils/formatos.js";
import { rutaPublica } from "../utils/rutas.js";
import Enlace from "./Enlace.jsx";
import "./TarjetaEvento.css";

export default function TarjetaEvento({ evento }){
  return (
    <article className="tarjeta-evento">
      <div className="tarjeta-evento__imagen">
        <img src={rutaPublica(evento.imagen)} alt="" loading="lazy" />
      </div>
      <div className="tarjeta-evento__cuerpo">
        <p className="tarjeta-evento__fecha">{formatearFechaEvento(evento.fecha, evento.hora)}</p>
        <h3 className="tarjeta-evento__nombre">
          <Enlace vista="detalle" params={{ id: evento.id }} className="tarjeta-evento__enlace">{evento.nombre}</Enlace>
        </h3>
        <p className="tarjeta-evento__lugar">{evento.lugar}</p>
      </div>
    </article>
  );
}
