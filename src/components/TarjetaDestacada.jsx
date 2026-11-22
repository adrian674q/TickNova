import { formatearFechaEvento } from "../utils/formatos.js";
import { rutaPublica } from "../utils/rutas.js";
import Enlace from "./Enlace.jsx";
import "./TarjetaDestacada.css";

export default function TarjetaDestacada({ evento }){
  return (
    <article className="tarjeta-destacada">
      <img className="tarjeta-destacada__imagen" src={rutaPublica(evento.imagen)} alt="" />
      <div className="tarjeta-destacada__cuerpo">
        <p className="tarjeta-destacada__fecha">{formatearFechaEvento(evento.fecha, evento.hora)}</p>
        <h3 className="tarjeta-destacada__nombre">
          <Enlace vista="detalle" params={{ id: evento.id }}>{evento.nombre}</Enlace>
        </h3>
        <p className="tarjeta-destacada__lugar">{evento.lugar}</p>
      </div>
    </article>
  );
}
