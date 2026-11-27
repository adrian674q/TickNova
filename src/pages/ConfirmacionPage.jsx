import { useSearchParams } from "react-router";
import { obtenerTodosLosEventos } from "../api/eventosService.js";
import { obtenerOrdenPorCodigo } from "../api/ordenesService.js";
import Boton from "../components/Boton.jsx";
import CodigoQR from "../components/CodigoQR.jsx";
import { Cargando, MensajeError } from "../components/Estados.jsx";
import Icono from "../components/Icono.jsx";
import { descargarQR, textoAsientos } from "../utils/boletos.js";
import { usePeticion } from "../hooks/usePeticion.js";
import { useTitulo } from "../hooks/useTitulo.js";
import { formatearFechaCorta, formatearHora, formatearMoneda } from "../utils/formatos.js";
import "./CompraPages.css";

export default function ConfirmacionPage(){
  useTitulo("Compra exitosa");
  // Los códigos de las órdenes llegan en la URL, así la confirmación funciona aunque se recargue.
  const [parametros] = useSearchParams();
  const clave = parametros.get("codigos") || "";
  const { estado, datos, error, reintentar } = usePeticion(
    (signal) => Promise.all([
      Promise.all(clave.split(",").filter(Boolean).map((codigo) => obtenerOrdenPorCodigo(codigo, { signal }))),
      obtenerTodosLosEventos({ signal })
    ]),
    [clave]
  );
  const [ordenes, eventos] = datos || [];

  return (
    <div className="contenedor pagina">
      {estado === "cargando" && <Cargando texto="Confirmando tu compra…" />}
      {estado === "error" && <MensajeError mensaje={error} onReintentar={reintentar} />}
      {estado === "exito" && (
        <div className="confirmacion">
          <span className="confirmacion__icono" aria-hidden="true"><Icono nombre="check" tamano={36} /></span>
          <h1>¡Compra exitosa!</h1>
          <p className="texto-suave">Tus boletos fueron enviados a tu correo electrónico (envío simulado)</p>
          <ul className="confirmacion__boletos">
            {ordenes.map((orden) => (
              <BoletoConfirmado key={orden.codigo} orden={orden} evento={eventos.find((e) => e.id === orden.eventoId)} />
            ))}
          </ul>
          <Boton to="/boletos" variante="secundario">Ver mis boletos</Boton>
        </div>
      )}
    </div>
  );
}

function BoletoConfirmado({ orden, evento }){
  const zona = evento.zonas.find((z) => z.id === orden.zonaId);

  return (
    <li className="tarjeta boleto-confirmado">
      <CodigoQR valor={orden.codigo} tamano={110} />
      <div>
        <h2>{evento.nombre}</h2>
        <p>{formatearFechaCorta(evento.fecha)} · {formatearHora(evento.hora)} · {evento.lugar}</p>
        <p>{textoAsientos(orden, zona, true)}</p>
        <p>Precio: {formatearMoneda(orden.total)} · Código {orden.codigo}</p>
        <div className="acciones">
          <Boton tamano="pequeno" onClick={() => descargarQR(orden.codigo, `boleto-${orden.codigo}.png`)}>
            Descargar boleto
          </Boton>
        </div>
      </div>
    </li>
  );
}
