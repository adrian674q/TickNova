import { createContext, useContext, useMemo } from "react";
import { CLAVES } from "../api/claves.js";
import * as usuariosService from "../api/usuariosService.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const SesionContext = createContext(null);

export function SesionProvider({ children }){
  const [usuario, setUsuario] = useLocalStorage(CLAVES.sesion, null);

  const valor = useMemo(() => ({
    usuario,
    esAdmin: usuario?.rol === "administrador",
    puedeGestionar: usuario?.rol === "administrador" || usuario?.rol === "organizador",
    iniciarSesion: async (correo, contrasena) => {
      const datos = await usuariosService.iniciarSesion(correo, contrasena);
      setUsuario(datos);
      return datos;
    },
    registrar: async (datosRegistro) => {
      const datos = await usuariosService.registrarUsuario(datosRegistro);
      setUsuario(datos);
      return datos;
    },
    actualizarPerfil: async (cambios) => {
      const datos = await usuariosService.actualizarPerfil(usuario.id, cambios);
      setUsuario(datos);
      return datos;
    },
    cerrarSesion: () => setUsuario(null)
  }), [usuario, setUsuario]);

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSesion(){
  const contexto = useContext(SesionContext);
  if (!contexto){
    throw new Error("useSesion debe usarse dentro de SesionProvider");
  }
  return contexto;
}
