// Simula la latencia de un servidor. Se puede cancelar con un AbortSignal.
export function simularPeticion(datos, tiempo = 800, probabilidadError = 0, signal){
  return new Promise((resolve, reject) => {
    if (signal?.aborted){
      reject(signal.reason);
      return;
    }
    const temporizador = setTimeout(() => {
      signal?.removeEventListener("abort", cancelar);
      if (Math.random() < probabilidadError){
        reject(new Error("Ocurrió un error al procesar la solicitud. Intenta nuevamente."));
      } else {
        resolve(datos);
      }
    }, tiempo);

    function cancelar(){
      clearTimeout(temporizador);
      reject(signal.reason);
    }
    signal?.addEventListener("abort", cancelar, { once: true });
  });
}
