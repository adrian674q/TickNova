import { useState } from "react";
import { useNavegacion } from "../context/NavegacionContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import Enlace from "./Enlace.jsx";
import Icono from "./Icono.jsx";
import Logo from "./Logo.jsx";
import "./Encabezado.css";

// "Eventos" y "Categorías" muestran en Inicio todos los eventos o los de música.
const ENLACES = [
  { texto: "Inicio", vista: "inicio", params: {} },
  { texto: "Eventos", vista: "inicio", params: { busqueda: {} } },
  { texto: "Categorías", vista: "inicio", params: { busqueda: { categoria: "Música" } } },
  { texto: "Mis boletos", vista: "mis-boletos", params: {} }
];

export default function Encabezado({ volver }){
  const { usuario, puedeGestionar } = useSesion();
  const { vista } = useNavegacion();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [vistaMenu, setVistaMenu] = useState(vista);

  // Al cambiar de vista se cierra el menú móvil.
  if (vistaMenu !== vista){
    setVistaMenu(vista);
    setMenuAbierto(false);
  }

  return (
    <header className="encabezado">
      <div className="contenedor encabezado__contenido">
        <Logo />
        <nav className={`encabezado__nav ${menuAbierto ? "encabezado__nav--abierta" : ""}`} id="navegacion-principal" aria-label="Navegación principal">
          <ul>
            {ENLACES.map((enlace) => {
              const activo = vista.nombre === enlace.vista && JSON.stringify(vista.params) === JSON.stringify(enlace.params);
              return (
                <li key={enlace.texto}>
                  <Enlace
                    vista={enlace.vista}
                    params={enlace.params}
                    activo={activo}
                    className={`encabezado__enlace ${activo ? "encabezado__enlace--activo" : ""}`}
                  >
                    {enlace.texto}
                  </Enlace>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className={`encabezado__acciones ${volver ? "encabezado__acciones--volver" : ""}`}>
          {/* El avatar lleva a Ingresar, a Mi perfil (cliente) o al panel (administrador u organizador). */}
          <Enlace vista={!usuario ? "ingresar" : puedeGestionar ? "admin" : "perfil"} className="encabezado__avatar">
            <Icono nombre="usuario" tamano={22} />
            <span className="solo-lectores">{!usuario ? "Ingresar" : puedeGestionar ? "Panel de gestión" : "Mi perfil"}</span>
          </Enlace>
          {volver && (
            <Enlace vista={volver.vista} className="encabezado__volver">
              <Icono nombre="atras" tamano={18} />
              {volver.titulo}
            </Enlace>
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
