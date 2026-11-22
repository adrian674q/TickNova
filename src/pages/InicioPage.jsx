import { useEffect } from "react";
import BarraBusqueda from "../components/BarraBusqueda.jsx";
import Boton from "../components/Boton.jsx";
import Chips from "../components/Chips.jsx";
import Enlace from "../components/Enlace.jsx";
import { Cargando, EstadoVacio, MensajeError } from "../components/Estados.jsx";
import SeccionEventos from "../components/SeccionEventos.jsx";
import TarjetaDestacada from "../components/TarjetaDestacada.jsx";
import { useNavegacion } from "../context/NavegacionContext.jsx";
import { usePreferencias } from "../context/PreferenciasContext.jsx";
import { useEventos } from "../hooks/useEventos.js";
import { useTitulo } from "../hooks/useTitulo.js";
import { coincideFecha, filtrarEventos, ordenarPorFecha } from "../utils/filtros.js";
import { hoyIso } from "../utils/formatos.js";
import "./InicioPage.css";

const FILTROS_DESCUBRE = [
  { valor: "hoy", etiqueta: "Hoy" },
  { valor: "fin", etiqueta: "Este fin de semana" },
  { valor: "30", etiqueta: "Próximos 30 días" }
];
const TODOS = { busqueda: {} };

export default function InicioPage(){
  useTitulo("Inicio");
  const { vista, ir } = useNavegacion();
  const { busqueda } = vista.params;
  const { estado, datos, error, reintentar } = useEventos();
  const { preferencias, cambiarPreferencia } = usePreferencias();
  const filtro = FILTROS_DESCUBRE.some((f) => f.valor === preferencias.filtroFecha) ? preferencias.filtroFecha : "30";

  // Al buscar se muestran los resultados debajo de los destacados.
  useEffect(() => {
    if (busqueda && estado === "exito") document.getElementById("resultados")?.scrollIntoView({ block: "start" });
  }, [vista, busqueda, estado]);

  const hoy = hoyIso();
  const eventos = datos || [];
  const proximos = ordenarPorFecha(eventos.filter((evento) => evento.fecha >= hoy && evento.estado !== "cancelado"));
  const destacados = proximos.filter((evento) => evento.destacado).sort((a, b) => a.id - b.id).slice(0, 3);
  const descubre = proximos.filter((evento) => !evento.destacado && coincideFecha(evento.fecha, filtro, hoy)).slice(0, 4);
  const recientes = [...proximos].sort((a, b) => b.publicado.localeCompare(a.publicado)).filter((e) => !e.destacado).slice(0, 4);
  const musica = proximos.filter((evento) => evento.categoria === "Música" && !evento.destacado).slice(-4);
  const ciudades = [...new Set(eventos.map((evento) => evento.ciudad))];
  const resultados = busqueda ? filtrarEventos(proximos, busqueda) : [];

  return (
    <>
      <section className="inicio-heroe" aria-labelledby="titulo-inicio">
        <div className="contenedor">
          <h1 id="titulo-inicio" className="solo-lectores">TickNova: boletos para conciertos, teatro y deportes</h1>
          <BarraBusqueda key={JSON.stringify(busqueda)} ciudades={ciudades} valoresIniciales={busqueda} />
          <div className="inicio-heroe__promo">
            <h2>Vive los mejores momentos</h2>
            <p>Conciertos, teatro y deportes en un solo lugar.</p>
            <Boton vista="inicio" params={TODOS} tamano="pequeno" className="boton--pildora">Explorar</Boton>
          </div>
          {estado === "exito" && destacados.length > 0 && (
            <section aria-label="Eventos destacados">
              <div className="inicio-heroe__subtitulo">
                <h2>Eventos destacados</h2>
                <Enlace vista="inicio" params={TODOS}>Ver todos</Enlace>
              </div>
              <ul className="inicio-heroe__destacados">
                {destacados.map((evento) => (
                  <li key={evento.id}><TarjetaDestacada evento={evento} /></li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>

      <div className="contenedor pagina inicio-secciones">
        {estado === "cargando" && <Cargando texto="Cargando eventos…" />}
        {estado === "error" && <MensajeError mensaje={error} onReintentar={reintentar} />}
        {estado === "exito" && busqueda && (
          <SeccionEventos id="resultados" titulo={busqueda.categoria || "Eventos"} acento="fuerte" eventos={resultados.length ? resultados : null}>
            <div className="inicio__filtros">
              <Boton variante="secundario" tamano="pequeno" onClick={() => ir("inicio")}>Limpiar búsqueda</Boton>
            </div>
            <p className="solo-lectores" role="status">{`${resultados.length} eventos encontrados`}</p>
            {resultados.length === 0 && (
              <EstadoVacio titulo="No encontramos eventos" texto="Prueba con otras palabras o cambia la fecha y la ubicación." />
            )}
          </SeccionEventos>
        )}
        {estado === "exito" && !busqueda && (
          <>
            <SeccionEventos id="descubre" titulo="Descubre eventos" acento="fuerte" eventos={descubre.length ? descubre : null}>
              <div className="inicio__filtros">
                <Chips
                  etiqueta="Filtrar por fecha"
                  opciones={FILTROS_DESCUBRE}
                  valor={filtro}
                  onCambiar={(valor) => cambiarPreferencia("filtroFecha", valor)}
                />
              </div>
              {descubre.length === 0 && (
                <EstadoVacio
                  titulo="No hay eventos para esta fecha"
                  texto="Prueba con otro rango o explora el catálogo completo."
                >
                  <Boton vista="inicio" params={TODOS} variante="secundario" tamano="pequeno">Ver todos los eventos</Boton>
                </EstadoVacio>
              )}
            </SeccionEventos>
            <SeccionEventos titulo="Recién anunciados" verTodo={TODOS} eventos={recientes} />
            <SeccionEventos id="musica" titulo="Música" acento="verde" verTodo={{ busqueda: { categoria: "Música" } }} eventos={musica} />
          </>
        )}
      </div>
    </>
  );
}
