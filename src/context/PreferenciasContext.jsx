import { createContext, useContext, useMemo } from "react";
import { CLAVES } from "../api/claves.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const PreferenciasContext = createContext(null);

const PREFERENCIAS_INICIALES = {
  correoRecordado: "",
  filtroFecha: "30"
};

export function PreferenciasProvider({ children }){
  const [preferencias, setPreferencias] = useLocalStorage(CLAVES.preferencias, PREFERENCIAS_INICIALES);

  const valor = useMemo(() => ({
    preferencias: { ...PREFERENCIAS_INICIALES, ...preferencias },
    cambiarPreferencia: (clave, nuevoValor) =>
      setPreferencias((actuales) => ({ ...actuales, [clave]: nuevoValor }))
  }), [preferencias, setPreferencias]);

  return <PreferenciasContext.Provider value={valor}>{children}</PreferenciasContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePreferencias(){
  const contexto = useContext(PreferenciasContext);
  if (!contexto){
    throw new Error("usePreferencias debe usarse dentro de PreferenciasProvider");
  }
  return contexto;
}
