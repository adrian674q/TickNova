import { leer, guardar } from "../utils/almacenamiento.js";
import { CLAVES } from "./claves.js";
import { esperarEscritura, leerRecurso } from "./cliente.js";
import { obtenerEventoPorId } from "./eventosService.js";

export const CARGO_SERVICIO = 0.06;

// Órdenes del JSON más las compras hechas en este navegador.
async function todasLasOrdenes(opciones){
  const base = await leerRecurso("ordenes", opciones);
  return [...base, ...leer(CLAVES.ordenes, [])];
}

export function obtenerOrdenes({ signal } = {}){
  return todasLasOrdenes({ signal, demora: 800 });
}

export async function obtenerOrdenesPorUsuario(usuarioId, { signal } = {}){
  const lista = await todasLasOrdenes({ signal, demora: 700 });
  return lista.filter((orden) => orden.usuarioId === Number(usuarioId));
}

export async function obtenerOrdenPorCodigo(codigo, { signal } = {}){
  const lista = await todasLasOrdenes({ signal });
  const orden = lista.find((item) => item.codigo === codigo);
  if (!orden) throw new Error("No se encontró el boleto solicitado.");
  return orden;
}

export async function obtenerAsientosVendidos(eventoId, zonaId, { signal } = {}){
  const lista = await todasLasOrdenes({ signal, demora: 300 });
  return lista
    .filter((orden) => orden.eventoId === Number(eventoId) && orden.zonaId === Number(zonaId) && orden.estado === "pagada")
    .flatMap((orden) => orden.asientos || []);
}

// Valida disponibilidad y asientos antes de registrar la compra.
export async function crearOrden(datosCompra){
  const { usuarioId, eventoId, zonaId, cantidad, asientos = [] } = datosCompra;
  const evento = await obtenerEventoPorId(eventoId);
  if (["agotado", "cancelado", "borrador"].includes(evento.estado)){
    throw new Error("Este evento no está disponible para comprar.");
  }
  const zona = evento.zonas.find((item) => item.id === Number(zonaId));
  if (!zona){
    throw new Error("La zona seleccionada no existe.");
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0){
    throw new Error("La cantidad de boletos no es válida.");
  }
  if (cantidad > zona.disponibles){
    throw new Error("No hay suficientes boletos disponibles.");
  }
  const vendidos = await obtenerAsientosVendidos(evento.id, zona.id);
  if (asientos.some((asiento) => vendidos.includes(asiento))){
    throw new Error("Uno de los asientos seleccionados ya fue vendido.");
  }

  const lista = await todasLasOrdenes({ demora: 0 });
  await esperarEscritura(1000);

  const nuevoId = Math.max(0, ...lista.map((orden) => orden.id)) + 1;
  const total = zona.precio * cantidad;
  const nuevaOrden = {
    id: nuevoId,
    usuarioId: Number(usuarioId),
    eventoId: evento.id,
    zonaId: zona.id,
    cantidad,
    asientos,
    total,
    cargoServicio: Math.round(total * CARGO_SERVICIO * 100) / 100,
    fecha: new Date().toISOString().slice(0, 10),
    estado: "pagada",
    codigo: `TN-${String(nuevoId).padStart(4, "0")}`
  };

  if (!guardar(CLAVES.ordenes, [...leer(CLAVES.ordenes, []), nuevaOrden])){
    throw new Error("No se pudo guardar la compra.");
  }
  return nuevaOrden;
}
