import Enlace from "./Enlace.jsx";
import Logo from "./Logo.jsx";
import "./PiePagina.css";

// Los textos sin vista se muestran como en el prototipo, sin enlace.
const COLUMNAS = [
  {
    titulo: "Explorar",
    enlaces: [
      { vista: "inicio", params: { busqueda: { categoria: "Música" } }, texto: "Conciertos" },
      { vista: "inicio", params: { busqueda: { categoria: "Deportes" } }, texto: "Deportes" },
      { vista: "inicio", params: { busqueda: { categoria: "Teatro" } }, texto: "Teatro" },
      { vista: "inicio", params: { busqueda: { categoria: "Familia" } }, texto: "Familia" }
    ]
  },
  {
    titulo: "Cuenta",
    enlaces: [
      { vista: "ingresar", texto: "Iniciar sesión" },
      { vista: "ingresar", params: { modo: "registro" }, texto: "Crear cuenta" },
      { vista: "mis-boletos", texto: "Mis boletos" },
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
                  {enlace.vista ? <Enlace vista={enlace.vista} params={enlace.params}>{enlace.texto}</Enlace> : <span>{enlace.texto}</span>}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
