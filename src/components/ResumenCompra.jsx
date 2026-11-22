import { formatearMoneda } from "../utils/formatos.js";
import "./ResumenCompra.css";

// Resumen de importes reutilizado en carrito y pago.
export default function ResumenCompra({
  titulo = "Resumen",
  lineas = [],
  cargo,
  total,
  variante = "blanco",
  children
}){
  return (
    <section className={`resumen-compra resumen-compra--${variante}`} aria-label={titulo}>
      <h2 className="resumen-compra__titulo">{titulo}</h2>
      <dl>
        {lineas.map((linea) => (
          <div className="fila-resumen" key={linea.texto}>
            <dt>{linea.texto}</dt>
            <dd>{formatearMoneda(linea.valor)}</dd>
          </div>
        ))}
        <div className="fila-resumen">
          <dt>Cargo por servicio</dt>
          <dd>{formatearMoneda(cargo)}</dd>
        </div>
        <div className="fila-resumen fila-resumen--total">
          <dt>Total</dt>
          <dd className="resumen-compra__total">{formatearMoneda(total)}</dd>
        </div>
      </dl>
      {children}
    </section>
  );
}
