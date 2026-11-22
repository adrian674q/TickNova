import Icono from "./Icono.jsx";
import "./SelectorCantidad.css";

export default function SelectorCantidad({ valor, maximo, onCambiar }){
  return (
    <div className="selector-cantidad" role="group" aria-label="Cantidad de boletos">
      <button
        type="button"
        className="selector-cantidad__boton"
        onClick={() => onCambiar(valor - 1)}
        disabled={valor <= 1}
        aria-label="Quitar un boleto"
      >
        <Icono nombre="menos" tamano={18} />
      </button>
      <output className="selector-cantidad__valor" aria-live="polite">{valor}</output>
      <button
        type="button"
        className="selector-cantidad__boton"
        onClick={() => onCambiar(valor + 1)}
        disabled={valor >= maximo}
        aria-label="Agregar un boleto"
      >
        <Icono nombre="mas" tamano={18} />
      </button>
    </div>
  );
}
