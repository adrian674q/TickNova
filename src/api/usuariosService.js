import { leer, guardar } from "../utils/almacenamiento.js";
import { CORREO_VALIDO } from "../utils/validaciones.js";
import { CLAVES } from "./claves.js";
import { esperarEscritura, leerRecurso } from "./cliente.js";

// Usuarios del JSON más las cuentas registradas o editadas en este navegador.
async function listaCompleta(opciones){
  const usuarios = await leerRecurso("usuarios", opciones);
  const guardados = leer(CLAVES.usuarios, []);
  const base = usuarios.map(
    (usuario) => guardados.find((guardado) => guardado.id === usuario.id) || usuario
  );
  const nuevos = guardados.filter(
    (guardado) => !usuarios.some((usuario) => usuario.id === guardado.id)
  );
  return [...base, ...nuevos];
}

function sinContrasena(usuario){
  const usuarioSeguro = { ...usuario };
  delete usuarioSeguro.contrasena;
  return usuarioSeguro;
}

export async function iniciarSesion(correo, contrasena){
  const lista = await listaCompleta({ demora: 800 });
  const usuario = lista.find(
    (item) =>
      item.correo.toLowerCase() === correo.trim().toLowerCase() &&
      item.contrasena === contrasena
  );

  if (!usuario){
    throw new Error("Correo o contraseña incorrectos.");
  }
  if (usuario.estado === "inactivo"){
    throw new Error("Esta cuenta está desactivada.");
  }
  return sinContrasena(usuario);
}

export async function registrarUsuario({ nombre, correo, contrasena }){
  if (!nombre || nombre.trim().length < 3){
    throw new Error("Escribe tu nombre completo.");
  }
  if (!CORREO_VALIDO.test(correo)){
    throw new Error("El correo electrónico no es válido.");
  }
  if (!contrasena || contrasena.length < 8){
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }
  const lista = await listaCompleta({ demora: 900 });
  const existe = lista.some(
    (usuario) => usuario.correo.toLowerCase() === correo.trim().toLowerCase()
  );
  if (existe){
    throw new Error("Ya existe una cuenta con ese correo.");
  }
  const nuevoUsuario = {
    id: Math.max(0, ...lista.map((usuario) => usuario.id)) + 1,
    nombre: nombre.trim(),
    correo: correo.trim().toLowerCase(),
    contrasena,
    rol: "cliente",
    estado: "activo"
  };
  guardar(CLAVES.usuarios, [...leer(CLAVES.usuarios, []), nuevoUsuario]);
  return sinContrasena(nuevoUsuario);
}

export async function recuperarContrasena(correo){
  if (!CORREO_VALIDO.test(correo)){
    throw new Error("El correo electrónico no es válido.");
  }
  await esperarEscritura(900);
  return "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.";
}

export async function actualizarPerfil(id, { nombre }){
  if (!nombre || nombre.trim().length < 3){
    throw new Error("Escribe tu nombre completo.");
  }
  const lista = await listaCompleta({ demora: 700 });
  const usuario = lista.find((item) => item.id === Number(id));
  if (!usuario){
    throw new Error("No se encontró el usuario.");
  }
  const actualizado = { ...usuario, nombre: nombre.trim() };
  const restantes = leer(CLAVES.usuarios, []).filter((guardado) => guardado.id !== usuario.id);
  guardar(CLAVES.usuarios, [...restantes, actualizado]);
  return sinContrasena(actualizado);
}

export async function obtenerUsuarios({ signal } = {}){
  const lista = await listaCompleta({ signal, demora: 800 });
  return lista.map(sinContrasena);
}
