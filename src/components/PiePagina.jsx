import { Link } from "react-router";
import Logo from "./Logo.jsx";
import "./PiePagina.css";

// Los textos sin ruta se muestran como en el prototipo, sin enlace.
const COLUMNAS = [
  {
    titulo: "Explorar",
    enlaces: [
      { to: "/eventos?categoria=Música", texto: "Conciertos" },
      { to: "/eventos?categoria=Deportes", texto: "Deportes" },
      { to: "/eventos?categoria=Teatro", texto: "Teatro" },
      { to: "/eventos?categoria=Familia", texto: "Familia" }
    ]
  },
  {
    titulo: "Cuenta",
    enlaces: [
      { to: "/ingresar", texto: "Iniciar sesión" },
      { to: "/ingresar?modo=registro", texto: "Crear cuenta" },
      { to: "/boletos", texto: "Mis boletos" },
      { texto: "Ayuda" }
    ]
  },
  {
    titulo: "Legal",
    enlaces: [
      { texto: "Términos" },
      { texto: "Privacidad" },
      { texto: "Reembolsos" }
    ]
  }
];

export default function PiePagina(){
  return (
    <footer className="pie-pagina">
      <div className="contenedor pie-pagina__contenido">
        <div className="pie-pagina__marca">
          <Logo />
          <p>Tus eventos, un solo lugar.</p>
        </div>
        {COLUMNAS.map((columna) => (
          <nav key={columna.titulo} className="pie-pagina__columna" aria-label={columna.titulo}>
            <h2>{columna.titulo}</h2>
            <ul>
              {columna.enlaces.map((enlace) => (
                <li key={enlace.texto}>
                  {enlace.to ? <Link to={enlace.to}>{enlace.texto}</Link> : <span>{enlace.texto}</span>}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
