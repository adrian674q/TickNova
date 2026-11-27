import { useState } from "react";
import { Outlet, useNavigation } from "react-router";
import BarraLateral from "../components/BarraLateral.jsx";
import EnlaceSaltar from "../components/EnlaceSaltar.jsx";
import { Cargando } from "../components/Estados.jsx";
import Icono from "../components/Icono.jsx";
import Logo from "../components/Logo.jsx";
import "./Layouts.css";

export default function AdminLayout(){
  // Las páginas del panel se cargan de forma diferida (lazy); mientras llegan se muestra un aviso.
  const { state } = useNavigation();
  const [abierta, setAbierta] = useState(false);

  return (
    <div className="estructura-admin">
      <EnlaceSaltar />
      <div className="barra-movil-admin">
        <Logo to="/admin" />
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
      <BarraLateral abierta={abierta} id="barra-lateral" alNavegar={() => setAbierta(false)} />
      <main id="contenido" className="estructura-admin__principal" tabIndex={-1}>
        {state === "loading" ? <Cargando texto="Cargando sección…" /> : <Outlet />}
      </main>
    </div>
  );
}
