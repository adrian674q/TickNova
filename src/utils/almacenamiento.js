export function leer(clave, valorInicial = null) {
  try {
    const datos = localStorage.getItem(clave);
    if (datos === null){
      return valorInicial;
    }
    return JSON.parse(datos);
  } catch (error){
    console.error("Error al leer los datos:", error);
    return valorInicial;
  }
}
export function guardar(clave, valor){
  try{
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (error){
    console.error("Error al guardar los datos:", error);
    return false;
  }
}
export function eliminar(clave){
  try{
    localStorage.removeItem(clave);
    return true;
  } catch (error){
    console.error("Error al eliminar los datos:", error);
    return false;
  }
}