import { useRouteError } from "react-router";
import Boton from "../components/Boton.jsx";
import { MensajeError } from "../components/Estados.jsx";

export default function ErrorPage(){
  const error = useRouteError();
  return (
    <div className="contenedor pagina">
      <MensajeError
        mensaje={error?.statusText || error?.message || "Ocurrió un error inesperado."}
        onReintentar={() => window.location.reload()}
      />
      <div className="estado">
        <Boton to="/" variante="secundario" tamano="pequeno">Volver al inicio</Boton>
      </div>
    </div>
  );
}
