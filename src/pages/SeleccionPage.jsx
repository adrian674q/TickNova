import { useMemo, useState } from "react";
import { obtenerAsientosVendidos } from "../api/ordenesService.js";
import Boton from "../components/Boton.jsx";
import { Cargando, MensajeError } from "../components/Estados.jsx";
import MapaAsientos from "../components/MapaAsientos.jsx";
import SelectorCantidad from "../components/SelectorCantidad.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useNavegacion } from "../context/NavegacionContext.jsx";
import { useEvento } from "../hooks/useEventos.js";
import { useTitulo } from "../hooks/useTitulo.js";
import { generarMapaAsientos } from "../utils/asientos.js";
import { nombreZona } from "../utils/boletos.js";
import { formatearPrecio } from "../utils/formatos.js";
import "./CompraPages.css";

const MAXIMO_POR_COMPRA = 8;

export default function SeleccionPage(){
  useTitulo("Selección de boletos");
  const { id, zona: zonaId } = useNavegacion().vista.params;
  const { estado, datos: evento, error, reintentar } = useEvento(id);
  const zona = evento?.zonas.find((z) => z.id === Number(zonaId));

  return (
    <div className="contenedor pagina">
      {estado === "cargando" && <Cargando texto="Preparando el mapa de la zona…" />}
      {estado === "error" && <MensajeError mensaje={error} onReintentar={reintentar} />}
      {estado === "exito" && !zona && (
        <MensajeError mensaje="La zona seleccionada no existe. Vuelve al evento y elige otra." />
      )}
      {estado === "exito" && zona && <Seleccion key={`${evento.id}-${zona.id}`} evento={evento} zona={zona} />}
    </div>
  );
}

function Seleccion({ evento, zona }){
  const { ir } = useNavegacion();
  const { items, agregar } = useCarrito();
  const [asientos, setAsientos] = useState([]);
  const [cantidad, setCantidad] = useState(1);

  const enCarrito = items.filter((item) => item.eventoId === evento.id && item.zonaId === zona.id);
  const maximo = Math.min(zona.disponibles - enCarrito.reduce((s, i) => s + i.cantidad, 0), MAXIMO_POR_COMPRA);

  const filas = useMemo(() => {
    const ocupados = [
      ...obtenerAsientosVendidos(evento.id, zona.id),
      ...enCarrito.map((item) => item.asiento).filter(Boolean)
    ];
    return generarMapaAsientos(evento, zona, ocupados);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evento, zona]);

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
    ir("carrito");
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
