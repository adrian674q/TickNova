import { ordenes } from "../data/ordenes.js";
import { eventos } from "../data/eventos.js";
import { leer, guardar } from "../utils/almacenamiento.js";
import { simularPeticion } from "../utils/simularPeticion.js";

const CLAVE_ORDENES = "ticknova_ordenes";

export function obtenerOrdenes(){
  const ordenesGuardadas = leer(CLAVE_ORDENES, []);
  const todasLasOrdenes = [
    ...ordenes,
    ...ordenesGuardadas
  ];
  return simularPeticion(todasLasOrdenes, 800);
}

export async function crearOrden(datosCompra){
  const { usuarioId, eventoId, zonaId, cantidad } = datosCompra;
  const evento = eventos.find(
    (evento) => evento.id === Number(eventoId)
  );
  if (!evento){
    throw new Error("El evento seleccionado no existe.");
  }
  if (evento.estado === "agotado" || evento.estado === "cancelado"){
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
  const ordenesGuardadas = leer(CLAVE_ORDENES, []);
  const boletosVendidos = ordenesGuardadas
    .filter(
      (orden) =>
        orden.eventoId === evento.id &&
        orden.zonaId === zona.id &&
        orden.estado === "pagada"
    )
    .reduce((total, orden) => total + orden.cantidad, 0);
  const disponibles = zona.disponibles - boletosVendidos;

  if (cantidad > disponibles){
    throw new Error("No hay suficientes boletos disponibles.");
  }
  await simularPeticion(null, 1000);
  const todasLasOrdenes = [...ordenes, ...ordenesGuardadas];
  const nuevoId = Math.max(
    0,
    ...todasLasOrdenes.map((orden) => orden.id)
  ) + 1;
  const nuevaOrden = {
    id: nuevoId,
    usuarioId: Number(usuarioId),
    eventoId: evento.id,
    zonaId: zona.id,
    cantidad,
    total: zona.precio * cantidad,
    fecha: new Date().toISOString().slice(0, 10),
    estado: "pagada",
    codigo: `TN-${String(nuevoId).padStart(4, "0")}`
  };

  const seGuardo = guardar(CLAVE_ORDENES, [
    ...ordenesGuardadas,
    nuevaOrden
  ]);

  if (!seGuardo) {
    throw new Error("No se pudo guardar la compra.");
  }
  return nuevaOrden;
}
