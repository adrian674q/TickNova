import { useState } from "react";
import Campo from "../../components/Campo.jsx";
import { Cargando, EstadoVacio, MensajeError } from "../../components/Estados.jsx";
import GraficoBarras from "../../components/GraficoBarras.jsx";
import Insignia from "../../components/Insignia.jsx";
import ListaValores from "../../components/ListaValores.jsx";
import TarjetaEstadistica from "../../components/TarjetaEstadistica.jsx";
import { useTitulo } from "../../hooks/useTitulo.js";
import { formatearMoneda } from "../../utils/formatos.js";
import { compactarMoneda, filtrarPorPeriodo, resumenGeneral, topEventos, ventasPorCategoria, ventasPorMes, ventasPorZona } from "../../utils/reportes.js";
import { useDatosAdmin } from "./useDatosAdmin.js";
import "./AdminPages.css";

export default function ReportesPage(){
  useTitulo("Reportes");
  const { estado, datos, error, reintentar } = useDatosAdmin();

  return (
    <>
      <div className="admin-cabecera">
        <div>
          <h1>Reportes</h1>
          <p>Ventas por evento, periodo, categoría y zona</p>
        </div>
      </div>
      {estado === "cargando" && <Cargando texto="Generando reportes…" />}
      {estado === "error" && <MensajeError mensaje={error} onReintentar={reintentar} />}
      {estado === "exito" && <Contenido eventos={datos.todos} ordenes={datos.ordenes} />}
    </>
  );
}

const PERIODOS = [
  { valor: "3", etiqueta: "Últimos 3 meses" },
  { valor: "6", etiqueta: "Últimos 6 meses" },
  { valor: "12", etiqueta: "Últimos 12 meses" }
];

// Los reportes se calculan a partir de las órdenes, filtradas por evento y periodo.
function Contenido({ eventos, ordenes: todas }){
  const [eventoId, setEventoId] = useState("todos");
  const [periodo, setPeriodo] = useState("6");
  const meses = Number(periodo);
  const conVentas = eventos.filter((evento) => todas.some((orden) => orden.eventoId === evento.id));
  const ordenes = filtrarPorPeriodo(todas, meses)
    .filter((orden) => eventoId === "todos" || orden.eventoId === Number(eventoId));

  const filtros = (
    <div className="admin-filtros">
      <Campo
        etiqueta="Evento"
        como="select"
        value={eventoId}
        onChange={(e) => setEventoId(e.target.value)}
        opciones={[{ valor: "todos", etiqueta: "Todos los eventos" }, ...conVentas.map((e) => ({ valor: String(e.id), etiqueta: e.nombre }))]}
      />
      <Campo etiqueta="Periodo" como="select" value={periodo} onChange={(e) => setPeriodo(e.target.value)} opciones={PERIODOS} />
    </div>
  );

  if (ordenes.length === 0){
    return (
      <>
        {filtros}
        <EstadoVacio titulo="Sin ventas en este periodo" texto="Prueba con otro evento o un periodo más largo." />
      </>
    );
  }

  const resumen = resumenGeneral(ordenes, eventos);
  const promedio = resumen.boletosTotales ? resumen.ingresosTotales / resumen.boletosTotales : 0;
  const top = topEventos(ordenes, eventos, 5);

  return (
    <>
      {filtros}
      <section className="admin-estadisticas" aria-label="Totales">
        <TarjetaEstadistica titulo="Ingresos totales" valor={formatearMoneda(resumen.ingresosTotales)} detalle="Órdenes pagadas" />
        <TarjetaEstadistica titulo="Boletos vendidos" valor={resumen.boletosTotales.toLocaleString("es-SV")} detalle="En el periodo" />
        <TarjetaEstadistica titulo="Precio promedio" valor={formatearMoneda(promedio)} detalle="Por boleto" />
        <TarjetaEstadistica titulo="Cancelaciones" valor={resumen.cancelaciones} detalle="Órdenes canceladas" destacada />
      </section>

      <section className="tarjeta admin-grafico" aria-labelledby="titulo-periodo">
        <div className="admin-grafico__cabecera">
          <h2 id="titulo-periodo">Ventas por periodo</h2>
          <Insignia tono="aviso">{PERIODOS.find((p) => p.valor === periodo).etiqueta}</Insignia>
        </div>
        <GraficoBarras titulo="Ventas por mes" etiqueta="Mes" datos={ventasPorMes(ordenes, meses)} formato={compactarMoneda} />
      </section>

      <section className="tarjeta admin-grafico" aria-labelledby="titulo-evento">
        <div className="admin-grafico__cabecera">
          <h2 id="titulo-evento">Ventas por evento</h2>
          <Insignia tono="lavanda">Top 5</Insignia>
        </div>
        <GraficoBarras
          titulo="Ventas por evento"
          etiqueta="Evento"
          datos={top.map((t) => ({ etiqueta: t.nombre, valor: t.total }))}
          formato={compactarMoneda}
        />
      </section>

      <div className="admin-dos">
        <ListaValores
          titulo="Ventas por categoría"
          elementos={ventasPorCategoria(ordenes, eventos).map((c) => ({ nombre: c.etiqueta, valor: formatearMoneda(c.valor) }))}
        />
        <ListaValores
          titulo="Boletos por zona"
          elementos={ventasPorZona(ordenes, eventos).map((z) => ({ nombre: z.nombre, valor: `${z.porcentaje}%` }))}
        />
      </div>
    </>
  );
}
