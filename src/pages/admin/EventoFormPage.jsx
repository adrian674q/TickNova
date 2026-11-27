import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { guardarEvento } from "../../api/eventosService.js";
import Boton from "../../components/Boton.jsx";
import Campo from "../../components/Campo.jsx";
import { Cargando, MensajeError } from "../../components/Estados.jsx";
import Icono from "../../components/Icono.jsx";
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
const DESCRIPCION_ZONA = { VIP: "Incluye asiento numerado", Preferencial: "Asiento numerado", General: "Entrada libre" };
const MAXIMO_LOCALIDADES = 5;

// Cada fila de la tabla de localidades tiene una clave única para que React no mezcle las filas.
let siguienteClave = 1;
function nuevaLocalidad(nombre = "", precio = "", capacidad = "", original = null){
  return { clave: `n${siguienteClave++}`, nombre, precio, capacidad, original };
}

// Una zona que ya existía y tiene boletos vendidos no se puede quitar.
function tieneVentas(localidad){
  return Boolean(localidad.original && localidad.original.disponibles < localidad.original.capacidad);
}

// Opciones del selector de imagen: las fotos que ya usan los eventos, sin repetir.
function opcionesImagen(eventos){
  return [...new Set(eventos.map((evento) => evento.imagen))].map((imagen) => ({
    valor: imagen,
    etiqueta: eventos.find((evento) => evento.imagen === imagen).nombre
  }));
}

// Revisa el formulario y devuelve los errores encontrados (vacío si todo está bien).
function validarFormulario(datos, localidades, revisarFechaPasada){
  const errores = {};
  if (datos.nombre.trim().length < 3) errores.nombre = "Escribe un nombre de al menos 3 caracteres.";
  if (!datos.lugar.trim()) errores.lugar = "Indica el lugar del evento.";
  if (!datos.fecha) errores.fecha = "Elige la fecha.";
  else if (revisarFechaPasada && datos.fecha < hoyIso()) errores.fecha = "La fecha no puede estar en el pasado.";
  if (!datos.hora) errores.hora = "Elige la hora.";
  if (datos.descripcion.trim().length < 10) errores.descripcion = "Agrega una descripción breve (mínimo 10 caracteres).";

  const problemas = [];
  const nombresVistos = [];
  localidades.forEach((l, i) => {
    const numero = i + 1;
    const nombre = l.nombre.trim().toLowerCase();
    if (!nombre) problemas.push(`Localidad ${numero}: escribe un nombre.`);
    else if (nombresVistos.includes(nombre)) problemas.push(`Localidad ${numero}: el nombre está repetido.`);
    nombresVistos.push(nombre);
    if (!(Number(l.precio) > 0)) problemas.push(`Localidad ${numero}: el precio debe ser mayor que 0.`);
    if (!Number.isInteger(Number(l.capacidad)) || Number(l.capacidad) < 1) problemas.push(`Localidad ${numero}: los cupos deben ser un número entero mayor que 0.`);
  });
  if (problemas.length) errores.localidades = problemas;
  return errores;
}

// Convierte las filas del formulario en las zonas que se guardan en el evento.
// En pantalla van de VIP a General; en los datos se guardan al revés (General primero).
function aZonas(localidades){
  let siguienteId = Math.max(0, ...localidades.map((l) => l.original?.id || 0)) + 1;
  return [...localidades].reverse().map((l) => {
    const nombre = l.nombre.trim();
    const capacidad = Number(l.capacidad);
    // Si la zona ya existía, conserva su id y se descuentan los boletos que ya se vendieron.
    const vendidos = l.original ? l.original.capacidad - l.original.disponibles : 0;
    return {
      id: l.original ? l.original.id : siguienteId++,
      nombre,
      descripcion: DESCRIPCION_ZONA[nombre] || "Entrada con boleto",
      precio: Number(l.precio),
      capacidad,
      disponibles: Math.max(0, capacidad - vendidos),
      numerada: nombre !== "General"
    };
  });
}

