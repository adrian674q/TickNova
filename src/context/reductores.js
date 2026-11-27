// Reducers del estado global. Cada uno recibe el estado actual y una acción { type, ... }
// y devuelve el estado nuevo sin modificar el anterior.

export function sesionReducer(usuario, accion){
  switch (accion.type){
    case "INICIAR_SESION":
    case "ACTUALIZAR_PERFIL":
      return accion.usuario;
    case "CERRAR_SESION":
      return null;
    default:
      return usuario;
  }
}

export function carritoReducer(items, accion){
  switch (accion.type){
    case "AGREGAR": {
      // Las entradas generales de la misma zona se acumulan en un solo item.
      let resultado = items;
      for (const nuevo of accion.items){
        const id = `${nuevo.eventoId}-${nuevo.zonaId}-${nuevo.asiento || "general"}`;
        const existente = resultado.find((item) => item.id === id);
        if (existente){
          // Ya estaba: se suma la cantidad, sin pasar de los boletos disponibles.
          const cantidad = Math.min(existente.cantidad + nuevo.cantidad, nuevo.maximo);
          resultado = resultado.map((item) => (item.id === id ? { ...item, cantidad } : item));
        } else {
          // Es nuevo: se agrega al final.
          resultado = [...resultado, { ...nuevo, id }];
        }
      }
      return resultado;
    }
    case "QUITAR":
      return items.filter((item) => item.id !== accion.id);
    case "VACIAR":
      return [];
    default:
      return items;
  }
}

export function preferenciasReducer(preferencias, accion){
  switch (accion.type){
    case "CAMBIAR_PREFERENCIA":
      return { ...preferencias, [accion.clave]: accion.valor };
    default:
      return preferencias;
  }
}
