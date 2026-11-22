import "./ListaValores.css";

// Lista de pares nombre / valor, como "Top eventos" o "Ventas por zona".
export default function ListaValores({ titulo, elementos, children }){
  return (
    <section className="lista-valores tarjeta" aria-label={titulo}>
      <h2 className="lista-valores__titulo">{titulo}</h2>
      {children}
      <ul>
        {elementos.map((elemento) => (
          <li key={elemento.nombre}>
            <span>{elemento.nombre}</span>
            <strong>{elemento.valor}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
