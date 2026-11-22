import EnlaceSaltar from "../components/EnlaceSaltar.jsx";
import Enlace from "../components/Enlace.jsx";
import Icono from "../components/Icono.jsx";
import IndicadorPasos from "../components/IndicadorPasos.jsx";
import Logo from "../components/Logo.jsx";
import "./Layouts.css";

// Flujo de compra con el progreso de cuatro pasos.
export default function CompraLayout({ paso, titulo, volver, children }){
  return (
    <div className="estructura">
      <EnlaceSaltar />
      <header className="encabezado-compra">
        <div className="contenedor encabezado-compra__contenido">
          <Logo />
          <div className="encabezado-compra__pasos">
            <IndicadorPasos pasoActual={paso} />
          </div>
          <Enlace vista={volver.vista} params={volver.params} className="encabezado-compra__volver">
            <Icono nombre="atras" tamano={18} />
            {titulo}
          </Enlace>
        </div>
      </header>
      <div className="encabezado-compra__pasos-movil">
        <IndicadorPasos pasoActual={paso} />
      </div>
      <main id="contenido" className="estructura__principal" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
