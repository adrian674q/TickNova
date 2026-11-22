import { useState } from "react";
import Boton from "../components/Boton.jsx";
import { Cargando, MensajeError } from "../components/Estados.jsx";
import { InsigniaEstado } from "../components/Insignia.jsx";
import Migas from "../components/Migas.jsx";
import TarjetaZona from "../components/TarjetaZona.jsx";
import { useNavegacion } from "../context/NavegacionContext.jsx";
import { useEvento } from "../hooks/useEventos.js";
import { useTitulo } from "../hooks/useTitulo.js";
import { formatearFechaCorta, formatearHora } from "../utils/formatos.js";
import { rutaPublica } from "../utils/rutas.js";
import "./EventoDetallePage.css";

export default function EventoDetallePage(){
  const { id } = useNavegacion().vista.params;
  const { estado, datos: evento, error, reintentar } = useEvento(id);
  useTitulo(evento?.nombre || "Evento");

  return (
    <div className="contenedor pagina">
      {estado === "cargando" && <Cargando texto="Cargando evento…" />}
      {estado === "error" && <MensajeError mensaje={error} onReintentar={reintentar} />}
      {estado === "exito" && <DetalleEvento key={evento.id} evento={evento} />}
    </div>
  );
}

function DetalleEvento({ evento }){
  const { ir } = useNavegacion();
  const zonasOrdenadas = [...evento.zonas].reverse();
  const disponibles = zonasOrdenadas.filter((zona) => zona.disponibles > 0);
  const [zonaId, setZonaId] = useState(disponibles[0]?.id ?? null);
  const [principal, ...miniaturas] = evento.galeria?.length ? evento.galeria : [evento.imagen];
  const sePuedeComprar = !["agotado", "cancelado", "borrador"].includes(evento.estado) && zonaId !== null;

  function seleccionarBoletos(eventoFormulario){
    eventoFormulario.preventDefault();
    if (sePuedeComprar) ir("seleccion", { id: evento.id, zona: zonaId });
  }

  return (
    <>
      <Migas elementos={[
        { texto: "Eventos", vista: "inicio", params: { busqueda: {} } },
        { texto: evento.categoria, vista: "inicio", params: { busqueda: { categoria: evento.categoria } } },
        { texto: evento.nombre }
      ]} />

      <div className="detalle">
        <div className="detalle__galeria">
          <img
            className="detalle__imagen"
            src={rutaPublica(principal)}
            alt={`Imagen del evento ${evento.nombre}`}
          />
          {miniaturas.length > 0 && (
            <ul className="detalle__miniaturas">
              {miniaturas.slice(0, 3).map((imagen, indice) => (
                <li key={imagen}>
                  <img src={rutaPublica(imagen)} alt={`Foto ${indice + 2} del evento ${evento.nombre}`} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <form className="detalle__compra tarjeta" onSubmit={seleccionarBoletos}>
          <InsigniaEstado estado={evento.estado} />
          <h1 className="detalle__titulo">{evento.nombre}</h1>
          <p className="texto-suave">
            {formatearFechaCorta(evento.fecha)} · {formatearHora(evento.hora)} · {evento.lugar}
          </p>
          <fieldset className="detalle__zonas" disabled={["cancelado", "borrador"].includes(evento.estado)}>
            <legend>Selecciona tu zona</legend>
            {zonasOrdenadas.map((zona) => (
              <TarjetaZona
                key={zona.id}
                zona={zona}
                nombreGrupo={`zona-${evento.id}`}
                seleccionada={zona.id === zonaId}
                onSeleccionar={setZonaId}
              />
            ))}
          </fieldset>
          {evento.estado === "agotado" && <p className="detalle__aviso" role="status">Este evento está agotado.</p>}
          {evento.estado === "cancelado" && <p className="detalle__aviso" role="status">Este evento fue cancelado.</p>}
          <Boton type="submit" ancho disabled={!sePuedeComprar}>Seleccionar boletos</Boton>
        </form>

        <section className="detalle__acerca" aria-labelledby="acerca-titulo">
          <h2 id="acerca-titulo">Acerca del evento</h2>
          <p>{evento.descripcion}</p>
        </section>
      </div>
    </>
  );
}
