// Resuelve las imágenes de public/ con la base de Vite (por ejemplo /TickNova/).
export function rutaPublica(ruta){
  if (!ruta) return "";
  if (/^(https?:|data:|blob:)/.test(ruta)) return ruta;
  return `${import.meta.env.BASE_URL}${ruta.replace(/^\//, "")}`;
}
