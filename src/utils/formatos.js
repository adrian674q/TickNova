const DIAS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
const MESES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

function aFecha(fecha){
  const [anio, mes, dia] = fecha.split("-").map(Number);
  return new Date(Date.UTC(anio, mes - 1, dia));
}

function capitalizar(texto){
  return texto.charAt(0) + texto.slice(1).toLowerCase();
}

export function formatearMoneda(cantidad){
  return new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(cantidad);
}

export function formatearPrecio(cantidad){
  return Number.isInteger(cantidad) ? `$${cantidad}` : formatearMoneda(cantidad);
}

export function formatearHora(hora){
  const [h, m] = hora.split(":").map(Number);
  const sufijo = h >= 12 ? "PM" : "AM";
  const hora12 = h % 12 === 0 ? 12 : h % 12;
  return `${hora12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

// "SÁB 14 NOV · 8:00 PM"
export function formatearFechaEvento(fecha, hora){
  const f = aFecha(fecha);
  const dia = String(f.getUTCDate()).padStart(2, "0");
  return `${DIAS[f.getUTCDay()]} ${dia} ${MESES[f.getUTCMonth()]} · ${formatearHora(hora)}`;
}

// "Sáb 14 Nov"
export function formatearFechaCorta(fecha){
  const f = aFecha(fecha);
  return `${capitalizar(DIAS[f.getUTCDay()])} ${f.getUTCDate()} ${capitalizar(MESES[f.getUTCMonth()])}`;
}

// "14 Nov"
export function formatearDiaMes(fecha){
  const f = aFecha(fecha);
  return `${f.getUTCDate()} ${capitalizar(MESES[f.getUTCMonth()])}`;
}

export function nombreMes(indice){
  return capitalizar(MESES[indice]);
}

export function hoyIso(){
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

export function sumarDias(fechaIso, dias){
  const f = aFecha(fechaIso);
  f.setUTCDate(f.getUTCDate() + dias);
  return f.toISOString().slice(0, 10);
}

export function diaSemana(fechaIso){
  return aFecha(fechaIso).getUTCDay();
}

export function iniciales(nombre){
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");
}
