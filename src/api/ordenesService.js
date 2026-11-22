import { ordenes } from "../data/ordenes.js";
import { leer, guardar } from "../utils/almacenamiento.js";
import { simularPeticion } from "../utils/simularPeticion.js";
import { CLAVES } from "./claves.js";
import { buscarEvento } from "./eventosService.js";

export const CARGO_SERVICIO = 0.06;

function todasLasOrdenes(){
  return [...ordenes, ...leer(CLAVES.ordenes, [])];
}

export function obtenerOrdenes(){
  return simularPeticion(todasLasOrdenes(), 800);
}

export function obtenerOrdenesPorUsuario(usuarioId){
  const lista = todasLasOrdenes().filter(
    (orden) => orden.usuarioId === Number(usuarioId)
  );
  return simularPeticion(lista, 700);
}

export function obtenerOrdenPorCodigo(codigo){
  const orden = todasLasOrdenes().find((orden) => orden.codigo === codigo);
  if (!orden){
    return simularPeticion(null, 500).then(() => {
      throw new Error("No se encontró el boleto solicitado.");
    });
  }
  return simularPeticion(orden, 500);
}

export function obtenerAsientosVendidos(eventoId, zonaId){
  return todasLasOrdenes()
    .filter(
      (orden) =>
        orden.eventoId === Number(eventoId) &&
        orden.zonaId === Number(zonaId) &&
        orden.estado === "pagada"
    )
    .flatMap((orden) => orden.asientos || []);
}

export async function crearOrden(datosCompra){
  const { usuarioId, eventoId, zonaId, cantidad, asientos = [] } = datosCompra;
  const evento = buscarEvento(eventoId);
  if (!evento){
    throw new Error("El evento seleccionado no existe.");
  }
  if (["agotado", "cancelado", "borrador"].includes(evento.estado)){
    throw new Error("Este evento no está disponible para comprar.");
  }
  const zona = evento.zonas.find(
    (zona) => zona.id === Number(zonaId)
  );
  if (!zona){
    throw new Error("La zona seleccionada no existe.");
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0){
    throw new Error("La cantidad de boletos no es válida.");
  }
  if (cantidad > zona.disponibles){
    throw new Error("No hay suficientes boletos disponibles.");
  }
  const vendidos = obtenerAsientosVendidos(evento.id, zona.id);
  if (asientos.some((asiento) => vendidos.includes(asiento))){
    throw new Error("Uno de los asientos seleccionados ya fue vendido.");
  }

  await simularPeticion(null, 1000);

  const ordenesGuardadas = leer(CLAVES.ordenes, []);
  const nuevoId = Math.max(
    0,
    ...todasLasOrdenes().map((orden) => orden.id)
  ) + 1;
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

  const seGuardo = guardar(CLAVES.ordenes, [
    ...ordenesGuardadas,
    nuevaOrden
  ]);

  if (!seGuardo) {
    throw new Error("No se pudo guardar la compra.");
  }
  return nuevaOrden;
}
