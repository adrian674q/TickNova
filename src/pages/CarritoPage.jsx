import Boton from "../components/Boton.jsx";
import { EstadoVacio } from "../components/Estados.jsx";
import ItemCarrito from "../components/ItemCarrito.jsx";
import ResumenCompra from "../components/ResumenCompra.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { useTitulo } from "../hooks/useTitulo.js";
import "./CompraPages.css";

export default function CarritoPage(){
  useTitulo("Tu carrito");
  const { items, subtotal, cargo, total, quitar } = useCarrito();
  const { usuario } = useSesion();

  return (
    <div className="contenedor pagina">
      <h1 className="pagina__titulo compra__titulo">Tu carrito</h1>
      {items.length === 0 ? (
        <EstadoVacio titulo="Tu carrito está vacío" texto="Explora los eventos y agrega tus boletos aquí.">
          <Boton to="/eventos" tamano="pequeno">Explorar eventos</Boton>
        </EstadoVacio>
      ) : (
        <div className="dos-columnas">
          <div className="carrito__principal">
            <ul className="carrito__lista" aria-label="Boletos en el carrito">
              {items.map((item) => <ItemCarrito key={item.id} item={item} onQuitar={quitar} />)}
            </ul>
            <p className="carrito__mas">¿Quieres más? Explora eventos y agrégalos aquí.</p>
          </div>
          <ResumenCompra lineas={[{ texto: "Subtotal", valor: subtotal }]} cargo={cargo} total={total}>
            <div className="carrito__acciones">
              {/* El checkout es público, pero para pagar se pide iniciar sesión antes y luego se vuelve aquí. */}
              {usuario
                ? <Boton ancho to="/checkout">Ir a pagar</Boton>
                : <Boton ancho to="/ingresar" state={{ desde: "/checkout" }}>Ingresar para continuar</Boton>}
              <Boton ancho variante="secundario" to="/eventos">Seguir comprando</Boton>
            </div>
          </ResumenCompra>
        </div>
      )}
    </div>
  );
}
