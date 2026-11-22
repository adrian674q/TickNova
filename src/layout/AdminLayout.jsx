import { useState } from "react";
import BarraLateral from "../components/BarraLateral.jsx";
import EnlaceSaltar from "../components/EnlaceSaltar.jsx";
import Icono from "../components/Icono.jsx";
import Logo from "../components/Logo.jsx";
import { useNavegacion } from "../context/NavegacionContext.jsx";
import "./Layouts.css";

export default function AdminLayout({ children }){
  const { vista } = useNavegacion();
  const [abierta, setAbierta] = useState(false);
  const [vistaMenu, setVistaMenu] = useState(vista);

  if (vistaMenu !== vista){
    setVistaMenu(vista);
    setAbierta(false);
  }

  return (
    <div className="estructura-admin">
      <EnlaceSaltar />
      <div className="barra-movil-admin">
        <Logo vista="admin" />
        <button
          type="button"
          aria-expanded={abierta}
          aria-controls="barra-lateral"
          onClick={() => setAbierta(!abierta)}
        >
          <Icono nombre={abierta ? "cerrar" : "menu"} tamano={24} />
          <span className="solo-lectores">{abierta ? "Cerrar menú" : "Abrir menú"}</span>
        </button>
      </div>
      <BarraLateral abierta={abierta} id="barra-lateral" />
      <main id="contenido" className="estructura-admin__principal" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
