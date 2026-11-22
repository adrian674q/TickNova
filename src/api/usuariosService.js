import { usuarios } from "../data/usuarios.js";
import { leer, guardar } from "../utils/almacenamiento.js";
import { simularPeticion } from "../utils/simularPeticion.js";
import { CORREO_VALIDO } from "../utils/validaciones.js";
import { CLAVES } from "./claves.js";

function listaCompleta(){
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
  const usuario = listaCompleta().find(
    (usuario) =>
      usuario.correo.toLowerCase() === correo.trim().toLowerCase() &&
      usuario.contrasena === contrasena
  );
  await simularPeticion(null, 800);

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
  await simularPeticion(null, 900);

  const lista = listaCompleta();
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
  await simularPeticion(null, 900);
  return "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.";
}

export async function actualizarPerfil(id, { nombre }){
  if (!nombre || nombre.trim().length < 3){
    throw new Error("Escribe tu nombre completo.");
  }
  await simularPeticion(null, 700);

  const usuario = listaCompleta().find((usuario) => usuario.id === Number(id));
  if (!usuario){
    throw new Error("No se encontró el usuario.");
  }
  const actualizado = { ...usuario, nombre: nombre.trim() };
  const restantes = leer(CLAVES.usuarios, []).filter((guardado) => guardado.id !== usuario.id);
  guardar(CLAVES.usuarios, [...restantes, actualizado]);
  return sinContrasena(actualizado);
}

export function obtenerUsuarios(){
  return simularPeticion(listaCompleta().map(sinContrasena), 800);
}
