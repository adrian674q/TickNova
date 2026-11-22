import Enlace from "../../components/Enlace.jsx";
import { Cargando, EstadoVacio, MensajeError } from "../../components/Estados.jsx";
import TablaDatos from "../../components/TablaDatos.jsx";
import { useTitulo } from "../../hooks/useTitulo.js";
import { formatearPrecio } from "../../utils/formatos.js";
import { eventosAdmin, useDatosAdmin } from "./useDatosAdmin.js";
import "./AdminPages.css";

function sumar(zonas, campo){
  return zonas.reduce((suma, zona) => suma + zona[campo], 0).toLocaleString("es-SV");
}

export default function InventarioPage(){
  useTitulo("Inventario");
  const { estado, datos, error, reintentar } = useDatosAdmin();
  const eventos = eventosAdmin(datos?.eventos);

  const columnas = [
    { clave: "nombre", titulo: "Evento" },
    {
      clave: "precios",
      titulo: "Precios",
      alinear: "fin",
      render: (evento) => {
        const precios = evento.zonas.map((zona) => zona.precio);
        const minimo = Math.min(...precios);
        const maximo = Math.max(...precios);
        return minimo === maximo ? formatearPrecio(minimo) : `${formatearPrecio(minimo)} – ${formatearPrecio(maximo)}`;
      }
    },
    { clave: "capacidad", titulo: "Capacidad", alinear: "fin", render: (evento) => sumar(evento.zonas, "capacidad") },
    { clave: "disponibles", titulo: "Disponibles", alinear: "fin", render: (evento) => sumar(evento.zonas, "disponibles") },
    {
      clave: "editar",
      titulo: "Acciones",
      alinear: "fin",
      render: (evento) => (
        <Enlace className="admin-enlace" vista="admin-evento" params={{ id: evento.id }}>
          Editar<span className="solo-lectores"> {evento.nombre}</span>
        </Enlace>
      )
    }
  ];

  return (
    <>
      <div className="admin-cabecera">
        <div>
          <h1>Inventario</h1>
          <p>Disponibilidad y precios de tus eventos</p>
        </div>
      </div>
      {estado === "cargando" && <Cargando texto="Cargando inventario…" />}
      {estado === "error" && <MensajeError mensaje={error} onReintentar={reintentar} />}
      {estado === "exito" && (eventos.length
        ? <TablaDatos titulo="Inventario de eventos" columnas={columnas} filas={eventos} />
        : <EstadoVacio titulo="Aún no hay eventos" texto="Crea tu primer evento para ver su inventario." />)}
    </>
  );
}
