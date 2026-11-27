import { hoyIso, nombreMes } from "./formatos.js";

export function ordenesPagadas(ordenes){
  return ordenes.filter((orden) => orden.estado === "pagada");
}

function sumar(lista, campo){
  return lista.reduce((suma, elemento) => suma + elemento[campo], 0);
}

function mesDe(fecha){
  return fecha.slice(0, 7);
}

function mesAnterior(mes, pasos = 1){
  const [anio, numero] = mes.split("-").map(Number);
  const fecha = new Date(Date.UTC(anio, numero - 1 - pasos, 1));
  return fecha.toISOString().slice(0, 7);
}

function variacion(actual, anterior){
  if (anterior === 0) return actual > 0 ? 100 : 0;
  return Math.round(((actual - anterior) / anterior) * 100);
}

export function ventasPorMes(ordenes, meses = 6, hoy = hoyIso()){
  const pagadas = ordenesPagadas(ordenes);
  const actual = mesDe(hoy);
  return Array.from({ length: meses }, (_, i) => {
    const mes = mesAnterior(actual, meses - 1 - i);
    const total = sumar(pagadas.filter((orden) => mesDe(orden.fecha) === mes), "total");
    return { etiqueta: nombreMes(Number(mes.slice(5)) - 1), valor: total };
  });
}

export function resumenGeneral(ordenes, eventos, hoy = hoyIso()){
  const pagadas = ordenesPagadas(ordenes);
  const mes = mesDe(hoy);
  const anterior = mesAnterior(mes);
  const delMes = pagadas.filter((orden) => mesDe(orden.fecha) === mes);
  const delAnterior = pagadas.filter((orden) => mesDe(orden.fecha) === anterior);
  const activos = eventos.filter(
    (evento) => ["disponible", "pocos"].includes(evento.estado) && evento.fecha >= hoy
  );
  const ocupaciones = activos.map((evento) => {
    const capacidad = sumar(evento.zonas, "capacidad");
    const disponibles = sumar(evento.zonas, "disponibles");
    return capacidad ? (capacidad - disponibles) / capacidad : 0;
  });

  return {
    ventasMes: sumar(delMes, "total"),
    variacionVentas: variacion(sumar(delMes, "total"), sumar(delAnterior, "total")),
    boletosMes: sumar(delMes, "cantidad"),
    variacionBoletos: variacion(sumar(delMes, "cantidad"), sumar(delAnterior, "cantidad")),
    eventosActivos: activos.length,
    borradores: eventos.filter((evento) => evento.estado === "borrador").length,
    ocupacion: ocupaciones.length
      ? Math.round((ocupaciones.reduce((a, b) => a + b, 0) / ocupaciones.length) * 100)
      : 0,
    ingresosTotales: sumar(pagadas, "total"),
    boletosTotales: sumar(pagadas, "cantidad"),
    cancelaciones: ordenes.filter((orden) => orden.estado === "cancelada").length
  };
}

export function topEventos(ordenes, eventos, limite = 3){
  const totales = {};
  for (const orden of ordenesPagadas(ordenes)){
    totales[orden.eventoId] = (totales[orden.eventoId] || 0) + orden.total;
  }
  return Object.entries(totales)
    .map(([id, total]) => ({
      nombre: eventos.find((evento) => evento.id === Number(id))?.nombre || `Evento ${id}`,
      total
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limite);
}

export function ventasPorZona(ordenes, eventos){
  const totales = {};
  for (const orden of ordenesPagadas(ordenes)){
    const evento = eventos.find((e) => e.id === orden.eventoId);
    const zona = evento?.zonas.find((z) => z.id === orden.zonaId)?.nombre || "Otra";
    totales[zona] = (totales[zona] || 0) + orden.cantidad;
  }
  const total = Object.values(totales).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(totales)
    .map(([nombre, cantidad]) => ({ nombre, porcentaje: Math.round((cantidad / total) * 100) }))
    .sort((a, b) => b.porcentaje - a.porcentaje);
}

export function ventasPorCategoria(ordenes, eventos){
  const totales = {};
  for (const orden of ordenesPagadas(ordenes)){
    const categoria = eventos.find((e) => e.id === orden.eventoId)?.categoria || "Otra";
    totales[categoria] = (totales[categoria] || 0) + orden.total;
  }
  return Object.entries(totales)
    .map(([etiqueta, valor]) => ({ etiqueta, valor }))
    .sort((a, b) => b.valor - a.valor);
}

export function compactarMoneda(valor){
  return valor >= 1000 ? `$${(valor / 1000).toFixed(1)}k` : `$${Math.round(valor)}`;
}

export function formatearVariacion(valor, sufijo = ""){
  return `${valor >= 0 ? "+" : ""}${valor}%${sufijo}`;
}

// Órdenes de los últimos "meses" meses, contando el mes actual.
export function filtrarPorPeriodo(ordenes, meses, hoy = hoyIso()){
  const desde = mesAnterior(mesDe(hoy), meses - 1);
  return ordenes.filter((orden) => mesDe(orden.fecha) >= desde);
}
