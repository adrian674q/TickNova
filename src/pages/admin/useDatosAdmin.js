import { obtenerTodosLosEventos } from "../../api/eventosService.js";
import { obtenerOrdenes } from "../../api/ordenesService.js";
import { usePeticion } from "../../hooks/usePeticion.js";
import { ordenarPorFecha } from "../../utils/filtros.js";

// Carga eventos y órdenes para el panel. "eventos" son los vigentes (incluidos borradores);
// "todos" también trae los eliminados, para que sus ventas sigan en los reportes.
export function useDatosAdmin(){
  return usePeticion(
    (signal) => Promise.all([obtenerTodosLosEventos({ signal }), obtenerOrdenes({ signal })])
      .then(([todos, ordenes]) => ({ todos, eventos: todos.filter((evento) => !evento.eliminado), ordenes })),
    []
  );
}

// Eventos que gestiona el panel: los cuatro primeros por fecha.
export function eventosAdmin(eventos = []){
  return ordenarPorFecha(eventos).slice(0, 4);
}
