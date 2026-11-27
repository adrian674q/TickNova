import { Outlet } from "react-router";
import Encabezado from "../components/Encabezado.jsx";
import EnlaceSaltar from "../components/EnlaceSaltar.jsx";
import PiePagina from "../components/PiePagina.jsx";
import "./Layouts.css";

export default function AppLayout(){
  return (
    <div className="estructura">
      <EnlaceSaltar />
      <Encabezado />
      <main id="contenido" className="estructura__principal" tabIndex={-1}>
        <Outlet />
      </main>
      <PiePagina />
    </div>
  );
}
