import { useState } from "react";
import { obtenerTodosLosEventos } from "../api/eventosService.js";
import { obtenerOrdenesPorUsuario } from "../api/ordenesService.js";
import Boton from "../components/Boton.jsx";
import Chips from "../components/Chips.jsx";
import { Cargando, EstadoVacio, MensajeError } from "../components/Estados.jsx";
import TarjetaBoleto from "../components/TarjetaBoleto.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { usePeticion } from "../hooks/usePeticion.js";
import { useTitulo } from "../hooks/useTitulo.js";
import { hoyIso } from "../utils/formatos.js";
import "./MisBoletosPage.css";

const PESTANAS = [
  { valor: "proximos", etiqueta: "Próximos" },
  { valor: "pasados", etiqueta: "Pasados" }
];

export default function MisBoletosPage(){
  useTitulo("Mis boletos");
  const { usuario } = useSesion();
  const [pestana, setPestana] = useState("proximos");
  const { estado, datos, error, reintentar } = usePeticion(
    (signal) => Promise.all([obtenerOrdenesPorUsuario(usuario.id, { signal }), obtenerTodosLosEventos({ signal })]),
    [usuario.id]
  );
  const [ordenes, eventos] = datos || [[], []];

  const hoy = hoyIso();
  const boletos = ordenes
    .filter((orden) => orden.estado === "pagada")
    .map((orden) => ({ orden, evento: eventos.find((evento) => evento.id === orden.eventoId) }))
    .filter(({ evento }) => evento)
    .sort((a, b) => a.evento.fecha.localeCompare(b.evento.fecha));
  const proximos = boletos.filter(({ evento }) => evento.fecha >= hoy);
  const pasados = boletos.filter(({ evento }) => evento.fecha < hoy);
  const lista = pestana === "proximos" ? proximos : pasados;

  return (
    <div className="contenedor pagina">
      <h1 className="pagina__titulo">Mis boletos</h1>
      <p className="pagina__subtitulo">Tus entradas activas y pasadas</p>
      <div className="mis-boletos__pestanas">
        <Chips etiqueta="Mostrar boletos" opciones={PESTANAS} valor={pestana} onCambiar={setPestana} />
      </div>

      {estado === "cargando" && <Cargando texto="Cargando tus boletos…" />}
      {estado === "error" && <MensajeError mensaje={error} onReintentar={reintentar} />}
      {estado === "exito" && (
        <>
          {lista.length > 0 && (
            <ul className="mis-boletos__lista">
              {lista.map(({ orden, evento }) => (
                <li key={orden.codigo}>
                  <TarjetaBoleto orden={orden} evento={evento} pasado={pestana === "pasados"} />
                </li>
              ))}
            </ul>
          )}
          {pestana === "proximos" && proximos.length === 0 && (
            <EstadoVacio titulo="No tienes boletos próximos" texto="Cuando compres un boleto aparecerá aquí.">
              <Boton to="/eventos" tamano="pequeno">Explorar eventos</Boton>
            </EstadoVacio>
          )}
          {pestana === "pasados" && pasados.length === 0 && (
            <EstadoVacio titulo="No tienes boletos pasados todavía" texto="Aquí aparecerán tus entradas una vez usadas." />
          )}
        </>
      )}
    </div>
  );
}
