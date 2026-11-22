import QRCode from "qrcode";

export function nombreZona(nombre){
  return nombre === "General" ? "General" : `Zona ${nombre}`;
}

export function textoAsientos(orden, zona, conPalabra = false){
  const zonaTexto = nombreZona(zona?.nombre || "General");
  if (orden.asientos?.length){
    const palabra = conPalabra ? (orden.asientos.length === 1 ? "Asiento " : "Asientos ") : "";
    return `${zonaTexto} · ${palabra}${orden.asientos.join(", ")}`;
  }
  return `${zonaTexto} · ${orden.cantidad} ${orden.cantidad === 1 ? "boleto" : "boletos"}`;
}

export function descargarQR(valor, nombreArchivo){
  return QRCode.toDataURL(valor, { margin: 2, width: 600 }).then((url) => {
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombreArchivo;
    enlace.click();
  });
}
