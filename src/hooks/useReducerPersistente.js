import { useEffect, useReducer } from "react";
import { leer, guardar } from "../utils/almacenamiento.js";

// useReducer que arranca con lo guardado en localStorage y guarda cada cambio de estado.
export function useReducerPersistente(reducer, clave, estadoInicial){
  const [estado, dispatch] = useReducer(reducer, estadoInicial, (inicial) => leer(clave, inicial));

  useEffect(() => {
    guardar(clave, estado);
  }, [clave, estado]);

  return [estado, dispatch];
}
