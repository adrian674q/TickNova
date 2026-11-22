import { createContext, useContext, useMemo } from "react";
import { CLAVES } from "../api/claves.js";
import { CARGO_SERVICIO } from "../api/ordenesService.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const CarritoContext = createContext(null);

function redondear(valor){
  return Math.round(valor * 100) / 100;
}

export function CarritoProvider({ children }){
  const [items, setItems] = useLocalStorage(CLAVES.carrito, []);

  const valor = useMemo(() => {
    const subtotal = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    const cargo = redondear(subtotal * CARGO_SERVICIO);
    const cantidad = items.reduce((suma, item) => suma + item.cantidad, 0);

    return {
      items,
      cantidad,
      subtotal,
      cargo,
      total: redondear(subtotal + cargo),
      agregar: (nuevos) => setItems((actuales) => {
        // Las entradas generales de la misma zona se acumulan en un solo item.
        let resultado = actuales;
        for (const nuevo of nuevos){
          const id = `${nuevo.eventoId}-${nuevo.zonaId}-${nuevo.asiento || "general"}`;
          const existente = resultado.find((item) => item.id === id);
          if (existente){
            resultado = resultado.map((item) =>
              item.id === id
                ? { ...item, cantidad: Math.min(item.cantidad + nuevo.cantidad, nuevo.maximo) }
                : item
            );
          } else {
            resultado = [...resultado, { ...nuevo, id }];
          }
        }
        return resultado;
      }),
      quitar: (id) => setItems((actuales) => actuales.filter((item) => item.id !== id)),
      vaciar: () => setItems([])
    };
  }, [items, setItems]);

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCarrito(){
  const contexto = useContext(CarritoContext);
  if (!contexto){
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  }
  return contexto;
}
