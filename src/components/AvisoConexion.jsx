import { useSyncExternalStore } from "react";
import "./Avisos.css";

function suscribir(callback){
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

// Aviso de modo sin conexión: la app sigue funcionando con lo que ya se visitó.
export default function AvisoConexion(){
  const enLinea = useSyncExternalStore(suscribir, () => navigator.onLine, () => true);
  if (enLinea) return null;
  return (
    <p className="aviso-conexion" role="status">
      Sin conexión. Estás viendo el contenido guardado; algunas acciones no estarán disponibles.
    </p>
  );
}
