import Boton from "../../components/Boton.jsx";
import { Cargando, MensajeError } from "../../components/Estados.jsx";
import GraficoBarras from "../../components/GraficoBarras.jsx";
import Insignia from "../../components/Insignia.jsx";
import ListaValores from "../../components/ListaValores.jsx";
import TarjetaEstadistica from "../../components/TarjetaEstadistica.jsx";
import { useTitulo } from "../../hooks/useTitulo.js";
import { formatearMoneda, hoyIso } from "../../utils/formatos.js";
import {
  compactarMoneda,
  formatearVariacion,
  resumenGeneral,
  topEventos,
  ventasPorMes,
  ventasPorZona
} from "../../utils/reportes.js";
import { useDatosAdmin } from "./useDatosAdmin.js";
import "./AdminPages.css";

function mesActual(){
  const texto = new Intl.DateTimeFormat("es-SV", { month: "long", year: "numeric" }).format(new Date());
  return texto.charAt(0).toUpperCase() + texto.slice(1).replace(" de ", " ");
}

export default function DashboardPage(){
  useTitulo("Dashboard");
  const { estado, datos, error, reintentar } = useDatosAdmin();

  return (
    <>
      <div className="admin-cabecera">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general · {mesActual()}</p>
        </div>
        <Boton variante="oscuro" tamano="pequeno" to="/admin/eventos/nuevo">+ Crear Evento</Boton>
      </div>
      {estado === "cargando" && <Cargando texto="Calculando indicadores…" />}
      {estado === "error" && <MensajeError mensaje={error} onReintentar={reintentar} />}
      {estado === "exito" && <Contenido {...datos} />}
    </>
  );
}

function Contenido({ eventos, ordenes }){
  const resumen = resumenGeneral(ordenes, eventos, hoyIso());
  const meses = ventasPorMes(ordenes, 6);
  const top = topEventos(ordenes, eventos, 3);
  const zonas = ventasPorZona(ordenes, eventos);

  return (
    <>
      <section className="admin-estadisticas" aria-label="Indicadores del mes">
        <TarjetaEstadistica titulo="Ventas del mes" valor={formatearMoneda(resumen.ventasMes)} detalle={formatearVariacion(resumen.variacionVentas, " vs mes anterior")} />
        <TarjetaEstadistica titulo="Boletos vendidos" valor={resumen.boletosMes.toLocaleString("es-SV")} detalle={formatearVariacion(resumen.variacionBoletos)} />
        <TarjetaEstadistica titulo="Eventos activos" valor={resumen.eventosActivos} detalle={`${resumen.borradores} por publicar`} />
        <TarjetaEstadistica titulo="Ocupación prom." valor={`${resumen.ocupacion}%`} destacada />
      </section>

      <section className="tarjeta admin-grafico" aria-labelledby="titulo-ventas-mes">
        <div className="admin-grafico__cabecera">
          <h2 id="titulo-ventas-mes">Ventas por mes</h2>
          <Insignia tono="aviso">Últimos 6 meses</Insignia>
        </div>
        <GraficoBarras titulo="Ventas por mes" etiqueta="Mes" datos={meses} formato={compactarMoneda} />
      </section>

      <div className="admin-dos">
        <ListaValores titulo="Top Eventos" elementos={top.map((t) => ({ nombre: t.nombre, valor: compactarMoneda(t.total) }))} />
        <ListaValores titulo="Ventas por zona" elementos={zonas.map((z) => ({ nombre: z.nombre === "General" ? "Zona General" : `Zona ${z.nombre}`, valor: `${z.porcentaje}%` }))} />
      </div>
    </>
  );
}
