import Enlace from "./Enlace.jsx";
import "./Migas.css";

export default function Migas({ elementos }){
  return (
    <nav className="migas" aria-label="Ruta de navegación">
      <ol>
        {elementos.map((elemento, indice) => {
          const ultimo = indice === elementos.length - 1;
          return (
            <li key={elemento.texto}>
              {ultimo || !elemento.vista
                ? <span aria-current={ultimo ? "page" : undefined}>{elemento.texto}</span>
                : <Enlace vista={elemento.vista} params={elemento.params}>{elemento.texto}</Enlace>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
