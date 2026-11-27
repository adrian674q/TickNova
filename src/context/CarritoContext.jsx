import { createContext, useContext, useMemo } from "react";
import { CLAVES } from "../api/claves.js";
import { CARGO_SERVICIO } from "../api/ordenesService.js";
import { useReducerPersistente } from "../hooks/useReducerPersistente.js";
import { carritoReducer } from "./reductores.js";

const CarritoContext = createContext(null);

function redondear(valor){
  return Math.round(valor * 100) / 100;
}

export function CarritoProvider({ children }){
  const [items, dispatch] = useReducerPersistente(carritoReducer, CLAVES.carrito, []);

  // Subtotal, cargo y total se calculan a partir de los items; no se guardan aparte.
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
      agregar: (nuevos) => dispatch({ type: "AGREGAR", items: nuevos }),
      quitar: (id) => dispatch({ type: "QUITAR", id }),
      vaciar: () => dispatch({ type: "VACIAR" })
    };
  }, [items, dispatch]);

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
