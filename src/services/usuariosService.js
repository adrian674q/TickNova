import { usuarios } from "../data/usuarios.js";
import { simularPeticion } from "../utils/simularPeticion.js";

export async function iniciarSesion(correo, contrasena){
  const usuario = usuarios.find(
    (usuario) =>
      usuario.correo.toLowerCase() === correo.trim().toLowerCase() &&
      usuario.contrasena === contrasena
  );
  await simularPeticion(null, 800);

  if (!usuario){
    throw new Error("Correo o contraseña incorrectos.");
  }
  const usuarioSeguro = { ...usuario };
delete usuarioSeguro.contrasena;
  return usuarioSeguro;
}
