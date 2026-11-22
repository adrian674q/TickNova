import { buscarEvento } from "../api/eventosService.js";
import { obtenerOrdenPorCodigo } from "../api/ordenesService.js";
import Boton from "../components/Boton.jsx";
import CodigoQR from "../components/CodigoQR.jsx";
import { Cargando, MensajeError } from "../components/Estados.jsx";
import Icono from "../components/Icono.jsx";
import { useNavegacion } from "../context/NavegacionContext.jsx";
import { descargarQR, textoAsientos } from "../utils/boletos.js";
import { usePeticion } from "../hooks/usePeticion.js";
import { useTitulo } from "../hooks/useTitulo.js";
import { formatearFechaCorta, formatearHora } from "../utils/formatos.js";
import "./CompraPages.css";

export default function ConfirmacionPage(){
  useTitulo("Compra exitosa");
  const codigos = useNavegacion().vista.params.codigos || [];
  const clave = codigos.join(",");
  const { estado, datos: ordenes, error, reintentar } = usePeticion(
    () => Promise.all(codigos.map(obtenerOrdenPorCodigo)),
    [clave]
  );

  return (
    <div className="contenedor pagina">
      {estado === "cargando" && <Cargando texto="Confirmando tu compra…" />}
      {estado === "error" && <MensajeError mensaje={error} onReintentar={reintentar} />}
      {estado === "exito" && (
        <div className="confirmacion">
          <span className="confirmacion__icono" aria-hidden="true"><Icono nombre="check" tamano={36} /></span>
          <h1>¡Compra exitosa!</h1>
          <p className="texto-suave">Tus boletos fueron enviados a tu correo electrónico</p>
          <ul className="confirmacion__boletos">
            {ordenes.map((orden) => <BoletoConfirmado key={orden.codigo} orden={orden} />)}
          </ul>
          <Boton vista="mis-boletos" variante="secundario">Ver mis boletos</Boton>
        </div>
      )}
    </div>
  );
}

function BoletoConfirmado({ orden }){
  const evento = buscarEvento(orden.eventoId);
  const zona = evento.zonas.find((z) => z.id === orden.zonaId);

  return (
    <li className="tarjeta boleto-confirmado">
      <CodigoQR valor={orden.codigo} tamano={110} />
      <div>
        <h2>{evento.nombre}</h2>
        <p>{formatearFechaCorta(evento.fecha)} · {formatearHora(evento.hora)} · {evento.lugar}</p>
        <p>{textoAsientos(orden, zona, true)}</p>
        <div className="acciones">
          <Boton tamano="pequeno" onClick={() => descargarQR(orden.codigo, `boleto-${orden.codigo}.png`)}>
            Descargar boleto
          </Boton>
        </div>
      </div>
    </li>
  );
}
