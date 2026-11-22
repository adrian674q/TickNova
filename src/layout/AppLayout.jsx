import Encabezado from "../components/Encabezado.jsx";
import PiePagina from "../components/PiePagina.jsx";
import EnlaceSaltar from "../components/EnlaceSaltar.jsx";
import "./Layouts.css";

export default function AppLayout({ volver, children }){
  return (
    <div className="estructura">
      <EnlaceSaltar />
      <Encabezado volver={volver} />
      <main id="contenido" className="estructura__principal" tabIndex={-1}>
        {children}
      </main>
      <PiePagina />
    </div>
  );
}
