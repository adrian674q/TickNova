import { Link } from "react-router";
import TarjetaEvento from "./TarjetaEvento.jsx";
import "./SeccionEventos.css";

export default function SeccionEventos({ id, titulo, eventos, verTodo, acento = "lavanda", children }){
  return (
    <section className="seccion-eventos" id={id} aria-label={titulo}>
      <div className="seccion-eventos__cabecera">
        <h2 className={`seccion-eventos__titulo seccion-eventos__titulo--${acento}`}>{titulo}</h2>
        {verTodo && <Link className="seccion-eventos__ver" to={verTodo}>Ver todo<span className="solo-lectores">: {titulo}</span></Link>}
      </div>
      {children}
      {eventos && (
        <ul className="rejilla-eventos">
          {eventos.map((evento) => (
            <li key={evento.id}><TarjetaEvento evento={evento} /></li>
          ))}
        </ul>
      )}
    </section>
  );
}
