export function formatearMoneda(cantidad){
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(cantidad);
}
export function formatearFecha(fecha){
  const partes = fecha.split("-");
  const anio = Number(partes[0]);
  const mes = Number(partes[1]) - 1;
  const dia = Number(partes[2]);
  const fechaConvertida = new Date(
    Date.UTC(anio, mes, dia)
  );
  return new Intl.DateTimeFormat("es-SV", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(fechaConvertida);
}
