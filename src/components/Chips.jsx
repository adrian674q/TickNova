import "./Chips.css";

// Grupo de filtros tipo píldora. Solo uno puede estar activo.
export default function Chips({ opciones, valor, onCambiar, etiqueta, oscuro = false }){
  return (
    <div className={`chips ${oscuro ? "chips--oscuro" : ""}`} role="group" aria-label={etiqueta}>
      {opciones.map((opcion) => (
        <button
          key={opcion.valor}
          type="button"
          className="chips__chip"
          aria-pressed={valor === opcion.valor}
          onClick={() => onCambiar(opcion.valor)}
        >
          {opcion.etiqueta}
        </button>
      ))}
    </div>
  );
}
