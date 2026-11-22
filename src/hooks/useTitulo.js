import { useEffect } from "react";

export function useTitulo(titulo){
  useEffect(() => {
    const anterior = document.title;
    document.title = titulo ? `${titulo} · TickNova` : "TickNova";
    return () => {
      document.title = anterior;
    };
  }, [titulo]);
}
