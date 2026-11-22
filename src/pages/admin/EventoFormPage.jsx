import { useState } from "react";
import { guardarEvento } from "../../api/eventosService.js";
import { eventos as eventosBase } from "../../data/eventos.js";
import Boton from "../../components/Boton.jsx";
import Campo from "../../components/Campo.jsx";
import { Cargando, MensajeError } from "../../components/Estados.jsx";
import Icono from "../../components/Icono.jsx";
import { useNavegacion } from "../../context/NavegacionContext.jsx";
import { useTitulo } from "../../hooks/useTitulo.js";
import { hoyIso } from "../../utils/formatos.js";
import { rutaPublica } from "../../utils/rutas.js";
import { eventosAdmin, useDatosAdmin } from "./useDatosAdmin.js";
import "./AdminPages.css";

const CATEGORIAS = ["Música", "Teatro", "Deportes", "Comedia", "Charlas", "Familia"];
const ESTADOS = [
  { valor: "disponible", etiqueta: "Publicado" },
  { valor: "pocos", etiqueta: "Últimos boletos" },
  { valor: "agotado", etiqueta: "Agotado" },
  { valor: "cancelado", etiqueta: "Cancelado" },
  { valor: "borrador", etiqueta: "Borrador" }
];
const IMAGENES = [...new Set(eventosBase.map((evento) => evento.imagen))].map((imagen) => ({
  valor: imagen,
  etiqueta: eventosBase.find((evento) => evento.imagen === imagen).nombre
}));
const DESCRIPCION_ZONA = { VIP: "Incluye asiento numerado", Preferencial: "Asiento numerado", General: "Entrada libre" };
const MAXIMO_LOCALIDADES = 5;

let siguienteClave = 1;
function nuevaLocalidad(nombre = "", precio = "", capacidad = ""){
  return { clave: `n${siguienteClave++}`, nombre, precio, capacidad };
}

const LOCALIDADES_INICIALES = [
  nuevaLocalidad("VIP", "", ""),
  nuevaLocalidad("Preferencial", "", ""),
  nuevaLocalidad("General", "", "")
];

// La misma pantalla sirve para crear y para editar; al editar se elige el evento arriba.
export default function EventoFormPage(){
  const { id, editar } = useNavegacion().vista.params;
  const editando = Boolean(id || editar);
  useTitulo(editando ? "Editar evento" : "Crear evento");

  if (!editando) return <FormularioEvento />;
  return <EdicionEvento id={id} />;
}

function EdicionEvento({ id }){
  const { ir } = useNavegacion();
  const { estado, datos, error, reintentar } = useDatosAdmin();
  if (estado === "cargando") return <Cargando texto="Cargando evento…" />;
  if (estado === "error") return <MensajeError mensaje={error} onReintentar={reintentar} />;

  const eventos = eventosAdmin(datos.eventos);
  const evento = datos.eventos.find((e) => e.id === Number(id)) || eventos[0];
  const opciones = [...new Map([evento, ...eventos].map((e) => [e.id, { valor: String(e.id), etiqueta: e.nombre }])).values()];

  return (
    <FormularioEvento key={evento.id} evento={evento}>
      <Campo
        className="form-evento__selector"
        etiqueta="Evento a editar"
        como="select"
        value={String(evento.id)}
        onChange={(e) => ir("admin-evento", { id: Number(e.target.value) })}
        opciones={opciones}
      />
    </FormularioEvento>
  );
}

