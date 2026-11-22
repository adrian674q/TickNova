import { obtenerEventos, obtenerEventoPorId } from "../api/eventosService.js";
import { usePeticion } from "./usePeticion.js";

export function useEventos(opciones = {}){
  const incluirBorradores = Boolean(opciones.incluirBorradores);
  return usePeticion(() => obtenerEventos({ incluirBorradores }), [incluirBorradores]);
}

export function useEvento(id){
  return usePeticion(() => obtenerEventoPorId(id), [id]);
}
