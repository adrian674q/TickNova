import { useState } from "react";
import { Link } from "react-router";
import { recuperarContrasena } from "../api/usuariosService.js";
import Boton from "../components/Boton.jsx";
import Campo from "../components/Campo.jsx";
import { MensajeError } from "../components/Estados.jsx";
import { useTitulo } from "../hooks/useTitulo.js";
import { CORREO_VALIDO } from "../utils/validaciones.js";

export default function RecuperarPage(){
  useTitulo("Recuperar contraseña");
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento){
    evento.preventDefault();
    if (enviando) return;
    if (!CORREO_VALIDO.test(correo)){
      setError("Escribe un correo electrónico válido.");
      return;
    }
    setError("");
    setErrorGeneral("");
    setEnviando(true);
    try {
      setMensaje(await recuperarContrasena(correo));
    } catch (falla){
      setErrorGeneral(falla.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="auth-formulario" noValidate onSubmit={enviar}>
      <div>
        <h1 className="auth-formulario__titulo">Recupera tu contraseña</h1>
        <p className="texto-suave">Te enviaremos un enlace para crear una nueva (simulado).</p>
      </div>
      {errorGeneral && <MensajeError compacto titulo="No se pudo enviar" mensaje={errorGeneral} />}
      {mensaje && <p className="auth-exito" role="status">{mensaje}</p>}
      <Campo
        etiqueta="Correo electrónico"
        type="email"
        autoComplete="email"
        value={correo}
        onChange={(evento) => setCorreo(evento.target.value)}
        error={error}
        required
      />
      <Boton type="submit" ancho cargando={enviando}>{enviando ? "Enviando…" : "Enviar enlace"}</Boton>
      <Link className="auth-enlace" to="/ingresar">Volver a ingresar</Link>
    </form>
  );
}
