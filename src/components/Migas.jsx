import { Link } from "react-router";
import "./Migas.css";

export default function Migas({ elementos }){
  return (
    <nav className="migas" aria-label="Ruta de navegación">
      <ol>
        {elementos.map((elemento, indice) => {
          const ultimo = indice === elementos.length - 1;
          return (
            <li key={elemento.texto}>
              {ultimo || !elemento.to
                ? <span aria-current={ultimo ? "page" : undefined}>{elemento.texto}</span>
                : <Link to={elemento.to}>{elemento.texto}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
