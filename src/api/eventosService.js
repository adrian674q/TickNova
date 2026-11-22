import { eventos } from "../data/eventos.js";
import { leer, guardar } from "../utils/almacenamiento.js";
import { simularPeticion } from "../utils/simularPeticion.js";
import { CLAVES } from "./claves.js";

// Probabilidad de que la carga del listado falle, para mostrar el estado de error.
const PROBABILIDAD_ERROR = 0.08;
const ESTADOS_VALIDOS = ["disponible", "pocos", "agotado", "cancelado", "borrador"];

function aplicarVentasGuardadas(evento){
  const ordenesGuardadas = leer(CLAVES.ordenes, []);
  const zonas = evento.zonas.map((zona) => {
    const vendidos = ordenesGuardadas
      .filter(
        (orden) =>
          orden.eventoId === evento.id &&
          orden.zonaId === zona.id &&
          orden.estado === "pagada"
      )
      .reduce((total, orden) => total + orden.cantidad, 0);
    return { ...zona, disponibles: Math.max(0, zona.disponibles - vendidos) };
  });
  const quedan = zonas.reduce((total, zona) => total + zona.disponibles, 0);
  const sinBoletos = quedan === 0 && !["cancelado", "borrador"].includes(evento.estado);
  return { ...evento, zonas, estado: sinBoletos ? "agotado" : evento.estado };
}

function listaCompleta(){
  const guardados = leer(CLAVES.eventos, []);
  const base = eventos.map(
    (evento) => guardados.find((guardado) => guardado.id === evento.id) || evento
  );
  const nuevos = guardados.filter(
    (guardado) => !eventos.some((evento) => evento.id === guardado.id)
  );
  return [...base, ...nuevos].map(aplicarVentasGuardadas);
}

export function buscarEvento(id){
  return listaCompleta().find((evento) => evento.id === Number(id)) || null;
}

export function obtenerEventos({ incluirBorradores = false } = {}){
  const lista = listaCompleta().filter(
    (evento) => incluirBorradores || evento.estado !== "borrador"
  );
  return simularPeticion(lista, 800, PROBABILIDAD_ERROR);
}

export function obtenerEventoPorId(id){
  const evento = buscarEvento(id);
  if (!evento){
    return simularPeticion(null, 500).then(() => {
      throw new Error("No se encontró el evento solicitado.");
    });
  }
  return simularPeticion(evento, 500);
}

function validarEvento(datos){
  if (!datos.nombre || datos.nombre.trim().length < 3){
    throw new Error("El nombre del evento debe tener al menos 3 caracteres.");
  }
  if (!datos.categoria || !datos.lugar){
    throw new Error("La categoría y el lugar son obligatorios.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha) || !/^\d{2}:\d{2}$/.test(datos.hora)){
    throw new Error("La fecha y la hora no son válidas.");
  }
  if (!ESTADOS_VALIDOS.includes(datos.estado)){
    throw new Error("El estado del evento no es válido.");
  }
  if (!Array.isArray(datos.zonas) || datos.zonas.length === 0){
    throw new Error("El evento debe tener al menos una localidad.");
  }
}

export async function guardarEvento(datos){
  validarEvento(datos);
  await simularPeticion(null, 900);

  const guardados = leer(CLAVES.eventos, []);
  const todos = [...eventos, ...guardados];
  const id = datos.id || Math.max(0, ...todos.map((evento) => evento.id)) + 1;
  const evento = {
    ...datos,
    id,
    ciudad: datos.ciudad || "San Salvador",
    imagen: datos.imagen || "img/eventos/festival-de-primavera.jpg",
    publicado: datos.publicado || new Date().toISOString().slice(0, 10),
    destacado: Boolean(datos.destacado)
  };
  const restantes = guardados.filter((guardado) => guardado.id !== id);

  if (!guardar(CLAVES.eventos, [...restantes, evento])){
    throw new Error("No se pudo guardar el evento.");
  }
  return evento;
}
