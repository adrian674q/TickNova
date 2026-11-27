import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { obtenerAsientosVendidos } from "../api/ordenesService.js";
import Boton from "../components/Boton.jsx";
import { Cargando, MensajeError } from "../components/Estados.jsx";
import MapaAsientos from "../components/MapaAsientos.jsx";
import SelectorCantidad from "../components/SelectorCantidad.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { obtenerEventoPorId } from "../api/eventosService.js";
import { usePeticion } from "../hooks/usePeticion.js";
import { useTitulo } from "../hooks/useTitulo.js";
import { generarMapaAsientos } from "../utils/asientos.js";
import { nombreZona } from "../utils/boletos.js";
import { formatearPrecio } from "../utils/formatos.js";
import "./CompraPages.css";

const MAXIMO_POR_COMPRA = 8;

export default function SeleccionPage(){
  useTitulo("Selección de boletos");
  const { id } = useParams();
  const [parametros] = useSearchParams();
  const zonaId = Number(parametros.get("zona"));
  // El evento y los asientos ya vendidos se piden juntos a la API falsa.
  const { estado, datos, error, reintentar } = usePeticion(
    (signal) => Promise.all([obtenerEventoPorId(id, { signal }), obtenerAsientosVendidos(id, zonaId, { signal })]),
    [id, zonaId]
  );
  const [evento, vendidos] = datos || [];
  const zona = evento?.zonas.find((z) => z.id === zonaId);

  return (
    <div className="contenedor pagina">
      {estado === "cargando" && <Cargando texto="Preparando el mapa de la zona…" />}
      {estado === "error" && <MensajeError mensaje={error} onReintentar={reintentar} />}
      {estado === "exito" && !zona && (
        <MensajeError mensaje="La zona seleccionada no existe. Vuelve al evento y elige otra." />
      )}
      {estado === "exito" && zona && <Seleccion key={`${evento.id}-${zona.id}`} evento={evento} zona={zona} vendidos={vendidos} />}
    </div>
  );
}

function Seleccion({ evento, zona, vendidos }){
  const navegar = useNavigate();
  const { items, agregar } = useCarrito();
  const [asientos, setAsientos] = useState([]);
  const [cantidad, setCantidad] = useState(1);

  const enCarrito = items.filter((item) => item.eventoId === evento.id && item.zonaId === zona.id);
  const maximo = Math.min(zona.disponibles - enCarrito.reduce((s, i) => s + i.cantidad, 0), MAXIMO_POR_COMPRA);

  // Ocupados: los ya vendidos más los que ya están en tu carrito.
  const ocupados = [...vendidos, ...enCarrito.map((item) => item.asiento).filter(Boolean)];
  const filas = generarMapaAsientos(ocupados);

  const boletos = zona.numerada ? asientos.length : cantidad;
  const total = boletos * zona.precio;
  const textoZona = nombreZona(zona.nombre);

  function alternarAsiento(codigo){
    setAsientos((actuales) =>
      actuales.includes(codigo)
        ? actuales.filter((a) => a !== codigo)
        : [...actuales, codigo].sort()
    );
  }

  function agregarAlCarrito(){
    if (boletos === 0) return;
    const base = {
      eventoId: evento.id,
      eventoNombre: evento.nombre,
      fecha: evento.fecha,
      hora: evento.hora,
      lugar: evento.lugar,
      imagen: evento.imagen,
      zonaId: zona.id,
      zonaNombre: zona.nombre,
      precio: zona.precio,
      maximo: zona.disponibles
    };
    if (zona.numerada){
      agregar(asientos.map((asiento) => ({ ...base, asiento, cantidad: 1 })));
    } else {
      agregar([{ ...base, asiento: null, cantidad }]);
    }
    navegar("/carrito");
  }

  return (
    <div className="dos-columnas compra">
      <section className="tarjeta" aria-labelledby="titulo-seleccion">
        <h1 id="titulo-seleccion" className="compra__titulo">
          {zona.numerada ? "Elige tus asientos" : "Elige tus boletos"}
        </h1>
        <p className="texto-suave compra__subtitulo">
          {textoZona} · {evento.nombre}
        </p>

        {maximo <= 0 ? (
          <p className="compra__aviso" role="status">
            Ya tienes en el carrito todos los boletos disponibles para esta zona.
          </p>
        ) : zona.numerada ? (
          <MapaAsientos
            filas={filas}
            seleccionados={asientos}
            onAlternar={alternarAsiento}
            maximo={maximo}
          />
        ) : (
          <div className="compra__cantidad">
            <p>{zona.descripcion}</p>
            <SelectorCantidad valor={cantidad} maximo={maximo} onCambiar={setCantidad} />
          </div>
        )}
      </section>

      <aside className="tarjeta compra__lateral" aria-labelledby="titulo-tu-seleccion">
        <h2 id="titulo-tu-seleccion" className="compra__lateral-titulo">Tu selección</h2>
        {boletos > 0 && (
          <ul className="compra__lista" aria-live="polite">
            {zona.numerada
              ? asientos.map((asiento) => (
                <li key={asiento}><span>Asiento {asiento}</span><strong>{formatearPrecio(zona.precio)}</strong></li>
              ))
              : <li><span>{cantidad} × {textoZona}</span><strong>{formatearPrecio(total)}</strong></li>}
          </ul>
        )}
        <p className="compra__total">Total <strong>{formatearPrecio(total)}</strong></p>
        <Boton ancho onClick={agregarAlCarrito} disabled={boletos === 0}>Agregar al carrito</Boton>
      </aside>
    </div>
  );
}
