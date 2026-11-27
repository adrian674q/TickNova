import Boton from "../components/Boton.jsx";
import { EstadoVacio } from "../components/Estados.jsx";
import { useTitulo } from "../hooks/useTitulo.js";

export default function NotFoundPage(){
  useTitulo("Página no encontrada");
  return (
    <div className="contenedor pagina">
      <h1 className="pagina__titulo">Página no encontrada</h1>
      <EstadoVacio titulo="No encontramos lo que buscas" texto="Puede que el enlace esté mal escrito o que la página ya no exista.">
        <Boton to="/" tamano="pequeno">Volver al inicio</Boton>
      </EstadoVacio>
    </div>
  );
}
