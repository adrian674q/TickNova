import Boton from "../../components/Boton.jsx";
import Enlace from "../../components/Enlace.jsx";
import { Cargando, EstadoVacio, MensajeError } from "../../components/Estados.jsx";
import { InsigniaEstado } from "../../components/Insignia.jsx";
import TablaDatos from "../../components/TablaDatos.jsx";
import { useNavegacion } from "../../context/NavegacionContext.jsx";
import { useTitulo } from "../../hooks/useTitulo.js";
import { formatearDiaMes, formatearHora } from "../../utils/formatos.js";
import { rutaPublica } from "../../utils/rutas.js";
import { eventosAdmin, useDatosAdmin } from "./useDatosAdmin.js";
import "./AdminPages.css";

export default function AdminEventosPage(){
  useTitulo("Gestión de eventos");
  const { mensaje } = useNavegacion().vista.params;
  const { estado, datos, error, reintentar } = useDatosAdmin();
  const eventos = eventosAdmin(datos?.eventos);

  const columnas = [
    {
      clave: "nombre",
      titulo: "Evento",
      render: (evento) => (
        <span className="admin-evento-nombre">
          <img src={rutaPublica(evento.imagen)} alt="" />
          {evento.nombre}
        </span>
      )
    },
    { clave: "fecha", titulo: "Fecha", render: (evento) => `${formatearDiaMes(evento.fecha)} · ${formatearHora(evento.hora)}` },
    { clave: "lugar", titulo: "Lugar" },
    { clave: "estado", titulo: "Estado", render: (evento) => <InsigniaEstado estado={evento.estado} /> },
    {
      clave: "acciones",
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
      <h1 className="solo-lectores">Gestión de eventos</h1>
      {mensaje && <p className="admin-mensaje" role="status">{mensaje}</p>}
      <div className="admin-bloques">
        <section className="admin-bloque" aria-labelledby="titulo-crear">
          <div className="admin-bloque__texto">
            <h2 id="titulo-crear">Crea tu evento</h2>
            <p>En TickNova te ayudamos a hacerlo realidad. Publica tu evento, organiza la venta de boletos y llega a más personas de forma fácil y rápida.</p>
            <Boton vista="admin-evento" tamano="pequeno" className="boton--pildora">Crear</Boton>
          </div>
          <div className="admin-bloque__imagen"><img src={rutaPublica("img/eventos/festival-escenario.jpg")} alt="" /></div>
        </section>
        <section className="admin-bloque admin-bloque--invertido" aria-labelledby="titulo-editar">
          <div className="admin-bloque__imagen"><img src={rutaPublica("img/eventos/sinfonica-nacional.jpg")} alt="" /></div>
          <div className="admin-bloque__texto">
            <h2 id="titulo-editar">Edita tu evento</h2>
            <p>¿Necesitas realizar algún cambio? En TickNova puedes actualizar la información de tu evento, modificar fechas, horarios, precios y otros detalles de manera fácil y rápida.</p>
            <Boton vista="admin-evento" params={{ editar: true }} tamano="pequeno" className="boton--pildora">Editar</Boton>
          </div>
        </section>
      </div>

      <h2 className="admin-seccion-titulo">Tus eventos</h2>
      {estado === "cargando" && <Cargando texto="Cargando eventos…" />}
      {estado === "error" && <MensajeError mensaje={error} onReintentar={reintentar} />}
      {estado === "exito" && (eventos.length
        ? <TablaDatos titulo="Eventos registrados" columnas={columnas} filas={eventos} />
        : <EstadoVacio titulo="Aún no hay eventos" texto="Crea tu primer evento para empezar a vender boletos." />)}
    </>
  );
}
