import { Link, Outlet, useMatches } from "react-router";
import AvisoConexion from "../components/AvisoConexion.jsx";
import EnlaceSaltar from "../components/EnlaceSaltar.jsx";
import Icono from "../components/Icono.jsx";
import IndicadorPasos from "../components/IndicadorPasos.jsx";
import Logo from "../components/Logo.jsx";
import "./Layouts.css";

// Flujo de compra con el progreso de cuatro pasos; cada ruta indica su paso en handle (router.jsx).
export default function CompraLayout(){
  const ruta = useMatches().at(-1);
  const { paso, titulo, volver } = ruta.handle;
  const destino = typeof volver === "function" ? volver(ruta.params) : volver;

  return (
    <div className="estructura">
      <EnlaceSaltar />
      <header className="encabezado-compra">
        <div className="contenedor encabezado-compra__contenido">
          <Logo />
          <div className="encabezado-compra__pasos">
            <IndicadorPasos pasoActual={paso} />
          </div>
          <Link to={destino} className="encabezado-compra__volver">
            <Icono nombre="atras" tamano={18} />
            {titulo}
          </Link>
        </div>
      </header>
      <div className="encabezado-compra__pasos-movil">
        <IndicadorPasos pasoActual={paso} />
      </div>
      <AvisoConexion />
      <main id="contenido" className="estructura__principal" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
