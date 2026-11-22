import { useState } from "react";
import { useNavegacion } from "../context/NavegacionContext.jsx";
import { OPCIONES_FECHA } from "../utils/filtros.js";
import Icono from "./Icono.jsx";
import "./BarraBusqueda.css";

export default function BarraBusqueda({ ciudades = [], valoresIniciales = {} }){
  const { ir } = useNavegacion();
  const [valores, setValores] = useState({
    texto: valoresIniciales.texto || "",
    fecha: valoresIniciales.fecha || "todas",
    ciudad: valoresIniciales.ciudad || "todas"
  });

  function cambiar(evento){
    setValores({ ...valores, [evento.target.name]: evento.target.value });
  }

  function buscar(evento){
    evento.preventDefault();
    ir("inicio", { busqueda: { ...valores, texto: valores.texto.trim() } });
  }

  return (
    <form className="barra-busqueda" role="search" onSubmit={buscar}>
      <label className="barra-busqueda__campo barra-busqueda__campo--texto">
        <span className="barra-busqueda__etiqueta">Buscar</span>
        <input
          name="texto"
          type="search"
          value={valores.texto}
          onChange={cambiar}
          placeholder="Eventos, artistas o recintos"
        />
      </label>
      <label className="barra-busqueda__campo">
        <span className="barra-busqueda__etiqueta">Fecha</span>
        <select name="fecha" value={valores.fecha} onChange={cambiar}>
          {OPCIONES_FECHA.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>
          ))}
        </select>
      </label>
      <label className="barra-busqueda__campo">
        <span className="barra-busqueda__etiqueta">Ubicación</span>
        <select name="ciudad" value={valores.ciudad} onChange={cambiar}>
          <option value="todas">Todas</option>
          {ciudades.map((ciudad) => <option key={ciudad} value={ciudad}>{ciudad}</option>)}
        </select>
      </label>
      <button type="submit" className="barra-busqueda__boton" aria-label="Buscar eventos">
        <Icono nombre="buscar" tamano={22} />
      </button>
    </form>
  );
}
