import { useState } from "react";
import Avatar from "../components/Avatar.jsx";
import Boton from "../components/Boton.jsx";
import Campo from "../components/Campo.jsx";
import { MensajeError } from "../components/Estados.jsx";
import Insignia from "../components/Insignia.jsx";
import { useNavegacion } from "../context/NavegacionContext.jsx";
import { useSesion } from "../context/SesionContext.jsx";
import { useTitulo } from "../hooks/useTitulo.js";
import { ROLES } from "../utils/estados.js";
import "./PerfilPage.css";

export default function PerfilPage(){
  useTitulo("Mi perfil");
  const { ir } = useNavegacion();
  const { usuario, actualizarPerfil, cerrarSesion } = useSesion();
  const [nombre, setNombre] = useState(usuario.nombre);
  const [error, setError] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function guardar(evento){
    evento.preventDefault();
    if (guardando) return;
    if (nombre.trim().length < 3){
      setError("Escribe tu nombre completo.");
      return;
    }
    setError("");
    setErrorGeneral("");
    setMensaje("");
    setGuardando(true);
    try {
      await actualizarPerfil({ nombre });
      setMensaje("Tus datos se guardaron correctamente.");
    } catch (falla){
      setErrorGeneral(falla.message);
    } finally {
      setGuardando(false);
    }
  }

  function salir(){
    ir("inicio");
    cerrarSesion();
  }

  return (
    <div className="contenedor pagina perfil">
      <h1 className="pagina__titulo">Mi perfil</h1>
      <p className="pagina__subtitulo">Administra tus datos.</p>

      <div className="perfil__rejilla">
        <section className="tarjeta perfil__resumen" aria-label="Resumen de la cuenta">
          <Avatar nombre={usuario.nombre} tamano={72} />
          <p className="perfil__nombre">{usuario.nombre}</p>
          <p className="texto-suave">{usuario.correo}</p>
          <Insignia tono="lavanda">{ROLES[usuario.rol]}</Insignia>
          <Boton variante="secundario" tamano="pequeno" onClick={salir}>Cerrar sesión</Boton>
        </section>

        <div className="perfil__formularios">
          <form className="tarjeta perfil__formulario" noValidate onSubmit={guardar}>
            <h2>Datos personales</h2>
            {errorGeneral && <MensajeError compacto titulo="No se pudo guardar" mensaje={errorGeneral} />}
            {mensaje && <p className="perfil__exito" role="status">{mensaje}</p>}
            <Campo etiqueta="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} error={error} required />
            <Campo etiqueta="Correo electrónico" value={usuario.correo} readOnly ayuda="El correo no se puede cambiar." />
            <Boton type="submit" cargando={guardando}>{guardando ? "Guardando…" : "Guardar cambios"}</Boton>
          </form>
        </div>
      </div>
    </div>
  );
}
