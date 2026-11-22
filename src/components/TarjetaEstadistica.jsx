import "./TarjetaEstadistica.css";

export default function TarjetaEstadistica({ titulo, valor, detalle, destacada = false }){
  return (
    <article className={`tarjeta-estadistica ${destacada ? "tarjeta-estadistica--destacada" : ""}`}>
      <h3 className="tarjeta-estadistica__titulo">{titulo}</h3>
      <p className="tarjeta-estadistica__valor">{valor}</p>
      {detalle && <p className="tarjeta-estadistica__detalle">{detalle}</p>}
    </article>
  );
}
