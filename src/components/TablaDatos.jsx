import "./TablaDatos.css";

// Tabla genérica de columnas y filas; en móvil cada fila se muestra como tarjeta.
// Con tablaEnTablet se mantiene como tabla también en tablet.
export default function TablaDatos({ titulo, columnas, filas, claveFila = "id", tablaEnTablet = false }){
  return (
    <div className={`tabla-datos ${tablaEnTablet ? "tabla-datos--tablet" : ""}`}>
      <table>
        <caption className="solo-lectores">{titulo}</caption>
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave} scope="col" className={columna.alinear === "fin" ? "tabla-datos__fin" : ""}>
                {columna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila[claveFila]}>
              {columnas.map((columna) => (
                <td
                  key={columna.clave}
                  data-titulo={columna.titulo}
                  className={columna.alinear === "fin" ? "tabla-datos__fin" : ""}
                >
                  {columna.render ? columna.render(fila) : fila[columna.clave]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