function FormularioEvento({ evento, children }){
  const { ir } = useNavegacion();
  const editando = Boolean(evento);
  const [datos, setDatos] = useState({
    nombre: evento?.nombre || "",
    categoria: evento?.categoria || "Música",
    lugar: evento?.lugar || "",
    fecha: evento?.fecha || "",
    hora: evento?.hora || "20:00",
    descripcion: evento?.descripcion || "",
    imagen: evento?.imagen || IMAGENES[0].valor,
    estado: evento?.estado || "disponible"
  });
  const [localidades, setLocalidades] = useState(
    evento
      ? [...evento.zonas].reverse().map((z) => ({ ...nuevaLocalidad(z.nombre, String(z.precio), String(z.capacidad)), original: z }))
      : LOCALIDADES_INICIALES
  );
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [guardando, setGuardando] = useState("");

  const capacidadTotal = localidades.reduce((suma, l) => suma + (Number(l.capacidad) || 0), 0);

  function cambiar(e){
    setDatos({ ...datos, [e.target.name]: e.target.value });
    if (errores[e.target.name]) setErrores({ ...errores, [e.target.name]: undefined });
  }

  function cambiarLocalidad(clave, campo, valor){
    setLocalidades(localidades.map((l) => (l.clave === clave ? { ...l, [campo]: valor } : l)));
  }

  function validar(publicar){
    const nuevos = {};
    if (datos.nombre.trim().length < 3) nuevos.nombre = "Escribe un nombre de al menos 3 caracteres.";
    if (!datos.lugar.trim()) nuevos.lugar = "Indica el lugar del evento.";
    if (!datos.fecha) nuevos.fecha = "Elige la fecha.";
    else if (publicar && !editando && datos.fecha < hoyIso()) nuevos.fecha = "La fecha no puede estar en el pasado.";
    if (!datos.hora) nuevos.hora = "Elige la hora.";
    if (datos.descripcion.trim().length < 10) nuevos.descripcion = "Agrega una descripción breve (mínimo 10 caracteres).";

    const nombres = localidades.map((l) => l.nombre.trim().toLowerCase());
    const erroresLocalidad = [];
    localidades.forEach((l, i) => {
      if (!l.nombre.trim()) erroresLocalidad.push(`Localidad ${i + 1}: escribe un nombre.`);
      else if (nombres.indexOf(l.nombre.trim().toLowerCase()) !== i) erroresLocalidad.push(`Localidad ${i + 1}: el nombre está repetido.`);
      if (!(Number(l.precio) > 0)) erroresLocalidad.push(`Localidad ${i + 1}: el precio debe ser mayor que 0.`);
      if (!Number.isInteger(Number(l.capacidad)) || Number(l.capacidad) < 1) erroresLocalidad.push(`Localidad ${i + 1}: los cupos deben ser un número entero mayor que 0.`);
    });
    if (erroresLocalidad.length) nuevos.localidades = erroresLocalidad;
    return nuevos;
  }

  async function guardar(estadoDestino){
    if (guardando) return;
    const publicar = estadoDestino !== "borrador";
    const nuevos = validar(publicar);
    setErrores(nuevos);
    setErrorGeneral("");
    if (Object.keys(nuevos).length){
      setErrorGeneral("Revisa los campos marcados antes de continuar.");
      return;
    }

    setGuardando(estadoDestino);
    const zonas = [...localidades].reverse().map((l, i) => {
      const capacidad = Number(l.capacidad);
      const vendidos = l.original ? l.original.capacidad - l.original.disponibles : 0;
      return {
        id: l.original?.id ?? i + 1,
        nombre: l.nombre.trim(),
        descripcion: DESCRIPCION_ZONA[l.nombre.trim()] || "Entrada con boleto",
        precio: Number(l.precio),
        capacidad,
        disponibles: Math.max(0, capacidad - vendidos),
        numerada: l.nombre.trim() !== "General"
      };
    });
    const ids = zonas.map((z) => z.id);
    const zonasConId = zonas.map((z, i) => (ids.indexOf(z.id) !== i ? { ...z, id: Math.max(...ids) + i + 1 } : z));

    try {
      const guardado = await guardarEvento({
        ...evento,
        ...datos,
        nombre: datos.nombre.trim(),
        lugar: datos.lugar.trim(),
        descripcion: datos.descripcion.trim(),
        estado: estadoDestino,
        zonas: zonasConId
      });
      ir("admin-eventos", {
        mensaje: estadoDestino === "borrador" ? `"${guardado.nombre}" se guardó como borrador.` : `"${guardado.nombre}" se guardó y está publicado.`
      });
    } catch (error){
      setErrorGeneral(error.message);
      setGuardando("");
    }
  }

  return (
    <form className="form-evento" noValidate onSubmit={(e) => { e.preventDefault(); guardar(editando ? datos.estado : "disponible"); }}>
      <div className="admin-cabecera">
        <div>
          <h1>{editando ? "Editar Evento" : "Crear Evento"}</h1>
          <p>{editando ? "Actualiza la información, fechas y precios del evento" : "Completa la información para publicar un nuevo evento"}</p>
        </div>
        <div className="acciones">
          {!editando && (
            <Boton variante="suave" className="boton--pildora" onClick={() => guardar("borrador")} cargando={guardando === "borrador"} disabled={Boolean(guardando)}>
              Guardar borrador
            </Boton>
          )}
          <Boton type="submit" className="boton--pildora" cargando={Boolean(guardando) && guardando !== "borrador"} disabled={Boolean(guardando)}>
            {editando ? "Guardar cambios" : "Publicar evento"}
          </Boton>
        </div>
      </div>

      {children}
      {errorGeneral && <MensajeError compacto titulo="No se pudo guardar" mensaje={errorGeneral} />}

      <section className="tarjeta form-evento__seccion" aria-labelledby="titulo-general">
        <h2 id="titulo-general">Información General</h2>
        <div className="form-evento__general">
          <div className="form-evento__campos">
            <Campo className="form-evento__ancho" etiqueta="Nombre del evento" name="nombre" value={datos.nombre} onChange={cambiar} error={errores.nombre} placeholder="Ej. Gira Acústica 2027" required />
            <Campo etiqueta="Categoría" como="select" name="categoria" value={datos.categoria} onChange={cambiar} opciones={CATEGORIAS.map((c) => ({ valor: c, etiqueta: c }))} />
            <Campo etiqueta="Lugar" name="lugar" value={datos.lugar} onChange={cambiar} error={errores.lugar} placeholder="Ej. Estadio Cuscatlán" required />
            <div className="form-evento__fecha">
              <Campo etiqueta="Fecha" type="date" name="fecha" value={datos.fecha} onChange={cambiar} error={errores.fecha} required />
              <Campo etiqueta="Hora" type="time" name="hora" value={datos.hora} onChange={cambiar} error={errores.hora} required />
            </div>
            {editando
              ? <Campo etiqueta="Estado" como="select" name="estado" value={datos.estado} onChange={cambiar} opciones={ESTADOS} />
              : <Campo etiqueta="Capacidad" value={capacidadTotal} readOnly />}
            <Campo className="form-evento__ancho" etiqueta="Descripción" como="textarea" name="descripcion" value={datos.descripcion} onChange={cambiar} error={errores.descripcion} required />
          </div>
          <div className="form-evento__vista">
            <img src={rutaPublica(datos.imagen)} alt="Vista previa de la imagen del evento" />
            <Campo etiqueta="Imagen del evento" como="select" name="imagen" value={datos.imagen} onChange={cambiar} opciones={IMAGENES} />
          </div>
        </div>
      </section>

      <section className="tarjeta form-evento__seccion" aria-labelledby="titulo-localidades">
        <div className="admin-grafico__cabecera">
          <h2 id="titulo-localidades">Precios y Localidades</h2>
          <Boton
            variante="suave"
            tamano="pequeno"
            onClick={() => setLocalidades([...localidades, nuevaLocalidad()])}
            disabled={localidades.length >= MAXIMO_LOCALIDADES}
          >
            + Agregar localidad
          </Boton>
        </div>
        <div className="localidades">
          <div className="localidades__tabla" role="group" aria-label="Localidades del evento">
            <div className="localidades__fila localidades__encabezado" aria-hidden="true">
              <span>Localidad</span><span>Precio ($)</span><span>Cupos</span><span />
            </div>
            {localidades.map((l, i) => (
              <div className="localidades__fila" key={l.clave}>
                <input aria-label={`Nombre de la localidad ${i + 1}`} value={l.nombre} onChange={(e) => cambiarLocalidad(l.clave, "nombre", e.target.value)} aria-invalid={errores.localidades && !l.nombre.trim() ? true : undefined} />
                <input aria-label={`Precio de la localidad ${i + 1}`} type="number" min="1" step="0.01" inputMode="decimal" value={l.precio} onChange={(e) => cambiarLocalidad(l.clave, "precio", e.target.value)} aria-invalid={errores.localidades && !(Number(l.precio) > 0) ? true : undefined} />
                <input aria-label={`Cupos de la localidad ${i + 1}`} type="number" min="1" step="1" inputMode="numeric" value={l.capacidad} onChange={(e) => cambiarLocalidad(l.clave, "capacidad", e.target.value)} aria-invalid={errores.localidades && !(Number(l.capacidad) >= 1) ? true : undefined} />
                <button
                  type="button"
                  className="localidades__quitar"
                  onClick={() => setLocalidades(localidades.filter((x) => x.clave !== l.clave))}
                  disabled={localidades.length === 1 || Boolean(l.original && l.original.capacidad !== l.original.disponibles)}
                  aria-label={`Quitar localidad ${l.nombre || i + 1}`}
                >
                  <Icono nombre="cerrar" tamano={16} />
                </button>
              </div>
            ))}
            {errores.localidades && (
              <ul className="localidades__errores" role="alert">
                {errores.localidades.map((texto) => <li key={texto}>{texto}</li>)}
              </ul>
            )}
          </div>
          <img className="localidades__mapa" src={rutaPublica("img/mapa-localidades.jpg")} alt="Mapa de localidades: escenario al frente, luego VIP, Preferencial y General" />
        </div>
      </section>
    </form>
  );
}
