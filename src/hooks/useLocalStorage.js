import { useEffect, useState } from "react";
import { leer, guardar } from "../utils/almacenamiento.js";

export function useLocalStorage(clave, valorInicial){
  const [valor, setValor] = useState(() => leer(clave, valorInicial));

  useEffect(() => {
    guardar(clave, valor);
  }, [clave, valor]);

  return [valor, setValor];
}
