import { simularPeticion } from "../utils/simularPeticion.js";

const BASE_API = `${import.meta.env.BASE_URL}api/`;

// Lee un recurso de la API falsa (public/api/*.json) con fetch.
// Primero simula la latencia del servidor; ambas partes se cancelan con el mismo signal.
export async function leerRecurso(nombre, { signal, demora = 500, probabilidadError = 0 } = {}){
  await simularPeticion(null, demora, probabilidadError, signal);
  let respuesta;
  try {
    respuesta = await fetch(`${BASE_API}${nombre}.json`, { signal });
  } catch (error){
    if (error.name === "AbortError") throw error;
    throw new Error("Sin conexión: estos datos aún no están guardados para usarse sin internet.");
  }
  if (!respuesta.ok){
    throw new Error("No se pudieron cargar los datos. Intenta nuevamente.");
  }
  return respuesta.json();
}

// Espera simulada para las operaciones de escritura (se guardan en localStorage).
export function esperarEscritura(tiempo = 800){
  return simularPeticion(null, tiempo);
}
