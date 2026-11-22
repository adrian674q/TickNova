import { useState } from "react";
import Boton from "../components/Boton.jsx";
import Campo from "../components/Campo.jsx";
import Enlace from "../components/Enlace.jsx";
import { MensajeError } from "../components/Estados.jsx";
import { useNavegacion } from "../context/NavegacionContext.jsx";
import { usePreferencias } from "../context/PreferenciasContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { useTitulo } from "../hooks/useTitulo.js";
import { CORREO_VALIDO } from "../utils/validaciones.js";

// Al iniciar sesión, App abre la vista que corresponde (la pedida o la del rol).
export default function IngresarPage(){
  const { vista } = useNavegacion();
  const [modo, setModo] = useState(vista.params.modo === "registro" ? "registro" : "ingreso");
  useTitulo(modo === "registro" ? "Crear cuenta" : "Ingresar");

  return (
    <div className="auth-formulario">
      <div>
        <h1 className="auth-formulario__titulo">
          {modo === "registro" ? "Crea tu cuenta" : <>Bienvenido<span className="auth-formulario__extra"> de nuevo</span></>}
        </h1>
        <p className="texto-suave">
          {modo === "registro" ? "Regístrate para comprar tus boletos" : "Ingresa a tu cuenta para continuar"}
        </p>
      </div>
      <div className="auth-pestanas" role="tablist" aria-label="Tipo de acceso">
        <button
          type="button"
          role="tab"
          id="pestana-ingreso"
          aria-selected={modo === "ingreso"}
          aria-controls="panel-acceso"
          onClick={() => setModo("ingreso")}
        >
          Ingresar
        </button>
        <button
          type="button"
          role="tab"
          id="pestana-registro"
          aria-selected={modo === "registro"}
          aria-controls="panel-acceso"
          onClick={() => setModo("registro")}
        >
          Crear cuenta
        </button>
      </div>
      <div role="tabpanel" id="panel-acceso" aria-labelledby={modo === "registro" ? "pestana-registro" : "pestana-ingreso"}>
        {modo === "registro" ? <FormularioRegistro /> : <FormularioIngreso />}
      </div>
    </div>
  );
}

function FormularioIngreso(){
  const { iniciarSesion } = useSesion();
  const { preferencias, cambiarPreferencia } = usePreferencias();
  const [datos, setDatos] = useState({
    correo: preferencias.correoRecordado,
    contrasena: "",
    recordar: Boolean(preferencias.correoRecordado)
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cambiar(evento){
    const { name, value, type, checked } = evento.target;
    setDatos({ ...datos, [name]: type === "checkbox" ? checked : value });
  }

  async function enviar(evento){
    evento.preventDefault();
    if (enviando) return;
    const nuevos = {};
    if (!CORREO_VALIDO.test(datos.correo)) nuevos.correo = "Escribe un correo electrónico válido.";
    if (!datos.contrasena) nuevos.contrasena = "Escribe tu contraseña.";
    setErrores(nuevos);
    setErrorGeneral("");
    if (Object.keys(nuevos).length) return;

    setEnviando(true);
    try {
      await iniciarSesion(datos.correo, datos.contrasena);
      cambiarPreferencia("correoRecordado", datos.recordar ? datos.correo.trim() : "");
    } catch (error){
      setErrorGeneral(error.message);
      setEnviando(false);
    }
  }

  return (
    <form className="auth-formulario__campos" noValidate onSubmit={enviar}>
      {errorGeneral && <MensajeError compacto titulo="No pudimos continuar" mensaje={errorGeneral} />}
      <Campo etiqueta="Correo electrónico" type="email" name="correo" autoComplete="email" value={datos.correo} onChange={cambiar} error={errores.correo} required />
      <Campo etiqueta="Contraseña" type="password" name="contrasena" autoComplete="current-password" value={datos.contrasena} onChange={cambiar} error={errores.contrasena} required />
      <div className="auth-formulario__opciones">
        <label>
          <input type="checkbox" name="recordar" checked={datos.recordar} onChange={cambiar} />
          Recuérdame
        </label>
        <Enlace className="auth-enlace" vista="recuperar">¿Olvidaste tu contraseña?</Enlace>
      </div>
      <Boton type="submit" ancho cargando={enviando}>{enviando ? "Ingresando…" : "Ingresar"}</Boton>
    </form>
  );
}

function FormularioRegistro(){
  const { registrar } = useSesion();
  const [datos, setDatos] = useState({ nombre: "", correo: "", contrasena: "", confirmar: "" });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function cambiar(evento){
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento){
    evento.preventDefault();
    if (enviando) return;
    const nuevos = {};
    if (datos.nombre.trim().length < 3) nuevos.nombre = "Escribe tu nombre completo.";
    if (!CORREO_VALIDO.test(datos.correo)) nuevos.correo = "Escribe un correo electrónico válido.";
    if (datos.contrasena.length < 8) nuevos.contrasena = "Usa al menos 8 caracteres.";
    if (datos.confirmar !== datos.contrasena) nuevos.confirmar = "Las contraseñas no coinciden.";
    setErrores(nuevos);
    setErrorGeneral("");
    if (Object.keys(nuevos).length) return;

    setEnviando(true);
    try {
      await registrar(datos);
    } catch (error){
      setErrorGeneral(error.message);
      setEnviando(false);
    }
  }

  return (
    <form className="auth-formulario__campos" noValidate onSubmit={enviar}>
      {errorGeneral && <MensajeError compacto titulo="No pudimos continuar" mensaje={errorGeneral} />}
      <Campo etiqueta="Nombre completo" name="nombre" autoComplete="name" value={datos.nombre} onChange={cambiar} error={errores.nombre} required />
      <Campo etiqueta="Correo electrónico" type="email" name="correo" autoComplete="email" value={datos.correo} onChange={cambiar} error={errores.correo} required />
      <Campo etiqueta="Contraseña" type="password" name="contrasena" autoComplete="new-password" ayuda="Mínimo 8 caracteres." value={datos.contrasena} onChange={cambiar} error={errores.contrasena} required />
      <Campo etiqueta="Confirmar contraseña" type="password" name="confirmar" autoComplete="new-password" value={datos.confirmar} onChange={cambiar} error={errores.confirmar} required />
      <Boton type="submit" ancho cargando={enviando}>{enviando ? "Creando cuenta…" : "Crear cuenta"}</Boton>
    </form>
  );
}
