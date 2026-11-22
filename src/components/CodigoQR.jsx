import { useEffect, useState } from "react";
import QRCode from "qrcode";
import "./CodigoQR.css";

// Genera el código QR en el navegador a partir del texto del boleto.
export default function CodigoQR({ valor, tamano = 120, descripcion }){
  const [imagen, setImagen] = useState("");

  useEffect(() => {
    let activo = true;
    QRCode.toDataURL(valor, { margin: 1, width: tamano * 2, color: { dark: "#242433", light: "#ffffff" } })
      .then((url) => {
        if (activo) setImagen(url);
      })
      .catch(() => {
        if (activo) setImagen("");
      });
    return () => {
      activo = false;
    };
  }, [valor, tamano]);

  return (
    <div className="codigo-qr" style={{ width: tamano + 16, height: tamano + 16 }}>
      {imagen
        ? <img src={imagen} width={tamano} height={tamano} alt={descripcion || `Código QR del boleto ${valor}`} />
        : <span className="codigo-qr__cargando" aria-hidden="true" />}
    </div>
  );
}
