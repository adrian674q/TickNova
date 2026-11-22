import "./GraficoBarras.css";

// Gráfico de barras con CSS y una tabla oculta con los mismos datos para lectores de pantalla.
export default function GraficoBarras({ titulo, datos, formato = (valor) => valor, etiqueta }){
  const maximo = Math.max(1, ...datos.map((dato) => dato.valor));

  return (
    <figure className="grafico-barras">
      <div className="grafico-barras__area" aria-hidden="true">
        {datos.map((dato) => (
          <div className="grafico-barras__columna" key={dato.etiqueta}>
            <div className="grafico-barras__pista">
              <span
                className="grafico-barras__barra"
                style={{ height: `${Math.max(3, (dato.valor / maximo) * 100)}%` }}
              />
            </div>
            <span className="grafico-barras__etiqueta">{dato.etiqueta}</span>
          </div>
        ))}
      </div>
      <table className="solo-lectores">
        <caption>{titulo}</caption>
        <thead>
          <tr><th scope="col">{etiqueta || "Periodo"}</th><th scope="col">Valor</th></tr>
        </thead>
        <tbody>
          {datos.map((dato) => (
            <tr key={dato.etiqueta}><th scope="row">{dato.etiqueta}</th><td>{formato(dato.valor)}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
