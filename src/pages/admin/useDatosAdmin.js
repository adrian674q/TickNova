import { obtenerEventos } from "../../api/eventosService.js";
import { obtenerOrdenes } from "../../api/ordenesService.js";
import { usePeticion } from "../../hooks/usePeticion.js";
import { ordenarPorFecha } from "../../utils/filtros.js";

// Carga eventos (incluidos borradores) y órdenes para las vistas del panel.
export function useDatosAdmin(){
  return usePeticion(
    () => Promise.all([obtenerEventos({ incluirBorradores: true }), obtenerOrdenes()])
      .then(([eventos, ordenes]) => ({ eventos, ordenes })),
    []
  );
}

// Eventos que gestiona el panel: los cuatro primeros por fecha.
export function eventosAdmin(eventos = []){
  return ordenarPorFecha(eventos).slice(0, 4);
}
