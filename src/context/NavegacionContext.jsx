import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const NavegacionContext = createContext(null);
const CLAVE_VISTA = "ticknova_vista";
const INICIO = { nombre: "inicio", params: {} };

// La vista actual se guarda en sessionStorage para conservarla al recargar.
function leerVista(){
  try {
    const guardada = JSON.parse(sessionStorage.getItem(CLAVE_VISTA));
    return guardada?.nombre ? { nombre: guardada.nombre, params: guardada.params || {} } : INICIO;
  } catch {
    return INICIO;
  }
}

export function NavegacionProvider({ children }){
  const [vista, setVista] = useState(leerVista);

  useEffect(() => {
    try {
      sessionStorage.setItem(CLAVE_VISTA, JSON.stringify(vista));
    } catch {
      // Sin sessionStorage la navegación sigue funcionando.
    }
  }, [vista]);

  const ir = useCallback((nombre, params = {}) => {
    setVista({ nombre, params });
    window.scrollTo(0, 0);
  }, []);

  const valor = useMemo(() => ({ vista, ir }), [vista, ir]);

  return <NavegacionContext.Provider value={valor}>{children}</NavegacionContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNavegacion(){
  const contexto = useContext(NavegacionContext);
  if (!contexto){
    throw new Error("useNavegacion debe usarse dentro de NavegacionProvider");
  }
  return contexto;
}
