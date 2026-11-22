import "./MapaAsientos.css";

// Mapa de asientos numerados; cada asiento es un botón con aria-pressed, usable con teclado.
export default function MapaAsientos({ filas, seleccionados, onAlternar, maximo }){
  const lleno = seleccionados.length >= maximo;

  return (
    <div className="mapa-asientos">
      <div className="mapa-asientos__escenario" aria-hidden="true">Escenario</div>
      <div className="mapa-asientos__filas" role="group" aria-label="Asientos disponibles">
        {filas.map(({ fila, asientos }) => (
          <div className="mapa-asientos__fila" key={fila}>
            {asientos.map((asiento) => {
              const elegido = seleccionados.includes(asiento.codigo);
              const bloqueado = asiento.ocupado || (lleno && !elegido);
              return (
                <button
                  key={asiento.codigo}
                  type="button"
                  className={`asiento ${asiento.ocupado ? "asiento--ocupado" : ""} ${elegido ? "asiento--elegido" : ""}`}
                  aria-pressed={elegido}
                  aria-label={`Asiento ${asiento.codigo}${asiento.ocupado ? ", ocupado" : ""}`}
                  disabled={bloqueado}
                  onClick={() => onAlternar(asiento.codigo)}
                />
              );
            })}
          </div>
        ))}
      </div>
      <ul className="mapa-asientos__leyenda">
        <li><span className="asiento asiento--muestra" />Disponible</li>
        <li><span className="asiento asiento--muestra asiento--elegido" />Seleccionado</li>
        <li><span className="asiento asiento--muestra asiento--ocupado" />Ocupado</li>
      </ul>
    </div>
  );
}
