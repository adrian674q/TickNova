import { usuarios } from "../data/usuarios.js";
import { simularPeticion } from "../utils/simularPeticion.js";

export function obtenerEventos(){
  return simularPeticion(eventos, 800);
}
export function obtenerEventoPorId(id){
  const evento = eventos.find(
    (evento) => evento.id === Number(id)
  );
  if (!evento){
    return simularPeticion(null, 500).then(() => {
      throw new Error("No se encontró el evento solicitado.");
    });
  }
  return simularPeticion(evento, 500);
}
