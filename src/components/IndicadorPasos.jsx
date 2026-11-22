import Icono from "./Icono.jsx";
import "./IndicadorPasos.css";

const PASOS_COMPRA = ["Selección", "Carrito", "Pago", "Confirma"];

export default function IndicadorPasos({ pasoActual }){
  return (
    <nav className="indicador-pasos" aria-label="Progreso de la compra">
      <ol>
        {PASOS_COMPRA.map((paso, indice) => {
          const numero = indice + 1;
          const estado = numero < pasoActual ? "completo" : numero === pasoActual ? "actual" : "pendiente";
          return (
            <li
              key={paso}
              className={`indicador-pasos__paso indicador-pasos__paso--${estado}`}
              aria-current={estado === "actual" ? "step" : undefined}
            >
              <span className="indicador-pasos__numero" aria-hidden="true">
                {estado === "completo" ? <Icono nombre="check" tamano={12} /> : numero}
              </span>
              <span className="indicador-pasos__nombre">
                {paso}
                {estado === "completo" && <span className="solo-lectores"> (completado)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
