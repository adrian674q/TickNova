export const FILAS = ["A", "B", "C", "D", "E", "F"];
export const COLUMNAS = 14;

// "A" y 5 → "A-05"
export function codigoAsiento(fila, numero){
  return `${fila}-${String(numero).padStart(2, "0")}`;
}

// Arma el mapa de 6 filas × 14 asientos.
// Un asiento está ocupado si ya se vendió (o ya está en el carrito) o si es de ejemplo:
// cada quinto asiento sale ocupado para que el mapa se vea como en el prototipo.
export function generarMapaAsientos(vendidos = []){
  return FILAS.map((fila, indiceFila) => ({
    fila,
    asientos: Array.from({ length: COLUMNAS }, (_, i) => {
      const numero = i + 1;
      const codigo = codigoAsiento(fila, numero);
      const deEjemplo = (indiceFila * COLUMNAS + numero) % 5 === 0;
      return { codigo, ocupado: deEjemplo || vendidos.includes(codigo) };
    })
  }));
}
