import { useState } from "react";
import { Link, useLocation, useMatches } from "react-router";
import { useSesion } from "../context/SesionContext.jsx";
import Icono from "./Icono.jsx";
import Logo from "./Logo.jsx";
import "./Encabezado.css";

// "Categorías" lleva a los filtros por categoría de /eventos.
const ENLACES = [
  { texto: "Inicio", to: "/" },
  { texto: "Eventos", to: "/eventos" },
  { texto: "Categorías", to: "/eventos#categorias" },
  { texto: "Mis boletos", to: "/boletos" }
];

function estaActivo(enlace, { pathname, hash }){
  if (enlace.to === "/") return pathname === "/";
  if (enlace.to === "/eventos") return pathname === "/eventos" && hash !== "#categorias";
  if (enlace.to === "/eventos#categorias") return pathname === "/eventos" && hash === "#categorias";
  return pathname.startsWith(enlace.to);
}

export default function Encabezado(){
  const { usuario, puedeGestionar } = useSesion();
  const ubicacion = useLocation();
  // La página actual puede pedir un botón "volver" en lugar del menú (handle.volver en router.jsx).
  const ruta = useMatches().at(-1);
  const volver = ruta.handle?.volver ? ruta.handle : null;
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="encabezado">
      <div className="contenedor encabezado__contenido">
        <Logo />
        <nav className={`encabezado__nav ${menuAbierto ? "encabezado__nav--abierta" : ""}`} id="navegacion-principal" aria-label="Navegación principal">
          <ul>
            {ENLACES.map((enlace) => {
              const activo = estaActivo(enlace, ubicacion);
              return (
                <li key={enlace.texto}>
                  <Link
                    to={enlace.to}
                    onClick={() => setMenuAbierto(false)}
                    aria-current={activo ? "page" : undefined}
                    className={`encabezado__enlace ${activo ? "encabezado__enlace--activo" : ""}`}
                  >
                    {enlace.texto}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className={`encabezado__acciones ${volver ? "encabezado__acciones--volver" : ""}`}>
          {/* El avatar lleva a Ingresar, a Mi perfil (cliente) o al panel (administrador u organizador). */}
          <Link to={!usuario ? "/ingresar" : puedeGestionar ? "/admin" : "/perfil"} className="encabezado__avatar">
            <Icono nombre="usuario" tamano={22} />
            <span className="solo-lectores">{!usuario ? "Ingresar" : puedeGestionar ? "Panel de gestión" : "Mi perfil"}</span>
          </Link>
          {volver && (
            <Link to={volver.volver} className="encabezado__volver">
              <Icono nombre="atras" tamano={18} />
              {volver.titulo}
            </Link>
          )}
          <button
            type="button"
            className={`encabezado__hamburguesa ${volver ? "encabezado__hamburguesa--oculta" : ""}`}
            aria-expanded={menuAbierto}
            aria-controls="navegacion-principal"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <Icono nombre={menuAbierto ? "cerrar" : "menu"} tamano={24} />
            <span className="solo-lectores">{menuAbierto ? "Cerrar menú" : "Abrir menú"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