// La misma pantalla sirve para crear (/admin/eventos/nuevo) y para editar (/admin/eventos/:id/editar).
export default function EventoFormPage(){
  const { id } = useParams();
  const navegar = useNavigate();
  useTitulo(id ? "Editar evento" : "Crear evento");
  const { estado, datos, error, reintentar } = useDatosAdmin();

  if (estado === "cargando") return <Cargando texto="Cargando evento…" />;
  if (estado === "error") return <MensajeError mensaje={error} onReintentar={reintentar} />;

  const imagenes = opcionesImagen(datos.todos);
  // Sin id en la ruta: formulario vacío para crear.
  if (!id) return <FormularioEvento imagenes={imagenes} />;

  const evento = datos.eventos.find((e) => e.id === Number(id));
  if (!evento) return <MensajeError mensaje="No se encontró el evento solicitado." />;

  // Selector "Evento a editar": los eventos del organizador (y el actual, si no está entre ellos).
  const delOrganizador = eventosAdmin(datos.eventos);
  const lista = delOrganizador.some((e) => e.id === evento.id) ? delOrganizador : [evento, ...delOrganizador];
  const opciones = lista.map((e) => ({ valor: String(e.id), etiqueta: e.nombre }));

  return (
    <FormularioEvento key={evento.id} evento={evento} imagenes={imagenes}>
      <Campo
        className="form-evento__selector"
        etiqueta="Evento a editar"
        como="select"
        value={String(evento.id)}
        onChange={(e) => navegar(`/admin/eventos/${e.target.value}/editar`)}
        opciones={opciones}
      />
    </FormularioEvento>
  );
}

function FormularioEvento({ evento, imagenes, children }){
  const navegar = useNavigate();
  const editando = Boolean(evento);
  const [datos, setDatos] = useState({
    nombre: evento?.nombre || "",
    categoria: evento?.categoria || "Música",
    lugar: evento?.lugar || "",
    fecha: evento?.fecha || "",
    hora: evento?.hora || "20:00",
    descripcion: evento?.descripcion || "",
    imagen: evento?.imagen || imagenes[0].valor,
    estado: evento?.estado || "disponible"
  });
  // Al editar, cada fila recuerda su zona original; al crear, empiezan VIP, Preferencial y General vacías.
  const [localidades, setLocalidades] = useState(
    evento
      ? [...evento.zonas].reverse().map((z) => nuevaLocalidad(z.nombre, String(z.precio), String(z.capacidad), z))
      : [nuevaLocalidad("VIP"), nuevaLocalidad("Preferencial"), nuevaLocalidad("General")]
  );
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  // Qué botón se presionó: "borrador", "publicar" o "" (ninguno).
  const [guardando, setGuardando] = useState("");

  const capacidadTotal = localidades.reduce((suma, l) => suma + (Number(l.capacidad) || 0), 0);

  function cambiar(e){
    setDatos({ ...datos, [e.target.name]: e.target.value });
    if (errores[e.target.name]) setErrores({ ...errores, [e.target.name]: undefined });
  }

  function cambiarLocalidad(clave, campo, valor){
    setLocalidades(localidades.map((l) => (l.clave === clave ? { ...l, [campo]: valor } : l)));
  }

  async function guardar(estadoDestino){
    if (guardando) return;
    const esBorrador = estadoDestino === "borrador";
    // Al publicar un evento nuevo, la fecha no puede ser pasada.
    const nuevos = validarFormulario(datos, localidades, !esBorrador && !editando);
    setErrores(nuevos);
    setErrorGeneral("");
    if (Object.keys(nuevos).length){
      setErrorGeneral("Revisa los campos marcados antes de continuar.");
      return;
    }

    setGuardando(esBorrador ? "borrador" : "publicar");
    try {
      const guardado = await guardarEvento({
        ...evento,
        ...datos,
        nombre: datos.nombre.trim(),
        lugar: datos.lugar.trim(),
        descripcion: datos.descripcion.trim(),
        estado: estadoDestino,
        zonas: aZonas(localidades)
      });
      // Vuelve a la lista con un mensaje para mostrar arriba.
      const mensaje = esBorrador ? `"${guardado.nombre}" se guardó como borrador.` : `"${guardado.nombre}" se guardó y está publicado.`;
      navegar("/admin/eventos", { state: { mensaje } });
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
          <Boton type="submit" className="boton--pildora" cargando={guardando === "publicar"} disabled={Boolean(guardando)}>
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
            <Campo etiqueta="Imagen del evento" como="select" name="imagen" value={datos.imagen} onChange={cambiar} opciones={imagenes} />
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
                  disabled={localidades.length === 1 || tieneVentas(l)}
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
