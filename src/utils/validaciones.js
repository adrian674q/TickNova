export const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function formatearNumeroTarjeta(valor){
  return valor.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatearVencimiento(valor){
  const digitos = valor.replace(/\D/g, "").slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos;
}

export function validarPago(datos, hoy = new Date()){
  const errores = {};
  if (datos.nombre.trim().length < 3){
    errores.nombre = "Escribe el nombre como aparece en la tarjeta.";
  }
  if (datos.numero.replace(/\s/g, "").length !== 16){
    errores.numero = "El número de tarjeta debe tener 16 dígitos.";
  }
  const [mes, anio] = datos.vence.split("/").map(Number);
  if (!mes || !anio || mes < 1 || mes > 12){
    errores.vence = "Usa el formato MM/AA.";
  } else {
    const vencimiento = new Date(2000 + anio, mes, 0, 23, 59);
    if (vencimiento < hoy) errores.vence = "La tarjeta está vencida.";
  }
  if (!/^\d{3,4}$/.test(datos.cvv)){
    errores.cvv = "El CVV tiene 3 o 4 dígitos.";
  }
  return errores;
}
