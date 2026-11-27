import { leer, guardar } from "../utils/almacenamiento.js";
import { CLAVES } from "./claves.js";
import { esperarEscritura, leerRecurso } from "./cliente.js";

// Probabilidad de que la carga del listado falle, para mostrar el estado de error.
const PROBABILIDAD_ERROR = 0.08;
const ESTADOS_VALIDOS = ["disponible", "pocos", "agotado", "cancelado", "borrador"];

// Descuenta de cada zona los boletos comprados en este navegador.
function aplicarVentasGuardadas(evento){
  const ordenesGuardadas = leer(CLAVES.ordenes, []);
  const zonas = evento.zonas.map((zona) => {
    const vendidos = ordenesGuardadas
      .filter((orden) => orden.eventoId === evento.id && orden.zonaId === zona.id && orden.estado === "pagada")
      .reduce((total, orden) => total + orden.cantidad, 0);
    return { ...zona, disponibles: Math.max(0, zona.disponibles - vendidos) };
  });
  const quedan = zonas.reduce((total, zona) => total + zona.disponibles, 0);
  const sinBoletos = quedan === 0 && !["cancelado", "borrador"].includes(evento.estado);
  return { ...evento, zonas, estado: sinBoletos ? "agotado" : evento.estado };
}

// Une los eventos del JSON con los creados, editados o eliminados en el panel (localStorage).
async function listaCompleta(opciones){
  const base = await leerRecurso("eventos", opciones);
  const guardados = leer(CLAVES.eventos, []);
  const combinados = base.map((evento) => guardados.find((guardado) => guardado.id === evento.id) || evento);
  const nuevos = guardados.filter((guardado) => !base.some((evento) => evento.id === guardado.id));
  return [...combinados, ...nuevos].map(aplicarVentasGuardadas);
}

// Listado de eventos visibles (sin eliminados). Los borradores solo se incluyen en el panel.
export async function obtenerEventos({ incluirBorradores = false, signal } = {}){
  const lista = await listaCompleta({ signal, demora: 800, probabilidadError: PROBABILIDAD_ERROR });
  return lista.filter((evento) => !evento.eliminado && (incluirBorradores || evento.estado !== "borrador"));
}

// Todos los eventos, incluidos los eliminados, para mostrar boletos y reportes de compras anteriores.
export function obtenerTodosLosEventos({ signal } = {}){
  return listaCompleta({ signal, demora: 400 });
}

export async function obtenerEventoPorId(id, { signal } = {}){
  const lista = await listaCompleta({ signal });
  const evento = lista.find((item) => item.id === Number(id) && !item.eliminado);
  if (!evento) throw new Error("No se encontró el evento solicitado.");
  return evento;
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

function guardarCambio(evento){
  const restantes = leer(CLAVES.eventos, []).filter((guardado) => guardado.id !== evento.id);
  if (!guardar(CLAVES.eventos, [...restantes, evento])){
    throw new Error("No se pudo guardar el evento.");
  }
}

// Crea un evento nuevo o reemplaza uno existente.
export async function guardarEvento(datos){
  validarEvento(datos);
  const lista = await listaCompleta();
  await esperarEscritura(900);

  const id = datos.id || Math.max(0, ...lista.map((evento) => evento.id)) + 1;
  const evento = {
    ...datos,
    id,
    ciudad: datos.ciudad || "San Salvador",
    imagen: datos.imagen || "img/eventos/festival-de-primavera.jpg",
    publicado: datos.publicado || new Date().toISOString().slice(0, 10),
    destacado: Boolean(datos.destacado)
  };
  guardarCambio(evento);
  return evento;
}

// Eliminación lógica: el evento deja de mostrarse, pero sus órdenes siguen en reportes y boletos.
export async function eliminarEvento(id){
  const lista = await listaCompleta();
  const evento = lista.find((item) => item.id === Number(id));
  if (!evento) throw new Error("No se encontró el evento.");
  await esperarEscritura(700);
  guardarCambio({ ...evento, eliminado: true });
  return evento;
}
