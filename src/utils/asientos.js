export const FILAS = ["A", "B", "C", "D", "E", "F"];
export const COLUMNAS = 14;

export function codigoAsiento(fila, numero){
  return `${fila}-${String(numero).padStart(2, "0")}`;
}

// Número pseudoaleatorio estable para que los asientos ocupados no cambien por evento y zona.
function aleatorio(semilla){
  let valor = semilla;
  return () => {
    valor = (valor * 9301 + 49297) % 233280;
    return valor / 233280;
  };
}

export function generarMapaAsientos(evento, zona, vendidos = []){
  const todos = FILAS.flatMap((fila) =>
    Array.from({ length: COLUMNAS }, (_, i) => codigoAsiento(fila, i + 1))
  );
  const proporcion = zona.capacidad > 0 ? zona.disponibles / zona.capacidad : 0;
  const libres = Math.min(
    zona.disponibles,
    Math.max(Math.round(todos.length * proporcion), Math.min(zona.disponibles, 8))
  );
  const ocupados = new Set(vendidos);
  const azar = aleatorio(evento.id * 31 + zona.id * 7);
  const orden = [...todos];
  for (let i = orden.length - 1; i > 0; i--){
    const j = Math.floor(azar() * (i + 1));
    [orden[i], orden[j]] = [orden[j], orden[i]];
  }

  for (const asiento of orden){
    if (ocupados.size >= todos.length - libres) break;
    ocupados.add(asiento);
  }
  return FILAS.map((fila) => ({
    fila,
    asientos: Array.from({ length: COLUMNAS }, (_, i) => {
      const codigo = codigoAsiento(fila, i + 1);
      return { codigo, ocupado: ocupados.has(codigo) };
    })
  }));
}
