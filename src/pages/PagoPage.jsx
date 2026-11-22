import { useRef, useState } from "react";
import { crearOrden } from "../api/ordenesService.js";
import Boton from "../components/Boton.jsx";
import Campo from "../components/Campo.jsx";
import { EstadoVacio, MensajeError } from "../components/Estados.jsx";
import ResumenCompra from "../components/ResumenCompra.jsx";
import { useCarrito } from "../context/CarritoContext.jsx";
import { useNavegacion } from "../context/NavegacionContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { useTitulo } from "../hooks/useTitulo.js";
import { nombreZona } from "../utils/boletos.js";
import { formatearFechaCorta, formatearMoneda } from "../utils/formatos.js";
import { formatearNumeroTarjeta, formatearVencimiento, validarPago } from "../utils/validaciones.js";
import "./CompraPages.css";

// Tarjeta de prueba que siempre es rechazada, para mostrar el estado de error.
const TARJETA_RECHAZADA = "4000000000000002";

function agruparPorZona(items){
  return Object.values(items.reduce((grupos, item) => {
    const clave = `${item.eventoId}-${item.zonaId}`;
    const grupo = grupos[clave] || { ...item, cantidad: 0, asientos: [] };
    grupo.cantidad += item.cantidad;
    if (item.asiento) grupo.asientos = [...grupo.asientos, item.asiento];
    return { ...grupos, [clave]: grupo };
  }, {}));
}

export default function PagoPage(){
  useTitulo("Pago");
  const { ir } = useNavegacion();
  const { usuario } = useSesion();
  const { items, cargo, total, vaciar } = useCarrito();
  const [datos, setDatos] = useState({ nombre: "", numero: "", vence: "", cvv: "" });
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);
  const [errorPago, setErrorPago] = useState("");
  const enviado = useRef(false);

  const grupos = agruparPorZona(items);

  if (items.length === 0){
    return (
      <div className="contenedor pagina">
        <EstadoVacio titulo="No hay boletos para pagar" texto="Agrega boletos al carrito para continuar.">
          <Boton vista="inicio" tamano="pequeno">Explorar eventos</Boton>
        </EstadoVacio>
      </div>
    );
  }

  function cambiar(evento){
    const { name, value } = evento.target;
    let valor = value;
    if (name === "numero") valor = formatearNumeroTarjeta(value);
    if (name === "vence") valor = formatearVencimiento(value);
    if (name === "cvv") valor = value.replace(/\D/g, "").slice(0, 4);
    setDatos({ ...datos, [name]: valor });
    if (errores[name]) setErrores({ ...errores, [name]: undefined });
  }

  function validarCampo(evento){
    const resultado = validarPago(datos);
    setErrores((actuales) => ({ ...actuales, [evento.target.name]: resultado[evento.target.name] }));
  }

  function enviar(evento){
    evento.preventDefault();
    const resultado = validarPago(datos);
    setErrores(resultado);
    setErrorPago("");
    if (Object.keys(resultado).length === 0) pagar();
  }

  async function pagar(){
    // Evita una segunda compra si se presiona dos veces.
    if (enviado.current) return;
    enviado.current = true;
    setProcesando(true);
    try {
      if (datos.numero.replace(/\s/g, "") === TARJETA_RECHAZADA){
        await new Promise((resolver) => setTimeout(resolver, 1000));
        throw new Error("Tu banco rechazó el pago. Revisa los datos o usa otra tarjeta.");
      }
      const codigos = [];
      for (const grupo of grupos){
        const orden = await crearOrden({
          usuarioId: usuario.id,
          eventoId: grupo.eventoId,
          zonaId: grupo.zonaId,
          cantidad: grupo.cantidad,
          asientos: grupo.asientos
        });
        codigos.push(orden.codigo);
      }
      ir("confirmacion", { codigos });
      vaciar();
    } catch (error){
      setErrorPago(error.message);
      setProcesando(false);
      enviado.current = false;
    }
  }

  const primero = grupos[0];

  return (
    <div className="contenedor pagina">
      <h1 className="pagina__titulo compra__titulo">Datos de pago</h1>
      <div className="dos-columnas">
        <form className="tarjeta pago__formulario" noValidate onSubmit={enviar}>
          <span className="pago__metodo">Tarjeta</span>
          {errorPago && <MensajeError compacto titulo="No se pudo completar el pago" mensaje={errorPago} />}
          <Campo
            etiqueta="Nombre en la tarjeta"
            name="nombre"
            autoComplete="off"
            placeholder="ABCD"
            value={datos.nombre}
            onChange={cambiar}
            onBlur={validarCampo}
            error={errores.nombre}
            required
          />
          <Campo
            etiqueta="Número de tarjeta"
            name="numero"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0000 0000 0000 0000"
            value={datos.numero}
            onChange={cambiar}
            onBlur={validarCampo}
            error={errores.numero}
            required
          />
          <div className="pago__fila">
            <Campo
              etiqueta="Vence"
              name="vence"
              inputMode="numeric"
              autoComplete="off"
              placeholder="MM / AA"
              value={datos.vence}
              onChange={cambiar}
              onBlur={validarCampo}
              error={errores.vence}
              required
            />
            <Campo
              etiqueta="CVV"
              name="cvv"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              placeholder="•••"
              value={datos.cvv}
              onChange={cambiar}
              onBlur={validarCampo}
              error={errores.cvv}
              required
            />
          </div>
          <Boton type="submit" ancho cargando={procesando}>
            {procesando ? "Procesando pago…" : `Pagar ${formatearMoneda(total)}`}
          </Boton>
        </form>

        <ResumenCompra
          titulo="Resumen de compra"
          variante="lavanda"
          lineas={grupos.map((grupo) => ({
            texto: `${grupo.cantidad} × ${nombreZona(grupo.zonaNombre)}`,
            valor: grupo.precio * grupo.cantidad
          }))}
          cargo={cargo}
          total={total}
        >
          <p className="pago__evento">
            <strong>{primero.eventoNombre}</strong>
            {formatearFechaCorta(primero.fecha)} · {primero.lugar}
            {grupos.length > 1 && ` y ${grupos.length - 1} más`}
          </p>
        </ResumenCompra>
      </div>
    </div>
  );
}
