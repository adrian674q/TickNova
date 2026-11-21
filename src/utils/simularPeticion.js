export function simularPeticion(
  datos,
  tiempo = 800,
  probabilidadError = 0
) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const ocurreError = Math.random() < probabilidadError;

      if (ocurreError) {
        reject(new Error(
          "Ocurrió un error al procesar la solicitud. Intenta nuevamente."
        ));
      } else {
        resolve(datos);
      }
    }, tiempo);
  });
}