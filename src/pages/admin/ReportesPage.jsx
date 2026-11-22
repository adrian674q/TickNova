import { Cargando, MensajeError } from "../../components/Estados.jsx";
import GraficoBarras from "../../components/GraficoBarras.jsx";
import Insignia from "../../components/Insignia.jsx";
import ListaValores from "../../components/ListaValores.jsx";
import TarjetaEstadistica from "../../components/TarjetaEstadistica.jsx";
import { useTitulo } from "../../hooks/useTitulo.js";
import { formatearMoneda } from "../../utils/formatos.js";
import { compactarMoneda, resumenGeneral, topEventos, ventasPorCategoria, ventasPorMes, ventasPorZona } from "../../utils/reportes.js";
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
      {estado === "exito" && <Contenido {...datos} />}
    </>
  );
}

function Contenido({ eventos, ordenes }){
  const resumen = resumenGeneral(ordenes, eventos);
  const promedio = resumen.boletosTotales ? resumen.ingresosTotales / resumen.boletosTotales : 0;
  const top = topEventos(ordenes, eventos, 5);

  return (
    <>
      <section className="admin-estadisticas" aria-label="Totales">
        <TarjetaEstadistica titulo="Ingresos totales" valor={formatearMoneda(resumen.ingresosTotales)} detalle="Órdenes pagadas" />
        <TarjetaEstadistica titulo="Boletos vendidos" valor={resumen.boletosTotales.toLocaleString("es-SV")} detalle="Desde el inicio" />
        <TarjetaEstadistica titulo="Precio promedio" valor={formatearMoneda(promedio)} detalle="Por boleto" />
        <TarjetaEstadistica titulo="Cancelaciones" valor={resumen.cancelaciones} detalle="Órdenes canceladas" destacada />
      </section>

      <section className="tarjeta admin-grafico" aria-labelledby="titulo-periodo">
        <div className="admin-grafico__cabecera">
          <h2 id="titulo-periodo">Ventas por periodo</h2>
          <Insignia tono="aviso">Últimos 6 meses</Insignia>
        </div>
        <GraficoBarras titulo="Ventas por mes" etiqueta="Mes" datos={ventasPorMes(ordenes, 6)} formato={compactarMoneda} />
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
