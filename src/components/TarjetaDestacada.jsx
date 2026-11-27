import { formatearFechaEvento } from "../utils/formatos.js";
import { rutaPublica } from "../utils/rutas.js";
import { Link } from "react-router";
import "./TarjetaDestacada.css";

export default function TarjetaDestacada({ evento }){
  return (
    <article className="tarjeta-destacada">
      <img className="tarjeta-destacada__imagen" src={rutaPublica(evento.imagen)} alt="" />
      <div className="tarjeta-destacada__cuerpo">
        <p className="tarjeta-destacada__fecha">{formatearFechaEvento(evento.fecha, evento.hora)}</p>
        <h3 className="tarjeta-destacada__nombre">
          <Link to={`/eventos/${evento.id}`}>{evento.nombre}</Link>
        </h3>
        <p className="tarjeta-destacada__lugar">{evento.lugar}</p>
      </div>
    </article>
  );
}
