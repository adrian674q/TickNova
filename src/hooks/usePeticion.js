import { useCallback, useEffect, useRef, useState } from "react";

// Ejecuta una petición simulada y expone carga, éxito o error; ignora resultados obsoletos.
export function usePeticion(peticion, dependencias = []){
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState({ clave: null, datos: null, error: null });
  const ultimaPeticion = useRef(peticion);
  const clave = `${JSON.stringify(dependencias)}:${intento}`;

  useEffect(() => {
    ultimaPeticion.current = peticion;
  });

  useEffect(() => {
    let activo = true;
    ultimaPeticion.current()
      .then((datos) => {
        if (activo) setResultado({ clave, datos, error: null });
      })
      .catch((error) => {
        if (activo) setResultado({ clave, datos: null, error: error.message });
      });
    return () => {
      activo = false;
    };
  }, [clave]);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);

  let estado = "exito";
  if (resultado.clave !== clave) estado = "cargando";
  else if (resultado.error) estado = "error";

  return {
    estado,
    datos: estado === "exito" ? resultado.datos : null,
    error: estado === "error" ? resultado.error : null,
    reintentar
  };
}
