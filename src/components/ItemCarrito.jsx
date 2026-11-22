import { nombreZona } from "../utils/boletos.js";
import { formatearDiaMes, formatearPrecio } from "../utils/formatos.js";
import { rutaPublica } from "../utils/rutas.js";
import "./ItemCarrito.css";

export default function ItemCarrito({ item, onQuitar }){
  const detalle = item.asiento
    ? `Asiento ${item.asiento}`
    : `${item.cantidad} ${item.cantidad === 1 ? "boleto" : "boletos"}`;

  return (
    <li className="item-carrito">
      <img className="item-carrito__imagen" src={rutaPublica(item.imagen)} alt="" />
      <div className="item-carrito__info">
        <p className="item-carrito__nombre">{item.eventoNombre}</p>
        <p className="item-carrito__detalle">
          {nombreZona(item.zonaNombre)} · {detalle} · {formatearDiaMes(item.fecha)}
        </p>
      </div>
      <p className="item-carrito__precio">{formatearPrecio(item.precio * item.cantidad)}</p>
      <button
        type="button"
        className="item-carrito__quitar"
        onClick={() => onQuitar(item.id)}
        aria-label={`Quitar ${item.eventoNombre}, ${detalle}`}
      >
        Quitar
      </button>
    </li>
  );
}
