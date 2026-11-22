import { hoyIso, sumarDias, diaSemana } from "./formatos.js";

export const OPCIONES_FECHA = [
  { valor: "todas", etiqueta: "Cualquier fecha" },
  { valor: "hoy", etiqueta: "Hoy" },
  { valor: "fin", etiqueta: "Este fin de semana" },
  { valor: "30", etiqueta: "Próximos 30 días" }
];

function rangoFinDeSemana(hoy){
  const dia = diaSemana(hoy);
  if (dia === 0) return [hoy, hoy];
  const inicio = dia === 6 ? hoy : sumarDias(hoy, 5 - dia);
  return [inicio, sumarDias(hoy, 7 - dia)];
}

export function coincideFecha(fecha, filtro, hoy = hoyIso()){
  if (filtro === "hoy") return fecha === hoy;
  if (filtro === "fin"){
    const [inicio, fin] = rangoFinDeSemana(hoy);
    return fecha >= inicio && fecha <= fin;
  }
  if (filtro === "30") return fecha >= hoy && fecha <= sumarDias(hoy, 30);
  return true;
}

export function filtrarEventos(eventos, { texto = "", categoria = "todas", fecha = "todas", ciudad = "todas" }){
  const busqueda = texto.trim().toLowerCase();
  return eventos.filter((evento) => {
    const coincideTexto =
      busqueda === "" ||
      [evento.nombre, evento.lugar, evento.categoria]
        .some((campo) => campo.toLowerCase().includes(busqueda));
    const coincideCategoria = categoria === "todas" || evento.categoria === categoria;
    const coincideCiudad = ciudad === "todas" || evento.ciudad === ciudad;
    return coincideTexto && coincideCategoria && coincideCiudad && coincideFecha(evento.fecha, fecha);
  });
}

export function ordenarPorFecha(eventos){
  return [...eventos].sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`));
}

