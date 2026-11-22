import { formatearDiaMes, formatearHora } from "../utils/formatos.js";
import CodigoQR from "./CodigoQR.jsx";
import Insignia from "./Insignia.jsx";
import { textoAsientos } from "../utils/boletos.js";
import "./TarjetaBoleto.css";

export default function TarjetaBoleto({ orden, evento, pasado = false }){
  const zona = evento.zonas.find((z) => z.id === orden.zonaId);

  return (
    <article className="tarjeta-boleto">
      <CodigoQR valor={orden.codigo} tamano={72} />
      <div className="tarjeta-boleto__info">
        <Insignia tono={pasado ? "neutro" : "exito"}>{pasado ? "Usado" : "Activo"}</Insignia>
        <h3 className="tarjeta-boleto__nombre">{evento.nombre}</h3>
        <p className="tarjeta-boleto__detalle">
          {formatearDiaMes(evento.fecha)} · {formatearHora(evento.hora)} · {textoAsientos(orden, zona)}
        </p>
      </div>
    </article>
  );
}
