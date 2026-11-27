import { useState } from "react";
import { obtenerUsuarios } from "../../api/usuariosService.js";
import Avatar from "../../components/Avatar.jsx";
import Chips from "../../components/Chips.jsx";
import { Cargando, EstadoVacio, MensajeError } from "../../components/Estados.jsx";
import Insignia from "../../components/Insignia.jsx";
import TablaDatos from "../../components/TablaDatos.jsx";
import { usePeticion } from "../../hooks/usePeticion.js";
import { useTitulo } from "../../hooks/useTitulo.js";
import { ROLES } from "../../utils/estados.js";
import "./AdminPages.css";
const FILTROS = [
  { valor: "todos", etiqueta: "Todos los usuarios" },
  { valor: "managers", etiqueta: "Managers" },
  { valor: "cliente", etiqueta: "Clientes" }
];

function coincideFiltro(usuario, filtro){
  if (filtro === "todos") return true;
  if (filtro === "managers") return usuario.rol === "administrador";
  return usuario.rol === filtro;
}

const COLUMNAS = [
  {
    clave: "nombre",
    titulo: "Nombre",
    render: (u) => (
      <span className="usuario-celda">
        <Avatar nombre={u.nombre} />
        <span>{u.nombre}</span>
      </span>
    )
  },
  { clave: "rol", titulo: "Rol", render: (u) => ROLES[u.rol] },
  {
    clave: "estado",
    titulo: "Estado",
    render: (u) => <Insignia tono={u.estado === "inactivo" ? "neutro" : "exito"}>{u.estado === "inactivo" ? "Inactivo" : "Activo"}</Insignia>
  }
];

export default function UsuariosPage(){
  useTitulo("Usuarios");
  const [filtro, setFiltro] = useState("todos");
  const { estado, datos, error, reintentar } = usePeticion((signal) => obtenerUsuarios({ signal }), []);
  const usuarios = (datos || []).filter((u) => coincideFiltro(u, filtro));

  return (
    <>
      <div className="admin-cabecera">
        <div>
          <h1>Usuarios</h1>
          <p>Administrador de usuarios</p>
        </div>
      </div>
      <div className="admin-filtros">
        <Chips etiqueta="Filtrar por rol" opciones={FILTROS} valor={filtro} onCambiar={setFiltro} oscuro />
      </div>
      {estado === "cargando" && <Cargando texto="Cargando usuarios…" />}
      {estado === "error" && <MensajeError mensaje={error} onReintentar={reintentar} />}
      {estado === "exito" && (usuarios.length
        ? <TablaDatos titulo="Usuarios registrados" columnas={COLUMNAS} filas={usuarios} tablaEnTablet />
        : <EstadoVacio titulo="No hay usuarios con este rol" />)}
    </>
  );
}
