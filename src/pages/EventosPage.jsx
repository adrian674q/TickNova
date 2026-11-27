import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router";
import BarraBusqueda from "../components/BarraBusqueda.jsx";
import Boton from "../components/Boton.jsx";
import Chips from "../components/Chips.jsx";
import { Cargando, EstadoVacio, MensajeError } from "../components/Estados.jsx";
import SeccionEventos from "../components/SeccionEventos.jsx";
import { useEventos } from "../hooks/useEventos.js";
import { useTitulo } from "../hooks/useTitulo.js";
import { filtrarEventos, ordenarPorFecha } from "../utils/filtros.js";
import "./InicioPage.css";

export default function EventosPage(){
  useTitulo("Eventos");
  const { estado, datos, error, reintentar } = useEventos();
  const [parametros, setParametros] = useSearchParams();
  const { hash } = useLocation();

  const filtros = {
    texto: parametros.get("q") || "",
    categoria: parametros.get("categoria") || "todas",
    fecha: parametros.get("fecha") || "todas",
    ciudad: parametros.get("ciudad") || "todas"
  };

  // El enlace "Categorías" del menú lleva directo a los filtros por categoría.
  useEffect(() => {
    if (hash === "#categorias" && estado === "exito"){
      document.getElementById("categorias")?.scrollIntoView({ block: "center" });
    }
  }, [hash, estado]);

  function cambiarCategoria(valor){
    const siguientes = new URLSearchParams(parametros);
    if (valor === "todas") siguientes.delete("categoria");
    else siguientes.set("categoria", valor);
    setParametros(siguientes, { replace: true });
  }

  const eventos = datos || [];
  const categorias = [...new Set(eventos.map((evento) => evento.categoria))].sort();
  const ciudades = [...new Set(eventos.map((evento) => evento.ciudad))].sort();
  const resultados = ordenarPorFecha(filtrarEventos(eventos, filtros));
  const hayFiltros = Object.values(filtros).some((valor) => valor && valor !== "todas");

  return (
    <>
      <section className="inicio-heroe" aria-label="Buscar eventos">
        <div className="contenedor">
          <BarraBusqueda key={parametros.toString()} ciudades={ciudades} valoresIniciales={filtros} />
        </div>
      </section>
      <div className="contenedor pagina">
        <SeccionEventos titulo="Eventos" acento="fuerte" eventos={estado === "exito" && resultados.length ? resultados : null}>
          <div className="inicio__filtros" id="categorias" tabIndex={-1}>
            <Chips
              etiqueta="Filtrar por categoría"
              opciones={[{ valor: "todas", etiqueta: "Todos" }, ...categorias.map((c) => ({ valor: c, etiqueta: c }))]}
              valor={filtros.categoria}
              onCambiar={cambiarCategoria}
            />
          </div>
          {estado === "cargando" && <Cargando texto="Cargando eventos…" />}
          {estado === "error" && <MensajeError mensaje={error} onReintentar={reintentar} />}
          <p className="solo-lectores" role="status">
            {estado === "exito" && `${resultados.length} eventos encontrados`}
          </p>
          {estado === "exito" && resultados.length === 0 && (
            <EstadoVacio titulo="No encontramos eventos" texto="Prueba con otras palabras o quita algunos filtros.">
              {hayFiltros && (
                <Boton variante="secundario" tamano="pequeno" onClick={() => setParametros({}, { replace: true })}>
                  Limpiar filtros
                </Boton>
              )}
            </EstadoVacio>
          )}
        </SeccionEventos>
      </div>
    </>
  );
}
