import { obtenerEventos, obtenerEventoPorId } from "../api/eventosService.js";
import { usePeticion } from "./usePeticion.js";

export function useEventos(opciones = {}){
  const incluirBorradores = Boolean(opciones.incluirBorradores);
  return usePeticion((signal) => obtenerEventos({ incluirBorradores, signal }), [incluirBorradores]);
}

export function useEvento(id){
  return usePeticion((signal) => obtenerEventoPorId(id, { signal }), [id]);
}
