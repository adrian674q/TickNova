import { useEffect, useState } from "react";

// Pide datos a la API falsa y devuelve el estado: "cargando", "exito" o "error".
// Si cambian las dependencias o el componente desaparece, la petición anterior se cancela con AbortController.
export function usePeticion(peticion, dependencias = []){
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState({ clave: null, datos: null, error: null });
  // La clave identifica la petición actual: cambia si cambian las dependencias o al presionar Reintentar.
  const clave = `${JSON.stringify(dependencias)}-${intento}`;

  useEffect(() => {
    const controlador = new AbortController();
    peticion(controlador.signal)
      .then((datos) => {
        if (!controlador.signal.aborted) setResultado({ clave, datos, error: null });
      })
      .catch((error) => {
        if (!controlador.signal.aborted) setResultado({ clave, datos: null, error: error.message });
      });
    return () => controlador.abort();
    // La petición solo se repite cuando cambia la clave.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  function reintentar(){
    setIntento((anterior) => anterior + 1);
  }

  // Si el resultado guardado es de otra clave, la petición actual todavía no termina.
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
