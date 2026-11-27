import { useRegisterSW } from "virtual:pwa-register/react";
import "./Avisos.css";

// Avisos del service worker: nueva versión disponible y app lista para usarse sin conexión.
export default function AvisoPWA(){
  const {
    needRefresh: [hayActualizacion, setHayActualizacion],
    offlineReady: [listaOffline, setListaOffline],
    updateServiceWorker
  } = useRegisterSW();

  if (!hayActualizacion && !listaOffline) return null;

  return (
    <div className="aviso-pwa" role="status">
      <p>
        {hayActualizacion
          ? "Hay una nueva versión de TickNova disponible."
          : "TickNova está lista para usarse sin conexión."}
      </p>
      <div className="aviso-pwa__acciones">
        {hayActualizacion && (
          <button type="button" className="aviso-pwa__principal" onClick={() => updateServiceWorker(true)}>
            Actualizar
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setHayActualizacion(false);
            setListaOffline(false);
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
